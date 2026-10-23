export interface ResearchTopicInput {
  topic: string;
  discipline: string;
  researchLevel: string;
  preferredMethodology: string;
  researchQuestion?: string;
  sourceMaterial?: string;
}

export interface SearchQueryItem {
  query: string;
  purpose: string;
  suggestedDatabase: string;
}

export interface OutlineSection {
  sectionNumber: string;
  title: string;
  targetWordEstimate: string;
  focusAreas: string[];
  notes: string;
}

export interface ResearchGapItem {
  gap: string;
  gapType: 'suggested_hypothesis' | 'established_literature';
  explanation: string;
}

export interface RecommendedMethodology {
  approach: string;
  rationale: string;
  keySteps: string[];
  evaluationMetrics: string[];
}

export interface ResearchPlan {
  originalTopic: string;
  discipline: string;
  researchLevel: string;
  refinedQuestion: string;
  questionRationale: string;
  objectives: string[];
  keywords: string[];
  searchQueries: SearchQueryItem[];
  outline: OutlineSection[];
  researchGaps: ResearchGapItem[];
  recommendedMethodology: RecommendedMethodology;
  createdAt: string;
}

export interface PaperAnalysis {
  summary: string;
  objectives: string;
  methodology: string;
  mainFindings: string[];
  reportedAccuracyOrMetrics?: string;
  limitations: string[];
  limitationsType: 'excerpt_supported' | 'suggested_inquiry';
  relevanceToTopic: string;
  verifiedMetadata: boolean;
}

export interface LiteratureItem {
  id: string;
  title: string;
  authors: string;
  year: string;
  venue?: string;
  doi?: string;
  rawText: string;
  analysis?: PaperAnalysis;
  isAnalyzing?: boolean;
  error?: string;
}

export interface ReferenceItem {
  citation: string;
  sourceOrigin: 'user_provided' | 'suggested_search_query';
  verified: boolean;
  notes?: string;
}

export interface ResearchBrief {
  title: string;
  abstract: string;
  introduction: string;
  researchQuestion: string;
  researchObjectives: string[];
  literatureReview: string;
  proposedMethodology: string;
  expectedContributions: string[];
  limitations: string[];
  references: ReferenceItem[];
  generatedAt: string;
}

export interface FullProjectState {
  topicInput: ResearchTopicInput;
  plan: ResearchPlan | null;
  literatureList: LiteratureItem[];
  brief: ResearchBrief | null;
  activeTab: 'planner' | 'literature' | 'brief' | 'matrix';
}
