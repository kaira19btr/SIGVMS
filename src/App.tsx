import React, { useState, useEffect } from 'react';
import { PageView, AssessmentData, UserSession } from './types/gvms';
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
import { LoginPage } from './pages/LoginPage';

export function App() {
  // Directly start at login page as requested: "terus pas pencet link nya langsung ke halaman login"
  const [currentPage, setCurrentPage] = useState<PageView>('login');
  
  const [registry, setRegistry] = useState<AssessmentData[]>(() => getStoredRegistry());
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentData>(() => ({ ...DEFAULT_FORM_STATE }));
  
  // Stored user session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gvms_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  
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

  // Sync session changes with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gvms_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gvms_user_session');
    }
  }, [currentUser]);

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

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    handleNavigate('beranda');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('login');
  };

  // If on login page, render full LoginPage with integrated official layout
  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#E8F2EC] via-[#F1F6F3] to-[#E3EFE7] text-[#0E2917] selection:bg-[#0E3B24] selection:text-[#FACC15]">
      {/* Top Navigation - Official Green Gradient Theme */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        selectedCompareCount={selectedForCompare.length}
        onOpenGuide={() => setGuideModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        registry={registry}
        onSelectPreset={handleSelectPreset}
        currentUser={currentUser}
        onLogout={handleLogout}
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

      {/* Institutional Footer */}
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
