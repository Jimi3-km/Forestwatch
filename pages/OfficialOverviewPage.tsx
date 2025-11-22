
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { AnalyzeIcon, CriticalIcon, FireIcon, HighIcon, LowIcon, ModerateIcon, PesIcon } from '../components/icons';
import type { Alert } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg flex items-center gap-4 border-l-4" style={{ borderColor: color }}>
        <div className={`p-3 rounded-full bg-gray-800`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const RecentAlertItem: React.FC<{ alert: Alert; onClick: () => void }> = ({ alert, onClick }) => {
    const severityMap = {
        'Critical': { icon: <CriticalIcon className="h-5 w-5 text-red-500" />, color: 'text-red-400' },
        'High': { icon: <HighIcon className="h-5 w-5 text-orange-400" />, color: 'text-orange-400' },
        'Moderate': { icon: <ModerateIcon className="h-5 w-5 text-yellow-400" />, color: 'text-yellow-400' },
        'Low': { icon: <LowIcon className="h-5 w-5 text-green-400" />, color: 'text-green-400' },
    };
    return (
        <li
            onClick={onClick}
            className="flex items-center justify-between p-3 bg-gray-900/50 hover:bg-gray-800/80 rounded-md transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-3">
                {severityMap[alert.severity].icon}
                <div>
                    <p className="font-semibold text-white">{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Threat</p>
                    <p className="text-xs text-gray-400 max-w-xs truncate">{alert.explanation}</p>
                </div>
            </div>
            <p className={`text-sm font-bold ${severityMap[alert.severity].color}`}>{alert.severity}</p>
        </li>
    )
};

export default function OfficialOverviewPage(): React.ReactElement {
    const { user } = useAuth();
    const { analysisResult, setSelectedAlert, pesPrograms } = useAppContext();
    const navigate = useNavigate();

    const handleAlertClick = (alert: Alert) => {
        setSelectedAlert(alert);
        navigate('/dashboard/map');
    };

    if (!analysisResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-white">
                <h1 className="text-3xl font-bold">Welcome, {user?.email}!</h1>
                <p className="mt-4 text-lg text-gray-400">No analysis has been run yet.</p>
                <p className="text-gray-500">Run an analysis to see the forest overview.</p>
                <Link
                    to="/dashboard/analysis"
                    className="mt-6 inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-emerald-500 shadow-lg transition-all"
                >
                    <AnalyzeIcon className="h-5 w-5" />
                    Go to Analysis Workspace
                </Link>
            </div>
        );
    }

    const { summary, alerts } = analysisResult;
    const sortedAlerts = [...alerts].sort((a, b) => {
        const severityOrder = { 'Critical': 4, 'High': 3, 'Moderate': 2, 'Low': 1 };
        return (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    }).slice(0, 5);

    const riskColorMap = {
        'Critical': '#ef4444', 
        'High': '#f97316',     
        'Moderate': '#eab308', 
        'Low': '#22c55e',      
    };
    
    const totalPesValue = pesPrograms.reduce((acc, p) => acc + p.indicativePaymentPerPeriodKes, 0);

    return (
        <div className="text-white space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="text-gray-400">Welcome back, {user?.email}. Here's the latest summary of forest activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Overall Forest Risk" 
                    value={summary.overall_forest_risk} 
                    icon={<HighIcon className="h-6 w-6 text-orange-400" />} 
                    color={riskColorMap[summary.overall_forest_risk]}
                />
                <StatCard 
                    title="Active Alerts" 
                    value={alerts.length} 
                    icon={<ModerateIcon className="h-6 w-6 text-yellow-400" />} 
                    color="#eab308"
                />
                 <StatCard 
                    title="Critical Threats" 
                    value={alerts.filter(a => a.severity === 'Critical').length} 
                    icon={<CriticalIcon className="h-6 w-6 text-red-500" />} 
                    color="#ef4444"
                />
                 <div className="bg-gray-900/50 p-4 rounded-lg flex items-center gap-4 border-l-4 border-emerald-500 cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => navigate('/dashboard/pes')}>
                    <div className={`p-3 rounded-full bg-gray-800`}><PesIcon className="h-6 w-6 text-emerald-400" /></div>
                    <div>
                        <p className="text-sm text-gray-400">PES Programs</p>
                        <p className="text-xl font-bold text-white">{pesPrograms.length} <span className="text-xs font-normal text-gray-500">(KES {(totalPesValue/1000).toFixed(1)}k)</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                    <h2 className="text-lg font-semibold mb-4">Recent High-Priority Alerts</h2>
                    {sortedAlerts.length > 0 ? (
                        <ul className="space-y-3">
                            {sortedAlerts.map(alert => (
                                <RecentAlertItem key={alert.id} alert={alert} onClick={() => handleAlertClick(alert)} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No high-priority alerts detected.</p>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                        <h2 className="text-lg font-semibold mb-3">Key Hotspots</h2>
                        {summary.key_hotspots.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1 text-gray-300">
                                {summary.key_hotspots.map(spot => <li key={spot}>{spot}</li>)}
                            </ul>
                        ) : (
                             <p className="text-gray-500">No specific hotspots identified.</p>
                        )}
                    </div>
                     <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4">
                        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
                        <div className="flex flex-col gap-2">
                             <Link to="/dashboard/analysis" className="text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">Run New Analysis</Link>
                             <Link to="/dashboard/map" className="text-center w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">View Full Map</Link>
                             <Link to="/dashboard/alerts" className="text-center w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">Manage All Alerts</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
