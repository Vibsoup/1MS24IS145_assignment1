import React, { useState, useEffect } from 'react';
import {
  ResearchTopicInput,
  ResearchPlan,
  LiteratureItem,
  ResearchBrief,
} from './types/research';
import { RESEARCH_EXAMPLES, ResearchExample } from './data/examples';
import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { TopicInputForm } from './components/TopicInputForm';
import { PlanViewer } from './components/PlanViewer';
import { LiteratureAnalyzer } from './components/LiteratureAnalyzer';
import { LiteratureMatrix } from './components/LiteratureMatrix';
import { BriefViewer } from './components/BriefViewer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { generateExportJson, downloadFile, slugify } from './utils/exportUtils';
import { Layers, BookOpen, FileText, Table } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'researchpilot_draft_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'planner' | 'literature' | 'matrix' | 'brief'>('planner');

  const [topicInput, setTopicInput] = useState<ResearchTopicInput>({
    topic: '',
    discipline: 'Computer Science',
    researchLevel: 'Undergraduate',
    preferredMethodology: 'Empirical / Experimental',
    researchQuestion: '',
    sourceMaterial: '',
  });

  const [plan, setPlan] = useState<ResearchPlan | null>(null);
  const [literatureList, setLiteratureList] = useState<LiteratureItem[]>([]);
  const [brief, setBrief] = useState<ResearchBrief | null>(null);

  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [isBriefLoading, setIsBriefLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage on mount (draft preservation)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.topicInput) setTopicInput(parsed.topicInput);
        if (parsed.plan) setPlan(parsed.plan);
        if (parsed.literatureList) setLiteratureList(parsed.literatureList);
        if (parsed.brief) setBrief(parsed.brief);
      }
    } catch (e) {
      console.warn('Could not restore saved draft from localStorage:', e);
    }
  }, []);

  // Autosave to local storage (only draft data, never credentials)
  useEffect(() => {
    try {
      const draft = {
        topicInput,
        plan,
        literatureList,
        brief,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.warn('Could not autosave draft:', e);
    }
  }, [topicInput, plan, literatureList, brief]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Select a benchmark example
  const handleSelectExample = (example: ResearchExample) => {
    setTopicInput(example.topicInput);
    if (example.samplePaper) {
      // If the paper isn't in the list, offer to add it or prepare it
      const exists = literatureList.some((p) => p.id === example.samplePaper?.id);
      if (!exists) {
        setLiteratureList((prev) => [example.samplePaper!, ...prev]);
      }
    }
    setActiveTab('planner');
    addToast(`Loaded parameters for "${example.label}"`);
  };

  // Reset all session data
  const handleReset = () => {
    if (window.confirm('Reset current research session and start fresh?')) {
      setTopicInput({
        topic: '',
        discipline: 'Computer Science',
        researchLevel: 'Undergraduate',
        preferredMethodology: 'Empirical / Experimental',
        researchQuestion: '',
        sourceMaterial: '',
      });
      setPlan(null);
      setLiteratureList([]);
      setBrief(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setActiveTab('planner');
      addToast('Reset research workspace', 'info');
    }
  };

  // Generate research plan via server endpoint
  const handleGeneratePlan = async () => {
    setIsPlanLoading(true);
    setStatusMessage('Formulating refined hypothesis and search queries...');
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topicInput),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const planData: ResearchPlan = await res.json();
      setPlan(planData);
      addToast('Generated comprehensive research plan', 'success');
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      addToast(err.message || 'Failed to generate research plan. Please try again.', 'error');
    } finally {
      setIsPlanLoading(false);
      setStatusMessage('');
    }
  };

  // Analyze single literature paper
  const handleAnalyzePaper = async (paperId: string) => {
    const paper = literatureList.find((p) => p.id === paperId);
    if (!paper) return;

    // Mark as analyzing
    setLiteratureList((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, isAnalyzing: true, error: undefined } : p))
    );

    try {
      const res = await fetch('/api/analyze-literature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: paper.title,
          authors: paper.authors,
          year: paper.year,
          venue: paper.venue,
          doi: paper.doi,
          rawText: paper.rawText,
          currentTopic: topicInput.topic,
          researchQuestion: plan?.refinedQuestion || topicInput.researchQuestion,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze paper excerpt');
      }

      const analysisData = await res.json();
      setLiteratureList((prev) =>
        prev.map((p) =>
          p.id === paperId ? { ...p, isAnalyzing: false, analysis: analysisData } : p
        )
      );
      addToast(`Analyzed: ${paper.title.substring(0, 30)}...`, 'success');
    } catch (err: any) {
      console.error('Paper analysis failed:', err);
      setLiteratureList((prev) =>
        prev.map((p) =>
          p.id === paperId ? { ...p, isAnalyzing: false, error: err.message } : p
        )
      );
      addToast(err.message || 'Failed to analyze paper', 'error');
    }
  };

  const handleAddPaper = (newPaper: LiteratureItem) => {
    setLiteratureList((prev) => [newPaper, ...prev]);
  };

  const handleDeletePaper = (id: string) => {
    setLiteratureList((prev) => prev.filter((p) => p.id !== id));
    addToast('Removed paper from corpus', 'info');
  };

  // Generate 10-section research brief
  const handleGenerateBrief = async () => {
    if (!plan) {
      addToast('Please generate a research plan first.', 'error');
      return;
    }

    setIsBriefLoading(true);
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          literatureList,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to synthesize brief');
      }

      const briefData: ResearchBrief = await res.json();
      setBrief(briefData);
      setActiveTab('brief');
      addToast('Synthesized complete 10-section Research Brief', 'success');
    } catch (err: any) {
      console.error('Brief generation failed:', err);
      addToast(err.message || 'Failed to generate research brief.', 'error');
    } finally {
      setIsBriefLoading(false);
    }
  };

  const handleExportJson = () => {
    const jsonContent = generateExportJson(plan, literatureList, brief);
    const filename = `researchpilot-project-${slugify(plan?.originalTopic || topicInput.topic || 'study')}.json`;
    downloadFile(filename, jsonContent, 'application/json;charset=utf-8');
    addToast(`Exported project dossier as JSON: ${filename}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasPlan={Boolean(plan)}
        hasBrief={Boolean(brief)}
        onReset={handleReset}
        onExportJson={handleExportJson}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Landing introduction with benchmark presets */}
        <LandingHero onSelectExample={handleSelectExample} />

        {/* Workspace Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Segmented Workspace Stage Selector */}
          <div className="mb-8 border-b border-slate-200">
            <div className="flex items-center gap-2 overflow-x-auto pb-px">
              <button
                type="button"
                onClick={() => setActiveTab('planner')}
                className={`cursor-pointer px-4 py-2.5 text-xs font-semibold rounded-t transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 ${
                  activeTab === 'planner'
                    ? 'border-blue-700 text-blue-900 bg-white shadow-2xs font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                1. Research Planner
                {plan && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-semibold">Active</span>}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('literature')}
                className={`cursor-pointer px-4 py-2.5 text-xs font-semibold rounded-t transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 ${
                  activeTab === 'literature'
                    ? 'border-blue-700 text-blue-900 bg-white shadow-2xs font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                2. Literature Analysis
                {literatureList.length > 0 && (
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono font-semibold">
                    {literatureList.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`cursor-pointer px-4 py-2.5 text-xs font-semibold rounded-t transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 ${
                  activeTab === 'matrix'
                    ? 'border-blue-700 text-blue-900 bg-white shadow-2xs font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                3. Comparison Matrix
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('brief')}
                className={`cursor-pointer px-4 py-2.5 text-xs font-semibold rounded-t transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 ${
                  activeTab === 'brief'
                    ? 'border-blue-700 text-blue-900 bg-white shadow-2xs font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                4. Research Brief
                {brief && <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-mono font-semibold">Ready</span>}
              </button>
            </div>
          </div>

          {/* Tab 1: Planner */}
          {activeTab === 'planner' && (
            <div className="space-y-8">
              <TopicInputForm
                input={topicInput}
                onChange={setTopicInput}
                onSubmit={handleGeneratePlan}
                onReset={handleReset}
                isLoading={isPlanLoading}
                statusMessage={statusMessage}
              />

              {plan && (
                <PlanViewer
                  plan={plan}
                  onProceedToLiterature={() => setActiveTab('literature')}
                  onShowToast={addToast}
                />
              )}
            </div>
          )}

          {/* Tab 2: Literature Analysis */}
          {activeTab === 'literature' && (
            <LiteratureAnalyzer
              literatureList={literatureList}
              plan={plan}
              onAddPaper={handleAddPaper}
              onDeletePaper={handleDeletePaper}
              onAnalyzePaper={handleAnalyzePaper}
              onProceedToMatrix={() => setActiveTab('matrix')}
              onShowToast={addToast}
            />
          )}

          {/* Tab 3: Comparison Matrix */}
          {activeTab === 'matrix' && (
            <LiteratureMatrix
              literatureList={literatureList}
              plan={plan}
              onProceedToBrief={() => {
                setActiveTab('brief');
                if (!brief && plan) {
                  handleGenerateBrief();
                }
              }}
              onNavigateToLiterature={() => setActiveTab('literature')}
            />
          )}

          {/* Tab 4: Brief Viewer */}
          {activeTab === 'brief' && (
            <BriefViewer
              brief={brief}
              plan={plan}
              literatureList={literatureList}
              isGenerating={isBriefLoading}
              onGenerateBrief={handleGenerateBrief}
              onShowToast={addToast}
            />
          )}
        </div>
      </main>

      {/* Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">ResearchPilot</span>
            <span aria-hidden="true">·</span>
            <span>Academic Research Assistant</span>
            <span aria-hidden="true">·</span>
            <span>Powered by Google Gemini 3.8 Flash</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Rigorous Factual Grounding</span>
            <span aria-hidden="true">·</span>
            <span>No Fabricated Citations</span>
          </div>
        </div>
      </footer>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
