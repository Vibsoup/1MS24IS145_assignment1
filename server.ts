import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient generateContent with retry and fallback for transient spikes
async function generateWithRetry(ai: GoogleGenAI, params: any, maxAttempts = 3): Promise<any> {
  const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const modelToUse = attempt < 2 ? candidateModels[0] : (candidateModels[attempt] || candidateModels[0]);
    try {
      const response = await ai.models.generateContent({
        ...params,
        model: modelToUse,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || '';
      const isTransient = errMsg.includes('503') || errMsg.includes('429') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE');
      if (isTransient && attempt < maxAttempts - 1) {
        // Wait 1.5s before next attempt
        await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

const FEW_SHOT_SYSTEM_PROMPT = `You are ResearchPilot, an authoritative, rigorous academic research planning agent and methodology consultant for students, doctoral candidates, and research scholars.

RELIABILITY & INTEGRITY PRINCIPLES:
1. Strict Factual Honesty: NEVER fabricate references, authors, publication dates, DOIs, or URLs.
2. Distinct Gap Attribution: Clearly distinguish SUGGESTED RESEARCH GAPS (open hypotheses / proposed vectors to investigate) from ESTABLISHED LITERATURE GAPS (proven deficiencies explicitly documented by reviewed papers).
3. Non-Fabricated Results: Do NOT invent experimental findings, benchmark numbers, or present proposed research as completed empirical results.
4. User vs Generated Sources: User-provided literature excerpts must be treated as the ground-truth text. If author, year, or DOI are absent in user input, mark them as "Unspecified in excerpt" rather than inventing them.
5. Suggesting Search Queries: When live web database access is unavailable, provide rigorous, precision academic queries (for Google Scholar, PubMed, arXiv, IEEE Xplore) and label unverified references explicitly.
6. Anti-Slop Academic Prose: Use precise academic English with clear terminology, appropriate to the requested discipline and research level, avoiding superficial buzzwords or empty filler.

FEW-SHOT EXAMPLES:

Example 1:
Input:
Topic: Plant disease detection using machine learning
Discipline: Computer Science
Research level: Undergraduate
Expected behavior:
Suggest a research question about evaluating machine-learning methods for plant disease classification under constrained conditions (e.g. leaf background variability, class imbalance). Propose objectives involving dataset selection (e.g., PlantVillage or field data), feature extraction/architecture evaluation, and standard evaluation metrics (F1-score, inference latency). Recommend targeted literature search queries. Do NOT claim that any particular model (e.g. ResNet vs ViT) is unilaterally superior without empirical evidence.

Example 2:
Input:
Topic: AI in healthcare
Research question: What are the limitations of machine-learning models used for early disease detection?
Expected behavior:
Generate an outline covering clinical validation standards, training data quality and demographic bias, algorithmic interpretability (e.g., saliency maps vs mechanistic models), regulatory frameworks, and out-of-distribution generalizability across clinical sites. Mark these explicitly as topics/open gaps to investigate rather than conclusions already established by a literature review.

Example 3:
Input:
A user supplies an excerpt from a research paper describing a dataset, model, and reported accuracy.
Expected behavior:
Summarize the methodology and reported accuracy strictly based on the excerpt. Identify limitations ONLY when explicitly supported by the excerpt or clearly label them as "Open questions for further investigation". Never invent the paper's title, authors, DOI, or publication year.`;

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
  });
});

// 2. Generate Research Plan
app.post('/api/plan', async (req: Request, res: Response) => {
  try {
    const { topic, discipline, researchLevel, preferredMethodology, researchQuestion, sourceMaterial } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Research topic is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `Formulate a comprehensive, rigorous academic research plan for the following project request:

[PROJECT SPECIFICATION]
Topic: ${topic.trim()}
Academic Discipline: ${discipline || 'Interdisciplinary'}
Research Level: ${researchLevel || 'Undergraduate'}
Preferred Methodology: ${preferredMethodology || 'Empirical / Experimental'}
User's Draft Research Question: ${researchQuestion ? researchQuestion.trim() : 'None provided; please formulate an optimal, refined question.'}
Context / Preliminary Source Notes: ${sourceMaterial ? sourceMaterial.trim() : 'None provided'}

Generate a structured JSON output with:
- refinedQuestion: A precise, academic, focused research question suitable for the level.
- questionRationale: Concise explanation of why this question is scientifically or academically valuable and feasible.
- objectives: An array of 3 to 5 clear, actionable, measurable research objectives (use active academic verbs: "Evaluate", "Quantify", "Formulate", "Synthesize").
- keywords: An array of 6 to 10 indexed academic keywords and MeSH/ACM-style terms.
- searchQueries: An array of 4 to 6 optimized search queries for Google Scholar, PubMed, IEEE Xplore, or arXiv, including Boolean operators and target database purpose.
- outline: An array of 5 to 7 sections for the research paper with sectionNumber, title, targetWordEstimate, focusAreas (array of bullet points), and notes.
- researchGaps: An array of 3 to 4 research gaps. For EACH gap, set gapType to either "suggested_hypothesis" (an area the student should investigate) or "established_literature" (a recognized limitation in prior work), and provide an explanation.
- recommendedMethodology: An object containing approach (name of method), rationale, keySteps (array of actionable sequential steps), and evaluationMetrics (array of metrics or validation criteria).`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: FEW_SHOT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedQuestion: { type: Type.STRING },
            questionRationale: { type: Type.STRING },
            objectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            searchQueries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  query: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  suggestedDatabase: { type: Type.STRING },
                },
                required: ['query', 'purpose', 'suggestedDatabase'],
              },
            },
            outline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionNumber: { type: Type.STRING },
                  title: { type: Type.STRING },
                  targetWordEstimate: { type: Type.STRING },
                  focusAreas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  notes: { type: Type.STRING },
                },
                required: ['sectionNumber', 'title', 'targetWordEstimate', 'focusAreas', 'notes'],
              },
            },
            researchGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  gap: { type: Type.STRING },
                  gapType: { type: Type.STRING, description: 'Must be "suggested_hypothesis" or "established_literature"' },
                  explanation: { type: Type.STRING },
                },
                required: ['gap', 'gapType', 'explanation'],
              },
            },
            recommendedMethodology: {
              type: Type.OBJECT,
              properties: {
                approach: { type: Type.STRING },
                rationale: { type: Type.STRING },
                keySteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                evaluationMetrics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['approach', 'rationale', 'keySteps', 'evaluationMetrics'],
            },
          },
          required: [
            'refinedQuestion',
            'questionRationale',
            'objectives',
            'keywords',
            'searchQueries',
            'outline',
            'researchGaps',
            'recommendedMethodology',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Model did not return text response.');
    }

    const parsed = JSON.parse(text);
    const result = {
      ...parsed,
      originalTopic: topic.trim(),
      discipline: discipline || 'Interdisciplinary',
      researchLevel: researchLevel || 'Undergraduate',
      createdAt: new Date().toISOString(),
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error generating research plan:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate research plan. Please check API key and try again.',
    });
  }
});

// 3. Literature Analysis (Individual paper / excerpt)
app.post('/api/analyze-literature', async (req: Request, res: Response) => {
  try {
    const { title, authors, year, venue, doi, rawText, researchQuestion, currentTopic } = req.body;

    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: 'Paper text or excerpt is required for analysis.' });
    }

    const ai = getGeminiClient();

    const prompt = `Analyze the following academic paper or literature excerpt with strict scientific rigor:

[SUPPLIED METADATA (DO NOT INVENT IF BLANK)]
Title: ${title ? title.trim() : 'Unspecified in excerpt'}
Authors: ${authors ? authors.trim() : 'Unspecified in excerpt'}
Year: ${year ? year.trim() : 'Unspecified'}
Venue/Journal: ${venue ? venue.trim() : 'Unspecified'}
DOI: ${doi ? doi.trim() : 'None provided'}

[CURRENT RESEARCH CONTEXT]
Research Topic: ${currentTopic || 'General academic inquiry'}
User's Research Question: ${researchQuestion || 'Not provided'}

[SUPPLIED PAPER TEXT / EXCERPT]
"""
${rawText.trim()}
"""

Provide a structured JSON extraction:
- summary: Concise 2-3 sentence academic summary of what this work did.
- objectives: What was the primary objective of this specific study as stated in the excerpt?
- methodology: Detailed breakdown of the dataset, architecture, experimental protocol, or analytical framework described.
- mainFindings: 2 to 4 bullet points of empirical findings, trends, or results stated in the text.
- reportedAccuracyOrMetrics: Exact metrics, benchmark percentages, or statistical significance reported in the excerpt (e.g. "Accuracy 94.2% on test split", or "Not reported in supplied excerpt"). DO NOT invent metrics.
- limitations: 2 to 4 limitations.
- limitationsType: Set to "excerpt_supported" if limitations are explicitly stated by authors in the text, or "suggested_inquiry" if they are critical evaluation questions based on the scope.
- relevanceToTopic: Detailed explanation of how this study informs the user's research topic and question (e.g., comparative baseline, methodological inspiration, or contrasting findings).
- verifiedMetadata: Boolean indicating true ONLY if title, authors, and year were explicitly identifiable in the text itself.`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: FEW_SHOT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            objectives: { type: Type.STRING },
            methodology: { type: Type.STRING },
            mainFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            reportedAccuracyOrMetrics: { type: Type.STRING },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            limitationsType: { type: Type.STRING, description: '"excerpt_supported" or "suggested_inquiry"' },
            relevanceToTopic: { type: Type.STRING },
            verifiedMetadata: { type: Type.BOOLEAN },
          },
          required: [
            'summary',
            'objectives',
            'methodology',
            'mainFindings',
            'reportedAccuracyOrMetrics',
            'limitations',
            'limitationsType',
            'relevanceToTopic',
            'verifiedMetadata',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Model did not return text response.');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing literature:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze literature excerpt.',
    });
  }
});

// 4. Generate Comprehensive Research Brief
app.post('/api/generate-brief', async (req: Request, res: Response) => {
  try {
    const { plan, literatureList } = req.body;

    if (!plan || !plan.originalTopic) {
      return res.status(400).json({ error: 'Valid research plan is required to generate brief.' });
    }

    const ai = getGeminiClient();

    const papersContext = (literatureList || []).map((p: any, idx: number) => {
      return `[Source #${idx + 1}]
Title: ${p.title || 'Untitled excerpt'}
Authors: ${p.authors || 'Unspecified'}
Year: ${p.year || 'n.d.'}
Venue: ${p.venue || 'N/A'}
Summary: ${p.analysis?.summary || p.rawText.substring(0, 300)}
Methodology: ${p.analysis?.methodology || 'N/A'}
Reported Findings / Metrics: ${p.analysis?.reportedAccuracyOrMetrics || (p.analysis?.mainFindings || []).join('; ') || 'N/A'}
Limitations: ${(p.analysis?.limitations || []).join('; ')}
Relevance: ${p.analysis?.relevanceToTopic || 'N/A'}
Verified: ${Boolean(p.analysis?.verifiedMetadata)}`;
    }).join('\n\n');

    const prompt = `Synthesize a formal, publishable Academic Research Brief for the following project:

[RESEARCH SPECIFICATION]
Topic: ${plan.originalTopic}
Discipline: ${plan.discipline}
Academic Level: ${plan.researchLevel}
Refined Research Question: ${plan.refinedQuestion}
Objectives:
${plan.objectives.map((o: string, i: number) => `${i + 1}. ${o}`).join('\n')}

Recommended Methodology:
Approach: ${plan.recommendedMethodology?.approach}
Rationale: ${plan.recommendedMethodology?.rationale}
Key Steps: ${(plan.recommendedMethodology?.keySteps || []).join('; ')}
Evaluation Criteria: ${(plan.recommendedMethodology?.evaluationMetrics || []).join('; ')}

Identified Gaps to Address:
${(plan.researchGaps || []).map((g: any) => `- [${g.gapType}] ${g.gap}: ${g.explanation}`).join('\n')}

[SUPPLIED LITERATURE SOURCES (${(literatureList || []).length} available)]:
${papersContext || 'No external literature excerpts supplied by user. Synthesize literature review based on the established state of the discipline, explicitly framing references as suggested queries to consult.'}

Generate a comprehensive 10-section Academic Research Brief in JSON format:
1. title: An authoritative, formal academic paper title.
2. abstract: A structured abstract (150-250 words) comprising Background, Problem, Proposed Method, and Anticipated Significance.
3. introduction: A thorough introduction covering the problem domain, theoretical or practical significance, and motivation.
4. researchQuestion: The precise formulated research question with scope delimitation.
5. researchObjectives: An array of 3 to 5 clear, actionable objectives.
6. literatureReview: A synthesized critical literature review. If user sources were supplied, explicitly cite them as [Source #1], etc. and synthesize their methodologies and reported findings. Explicitly highlight gaps. If no sources were supplied, outline the essential scholarly conversation and clearly label foundational literature searches to be conducted.
7. proposedMethodology: Detailed scientific methodology section specifying design, dataset/sampling strategy, operational variables, apparatus/tools, and evaluation metrics. Frame as PROPOSED methodology, not completed experiments.
8. expectedContributions: An array of 3 to 4 concrete academic and practical contributions.
9. limitations: An array of 3 to 4 anticipated methodological, scope, or ecological validity constraints.
10. references: An array of references. For each reference, include:
    - citation: Full bibliographic string (APA style).
    - sourceOrigin: "user_provided" if derived from user-supplied papers, or "suggested_search_query" if an unverified recommended search vector.
    - verified: true ONLY if the user provided verified publication details.
    - notes: Short annotation on how to retrieve or verify this work.`;

    const response = await generateWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: FEW_SHOT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            abstract: { type: Type.STRING },
            introduction: { type: Type.STRING },
            researchQuestion: { type: Type.STRING },
            researchObjectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            literatureReview: { type: Type.STRING },
            proposedMethodology: { type: Type.STRING },
            expectedContributions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            references: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  citation: { type: Type.STRING },
                  sourceOrigin: { type: Type.STRING, description: '"user_provided" or "suggested_search_query"' },
                  verified: { type: Type.BOOLEAN },
                  notes: { type: Type.STRING },
                },
                required: ['citation', 'sourceOrigin', 'verified'],
              },
            },
          },
          required: [
            'title',
            'abstract',
            'introduction',
            'researchQuestion',
            'researchObjectives',
            'literatureReview',
            'proposedMethodology',
            'expectedContributions',
            'limitations',
            'references',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Model did not return text response.');
    }

    const parsed = JSON.parse(text);
    const result = {
      ...parsed,
      generatedAt: new Date().toISOString(),
    };

    return res.json(result);
  } catch (error: any) {
    console.error('Error generating research brief:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate research brief.',
    });
  }
});

// Vite middleware / Static server setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResearchPilot server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
