import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const DataViewer: React.FC<{ title: string, data: any }> = ({ title, data }) => (
    <div>
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <div className="bg-gray-900/70 border border-green-400/20 rounded-md p-2 text-xs font-mono text-gray-400 max-h-64 overflow-y-auto">
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    </div>
);

export default function OfficialDataInputsPage(): React.ReactElement {
    const { rawInput } = useAppContext();
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-6 h-full text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Data Inputs Inspector</h1>
                <button
                    onClick={() => navigate('/dashboard/analysis')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    View in Analysis Workspace
                </button>
            </div>
            
            <div className="space-y-6">
                <DataViewer title="Satellite Tiles" data={rawInput.satellite_tiles} />
                <DataViewer title="Sensor Readings" data={rawInput.sensor_readings} />
                <DataViewer title="Community Reports" data={rawInput.reports} />
            </div>
        </div>
    );
}