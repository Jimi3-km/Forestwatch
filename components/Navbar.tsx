import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ForestWatchLogo } from './icons';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar(): React.ReactElement {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:border-emerald-500/50 transition-all">
             <ForestWatchLogo className="h-7 w-7 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight font-space">
            ForestWatch<span className="text-emerald-500">AI</span>
          </h1>
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-mono text-gray-400 block">{user.email}</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider border border-emerald-500/20 px-1.5 py-0.5 rounded bg-emerald-500/10 inline-block mt-0.5">{user.role}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-800 hover:border-red-600 text-xs font-bold uppercase tracking-wide py-2 px-4 rounded transition-all"
                >
                  Log Out
                </button>
              </>
            ) : (
              <NavLink 
                to="/login"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold py-2 px-4 rounded-md transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}