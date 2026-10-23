import React, { useState } from 'react';
import { ResearchPlan } from '../types/research';
import {
  HelpCircle,
  Target,
  Search,
  FileText,
  AlertTriangle,
  Lightbulb,
  Check,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PlanViewerProps {
  plan: ResearchPlan;
  onProceedToLiterature: () => void;
  onShowToast: (msg: string) => void;
}

export const PlanViewer: React.FC<PlanViewerProps> = ({
  plan,
  onProceedToLiterature,
  onShowToast,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    onShowToast(`Copied ${label} to clipboard`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const getDatabaseUrl = (query: string, database: string) => {
    const encoded = encodeURIComponent(query);
    const db = database.toLowerCase();
    if (db.includes('pubmed')) {
      return `https://pubmed.ncbi.nlm.nih.gov/?term=${encoded}`;
    }
    if (db.includes('arxiv')) {
      return `https://arxiv.org/search/?query=${encoded}&searchtype=all`;
    }
    if (db.includes('ieee')) {
      return `https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encoded}`;
    }
    // Default to Google Scholar
    return `https://scholar.google.com/scholar?q=${encoded}`;
  };

  return (
    <div className="space-y-8">
      {/* 1. Refined Research Question & Rationale */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider">
              <span>Section 1</span>
              <span aria-hidden="true">·</span>
              <span>Refined Formulation</span>
              <span aria-hidden="true">·</span>
              <span>{plan.discipline}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              {plan.refinedQuestion}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(plan.refinedQuestion, 'Research Question', 'rq')}
            className="cursor-pointer shrink-0 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            title="Copy research question"
          >
            {copiedKey === 'rq' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            Academic Justification & Feasibility Rationale
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {plan.questionRationale}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Scope Parameters:</span>
          <span>Topic: {plan.originalTopic}</span>
          <span aria-hidden="true">·</span>
          <span>Target Level: {plan.researchLevel}</span>
          <span aria-hidden="true">·</span>
          <span>Generated: {new Date(plan.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* 2-Column Grid: Research Objectives & Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Objectives (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-700" />
              Measurable Research Objectives
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {plan.objectives.length} Objectives
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {plan.objectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-50 rounded border border-slate-100 text-sm text-slate-800"
              >
                <span className="shrink-0 w-6 h-6 rounded bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Indexing Keywords (1 col) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-700" />
                Indexed Keywords
              </h3>
              <button
                type="button"
                onClick={() => copyToClipboard(plan.keywords.join(', '), 'Keywords', 'keywords')}
                className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                {copiedKey === 'keywords' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copy all
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {plan.keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 font-mono"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
            Use these standardized taxonomy descriptors for cross-database indexing and Boolean search formulation.
          </div>
        </div>
      </div>

      {/* 3. Research Gaps (CRITICAL DISTINCTION REQUIREMENT) */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Identified Research Gaps & Open Inquiries
            </h3>
            <span className="text-xs text-slate-500">
              Methodological gap classification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Note: We strictly separate <span className="font-semibold text-blue-800">Suggested Hypotheses</span> (open gaps for you to explore) from <span className="font-semibold text-amber-800">Established Literature Gaps</span> (empirically confirmed blind spots in published papers).
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.researchGaps.map((item, idx) => {
            const isSuggested = item.gapType === 'suggested_hypothesis';
            return (
              <div
                key={idx}
                className="p-4 rounded border border-slate-200 bg-slate-50/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono tracking-wide ${
                        isSuggested
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {isSuggested ? 'SUGGESTED HYPOTHESIS' : 'ESTABLISHED LITERATURE GAP'}
                    </span>
                    <span className="text-slate-400 font-mono">Gap {idx + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {item.gap}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Suggested Literature Search Queries */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-700" />
              Recommended Precision Search Queries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimized query strings ready to launch in Google Scholar, PubMed, arXiv, or IEEE Xplore.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {plan.searchQueries.map((item, idx) => {
            const searchUrl = getDatabaseUrl(item.query, item.suggestedDatabase);
            const queryKey = `query-${idx}`;
            return (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{item.suggestedDatabase}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.purpose}</span>
                  </div>
                  <div className="font-mono text-xs text-blue-900 bg-white px-2 py-1 rounded border border-slate-200 select-all">
                    {item.query}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.query, 'Search Query', queryKey)}
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                  >
                    {copiedKey === queryKey ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copy
                  </button>
                  <a
                    href={searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Search Database
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Recommended Methodology Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
            <span>Methodological Design</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {plan.recommendedMethodology.approach}
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {plan.recommendedMethodology.rationale}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key execution steps */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
              Proposed Execution Stages
            </h4>
            <div className="space-y-2">
              {plan.recommendedMethodology.keySteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="font-mono text-blue-600 font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-normal">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Validation & Evaluation Metrics */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              Validation & Evaluation Metrics
            </h4>
            <div className="space-y-2">
              {plan.recommendedMethodology.evaluationMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span className="leading-normal">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Structured Paper Outline */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              Structured Manuscript Outline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target section balances, core arguments, and drafting guidelines.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const outlineText = plan.outline
                .map(
                  (s) =>
                    `${s.sectionNumber}. ${s.title} (${s.targetWordEstimate})\n` +
                    s.focusAreas.map((f) => `   - ${f}`).join('\n') +
                    `\n   Notes: ${s.notes}\n`
                )
                .join('\n');
              copyToClipboard(outlineText, 'Outline', 'outline');
            }}
            className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded"
          >
            {copiedKey === 'outline' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Manuscript Outline
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {plan.outline.map((sec, idx) => (
            <div
              key={idx}
              className="p-4 rounded border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {sec.sectionNumber}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{sec.title}</h4>
                </div>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Target: {sec.targetWordEstimate}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                {sec.focusAreas.map((fa, fIdx) => (
                  <div key={fIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-slate-400">·</span>
                    <span>{fa}</span>
                  </div>
                ))}
              </div>

              {sec.notes && (
                <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 italic">
                  Drafting advice: {sec.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Step Transition Callout */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-blue-900">
            Ready to review empirical literature?
          </h4>
          <p className="text-xs text-blue-800 mt-1">
            Feed paper excerpts into the Literature Analyzer to extract objectives, methods, verified metrics, and synthesize a cross-paper comparison matrix.
          </p>
        </div>

        <button
          type="button"
          onClick={onProceedToLiterature}
          className="cursor-pointer shrink-0 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs"
        >
          Proceed to Literature Analysis
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
