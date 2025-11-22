import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { generateScenarioData } from '../utils/dataGenerator';
import ScenarioGeneratorPanel from '../components/DataInputPanel';
import SummaryPanel from '../components/SummaryPanel';
import AlertsPanel from '../components/AlertsPanel';
import type { Alert } from '../types';

export default function OfficialAnalysisPage(): React.ReactElement {
  const { 
    isLoading, 
    apiError, 
    rawInput, setRawInput, 
    analysisResult, runAnalysis,
    selectedAlert, setSelectedAlert,
  } = useAppContext();
  
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<string>('imminent-wildfire');

  useEffect(() => {
    const data = generateScenarioData(scenario);
    setRawInput(data);
  }, [scenario, setRawInput]);

  const handleAlertSelect = useCallback((alert: Alert | null) => {
    setSelectedAlert(alert);
    if (alert) {
      navigate('/dashboard/map');
    }
  }, [setSelectedAlert, navigate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 max-h-full">
            <ScenarioGeneratorPanel
                currentScenario={scenario}
                onScenarioChange={setScenario}
                generatedJson={JSON.stringify(rawInput, null, 2)}
                onAnalyze={runAnalysis}
                isLoading={isLoading}
                isSimulating={false} // Simulation logic removed for clarity
                onToggleSimulation={() => {}}
            />
            <SummaryPanel 
                summary={analysisResult?.summary ?? null} 
                isLoading={isLoading} 
                error={apiError}
                history={analysisResult ? [analysisResult] : []}
                activeHistoryIndex={0}
                onHistorySelect={() => {}}
            />
        </div>
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4 max-h-full overflow-hidden">
             <div className="flex-grow bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-400/20 flex flex-col shadow-2xl shadow-black/20 overflow-hidden">
                <AlertsPanel 
                    alerts={analysisResult?.alerts ?? []} 
                    isLoading={isLoading && !analysisResult}
                    selectedAlert={selectedAlert}
                    onAlertSelect={handleAlertSelect}
                />
            </div>
        </div>
    </div>
  );
}