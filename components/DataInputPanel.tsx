import React from 'react';
import { AnalyzeIcon, SpinnerIcon, RealtimeIcon, FireIcon, LoggingIcon, LowIcon, HighIcon } from './icons';

interface ScenarioGeneratorPanelProps {
  onAnalyze: () => void;
  isLoading: boolean;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  currentScenario: string;
  onScenarioChange: (scenario: string) => void;
  generatedJson: string;
}

const scenarios = [
  { id: 'healthy-forest', name: 'Healthy Forest', icon: <LowIcon className="h-5 w-5" /> },
  { id: 'imminent-wildfire', name: 'Imminent Wildfire', icon: <FireIcon className="h-5 w-5" /> },
  { id: 'illegal-logging', name: 'Illegal Logging', icon: <LoggingIcon className="h-5 w-5" /> },
  { id: 'drought-stress', name: 'Drought Stress', icon: <HighIcon className="h-5 w-5" /> },
];

export default function ScenarioGeneratorPanel({ onAnalyze, isLoading, isSimulating, onToggleSimulation, currentScenario, onScenarioChange, generatedJson }: ScenarioGeneratorPanelProps): React.ReactElement {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-400/20 p-4 flex flex-col gap-4 shadow-2xl shadow-black/20">
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Select Scenario</h2>
        <div className="grid grid-cols-2 gap-2">
            {scenarios.map(s => (
                <button
                    key={s.id}
                    onClick={() => onScenarioChange(s.id)}
                    disabled={isSimulating}
                    className={`flex items-center justify-center text-sm gap-2 p-2 rounded-md transition-all duration-200 border-2 disabled:cursor-not-allowed disabled:opacity-50
                        ${currentScenario === s.id
                            ? 'bg-emerald-600/30 border-emerald-500 text-white font-semibold'
                            : 'bg-gray-700/50 border-transparent hover:bg-gray-700 text-gray-300'
                        }`}
                >
                    {s.icon}
                    {s.name}
                </button>
            ))}
        </div>
      </div>
       <div>
        <h3 className="text-md font-medium text-gray-300 mb-2">Generated Data</h3>
         <textarea
            value={generatedJson}
            readOnly
            className="w-full h-32 bg-gray-900/70 border border-green-400/20 rounded-md p-2 text-xs font-mono text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors duration-300"
            spellCheck="false"
        />
       </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={onAnalyze}
          disabled={isLoading || isSimulating}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-500 shadow-md hover:shadow-lg disabled:bg-gray-600/70 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          {isLoading && !isSimulating ? (
            <>
              <SpinnerIcon className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <AnalyzeIcon className="h-5 w-5" />
              Run Analysis
            </>
          )}
        </button>
        <button
          onClick={onToggleSimulation}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 ${
            isSimulating
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          } disabled:bg-gray-600/70 disabled:shadow-none disabled:cursor-not-allowed`}
        >
          {isSimulating ? (
             <>
              <SpinnerIcon className="h-5 w-5 animate-spin" />
              Stop Simulation
             </>
          ) : (
            <>
              <RealtimeIcon className="h-5 w-5" />
              Start Real-Time
            </>
          )}
        </button>
      </div>
    </div>
  );
}
