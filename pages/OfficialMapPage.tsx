import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MapView from '../components/MapView';
import type { Alert } from '../types';

export default function OfficialMapPage(): React.ReactElement {
    const { rawInput, analysisResult, selectedAlert, setSelectedAlert } = useAppContext();

    const handleAlertSelect = (alert: Alert | null) => {
        setSelectedAlert(alert);
    };

    return (
        <div className="h-full w-full bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-400/20 shadow-2xl shadow-black/20 overflow-hidden relative">
            {!analysisResult && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
                    <div className="text-center">
                        <p className="text-white text-lg">No analysis data available.</p>
                        <Link to="/dashboard/analysis" className="mt-2 inline-block bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-500 transition-colors">
                            Run Analysis First
                        </Link>
                    </div>
                </div>
            )}
            <MapView
                data={rawInput}
                alerts={analysisResult?.alerts ?? []}
                selectedAlert={selectedAlert}
                onAlertSelect={handleAlertSelect}
            />
        </div>
    );
}