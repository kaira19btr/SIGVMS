import React, { useState } from 'react';
import { PageView, AssessmentData, UserSession } from '../types/gvms';
import { OfficialLogo } from './OfficialLogo';
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
  Layers,
  User,
  LogIn,
  LogOut,
  KeyRound
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
  currentUser: UserSession | null;
  onLogout: () => void;
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
  currentUser,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      {/* Top Institutional Ribbon - Indonesian Government Green Gradient */}
      <div className="w-full bg-gradient-to-r from-[#020F07] via-[#061E12] to-[#020F07] text-emerald-200 text-[11px] py-1.5 px-4 md:px-10 border-b border-emerald-900/80 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
            <span className="tracking-wide text-emerald-100 font-medium">
              Sistem Pendukung Keputusan Pengadaan Publik Berkelanjutan &bull; Republik Indonesia
            </span>
          </div>
          <div className="flex items-center space-x-4 text-emerald-300/80">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>LKPP &bull; KLHK &bull; Bappenas</span>
            </span>
            <span className="text-emerald-700">|</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kanal Resmi SPSE Hijau</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Header - Deep Prestigious Forest Green Gradient */}
      <header className="w-full bg-gradient-to-r from-[#051C10] via-[#0D3823] to-[#082919] border-b border-emerald-700/60 sticky top-0 z-40 shadow-md text-white">
        <div className="w-full mx-auto max-w-[1440px] px-4 md:px-10 flex items-center justify-between h-16">
          
          {/* Brand Logo with Official Dual Crest */}
          <div 
            className="cursor-pointer select-none group" 
            onClick={() => onNavigate(currentUser ? 'beranda' : 'login')}
          >
            <OfficialLogo size="md" variant="light" showSubtitle={true} />
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6 h-full pt-1">
            <button
              onClick={() => onNavigate('beranda')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative ${
                currentPage === 'beranda'
                  ? 'text-white border-b-2 border-[#FACC15]'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => onNavigate('penilaian')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative ${
                currentPage === 'penilaian' || currentPage === 'hasil'
                  ? 'text-white border-b-2 border-[#FACC15]'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              Penilaian Baru
            </button>

            <button
              onClick={() => onNavigate('registry')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative flex items-center gap-1.5 ${
                currentPage === 'registry'
                  ? 'text-white border-b-2 border-[#FACC15]'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              <span>Registry Teknologi</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#134B2C] text-emerald-200 border border-emerald-700/60 rounded-full font-mono">
                {registry.length}
              </span>
            </button>

            <button
              onClick={() => onNavigate('komparasi')}
              className={`text-sm font-semibold pb-1.5 transition-colors duration-150 relative flex items-center gap-1.5 ${
                currentPage === 'komparasi'
                  ? 'text-white border-b-2 border-[#FACC15]'
                  : 'text-emerald-100/70 hover:text-white'
              }`}
            >
              <span>Komparasi Usulan</span>
              {selectedCompareCount > 0 && (
                <span className="bg-[#FACC15] text-[#0E3B24] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {selectedCompareCount}
                </span>
              )}
            </button>
          </nav>

          {/* Trailing Action Buttons & User Profile */}
          <div className="flex items-center space-x-2.5">
            
            {/* Quick Search Button (Cmd+K) */}
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center space-x-2 px-2.5 py-1.5 bg-[#134B2C] hover:bg-[#1A5C38] text-emerald-200 rounded-lg text-xs transition-colors border border-emerald-700/60 cursor-pointer"
              title="Pencarian Cepat (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-emerald-200">Cari...</span>
              <kbd className="text-[9px] bg-[#0E3B24] px-1 py-0.5 rounded border border-emerald-700 font-mono text-emerald-300">
                ⌘K
              </kbd>
            </button>

            {/* Quick Preset Selector Dropdown */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setShowPresetMenu(!showPresetMenu)}
                className="px-2.5 py-1.5 bg-[#134B2C] border border-emerald-700/60 hover:border-emerald-400 text-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>Muat Preset</span>
                <ChevronDown className="w-3 h-3 text-emerald-300" />
              </button>

              {showPresetMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white text-slate-900 border border-[#CBD5E1] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
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
                        className="w-full text-left p-2 rounded-lg hover:bg-[#F2F7F4] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-[#0E3B24] truncate max-w-[180px]">
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

            {/* Primary Action Button */}
            <button
              onClick={() => onNavigate('penilaian')}
              className="inline-flex items-center space-x-1.5 bg-[#FACC15] hover:bg-yellow-400 text-[#0E3B24] px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mulai Penilaian</span>
            </button>

            <div className="h-5 w-px bg-emerald-700/60 mx-0.5 hidden sm:block"></div>

            {/* Help & Notification Icons */}
            <div className="flex items-center space-x-1 relative">
              <button
                onClick={onOpenHelp}
                aria-label="Bantuan & Metodologi"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-[#134B2C] rounded-lg transition-colors cursor-pointer"
                title="Bantuan & Glosarium"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Pemberitahuan Sistem"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-[#134B2C] rounded-lg transition-colors relative cursor-pointer"
                title="Pemberitahuan Sistem"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FACC15] rounded-full ring-2 ring-[#0E3B24]"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white text-slate-900 border border-[#CBD5E1] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] mb-2">
                    <span className="text-xs font-bold text-[#0E3B24]">Pemberitahuan SPSE</span>
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
                          n.unread ? 'bg-[#EBF5EE] border border-emerald-200' : 'bg-slate-50'
                        }`}
                      >
                        <div className="font-semibold text-[#0E3B24] flex items-center justify-between">
                          <span>{n.title}</span>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 bg-[#1E5631] rounded-full"></span>
                          )}
                        </div>
                        <p className="text-slate-600 mt-0.5 leading-relaxed">{n.desc}</p>
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
                      className="text-[11px] text-[#1E5631] hover:underline font-bold"
                    >
                      Buka Registry Nasional &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Session Auth Badge / Login Action */}
            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 pl-2 pr-2.5 py-1 bg-[#134B2C] hover:bg-[#1A5C38] border border-emerald-600/60 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Profil Pejabat / Pengguna"
                  >
                    <div className="w-6 h-6 rounded bg-[#FACC15] text-[#0E3B24] font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left hidden md:block leading-tight">
                      <div className="font-bold text-white text-[11px] truncate max-w-[120px]">
                        {currentUser.name.split(',')[0]}
                      </div>
                      <div className="text-[9px] text-emerald-300 truncate max-w-[120px]">
                        {currentUser.role.split(' ')[0]}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-emerald-300" />
                  </button>

                  {/* User Profile Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                      <div className="pb-3 border-b border-slate-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-800 bg-[#EBF5EE] px-2 py-0.5 rounded uppercase tracking-wider">
                            Akun Terverifikasi BSrE
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {currentUser.certId}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-[#0E3B24] pt-1">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          {currentUser.role}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {currentUser.agency} &bull; {currentUser.department}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono pt-1">
                          NIP: {currentUser.nip}
                        </div>
                      </div>

                      <div className="py-2 text-[11px] text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Waktu Sesi Masuk:</span>
                          <span className="font-semibold text-slate-800">{currentUser.loginTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hak Akses:</span>
                          <span className="font-bold text-[#1E5631]">Pengesahan Dokumen Pokja</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigate('login');
                          }}
                          className="text-xs text-[#0E3B24] hover:underline font-semibold"
                        >
                          Ganti Akun
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-2 px-3.5 py-1.5 bg-gradient-to-r from-[#FACC15] via-yellow-400 to-[#F59E0B] hover:from-yellow-300 hover:to-yellow-500 text-[#0E3B24] font-black rounded-lg text-xs transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0E3B24]" />
                  <span>Masuk SPSE</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-1.5 text-emerald-200 hover:text-white rounded-lg cursor-pointer"
              title="Menu Navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {showMobileMenu && (
          <div className="lg:hidden bg-[#0B2E1B] border-t border-emerald-800 p-4 space-y-3 shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  onNavigate('beranda');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded-lg text-left border ${
                  currentPage === 'beranda' ? 'bg-[#134B2C] border-emerald-400 text-white' : 'border-emerald-800/80 text-emerald-200'
                }`}
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  onNavigate('penilaian');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded-lg text-left border ${
                  currentPage === 'penilaian' || currentPage === 'hasil' ? 'bg-[#134B2C] border-emerald-400 text-white' : 'border-emerald-800/80 text-emerald-200'
                }`}
              >
                Penilaian Baru
              </button>
              <button
                onClick={() => {
                  onNavigate('registry');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded-lg text-left border ${
                  currentPage === 'registry' ? 'bg-[#134B2C] border-emerald-400 text-white' : 'border-emerald-800/80 text-emerald-200'
                }`}
              >
                Registry ({registry.length})
              </button>
              <button
                onClick={() => {
                  onNavigate('komparasi');
                  setShowMobileMenu(false);
                }}
                className={`p-2.5 rounded-lg text-left border ${
                  currentPage === 'komparasi' ? 'bg-[#134B2C] border-emerald-400 text-white' : 'border-emerald-800/80 text-emerald-200'
                }`}
              >
                Komparasi ({selectedCompareCount})
              </button>
            </div>

            <div className="pt-2 border-t border-emerald-800 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  onOpenGuide();
                  setShowMobileMenu(false);
                }}
                className="text-emerald-300 hover:text-white font-semibold"
              >
                Panduan PDF
              </button>
              <button
                onClick={() => {
                  onNavigate('login');
                  setShowMobileMenu(false);
                }}
                className="text-[#FACC15] font-bold flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{currentUser ? 'Akun Saya' : 'Masuk SPSE'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
