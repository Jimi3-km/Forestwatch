import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { CriticalIcon, HighIcon, LowIcon, ModerateIcon, FireIcon, LoggingIcon, EncroachmentIcon, InfoIcon } from '../components/icons';
import type { Alert as AlertType } from '../types';

const severityConfig: any = {
  Low: { icon: <LowIcon className="h-5 w-5 text-green-400" /> },
  Moderate: { icon: <ModerateIcon className="h-5 w-5 text-yellow-400" /> },
  High: { icon: <HighIcon className="h-5 w-5 text-orange-400" /> },
  Critical: { icon: <CriticalIcon className="h-5 w-5 text-red-500" /> },
};

const typeConfig: any = {
    fire: { icon: <FireIcon className="h-5 w-5 text-red-400" />, name: 'Fire' },
    logging: { icon: <LoggingIcon className="h-5 w-5 text-yellow-600" />, name: 'Illegal Logging' },
    encroachment: { icon: <EncroachmentIcon className="h-5 w-5 text-blue-400" />, name: 'Encroachment'},
    charcoal: { icon: <FireIcon className="h-5 w-5 text-gray-400" />, name: 'Charcoal Burning'},
    drought: { icon: <InfoIcon className="h-5 w-5 text-yellow-300" />, name: 'Drought Stress'},
    unknown: { icon: <InfoIcon className="h-5 w-5 text-gray-400" />, name: 'Unknown Anomaly'},
};

const AlertRow: React.FC<{ alert: AlertType; onSelect: (alert: AlertType) => void }> = ({ alert, onSelect }) => {
    const sConf = severityConfig[alert.severity];
    const tConf = typeConfig[alert.type];

    return (
        <tr className="bg-gray-800 hover:bg-gray-700/50 transition-colors">
            <td className="p-3 text-sm text-gray-300 flex items-center gap-2">{tConf.icon} {tConf.name}</td>
            <td className="p-3 text-sm text-gray-300 "><div className="flex items-center gap-2">{sConf.icon} {alert.severity}</div></td>
            <td className="p-3 text-sm text-gray-300 font-mono">{alert.threat_weight_score.toFixed(3)}</td>
            <td className="p-3 text-sm text-gray-300 font-mono">{`${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}`}</td>
            <td className="p-3 text-sm text-gray-300">{alert.explanation}</td>
            <td className="p-3 text-sm text-gray-300">
                <button 
                    onClick={() => onSelect(alert)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1 px-3 rounded-md text-xs"
                >
                    View on Map
                </button>
            </td>
        </tr>
    );
};

export default function OfficialAlertsPage(): React.ReactElement {
    const { analysisResult, setSelectedAlert } = useAppContext();
    const navigate = useNavigate();
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const filteredAlerts = useMemo(() => {
        return (analysisResult?.alerts ?? [])
            .filter(a => severityFilter === 'all' || a.severity === severityFilter)
            .filter(a => typeFilter === 'all' || a.type === typeFilter);
    }, [analysisResult, severityFilter, typeFilter]);

    const handleSelectAlert = (alert: AlertType) => {
        setSelectedAlert(alert);
        navigate('/dashboard/map');
    };

    if (!analysisResult) {
        return <div className="text-white text-center p-8">No analysis data available. <Link to="/dashboard/analysis" className="text-emerald-400 underline">Run analysis</Link> to see alerts.</div>
    }

    return (
        <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-4 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-white mb-4">Threats & Alerts</h1>
            {/* Filters */}
            <div className="flex gap-4 mb-4">
                 {/* Severity Filter */}
                <div>
                    <label htmlFor="severity-filter" className="text-sm font-medium text-gray-400 mr-2">Severity</label>
                    <select id="severity-filter" value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm">
                        <option value="all">All</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                 {/* Type Filter */}
                 <div>
                    <label htmlFor="type-filter" className="text-sm font-medium text-gray-400 mr-2">Type</label>
                    <select id="type-filter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm">
                        <option value="all">All</option>
                        {Object.entries(typeConfig).map(([key, val]: [string, any]) => <option key={key} value={key}>{val.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-xs text-gray-300 uppercase">
                        <tr>
                            <th className="p-3">Type</th>
                            <th className="p-3">Severity</th>
                            <th className="p-3">TWS</th>
                            <th className="p-3">Location</th>
                            <th className="p-3">Explanation</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlerts.map(alert => <AlertRow key={alert.id} alert={alert} onSelect={handleSelectAlert} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}