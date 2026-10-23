import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldAlert, 
  Activity, 
  Calendar, 
  Layers,
  Crosshair
} from 'lucide-react';

export default function ReportModal({ isOpen, onClose, result, originalImageUrl }) {
  if (!isOpen || !result) return null;

  const {
    status,
    total_detections,
    detections = [],
    confidence_threshold,
    image_metadata = {},
    inference_time_ms,
    annotated_image,
    timestamp,
  } = result;

  const formattedDate = timestamp 
    ? new Date(timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    : new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    if (!annotated_image) return;
    const a = document.createElement('a');
    a.href = annotated_image;
    a.download = `nodulescan-annotated-${image_metadata.filename || 'image'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-100 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-navy-900 font-semibold text-sm">
            <FileText className="w-4 h-4 text-medblue-600" />
            <span>Analysis Summary Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-medium transition-colors shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={handleDownloadImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium transition-colors"
              title="Download Annotated Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Image</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-2"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Area */}
        <div id="printable-report" className="p-6 sm:p-10 space-y-8 bg-white text-slate-800">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-navy-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-tealaccent-400">
                <Activity className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-navy-950">
                  NoduleScan AI
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Computer-Aided Lung Nodule Detection Summary
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 space-y-1">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-700">{formattedDate}</span>
              </div>
              <div>Report Reference: <span className="font-mono text-slate-700">NS-{Date.now().toString().slice(-6)}</span></div>
            </div>
          </div>

          {/* Imaging & Inference Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Input Filename</span>
              <span className="font-semibold text-slate-800 truncate block mt-0.5" title={image_metadata.filename}>
                {image_metadata.filename || 'radiograph.png'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Resolution</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {image_metadata.width ? `${image_metadata.width} × ${image_metadata.height} px` : 'Standard'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Confidence Threshold</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {(confidence_threshold * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Inference Latency</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {inference_time_ms ? `${inference_time_ms} ms` : 'N/A'}
              </span>
            </div>
          </div>

          {/* Detection Findings Summary */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-950 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span>Model Output & Findings</span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                total_detections > 0 ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}>
                {status}
              </span>
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              {total_detections > 0
                ? `The deep-learning object detection model identified ${total_detections} region(s) matching features of pulmonary nodules above the configured ${(confidence_threshold * 100).toFixed(0)}% confidence threshold.`
                : `The deep-learning object detection model identified no candidate nodule bounding boxes above the ${(confidence_threshold * 100).toFixed(0)}% threshold. This result does not confirm the absence of nodules or that the chest radiograph is clinically normal.`}
            </p>

            {/* Annotated Radiograph Thumbnail Preview */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center justify-center p-4 bg-navy-950 rounded-xl border border-navy-800">
              <div className="max-h-72 w-auto overflow-hidden rounded-lg flex items-center justify-center">
                <img
                  src={annotated_image || originalImageUrl}
                  alt="Annotated Radiograph"
                  className="max-h-64 object-contain rounded"
                />
              </div>
            </div>
          </div>

          {/* Detections Detail Table */}
          {total_detections > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-navy-950 uppercase tracking-wider">
                Predicted Bounding Box Localizations
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Estimated Anatomical Region</th>
                      <th className="py-2 px-3">Confidence Score</th>
                      <th className="py-2 px-3">Coordinates [x1, y1, x2, y2]</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {detections.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-700">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{d.location_description}</td>
                        <td className="py-2.5 px-3 font-semibold text-medblue-700">{d.confidence_pct}%</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">[{d.box.join(', ')}]</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Scope & Non-Diagnostic Affirmation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Scope of Automated Output</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li>This summary reflects bounding boxes returned by a computer vision model (YOLOv8n).</li>
              <li>This analysis does not determine whether candidate nodules are malignant or benign.</li>
              <li>No assessment is made for pneumonia, cardiomegaly, pleural effusions, or other thoracic conditions.</li>
              <li>Clinical correlation and radiological overread by a board-certified radiologist or physician are required.</li>
            </ul>
          </div>

          {/* Mandatory Medical Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-amber-950 uppercase tracking-wider text-[10px] block">
                Official Medical Disclaimer
              </span>
              <p className="leading-relaxed">
                This application is an AI research and visualization tool. Its predictions may be incorrect and are not a medical diagnosis. It must not be used to make medical decisions or replace evaluation by a qualified healthcare professional.
              </p>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            NoduleScan AI • Automated Machine Learning Chest Radiograph Localization System
          </div>

        </div>

      </div>
    </div>
  );
}
