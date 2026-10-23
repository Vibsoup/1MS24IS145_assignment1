import React from 'react';
import { BookOpen, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'planner' | 'literature' | 'brief' | 'matrix';
  setActiveTab: (tab: 'planner' | 'literature' | 'brief' | 'matrix') => void;
  hasPlan: boolean;
  hasBrief: boolean;
  onReset: () => void;
  onExportJson: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasPlan,
  hasBrief,
  onReset,
  onExportJson,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ResearchPilot
          </span>
        </div>

        {/* Zone 2: 4 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('planner')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'planner'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Research Planner
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('literature')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'literature'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Literature Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'matrix'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Comparison Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brief')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              activeTab === 'brief'
                ? 'border-blue-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Research Brief
          </button>
        </nav>

        {/* Zone 3: 1 primary action group */}
        <div className="flex items-center gap-3 shrink-0">
          {(hasPlan || hasBrief) && (
            <button
              type="button"
              onClick={onReset}
              title="Reset current research session"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          <button
            type="button"
            onClick={onExportJson}
            disabled={!hasPlan && !hasBrief}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
              hasPlan || hasBrief
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Project (JSON)
          </button>
        </div>
      </div>
    </header>
  );
};
