import React, { useState, useEffect } from 'react';
import { PageView, AssessmentData } from '../types/gvms';
import { calculateGVMS } from '../utils/gvmsCalculator';
import { Search, X, Database, PlusCircle, Scale, FileText, ArrowRight, Sparkles, Building2 } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageView) => void;
  registry: AssessmentData[];
  onSelectAssessment: (item: AssessmentData) => void;
  onLoadPreset: (item: AssessmentData) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  registry,
  onSelectAssessment,
  onLoadPreset,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle handled by caller if needed
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredRegistry = registry.filter(
    (item) =>
      item.namaTeknologi.toLowerCase().includes(query.toLowerCase()) ||
      item.pengusul.toLowerCase().includes(query.toLowerCase()) ||
      item.daerah.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#CBD5E1] flex items-center gap-2.5 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu, teknologi, proposal, atau daerah..."
            className="flex-1 bg-transparent text-sm text-[#041534] focus:outline-none placeholder-slate-400"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-[#CBD5E1] rounded text-slate-500 font-mono">
            ESC
          </kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 text-xs space-y-3">
          {/* Quick Navigation Section */}
          {!query && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5">
                Navigasi Cepat Halaman
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigate('beranda');
                    onClose();
                  }}
                  className="p-2 rounded text-left hover:bg-slate-100 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Building2 className="w-4 h-4 text-[#1B2A4A]" />
                  <span>Halaman 1: Beranda</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('penilaian');
                    onClose();
                  }}
                  className="p-2 rounded text-left hover:bg-slate-100 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <PlusCircle className="w-4 h-4 text-[#1E5631]" />
                  <span>Halaman 2: Formulir Penilaian</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('registry');
                    onClose();
                  }}
                  className="p-2 rounded text-left hover:bg-slate-100 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Database className="w-4 h-4 text-[#1F6F6F]" />
                  <span>Halaman 4: Registry Teknologi</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('komparasi');
                    onClose();
                  }}
                  className="p-2 rounded text-left hover:bg-slate-100 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Scale className="w-4 h-4 text-[#D68910]" />
                  <span>Halaman 5: Komparasi 3 Opsi</span>
                </button>
              </div>
            </div>
          )}

          {/* Matching Registry Items */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex justify-between">
              <span>Proposal Terdaftar di Registry</span>
              <span>{filteredRegistry.length} hasil</span>
            </div>

            {filteredRegistry.length === 0 ? (
              <p className="text-center text-slate-400 py-3">Tidak ditemukan hasil yang cocok.</p>
            ) : (
              <div className="space-y-1">
                {filteredRegistry.map((item) => {
                  const s = calculateGVMS(item);
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectAssessment(item);
                        onNavigate('hasil');
                        onClose();
                      }}
                      className="p-2.5 rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#041534] group-hover:text-[#1E5631] transition-colors flex items-center gap-1.5">
                          <span>{item.namaTeknologi}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-100 rounded text-slate-600">
                            {item.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.daerah} &bull; {item.pengusul}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#1E5631]">
                          {s.gvmsTotal}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1E5631] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Shortcut hint */}
        <div className="p-2.5 bg-slate-50 border-t border-[#CBD5E1] text-[11px] text-slate-500 flex justify-between items-center px-4">
          <span>Gunakan panah atau klik mouse untuk memilih</span>
          <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#CBD5E1]">
            Pintasan SPSE
          </span>
        </div>
      </div>
    </div>
  );
};
