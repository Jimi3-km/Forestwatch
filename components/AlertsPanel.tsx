
import React, { useEffect, useRef } from 'react';
import type { Alert } from '../types';
import { CriticalIcon, HighIcon, LowIcon, ModerateIcon, SpinnerIcon, InfoIcon, FireIcon, LoggingIcon, EncroachmentIcon } from './icons';

interface AlertsPanelProps {
  alerts: Alert[];
  isLoading: boolean;
  selectedAlert: Alert | null;
  onAlertSelect: (alert: Alert | null) => void;
}

const severityConfig = {
  Low: {
    gradient: 'from-green-500/20 to-gray-800/10',
    borderColor: 'border-green-400',
    icon: <LowIcon className="h-5 w-5 text-green-400" />
  },
  Moderate: {
    gradient: 'from-yellow-500/20 to-gray-800/10',
    borderColor: 'border-yellow-400',
    icon: <ModerateIcon className="h-5 w-5 text-yellow-400" />
  },
  High: {
    gradient: 'from-orange-500/20 to-gray-800/10',
    borderColor: 'border-orange-400',
    icon: <HighIcon className="h-5 w-5 text-orange-400" />
  },
  Critical: {
    gradient: 'from-red-600/20 to-gray-800/10',
    borderColor: 'border-red-500',
    icon: <CriticalIcon className="h-5 w-5 text-red-500" />
  },
};

const typeConfig = {
    fire: { icon: <FireIcon className="h-5 w-5 text-red-400" />, name: 'Fire' },
    logging: { icon: <LoggingIcon className="h-5 w-5 text-yellow-600" />, name: 'Illegal Logging' },
    encroachment: { icon: <EncroachmentIcon className="h-5 w-5 text-blue-400" />, name: 'Encroachment'},
    charcoal: { icon: <FireIcon className="h-5 w-5 text-gray-400" />, name: 'Charcoal Burning'},
    drought: { icon: <InfoIcon className="h-5 w-5 text-yellow-300" />, name: 'Drought Stress'},
    unknown: { icon: <InfoIcon className="h-5 w-5 text-gray-400" />, name: 'Unknown Anomaly'},
}

const AlertCardSkeleton: React.FC = () => (
    <div className="p-3 bg-gray-700/30 rounded-lg border-l-4 border-gray-600 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-gray-600"></div>
                <div>
                    <div className="h-4 w-24 bg-gray-600 rounded"></div>
                    <div className="h-3 w-32 bg-gray-600 rounded mt-1"></div>
                </div>
            </div>
            <div className="h-6 w-20 bg-gray-600 rounded-full"></div>
        </div>
        <div className="h-3 w-full bg-gray-600 rounded mt-3 ml-8"></div>
    </div>
);


const AlertCard: React.FC<{ alert: Alert; isSelected: boolean; onAlertSelect: (alert: Alert) => void; }> = ({ alert, isSelected, onAlertSelect }) => {
  const { severity, type, location, explanation, threat_weight_score } = alert;
  const sConf = severityConfig[severity] || severityConfig.Low;
  const tConf = typeConfig[type] || typeConfig.unknown;

  return (
    <div
      id={`alert-card-${alert.id}`}
      onClick={() => onAlertSelect(alert)}
      className={`p-3 bg-gradient-to-r ${sConf.gradient} rounded-lg border-l-4 ${sConf.borderColor} cursor-pointer hover:bg-gray-700/60 transition-all duration-200 ${isSelected ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/10' : 'shadow-md shadow-black/20'}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0">{tConf.icon}</div>
            <div>
                <h4 className="font-semibold text-white">{tConf.name}</h4>
                <p className="text-xs text-gray-400 font-mono">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2 text-sm bg-gray-900/50 px-2 py-1 rounded-full">
          {sConf.icon}
          <span className="font-medium">{severity}</span>
        </div>
      </div>
      {/* Added leading-relaxed to improve readability of detailed explanations */}
      <p className="text-sm text-gray-300 mt-2 pl-8 leading-relaxed">{explanation}</p>
      <div className="text-xs text-gray-400 font-mono text-right mt-1 pl-8">
        TWS: <span className="font-semibold text-gray-200">{threat_weight_score.toFixed(3)}</span>
      </div>
    </div>
  );
}

export default function AlertsPanel({ alerts, isLoading, selectedAlert, onAlertSelect }: AlertsPanelProps): React.ReactElement {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedAlert && scrollContainerRef.current) {
      const element = document.getElementById(`alert-card-${selectedAlert.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedAlert]);

  const renderContent = () => {
    if (isLoading && alerts.length === 0) {
      return (
        <div className="space-y-3 p-1">
          <AlertCardSkeleton />
          <AlertCardSkeleton />
          <AlertCardSkeleton />
        </div>
      );
    }
    
    if (alerts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <InfoIcon className="h-8 w-8 mb-2"/>
          <p>No threats detected.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 p-1">
        {alerts.map((alert) => (
          <AlertCard 
            key={alert.id} 
            alert={alert} 
            isSelected={selectedAlert?.id === alert.id}
            onAlertSelect={onAlertSelect}
            />
        ))}
      </div>
    );
  };
  
  return (
    <>
      <h2 className="text-lg font-semibold text-white p-4 border-b border-green-400/20 flex-shrink-0">
        Detected Threats ({isLoading ? '...' : alerts.length})
      </h2>
      <div className="flex-grow overflow-y-auto p-4" ref={scrollContainerRef}>
        {renderContent()}
      </div>
    </>
  );
}
