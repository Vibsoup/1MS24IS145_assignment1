import React, { useState } from 'react';
import { ResearchBrief, ResearchPlan, LiteratureItem } from '../types/research';
import {
  Download,
  Copy,
  Check,
  BookOpen,
  FileText,
  Bookmark,
  Share2,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  generateBriefTxt,
  generateExportJson,
  downloadFile,
  slugify,
} from '../utils/exportUtils';

interface BriefViewerProps {
  brief: ResearchBrief | null;
  plan: ResearchPlan | null;
  literatureList: LiteratureItem[];
  isGenerating: boolean;
  onGenerateBrief: () => void;
  onShowToast: (msg: string) => void;
}

const BRIEF_SECTIONS = [
  { id: 'title', label: 'Title & Abstract' },
  { id: 'intro', label: '1. Introduction' },
  { id: 'rq', label: '2. Research Question' },
  { id: 'objectives', label: '3. Objectives' },
  { id: 'literature', label: '4. Literature Review' },
  { id: 'methodology', label: '5. Proposed Methodology' },
  { id: 'contributions', label: '6. Expected Contributions' },
  { id: 'limitations', label: '7. Limitations' },
  { id: 'references', label: '8. References' },
];

export const BriefViewer: React.FC<BriefViewerProps> = ({
  brief,
  plan,
  literatureList,
  isGenerating,
  onGenerateBrief,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('title');

  const handleExportTxt = () => {
    if (!brief) return;
    const txtContent = generateBriefTxt(brief, plan);
    const filename = `researchpilot-brief-${slugify(brief.title || 'study')}.txt`;
    downloadFile(filename, txtContent, 'text/plain;charset=utf-8');
    onShowToast(`Exported readable research brief as TXT: ${filename}`);
  };

  const handleExportJson = () => {
    const jsonContent = generateExportJson(plan, literatureList, brief);
    const filename = `researchpilot-project-${slugify(plan?.originalTopic || 'study')}.json`;
    downloadFile(filename, jsonContent, 'application/json;charset=utf-8');
    onShowToast(`Exported full structured project data as JSON: ${filename}`);
  };

  const handleCopyFullBrief = () => {
    if (!brief) return;
    const txtContent = generateBriefTxt(brief, plan);
    navigator.clipboard.writeText(txtContent);
    setCopied(true);
    onShowToast('Copied full academic brief to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!brief && !isGenerating) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Synthesize 10-Section Academic Research Brief</h3>
        <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 mb-6 leading-relaxed">
          Transform your research question, objectives, gap analysis, and {literatureList.length} reviewed papers into a formal, structured academic brief formatted for thesis proposals, grant drafts, and peer review.
        </p>

        <button
          type="button"
          onClick={onGenerateBrief}
          disabled={!plan}
          className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          Generate Complete Research Brief
        </button>

        {!plan && (
          <p className="text-xs text-amber-700 mt-3">
            * Please generate a research plan in the Research Planner tab first.
          </p>
        )}
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-16 text-center shadow-xs">
        <Loader2 className="w-10 h-10 animate-spin text-blue-700 mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-900">
          Synthesizing Research Brief via Gemini
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Integrating research question, objectives, proposed methodology, and synthesized literature corpus into a 10-section academic brief without hallucinated results...
        </p>
      </div>
    );
  }

  if (!brief) return null;

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
            <span>Section 4</span>
            <span aria-hidden="true">·</span>
            <span>Structured Academic Brief</span>
            <span aria-hidden="true">·</span>
            <span>10 Sections Complete</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Research Dossier
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Generated: {new Date(brief.generatedAt).toLocaleDateString()}</span>
            <span aria-hidden="true">·</span>
            <span>Disciplined citations without unverified assertions</span>
          </div>
        </div>

        {/* Action buttons: Export TXT, Export JSON, Copy */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleCopyFullBrief}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Brief' : 'Copy Brief'}
          </button>

          <button
            type="button"
            onClick={handleExportTxt}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-700" />
            Export TXT
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Main Reading Canvas & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar (1 col) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Table of Contents
            </div>
            {BRIEF_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id)}
                className={`cursor-pointer w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap truncate ${
                  activeSectionId === sec.id
                    ? 'bg-blue-50 text-blue-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {sec.label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-500 font-mono">
                Sources Reviewed: <span className="font-bold text-slate-900">{literatureList.length}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                References: <span className="font-bold text-slate-900">{brief.references.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Canvas (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title & Abstract */}
          <div id="title" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              {brief.title}
            </h1>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Structured Abstract
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed font-serif bg-slate-50 p-4 rounded border border-slate-100">
                {brief.abstract}
              </p>
            </div>
          </div>

          {/* Section 1: Introduction */}
          <div id="intro" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4">
              1. Introduction & Background
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {brief.introduction}
            </div>
          </div>

          {/* Section 2: Research Question */}
          <div id="rq" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4">
              2. Formulated Research Question
            </h2>
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded text-base font-semibold text-blue-950 leading-snug">
              {brief.researchQuestion}
            </div>
          </div>

          {/* Section 3: Objectives */}
          <div id="objectives" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4">
              3. Research Objectives
            </h2>
            <div className="space-y-2.5">
              {brief.researchObjectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-800">
                  <span className="shrink-0 w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Literature Review */}
          <div id="literature" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                4. Literature Review Based on Supplied Sources
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {literatureList.length} User Sources Integrated
              </span>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {brief.literatureReview}
            </div>
          </div>

          {/* Section 5: Proposed Methodology */}
          <div id="methodology" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                5. Proposed Methodology
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Design protocols, operational variables, data sampling, and evaluation criteria framed as proposed research.
              </p>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {brief.proposedMethodology}
            </div>
          </div>

          {/* Section 6: Expected Contributions */}
          <div id="contributions" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4">
              6. Expected Academic & Practical Contributions
            </h2>
            <div className="space-y-2.5">
              {brief.expectedContributions.map((contrib, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <span className="text-blue-700 font-bold shrink-0">✦</span>
                  <span className="leading-relaxed">{contrib}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Limitations */}
          <div id="limitations" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100 mb-4">
              7. Methodological Limitations & Boundary Conditions
            </h2>
            <div className="space-y-2.5">
              {brief.limitations.map((lim, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 bg-amber-50/30 p-3 rounded border border-amber-100">
                  <span className="font-mono text-amber-800 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-relaxed">{lim}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: References (Reliability requirement: distinguish user-supplied vs suggested query) */}
          <div id="references" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                8. References & Bibliographic Search Vectors
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Never fabricated. User-supplied sources are verified against provided input; recommended items are clearly demarcated as search queries.
              </p>
            </div>

            <div className="space-y-4">
              {brief.references.map((ref, idx) => {
                const isUserSource = ref.sourceOrigin === 'user_provided';
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 font-bold">[{idx + 1}]</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isUserSource
                              ? 'bg-blue-100 text-blue-900 border-blue-200 font-semibold'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                          }`}
                        >
                          {isUserSource ? 'USER-SUPPLIED SOURCE' : 'RECOMMENDED SEARCH VECTOR'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {ref.verified ? 'Verified Input' : 'Unverified Query'}
                      </span>
                    </div>

                    <div className="text-slate-800 font-mono text-[11px] leading-relaxed">
                      {ref.citation}
                    </div>

                    {ref.notes && (
                      <div className="mt-1.5 text-[11px] text-slate-500 italic">
                        Retrieval note: {ref.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
