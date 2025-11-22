
import React, { useState } from 'react';
import { KnowledgeIcon, SpinnerIcon } from '../components/icons';
import { queryKnowledgeBase } from '../services/geminiService';
import { KnowledgeQueryResult } from '../types';

const SPECIES_CARDS = [
    {
        name: 'Dugong (Dugong dugon)',
        status: 'Critically Endangered',
        habitat: 'Seagrass beds near mangroves',
        image: 'https://images.unsplash.com/photo-1570032257806-7272438f38da?q=80&w=2070&auto=format&fit=crop', // Placeholder or generic sea life
        desc: 'Known as "sea cows", these gentle giants rely on healthy seagrass beds, often protected by mangrove root systems filtering sediment.'
    },
    {
        name: 'Rhizophora mucronata',
        status: 'Red Mangrove',
        habitat: 'Intertidal zones',
        image: 'https://images.unsplash.com/photo-1516214104703-d6f17515f638?q=80&w=2070&auto=format&fit=crop',
        desc: 'The "Loop-root" mangrove. Essential for coastline stabilization and carbon sequestration. Prop roots provide nurseries for fish.'
    },
    {
        name: 'Sokoke Scops Owl',
        status: 'Endangered',
        habitat: 'Coastal forests',
        image: 'https://images.unsplash.com/photo-1534251623136-5464252791c9?q=80&w=2023&auto=format&fit=crop', // Owl placeholder
        desc: 'A tiny owl found only in the Arabuko-Sokoke Forest. Habitat loss due to illegal logging is its primary threat.'
    }
];

export default function KnowledgeHubPage() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<KnowledgeQueryResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const res = await queryKnowledgeBase(query);
            setResult(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to query knowledge base.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <KnowledgeIcon className="h-8 w-8 text-emerald-400" />
                        Bio-Knowledge Core
                    </h1>
                    <p className="text-gray-400 text-sm">AI-Powered Education for Mangrove & Indigenous Species Conservation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
                
                {/* Left: AI Q&A Interface */}
                <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
                    {/* Search Box */}
                    <div className="bg-gray-800/50 border border-green-400/20 rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">Ask the Expert</h2>
                        <form onSubmit={handleAsk} className="relative">
                            <input 
                                type="text" 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g. 'How deep should I plant Rhizophora seedlings?' or 'Why are Dugongs endangered?'"
                                className="w-full bg-gray-900/70 border border-gray-600 rounded-md p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-md font-semibold flex items-center"
                            >
                                {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : "Ask"}
                            </button>
                        </form>

                        {/* AI Result */}
                        {error && <p className="text-red-400 mt-4">{error}</p>}
                        
                        {result && (
                            <div className="mt-6 animate-fade-in-up">
                                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg">
                                    <h3 className="text-emerald-400 font-bold text-sm uppercase mb-2">Answer</h3>
                                    <p className="text-white text-lg leading-relaxed mb-4">{result.answer}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-gray-400 text-xs uppercase font-bold mb-2">Related Species</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.relatedSpecies.map(s => (
                                                    <span key={s} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-600">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-xs uppercase font-bold mb-2">Actionable Steps</h4>
                                            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                                {result.suggestedActions.map(a => (
                                                    <li key={a}>{a}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Restoration Guides */}
                    <div className="bg-gray-800/50 border border-green-400/20 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Field Guides & Best Practices</h2>
                        <div className="space-y-3">
                            <div className="bg-gray-900/50 p-3 rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-white">Mangrove Planting Protocol (Zone A)</h3>
                                    <p className="text-sm text-gray-400">Spacing, depth, and species selection for intertidal zones.</p>
                                </div>
                                <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">PDF</span>
                            </div>
                            <div className="bg-gray-900/50 p-3 rounded hover:bg-gray-900 transition cursor-pointer flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-white">Identifying Invasive Species</h3>
                                    <p className="text-sm text-gray-400">How to spot Prosopis juliflora in coastal forests.</p>
                                </div>
                                <span className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded">Alert</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Species Spotlight */}
                <div className="lg:col-span-5 bg-gray-800/50 border border-green-400/20 rounded-lg p-6 overflow-y-auto">
                    <h2 className="text-xl font-bold text-white mb-4">Indigenous Species Spotlight</h2>
                    <div className="space-y-6">
                        {SPECIES_CARDS.map(species => (
                            <div key={species.name} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
                                <div className="h-32 w-full bg-gray-700 relative">
                                    <img src={species.image} alt={species.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-2">
                                        <span className="text-xs bg-black/50 text-white px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">{species.habitat}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg">{species.name}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${species.status.includes('Endangered') ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                                            {species.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {species.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
