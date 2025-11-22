import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SubmitReportPage(): React.ReactElement {
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('other');
    const [description, setDescription] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ location, category, description });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
                <div className="w-full max-w-lg text-center bg-gray-800/50 shadow-2xl rounded-lg p-8 border border-green-400/20">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-4">Thank You!</h2>
                    <p className="text-gray-300 mb-6">Your report has been submitted successfully. It will be reviewed and combined with our satellite and sensor data to help protect our forests.</p>
                    <Link to="/public-dashboard" className="bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-emerald-500 transition-colors">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <form onSubmit={handleSubmit} className="bg-gray-800/50 shadow-2xl rounded-lg p-8 border border-green-400/20">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Submit a Ground Report</h2>
                    
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="location">
                            Location (Lat, Lng)
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., -1.25, 36.85"
                            required
                            className="w-full bg-gray-900/70 border border-green-400/20 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                        />
                    </div>

                     <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="category">
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-gray-900/70 border border-green-400/20 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                        >
                            <option value="other">Other</option>
                            <option value="fire">Fire</option>
                            <option value="logging">Illegal Logging</option>
                            <option value="encroachment">Encroachment</option>
                            <option value="wildlife">Wildlife Sighting</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Provide a brief description of what you observed..."
                            required
                            className="w-full bg-gray-900/70 border border-green-400/20 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors duration-200">
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
}