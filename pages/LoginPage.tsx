import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';
import { ForestIcon, SpinnerIcon } from '../components/icons';

const RoleDescription = ({ role }: { role: UserRole }) => {
    if (role === 'official') {
        return <p className="text-xs text-gray-400 mt-2 text-center">Access the full analysis dashboard, manage data inputs, and view detailed threat intelligence.</p>;
    }
    return <p className="text-xs text-gray-400 mt-2 text-center">View public alerts on the map and contribute by submitting ground reports of suspicious activity.</p>;
};


export default function LoginPage(): React.ReactElement {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('official');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Mock authentication with a slight delay
        setTimeout(() => {
            if (!email || !password) {
                setError('Please enter both email and password.');
                setIsLoading(false);
                return;
            }

            const commonUserEmails = ['user@example.com', 'community@example.com'];
            const officialUserEmails = ['kws@example.com', 'official@example.com'];

            if (role === 'common' && !commonUserEmails.includes(email)) {
                setError(`Invalid email for Common User. Try 'user@example.com'.`);
                setIsLoading(false);
                return;
            }

            if (role === 'official' && !officialUserEmails.includes(email)) {
                setError(`Invalid email for an Official. Try 'kws@example.com'.`);
                setIsLoading(false);
                return;
            }

            login({ email, role });
            // The router component now handles navigation after login.
        }, 500);
    };

    return (
        <div className="min-h-[calc(100vh-65px)] flex bg-gray-900">
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center text-white bg-cover bg-center p-8" style={{ backgroundImage: "linear-gradient(to bottom, rgba(12, 20, 13, 0.9), rgba(12, 20, 13, 0.7)), url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop')" }}>
                <ForestIcon className="h-20 w-20 text-emerald-400 mb-4" />
                <h1 className="text-4xl font-bold tracking-tight">ForestWatch<span className="text-emerald-400">AI</span></h1>
                <p className="mt-4 text-lg text-gray-300 max-w-sm text-center">Protecting Our Forests with Advanced Intelligence.</p>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <form onSubmit={handleSubmit} className="bg-gray-800/50 shadow-2xl rounded-lg p-8 border border-green-400/20">
                        <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
                        <p className="text-center text-gray-400 mb-6">Log in to continue your session.</p>
                        
                        {error && (
                            <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm rounded-md p-3 mb-4 text-center">
                                {error}
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={role === 'official' ? "kws@example.com" : "user@example.com"}
                                className="w-full bg-gray-900/70 border border-green-400/20 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter any password"
                                className="w-full bg-gray-900/70 border border-green-400/20 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Select Your Role</label>
                            <div className="flex rounded-md shadow-sm border border-gray-600">
                                <button type="button" onClick={() => setRole('official')} className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md transition-colors focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${role === 'official' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                    KWS Official
                                </button>
                                <button type="button" onClick={() => setRole('common')} className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md transition-colors focus:z-10 focus:ring-2 focus:ring-emerald-500 focus:outline-none ${role === 'common' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                    Common User
                                </button>
                            </div>
                            <RoleDescription role={role} />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full mt-6 flex items-center justify-center bg-emerald-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-emerald-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}