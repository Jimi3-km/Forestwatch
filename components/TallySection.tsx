import React from 'react';
import { ForestIcon, HighIcon, InfoIcon } from './icons';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; description: string }> = ({ icon, title, value, description }) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg text-center border border-white/20 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
    <div className="flex justify-center text-emerald-400 mb-4">
      {icon}
    </div>
    <h3 className="text-4xl font-bold text-white">{value}</h3>
    <p className="text-lg font-semibold text-gray-200 mt-1">{title}</p>
    <p className="text-sm text-gray-300 mt-2">{description}</p>
  </div>
);

export default function TallySection(): React.ReactElement {
  const stats = [
    {
      icon: <ForestIcon className="h-12 w-12" />,
      title: "Kenya's Forest Cover",
      value: "7.4%",
      description: "A vital natural resource facing significant threats from illegal logging and climate change."
    },
    {
      icon: <InfoIcon className="h-12 w-12" />,
      title: "National Reforestation Goal",
      value: "15 Billion Trees",
      description: "An ambitious government-led initiative to restore degraded landscapes and achieve 30% tree cover by 2032."
    },
    {
      icon: <HighIcon className="h-12 w-12" />,
      title: "AI-Powered Protection",
      value: "+30% Efficiency",
      description: "ForestWatchAI pinpoints threats in real-time, enabling faster response to save mature trees and protect new seedlings."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-900/70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">The Challenge and Our Commitment</h2>
          <p className="text-md text-gray-300 max-w-3xl mx-auto mt-4">
            Every hectare of forest is a lifeline. By combining advanced AI with community vigilance, we can turn the tide on deforestation and build a greener, more sustainable future for Kenya.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map(stat => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}