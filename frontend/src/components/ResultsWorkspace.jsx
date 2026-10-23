import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  ArrowLeft, 
  Download, 
  Clock, 
  Crosshair, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ZoomIn,
  Maximize2
} from 'lucide-react';

export default function ResultsWorkspace({ 
  result, 
  originalImageUrl, 
  onReset, 
  onOpenReport 
}) {
  const [activeView, setActiveView] = useState('annotated'); // 'annotated' | 'original' | 'split'
  const [isZoomed, setIsZoomed] = useState(false);

  const {
    status,
    total_detections,
    detections = [],
    confidence_threshold,
    image_metadata = {},
    inference_time_ms,
    annotated_image,
  } = result || {};

  const hasDetections = total_detections > 0;

  return (
    <section className="bg-navy-950 text-slate-100 py-10 lg:py-16 transition-all min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Top Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 border border-navy-700 text-xs sm:text-sm font-medium text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Upload Another Image</span>
            </button>
            <div className="h-4 w-px bg-navy-800 hidden sm:block"></div>
            <span className="text-xs text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">
              {image_metadata.filename || 'radiograph.png'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-medblue-600 hover:bg-medblue-500 text-white text-xs sm:text-sm font-semibold shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Results</span>
            </button>
          </div>
        </div>

        {/* Medical Imaging Layout: Viewer (Left/Top) + Diagnostics Panel (Right/Bottom) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Radiograph Canvas Area (8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            
            {/* View Switching Bar */}
            <div className="flex items-center justify-between bg-navy-900 px-4 py-2.5 rounded-xl border border-navy-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveView('annotated')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeView === 'annotated'
                      ? 'bg-medblue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Annotated Image</span>
                </button>

                <button
                  onClick={() => setActiveView('original')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeView === 'original'
                      ? 'bg-medblue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Original Image</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-1.5 rounded-lg hover:bg-navy-800 hover:text-white transition-colors"
                  title={isZoomed ? "Reset Zoom" : "Toggle Zoom"}
                >
                  <ZoomIn className={`w-4 h-4 ${isZoomed ? 'text-tealaccent-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Medical Imaging Frame */}
            <div className="relative rounded-2xl bg-black border border-navy-800 overflow-hidden flex items-center justify-center min-h-[460px] max-h-[680px] shadow-2xl">
              <img
                src={activeView === 'original' ? originalImageUrl : (annotated_image || originalImageUrl)}
                alt={activeView === 'original' ? 'Original Chest X-Ray' : 'Annotated Chest X-Ray with detections'}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* View Overlay Tag */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-navy-950/80 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-slate-300 border border-navy-700">
                  {activeView === 'original' ? 'Original Radiograph' : 'YOLOv8 Detection Overlay'}
                </span>
              </div>

              {/* Dimensions overlay */}
              {image_metadata.width && (
                <div className="absolute bottom-4 right-4 pointer-events-none">
                  <span className="text-[11px] font-mono text-slate-400 bg-navy-950/80 px-2.5 py-1 rounded border border-navy-800">
                    {image_metadata.width} × {image_metadata.height} px
                  </span>
                </div>
              )}
            </div>

            {/* Micro disclaimer below viewer */}
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 px-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Bounding boxes reflect machine-learning localization output. Not validated clinical boundaries.</span>
            </p>
          </div>

          {/* Results Diagnostic Panel (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Status Card */}
            <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl">
              <div className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">
                Detection Status
              </div>

              <div className="flex items-start gap-3">
                {hasDetections ? (
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-tealaccent-500/10 text-tealaccent-400 border border-tealaccent-500/20 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {status}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {hasDetections 
                      ? `${total_detections} candidate bounding box${total_detections > 1 ? 'es' : ''} detected at or above ${(confidence_threshold * 100).toFixed(0)}% confidence.`
                      : 'No candidate bounding boxes surpassed the configured confidence threshold. A negative detection does not confirm that the radiograph is normal.'}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-navy-800 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-navy-850 p-2.5 rounded-lg border border-navy-800">
                  <span className="text-slate-400 block text-[11px]">Total Detections</span>
                  <span className="text-base font-bold text-white">{total_detections}</span>
                </div>
                <div className="bg-navy-850 p-2.5 rounded-lg border border-navy-800">
                  <span className="text-slate-400 block text-[11px]">Threshold Used</span>
                  <span className="text-base font-bold text-tealaccent-400">
                    {(confidence_threshold * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Nodule List */}
            {hasDetections && (
              <div className="bg-navy-900 rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-tealaccent-400" />
                    <span>Predicted Nodule Coordinates</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    {detections.length} candidate{detections.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {detections.map((det, index) => (
                    <div 
                      key={det.id || index}
                      className="p-3.5 rounded-xl bg-navy-850 border border-navy-750 hover:border-tealaccent-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-tealaccent-500/20 text-tealaccent-300 font-mono text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-xs font-semibold text-white">
                            Candidate #{index + 1}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-medblue-600/30 text-tealaccent-300 border border-tealaccent-500/30">
                          {det.confidence_pct}% Conf.
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 mt-2">
                        <span className="text-slate-400">Estimated Zone: </span>
                        <span className="font-medium text-slate-200">{det.location_description}</span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 mt-1 bg-navy-900 px-2 py-1 rounded border border-navy-800 flex justify-between">
                        <span>Box: [{det.box.join(', ')}]</span>
                        <span>{det.width_px} × {det.height_px} px</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inference Metadata Card */}
            <div className="bg-navy-900 rounded-2xl p-5 border border-navy-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>Model Architecture</span>
                <span className="font-semibold text-slate-200">YOLOv8n (Kaggle Checkpoint)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Inference Latency</span>
                <span className="font-mono text-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {inference_time_ms ? `${inference_time_ms} ms` : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Image Dimensions</span>
                <span className="font-mono text-slate-200">
                  {image_metadata.width} × {image_metadata.height}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={onOpenReport}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-medblue-600 hover:bg-medblue-500 text-white font-semibold text-sm shadow transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>View & Print Analysis Summary</span>
              </button>
              
              <button
                onClick={onReset}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-300 font-medium text-xs transition-colors"
              >
                Upload Another Image
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
