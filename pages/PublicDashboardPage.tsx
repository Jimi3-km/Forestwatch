import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SummaryPanel from '../components/SummaryPanel';
import MapView from '../components/MapView';
import { analyzeForestData } from '../services/geminiService';
import { generateScenarioData } from '../utils/dataGenerator';
import type { ForestWatchResponse, ForestDataInput } from '../types';
import { LocationIcon, CameraIcon, PlantIcon, SpinnerIcon } from '../components/icons';

export default function PublicDashboardPage(): React.ReactElement {
  const navigate = useNavigate();
  const [publicData, setPublicData] = useState<ForestDataInput | null>(null);
  const [publicAnalysis, setPublicAnalysis] = useState<ForestWatchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Location State
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const data = generateScenarioData('imminent-wildfire');
        setPublicData(data);
        const result = await analyzeForestData(data);
        const newResponse: ForestWatchResponse = {
          ...result,
          timestamp: new Date().toISOString(),
          alerts: result.alerts.map((alert, index) => ({
            ...alert,
            id: `pub-${new Date().getTime()}-${index}`,
          })),
        };
        setPublicAnalysis(newResponse);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load public data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicData();
  }, []);

  const handleRequestLocation = () => {
      setLocationStatus('loading');
      if (!navigator.geolocation) {
          setLocationStatus('error');
          return;
      }
      navigator.geolocation.getCurrentPosition(
          (position) => {
              setUserLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              });
              setLocationStatus('success');
          },
          (err) => {
              console.error(err);
              setLocationStatus('error');
          }
      );
  };

  return (
    <div 
        className="flex-grow w-full h-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop')" }}
    >
        <div className="w-full h-full bg-gray-900/90 backdrop-blur-sm overflow-y-auto">
            <div className="container mx-auto p-4 lg:p-6 min-h-[calc(100vh-65px)] flex flex-col">
                
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                     <div>
                         <h1 className="text-2xl font-bold text-white">Public Forest Status</h1>
                         <p className="text-gray-400 text-sm">Monitor threats and contribute to preservation.</p>
                     </div>
                     
                     <div className="flex gap-3">
                         {/* Plant ID Button */}
                         <button 
                            onClick={() => navigate('/plant-id')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2 shadow-lg"
                         >
                             <CameraIcon className="h-5 w-5" />
                             Identify Plant
                         </button>

                         <Link to="/submit-report" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-lg">
                            Submit Report
                        </Link>
                     </div>
                </div>

                {/* Location Personalized Banner */}
                {locationStatus !== 'success' ? (
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <LocationIcon className="h-8 w-8 text-blue-400" />
                            <div>
                                <h3 className="font-bold text-white">Enable Local Alerts</h3>
                                <p className="text-sm text-blue-200">Forest Watch can filter threats relevant to your immediate area.</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleRequestLocation} 
                            disabled={locationStatus === 'loading'}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors flex items-center gap-2"
                        >
                            {locationStatus === 'loading' ? <SpinnerIcon className="h-4 w-4 animate-spin"/> : <LocationIcon className="h-4 w-4"/>}
                            {locationStatus === 'loading' ? 'Locating...' : 'Use My Location'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="flex items-center gap-3">
                            <div className="bg-emerald-800 p-2 rounded-full"><LocationIcon className="h-5 w-5 text-white" /></div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Local Forecast</h3>
                                <p className="text-xs text-emerald-300">Location Active</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="bg-gray-800 p-2 rounded-full"><PlantIcon className="h-5 w-5 text-yellow-400" /></div>
                             <div>
                                 <h3 className="font-bold text-white text-sm">Native Species</h3>
                                 <p className="text-xs text-gray-300">High biodiversity zone</p>
                             </div>
                        </div>
                         <div className="flex items-center gap-3">
                             <div className="bg-gray-800 p-2 rounded-full"><SpinnerIcon className="h-5 w-5 text-blue-400" /></div>
                             <div>
                                 <h3 className="font-bold text-white text-sm">Air Quality</h3>
                                 <p className="text-xs text-gray-300">Good (AQI 42)</p>
                             </div>
                        </div>
                    </div>
                )}
               
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow">
                     <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
                        <SummaryPanel 
                            summary={publicAnalysis?.summary ?? null} 
                            isLoading={isLoading} 
                            error={error}
                            history={publicAnalysis ? [publicAnalysis] : []}
                            activeHistoryIndex={0}
                            onHistorySelect={() => {}}
                        />
                        {/* Quick Tips Card */}
                        <div className="bg-gray-800/50 border border-green-400/20 rounded-lg p-4">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2"><PlantIcon className="h-5 w-5 text-emerald-400"/> Citizen Science</h3>
                            <p className="text-sm text-gray-300 mb-3">Found a plant you don't recognize? Use our new Plant ID tool to learn if it's invasive or endangered.</p>
                            <button onClick={() => navigate('/plant-id')} className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 font-semibold border border-emerald-500/50 rounded py-2 hover:bg-emerald-900/20 transition">
                                Launch Plant ID Tool
                            </button>
                        </div>
                    </div>
                    <div className="lg:col-span-8 xl:col-span-9 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-400/20 relative overflow-hidden min-h-[500px]">
                        <MapView
                            data={publicData}
                            alerts={publicAnalysis?.alerts ?? []}
                            selectedAlert={null}
                            onAlertSelect={() => {}}
                            userLocation={userLocation}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}