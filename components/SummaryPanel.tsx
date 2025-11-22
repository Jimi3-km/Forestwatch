import React from 'react';
import type { Summary, ForestWatchResponse } from '../types';
import { CriticalIcon, HighIcon, LowIcon, ModerateIcon, SpinnerIcon, WarningIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface SummaryPanelProps {
  summary: Summary | null;
  isLoading: boolean;
  error: string | null;
  history: ForestWatchResponse[];
  activeHistoryIndex: number;
  onHistorySelect: (index: number) => void;
}

const riskConfig = {
    Low: { color: 'text-green-400', icon: <LowIcon className="h-8 w-8" />, value: 1 },
    Moderate: { color: 'text-yellow-400', icon: <ModerateIcon className="h-8 w-8" />, value: 2 },
    High: { color: 'text-orange-400', icon: <HighIcon className="h-8 w-8" />, value: 3 },
    Critical: { color: 'text-red-500', icon: <CriticalIcon className="h-8 w-8" />, value: 4 },
};

const Shimmer: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-32 bg-gray-700 rounded-full w-32 mx-auto mb-4"></div>
        <div className="space-y-3">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
        </div>
    </div>
);

const RiskGauge = ({ risk }: { risk: 'Low' | 'Moderate' | 'High' | 'Critical' }) => {
    const config = riskConfig[risk];
    return (
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
             <div className={`absolute inset-0 rounded-full bg-gray-900/50 border-4 border-gray-700`}></div>
             <div 
                className={`absolute inset-0 rounded-full border-4 ${config.color.replace('text', 'border')} opacity-30 animate-ping`}
                style={{ animationDuration: '2s' }}
              ></div>
            <div className={`flex flex-col items-center justify-center ${config.color}`}>
                {config.icon}
                <span className="text-2xl font-bold mt-1">{risk}</span>
            </div>
        </div>
    );
};

const SummaryItem: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-gray-400 mb-1">{label}</h4>
        <div className="text-gray-200 text-sm">{children}</div>
    </div>
);

const HistoryNavigator: React.FC<{ history: ForestWatchResponse[], activeHistoryIndex: number, onHistorySelect: (index: number) => void }> = ({ history, activeHistoryIndex, onHistorySelect }) => {
    if (history.length <= 1) return null;

    const canGoBack = activeHistoryIndex > 0;
    const canGoForward = activeHistoryIndex < history.length - 1;

    return (
        <div className="bg-gray-900/50 p-2 rounded-lg mt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2 text-center">Analysis History</h4>
            <div className="flex items-center justify-between">
                <ChevronLeftIcon onClick={() => canGoBack && onHistorySelect(activeHistoryIndex - 1)} className={`h-6 w-6 cursor-pointer ${canGoBack ? 'text-white hover:text-emerald-400' : 'text-gray-600'}`} />
                <div className="text-center">
                    <div className="font-semibold text-emerald-400">
                        {activeHistoryIndex === history.length - 1 ? 'Latest' : `T-${(history.length - 1 - activeHistoryIndex) * 7}s`}
                    </div>
                    <div className="text-xs text-gray-500">{new Date(history[activeHistoryIndex].timestamp).toLocaleTimeString()}</div>
                </div>
                <ChevronRightIcon onClick={() => canGoForward && onHistorySelect(activeHistoryIndex + 1)} className={`h-6 w-6 cursor-pointer ${canGoForward ? 'text-white hover:text-emerald-400' : 'text-gray-600'}`} />
            </div>
        </div>
    )
}

export default function SummaryPanel({ summary, isLoading, error, history, activeHistoryIndex, onHistorySelect }: SummaryPanelProps): React.ReactElement {
    
  const renderContent = () => {
    if (isLoading && !summary) {
      return <Shimmer />;
    }
    
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center text-center h-full text-red-400 p-4">
                <WarningIcon className="h-8 w-8 mb-2"/>
                <p className="font-semibold">Analysis Error</p>
                <p className="text-sm text-red-300 mt-1">{error}</p>
            </div>
        );
    }

    if (!summary) {
      return <div className="text-center text-gray-500 pt-16">No summary available. Select a scenario and run analysis.</div>;
    }

    const { overall_forest_risk, key_hotspots, notable_patterns, recommended_priority_zones } = summary;

    return (
      <div className="space-y-4">
        <div>
            <h3 className="text-md font-semibold text-center text-gray-300 mb-2">Overall Forest Risk</h3>
            <RiskGauge risk={overall_forest_risk} />
        </div>
        <div className="grid grid-cols-1 gap-3">
            <SummaryItem label="Key Hotspots">
                {key_hotspots.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {key_hotspots.map(spot => <li key={spot}>{spot}</li>)}
                    </ul>
                ) : <span className="text-gray-500">None</span>}
            </SummaryItem>
            <SummaryItem label="Priority Zones">
                {recommended_priority_zones.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                        {recommended_priority_zones.map(zone => <li key={zone}>{zone}</li>)}
                    </ul>
                ) : <span className="text-gray-500">None</span>}
            </SummaryItem>
        </div>
        <SummaryItem label="Notable Patterns">
            <p className="text-sm leading-relaxed">{notable_patterns}</p>
        </SummaryItem>
        <HistoryNavigator history={history} activeHistoryIndex={activeHistoryIndex} onHistorySelect={onHistorySelect} />
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-400/20 p-4 flex-grow flex flex-col shadow-2xl shadow-black/20 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Analysis Summary</h2>
      <div className="flex-grow">
        {renderContent()}
      </div>
    </div>
  );
}
