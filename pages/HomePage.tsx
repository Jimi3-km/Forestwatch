
import React from 'react';
import TallySection from '../components/TallySection';
import { AnalyzeIcon } from '../components/icons';

export default function LandingPage(): React.ReactElement {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="h-[60vh] md:h-[70vh] flex items-center justify-center text-white text-center bg-cover bg-no-repeat"
        style={{ 
            backgroundImage: "linear-gradient(to top, rgba(12, 20, 13, 0.8), rgba(12, 20, 13, 0.4)), url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1974&auto=format&fit=crop')",
            backgroundPosition: 'center center' 
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Real-Time Intelligence for Forest Protection
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            ForestWatchAI fuses satellite imagery, ground-sensor data, and community reports to provide actionable alerts for environmental threats like illegal logging and wildfires.
          </p>
          <a
            href="#/login"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-emerald-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Tally Section */}
      <TallySection />
    </div>
  );
}
