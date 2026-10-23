import React from 'react';
import { Target, Cpu, BarChart3, CheckCircle, Shield } from 'lucide-react';

export default function AboutSection() {
  const metrics = [
    { label: 'Precision', value: '65.11%', desc: 'Positive predictive accuracy' },
    { label: 'Recall', value: '57.98%', desc: 'True positive localization rate' },
    { label: 'mAP@50', value: '59.82%', desc: 'Mean average precision at 0.50 IoU' },
    { label: 'mAP@50-95', value: '27.57%', desc: 'COCO metric across IoU thresholds' },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medblue-50 border border-medblue-200 text-medblue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            Technology & Evaluation
          </div>
          <h2 className="text-3xl font-extrabold text-navy-950 tracking-tight sm:text-4xl">
            About NoduleScan AI
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Deep-learning-based computer vision for radiographic candidate nodule localization.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Description Column */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-navy-950 leading-snug">
              Computer-Aided Detection for Pulmonary Nodules
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              NoduleScan AI utilizes a specialized deep-learning object-detection architecture (YOLOv8) trained to identify and localize subtle pulmonary nodules on chest radiographs. By predicting bounding-box coordinates and confidence scores, the platform provides automated visual cues for investigational and educational review.
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              Standard radiographs often present subtle nodular opacities that can be obscured by overlapping rib structures, clavicles, or mediastinal shadows. The network performs single-stage feature extraction and coordinate regression to assist in focal localization.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Single-stage convolutional neural network architecture (YOLOv8n)</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Standardized coordinate localization with user-adjustable confidence thresholds</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>In-memory processing with no permanent storage of uploaded medical images</span>
              </div>
            </div>
          </div>

          {/* Right Metrics & Model Card Column */}
          <div className="lg:col-span-6">
            <div className="bg-navy-900 rounded-2xl p-7 border border-navy-800 shadow-elevated text-white">
              
              <div className="flex items-center justify-between pb-5 border-b border-navy-800">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-tealaccent-400 font-semibold block">
                    Architecture Reference
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    YOLOv8n Model Evaluation
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-tealaccent-400 border border-navy-700">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {metrics.map((m, idx) => (
                  <div key={idx} className="bg-navy-850 p-4 rounded-xl border border-navy-800">
                    <span className="text-xs text-slate-400 block font-medium">{m.label}</span>
                    <span className="text-2xl font-black font-mono text-white mt-1 block">
                      {m.value}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {m.desc}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-navy-800 flex items-start gap-3 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Reported metrics reflect offline performance on a held-out test split. These figures characterize model localization behavior on test images and do not constitute clinical efficacy guarantees.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
