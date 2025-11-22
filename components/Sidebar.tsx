import React from 'react';
import { NavLink } from 'react-router-dom';
import { AnalyzeIcon, FireIcon, InfoIcon, LoggingIcon, ModerateIcon, HomeIcon, FitViewIcon, RecycleIcon, PesIcon, PlantIcon, HandshakeIcon, KnowledgeIcon } from './icons'; 

interface SidebarProps {}

const navItems = [
    { id: 'overview', name: 'Overview', icon: <HomeIcon className="h-5 w-5" />, href: '/dashboard/overview' },
    { id: 'analysis', name: 'Analysis', icon: <AnalyzeIcon className="h-5 w-5" />, href: '/dashboard/analysis' },
    { id: 'map', name: 'Live Map', icon: <FitViewIcon className="h-5 w-5" />, href: '/dashboard/map' },
    { id: 'alerts', name: 'Threats', icon: <ModerateIcon className="h-5 w-5" />, href: '/dashboard/alerts' },
    { id: 'restoration', name: 'Restoration', icon: <PlantIcon className="h-5 w-5" />, href: '/dashboard/restoration' },
    { id: 'partners', name: 'Partners', icon: <HandshakeIcon className="h-5 w-5" />, href: '/dashboard/partners' },
    { id: 'knowledge', name: 'Knowledge Core', icon: <KnowledgeIcon className="h-5 w-5" />, href: '/dashboard/knowledge' },
    { id: 'reports', name: 'History', icon: <LoggingIcon className="h-5 w-5" />, href: '/dashboard/reports' },
    { id: 'data-inputs', name: 'Data Inputs', icon: <InfoIcon className="h-5 w-5" />, href: '/dashboard/data-inputs' },
    { id: 'waste', name: 'Circular Hub', icon: <RecycleIcon className="h-5 w-5" />, href: '/dashboard/waste' },
    { id: 'pes', name: 'Incentives', icon: <PesIcon className="h-5 w-5" />, href: '/dashboard/pes' },
    { id: 'management', name: 'Manage Sensors', icon: <FireIcon className="h-5 w-5" />, href: '/dashboard/management' },
];

export default function Sidebar({}: SidebarProps): React.ReactElement {
    return (
        <aside className="w-64 bg-[#050A07]/80 border-r border-white/5 flex-col hidden lg:flex overflow-y-auto backdrop-blur-md">
            <div className="p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-2">Menu</p>
                <nav className="flex flex-col gap-1">
                    {navItems.map(item => (
                        <NavLink
                            key={item.id}
                            to={item.href}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                                    isActive 
                                        ? 'text-white bg-emerald-500/10' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                                    )}
                                    <span className={`${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="tracking-wide">{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </aside>
    );
}