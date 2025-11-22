import React from 'react';
import TallySection from '../components/TallySection';
import { ForestWatchLogo } from '../components/icons';

export default function LandingPage(): React.ReactElement {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative h-[75vh] flex items-center justify-center text-white text-center overflow-hidden"
      >
        {/* Background Image & Gradient Overlay */}
        <div 
            className="absolute inset-0 bg-cover bg-center z-0 transform scale-105"
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1974&auto=format&fit=crop')",
            }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#020604] z-10"></div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 flex flex-col items-center">
          <div className="mb-6 p-4 bg-emerald-500/10 rounded-full border border-emerald-500/30 backdrop-blur-md animate-pulse">
             <ForestWatchLogo className="h-16 w-16 text-emerald-400" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight font-space mb-6">
            Environmental Intelligence <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Reimagined.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Fuse satellite data, IoT sensors, and community reports into a single source of truth. Detect threats instantly. Restore ecosystems efficiently.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
                href="#/login"
                className="inline-flex items-center justify-center bg-emerald-600 text-white font-bold py-4 px-10 rounded-lg hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-105 text-lg tracking-wide"
            >
                Launch Platform
            </a>
             <button className="inline-flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold py-4 px-10 rounded-lg hover:bg-white/10 transition-all duration-300 text-lg tracking-wide">
                Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Tally Section */}
      <TallySection />
    </div>
  );
}