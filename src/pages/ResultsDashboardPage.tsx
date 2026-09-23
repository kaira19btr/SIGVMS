import React, { useState, useMemo } from 'react';
import { PageView, AssessmentData } from '../types/gvms';
import { calculateGVMS, formatIDR, formatNumberID } from '../utils/gvmsCalculator';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Scale, 
  Save, 
  Edit3, 
  ShieldCheck, 
  FileText,
  Sparkles,
  Sliders,
  Copy,
  BarChart3,
  Radar,
  DollarSign,
  TrendingUp,
  Share2
} from 'lucide-react';
import { BeritaAcaraModal } from '../components/BeritaAcaraModal';

interface ResultsDashboardPageProps {
  formData: AssessmentData;
  onNavigate: (page: PageView) => void;
  onSaveToRegistry: (item: AssessmentData) => void;
  onAddToCompare: (item: AssessmentData) => void;
}

export const ResultsDashboardPage: React.FC<ResultsDashboardPageProps> = ({
  formData,
  onNavigate,
  onSaveToRegistry,
  onAddToCompare,
}) => {
  const baseScores = useMemo(() => calculateGVMS(formData), [formData]);
  const [isSaved, setIsSaved] = useState(false);
  const [showBeritaAcara, setShowBeritaAcara] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // View toggles
  const [chartView, setChartView] = useState<'bar' | 'radar'>('bar');
  const [activeTab, setActiveTab] = useState<'gvms' | 'financial'>('gvms');

  // Interactive What-If Optimization Simulator sliders (delta adjustments)
  const [opexModifier, setOpexModifier] = useState<number>(0); // e.g. -15% to +15%
  const [recoveryModifier, setRecoveryModifier] = useState<number>(0); // e.g. 0% to +10%
  const [residuModifier, setResiduModifier] = useState<number>(0); // e.g. -5% to +5%

  // Simulated data based on What-If
  const simulatedData = useMemo(() => {
    return {
      ...formData,
      opex: Math.max(100_000_000, formData.opex * (1 + opexModifier / 100)),
      tingkatPemulihan: Math.min(100, Math.max(30, formData.tingkatPemulihan + recoveryModifier)),
      residuTPA: Math.max(1, formData.residuTPA + residuModifier),
    };
  }, [formData, opexModifier, recoveryModifier, residuModifier]);

  const scores = useMemo(() => calculateGVMS(simulatedData), [simulatedData]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSave = () => {
    onSaveToRegistry(simulatedData);
    setIsSaved(true);
    showToast(`Proposal "${formData.namaTeknologi}" berhasil didaftarkan ke Registry Teknologi!`);
  };

  const handleCompare = () => {
    onAddToCompare(formData);
    onNavigate('komparasi');
  };

  const handleCopySummary = () => {
    const text = `HASIL EVALUASI GVMS LKPP
Proposal: ${formData.namaTeknologi} (${formData.id})
Daerah: ${formData.daerah} | Pengusul: ${formData.pengusul}
Skor GVMS Total: ${scores.gvmsTotal} / 100 (${scores.category})
- Biaya Siklus Hidup (LCC 30%): ${scores.weighted.lcc} / 30
- Kinerja Lingkungan (25%): ${scores.weighted.lingkungan} / 25
- Kinerja Layanan (20%): ${scores.weighted.layanan} / 20
- Nilai Sosial Ekonomi (15%): ${scores.weighted.sosialEkonomi} / 15
- Kesiapan TRL (10%): ${scores.weighted.kesiapanTeknologi} / 10
Status: ${scores.gvmsTotal >= 75 ? 'MEMENUHI SYARAT REKOMENDASI KPBU' : 'PERLU REVISI TEKNO-EKONOMIS'}`;

    navigator.clipboard.writeText(text);
    showToast('Ringkasan evaluasi berhasil disalin ke papan klip.');
  };

  // SVG Gauge calculations
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scores.gvmsTotal / 100) * circumference;

  // Radar chart mathematical points (5 vertices)
  // Axes order: LCC (top 0 deg = -90 in canvas), Lingkungan, Layanan, Sosial, Kesiapan
  const radarPoints = useMemo(() => {
    const center = 100;
    const r = 70;
    const angles = [-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI) / 5, -Math.PI / 2 + (4 * Math.PI) / 5, -Math.PI / 2 + (6 * Math.PI) / 5, -Math.PI / 2 + (8 * Math.PI) / 5];
    
    // Benchmark 75 polygon
    const benchPts = angles.map((a) => {
      const dist = (75 / 100) * r;
      return `${center + dist * Math.cos(a)},${center + dist * Math.sin(a)}`;
    }).join(' ');

    // Actual score polygon
    const rawValues = [scores.raw.lcc, scores.raw.lingkungan, scores.raw.layanan, scores.raw.sosialEkonomi, scores.raw.kesiapanTeknologi];
    const actualPts = angles.map((a, i) => {
      const dist = (Math.max(10, Math.min(100, rawValues[i])) / 100) * r;
      return `${center + dist * Math.cos(a)},${center + dist * Math.sin(a)}`;
    }).join(' ');

    return { benchPts, actualPts, center, r, angles };
  }, [scores]);

  return (
    <div className="w-full bg-[#F1F6F3] min-h-screen py-8 px-4 md:px-10 text-[#0E2917]">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#041534] text-white px-4 py-3 rounded-lg shadow-xl border border-[#CBD5E1] text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#b5f1bf]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Berita Acara Modal */}
      <BeritaAcaraModal
        isOpen={showBeritaAcara}
        onClose={() => setShowBeritaAcara(false)}
        assessment={simulatedData}
        scores={scores}
      />

      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center space-x-2">
            <button onClick={() => onNavigate('beranda')} className="hover:text-[#1E5631] font-medium">
              Beranda
            </button>
            <span>&gt;</span>
            <button onClick={() => onNavigate('penilaian')} className="hover:text-[#1E5631] font-medium">
              Penilaian Baru
            </button>
            <span>&gt;</span>
            <span className="text-[#041534] font-bold">Hasil Evaluasi GVMS</span>
          </div>

          <button
            onClick={() => onNavigate('penilaian')}
            className="text-xs font-semibold text-[#1B2A4A] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Formulir Parameter</span>
          </button>
        </div>

        {/* Header Title Bar with Share & Action Tools */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-[#041534]">
                Hasil Evaluasi Green Value-for-Money Score (GVMS)
              </h1>
              <span className="text-xs font-mono font-bold bg-[#Eff4FF] text-[#1B2A4A] px-2.5 py-0.5 rounded border border-[#CBD5E1]">
                {formData.id}
              </span>
              {(opexModifier !== 0 || recoveryModifier !== 0 || residuModifier !== 0) && (
                <span className="text-[10px] font-bold bg-[#FEF6E9] text-[#D68910] px-2 py-0.5 rounded border border-[#D68910]/30 animate-pulse">
                  Mode Simulasi Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B]">
              Proposal: <span className="font-semibold text-slate-800">{formData.namaTeknologi || 'Fasilitas Sampah Terpadu'}</span> • Pengusul: {formData.pengusul || 'Konsorsium Pengadaan'} • Lokasi: {formData.daerah || 'Kota Percontohan'}
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 border border-[#CBD5E1] text-[#1B2A4A] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Salin Ringkasan Evaluasi"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Ringkasan</span>
            </button>

            <button
              onClick={() => onNavigate('penilaian')}
              className="px-3 py-2 border border-[#CBD5E1] text-[#1B2A4A] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Parameter</span>
            </button>

            <button
              onClick={() => setShowBeritaAcara(true)}
              className="px-3.5 py-2 border border-[#CBD5E1] bg-white text-[#1E5631] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Berita Acara Pokja</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
                isSaved
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-[#1E5631] hover:bg-[#163F24] text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Tersimpan di Registry' : 'Simpan ke Registry'}</span>
            </button>
          </div>
        </div>

        {/* View Switch Tabs: GVMS Overview vs Financial LCC */}
        <div className="flex border-b border-[#CBD5E1] space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('gvms')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'gvms'
                ? 'border-[#1E5631] text-[#1E5631]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tinjauan Skor &amp; Dekomposisi GVMS
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'financial'
                ? 'border-[#1E5631] text-[#1E5631]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Proyeksi Fiskal &amp; Arus Kas 20 Tahun
          </button>
        </div>

        {activeTab === 'gvms' ? (
          <>
            {/* Top Two Main Cards: Score Gauge (Left) & Recommendation Banner (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Circular Score Gauge Card */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs flex flex-col items-center justify-center text-center">
                <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Indeks Komposit Akhir
                </div>

                {/* SVG Circular Meter */}
                <div className="relative w-44 h-44 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#E2E8F0"
                      strokeWidth="12"
                      fill="transparent"
                    />
                    {/* Benchmark Indicator (75.0 line) */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#CBD5E1"
                      strokeWidth="12"
                      strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                      strokeDashoffset="0"
                      fill="transparent"
                      className="opacity-40"
                    />
                    {/* Progress Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={scores.gvmsTotal >= 75 ? '#1E5631' : scores.gvmsTotal >= 50 ? '#1B2A4A' : '#D68910'}
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold font-mono tracking-tight text-[#041534]">
                      {scores.gvmsTotal}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">skala 100</span>
                  </div>
                </div>

                {/* Delta vs Threshold */}
                <div className="mt-2 space-y-1">
                  <div className="inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded bg-[#F8F9FF] border border-[#CBD5E1] text-[#1B2A4A]">
                    <span>{scores.deltaAmbang >= 0 ? `+${scores.deltaAmbang}` : scores.deltaAmbang} Poin</span>
                    <span className="font-normal text-slate-500">vs Ambang Batas (75.0)</span>
                  </div>
                  <div className="text-xs font-semibold text-[#1E5631] block pt-1">
                    {scores.tierLabel}
                  </div>
                </div>
              </div>

              {/* Recommendation Banner & Status Exposition */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                      Keputusan Evaluasi Pokja Pengadaan
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Ref: Keputusan Kepala LKPP No. 12/2024
                    </span>
                  </div>

                  {/* Status Banner */}
                  <div
                    className={`mt-4 p-4 rounded-lg border flex items-start space-x-3.5 ${
                      scores.gvmsTotal >= 75
                        ? 'bg-[#EBF5EE] border-[#1E5631]/30 text-[#041534]'
                        : scores.gvmsTotal >= 50
                        ? 'bg-[#Eff4FF] border-[#1B2A4A]/30 text-[#041534]'
                        : scores.gvmsTotal >= 35
                        ? 'bg-[#FEF6E9] border-[#D68910]/30 text-[#041534]'
                        : 'bg-red-50 border-red-200 text-[#041534]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {scores.gvmsTotal >= 75 ? (
                        <CheckCircle2 className="w-5 h-5 text-[#1E5631]" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-[#D68910]" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-bold">
                        Status: {scores.category}
                      </h3>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {scores.gvmsTotal >= 75
                          ? 'Proposal ini memenuhi seluruh kriteria kelayakan pengadaan berkelanjutan tingkat tinggi. Memiliki efisiensi fiskal LCC unggul, reduksi emisi GRK signifikan, dan rekam jejak teknologi matang untuk skema kontrak jangka panjang KPBU.'
                          : scores.gvmsTotal >= 50
                          ? 'Proposal ini dinilai cukup layak secara teknis operasional, namun disarankan melakukan penajaman pada struktur biaya pemeliharaan tahunan dan kepastian penyerapan tenaga kerja lokal.'
                          : 'Proposal belum memenuhi ambang batas kelayakan minimal (75.0). Diperlukan revisi tekno-ekonomis terhadap CAPEX/OPEX atau optimalisasi teknologi pengurangan residu TPA.'}
                      </p>
                    </div>
                  </div>

                  {/* Regulatory Rules Table / Guidance */}
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className={`p-2 rounded border ${scores.gvmsTotal >= 75 ? 'bg-[#EBF5EE] border-[#1E5631] font-bold' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] text-slate-500">&ge; 75.0</div>
                      <div className="text-[#1E5631] font-bold text-[11px]">Sangat Layak (Hijau)</div>
                    </div>
                    <div className={`p-2 rounded border ${scores.gvmsTotal >= 50 && scores.gvmsTotal < 75 ? 'bg-[#Eff4FF] border-[#1B2A4A] font-bold' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] text-slate-500">50.0 - 74.9</div>
                      <div className="text-[#1B2A4A] font-bold text-[11px]">Layak Direkomendasikan</div>
                    </div>
                    <div className={`p-2 rounded border ${scores.gvmsTotal >= 35 && scores.gvmsTotal < 50 ? 'bg-[#FEF6E9] border-[#D68910] font-bold' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] text-slate-500">35.0 - 49.9</div>
                      <div className="text-[#D68910] font-bold text-[11px]">Perlu Perbaikan</div>
                    </div>
                    <div className={`p-2 rounded border ${scores.gvmsTotal < 35 ? 'bg-red-50 border-red-300 font-bold' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="text-[10px] text-slate-500">&lt; 35.0</div>
                      <div className="text-red-700 font-bold text-[11px]">Tidak Direkomendasikan</div>
                    </div>
                  </div>
                </div>

                {/* Trailing Key Metrics in Banner */}
                <div className="mt-4 pt-3 border-t border-[#CBD5E1] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nilai Kemanfaatan Bersih (VfM)</span>
                    <span className="font-bold text-[#1E5631] font-mono text-sm">{scores.keyIndicators.netVfm}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Estimasi Emisi Terhindarkan</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{scores.keyIndicators.emisiBersihTerhindarkan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Efisiensi Anggaran Daerah</span>
                    <span className="font-bold text-slate-800 font-mono text-sm">{scores.keyIndicators.efisiensiAnggaran}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive What-If Optimization Simulator Card */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#CBD5E1] gap-2">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#1E5631]" />
                  <h3 className="text-sm font-bold text-[#041534]">
                    Simulasi Optimasi Pokja (What-If Analysis)
                  </h3>
                  <span className="text-[10px] bg-[#EBF5EE] text-[#1E5631] px-2 py-0.5 rounded font-bold">
                    Kalkulasi Interaktif
                  </span>
                </div>
                {(opexModifier !== 0 || recoveryModifier !== 0 || residuModifier !== 0) && (
                  <button
                    onClick={() => {
                      setOpexModifier(0);
                      setRecoveryModifier(0);
                      setResiduModifier(0);
                    }}
                    className="text-xs text-[#1E5631] font-semibold hover:underline"
                  >
                    Reset ke Nilai Asli Proposal
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                {/* 1. OPEX Adjustment Slider */}
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Efisiensi OPEX:</span>
                    <span className="font-mono font-bold text-[#1B2A4A]">
                      {opexModifier > 0 ? `+${opexModifier}%` : `${opexModifier}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="5"
                    value={opexModifier}
                    onChange={(e) => setOpexModifier(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1B2A4A]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>-25% (Hemat)</span>
                    <span>0% (Asli)</span>
                    <span>+25% (Naik)</span>
                  </div>
                </div>

                {/* 2. Recovery Rate Adjustment */}
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Peningkatan Recovery:</span>
                    <span className="font-mono font-bold text-[#1E5631]">
                      {recoveryModifier > 0 ? `+${recoveryModifier}%` : `${recoveryModifier}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="15"
                    step="1"
                    value={recoveryModifier}
                    onChange={(e) => setRecoveryModifier(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1E5631]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>-10%</span>
                    <span>0% (Asli)</span>
                    <span>+15% (Optimal)</span>
                  </div>
                </div>

                {/* 3. Residu TPA Adjustment */}
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-700">Reduksi Residu ke TPA:</span>
                    <span className="font-mono font-bold text-[#D68910]">
                      {residuModifier > 0 ? `+${residuModifier}%` : `${residuModifier}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={residuModifier}
                    onChange={(e) => setResiduModifier(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#D68910]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>-8% (Kurang)</span>
                    <span>0% (Asli)</span>
                    <span>+8% (Tinggi)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section: Toggle between Horizontal Bars & Radar Chart */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#CBD5E1] gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#041534]">
                    Dekomposisi Skor 5 Dimensi GVMS
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Perbandingan skor mentah per dimensi (/100) dan kontribusi terbobot ke nilai akhir
                  </p>
                </div>

                {/* View Switcher: Bar vs Radar */}
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded border border-[#CBD5E1] text-xs">
                  <button
                    onClick={() => setChartView('bar')}
                    className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-colors ${
                      chartView === 'bar' ? 'bg-white text-[#1B2A4A] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Diagram Batang</span>
                  </button>
                  <button
                    onClick={() => setChartView('radar')}
                    className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-colors ${
                      chartView === 'radar' ? 'bg-white text-[#1E5631] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Radar className="w-3.5 h-3.5" />
                    <span>Radar Spider Web</span>
                  </button>
                </div>
              </div>

              {chartView === 'bar' ? (
                /* Horizontal Bar Chart */
                <div className="space-y-4 pt-2">
                  {[
                    {
                      id: 'lcc',
                      title: '1. Biaya Siklus Hidup (LCC)',
                      weight: '30%',
                      raw: scores.raw.lcc,
                      weighted: scores.weighted.lcc,
                      color: 'bg-[#1B2A4A]',
                    },
                    {
                      id: 'lingkungan',
                      title: '2. Kinerja Lingkungan',
                      weight: '25%',
                      raw: scores.raw.lingkungan,
                      weighted: scores.weighted.lingkungan,
                      color: 'bg-[#1E5631]',
                    },
                    {
                      id: 'layanan',
                      title: '3. Kinerja Layanan Operasional',
                      weight: '20%',
                      raw: scores.raw.layanan,
                      weighted: scores.weighted.layanan,
                      color: 'bg-[#1F6F6F]',
                    },
                    {
                      id: 'sosial',
                      title: '4. Nilai Sosial & Ekonomi',
                      weight: '15%',
                      raw: scores.raw.sosialEkonomi,
                      weighted: scores.weighted.sosialEkonomi,
                      color: 'bg-[#D68910]',
                    },
                    {
                      id: 'kesiapan',
                      title: '5. Kesiapan Teknologi (TRL)',
                      weight: '10%',
                      raw: scores.raw.kesiapanTeknologi,
                      weighted: scores.weighted.kesiapanTeknologi,
                      color: 'bg-slate-700',
                    },
                  ].map((dim) => (
                    <div key={dim.id} className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{dim.title} ({dim.weight})</span>
                        <div className="flex items-center space-x-3 text-right">
                          <span className="text-[#64748B]">Skor Mentah: <strong className="text-slate-900 font-mono">{dim.raw}/100</strong></span>
                          <span className="text-[#1E5631] font-bold font-mono">Kontribusi: {dim.weighted} poin</span>
                        </div>
                      </div>

                      <div className="relative w-full bg-slate-100 h-4 rounded overflow-hidden">
                        <div
                          className={`${dim.color} h-full transition-all duration-700 rounded`}
                          style={{ width: `${dim.raw}%` }}
                        ></div>
                        <div
                          className="absolute top-0 bottom-0 w-0.5 border-r border-dashed border-red-500"
                          style={{ left: '75%' }}
                          title="Ambang Batas 75.0"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Interactive Radar (Spider Web) Chart */
                <div className="flex flex-col md:flex-row items-center justify-around py-4 gap-6">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                      {/* Concentric rings */}
                      {[0.25, 0.5, 0.75, 1.0].map((level, lIdx) => (
                        <circle
                          key={lIdx}
                          cx={radarPoints.center}
                          cy={radarPoints.center}
                          r={radarPoints.r * level}
                          fill="none"
                          stroke="#E2E8F0"
                          strokeDasharray={level === 0.75 ? '3 3' : 'none'}
                          strokeWidth="1"
                        />
                      ))}

                      {/* 5 Axis spokes */}
                      {radarPoints.angles.map((a, aIdx) => (
                        <line
                          key={aIdx}
                          x1={radarPoints.center}
                          y1={radarPoints.center}
                          x2={radarPoints.center + radarPoints.r * Math.cos(a)}
                          y2={radarPoints.center + radarPoints.r * Math.sin(a)}
                          stroke="#CBD5E1"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Benchmark 75 polygon */}
                      <polygon
                        points={radarPoints.benchPts}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />

                      {/* Actual proposal polygon */}
                      <polygon
                        points={radarPoints.actualPts}
                        fill="#1E5631"
                        fillOpacity="0.3"
                        stroke="#1E5631"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>

                  {/* Radar Legend & Values */}
                  <div className="space-y-2 text-xs w-full max-w-sm">
                    <div className="font-bold text-slate-700 pb-1 border-b border-slate-200 flex justify-between">
                      <span>Dimensi Radar</span>
                      <span>Skor / Ambang 75</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded bg-[#1B2A4A]"></span>
                        <span>Biaya Siklus Hidup (LCC)</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{scores.raw.lcc}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded bg-[#1E5631]"></span>
                        <span>Kinerja Lingkungan</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{scores.raw.lingkungan}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded bg-[#1F6F6F]"></span>
                        <span>Kinerja Layanan</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{scores.raw.layanan}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded bg-[#D68910]"></span>
                        <span>Nilai Sosial &amp; Eko</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{scores.raw.sosialEkonomi}/100</span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-2.5 h-2.5 rounded bg-slate-700"></span>
                        <span>Kesiapan TRL</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{scores.raw.kesiapanTeknologi}/100</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 8 Parameter Bento Cards: Asumsi Tekno-Ekonomis */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#041534]">
                  Parameter Input &amp; Asumsi Tekno-Ekonomis
                </h3>
                <span className="text-xs text-[#64748B]">
                  8 Parameter Kunci Terverifikasi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Investasi CAPEX Awal</span>
                  <div className="text-base font-bold text-[#1B2A4A] font-mono mt-1">
                    {formatIDR(formData.capex)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Modal konstruksi fasilitas</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">OPEX Tahunan (Tersimulasi)</span>
                  <div className="text-base font-bold text-[#1B2A4A] font-mono mt-1">
                    {formatIDR(simulatedData.opex)}/th
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Operasional &amp; suku cadang</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Umur Teknis Aset</span>
                  <div className="text-base font-bold text-slate-800 font-mono mt-1">
                    {formData.umurAset} Tahun
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Siklus depresiasi LKPP</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Estimasi Emisi GRK</span>
                  <div className="text-base font-bold text-[#1E5631] font-mono mt-1">
                    {formatNumberID(formData.emisiGRK)} <span className="text-xs font-normal">tCO2e/th</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Standar MRV KLHK</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Penghindaran Metana</span>
                  <div className="text-base font-bold text-[#1E5631] font-mono mt-1">
                    {formData.penghindaranMetana}%
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Mitigasi landfill gas TPA</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Residu ke TPA</span>
                  <div className="text-base font-bold text-slate-800 font-mono mt-1">
                    {simulatedData.residuTPA}%
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Target SPM &le; 10%</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Kapasitas Harian</span>
                  <div className="text-base font-bold text-[#1F6F6F] font-mono mt-1">
                    {formData.kapasitasHarian} Ton/Hari
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Throughput desain fasilitas</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#CBD5E1] shadow-xs">
                  <span className="text-[11px] text-[#64748B] block">Tenaga Kerja Lokal</span>
                  <div className="text-base font-bold text-[#D68910] font-mono mt-1">
                    {formData.lapanganKerja} Orang
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Serapan pekerja ber-KTP</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Financial 20-Year Cash Flow Projection Tab */
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-[#041534]">
                Proyeksi Arus Kas Siklus Hidup 20 Tahun (LCC Model)
              </h3>
              <p className="text-xs text-[#64748B]">
                Analisis kelayakan fiskal APBD dan proyeksi tipping fee per ton sampah diolah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Total Biaya Siklus Hidup 20 Tahun</span>
                <div className="text-xl font-bold font-mono text-[#1B2A4A] mt-1">
                  {formatIDR(formData.capex + simulatedData.opex * 20)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">CAPEX + (20 × OPEX Tahunan)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Kebutuhan Tipping Fee Rata-Rata</span>
                <div className="text-xl font-bold font-mono text-[#1E5631] mt-1">
                  {formatIDR(
                    Math.round(
                      (formData.capex / 20 + simulatedData.opex) /
                        Math.max(1, formData.kapasitasHarian * 365 * (formData.ketersediaanUptime / 100))
                    )
                  )}{' '}
                  <span className="text-xs font-normal">/ Ton</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Batas wajar SBM: Rp 200rb - 450rb</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Potensi Nilai Manfaat Karbon / Produk</span>
                <div className="text-xl font-bold font-mono text-[#1F6F6F] mt-1">
                  {formatIDR(Math.round(simulatedData.kapasitasHarian * 365 * 120_000))} / th
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Dari penjualan RDF &amp; Sertifikat NEK</span>
              </div>
            </div>

            <div className="p-4 bg-[#EBF5EE] rounded-lg border border-[#1E5631]/30 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-[#1E5631] block mb-1">
                Kesimpulan Kelayakan Fiskal Pokja:
              </span>
              Struktur pembiayaan proposal ini dinilai stabil dan tidak melampaui batas aman defisit APBD Kota {formData.daerah}. Rasio pengembalian modal dan beban subsidi pengelolaan persampahan berada dalam koridor Permendagri No. 7/2021.
            </div>
          </div>
        )}

        {/* Bottom Decision & Follow-up Actions */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#041534]">
              Langkah Tindak Lanjut Pengadaan
            </h4>
            <p className="text-xs text-[#64748B]">
              Bandingkan opsi ini terhadap usulan lain atau simpan ke Registry Nasional LKPP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCompare}
              className="px-4 py-2 border border-[#CBD5E1] hover:bg-slate-50 text-[#1B2A4A] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-[#1F6F6F]" />
              <span>Bandingkan dengan Proposal Lain</span>
            </button>

            <button
              onClick={() => setShowBeritaAcara(true)}
              className="px-4 py-2 bg-[#1B2A4A] hover:bg-[#253961] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara Pokja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
