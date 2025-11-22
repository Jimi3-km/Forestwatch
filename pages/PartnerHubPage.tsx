


import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { HandshakeIcon, CameraIcon, CoinIcon, DocumentIcon, ClockIcon, UsersIcon } from '../components/icons';

export default function PartnerHubPage() {
    const { partners, tourismProducts } = useAppContext();
    const [filterType, setFilterType] = useState<string>('all');

    const filteredPartners = partners.filter(p => {
        if (filterType === 'all') return true;
        if (filterType === 'training') return (p.contributions?.trainingEvents ?? 0) > 0;
        if (filterType === 'funding') return (p.contributions?.fundsContributedKes ?? 0) > 0;
        if (filterType === 'volunteers') return (p.contributions?.volunteerHours ?? 0) > 0;
        if (filterType === 'knowledge') return (p.contributions?.documentsUploaded ?? 0) > 0;
        return true;
    });

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <HandshakeIcon className="h-8 w-8 text-emerald-400" />
                        Partner & Tourism Engine
                    </h1>
                    <p className="text-gray-400 text-sm">Viable conservation requires partners. Manage eco-tourism, donors, and community stakeholders.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Partners List */}
                <div className="bg-gray-800/50 border border-green-400/20 rounded-lg p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Registered Partners</h2>
                        
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-900 border border-gray-700 text-white text-xs rounded p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="all">All Contributions</option>
                            <option value="training">Training Providers</option>
                            <option value="funding">Funders</option>
                            <option value="volunteers">Volunteer Mobilizers</option>
                            <option value="knowledge">Knowledge Contributors</option>
                        </select>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 max-h-[calc(100vh-250px)]">
                        {filteredPartners.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No partners found matching this filter.</p>
                        ) : (
                            filteredPartners.map(partner => (
                                <div key={partner.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white">{partner.name}</h3>
                                            <p className="text-sm text-gray-400">{partner.locationLabel} • <span className="text-emerald-400 capitalize">{partner.type.replace('_', ' ')}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-500 block mb-1">Projects</span>
                                            <span className="font-mono font-bold text-white text-lg">{partner.linkedProjectsIds.length}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-300 italic bg-black/20 p-2 rounded border-l-2 border-gray-600">
                                        {partner.description || "No description available."}
                                    </p>

                                    {/* Contribution Metrics Grid */}
                                    <div className="grid grid-cols-4 gap-2 mt-1">
                                        <div className="bg-gray-800 p-2 rounded text-center" title="Training Events">
                                            <UsersIcon className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-white">{partner.contributions?.trainingEvents ?? 0}</span>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center" title="Volunteer Hours">
                                            <ClockIcon className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-white">{partner.contributions?.volunteerHours ? `${(partner.contributions.volunteerHours / 1000).toFixed(1)}k` : 0}</span>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center" title="Documents Uploaded">
                                            <DocumentIcon className="h-4 w-4 text-gray-400 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-white">{partner.contributions?.documentsUploaded ?? 0}</span>
                                        </div>
                                        <div className="bg-gray-800 p-2 rounded text-center" title="Funding Contributed">
                                            <CoinIcon className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                                            <span className="text-xs font-bold text-white">{partner.contributions?.fundsContributedKes ? `${(partner.contributions.fundsContributedKes / 1000).toFixed(0)}k` : 0}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {partner.roles.map(role => (
                                            <span key={role} className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400 border border-gray-700 uppercase font-semibold tracking-wider">{role}</span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Tourism Products */}
                <div className="bg-gray-800/50 border border-green-400/20 rounded-lg p-6 h-fit">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CameraIcon className="h-6 w-6 text-blue-400" /> Eco-Tourism Products
                    </h2>
                    <div className="space-y-4">
                        {tourismProducts.map(product => (
                            <div key={product.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white">{product.name}</h3>
                                    <span className="bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded uppercase font-bold border border-blue-800">Active</span>
                                </div>
                                <p className="text-sm text-gray-300 italic mb-3">{product.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 bg-black/20 p-3 rounded">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Tour Price</p>
                                        <p className="text-white font-bold">KES {product.priceKesApprox}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase flex items-center gap-1"><CoinIcon className="h-3 w-3 text-yellow-400"/> Eco-Fee (PES)</p>
                                        <p className="text-emerald-400 font-bold">KES {product.ecoFeeKesPerVisit}</p>
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-gray-400">
                                    Funds Restoration Project: <span className="text-emerald-300">{product.linkedRestorationProjectId}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 bg-emerald-900/20 p-4 rounded border border-emerald-500/30">
                        <h3 className="text-sm font-bold text-white mb-2">Impact Model</h3>
                        <p className="text-sm text-gray-300">
                            <span className="text-yellow-400 font-bold">20%</span> of every tour fee is automatically routed to the PES Incentives pool, directly paying community members for mangrove planting and monitoring.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
