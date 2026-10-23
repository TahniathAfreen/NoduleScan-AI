import React from 'react';
import { CigaretteOff, Wind, Stethoscope, UserCheck, HeartPulse } from 'lucide-react';

export default function LungHealth() {
  const cards = [
    {
      title: 'Avoid Tobacco & Second-Hand Smoke',
      description: 'Refraining from smoking and minimizing exposure to second-hand tobacco smoke significantly protects airway integrity and overall respiratory health.',
      icon: CigaretteOff,
      badge: 'Airway Protection',
    },
    {
      title: 'Reduce Airborne Contaminant Exposure',
      description: 'Minimize exposure to toxic occupational dusts, chemical fumes, biomass smoke, and high outdoor air pollution where practical using proper ventilation or protective equipment.',
      icon: Wind,
      badge: 'Environmental Health',
    },
    {
      title: 'Evaluate Persistent Respiratory Symptoms',
      description: 'Seek formal medical consultation for symptoms such as a chronic cough, unexplained shortness of breath, chest discomfort, or unexpected weight changes.',
      icon: Stethoscope,
      badge: 'Clinical Assessment',
    },
    {
      title: 'Adhere to Recommended Screening Schedules',
      description: 'Follow regular screening, follow-up, and radiological guidelines established by qualified healthcare providers based on personal risk factors and clinical history.',
      icon: UserCheck,
      badge: 'Preventive Care',
    },
  ];

  return (
    <section id="lung-health" className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tealaccent-500/10 border border-tealaccent-500/30 text-tealaccent-600 text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-tealaccent-600" />
            <span>Health Guidance</span>
          </div>
          <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight sm:text-4xl">
            Lung Health & Prevention
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Evidence-based general educational resources for maintaining respiratory wellness.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft-card flex flex-col justify-between hover:shadow-elevated transition-shadow group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-medblue-50 group-hover:text-medblue-600 transition-colors mb-5">
                    <Icon className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider text-medblue-600 bg-medblue-50 px-2 py-0.5 rounded border border-medblue-100">
                    {card.badge}
                  </span>

                  <h3 className="text-base font-bold text-navy-950 mt-3 mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  General wellness educational resource
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational note */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-slate-200 text-center max-w-2xl mx-auto text-xs text-slate-500 shadow-sm">
          This educational information is general guidance only. It is not individualized medical advice, nor does it replace personalized consultation with a licensed physician.
        </div>

      </div>
    </section>
  );
}
