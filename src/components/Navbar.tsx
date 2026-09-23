import React, { useState } from 'react';
import { PageView, AssessmentData } from '../types/gvms';
import { 
  Building2, 
  ShieldCheck, 
  Download, 
  PlusCircle, 
  HelpCircle, 
  Bell, 
  CheckCircle2, 
  X,
  FileText,
  Search,
  ChevronDown,
  Sparkles,
  Menu,
  Scale,
  Database,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  selectedCompareCount?: number;
  onOpenGuide: () => void;
  onOpenHelp: () => void;
  onOpenSearch: () => void;
  registry: AssessmentData[];
  onSelectPreset: (item: AssessmentData) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  selectedCompareCount = 0,
  onOpenGuide,
  onOpenHelp,
  onOpenSearch,
  registry,
  onSelectPreset,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Pemutakhiran SBM 2025 Terpasang',
      desc: 'Standar Biaya Masukan klaster pengolahan sampah telah disinkronkan ke basis Bappenas.',
      time: '1 jam yang lalu',
      unread: true,
      targetId: 'GVMS-2025-084',
    },
    {
      id: 2,
      title: 'Verifikasi Usulan RDF Cimahi Selesai',
      desc: 'Proposal PROP-2025-WTE-008 berhasil diverifikasi oleh Ditjen PSLB3.',
      time: '4 jam yang lalu',
      unread: false,
      targetId: 'GVMS-2025-084',
    },
  ];

  return (
    <>
      {/* Institutional Metadata Ribbon */}
      <div className="w-full bg-[#041534] text-[#dce9ff] text-[11px] py-1.5 px-4 md:px-10 border-b border-[#1b2a4a]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#b5f1bf] animate-pulse"></span>
            <span className="tracking-wide">
              Sistem Pendukung Keputusan Pengadaan Publik Berkelanjutan - Republik Indonesia
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[#cbdbf5]">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Bappenas / LKPP / KLHK</span>
            </span>
            <span className="text-[#75777f]">|</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kanal Resmi Verifikasi SPSE</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <header className="w-full bg-white border-b border-[#CBD5E1] sticky top-0 z-40 shadow-xs">
        <div className="w-full mx-auto max-w-[1440px] px-4 md:px-10 flex items-center justify-between h-16">
          {/* Brand Logo / Product Name */}
          <div 
            className="flex items-center space-x-3.5 cursor-pointer select-none group" 
            onClick={() => onNavigate('beranda')}
          >
            <div className="w-8 h-8 rounded bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
              G
            </div>
            <div className="flex flex-col">
              <div className="font-bold text-base tracking-tight text-[#041534] leading-tight flex items-center gap-1.5">
                Sistem GVMS LKPP
                <span className="hidden xl:inline-block text-[10px] bg-[#Eff4FF] text-[#1B2A4A] font-medium px-1.5 py-0.5 rounded border border-[#CBD5E1]">
                  SPSE Hijau
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] leading-none">LKPP &amp; KLHK RI</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 h-full pt-1">
            <button
              onClick={() => onNavigate('beranda')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative ${
                currentPage === 'beranda'
                  ? 'text-[#1E5631] border-b-2 border-[#1E5631]'
                  : 'text-[#45464e] hover:text-[#041534]'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => onNavigate('penilaian')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative ${
                currentPage === 'penilaian' || currentPage === 'hasil'
                  ? 'text-[#1E5631] border-b-2 border-[#1E5631]'
                  : 'text-[#45464e] hover:text-[#041534]'
              }`}
            >
              Penilaian Baru
            </button>

            <button
              onClick={() => onNavigate('registry')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative flex items-center gap-1.5 ${
                currentPage === 'registry'
                  ? 'text-[#1E5631] border-b-2 border-[#1E5631]'
                  : 'text-[#45464e] hover:text-[#041534]'
              }`}
            >
              <span>Registry Teknologi</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full font-mono">
                {registry.length}
              </span>
            </button>

            <button
              onClick={() => onNavigate('komparasi')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative flex items-center gap-1.5 ${
                currentPage === 'komparasi'
                  ? 'text-[#1E5631] border-b-2 border-[#1E5631]'
                  : 'text-[#45464e] hover:text-[#041534]'
              }`}
            >
              <span>Komparasi Usulan</span>
              {selectedCompareCount > 0 && (
                <span className="bg-[#1E5631] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {selectedCompareCount}
                </span>
              )}
            </button>
          </nav>

          {/* Trailing Action Buttons & Tools */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Search Button (Cmd+K) */}
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center space-x-2 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors border border-[#CBD5E1]"
              title="Pencarian Cepat (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Cari...</span>
              <kbd className="text-[9px] bg-white px-1 py-0.5 rounded border border-slate-300 font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Quick Preset Selector Dropdown */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setShowPresetMenu(!showPresetMenu)}
                className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#1E5631] text-[#1B2A4A] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1E5631]" />
                <span>Muat Preset</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPresetMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#CBD5E1] rounded-lg shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Pilih Kasus Uji Coba Cepat:
                  </div>
                  <div className="space-y-1">
                    {registry.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPreset(p);
                          setShowPresetMenu(false);
                        }}
                        className="w-full text-left p-2 rounded hover:bg-slate-100 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-bold text-[#041534] truncate max-w-[180px]">
                            {p.namaTeknologi}
                          </div>
                          <div className="text-[10px] text-slate-500">{p.daerah}</div>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#1E5631]">
                          {p.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('penilaian')}
              className="inline-flex items-center space-x-1.5 bg-[#1E5631] hover:bg-[#163F24] active:bg-[#0E2917] text-white px-3.5 py-1.5 rounded text-xs font-semibold transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mulai Penilaian</span>
            </button>

            <div className="h-5 w-px bg-[#CBD5E1] mx-0.5 hidden sm:block"></div>

            {/* Help & Notification Icons */}
            <div className="flex items-center space-x-1 relative">
              <button
                onClick={onOpenHelp}
                aria-label="Bantuan & Metodologi"
                className="p-1.5 text-[#64748B] hover:text-[#1B2A4A] hover:bg-slate-100 rounded transition-colors"
                title="Bantuan & Glosarium"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Pemberitahuan Sistem"
                className="p-1.5 text-[#64748B] hover:text-[#1B2A4A] hover:bg-slate-100 rounded transition-colors relative"
                title="Pemberitahuan Sistem"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D68910] rounded-full ring-2 ring-white"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#CBD5E1] rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] mb-2">
                    <span className="text-xs font-bold text-[#1B2A4A]">Pemberitahuan SPSE</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          const target = registry.find((r) => r.id === n.targetId);
                          if (target) {
                            onSelectPreset(target);
                          }
                          setShowNotifications(false);
                        }}
                        className={`p-2 rounded text-xs cursor-pointer hover:bg-slate-100 transition-colors ${
                          n.unread ? 'bg-[#Eff4FF] border border-[#CBD5E1]' : 'bg-slate-50'
                        }`}
                      >
                        <div className="font-semibold text-[#1B2A4A] flex items-center justify-between">
                          <span>{n.title}</span>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 bg-[#1E5631] rounded-full"></span>
                          )}
                        </div>
                        <p className="text-[#64748B] mt-0.5 leading-relaxed">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#CBD5E1] text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('registry');
                      }}
                      className="text-[11px] text-[#1E5631] hover:underline font-semibold"
                    >
                      Buka Registry Nasional →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded"
              title="Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-b border-[#CBD5E1] p-4 space-y-3 shadow-md">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  onNavigate('beranda');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded text-left border ${
                  currentPage === 'beranda' ? 'bg-[#EBF5EE] border-[#1E5631] text-[#1E5631]' : 'border-slate-200'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  onNavigate('penilaian');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded text-left border ${
                  currentPage === 'penilaian' || currentPage === 'hasil' ? 'bg-[#EBF5EE] border-[#1E5631] text-[#1E5631]' : 'border-slate-200'
                }`}
              >
                Penilaian Baru
              </button>
              <button
                onClick={() => {
                  onNavigate('registry');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded text-left border ${
                  currentPage === 'registry' ? 'bg-[#EBF5EE] border-[#1E5631] text-[#1E5631]' : 'border-slate-200'
                }`}
              >
                Registry ({registry.length})
              </button>
              <button
                onClick={() => {
                  onNavigate('komparasi');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded text-left border ${
                  currentPage === 'komparasi' ? 'bg-[#EBF5EE] border-[#1E5631] text-[#1E5631]' : 'border-slate-200'
                }`}
              >
                Komparasi ({selectedCompareCount})
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  onOpenGuide();
                  setShowMobileMenu(false);
                }}
                className="text-xs text-[#1E5631] font-semibold"
              >
                Unduh Panduan PDF
              </button>
              <button
                onClick={() => {
                  onOpenSearch();
                  setShowMobileMenu(false);
                }}
                className="text-xs text-[#1B2A4A] font-semibold flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Proposal</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
