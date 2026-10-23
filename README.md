# ResearchPilot: AI-Powered Academic Research Assistant

**ResearchPilot** is a web workspace engineered for students, doctoral candidates, and research scholars. It transforms initial research interests into rigorous, defensible academic plans, analyzes literature excerpts with strict factual integrity, and synthesizes 10-section formal research briefs ready for thesis proposals, grant applications, or manuscript drafts.

---

## 1. Core Architecture & Features

### A. Research Topic & Scope Formulation
- **Input Parameters:** Topic, academic discipline, target research level (Undergraduate, Master's, Doctoral / Ph.D., Postdoctoral), preferred methodology, and optional preliminary notes.
- **Formulation:** Formulates a testable research question with academic justification and feasibility rationale.
- **Preset Benchmarks:** One-click presets for immediate testing (Plant Disease Detection, Healthcare AI Limitations, Clinical NLP Extraction).

### B. Research Planning Agent
- **Measurable Objectives:** Clear, actionable objectives using standard academic taxonomy.
- **Indexed Keywords:** Indexed terminology for cross-database discovery (MeSH, ACM, IEEE).
- **Targeted Literature Search Queries:** Pre-configured query strings with Boolean operators for Google Scholar, PubMed, arXiv, and IEEE Xplore with direct search links.
- **Categorized Research Gaps:** Explicitly distinguishes **Suggested Hypotheses** (novel vectors for the student to investigate) from **Established Literature Gaps** (empirically confirmed blind spots documented in published work).
- **Methodological Protocol:** Proposed execution stages, apparatus/sampling requirements, and validation metrics.
- **Structured Manuscript Outline:** Section balances, target word allocations, and drafting notes.

### C. Literature Intake & Analysis
- **Factual Extraction:** Extracts concise summary, stated objectives, dataset/methodology, and reported numerical metrics strictly from user-provided excerpts.
- **Zero-Fabrication Guarantee:** Never invents titles, authors, DOIs, or publication dates if they are absent in the excerpt.
- **Limitation Tagging:** Labels limitations as **Explicitly Stated in Excerpt** vs. **Suggested Critical Inquiry**.
- **Relevance Mapping:** Articulates how each paper informs the specific inquiry.

### D. Literature Comparison Matrix
- Dynamic, side-by-side comparison table analyzing all reviewed papers across objectives, methodologies, empirical findings, and constraints.
- Identifies cross-study methodological consensus and divergence.

### E. 10-Section Research Brief Generator
Generates a formal, publication-ready research dossier:
1. Formal Academic Title
2. Structured Abstract (Background, Problem, Proposed Method, Significance)
3. Introduction & Background
4. Formulated Research Question
5. Measurable Research Objectives
6. Literature Review Based on Supplied Sources
7. Proposed Methodology (strictly framed as proposed, not fabricated completed trials)
8. Expected Academic & Practical Contributions
9. Methodological Limitations & Boundary Conditions
10. References & Bibliographic Search Vectors (categorized: User-Supplied Sources vs Recommended Search Vectors)

### F. Academic Export System
- **Export TXT:** Clean, human-readable `.txt` file formatted with ASCII headers and numbered sections.
- **Export JSON:** Comprehensive, valid `.json` export including `topic`, `research_question`, `objectives`, `methodology`, `literature_analysis`, `research_gaps`, `outline`, and `references`.
- **Copy to Clipboard:** 1-click clipboard actions for individual questions, search queries, outlines, or the entire research dossier.
- **Draft Autosave:** Browser-based draft persistence (no credentials or keys stored).

---

## 2. AI Prompting Strategy & Reliability Standards

ResearchPilot adheres to rigorous prompt principles implemented in `server.ts`:

- **Few-Shot Prompt Grounding:** Incorporates benchmark cases:
  1. *Undergraduate CS (Plant Disease Detection):* Suggests evaluation under constrained conditions (lighting, background noise) without unfounded superiority claims.
  2. *Healthcare AI (Diagnostic Limitations):* Explores clinical validation, demographic bias, interpretability, and out-of-distribution generalizability as open research topics.
  3. *Literature Excerpt Extraction:* Summarizes dataset and reported accuracy strictly based on excerpt evidence without inventing metadata.
- **No Hallucinated Citations:** User-supplied papers are labeled as verified; suggested references are explicitly marked as unverified bibliographic search queries.
- **Server-Side Security:** All Gemini calls are executed server-side via `@google/genai` (Node.js/Express) without exposing API keys to the browser.

---

## 3. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React icons, Motion
- **Backend:** Node.js, Express, tsx
- **AI SDK:** `@google/genai` SDK with `gemini-3.8-flash`
- **Build Tool:** Vite 8

---

## 4. Setup & Environment Variables

### Prerequisites
- Node.js (version 20 or higher recommended)
- A Google Gemini API Key

### Configuration (`.env`)
Create or configure `.env` in the project root:

```bash
# GEMINI_API_KEY: Required for research planning and literature analysis
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: Base URL of the hosted application (injected automatically in AI Studio)
APP_URL="http://localhost:3000"
```

---

## 5. Running the Application

### Development Mode
To run the full-stack application (Express + Vite middleware on port 3000):

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Type Checking & Linting
```bash
npm run lint
```

### Production Build
```bash
npm run build
npm run start
```

---

## 6. Student Demonstration Walk-Through

For an evaluation or live presentation, follow this 4-step workflow:

1. **Quick Topic Setup:**
   - In the **Research Planner** tab, click the **"Plant Disease Detection (ML)"** benchmark preset.
   - Click **"Generate Research Plan"**. Observe the formulated hypothesis, measurable objectives, search queries, manuscript outline, and the distinct **SUGGESTED HYPOTHESIS** badges.
2. **Literature Analysis:**
   - Switch to the **Literature Analysis** tab.
   - Click **"PlantVillage CNN Excerpt (Mohanty 2016)"** and inspect the extraction: notice that it accurately extracts the 99.35% studio accuracy and the drop to 31.4% on field data, identifying background variability as an excerpt-supported limitation.
   - Click **"Add Paper / Excerpt"** and load **"Healthcare Bias Study (Obermeyer 2019)"** to demonstrate multi-paper support.
3. **Comparative Matrix:**
   - Switch to the **Comparison Matrix** tab to view both papers side-by-side.
4. **Brief & Export:**
   - Switch to the **Research Brief** tab and click **"Synthesize Complete Research Brief"**.
   - Review the 10 formal academic sections.
   - Click **"Export TXT"** to verify the human-readable text download.
   - Click **"Export JSON"** to verify the schema-compliant JSON download.
