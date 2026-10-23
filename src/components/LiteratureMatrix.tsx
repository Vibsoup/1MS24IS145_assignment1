import React from 'react';
import { LiteratureItem, ResearchPlan } from '../types/research';
import { Table, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface LiteratureMatrixProps {
  literatureList: LiteratureItem[];
  plan: ResearchPlan | null;
  onProceedToBrief: () => void;
  onNavigateToLiterature: () => void;
}

export const LiteratureMatrix: React.FC<LiteratureMatrixProps> = ({
  literatureList,
  plan,
  onProceedToBrief,
  onNavigateToLiterature,
}) => {
  const analyzedPapers = literatureList.filter((p) => p.analysis && !p.isAnalyzing);

  if (analyzedPapers.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-xs">
        <Table className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Analyzed Papers in Matrix</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
          To generate a comparative literature matrix, add and analyze at least one research paper or excerpt in the Literature Analysis tab.
        </p>
        <button
          type="button"
          onClick={onNavigateToLiterature}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Go to Literature Intake
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
              <span>Section 3</span>
              <span aria-hidden="true">·</span>
              <span>Comparative Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Literature Comparison Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Side-by-side synthesis comparing objectives, experimental methodologies, reported metrics, and limitations across all reviewed papers.
            </p>
          </div>

          <button
            type="button"
            onClick={onProceedToBrief}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs shrink-0"
          >
            Synthesize Research Brief
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Matrix Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">
            Total Analyzed Papers: <span className="font-mono text-blue-700">{analyzedPapers.length}</span>
          </span>
          {plan && (
            <>
              <span aria-hidden="true">·</span>
              <span>Target Question: <span className="italic text-slate-800">{plan.refinedQuestion}</span></span>
            </>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4 min-w-[200px]">Paper & Bibliographic Citation</th>
                <th className="py-3 px-4 min-w-[220px]">Stated Objectives</th>
                <th className="py-3 px-4 min-w-[240px]">Methodology & Data</th>
                <th className="py-3 px-4 min-w-[220px]">Main Findings & Metrics</th>
                <th className="py-3 px-4 min-w-[220px]">Reported Limitations</th>
                <th className="py-3 px-4 min-w-[220px]">Relevance to Inquiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
              {analyzedPapers.map((paper, idx) => (
                <tr key={paper.id} className="hover:bg-slate-50/70 transition-colors align-top">
                  {/* Paper details */}
                  <td className="py-4 px-4 bg-slate-50/30">
                    <span className="font-mono text-[10px] text-blue-700 font-bold block mb-1">
                      [P{idx + 1}]
                    </span>
                    <div className="font-semibold text-slate-900 leading-snug">
                      {paper.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {paper.authors} ({paper.year})
                    </div>
                    {paper.venue && (
                      <div className="text-[11px] text-slate-400 italic mt-0.5">
                        {paper.venue}
                      </div>
                    )}
                    {paper.doi && (
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        DOI: {paper.doi}
                      </div>
                    )}
                  </td>

                  {/* Objectives */}
                  <td className="py-4 px-4 leading-relaxed">
                    {paper.analysis?.objectives}
                  </td>

                  {/* Methodology */}
                  <td className="py-4 px-4 leading-relaxed">
                    {paper.analysis?.methodology}
                  </td>

                  {/* Findings & Metrics */}
                  <td className="py-4 px-4 space-y-2">
                    {paper.analysis?.reportedAccuracyOrMetrics && (
                      <div className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded font-mono text-[11px]">
                        <span className="font-bold block text-[10px] uppercase text-emerald-800">
                          Reported Metrics:
                        </span>
                        {paper.analysis.reportedAccuracyOrMetrics}
                      </div>
                    )}
                    <ul className="space-y-1 list-disc list-inside text-slate-600">
                      {paper.analysis?.mainFindings.map((finding, fIdx) => (
                        <li key={fIdx} className="leading-snug">{finding}</li>
                      ))}
                    </ul>
                  </td>

                  {/* Limitations */}
                  <td className="py-4 px-4 space-y-1.5">
                    <span
                      className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded border mb-1 ${
                        paper.analysis?.limitationsType === 'excerpt_supported'
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      {paper.analysis?.limitationsType === 'excerpt_supported'
                        ? 'EXCERPT-SUPPORTED'
                        : 'SUGGESTED INQUIRY'}
                    </span>
                    {paper.analysis?.limitations.map((lim, lIdx) => (
                      <div key={lIdx} className="text-slate-600 leading-snug">
                        · {lim}
                      </div>
                    ))}
                  </td>

                  {/* Relevance */}
                  <td className="py-4 px-4 leading-relaxed text-slate-600">
                    {paper.analysis?.relevanceToTopic}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synthesis Takeaways */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-700" />
          Cross-Study Methodological Synthesis
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The synthesized literature highlights key empirical convergences and divergences. While models report strong benchmark scores in controlled conditions, generalization under distribution shift, demographic disparity, and ecological field testing represent recurring boundary constraints.
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            All synthesized sources will be formally integrated into Section 6 of your Research Brief.
          </span>
          <button
            type="button"
            onClick={onProceedToBrief}
            className="cursor-pointer text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            Continue to Brief Generator <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
