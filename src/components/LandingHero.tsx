import React from 'react';
import { RESEARCH_EXAMPLES, ResearchExample } from '../data/examples';
import { Sparkles, ShieldCheck, Compass, FileCheck2 } from 'lucide-react';

interface LandingHeroProps {
  onSelectExample: (example: ResearchExample) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectExample }) => {
  return (
    <div className="border-b border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 tracking-wide uppercase mb-3">
            <span>Academic Research Assistant</span>
            <span aria-hidden="true">·</span>
            <span>Empirical Rigor</span>
            <span aria-hidden="true">·</span>
            <span>Zero Fabricated Citations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Rigorous research planning, literature synthesis, and brief formulation
          </h1>

          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            ResearchPilot assists undergraduate, graduate, and doctoral scholars in formulating testable research questions, structuring paper outlines, analyzing literature excerpts without hallucinated citations, and generating defensible academic briefs.
          </p>
        </div>

        {/* Core Reliability Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Verifiable Literature</h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Never hallucinates titles, authors, or DOIs. User-supplied texts are treated as ground-truth evidence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Distinct Gap Attribution</h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Explicitly delineates suggested research hypotheses from established gaps proven by published literature.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Structured Academic Brief</h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Generates a formal 10-section research dossier with exportable TXT and machine-readable JSON formats.
              </p>
            </div>
          </div>
        </div>

        {/* Benchmark Presets Bar */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Benchmark Examples for Immediate Testing
            </span>
            <span className="text-xs text-slate-500">
              Click any example to autofill the research parameters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RESEARCH_EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => onSelectExample(ex)}
                className="cursor-pointer text-left p-3.5 bg-white border border-slate-200 rounded hover:border-blue-400 hover:shadow-xs transition-all group"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-blue-700">{ex.badge}</span>
                  <span>{ex.topicInput.researchLevel}</span>
                </div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {ex.label}
                </div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {ex.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
