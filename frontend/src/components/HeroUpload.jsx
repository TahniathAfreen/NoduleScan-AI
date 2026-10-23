import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Image as ImageIcon, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ChevronRight,
  Info
} from 'lucide-react';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

export default function HeroUpload({ 
  onDetect, 
  isAnalyzing, 
  backendStatus,
  error,
  setError
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.25);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    setError(null);
    if (!file) return;

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase()) && 
        !file.name.match(/\.(png|jpg|jpeg)$/i)) {
      setError('Unsupported file type. Please upload a chest X-ray in PNG, JPG, or JPEG format.');
      return;
    }

    // Validate size
    if (file.size === 0) {
      setError('The selected image is empty (0 bytes). Please choose a valid image file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${sizeMB}MB) exceeds the 15MB limit. Please upload a smaller image.`);
      return;
    }

    // Clean up previous preview url if existing
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || isAnalyzing) return;
    onDetect(selectedFile, confidenceThreshold, previewUrl);
  };

  return (
    <section id="home" className="pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-medblue-50 border border-medblue-200/80 text-medblue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            Computer-Aided Detection
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-950 tracking-tight leading-tight sm:leading-none">
            AI-Powered Lung Nodule Detection
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Upload a chest X-ray to visualize potential lung nodule detections using deep learning.
          </p>
        </div>

        {/* Model Setup Notice if best.pt is not yet present */}
        {backendStatus?.healthy && !backendStatus?.data?.model_loaded && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-sm flex items-start gap-3 shadow-sm">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-950">Model Checkpoint Awaiting Placement</p>
              <p className="text-amber-800 text-xs sm:text-sm">
                Place your trained <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-xs">best.pt</code> file into the folder <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-xs">backend/models/best.pt</code>. Once placed, inference will automatically activate.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-800 p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Upload Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-card p-6 sm:p-8 transition-all">
          
          {!selectedFile ? (
            /* Upload Drop Area */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-medblue-500 bg-medblue-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-medblue-400 hover:bg-slate-50/50 bg-[#FAFCFF]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleFileChange}
                className="hidden"
                id="xray-file-input"
              />

              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-medblue-50 flex items-center justify-center text-medblue-600 mb-4 shadow-sm border border-medblue-100">
                <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.8]" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-navy-950 mb-1">
                Upload Chest X-ray
              </h3>
              <p className="text-sm text-slate-500 mb-5">
                Drag and drop your image here, or browse files.
              </p>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm shadow-md transition-all group"
              >
                <span>Choose Image</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 border-t border-slate-100 pt-5">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Supported: PNG, JPG, JPEG
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Max size: 15MB</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                <span>PA / AP Chest Projections</span>
              </div>
            </div>
          ) : (
            /* Selected Image Preview State */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                {/* Thumbnail */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden bg-navy-950 border border-slate-300 shrink-0 shadow-inner flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Selected Chest X-ray preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* File Details */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-100/70 text-emerald-800 text-xs font-semibold mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Image Ready
                  </div>
                  <h4 className="text-base font-semibold text-navy-950 truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Image'}
                  </p>

                  <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-medium text-medblue-600 hover:text-medblue-700 underline underline-offset-2"
                    >
                      Replace Image
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Confidence Threshold Configuration Slider */}
              <div className="p-4 sm:p-5 rounded-xl bg-medblue-50/60 border border-medblue-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-medblue-600" />
                    <label htmlFor="conf-slider" className="text-sm font-semibold text-navy-950">
                      Detection Confidence Threshold
                    </label>
                  </div>
                  <span className="text-sm font-bold text-medblue-700 bg-white px-2.5 py-0.5 rounded border border-medblue-200">
                    {Math.round(confidenceThreshold * 100)}%
                  </span>
                </div>
                <input
                  id="conf-slider"
                  type="range"
                  min="0.10"
                  max="0.80"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  disabled={isAnalyzing}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-medblue-600 disabled:opacity-50"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>Higher Sensitivity (10%)</span>
                  <span>Balanced Default (25%)</span>
                  <span>Higher Specificity (80%)</span>
                </div>
              </div>

              {/* Action Button: Detect Nodules */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-end">
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl font-semibold text-sm shadow-md transition-all ${
                    isAnalyzing
                      ? 'bg-medblue-400 text-white cursor-not-allowed'
                      : 'bg-medblue-600 hover:bg-medblue-700 text-white hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Analyzing X-ray...</span>
                    </>
                  ) : (
                    <>
                      <span>Detect Nodules</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
