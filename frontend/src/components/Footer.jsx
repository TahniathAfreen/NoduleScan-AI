import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 text-xs">
      
      {/* Professional Medical Disclaimer Banner */}
      <div className="border-b border-navy-850 bg-navy-900/60 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-slate-300">
            <div className="p-1.5 rounded-lg bg-navy-800 text-amber-400 border border-navy-700 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <p className="text-[12px] leading-relaxed text-slate-300">
              <strong className="text-white font-semibold">Medical Disclaimer:</strong> This application is an AI research and visualization tool. Its predictions may be incorrect and are not a medical diagnosis. It must not be used to make medical decisions or replace evaluation by a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-850 flex items-center justify-center text-tealaccent-400 border border-navy-800">
              <Activity className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight">NoduleScan AI</span>
              <span className="text-[11px] text-slate-500 block">AI-Powered Chest Radiograph Localization</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('how-it-works')} className="hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => onNavigate('lung-health')} className="hover:text-white transition-colors">
              Lung Health
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About
            </button>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} NoduleScan AI. All rights reserved.
          </div>

        </div>
      </div>

    </footer>
  );
}
