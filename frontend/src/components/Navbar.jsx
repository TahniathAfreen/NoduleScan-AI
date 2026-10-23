import React, { useState } from 'react';
import { Activity, ShieldCheck, AlertCircle, Menu, X } from 'lucide-react';

export default function Navbar({ backendStatus, onNavigate, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'lung-health', label: 'Lung Health' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-tealaccent-400 shadow-md group-hover:bg-navy-850 transition-colors">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-950 flex items-center gap-1.5">
                NoduleScan <span className="text-medblue-600 font-semibold text-sm bg-medblue-50 px-2 py-0.5 rounded border border-medblue-200/60">AI</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-medium text-slate-500">
                Medical Imaging Analysis
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'text-medblue-700 bg-medblue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* System Status Indicator Badge */}
          <div className="hidden lg:flex items-center gap-3">
            {backendStatus?.healthy ? (
              backendStatus?.data?.model_loaded ? (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Model Active (YOLOv8n)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium" title="Checkpoint best.pt not detected in backend/models/">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Setup: Add best.pt</span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Backend Offline</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-950 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeSection === item.id
                  ? 'bg-medblue-50 text-medblue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            {backendStatus?.healthy && backendStatus?.data?.model_loaded ? (
              <div className="flex items-center gap-2 py-2 text-xs text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Model Active: YOLOv8n</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2 text-xs text-amber-700">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Model checkpoint needs to be added</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
