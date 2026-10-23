import React from 'react';
import { UploadCloud, CheckCheck, Cpu, LayoutDashboard } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Upload a Chest X-ray',
      description: 'Select or drag-and-drop a posteroanterior (PA) or anteroposterior (AP) chest radiograph in PNG or JPEG format.',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'Application Validates Image',
      description: 'The system validates image integrity, resolution, and file parameters in-memory without distorting radiographic geometry.',
      icon: CheckCheck,
    },
    {
      step: '03',
      title: 'Trained AI Model Analyzes Image',
      description: 'The deep-learning object-detection neural network scans the radiograph to detect features characteristic of pulmonary nodules.',
      icon: Cpu,
    },
    {
      step: '04',
      title: 'Visualize Detections & Scores',
      description: 'Review localized candidate bounding boxes, anatomical regions, and confidence scores in the interactive workspace.',
      icon: LayoutDashboard,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medblue-50 border border-medblue-200 text-medblue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Workflow Overview
          </div>
          <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A streamlined 4-step pipeline designed for rapid, clear radiographic visualization.
          </p>
        </div>

        {/* Steps Grid: Horizontal on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="relative bg-[#FAFCFF] rounded-2xl p-6 border border-slate-200/90 shadow-soft-card flex flex-col justify-between hover:border-medblue-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-medblue-50 border border-medblue-100 flex items-center justify-center text-medblue-600 group-hover:bg-medblue-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 font-mono tracking-tighter">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-950 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-medblue-600">
                  <span>Step {index + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
