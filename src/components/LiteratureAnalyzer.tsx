import React, { useState } from 'react';
import { LiteratureItem, ResearchPlan } from '../types/research';
import { RESEARCH_EXAMPLES } from '../data/examples';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  BookMarked,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface LiteratureAnalyzerProps {
  literatureList: LiteratureItem[];
  plan: ResearchPlan | null;
  onAddPaper: (paper: LiteratureItem) => void;
  onDeletePaper: (id: string) => void;
  onAnalyzePaper: (id: string) => Promise<void>;
  onProceedToMatrix: () => void;
  onShowToast: (msg: string) => void;
}

export const LiteratureAnalyzer: React.FC<LiteratureAnalyzerProps> = ({
  literatureList,
  plan,
  onAddPaper,
  onDeletePaper,
  onAnalyzePaper,
  onProceedToMatrix,
  onShowToast,
}) => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState('');
  const [venue, setVenue] = useState('');
  const [doi, setDoi] = useState('');
  const [rawText, setRawText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setFormError('Please paste an excerpt or abstract from the paper to analyze.');
      return;
    }
    setFormError(null);

    const newPaper: LiteratureItem = {
      id: `paper-${Date.now()}`,
      title: title.trim() || 'Untitled Literature Excerpt',
      authors: authors.trim() || 'Unspecified in excerpt',
      year: year.trim() || 'Unspecified',
      venue: venue.trim() || '',
      doi: doi.trim() || '',
      rawText: rawText.trim(),
      isAnalyzing: true,
    };

    onAddPaper(newPaper);
    setIsOpenForm(false);
    resetForm();

    // Trigger analysis
    await onAnalyzePaper(newPaper.id);
  };

  const resetForm = () => {
    setTitle('');
    setAuthors('');
    setYear('');
    setVenue('');
    setDoi('');
    setRawText('');
    setFormError(null);
  };

  const loadExampleExcerpt = (exampleIndex: number) => {
    const ex = RESEARCH_EXAMPLES[exampleIndex];
    if (ex && ex.samplePaper) {
      setTitle(ex.samplePaper.title);
      setAuthors(ex.samplePaper.authors);
      setYear(ex.samplePaper.year);
      setVenue(ex.samplePaper.venue || '');
      setDoi(ex.samplePaper.doi || '');
      setRawText(ex.samplePaper.rawText);
      setIsOpenForm(true);
      onShowToast(`Loaded sample paper from ${ex.label}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
              <span>Section 2</span>
              <span aria-hidden="true">·</span>
              <span>Empirical Ground Truth</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Literature Intake & Paper Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Paste excerpts from relevant papers. The agent extracts objectives, methodology, reported metrics, and limitations strictly based on supplied text.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsOpenForm(!isOpenForm)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Paper / Excerpt
            </button>
          </div>
        </div>

        {/* Quick Excerpt Buttons */}
        <div className="mt-4 pt-2 flex items-center gap-2 flex-wrap text-xs text-slate-600">
          <span className="font-semibold text-slate-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Benchmark Excerpts:
          </span>
          <button
            type="button"
            onClick={() => loadExampleExcerpt(0)}
            className="cursor-pointer px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
          >
            PlantVillage CNN Excerpt (Mohanty 2016)
          </button>
          <button
            type="button"
            onClick={() => loadExampleExcerpt(1)}
            className="cursor-pointer px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
          >
            Healthcare Bias Study (Obermeyer 2019)
          </button>
          <button
            type="button"
            onClick={() => loadExampleExcerpt(2)}
            className="cursor-pointer px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
          >
            Clinical NLP Excerpt (Factual Recall Benchmark)
          </button>
        </div>
      </div>

      {/* Intake Modal / Form Drawer */}
      {isOpenForm && (
        <div className="bg-white border-2 border-blue-600/30 rounded-lg p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-blue-700" />
              <h3 className="text-base font-bold text-slate-900">
                New Literature Entry
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpenForm(false)}
              className="cursor-pointer text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddAndAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Paper Title <span className="text-slate-400 font-normal lowercase">(if known)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep learning for image-based plant disease detection"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Authors <span className="text-slate-400 font-normal lowercase">(if known)</span>
                </label>
                <input
                  type="text"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="e.g. Mohanty, S. P., Hughes, D. P., & Salathé, M."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Publication Year
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2016"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Journal / Conference
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Frontiers in Plant Science"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  DOI / URL <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="text"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  placeholder="e.g. 10.3389/fpls.2016.01419"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Paper Abstract, Methodology, or Results Excerpt <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400">Paste text directly from paper</span>
              </div>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => {
                  setFormError(null);
                  setRawText(e.target.value);
                }}
                placeholder="Paste the abstract, dataset description, architecture, experimental protocols, or key numerical results here..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-xs leading-relaxed"
              />
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="cursor-pointer px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Add & Analyze Excerpt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Literature List */}
      {literatureList.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-slate-300 rounded-lg">
          <BookMarked className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Literature Papers Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            Add paper abstracts or methodology excerpts above to analyze their objectives, empirical findings, and limitations.
          </p>
          <button
            type="button"
            onClick={() => loadExampleExcerpt(0)}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Benchmark Excerpt (Plant Disease Detection)
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {literatureList.map((paper, idx) => (
            <div
              key={paper.id}
              className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs relative"
            >
              {/* Paper header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-blue-700 font-bold">Source #{idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{paper.year}</span>
                    {paper.venue && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="italic">{paper.venue}</span>
                      </>
                    )}
                    {paper.doi && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">DOI: {paper.doi}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {paper.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    Authors: {paper.authors}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onDeletePaper(paper.id)}
                    className="cursor-pointer p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Remove paper"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Analysis contents */}
              {paper.isAnalyzing ? (
                <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="font-medium text-slate-700">Analyzing excerpt with Gemini...</span>
                  <span className="text-[11px] text-slate-400">Extracting empirical methods, reported metrics, and verifiable limits</span>
                </div>
              ) : paper.error ? (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Analysis error: {paper.error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAnalyzePaper(paper.id)}
                    className="cursor-pointer px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-semibold text-[11px]"
                  >
                    Retry Analysis
                  </button>
                </div>
              ) : paper.analysis ? (
                <div className="mt-6 space-y-6">
                  {/* Summary & Objectives */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Concise Academic Summary
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                        {paper.analysis.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Stated Research Objectives
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                        {paper.analysis.objectives}
                      </p>
                    </div>
                  </div>

                  {/* Methodology & Reported Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Methodology & Experimental Protocol
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                        {paper.analysis.methodology}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Reported Accuracy & Metrics</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                          STRICT GROUND TRUTH
                        </span>
                      </h4>
                      <div className="text-xs text-slate-800 font-mono bg-emerald-50/50 p-3 rounded border border-emerald-100 leading-relaxed">
                        {paper.analysis.reportedAccuracyOrMetrics || 'No numerical performance metric reported in excerpt.'}
                      </div>
                    </div>
                  </div>

                  {/* Main Findings */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Key Empirical Findings
                    </h4>
                    <div className="space-y-1.5">
                      {paper.analysis.mainFindings.map((finding, fIdx) => (
                        <div key={fIdx} className="text-xs text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Limitations with distinct labeling */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Limitations & Boundary Constraints
                      </h4>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          paper.analysis.limitationsType === 'excerpt_supported'
                            ? 'bg-slate-100 text-slate-800 border-slate-200'
                            : 'bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        {paper.analysis.limitationsType === 'excerpt_supported'
                          ? 'EXPLICITLY STATED IN EXCERPT'
                          : 'SUGGESTED CRITICAL INQUIRY'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {paper.analysis.limitations.map((lim, lIdx) => (
                        <div key={lIdx} className="text-xs text-slate-600 flex items-start gap-2 bg-amber-50/40 p-2 rounded border border-amber-100">
                          <span className="font-mono text-amber-700 font-bold shrink-0">{lIdx + 1}.</span>
                          <span>{lim}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relevance to User RQ */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                      Relevance to Your Project Question
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {paper.analysis.relevanceToTopic}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Analysis pending for this excerpt.</span>
                  <button
                    type="button"
                    onClick={() => onAnalyzePaper(paper.id)}
                    className="cursor-pointer px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium hover:bg-blue-100"
                  >
                    Run Paper Analysis
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Matrix Transition callout */}
          <div className="p-6 bg-slate-100 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {literatureList.length} {literatureList.length === 1 ? 'Paper' : 'Papers'} Added to Literature Corpus
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Compare these papers in a side-by-side synthesis table or formulate the full 10-section research brief.
              </p>
            </div>
            <button
              type="button"
              onClick={onProceedToMatrix}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors shadow-xs"
            >
              View Comparison Matrix
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
