import React, { useState } from 'react';
import { ResearchTopicInput } from '../types/research';
import { ArrowRight, RotateCcw, AlertCircle, Loader2 } from 'lucide-react';

interface TopicInputFormProps {
  input: ResearchTopicInput;
  onChange: (input: ResearchTopicInput) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
  statusMessage?: string;
}

const DISCIPLINES = [
  'Computer Science',
  'Biomedical Sciences & Medicine',
  'Environmental Science & Ecology',
  'Engineering & Technology',
  'Psychology & Cognitive Sciences',
  'Economics & Business Studies',
  'Sociology & Social Sciences',
  'Physics & Material Sciences',
  'Education & Pedagogical Sciences',
  'Humanities & History',
];

const RESEARCH_LEVELS = [
  'Undergraduate',
  "Master's",
  'Doctoral / Ph.D.',
  'Postdoctoral / Faculty',
  'Independent Researcher',
];

const METHODOLOGIES = [
  'Empirical / Experimental',
  'Systematic Literature Review & Meta-Analysis',
  'Computational & Simulation Modeling',
  'Qualitative / In-depth Case Study',
  'Mixed Methods (Quantitative & Qualitative)',
  'Theoretical & Formal Proof',
];

export const TopicInputForm: React.FC<TopicInputFormProps> = ({
  input,
  onChange,
  onSubmit,
  onReset,
  isLoading,
  statusMessage,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.topic.trim()) {
      setValidationError('Please enter a research topic to generate a plan.');
      return;
    }
    setValidationError(null);
    onSubmit();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Research Scope & Parameter Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define your inquiry boundaries, target academic rigor, and initial methodological preferences.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear Form
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Research Topic */}
        <div>
          <label htmlFor="topic-input" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            Research Topic <span className="text-red-500">*</span>
          </label>
          <input
            id="topic-input"
            type="text"
            value={input.topic}
            onChange={(e) => {
              setValidationError(null);
              onChange({ ...input, topic: e.target.value });
            }}
            placeholder="e.g. Plant disease detection using machine learning"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <p className="text-xs text-slate-400 mt-1.5">
            State the core phenomenon, scientific problem, or domain area you wish to investigate.
          </p>
        </div>

        {/* 3-Column: Discipline, Level, Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Discipline */}
          <div>
            <label htmlFor="discipline-select" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Academic Discipline
            </label>
            <select
              id="discipline-select"
              value={input.discipline}
              onChange={(e) => onChange({ ...input, discipline: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Research Level */}
          <div>
            <label htmlFor="level-select" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Research Level
            </label>
            <select
              id="level-select"
              value={input.researchLevel}
              onChange={(e) => onChange({ ...input, researchLevel: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {RESEARCH_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Methodology */}
          <div>
            <label htmlFor="methodology-select" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Preferred Methodology
            </label>
            <select
              id="methodology-select"
              value={input.preferredMethodology}
              onChange={(e) => onChange({ ...input, preferredMethodology: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              disabled={isLoading}
            >
              {METHODOLOGIES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Research Question */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="rq-input" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Draft Research Question <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-xs text-slate-400">Leave blank to let the AI formulate an optimal question</span>
          </div>
          <input
            id="rq-input"
            type="text"
            value={input.researchQuestion || ''}
            onChange={(e) => onChange({ ...input, researchQuestion: e.target.value })}
            placeholder="e.g. What are the limitations of machine-learning models used for early disease detection?"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Optional Source Material or Preliminary Notes */}
        <div>
          <label htmlFor="notes-textarea" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
            Preliminary Notes & Contextual Constraints <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            id="notes-textarea"
            rows={3}
            value={input.sourceMaterial || ''}
            onChange={(e) => onChange({ ...input, sourceMaterial: e.target.value })}
            placeholder="Mention specific datasets (e.g. PlantVillage, MIMIC-IV), clinical constraints, hardware targets, or initial literature hunches..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {isLoading ? (
              <span className="flex items-center gap-2 text-blue-700 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {statusMessage || 'Synthesizing research plan via Gemini...'}
              </span>
            ) : (
              <span>Generates refined question, measurable objectives, search vectors, and gap hypothesis.</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors shadow-xs disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                Generate Research Plan
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
