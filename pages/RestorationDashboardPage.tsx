
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PlantIcon, ForestIcon, InfoIcon, BadgeIcon, AnalyzeIcon } from '../components/icons';
import { RestorationProject } from '../types';

const ProjectCard: React.FC<{ project: RestorationProject; onClick: () => void; isSelected: boolean }> = ({ project, onClick, isSelected }) => (
    <div 
        onClick={onClick}
        className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.02] ${isSelected ? 'bg-emerald-900/30 border-emerald-500 ring-1 ring-emerald-500' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'}`}
    >
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-white text-lg">{project.name}</h3>
                <p className="text-sm text-gray-400">{project.location.label}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${project.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                {project.status}
            </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
             <div className="bg-gray-900/40 p-2 rounded">
                <p className="text-[10px] text-gray-500 uppercase">Mangroves Planted</p>
                <p className="text-emerald-400 font-mono font-bold">{project.metrics.mangrovesPlanted?.toLocaleString() ?? 0}</p>
             </div>
             <div className="bg-gray-900/40 p-2 rounded">
                <p className="text-[10px] text-gray-500 uppercase">CO2 Sequestered</p>
                <p className="text-blue-400 font-mono font-bold">{project.metrics.co2eSequesteredTons?.toFixed(1)}t</p>
             </div>
        </div>
    </div>
);

export default function RestorationDashboardPage() {
    const { restorationProjects, analysisResult } = useAppContext();
    const [selectedProject, setSelectedProject] = useState<RestorationProject | null>(restorationProjects[0] || null);

    const totalMangroves = restorationProjects.reduce((acc, p) => acc + (p.metrics.mangrovesPlanted || 0), 0);
    const totalArea = restorationProjects.reduce((acc, p) => acc + (p.metrics.areaHa || 0), 0);

    // Filter alerts that are high risk but not linked to a project (mock logic)
    const actionableAlerts = analysisResult?.alerts.filter(a => (a.severity === 'High' || a.severity === 'Critical') && !restorationProjects.some(p => p.linkedAlertsIds?.includes(a.id))) || [];

    return (
        <div className="h-full flex flex-col space-y-6">
             <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <PlantIcon className="h-8 w-8 text-emerald-400" />
                        Restoration & Action Hub
                    </h1>
                    <p className="text-gray-400 text-sm">Turn alerts into action. Monitor replanting, biodiversity, and recovery.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2">
                         New Project
                    </button>
                </div>
            </div>

            {/* Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-shrink-0">
                <div className="bg-gray-800/50 border border-green-400/20 p-4 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase">Total Mangroves Planted</p>
                    <p className="text-2xl font-bold text-white">{totalMangroves.toLocaleString()}</p>
                </div>
                <div className="bg-gray-800/50 border border-green-400/20 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 uppercase">Area Under Restoration</p>
                    <p className="text-2xl font-bold text-white">{totalArea} <span className="text-sm text-gray-500">ha</span></p>
                </div>
                <div className="bg-gray-800/50 border border-green-400/20 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 uppercase">Community Participants</p>
                    <p className="text-2xl font-bold text-white">450+</p>
                </div>
                 <div className="bg-gray-800/50 border border-green-400/20 p-4 rounded-lg">
                     <p className="text-xs text-gray-400 uppercase">Survival Rate (Avg)</p>
                    <p className="text-2xl font-bold text-emerald-400">82%</p>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                {/* Project List */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2">
                    <h2 className="text-lg font-semibold text-white sticky top-0 bg-gray-900/90 py-2 z-10">Active Projects</h2>
                    {restorationProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            isSelected={selectedProject?.id === project.id}
                            onClick={() => setSelectedProject(project)} 
                        />
                    ))}

                    {/* Actionable Alerts Section */}
                     <h2 className="text-lg font-semibold text-white mt-4 sticky top-0 bg-gray-900/90 py-2 z-10">Needs Action (Alerts)</h2>
                     {actionableAlerts.length === 0 ? (
                         <p className="text-gray-500 text-sm italic">No unaddressed critical alerts.</p>
                     ) : (
                         actionableAlerts.map(alert => (
                             <div key={alert.id} className="p-3 border border-red-500/30 bg-red-900/10 rounded-lg">
                                 <div className="flex justify-between">
                                     <span className="text-red-400 font-bold text-sm">{alert.type.toUpperCase()}</span>
                                     <span className="text-red-400 text-xs font-mono">{alert.severity}</span>
                                 </div>
                                 <p className="text-gray-300 text-xs mt-1 line-clamp-2">{alert.explanation}</p>
                                 <button className="mt-2 text-xs bg-red-900/50 hover:bg-red-900 text-red-200 px-2 py-1 rounded border border-red-800 w-full">
                                     Create Restoration Project
                                 </button>
                             </div>
                         ))
                     )}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-8 bg-gray-800/50 border border-green-400/20 rounded-lg p-6 overflow-y-auto">
                    {selectedProject ? (
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="border-b border-gray-700 pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-1">{selectedProject.name}</h2>
                                        <p className="text-emerald-400 font-semibold">{selectedProject.location.label} <span className="text-gray-500 mx-2">•</span> <span className="capitalize text-gray-300">{selectedProject.ecosystem} Ecosystem</span></p>
                                    </div>
                                    <BadgeIcon className="h-10 w-10 text-yellow-500" />
                                </div>
                                <p className="mt-4 text-gray-300 bg-gray-900/30 p-3 rounded border-l-4 border-emerald-500 italic">
                                    "Restoring degradation caused by {selectedProject.degradationSource?.toLowerCase() || 'unknown factors'}."
                                </p>
                            </div>

                            {/* Metrics Grid */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Ecological Impact</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-900/50 p-4 rounded border border-gray-700 text-center">
                                        <p className="text-sm text-gray-400 mb-1">Trees/Mangroves</p>
                                        <p className="text-2xl font-bold text-emerald-400">
                                            {(selectedProject.metrics.mangrovesPlanted || selectedProject.metrics.treesPlanted || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded border border-gray-700 text-center">
                                        <p className="text-sm text-gray-400 mb-1">Survival Rate</p>
                                        <p className="text-2xl font-bold text-blue-400">
                                            {(selectedProject.metrics.mangroveSurvivalRate ? selectedProject.metrics.mangroveSurvivalRate * 100 : 0).toFixed(0)}%
                                        </p>
                                    </div>
                                    <div className="bg-gray-900/50 p-4 rounded border border-gray-700 text-center">
                                        <p className="text-sm text-gray-400 mb-1">Carbon Offset</p>
                                        <p className="text-2xl font-bold text-white">
                                            {selectedProject.metrics.co2eSequesteredTons} t
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Incentives */}
                            <div className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 p-4 rounded-lg border border-emerald-500/30">
                                <h3 className="text-lg font-bold text-white mb-2">PES & Incentives</h3>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-300">Total Budget: <span className="font-mono font-bold text-white">KES {selectedProject.incentives.totalBudgetKes?.toLocaleString()}</span></p>
                                        <p className="text-sm text-gray-300">Disbursed: <span className="font-mono font-bold text-emerald-400">KES {selectedProject.incentives.disbursedKes?.toLocaleString()}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase mb-1">Linked Program</p>
                                        <span className="bg-gray-900 text-xs px-2 py-1 rounded border border-gray-600">{selectedProject.incentives.pesProgramId}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select a project to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
