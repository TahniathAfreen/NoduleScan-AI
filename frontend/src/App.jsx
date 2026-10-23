import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroUpload from './components/HeroUpload';
import ResultsWorkspace from './components/ResultsWorkspace';
import ReportModal from './components/ReportModal';
import HowItWorks from './components/HowItWorks';
import LungHealth from './components/LungHealth';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import { checkBackendHealth, detectNodules } from './services/api';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [backendStatus, setBackendStatus] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Poll or check backend status on mount
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      const status = await checkBackendHealth();
      if (isMounted) {
        setBackendStatus(status);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDetect = async (file, confidenceThreshold, previewUrl) => {
    setIsAnalyzing(true);
    setError(null);
    setOriginalImageUrl(previewUrl);

    try {
      const data = await detectNodules(file, confidenceThreshold);
      setAnalysisResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Detection failed. Please check the backend connection and model setup.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setOriginalImageUrl(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <Navbar
        backendStatus={backendStatus}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* Conditional View: Medical Results Workspace vs Upload Experience */}
        {analysisResult ? (
          <ResultsWorkspace
            result={analysisResult}
            originalImageUrl={originalImageUrl}
            onReset={handleReset}
            onOpenReport={() => setIsReportOpen(true)}
          />
        ) : (
          <HeroUpload
            onDetect={handleDetect}
            isAnalyzing={isAnalyzing}
            backendStatus={backendStatus}
            error={error}
            setError={setError}
          />
        )}

        {/* Informational & Educational Sections */}
        <HowItWorks />
        <LungHealth />
        <AboutSection />
      </main>

      {/* Footer with Medical Disclaimer */}
      <Footer onNavigate={handleNavigate} />

      {/* Downloadable / Printable Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={analysisResult}
        originalImageUrl={originalImageUrl}
      />
    </div>
  );
}
