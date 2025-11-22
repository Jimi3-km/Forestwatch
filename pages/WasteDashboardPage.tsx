import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { TrashIcon, RecycleIcon, CoinIcon, AnalyzeIcon, SpinnerIcon, MobileIcon } from '../components/icons';
import USSDSimulator from '../components/USSDSimulator';

const SmartBinCard: React.FC<{ bin: any }> = ({ bin }) => {
    const isFull = bin.fill_level > 80;
    const isLowBat = bin.battery_level < 20;

    return (
        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700 flex items-center justify-between">
            <div>
                <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${bin.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-mono text-sm text-gray-300">{bin.id}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">{bin.type}</div>
            </div>
            <div className="text-right">
                <div className={`text-lg font-bold ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                    {bin.fill_level}%
                </div>
                <div className={`text-xs ${isLowBat ? 'text-yellow-500' : 'text-gray-500'}`}>
                    Bat: {bin.battery_level}%
                </div>
            </div>
        </div>
    );
};

const MarketPriceRow: React.FC<{ item: any }> = ({ item }) => (
    <div className="flex justify-between items-center border-b border-gray-700 py-2 last:border-0">
        <span className="capitalize text-gray-300">{item.material}</span>
        <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">{item.currency} {item.price_per_kg}</span>
            <span className={`text-xs ${item.trend === 'up' ? 'text-green-400' : item.trend === 'down' ? 'text-red-400' : 'text-gray-500'}`}>
                {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '—'}
            </span>
        </div>
    </div>
);

export default function WasteDashboardPage() {
    const { wasteInput, wasteAnalysisResult, runWasteAnalysis, isLoading } = useAppContext();

    const totalPayout = wasteInput.recent_transactions.reduce((acc, curr) => acc + curr.payout_amount, 0);
    const totalWeight = wasteInput.recent_transactions.reduce((acc, curr) => acc + curr.weight_kg, 0);

    return (
        <div className="h-full overflow-y-auto p-2">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <RecycleIcon className="h-8 w-8 text-emerald-400" />
                        Circular Economy Hub
                    </h1>
                    <p className="text-gray-400 text-sm">Monitor waste flow, smart bins, and material value.</p>
                </div>
                <button 
                    onClick={runWasteAnalysis}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md flex items-center gap-2 font-semibold disabled:opacity-50"
                >
                    {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : <AnalyzeIcon className="h-5 w-5" />}
                    Analyze Flow
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: Operational Status */}
                <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="text-gray-400 text-xs uppercase mb-1">Value Recovered</div>
                            <div className="text-2xl font-bold text-white flex items-center gap-1">
                                <span className="text-yellow-500">KES</span> {totalPayout.toFixed(0)}
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <div className="text-gray-400 text-xs uppercase mb-1">Waste Diverted</div>
                            <div className="text-2xl font-bold text-white">{totalWeight} <span className="text-sm text-gray-500">kg</span></div>
                        </div>
                    </div>

                     {/* Smart Bins */}
                     <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <TrashIcon className="h-5 w-5 text-gray-400" /> Smart Bin Telemetry
                            </h2>
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">Live</span>
                        </div>
                        <div className="space-y-3">
                            {wasteInput.smart_bins.map(bin => (
                                <SmartBinCard key={bin.id} bin={bin} />
                            ))}
                        </div>
                    </div>

                    {/* Market Prices */}
                    <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                         <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <CoinIcon className="h-5 w-5 text-yellow-400" /> Material Market
                        </h2>
                        <div className="space-y-2">
                            {wasteInput.market_prices.map((item, idx) => (
                                <MarketPriceRow key={idx} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: AI Analysis & Insights */}
                <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4 h-full">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <AnalyzeIcon className="h-5 w-5 text-emerald-400" /> Gemini Efficiency Analysis
                        </h2>
                        {wasteAnalysisResult ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-center">
                                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-emerald-500/30">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">{wasteAnalysisResult.summary.efficiency_score}</div>
                                            <div className="text-xs text-gray-400">Efficiency Score</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-900/50 p-3 rounded-md">
                                    <h4 className="text-sm font-bold text-gray-300 mb-2">Route Optimization</h4>
                                    <p className="text-sm text-gray-400">{wasteAnalysisResult.summary.suggested_route_optimization}</p>
                                </div>

                                <div className="bg-gray-900/50 p-3 rounded-md">
                                    <h4 className="text-sm font-bold text-gray-300 mb-2">Carbon Offset</h4>
                                    <p className="text-emerald-400 font-mono font-bold text-xl">{wasteAnalysisResult.summary.carbon_offset_tonnes} <span className="text-sm text-gray-500">tonnes CO2e</span></p>
                                </div>
                                
                                <div>
                                    <h4 className="text-sm font-bold text-gray-300 mb-2">Fraud Risk</h4>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        wasteAnalysisResult.summary.fraud_risk_level === 'Low' ? 'bg-green-900/50 text-green-400' : 
                                        wasteAnalysisResult.summary.fraud_risk_level === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'
                                    }`}>
                                        {wasteAnalysisResult.summary.fraud_risk_level}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-500 text-center">
                                <AnalyzeIcon className="h-12 w-12 mb-2 opacity-50" />
                                <p>Run analysis to generate insights on waste flow, fraud detection, and carbon offsets.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Connectivity & Access */}
                <div className="space-y-6">
                     <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <MobileIcon className="h-5 w-5 text-blue-400" /> Collector USSD Interface
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">Simulate the experience for offline waste pickers using feature phones.</p>
                        <div className="flex justify-center">
                            <USSDSimulator />
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                        <h2 className="text-lg font-semibold text-white mb-2">Recent Transactions</h2>
                        <div className="overflow-y-auto max-h-64">
                            <table className="w-full text-left text-xs">
                                <thead className="text-gray-500 uppercase border-b border-gray-700">
                                    <tr>
                                        <th className="py-2">ID</th>
                                        <th className="py-2">Type</th>
                                        <th className="py-2 text-right">KG</th>
                                        <th className="py-2 text-right">Payout</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {wasteInput.recent_transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-gray-700/30">
                                            <td className="py-2 text-gray-400">{tx.id}</td>
                                            <td className="py-2 text-white capitalize">{tx.waste_type}</td>
                                            <td className="py-2 text-right text-gray-300">{tx.weight_kg}</td>
                                            <td className="py-2 text-right font-mono text-emerald-400">{tx.payout_amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}