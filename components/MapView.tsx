




import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ForestDataInput, Alert, SatelliteTile, SensorReading, Report, RestorationProject, PesProgram } from '../types';
import { FitViewIcon, PlantIcon, LocationIcon } from './icons';
import AlertDetailView from './AlertDetailView';
import { useAppContext } from '../contexts/AppContext'; 

interface MapViewProps {
  data: ForestDataInput | null;
  alerts: Alert[];
  selectedAlert: Alert | null;
  onAlertSelect: (alert: Alert | null) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 1000;

// Kenya Bounding Box (Strict)
const KENYA_BOUNDS = {
    minLng: 33.5,
    maxLng: 42.0,
    minLat: -5.0,
    maxLat: 5.5
};

// Approximate Boundary Points of Kenya (Lat, Lng) for dynamic polygon generation
const KENYA_BOUNDARY_POINTS = [
    { lat: 4.6, lng: 35.5 },  // NW Corner (Turkana)
    { lat: 3.9, lng: 41.8 },  // NE Corner (Mandera)
    { lat: -1.0, lng: 41.0 }, // East (Somalia Border)
    { lat: -2.0, lng: 40.7 }, // Coast North
    { lat: -4.7, lng: 39.2 }, // South Coast (Shimoni)
    { lat: -3.0, lng: 37.5 }, // South (Kilimanjaro border)
    { lat: -1.0, lng: 34.0 }, // SW (Lake Victoria)
    { lat: 1.0, lng: 34.5 },  // West (Mt Elgon)
    { lat: 4.6, lng: 35.5 }   // Close loop
];

// 6 Situations Color Mapping
const situationConfig: Record<string, { color: string; label: string }> = {
    fire: { color: '#ef4444', label: 'Wildfire Heatzone' },          // Red-500
    logging: { color: '#d97706', label: 'Illegal Logging Activity' }, // Amber-600
    encroachment: { color: '#3b82f6', label: 'Encroachment Area' }, // Blue-500
    charcoal: { color: '#71717a', label: 'Charcoal Burning Smoke' }, // Zinc-500
    drought: { color: '#f97316', label: 'Drought / Dry Zone' },   // Orange-500
    unknown: { color: '#a855f7', label: 'Anomaly' },   // Purple-500
};

// --- Helper Functions ---

// Projects Lat/Lng to SVG Coordinates based on Kenya's Bounds
const projectPoint = (lat: number, lng: number): { x: number, y: number } => {
    const { minLng, maxLng, minLat, maxLat } = KENYA_BOUNDS;
    
    // Normalize to 0-1
    const xNorm = (lng - minLng) / (maxLng - minLng);
    const yNorm = (lat - minLat) / (maxLat - minLat);

    // Scale to Map Dimensions (Invert Y because SVG Y goes down)
    const x = xNorm * MAP_WIDTH;
    const y = MAP_HEIGHT - (yNorm * MAP_HEIGHT);

    return { x, y };
};

const calculateBounds = (points: { x: number, y: number }[]) => {
    if (points.length === 0) {
        return { minX: 0, maxX: MAP_WIDTH, minY: 0, maxY: MAP_HEIGHT };
    }
    return points.reduce(
        (acc, p) => ({
          minX: Math.min(acc.minX, p.x),
          maxX: Math.max(acc.maxX, p.x),
          minY: Math.min(acc.minY, p.y),
          maxY: Math.max(acc.maxY, p.y),
        }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
};

const calculateTransformForBounds = (bounds: { minX: number, minY: number, maxX: number, maxY: number }, zoomFactor = 1) => {
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    if (width === 0 || height === 0) {
        return { x: MAP_WIDTH / 2 - bounds.minX, y: MAP_HEIGHT / 2 - bounds.minY, scale: 50 * zoomFactor };
    }
    
    const padding = 150; // Pixels padding around the bounds
    const availableWidth = MAP_WIDTH - (padding * 2);
    const availableHeight = MAP_HEIGHT - (padding * 2);

    const scaleX = availableWidth / width;
    const scaleY = availableHeight / height;
    const scale = Math.min(scaleX, scaleY) * zoomFactor;

    // Center the bounds
    const centerX = bounds.minX + width / 2;
    const centerY = bounds.minY + height / 2;

    const translateX = (MAP_WIDTH / 2) - (centerX * scale);
    const translateY = (MAP_HEIGHT / 2) - (centerY * scale);

    return { x: translateX, y: translateY, scale };
};

// Type guards for local use
const isSensor = (item: any): item is SensorReading => (item as SensorReading).sensor_id !== undefined;
const isReport = (item: any): item is Report => (item as Report).report_id !== undefined;
const isSatellite = (item: any): item is SatelliteTile => (item as SatelliteTile).risk_score !== undefined;


// --- Component ---

export default function MapView({ data, alerts, selectedAlert, onAlertSelect, userLocation }: MapViewProps): React.ReactElement {
  const { restorationProjects, pesPrograms } = useAppContext(); // Get projects and PES programs
  const navigate = useNavigate();
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [viewMode, setViewMode] = useState<'all' | 'alerts'>('all');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showRestoration, setShowRestoration] = useState(true); // New toggle
  const [selectedDataItem, setSelectedDataItem] = useState<SatelliteTile | SensorReading | Report | null>(null);
  const [activePesProgram, setActivePesProgram] = useState<PesProgram | null>(null);

  const allPoints = useMemo(() => [
      ...(data?.satellite_tiles.flatMap(t => t.coordinates.map(c => ({ lat: c[0], lng: c[1] }))) ?? []),
      ...(data?.sensor_readings.map(s => s.location) ?? []),
      ...(data?.reports.map(r => r.location) ?? []),
      ...(alerts.map(a => a.location)),
      ...(restorationProjects.map(p => p.location)),
      ...(pesPrograms.filter(p => p.location).map(p => p.location!))
  ], [data, alerts, restorationProjects, pesPrograms]);

  const fitView = useCallback((pointsToFit: {lat: number, lng: number}[], zoom = 0.9) => {
     if (pointsToFit.length === 0) {
        // Default to showing full Kenya if no data
        const kenyaCenter = { lat: 0.0236, lng: 37.9062 };
        const proj = projectPoint(kenyaCenter.lat, kenyaCenter.lng);
        setTransform({ x: MAP_WIDTH/2 - proj.x, y: MAP_HEIGHT/2 - proj.y, scale: 1 }); 
        return;
    }
    const projectedPoints = pointsToFit.map(p => projectPoint(p.lat, p.lng));
    const bounds = calculateBounds(projectedPoints);
    setTransform(calculateTransformForBounds(bounds, zoom));
  }, []);

  // Initial Fit
  useEffect(() => {
    if (userLocation) {
        fitView([userLocation], 2.5); // Zoom into user
    } else if (allPoints.length > 0) {
        fitView(allPoints, 0.9);
    } else {
        // Default view of Kenya
         const kenyaProj = KENYA_BOUNDARY_POINTS.map(p => projectPoint(p.lat, p.lng));
         const bounds = calculateBounds(kenyaProj);
         setTransform(calculateTransformForBounds(bounds, 0.9));
    }
  }, [allPoints.length, fitView, userLocation]); 

  // Focus on selection
  useEffect(() => {
    if (selectedAlert) {
      setSelectedDataItem(null); 
      setActivePesProgram(null);
      fitView([selectedAlert.location], 8); 
    } else if (alerts.length > 0 && viewMode === 'alerts') {
      fitView(alerts.map(a => a.location));
    }
  }, [selectedAlert, alerts, viewMode, fitView]);

  // Clear background selection when switching to alerts only mode
  useEffect(() => {
    if (viewMode === 'alerts') {
        setSelectedDataItem(null);
        setActivePesProgram(null);
    }
  }, [viewMode]);

  // --- PES Link Helper ---
  const checkPesLink = (id: string, projectPesId?: string) => {
      if (projectPesId) return true; // Direct restoration project link
      // Check if ID is in any program's linked areas
      return pesPrograms.some(p => 
          p.linkedForestAreaIds?.includes(id) || 
          p.linkedWasteZoneIds?.includes(id)
      );
  };


  const pointTransitionStyle: React.CSSProperties = {
    transition: 'transform 1.5s ease-in-out',
  };

  const scaledStrokeWidth = 1 / transform.scale;
  const activeEntity = selectedAlert || selectedDataItem;

  const handleDataClick = (e: React.MouseEvent, item: SatelliteTile | SensorReading | Report) => {
      e.stopPropagation();
      onAlertSelect(null);
      setActivePesProgram(null);
      setSelectedDataItem(item);
  };

  const handleBackgroundClick = () => {
      onAlertSelect(null);
      setSelectedDataItem(null);
      setActivePesProgram(null);
  };

  // Dynamic Kenya Path
  const kenyaPathString = useMemo(() => {
      return KENYA_BOUNDARY_POINTS.map((p, i) => {
          const proj = projectPoint(p.lat, p.lng);
          return `${i === 0 ? 'M' : 'L'} ${proj.x} ${proj.y}`;
      }).join(' ') + ' Z';
  }, []);

  return (
    <>
       {/* Header Overlays */}
       <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 pointer-events-none">
            <h2 className="text-lg font-semibold text-white bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm w-fit border border-white/10">
                Kenya National Monitor
            </h2>
       </div>
       
       {/* Legend */}
       <div className="absolute bottom-4 right-4 z-10 bg-gray-900/90 backdrop-blur-md p-3 rounded-lg border border-gray-700 shadow-xl max-w-[220px]">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 border-b border-gray-700 pb-1">Analysis Layers</h4>
            <div className="space-y-2">
                 {userLocation && (
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 border border-white flex items-center justify-center"></div>
                        <span className="text-xs text-gray-300">Your Location</span>
                    </div>
                 )}
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
                    <span className="text-xs text-gray-300">IoT Sensor Network</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-400 border border-white"></span>
                    <span className="text-xs text-gray-300">Mangrove Restoration</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 flex items-center justify-center rounded-full border border-yellow-500 text-[8px] text-yellow-500 font-bold">$</span>
                    <span className="text-xs text-yellow-400">PES Funded Site</span>
                </div>
                {Object.entries(situationConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: config.color }}></span>
                        <span className="text-xs text-gray-300">{config.label}</span>
                    </div>
                ))}
            </div>
       </div>

       {/* Controls */}
       <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
            <button
                onClick={() => fitView(viewMode === 'alerts' ? alerts.map(a => a.location) : allPoints)}
                className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 text-white p-2 rounded-md shadow-lg transition-all duration-200 border border-green-400/20 self-end"
                title="Reset Zoom"
            >
                <FitViewIcon className="h-5 w-5" />
            </button>

            <div className="bg-gray-900/80 backdrop-blur-sm rounded-md p-1 flex flex-col gap-1 border border-green-400/20 shadow-lg">
                 <div className="flex bg-gray-800 rounded p-0.5">
                     <button
                        onClick={() => setViewMode('all')}
                        className={`flex-1 px-3 py-1 text-xs font-semibold rounded transition-colors ${viewMode === 'all' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                     >
                        All Data
                     </button>
                     <button
                        onClick={() => setViewMode('alerts')}
                        className={`flex-1 px-3 py-1 text-xs font-semibold rounded transition-colors ${viewMode === 'alerts' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                     >
                        Alerts Only
                     </button>
                 </div>
                 <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${showHeatmap ? 'text-emerald-400' : 'text-gray-500'}`}
                 >
                    {showHeatmap ? 'Heatmap: ON' : 'Heatmap: OFF'}
                 </button>
                  <button
                    onClick={() => setShowRestoration(!showRestoration)}
                    className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${showRestoration ? 'text-teal-400' : 'text-gray-500'}`}
                 >
                    {showRestoration ? 'Restoration: ON' : 'Restoration: OFF'}
                 </button>
            </div>
       </div>

        {activeEntity && (
            <AlertDetailView
                entity={activeEntity}
                dataInput={data || undefined}
                onClose={() => {
                    onAlertSelect(null);
                    setSelectedDataItem(null);
                }}
            />
        )}

      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-full bg-gray-950" onClick={handleBackgroundClick}>
        <defs>
            {/* Glow Filter for Heatmap */}
            <filter id="heatmapBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
            
            {/* Subtle Grid Pattern */}
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1"/>
            </pattern>

             <radialGradient id="landGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#064e3b" stopOpacity="0.1" />
            </radialGradient>
        </defs>
        
        {/* Background Grid */}
        <rect x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />
        
        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`} style={{ transition: 'transform 0.75s cubic-bezier(0.25, 0.1, 0.25, 1)' }}>
            
            {/* Kenya Base Map */}
            <path 
                d={kenyaPathString}
                fill="url(#landGradient)" 
                stroke="#10b981" 
                strokeWidth={2 * scaledStrokeWidth}
                strokeLinejoin="round"
            />

            {/* User Location Marker */}
            {userLocation && (
                <g transform={`translate(${projectPoint(userLocation.lat, userLocation.lng).x}, ${projectPoint(userLocation.lat, userLocation.lng).y})`}>
                    <circle r={12 * scaledStrokeWidth} fill="rgba(59, 130, 246, 0.3)">
                         <animate attributeName="r" from={12 * scaledStrokeWidth} to={20 * scaledStrokeWidth} dur="1.5s" repeatCount="indefinite"/>
                         <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    <circle r={6 * scaledStrokeWidth} fill="#3b82f6" stroke="white" strokeWidth={2 * scaledStrokeWidth} />
                </g>
            )}

            {/* Heatmap Layer (Behind main points) */}
            {showHeatmap && (
                <g filter="url(#heatmapBlur)" opacity="0.6">
                    {alerts.map(alert => {
                        const { x, y } = projectPoint(alert.location.lat, alert.location.lng);
                        const config = situationConfig[alert.type] || situationConfig.unknown;
                        // Heat size based on severity
                        const radius = alert.severity === 'Critical' ? 80 : alert.severity === 'High' ? 60 : 40;
                        return (
                            <circle 
                                key={`heat-${alert.id}`} 
                                cx={x} 
                                cy={y} 
                                r={radius * scaledStrokeWidth} 
                                fill={config.color}
                            />
                        );
                    })}
                     {/* Heat from High Temp Sensors */}
                     {data?.sensor_readings.filter(s => s.temperature > 35).map(s => {
                         const { x, y } = projectPoint(s.location.lat, s.location.lng);
                         return (
                             <circle 
                                key={`heat-sensor-${s.sensor_id}`}
                                cx={x}
                                cy={y}
                                r={40 * scaledStrokeWidth}
                                fill="#f97316" // Orange for heat
                                opacity={0.5}
                             />
                         );
                     })}
                </g>
            )}

            {/* PES Program Markers */}
            {viewMode === 'all' && pesPrograms.map(program => {
                if (!program.location) return null;
                const { x, y } = projectPoint(program.location.lat, program.location.lng);
                const isSelected = activePesProgram?.id === program.id;
                const size = 24 * scaledStrokeWidth;

                return (
                    <g 
                        key={program.id} 
                        transform={`translate(${x}, ${y})`} 
                        onClick={(e) => { e.stopPropagation(); setActivePesProgram(program); }} 
                        className="cursor-pointer hover:opacity-80"
                    >
                        {/* Marker Shape */}
                        <circle r={size / 2} fill="#fbbf24" stroke="white" strokeWidth={2 * scaledStrokeWidth} />
                        <text y={size / 6} fontSize={size / 1.5} textAnchor="middle" fill="#78350f" fontWeight="bold" pointerEvents="none">$</text>

                        {/* Tooltip (Only if selected) */}
                        {isSelected && (
                            <g transform={`translate(0, ${-size})`}>
                                {/* Bubble Background */}
                                <rect 
                                    x={-60 * scaledStrokeWidth} 
                                    y={-40 * scaledStrokeWidth} 
                                    width={120 * scaledStrokeWidth} 
                                    height={35 * scaledStrokeWidth} 
                                    rx={4 * scaledStrokeWidth} 
                                    fill="white" 
                                    stroke="#fbbf24" 
                                    strokeWidth={scaledStrokeWidth} 
                                />
                                {/* Arrow */}
                                <path d={`M 0 ${-5 * scaledStrokeWidth} L ${-5 * scaledStrokeWidth} ${-5 * scaledStrokeWidth} L 0 0 L ${5 * scaledStrokeWidth} ${-5 * scaledStrokeWidth} Z`} fill="white" />

                                {/* Text Name */}
                                <text x={0} y={-25 * scaledStrokeWidth} textAnchor="middle" fontSize={10 * scaledStrokeWidth} fontWeight="bold" fill="#1f2937" pointerEvents="none">
                                    {program.name.length > 15 ? program.name.substring(0, 14) + '...' : program.name}
                                </text>

                                {/* Link Text */}
                                <text 
                                    x={0} 
                                    y={-12 * scaledStrokeWidth} 
                                    textAnchor="middle" 
                                    fontSize={9 * scaledStrokeWidth} 
                                    fill="#059669" 
                                    fontWeight="bold" 
                                    style={{ textDecoration: 'underline' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/dashboard/pes');
                                    }}
                                >
                                    View Details
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}
            
             {/* Restoration Projects Layer (Mangrove Zones) */}
             {showRestoration && restorationProjects.map(project => {
                const { x, y } = projectPoint(project.location.lat, project.location.lng);
                const isPesLinked = checkPesLink(project.id, project.incentives.pesProgramId);
                
                return (
                    <g key={project.id} transform={`translate(${x}, ${y})`} className="cursor-pointer hover:opacity-80 group">
                        {/* Zone Circle */}
                        <circle 
                            r={20 * scaledStrokeWidth} 
                            fill="rgba(45, 212, 191, 0.2)" 
                            stroke={isPesLinked ? "#fbbf24" : "#2dd4bf"} 
                            strokeWidth={isPesLinked ? 2 * scaledStrokeWidth : scaledStrokeWidth}
                        />
                        {isPesLinked && (
                             <circle 
                                r={24 * scaledStrokeWidth} 
                                fill="none"
                                stroke="#fbbf24" 
                                strokeWidth={scaledStrokeWidth}
                                strokeDasharray={`${scaledStrokeWidth * 3},${scaledStrokeWidth * 3}`}
                                opacity="0.6"
                            />
                        )}
                        {/* Plant Icon in Center */}
                         <text 
                            x={0} 
                            y={5 * scaledStrokeWidth} 
                            fontSize={12 * scaledStrokeWidth} 
                            textAnchor="middle" 
                            fill={isPesLinked ? "#fbbf24" : "#2dd4bf"}
                            pointerEvents="none"
                        >
                            🌱
                        </text>
                        <text 
                            y={-25 * scaledStrokeWidth} 
                            fontSize={8 * scaledStrokeWidth} 
                            textAnchor="middle" 
                            fill={isPesLinked ? "#fbbf24" : "#2dd4bf"}
                            fontWeight="bold"
                        >
                            {project.ecosystem.toUpperCase()}
                        </text>
                        
                        {/* PES Badge */}
                        {isPesLinked && (
                            <g transform={`translate(${15 * scaledStrokeWidth}, ${-15 * scaledStrokeWidth})`}>
                                <circle r={6 * scaledStrokeWidth} fill="#fbbf24" stroke="black" strokeWidth={0.5 * scaledStrokeWidth} />
                                <text y={2 * scaledStrokeWidth} fontSize={8 * scaledStrokeWidth} textAnchor="middle" fill="black" fontWeight="bold">$</text>
                            </g>
                        )}
                    </g>
                );
             })}

            {/* Satellite Tiles (Polygons) */}
            {viewMode === 'all' && data?.satellite_tiles.map(tile => {
                const points = tile.coordinates.map(c => projectPoint(c[0], c[1])).map(p => `${p.x},${p.y}`).join(' ');
                const isSelected = selectedDataItem === tile;
                const isPesLinked = checkPesLink(tile.id);

                return (
                    <g key={tile.id} onClick={(e) => handleDataClick(e, tile)}>
                        <polygon 
                            points={points} 
                            fill={tile.change_type === 'fire' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)'} 
                            stroke={isSelected ? "white" : isPesLinked ? "#fbbf24" : tile.change_type === 'fire' ? '#ef4444' : '#eab308'}
                            strokeWidth={isPesLinked ? 2 * scaledStrokeWidth : scaledStrokeWidth} 
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                        {isPesLinked && (
                             <polygon 
                                points={points}
                                fill="none"
                                stroke="#fbbf24"
                                strokeWidth={scaledStrokeWidth}
                                strokeDasharray={`${scaledStrokeWidth * 2},${scaledStrokeWidth * 2}`}
                                opacity="0.8"
                                pointerEvents="none"
                             />
                        )}
                         {isSelected && (
                             <polygon 
                                points={points}
                                fill="none"
                                stroke="white"
                                strokeWidth={scaledStrokeWidth * 2}
                                strokeDasharray={`${scaledStrokeWidth * 5},${scaledStrokeWidth * 5}`}
                                className="animate-pulse"
                                pointerEvents="none"
                             />
                         )}
                    </g>
                );
            })}

            {/* Community Reports (Triangles) */}
            {viewMode === 'all' && data?.reports.map(report => {
                const { x, y } = projectPoint(report.location.lat, report.location.lng);
                const isSelected = selectedDataItem === report;
                return (
                    <g key={report.report_id} transform={`translate(${x}, ${y})`} style={pointTransitionStyle} onClick={(e) => handleDataClick(e, report)} className="cursor-pointer hover:scale-110">
                         {isSelected && (
                            <circle r={15 * scaledStrokeWidth} fill="none" stroke="#3b82f6" strokeWidth={scaledStrokeWidth} opacity="0.5">
                                <animate attributeName="r" from={15 * scaledStrokeWidth} to={25 * scaledStrokeWidth} dur="1.5s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                         )}
                         {/* Shadow */}
                         <path d={`M 0 ${-8 * scaledStrokeWidth} L ${6 * scaledStrokeWidth} ${6 * scaledStrokeWidth} L ${-6 * scaledStrokeWidth} ${6 * scaledStrokeWidth} Z`} fill="black" opacity="0.5" transform={`translate(2, 2)`} />
                        <path 
                            d={`M 0 ${-8 * scaledStrokeWidth} L ${6 * scaledStrokeWidth} ${6 * scaledStrokeWidth} L ${-6 * scaledStrokeWidth} ${6 * scaledStrokeWidth} Z`} 
                            fill="#3b82f6"
                            stroke={isSelected ? "white" : "#1d4ed8"}
                            strokeWidth={scaledStrokeWidth} 
                        />
                    </g>
                );
            })}

            {/* Sensor Locations (Circles) */}
            {viewMode === 'all' && data?.sensor_readings.map(sensor => {
                const { x, y } = projectPoint(sensor.location.lat, sensor.location.lng);
                const isSelected = selectedDataItem === sensor;
                const isPesLinked = checkPesLink(sensor.sensor_id);

                return (
                    <g key={sensor.sensor_id} transform={`translate(${x}, ${y})`} style={pointTransitionStyle} onClick={(e) => handleDataClick(e, sensor)} className="cursor-pointer hover:scale-125 transition-transform">
                         {isSelected && (
                            <circle r={15 * scaledStrokeWidth} fill="none" stroke="#10b981" strokeWidth={scaledStrokeWidth} opacity="0.5">
                                <animate attributeName="r" from={15 * scaledStrokeWidth} to={25 * scaledStrokeWidth} dur="1.5s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                         )}
                         {/* Pulse for active sensors (background activity) */}
                        {!isSelected && (
                            <circle r={6 * scaledStrokeWidth} fill="#10b981" opacity="0.3">
                                <animate attributeName="r" from={6 * scaledStrokeWidth} to={10 * scaledStrokeWidth} dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                            </circle>
                        )}
                        <circle 
                            r={isSelected ? 6 * scaledStrokeWidth : 3 * scaledStrokeWidth}
                            fill="#10b981"
                            stroke={isPesLinked ? "#fbbf24" : "white"} 
                            strokeWidth={isPesLinked ? 2 * scaledStrokeWidth : scaledStrokeWidth}
                        />
                        {isPesLinked && (
                             <circle 
                                r={8 * scaledStrokeWidth} 
                                fill="none"
                                stroke="#fbbf24" 
                                strokeWidth={0.5 * scaledStrokeWidth}
                                opacity="0.8"
                            />
                        )}
                    </g>
                );
            })}
            
            {/* Situation Alerts (Pulsing Rings on top) */}
            {alerts.map((alert) => {
              const { x, y } = projectPoint(alert.location.lat, alert.location.lng);
              const isSelected = selectedAlert?.id === alert.id;
              const config = situationConfig[alert.type] || situationConfig.unknown;
              
              // Base radius
              const radius = isSelected ? 12 * scaledStrokeWidth : 8 * scaledStrokeWidth;

              return (
                <g 
                    key={alert.id} 
                    transform={`translate(${x}, ${y})`} 
                    className="cursor-pointer" 
                    style={pointTransitionStyle} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDataItem(null);
                        setActivePesProgram(null);
                        onAlertSelect(alert);
                    }}
                >
                    {/* Active Pulse */}
                    <circle r={radius} fill="none" stroke={config.color} strokeWidth={scaledStrokeWidth} opacity="0.5">
                        <animate attributeName="r" from={radius} to={radius * 2} dur="1.5s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite"/>
                    </circle>
                    
                    {/* Core Alert Dot */}
                    <circle 
                        r={radius} 
                        fill={config.color} 
                        stroke="white" 
                        strokeWidth={2 * scaledStrokeWidth} 
                        filter={isSelected ? "url(#heatmapBlur)" : "none"} // Re-using blur for glow selection
                    />
                </g>
              );
            })}
            
            {/* Map Labels */}
            <text x={projectPoint(0.5, 37.5).x} y={projectPoint(0.5, 37.5).y} fill="white" opacity="0.1" fontSize={40 * scaledStrokeWidth} textAnchor="middle" fontWeight="bold" pointerEvents="none" style={{ userSelect: 'none'}}>KENYA</text>
            <text x={projectPoint(-1.29, 36.82).x + (10 * scaledStrokeWidth)} y={projectPoint(-1.29, 36.82).y} fill="white" opacity="0.5" fontSize={12 * scaledStrokeWidth} textAnchor="start" pointerEvents="none" style={{ userSelect: 'none'}}>Nairobi</text>

        </g>
      </svg>
    </>
  );
}