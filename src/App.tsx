import React, { useState, useEffect } from 'react';
import { PageView, AssessmentData } from './types/gvms';
import { 
  getStoredRegistry, 
  saveStoredRegistry, 
  DEFAULT_FORM_STATE, 
  INITIAL_REGISTRY_DATA 
} from './data/initialRegistry';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GuideModal } from './components/GuideModal';
import { HelpModal } from './components/HelpModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { LandingPage } from './pages/LandingPage';
import { AssessmentFormPage } from './pages/AssessmentFormPage';
import { ResultsDashboardPage } from './pages/ResultsDashboardPage';
import { TechnologyRegistryPage } from './pages/TechnologyRegistryPage';
import { ComparisonPage } from './pages/ComparisonPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('beranda');
  const [registry, setRegistry] = useState<AssessmentData[]>(() => getStoredRegistry());
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData>(() => ({ ...DEFAULT_FORM_STATE }));
  
  // Initialize comparison with first 2 items from registry for immediate discovery
  const [selectedForCompare, setSelectedForCompare] = useState<AssessmentData[]>(() => {
    const init = getStoredRegistry();
    return init.slice(0, 2);
  });

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync registry changes with localStorage
  useEffect(() => {
    saveStoredRegistry(registry);
  }, [registry]);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToRegistry = (item: AssessmentData) => {
    setRegistry((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...item };
        return copy;
      }
      return [item, ...prev];
    });
  };

  const handleSaveDraft = (draft: AssessmentData) => {
    setCurrentAssessment(draft);
    handleSaveToRegistry(draft);
  };

  const handleToggleCompare = (item: AssessmentData) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      }
      if (prev.length >= 3) {
        alert('Maksimal 3 usulan yang dapat dikomparasikan secara bersamaan.');
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleAddToCompare = (item: AssessmentData) => {
    setSelectedForCompare((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) return prev;
      if (prev.length >= 3) {
        return [prev[0], prev[1], item];
      }
      return [...prev, item];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setSelectedForCompare((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompare = () => {
    setSelectedForCompare([]);
  };

  const handleSelectAssessmentForDetail = (item: AssessmentData) => {
    setCurrentAssessment(item);
  };

  const handleDeleteAssessment = (id: string) => {
    setRegistry((prev) => prev.filter((p) => p.id !== id));
    setSelectedForCompare((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLoadSimulatedData = (partial: Partial<AssessmentData>) => {
    setCurrentAssessment((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const handleSelectPreset = (item: AssessmentData) => {
    setCurrentAssessment({ ...item });
    handleNavigate('hasil');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0b1c30]">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        selectedCompareCount={selectedForCompare.length}
        onOpenGuide={() => setGuideModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        registry={registry}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentPage === 'beranda' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenGuide={() => setGuideModalOpen(true)}
            onLoadSimulatedData={handleLoadSimulatedData}
            registry={registry}
            onSelectAssessment={handleSelectAssessmentForDetail}
          />
        )}

        {currentPage === 'penilaian' && (
          <AssessmentFormPage
            formData={currentAssessment}
            setFormData={setCurrentAssessment}
            onNavigate={handleNavigate}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentPage === 'hasil' && (
          <ResultsDashboardPage
            formData={currentAssessment}
            onNavigate={handleNavigate}
            onSaveToRegistry={handleSaveToRegistry}
            onAddToCompare={handleAddToCompare}
          />
        )}

        {currentPage === 'registry' && (
          <TechnologyRegistryPage
            registry={registry}
            onNavigate={handleNavigate}
            onSelectAssessment={handleSelectAssessmentForDetail}
            selectedForCompare={selectedForCompare}
            onToggleCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
            onDeleteAssessment={handleDeleteAssessment}
          />
        )}

        {currentPage === 'komparasi' && (
          <ComparisonPage
            selectedItems={selectedForCompare}
            registry={registry}
            onNavigate={handleNavigate}
            onRemoveItem={handleRemoveFromCompare}
            onAddItem={handleAddToCompare}
            onSelectForDashboard={handleSelectAssessmentForDetail}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenGuide={() => setGuideModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
      />

      {/* Global Modals */}
      <GuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onNavigate={handleNavigate}
        registry={registry}
        onSelectAssessment={handleSelectAssessmentForDetail}
        onLoadPreset={handleSelectPreset}
      />
    </div>
  );
}

export default App;
