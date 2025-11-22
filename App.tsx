import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

export default function App(): React.ReactElement {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f1713] via-[#050a07] to-black text-gray-200 selection:bg-emerald-500/30">
          <Navbar />
          <main className="flex-grow flex flex-col">
            <AppRoutes />
          </main>
        </div>
      </AppProvider>
    </AuthProvider>
  );
}