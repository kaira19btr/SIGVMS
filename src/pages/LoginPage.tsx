import React, { useState } from 'react';
import { PageView, UserSession } from '../types/gvms';
import { OfficialLogo } from '../components/OfficialLogo';
import Velaris from '@/components/ui/velaris';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck, 
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Award,
  Trees,
  Sliders
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
  onNavigate: (page: PageView) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
}

// Preset authentic Government Personas for 1-Click Evaluation
const DEMO_PERSONAS: UserSession[] = [
  {
    id: 'USR-POKJA-01',
    name: 'Dr. Ir. Hendra Saputra, M.Sc.',
    nip: '19780412 200312 1 002',
    role: 'Ketua Pokja Pemilihan UKPBJ',
    agency: 'Pemerintah Kota Cimahi',
    department: 'Unit Kerja Pengadaan Barang/Jasa (UKPBJ)',
    certId: 'BSrE-TTE-9821-4402',
    loginTime: '23 Sep 2026, 09:15 WIB',
  },
  {
    id: 'USR-KLHK-02',
    name: 'Dewi Kartikasari, S.T., M.Env.',
    nip: '19850918 200801 2 004',
    role: 'Verifikator Teknis Kelayakan Sampah',
    agency: 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)',
    department: 'Direktorat Pengelolaan Sampah, B3 dan Limbah B3',
    certId: 'BSrE-KLHK-7719-2041',
    loginTime: '23 Sep 2026, 08:45 WIB',
  },
  {
    id: 'USR-PPK-03',
    name: 'Bambang Trianto, S.E., Ak.',
    nip: '19800615 200502 1 001',
    role: 'Pejabat Pembuat Komitmen (PPK)',
    agency: 'Dinas Lingkungan Hidup & Kebersihan',
    department: 'Bidang Sarana Prasarana Persampahan',
    certId: 'BSrE-DLH-5510-9118',
    loginTime: '23 Sep 2026, 10:02 WIB',
  },
  {
    id: 'USR-BPKP-04',
    name: 'Drs. Wahyu Hidayat, M.Si., CFrA',
    nip: '19750320 199903 1 003',
    role: 'Auditor Pengawasan Keuangan Daerah',
    agency: 'Badan Pengawasan Keuangan dan Pembangunan (BPKP)',
    department: 'Deputi Pengawasan Instansi Pemerintah Bidang Polhukam PMK',
    certId: 'BSrE-BPKP-3329-8874',
    loginTime: '23 Sep 2026, 07:30 WIB',
  },
];

// Rich Emerald Institutional Gradient Palette for Velaris WebGL Shaders
const VELARIS_GREEN_PALETTE = [
  "#6ee7b7", // Bright emerald mint highlight
  "#10b981", // Vibrant jade green
  "#047857", // Deep forest pine
  "#062e1a", // Rich obsidian spruce
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [loginMethod, setLoginMethod] = useState<'sso' | 'tte'>('sso');
  const [username, setUsername] = useState('19780412 200312 1 002');
  const [password, setPassword] = useState('••••••••••••');
  const [captchaInput, setCaptchaInput] = useState('8742');
  const [captchaCode, setCaptchaCode] = useState('8742');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Living Gradient controls
  const [motionSpeed, setMotionSpeed] = useState(1.6);
  const [grainIntensity, setGrainIntensity] = useState(0.2);

  const refreshCaptcha = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(random);
    setCaptchaInput('');
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim()) {
      setErrorMsg('NIP atau Username SPSE wajib diisi.');
      return;
    }
    if (captchaInput !== captchaCode) {
      setErrorMsg('Kode captcha tidak sesuai. Silakan coba lagi.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const matched = DEMO_PERSONAS.find((p) => p.nip.replace(/\s+/g, '') === username.replace(/\s+/g, ''));
      const activeUser: UserSession = matched || {
        id: `USR-CUSTOM-${Date.now()}`,
        name: 'Pejabat Penilai GVMS',
        nip: username,
        role: 'Evaluator Usulan SPSE',
        agency: 'Unit Kerja Pengadaan Barang/Jasa (UKPBJ)',
        department: 'Kelompok Kerja Pemilihan',
        certId: `BSrE-TTE-${Math.floor(1000 + Math.random() * 9000)}`,
        loginTime: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      onLoginSuccess(activeUser);
      onNavigate('beranda');
    }, 600);
  };

  const handlePersonaSelect = (persona: UserSession) => {
    setUsername(persona.nip);
    setCaptchaInput(captchaCode);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(persona);
      onNavigate('beranda');
    }, 400);
  };

  const handleGuestAccess = () => {
    onNavigate('beranda');
  };

  return (
    <Velaris
      bg="#03160C"
      colors={VELARIS_GREEN_PALETTE}
      speed={motionSpeed}
      grain={grainIntensity}
      height="100%"
      className="min-h-screen w-full flex flex-col justify-between selection:bg-[#FACC15] selection:text-[#0E3B24]"
    >
      {/* Top National Identity Strip */}
      <div className="w-full bg-[#020F07]/90 backdrop-blur-md border-b border-emerald-900/80 py-2.5 px-4 md:px-10 text-xs shadow-sm">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3 text-emerald-200/90">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
            <span className="font-bold text-white tracking-wider text-[11px] sm:text-xs">
              PORTAL RESMI INAPROC &bull; SISTEM PENGADAAN SECARA ELEKTRONIK (SPSE)
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-emerald-300/90">
            <span>LKPP RI</span>
            <span>&bull;</span>
            <span>Kementerian Lingkungan Hidup dan Kehutanan (KLHK)</span>
            <span>&bull;</span>
            <span>Bappenas</span>
          </div>
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="flex-1 max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8 lg:py-12 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero & Institutional Information */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-4">
              <OfficialLogo size="lg" variant="light" showSubtitle={true} />
              
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-[11px] text-[#FACC15] font-semibold mb-3 backdrop-blur-md shadow-sm">
                  <Trees className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pengadaan Publik Berkelanjutan &bull; Green Value-for-Money</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-[1.15] drop-shadow-md">
                  Pintu Masuk Terpadu Penilaian GVMS Pengadaan Sampah
                </h1>
                
                <p className="text-sm text-emerald-100/90 mt-3 leading-relaxed drop-shadow-xs">
                  Sistem otentikasi tunggal bagi Pokja Pemilihan UKPBJ, Tim Teknis KLHK, Pejabat Pembuat Komitmen (PPK), dan Pengawas Keuangan BPKP untuk mengevaluasi proposal teknologi pengolahan sampah kota.
                </p>
              </div>
            </div>

            {/* Trust Badges with Glassmorphism */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-[#082C18]/80 rounded-xl border border-emerald-500/40 backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-2 text-emerald-300 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Tanda Tangan BSrE
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-snug">
                  Terintegrasi sertifikasi elektronik Balai Sertifikasi Elektronik (BSSN RI).
                </p>
              </div>

              <div className="p-4 bg-[#082C18]/80 rounded-xl border border-emerald-500/40 backdrop-blur-md shadow-lg">
                <div className="flex items-center space-x-2 text-emerald-300 mb-1">
                  <FileCheck className="w-4 h-4 text-[#FACC15]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Regulasi Sah 2024
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-snug">
                  Sesuai Perpres 12/2021 &amp; Keputusan Kepala LKPP No. 12/2024.
                </p>
              </div>
            </div>

            {/* Living Gradient Status Indicator */}
            <div className="flex items-center gap-2 text-[11px] text-emerald-300/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Latar Gradasi Dinamis WebGL Simplex-Noise Aktif</span>
            </div>

            {/* Active Session Card if already logged in */}
            {currentUser && (
              <div className="p-4 bg-emerald-950/90 rounded-xl border border-[#FACC15]/50 space-y-2 text-xs backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>Sesi Anda Sedang Aktif:</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300 bg-black/50 px-2 py-0.5 rounded border border-emerald-700/50">
                    {currentUser.certId}
                  </span>
                </div>
                <div className="font-bold text-white text-sm">{currentUser.name}</div>
                <div className="text-emerald-200 text-[11px]">{currentUser.role} &bull; {currentUser.agency}</div>
                <div className="pt-2 flex items-center space-x-3">
                  <button
                    onClick={() => onNavigate('beranda')}
                    className="px-3.5 py-1.5 bg-[#FACC15] hover:bg-yellow-400 text-[#0E3B24] font-black rounded-lg text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Lanjutkan ke Dasbor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-xs text-red-300 hover:text-red-100 hover:underline cursor-pointer"
                  >
                    Keluar / Ganti Akun
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Login Box Card */}
          <div className="lg:col-span-6">
            <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl shadow-2xl border border-emerald-800/40 overflow-hidden">
              
              {/* Card Header with Green Gradient */}
              <div className="bg-gradient-to-r from-[#062013] via-[#0E3B24] to-[#144F2F] text-white p-6 border-b-2 border-[#FACC15]/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>Autentikasi Pengguna SPSE</span>
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-600/50">
                    HTTPS TLS 1.3
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Masuk ke Sistem GVMS
                </h2>
                <p className="text-xs text-emerald-200/90 mt-1">
                  Gunakan NIP ASN, Akun INAPROC SSO, atau Sertifikat Digital TTE.
                </p>

                {/* Tab Switcher: SSO vs TTE */}
                <div className="flex items-center gap-1 mt-4 p-1 bg-[#03150C]/90 rounded-lg border border-emerald-800/70">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('sso')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      loginMethod === 'sso'
                        ? 'bg-gradient-to-r from-[#1E5631] to-[#134B2C] text-white shadow-xs border border-emerald-500/40'
                        : 'text-emerald-300/80 hover:text-white'
                    }`}
                  >
                    Akun SSO INAPROC / NIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('tte')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      loginMethod === 'tte'
                        ? 'bg-gradient-to-r from-[#1E5631] to-[#134B2C] text-white shadow-xs border border-emerald-500/40'
                        : 'text-emerald-300/80 hover:text-white'
                    }`}
                  >
                    Sertifikat Digital (BSrE)
                  </button>
                </div>
              </div>

              {/* Login Form Body */}
              <div className="p-6 space-y-5 bg-[#FBFDFB]">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-800 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleManualLogin} className="space-y-4">
                  {/* Username / NIP Field */}
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-800 flex items-center justify-between">
                      <span>NIP Aparatur Sipil Negara / User ID SPSE:</span>
                      <span className="text-[10px] text-slate-500 font-normal">Wajib diisi</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Contoh: 19780412 200312 1 002"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0E3B24] focus:ring-1 focus:ring-[#0E3B24] text-slate-900 shadow-xs"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-800 flex items-center justify-between">
                      <span>Kata Sandi / Frasa Sandi Pengadaan:</span>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert('Hubungi Administrator LPSE / Helpdesk LKPP untuk reset kata sandi.'); }} 
                        className="text-[10px] text-[#0E3B24] hover:underline font-semibold"
                      >
                        Lupa Sandi?
                      </a>
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-[#0E3B24] focus:ring-1 focus:ring-[#0E3B24] text-slate-900 shadow-xs"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Captcha Security Verification */}
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-800">
                      Kode Keamanan Captcha:
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          placeholder="Ketik 4 angka"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:border-[#0E3B24]"
                          maxLength={4}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#EBF5EE] to-[#E2EFE7] border border-emerald-300 rounded-lg shadow-xs">
                        <span className="font-mono text-base font-extrabold tracking-widest text-[#0E3B24] line-through select-none">
                          {captchaCode}
                        </span>
                        <button
                          type="button"
                          onClick={refreshCaptcha}
                          className="text-slate-400 hover:text-[#0E3B24] p-1 transition-colors cursor-pointer"
                          title="Ganti Kode"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button with Green Gradient */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#0E3B24] via-[#134B2C] to-[#1E5631] hover:from-[#134B2C] hover:to-[#0E3B24] active:scale-[0.99] text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-60 cursor-pointer border border-emerald-600/30"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#FACC15]" />
                        <span>Memverifikasi Identitas ASN...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk Menggunakan Akun SPSE</span>
                        <ArrowRight className="w-4 h-4 text-[#FACC15]" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Persona Evaluator Sandbox */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#0E3B24]" />
                      <span>Uji Coba Cepat Persona Pejabat (1-Klik):</span>
                    </span>
                    <span className="text-[10px] text-emerald-900 font-bold bg-[#EBF5EE] px-2 py-0.5 rounded-full border border-emerald-200">
                      Mode Evaluator
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEMO_PERSONAS.map((persona) => (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handlePersonaSelect(persona)}
                        className="p-3 rounded-lg border border-slate-200 hover:border-emerald-600 bg-white hover:bg-gradient-to-br hover:from-[#EBF5EE] hover:to-[#E0EFE5] text-left transition-all group cursor-pointer shadow-xs"
                      >
                        <div className="font-bold text-xs text-slate-900 group-hover:text-[#0E3B24] truncate">
                          {persona.name}
                        </div>
                        <div className="text-[10px] font-semibold text-[#134B2C] truncate mt-0.5">
                          {persona.role}
                        </div>
                        <div className="text-[9px] text-slate-500 truncate font-mono mt-0.5">
                          NIP: {persona.nip}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guest access button */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleGuestAccess}
                    className="text-xs text-emerald-900 hover:text-[#0E3B24] font-bold underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Masuk Sebagai Tamu / Akses Publik &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Regulatory Disclaimer Footer */}
      <div className="w-full bg-[#020F07]/90 backdrop-blur-md border-t border-emerald-900/80 py-4 px-4 md:px-10 text-[11px] text-emerald-200/80 shadow-inner">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            &copy; 2026 Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP) &bull; Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Sertifikasi ISO 27001 BSSN</span>
            </span>
            <span>&bull;</span>
            <span>Bantuan Teknis: helpdesk@lkpp.go.id</span>
          </div>
        </div>
      </div>
    </Velaris>
  );
};
