
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PesIcon, AnalyzeIcon, SpinnerIcon, ForestIcon, RecycleIcon } from '../components/icons';

const BenefitShareList: React.FC<{ shares: any[] }> = ({ shares }) => (
    <div className="mt-2 space-y-1">
        {shares.map((share, idx) => (
            <div key={idx} className="flex justify-between text-xs bg-gray-900/40 p-2 rounded">
                <span className="text-gray-300">{share.stakeholder}</span>
                <span className="text-emerald-400 font-bold">{share.percentage}%</span>
            </div>
        ))}
    </div>
);

const ReadinessGauge: React.FC<{ score: number }> = ({ score }) => {
    const percent = Math.round(score * 100);
    const color = percent >= 80 ? 'bg-green-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percent}%` }}></div>
            <p className="text-right text-[10px] text-gray-400 mt-1">{percent}% Readiness</p>
        </div>
    );
};

export default function PesDashboardPage() {
    const { pesPrograms, pesInsights, runPesAnalysis, isLoading } = useAppContext();
    const [selectedProgram, setSelectedProgram] = useState(pesPrograms[0] || null);

    // Auto-select the first new AI program if generated
    useEffect(() => {
        if (pesInsights?.suggestedPrograms.length > 0) {
            // Find the first program that matches a suggested ID
            const newProgram = pesPrograms.find(p => p.id === pesInsights.suggestedPrograms[0].id);
            if (newProgram) {
                setSelectedProgram(newProgram);
            }
        }
    }, [pesInsights, pesPrograms]);

    const totalIndicative = pesPrograms.reduce((sum, p) => sum + p.indicativePaymentPerPeriodKes, 0);
    const avgReadiness = pesPrograms.reduce((sum, p) => sum + p.readinessScore, 0) / (pesPrograms.length || 1);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <PesIcon className="h-8 w-8 text-emerald-400" />
                        PES & Incentives Layer
                    </h1>
                    <p className="text-gray-400 text-sm">Payments for Ecosystem Services - Readiness & Benefit Sharing.</p>
                </div>
                <button 
                    onClick={runPesAnalysis}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold disabled:opacity-50 shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                    {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : <AnalyzeIcon className="h-5 w-5" />}
                    Generate AI Opportunities
                </button>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
                 <div className="bg-gray-800/50 p-4 rounded-lg border border-green-400/20">
                    <div className="text-gray-400 text-xs uppercase mb-1">Active Programs</div>
                    <div className="text-2xl font-bold text-white">{pesPrograms.length}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-green-400/20">
                    <div className="text-gray-400 text-xs uppercase mb-1">Avg Readiness Score</div>
                    <div className="text-2xl font-bold text-white">{(avgReadiness * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-green-400/20">
                    <div className="text-gray-400 text-xs uppercase mb-1">Indicative Monthly Payouts</div>
                    <div className="text-2xl font-bold text-emerald-400">KES {totalIndicative.toLocaleString()}</div>
                </div>
            </div>

            {/* AI Insights Panel - Conditional Render */}
            {pesInsights && (
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 p-4 rounded-lg mb-6 flex-shrink-0 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-900/50 rounded-lg">
                            <AnalyzeIcon className="h-5 w-5 text-blue-300" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-blue-300 uppercase mb-1">AI Strategic Analysis</h3>
                            <p className="text-sm text-gray-200 leading-relaxed">{pesInsights.narrativeSummary}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                {/* Program List */}
                <div className="lg:col-span-5 bg-gray-800/50 border border-green-400/20 rounded-lg overflow-y-auto p-2 space-y-2">
                    {pesPrograms.map(program => {
                        const isAiProposed = pesInsights?.suggestedPrograms.some(sp => sp.id === program.id);
                        return (
                            <div 
                                key={program.id}
                                onClick={() => setSelectedProgram(program)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedProgram?.id === program.id ? 'bg-emerald-900/20 border-emerald-500' : 'bg-gray-900/40 border-transparent hover:bg-gray-800'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                        {program.name}
                                        {isAiProposed && (
                                            <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded border border-purple-400 font-bold animate-pulse">AI NEW</span>
                                        )}
                                    </h3>
                                    {program.type === 'forest' ? <ForestIcon className="h-4 w-4 text-green-400"/> : <RecycleIcon className="h-4 w-4 text-blue-400"/>}
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{program.locationLabel}</p>
                                <div className="flex justify-between items-end">
                                    <div className="text-xs font-mono text-emerald-300">KES {program.indicativePaymentPerPeriodKes.toLocaleString()}</div>
                                    <div className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">
                                        {program.type === 'forest' ? `${program.metrics.haMonitored} ha` : `${program.metrics.wasteDiversionKg} kg`}
                                    </div>
                                </div>
                                <ReadinessGauge score={program.readinessScore} />
                            </div>
                        );
                    })}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-7 bg-gray-800/50 border border-green-400/20 rounded-lg p-6 overflow-y-auto">
                    {selectedProgram ? (
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        {selectedProgram.name}
                                        {pesInsights?.suggestedPrograms.some(sp => sp.id === selectedProgram.id) && (
                                            <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-500/50">AI Proposed</span>
                                        )}
                                    </h2>
                                    <p className="text-sm text-gray-400 mt-1">{selectedProgram.locationLabel} • <span className="uppercase font-semibold text-emerald-400">{selectedProgram.type} PROGRAM</span></p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase">Est. Payment</p>
                                    <p className="text-2xl font-bold text-emerald-400 font-mono">KES {selectedProgram.indicativePaymentPerPeriodKes.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Performance Metrics</h4>
                                    <div className="space-y-1 text-sm">
                                        {selectedProgram.type === 'forest' ? (
                                            <>
                                                <div className="flex justify-between"><span>Area Monitored:</span> <span className="text-white">{selectedProgram.metrics.haMonitored} ha</span></div>
                                                <div className="flex justify-between"><span>Alerts Avoided:</span> <span className="text-white">{selectedProgram.metrics.forestAlertsAvoided}</span></div>
                                            </>
                                        ) : (
                                            <>
                                                 <div className="flex justify-between"><span>Waste Diverted:</span> <span className="text-white">{selectedProgram.metrics.wasteDiversionKg} kg</span></div>
                                                 <div className="flex justify-between"><span>CO2e Offset:</span> <span className="text-white">{selectedProgram.metrics.co2eAvoidedTons} t</span></div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Readiness Assessment</h4>
                                    <div className="text-center mb-2">
                                        <span className="text-3xl font-bold text-white">{(selectedProgram.readinessScore * 100).toFixed(0)}</span><span className="text-sm text-gray-400">%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center italic">{selectedProgram.notes}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-bold text-white mb-3 border-b border-gray-700 pb-2">Benefit Sharing Model</h3>
                                <p className="text-xs text-gray-400 mb-3">Defined distribution of payments to registered stakeholders.</p>
                                <BenefitShareList shares={selectedProgram.benefitSharing} />
                            </div>

                            {/* Mock Integration Tags */}
                            <div className="pt-4 mt-4 border-t border-gray-700">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">System Linked Assets</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProgram.linkedForestAreaIds?.map(id => (
                                        <span key={id} className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded border border-green-800">{id}</span>
                                    ))}
                                    {selectedProgram.linkedWasteZoneIds?.map(id => (
                                        <span key={id} className="text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded border border-blue-800">{id}</span>
                                    ))}
                                    {(!selectedProgram.linkedForestAreaIds && !selectedProgram.linkedWasteZoneIds) && <span className="text-xs text-gray-500 italic">No direct asset links.</span>}
                                </div>
                            </div>

                        </div>
                    ) : (
                         <div className="h-full flex items-center justify-center text-gray-500">
                            Select a program to view details.
                         </div>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
