

import React from 'react';
// Fix: Corrected import path for useAppContext to point to the context file.
import { useAppContext } from '../contexts/AppContext';

export default function OfficialReportsHistoryPage(): React.ReactElement {
    // Fix: The context provides 'rawInput', not 'currentDataInput'.
    const { rawInput, analysisResult } = useAppContext();

    return (
        <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-6 h-full text-white">
            <h1 className="text-2xl font-bold mb-6">Reports & History</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Raw Reports Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Community Reports Received</h2>
                    <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {rawInput.reports.length > 0 ? (
                            <ul className="space-y-4">
                                {rawInput.reports.map(report => (
                                    <li key={report.report_id} className="border-b border-gray-700 pb-2">
                                        <p className="font-semibold">{report.category.toUpperCase()}: <span className="text-gray-300 font-normal">{report.description}</span></p>
                                        <p className="text-xs text-gray-400 font-mono">ID: {report.report_id} | Loc: {report.location.lat.toFixed(3)}, {report.location.lng.toFixed(3)}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No community reports in the current dataset.</p>
                        )}
                    </div>
                </div>

                {/* Analysis History Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Analysis History</h2>
                    <div className="bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        {analysisResult ? (
                            <div className="bg-gray-800 p-4 rounded-md">
                                <h3 className="font-bold">Latest Analysis</h3>
                                <p className="text-sm text-gray-400">{new Date(analysisResult.timestamp).toLocaleString()}</p>
                                <ul className="mt-2 text-sm space-y-1">
                                    <li><span className="font-semibold">Overall Risk:</span> {analysisResult.summary.overall_forest_risk}</li>
                                    <li><span className="font-semibold">Alerts Generated:</span> {analysisResult.alerts.length}</li>
                                </ul>
                            </div>
                        ) : (
                             <p className="text-gray-500 text-center py-4">No analysis has been run yet.</p>
                        )}
                        <p className="text-xs text-gray-600 mt-4 text-center">Full history tracking and data export coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}