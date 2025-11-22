import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { identifyPlant } from '../services/geminiService';
import { PlantAnalysisResult } from '../types';
import { CameraIcon, SpinnerIcon, PlantIcon, ChevronLeftIcon, ForestIcon } from '../components/icons';

export default function PlantIdentifyPage() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<PlantAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setAnalysis(null); // Reset previous analysis
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imagePreview) return;
        setIsLoading(true);
        setError(null);
        
        try {
            // Remove base64 header
            const base64Data = imagePreview.split(',')[1];
            const result = await identifyPlant(base64Data);
            setAnalysis(result);
        } catch (err) {
            setError("Could not analyze image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 border-b border-gray-800 bg-gray-900/90 sticky top-0 z-10">
                <button onClick={() => navigate('/public-dashboard')} className="text-gray-400 hover:text-white">
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-bold flex items-center gap-2">
                    <PlantIcon className="h-6 w-6 text-emerald-400" />
                    Plant Intelligence
                </h1>
            </div>

            <div className="flex-grow p-6 flex flex-col items-center">
                
                {/* Image Area */}
                <div className="w-full max-w-md aspect-square bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative mb-6 shadow-lg">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Captured plant" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-6">
                            <CameraIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-sm">Take a photo or upload an image of a plant to identify it.</p>
                        </div>
                    )}
                    
                    {/* Action Button Overlay */}
                    {!isLoading && !analysis && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-4 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg transform transition hover:scale-105 flex items-center gap-2"
                        >
                            <CameraIcon className="h-5 w-5" />
                            {imagePreview ? 'Retake' : 'Capture'}
                        </button>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        onChange={handleCapture}
                    />
                </div>

                {/* Analyze Button */}
                {imagePreview && !analysis && !isLoading && (
                    <button 
                        onClick={handleAnalyze}
                        className="w-full max-w-md bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-lg shadow-lg mb-6 transition"
                    >
                        Analyze Plant
                    </button>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <SpinnerIcon className="h-12 w-12 text-emerald-400 animate-spin mx-auto mb-4" />
                        <p className="text-emerald-300 font-semibold">Consulting the Botanist AI...</p>
                    </div>
                )}

                {/* Results */}
                {analysis && (
                    <div className="w-full max-w-md bg-gray-800 rounded-xl border border-green-400/30 overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="bg-emerald-900/30 p-4 border-b border-green-400/20">
                            <h2 className="text-2xl font-bold text-white">{analysis.commonName}</h2>
                            <p className="text-emerald-400 italic font-serif">{analysis.scientificName}</p>
                        </div>
                        <div className="p-5 space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400 uppercase font-bold">Status</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    analysis.status === 'Invasive' ? 'bg-red-900/50 text-red-400' :
                                    analysis.status === 'Endangered' ? 'bg-orange-900/50 text-orange-400' :
                                    'bg-green-900/50 text-green-400'
                                }`}>{analysis.status}</span>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-300 uppercase mb-1">Health Assessment</h3>
                                <p className="text-gray-300 text-sm leading-relaxed bg-gray-900/50 p-3 rounded">{analysis.healthAssessment}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-300 uppercase mb-1">Preservation Actions</h3>
                                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                    {analysis.preservationActions.map((action, i) => (
                                        <li key={i}>{action}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-blue-900/20 p-3 rounded border border-blue-500/20">
                                <h3 className="text-xs font-bold text-blue-300 uppercase mb-1 flex items-center gap-1">
                                    <ForestIcon className="h-3 w-3" /> Fun Fact
                                </h3>
                                <p className="text-xs text-blue-100 italic">{analysis.funFact}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-900 text-center border-t border-gray-700">
                            <button 
                                onClick={() => { setImagePreview(null); setAnalysis(null); }}
                                className="text-gray-400 hover:text-white text-sm font-semibold"
                            >
                                Identify Another Plant
                            </button>
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mt-4">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}