
import React, { useState } from 'react';
import type { Alert, ForestDataInput, SatelliteTile, SensorReading, Report } from '../types';
import { CloseIcon, FireIcon, LoggingIcon, EncroachmentIcon, InfoIcon, SatelliteIcon, SensorIcon, ReportIcon, ChevronUpIcon, ChevronDownIcon } from './icons';

type MapEntity = Alert | SatelliteTile | SensorReading | Report;

interface AlertDetailViewProps {
  entity: MapEntity;
  dataInput?: ForestDataInput;
  onClose: () => void;
}

const typeConfig: Record<string, { icon: React.ReactNode; name: string }> = {
    fire: { icon: <FireIcon className="h-6 w-6 text-red-400" />, name: 'Fire' },
    logging: { icon: <LoggingIcon className="h-6 w-6 text-yellow-600" />, name: 'Illegal Logging' },
    encroachment: { icon: <EncroachmentIcon className="h-6 w-6 text-blue-400" />, name: 'Encroachment'},
    charcoal: { icon: <FireIcon className="h-6 w-6 text-gray-400" />, name: 'Charcoal Burning'},
    drought: { icon: <InfoIcon className="h-6 w-6 text-yellow-300" />, name: 'Drought Stress'},
    unknown: { icon: <InfoIcon className="h-6 w-6 text-gray-400" />, name: 'Unknown Anomaly'},
}

const EvidenceItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h5 className="text-xs font-semibold uppercase text-gray-400 tracking-wider">{title}</h5>
    <div className="mt-1 text-xs text-gray-300 font-mono bg-gray-900/50 p-2 rounded">
        {children}
    </div>
  </div>
);

function isAlert(entity: MapEntity): entity is Alert {
    return (entity as Alert).severity !== undefined;
}

function isSatellite(entity: MapEntity): entity is SatelliteTile {
    return (entity as SatelliteTile).risk_score !== undefined;
}

function isSensor(entity: MapEntity): entity is SensorReading {
    return (entity as SensorReading).temperature !== undefined;
}

function isReport(entity: MapEntity): entity is Report {
    return (entity as Report).report_id !== undefined;
}

interface DetailPanelProps {
    title: string;
    subTitle?: string;
    icon: React.ReactNode;
    onClose: () => void;
    children: React.ReactNode;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ title, subTitle, icon, onClose, children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`absolute bottom-4 left-4 right-4 md:left-auto md:max-w-md w-full bg-gray-800/90 backdrop-blur-md rounded-lg border border-green-400/20 shadow-2xl z-20 text-white overflow-hidden transition-all duration-300 animate-fade-in-up flex flex-col ${collapsed ? 'h-auto' : 'max-h-[70vh]'}`}>
             <div className="p-4 flex justify-between items-start bg-black/20 border-b border-white/5 cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold truncate pr-2">{title}</h3>
                         {subTitle && <p className="text-xs font-mono text-gray-400 truncate">{subTitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); }} 
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                        {collapsed ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onClose(); }} 
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            
            {!collapsed && (
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            )}
             <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 2px;
                }
            `}</style>
        </div>
    );
}


export default function AlertDetailView({ entity, dataInput, onClose }: AlertDetailViewProps) {
  
  if (isAlert(entity)) {
      const { type, severity, location, confidence, explanation, recommended_action, supporting_evidence } = entity;
      const tConf = typeConfig[type] || typeConfig.unknown;

      return (
        <DetailPanel 
            title={`${tConf.name} Alert`} 
            subTitle={`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`}
            icon={tConf.icon} 
            onClose={onClose}
        >
            <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                <div className="bg-gray-900/50 p-2 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase font-semibold">Severity</div>
                    <div className={`text-lg font-bold ${severity === 'Critical' ? 'text-red-500' : severity === 'High' ? 'text-orange-400' : severity === 'Moderate' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {severity}
                    </div>
                </div>
                <div className="bg-gray-900/50 p-2 rounded-lg">
                    <div className="text-xs text-gray-400 uppercase font-semibold">Confidence</div>
                    <div className="text-lg font-bold text-white">{(confidence * 100).toFixed(0)}%</div>
                </div>
            </div>
    
            <div className="mb-4">
                <h4 className="font-semibold text-gray-200 text-sm mb-1">Explanation</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{explanation}</p>
            </div>
    
             <div className="mb-4">
                <h4 className="font-semibold text-gray-200 text-sm mb-1">Recommended Action</h4>
                <p className="text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-500/30 p-2 rounded-md">{recommended_action}</p>
            </div>
    
            {dataInput && (
                <div className="space-y-3 pt-2 border-t border-gray-700">
                    <h4 className="font-semibold text-gray-200 text-sm">Supporting Evidence</h4>
                    {supporting_evidence.satellite_ids.length > 0 && (
                        <EvidenceItem title="Satellite Tiles">
                            {supporting_evidence.satellite_ids.map(id => {
                                const tile = dataInput.satellite_tiles.find(t => t.id === id);
                                return <div key={id}>{id} (Risk: {tile?.risk_score.toFixed(2)}, Type: {tile?.change_type})</div>
                            })}
                        </EvidenceItem>
                    )}
                    {supporting_evidence.sensor_ids.length > 0 && (
                        <EvidenceItem title="Sensor Readings">
                             {supporting_evidence.sensor_ids.map(id => {
                                const sensor = dataInput.sensor_readings.find(s => s.sensor_id === id);
                                return <div key={id}>{id} (Temp: {sensor?.temperature.toFixed(1)}°C, Smoke: {sensor?.smoke_level.toFixed(2)})</div>
                            })}
                        </EvidenceItem>
                    )}
                    {supporting_evidence.report_ids.length > 0 && (
                        <EvidenceItem title="Community Reports">
                             {supporting_evidence.report_ids.map(id => {
                                const report = dataInput.reports.find(r => r.report_id === id);
                                return <div key={id}>{id} ({report?.description})</div>
                            })}
                        </EvidenceItem>
                    )}
                </div>
            )}
        </DetailPanel>
      );
  }

  if (isSatellite(entity)) {
      return (
        <DetailPanel 
            title="Satellite Tile" 
            subTitle={`ID: ${entity.id}`}
            icon={<SatelliteIcon className="h-6 w-6 text-blue-300" />} 
            onClose={onClose}
        >
             <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                    <span className="text-gray-400">Change Type</span>
                    <span className="font-semibold text-yellow-400 uppercase">{entity.change_type}</span>
                </div>
                <div className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                    <span className="text-gray-400">Risk Score</span>
                    <span className="font-mono font-bold text-white">{entity.risk_score.toFixed(2)}</span>
                </div>
                <div className="mt-2">
                    <span className="text-xs text-gray-500 block mb-1">Boundary Coordinates (First Point)</span>
                    <code className="text-xs text-gray-400 bg-gray-950 p-1 rounded block overflow-hidden text-ellipsis">
                        {JSON.stringify(entity.coordinates[0])}
                    </code>
                </div>
            </div>
        </DetailPanel>
      );
  }

  if (isSensor(entity)) {
    return (
        <DetailPanel 
            title="IoT Sensor Node" 
            subTitle={`ID: ${entity.sensor_id}`}
            icon={<SensorIcon className="h-6 w-6 text-emerald-300" />} 
            onClose={onClose}
        >
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-900/50 p-2 rounded">
                    <span className="text-[10px] text-gray-400 uppercase block mb-1">Temp</span>
                    <span className={`font-semibold ${entity.temperature > 40 ? 'text-red-400' : 'text-white'}`}>{entity.temperature.toFixed(1)}°C</span>
                </div>
                <div className="bg-gray-900/50 p-2 rounded">
                    <span className="text-[10px] text-gray-400 uppercase block mb-1">Smoke</span>
                    <span className={`font-semibold ${entity.smoke_level > 0.5 ? 'text-orange-400' : 'text-white'}`}>{entity.smoke_level.toFixed(2)}</span>
                </div>
                <div className="bg-gray-900/50 p-2 rounded">
                    <span className="text-[10px] text-gray-400 uppercase block mb-1">Noise</span>
                    <span className={`font-semibold ${entity.noise_level > 70 ? 'text-yellow-400' : 'text-white'}`}>{entity.noise_level.toFixed(0)}dB</span>
                </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 bg-gray-900/30 p-2 rounded">
                <span>Last Update:</span>
                <span className="font-mono text-gray-300">{new Date(entity.timestamp).toLocaleTimeString()}</span>
            </div>
             <div className="mt-3 text-xs text-gray-500 font-mono">
                Loc: {entity.location.lat.toFixed(5)}, {entity.location.lng.toFixed(5)}
            </div>
        </DetailPanel>
    );
}

if (isReport(entity)) {
    return (
        <DetailPanel 
            title="Community Report" 
            subTitle={`ID: ${entity.report_id}`}
            icon={<ReportIcon className="h-6 w-6 text-blue-400" />} 
            onClose={onClose}
        >
             <div className="space-y-3 text-sm">
                <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Category</span>
                    <div className="font-semibold capitalize text-yellow-300 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-300"></span>
                        {entity.category}
                    </div>
                </div>
                <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Observation</span>
                    <p className="italic text-gray-300 bg-gray-900/30 p-3 rounded mt-1 border-l-2 border-blue-500">
                        "{entity.description}"
                    </p>
                </div>
                 <div className="flex justify-between items-center text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700">
                    <span>Reported Time:</span>
                    <span className="font-mono text-gray-300">{new Date(entity.timestamp).toLocaleString()}</span>
                </div>
                 <div className="text-xs text-gray-500 font-mono">
                    Loc: {entity.location.lat.toFixed(5)}, {entity.location.lng.toFixed(5)}
                </div>
            </div>
        </DetailPanel>
    );
}

return null;

}
