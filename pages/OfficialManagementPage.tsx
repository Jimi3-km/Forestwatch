
import React from 'react';

const mockSensors = [
    { id: 'SN-KRG-A-01', location: '-1.27, 36.81', status: 'Active', lastReading: '2 mins ago' },
    { id: 'SN-KRG-A-02', location: '-1.29, 36.83', status: 'Active', lastReading: '2 mins ago' },
    { id: 'SN-ABR-B-01', location: '-0.35, 36.78', status: 'Inactive', lastReading: '3 hours ago' },
];

const mockSatellites = [
    { name: 'Sentinel-2', provider: 'ESA', frequency: '5 days', status: 'Operational' },
    { name: 'Landsat 9', provider: 'NASA/USGS', frequency: '16 days', status: 'Operational' },
];

export default function OfficialManagementPage(): React.ReactElement {
    return (
        <div className="bg-gray-800/50 rounded-lg border border-green-400/20 p-6 h-full text-white">
            <h1 className="text-2xl font-bold mb-6">Sensor & Satellite Management</h1>

            {/* Sensor Management */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">Ground Sensors</h2>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded-md text-sm">
                        Add New Sensor
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-gray-900/50 rounded-lg">
                         <thead className="text-xs text-gray-300 uppercase">
                            <tr>
                                <th className="p-3">Sensor ID</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Last Reading</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                           {mockSensors.map(sensor => (
                                <tr key={sensor.id} className="border-t border-gray-700">
                                    <td className="p-3 text-sm font-mono">{sensor.id}</td>
                                    <td className="p-3 text-sm font-mono">{sensor.location}</td>
                                    <td className="p-3 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${sensor.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{sensor.status}</span></td>
                                    <td className="p-3 text-sm">{sensor.lastReading}</td>
                                    <td className="p-3 text-sm"><button className="text-emerald-400 hover:underline">Edit</button></td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Satellite Management */}
            <div>
                 <h2 className="text-lg font-semibold mb-3">Satellite Data Sources</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockSatellites.map(sat => (
                        <div key={sat.name} className="bg-gray-900/50 p-4 rounded-lg">
                            <h3 className="font-bold">{sat.name} <span className="text-xs text-gray-400">({sat.provider})</span></h3>
                            <p className="text-sm">Refresh: {sat.frequency}</p>
                            <p className="text-sm">Status: <span className="font-semibold text-green-400">{sat.status}</span></p>
                        </div>
                    ))}
                 </div>
            </div>

        </div>
    );
}
