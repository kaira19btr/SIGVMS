import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageView, AssessmentData } from '../types/gvms';
import { calculateGVMS, formatIDR, formatNumberID } from '../utils/gvmsCalculator';
import { DEFAULT_FORM_STATE } from '../data/initialRegistry';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Save, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Building,
  MapPin,
  Tag,
  Sliders,
  Download,
  Upload,
  Zap,
  CheckCheck
} from 'lucide-react';

interface AssessmentFormPageProps {
  formData: AssessmentData;
  setFormData: React.Dispatch<React.SetStateAction<AssessmentData>>;
  onNavigate: (page: PageView) => void;
  onSaveDraft: (data: AssessmentData) => void;
}

export const AssessmentFormPage: React.FC<AssessmentFormPageProps> = ({
  formData,
  setFormData,
  onNavigate,
  onSaveDraft,
}) => {
  // Collapsible section open state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    meta: true,
    lcc: true,
    lingkungan: true,
    layanan: true,
    sosial: true,
    kesiapan: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [targetScore, setTargetScore] = useState<number>(85);
  const [sensitivityMode, setSensitivityMode] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Live calculated scores
  const scores = useMemo(() => calculateGVMS(formData), [formData]);

  // Completion calculation
  const completedSectionsCount = useMemo(() => {
    let count = 0;
    if (formData.capex > 0 && formData.opex > 0 && formData.umurAset > 0) count++;
    if (formData.penghindaranMetana > 0 && formData.residuTPA >= 0) count++;
    if (formData.kapasitasHarian > 0 && formData.ketersediaanUptime > 0) count++;
    if (formData.lapanganKerja > 0 && formData.skorPenerimaanMasyarakat) count++;
    if (formData.tingkatKematangan !== '') count++;
    return count;
  }, [formData]);

  const progressPercent = Math.round((completedSectionsCount / 5) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoadSample = (type: 'cimahi' | 'surabaya' | 'denpasar') => {
    if (type === 'cimahi') {
      setFormData({ ...DEFAULT_FORM_STATE });
      showToast('Data RDF Kota Cimahi berhasil dimuat.');
    } else if (type === 'surabaya') {
      setFormData({
        id: 'PROP-2025-BIO-012',
        namaTeknologi: 'Biodrying & Komposting Skala Kawasan 80TPD',
        pengusul: 'PT Bio Lestari Mandiri Bersama',
        daerah: 'Kota Surabaya',
        provinsi: 'Jawa Timur',
        spesifikasiSingkat: 'Kapasitas 80 TPD • Biologis • Recovery 82%',
        kategoriTeknologi: 'Biological Treatment',
        tanggalPenilaian: '23 September 2026',
        status: 'Terverifikasi',
        capex: 38_000_000_000,
        opex: 4_100_000_000,
        umurAset: 18,
        emisiGRK: 11800,
        penghindaranMetana: 78.0,
        residuTPA: 12.5,
        kapasitasHarian: 80,
        ketersediaanUptime: 89.5,
        tingkatPemulihan: 82.0,
        lapanganKerja: 56,
        skorPenerimaanMasyarakat: 4,
        tingkatKematangan: 'commercial',
      });
      showToast('Data Biodrying Surabaya berhasil dimuat.');
    } else if (type === 'denpasar') {
      setFormData({
        id: 'PROP-2025-MRF-024',
        namaTeknologi: 'Material Recovery Facility (MRF) Otomatis',
        pengusul: 'PT Bali Sirkular Presisi',
        daerah: 'Kota Denpasar',
        provinsi: 'Bali',
        spesifikasiSingkat: 'AI Optical Sorting • Recovery 92.5%',
        kategoriTeknologi: 'Mechanical Sorting',
        tanggalPenilaian: '23 September 2026',
        status: 'Terverifikasi',
        capex: 52_000_000_000,
        opex: 3_800_000_000,
        umurAset: 20,
        emisiGRK: 9800,
        penghindaranMetana: 88.0,
        residuTPA: 6.5,
        kapasitasHarian: 150,
        ketersediaanUptime: 94.5,
        tingkatPemulihan: 92.5,
        lapanganKerja: 65,
        skorPenerimaanMasyarakat: 5,
        tingkatKematangan: 'national_registry',
      });
      showToast('Data MRF Denpasar berhasil dimuat.');
    }
  };

  const handleReset = () => {
    setFormData({
      id: `PROP-${new Date().getFullYear()}-WTE-${Math.floor(100 + Math.random() * 900)}`,
      namaTeknologi: '',
      pengusul: '',
      daerah: '',
      provinsi: '',
      spesifikasiSingkat: '',
      kategoriTeknologi: 'Waste-to-Energy',
      tanggalPenilaian: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Dalam Proses',
      capex: 0,
      opex: 0,
      umurAset: 20,
      emisiGRK: 0,
      penghindaranMetana: 0,
      residuTPA: 0,
      kapasitasHarian: 0,
      ketersediaanUptime: 90,
      tingkatPemulihan: 80,
      lapanganKerja: 0,
      skorPenerimaanMasyarakat: 3,
      tingkatKematangan: '',
    });
    showToast('Formulir berhasil dikosongkan.');
  };

  const handleSaveDraftClick = () => {
    onSaveDraft(formData);
    showToast(`Draf usulan ${formData.id} berhasil disimpan ke basis data.`);
  };

  const handleCalculateClick = () => {
    if (!formData.namaTeknologi.trim()) {
      showToast('Mohon lengkapi Nama Teknologi usulan sebelum membuka hasil.');
      return;
    }
    onNavigate('hasil');
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GVMS-Formulir-${formData.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Berkas JSON formulir berhasil diunduh.');
  };

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.capex !== undefined && parsed.kapasitasHarian !== undefined) {
          setFormData(parsed);
          showToast('Formulir berhasil dimuat dari berkas JSON.');
        } else {
          showToast('Format berkas JSON tidak sesuai.');
        }
      } catch (err) {
        showToast('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Recommendations for target score in sensitivity mode
  const sensitivityTips = useMemo(() => {
    const gap = targetScore - scores.gvmsTotal;
    if (gap <= 0) {
      return ['Skor saat ini sudah melampaui target yang ditentukan!'];
    }
    const tips: string[] = [];
    if (formData.residuTPA > 10) {
      tips.push(`Kurangi residu TPA ke bawah 10% (saat ini ${formData.residuTPA}%) untuk menambah ~${((formData.residuTPA - 8) * 0.35).toFixed(1)} poin.`);
    }
    if (formData.ketersediaanUptime < 95) {
      tips.push(`Tingkatkan jaminan uptime ke &ge;95% untuk menambah ~2.5 poin pilar layanan.`);
    }
    if (formData.penghindaranMetana < 90) {
      tips.push(`Optimalkan tangkapan metana hingga 90% (saat ini ${formData.penghindaranMetana}%) untuk kenaikan ~${((90 - formData.penghindaranMetana) * 0.1).toFixed(1)} poin.`);
    }
    if (formData.tingkatKematangan !== 'national_registry') {
      tips.push('Pendaftaran ke Registry Katalog Elektronik Nasional (TRL 9) akan memberikan tambahan langsung +2.0 poin.');
    }
    return tips.length > 0 ? tips : ['Tingkatkan efisiensi OPEX tahunan sebesar 10% untuk mendongkrak skor LCC.'];
  }, [targetScore, scores.gvmsTotal, formData]);

  return (
    <div className="w-full bg-[#F1F6F3] min-h-screen py-8 px-4 md:px-10 text-[#0E2917]">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#041534] text-white px-4 py-3 rounded-lg shadow-xl border border-[#CBD5E1] text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#b5f1bf]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJSON}
        accept=".json"
        className="hidden"
      />

      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-[#64748B] flex items-center space-x-2">
          <button onClick={() => onNavigate('beranda')} className="hover:text-[#1E5631] font-medium">
            Beranda
          </button>
          <span>&gt;</span>
          <span className="text-[#1B2A4A] font-medium">Penilaian Baru</span>
          <span>&gt;</span>
          <span className="text-[#041534] font-bold">Profil Teknologi Usulan</span>
        </div>

        {/* Header Title & Preset Chips Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#CBD5E1] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#041534]">
                Formulir Penilaian Profil Teknologi Sampah
              </h1>
              <span className="text-xs font-semibold bg-[#EBF5EE] text-[#1E5631] px-2.5 py-0.5 rounded border border-[#CBD5E1] flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Draf Aktif</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              ID Usulan: <span className="font-mono font-bold text-[#1B2A4A]">{formData.id}</span> &bull; Dilengkapi Dual-Input Sliders &amp; Evaluasi Realtime
            </p>
          </div>

          {/* Quick Preset Buttons & Import/Export */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white border border-[#CBD5E1] rounded p-0.5 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-2">Preset:</span>
              <button
                onClick={() => handleLoadSample('cimahi')}
                className="px-2 py-1 hover:bg-slate-100 rounded text-[11px] font-semibold text-[#1E5631]"
              >
                RDF Cimahi
              </button>
              <button
                onClick={() => handleLoadSample('surabaya')}
                className="px-2 py-1 hover:bg-slate-100 rounded text-[11px] font-semibold text-[#1B2A4A]"
              >
                Biodrying Sby
              </button>
              <button
                onClick={() => handleLoadSample('denpasar')}
                className="px-2 py-1 hover:bg-slate-100 rounded text-[11px] font-semibold text-[#1F6F6F]"
              >
                MRF Bali
              </button>
            </div>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-slate-700 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              title="Unduh Formulir sebagai Berkas JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-slate-700 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              title="Muat Formulir dari Berkas JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah JSON</span>
            </button>

            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-slate-600 rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
              title="Kosongkan Semua Isian"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Header */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#041534]">Kemajuan Penilaian GVMS:</span>
              <span className="text-[#64748B]">{completedSectionsCount} dari 5 bagian selesai</span>
            </div>
            <span className="font-bold font-mono text-[#1E5631]">{progressPercent}% Lengkap</span>
          </div>

          {/* 5-step segmented progress bar */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'Biaya LCC (30%)', active: formData.capex > 0 && formData.opex > 0 },
              { label: 'Lingkungan (25%)', active: formData.penghindaranMetana > 0 },
              { label: 'Layanan (20%)', active: formData.kapasitasHarian > 0 },
              { label: 'Sosial & Eko (15%)', active: formData.lapanganKerja > 0 },
              { label: 'Kesiapan TRL (10%)', active: formData.tingkatKematangan !== '' },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    step.active ? 'bg-[#1E5631]' : 'bg-slate-200'
                  }`}
                ></div>
                <div className="text-[10px] text-slate-500 truncate hidden sm:block">
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: 5 Collapsible Sections */}
          <div className="lg:col-span-8 space-y-4">
            {/* Section 0: Identitas Usulan & Lokasi */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('meta')}
                className="w-full p-4 bg-slate-50 border-b border-[#CBD5E1] flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-[#Eff4FF] text-[#1B2A4A] flex items-center justify-center font-bold text-xs">
                    0
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#041534]">
                      Identitas Usulan &amp; Pemerintah Daerah
                    </h3>
                    <p className="text-[11px] text-[#64748B]">Informasi administratif proposal pengadaan</p>
                  </div>
                </div>
                {openSections.meta ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openSections.meta && (
                <div className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Nama Usulan Teknologi *</label>
                      <input
                        type="text"
                        value={formData.namaTeknologi}
                        onChange={(e) => setFormData({ ...formData, namaTeknologi: e.target.value })}
                        placeholder="Contoh: Refuse Derived Fuel (RDF) Modular Plant v2"
                        className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Konsorsium / Badan Usaha Pengusul</label>
                      <input
                        type="text"
                        value={formData.pengusul}
                        onChange={(e) => setFormData({ ...formData, pengusul: e.target.value })}
                        placeholder="Contoh: PT Lestari Bio Energi Nusantara"
                        className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Pemerintah Kota / Kabupaten</label>
                      <input
                        type="text"
                        value={formData.daerah}
                        onChange={(e) => setFormData({ ...formData, daerah: e.target.value })}
                        placeholder="Contoh: Kota Cimahi"
                        className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Provinsi Lokasi Fasilitas</label>
                      <input
                        type="text"
                        value={formData.provinsi || ''}
                        onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                        placeholder="Contoh: Jawa Barat"
                        className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 1: Biaya Siklus Hidup (30%) */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('lcc')}
                className="w-full p-4 bg-slate-50 border-b border-[#CBD5E1] flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-[#Eff4FF] text-[#1B2A4A] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#041534]">
                        Biaya Siklus Hidup (Life-Cycle Cost / LCC)
                      </h3>
                      <span className="text-[11px] font-extrabold bg-[#1B2A4A] text-white px-2 py-0.5 rounded">
                        Bobot 30%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Investasi modal awal, OPEX pemeliharaan tahunan, dan usia aset</p>
                  </div>
                </div>
                {openSections.lcc ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openSections.lcc && (
                <div className="p-5 space-y-4 text-xs">
                  {/* CAPEX Input & Interactive Slider */}
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex flex-wrap justify-between items-center gap-1">
                      <label className="font-semibold text-slate-700">CAPEX Awal (Investasi Modal Rp)</label>
                      <span className="font-mono font-bold text-[#1B2A4A] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formatIDR(formData.capex)}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="1000000000"
                      value={formData.capex || ''}
                      onChange={(e) => setFormData({ ...formData, capex: Number(e.target.value) })}
                      placeholder="Contoh: 45000000000"
                      className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs font-mono bg-white"
                    />
                    {/* Range slider sync (up to 500 Miliar) */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="range"
                        min="10000000000"
                        max="500000000000"
                        step="5000000000"
                        value={formData.capex || 10000000000}
                        onChange={(e) => setFormData({ ...formData, capex: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
                      />
                      <span className="text-[10px] text-slate-400 font-mono w-16 text-right">
                        {(formData.capex / 1_000_000_000).toFixed(0)}M
                      </span>
                    </div>
                  </div>

                  {/* OPEX Input & Interactive Slider */}
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex flex-wrap justify-between items-center gap-1">
                      <label className="font-semibold text-slate-700">OPEX Tahunan (Biaya Operasi Rp/th)</label>
                      <span className="font-mono font-bold text-[#1B2A4A] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formatIDR(formData.opex)}/th
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="100000000"
                      value={formData.opex || ''}
                      onChange={(e) => setFormData({ ...formData, opex: Number(e.target.value) })}
                      placeholder="Contoh: 3200000000"
                      className="w-full px-3 py-1.5 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs font-mono bg-white"
                    />
                    {/* Range slider sync (up to 50 Miliar) */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="range"
                        min="500000000"
                        max="50000000000"
                        step="500000000"
                        value={formData.opex || 500000000}
                        onChange={(e) => setFormData({ ...formData, opex: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
                      />
                      <span className="text-[10px] text-slate-400 font-mono w-16 text-right">
                        {(formData.opex / 1_000_000_000).toFixed(1)}M/th
                      </span>
                    </div>
                  </div>

                  {/* Umur Teknis Aset */}
                  <div className="space-y-1.5 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">Umur Teknis Aset (tahun)</label>
                      <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.umurAset} Tahun
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="35"
                      step="1"
                      value={formData.umurAset || 20}
                      onChange={(e) => setFormData({ ...formData, umurAset: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
                    />
                    <span className="text-[10px] text-[#64748B] block">Standar siklus depresiasi LKPP: 20 tahun</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Kinerja Lingkungan (25%) */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('lingkungan')}
                className="w-full p-4 bg-slate-50 border-b border-[#CBD5E1] flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-[#EBF5EE] text-[#1E5631] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#041534]">
                        Kinerja Lingkungan (Environmental Performance)
                      </h3>
                      <span className="text-[11px] font-extrabold bg-[#1E5631] text-white px-2 py-0.5 rounded">
                        Bobot 25%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Emisi gas rumah kaca, penghindaran metana, dan residu buang ke TPA</p>
                  </div>
                </div>
                {openSections.lingkungan ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openSections.lingkungan && (
                <div className="p-5 space-y-4 text-xs">
                  {/* Penghindaran Metana (%) */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">Penghindaran Metana (%):</label>
                      <span className="font-mono font-bold text-[#1E5631] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.penghindaranMetana}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={formData.penghindaranMetana || 0}
                      onChange={(e) => setFormData({ ...formData, penghindaranMetana: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E5631]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>0% (Landfill biasa)</span>
                      <span className="text-[#1E5631] font-semibold">&gt; 80% (Standar Hijau)</span>
                      <span>100% (Zero Methane)</span>
                    </div>
                  </div>

                  {/* Residu Dibuang ke TPA (%) */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <label className="font-semibold text-slate-700">Residu Dibuang ke TPA (%):</label>
                        {formData.residuTPA <= 10 ? (
                          <span className="text-[10px] bg-[#EBF5EE] text-[#1E5631] px-1.5 py-0.2 rounded font-bold">
                            Optimal (&le;10%)
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#FEF6E9] text-[#D68910] px-1.5 py-0.2 rounded font-bold">
                            Perlu Reduksi
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.residuTPA}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="0.5"
                      value={formData.residuTPA || 0}
                      onChange={(e) => setFormData({ ...formData, residuTPA: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D68910]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span className="text-[#1E5631] font-semibold">0% (Zero Waste)</span>
                      <span className="text-[#1E5631] font-semibold">10% (Target SPM)</span>
                      <span>50% (Tinggi)</span>
                    </div>
                  </div>

                  {/* Estimasi Emisi GRK */}
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Estimasi Emisi GRK (ton CO2e/th)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.emisiGRK || ''}
                      onChange={(e) => setFormData({ ...formData, emisiGRK: Number(e.target.value) })}
                      placeholder="Contoh: 14250"
                      className="w-full px-3 py-2 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs font-mono"
                    />
                    <span className="text-[10px] text-[#64748B] block">Total emisi langsung cerobong dan emisi proses</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Kinerja Layanan (20%) */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('layanan')}
                className="w-full p-4 bg-slate-50 border-b border-[#CBD5E1] flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-[#EBF3F5] text-[#1F6F6F] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#041534]">
                        Kinerja Layanan (Operational Service)
                      </h3>
                      <span className="text-[11px] font-extrabold bg-[#1F6F6F] text-white px-2 py-0.5 rounded">
                        Bobot 20%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Throughput kapasitas harian, keandalan operasional, dan recovery rate</p>
                  </div>
                </div>
                {openSections.layanan ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openSections.layanan && (
                <div className="p-5 space-y-4 text-xs">
                  {/* Kapasitas Harian */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">Kapasitas Olah Harian:</label>
                      <span className="font-mono font-bold text-[#1F6F6F] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.kapasitasHarian} Ton/Hari
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="1500"
                      step="10"
                      value={formData.kapasitasHarian || 20}
                      onChange={(e) => setFormData({ ...formData, kapasitasHarian: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1F6F6F]"
                    />
                  </div>

                  {/* Ketersediaan / Uptime */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">Ketersediaan Operasional / Uptime (%):</label>
                      <span className="font-mono font-bold text-[#1E5631] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.ketersediaanUptime}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="100"
                      step="0.5"
                      value={formData.ketersediaanUptime || 60}
                      onChange={(e) => setFormData({ ...formData, ketersediaanUptime: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E5631]"
                    />
                  </div>

                  {/* Recovery Rate */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">Tingkat Pemulihan / Recovery (%):</label>
                      <span className="font-mono font-bold text-[#1B2A4A] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.tingkatPemulihan}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      step="0.5"
                      value={formData.tingkatPemulihan || 30}
                      onChange={(e) => setFormData({ ...formData, tingkatPemulihan: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1B2A4A]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Nilai Sosial & Ekonomi (15%) */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('sosial')}
                className="w-full p-4 bg-slate-50 border-b border-[#CBD5E1] flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-[#FEF6E9] text-[#D68910] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#041534]">
                        Nilai Sosial &amp; Ekonomi (Socio-Economic Value)
                      </h3>
                      <span className="text-[11px] font-extrabold bg-[#D68910] text-white px-2 py-0.5 rounded">
                        Bobot 15%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Penyerapan tenaga kerja lokal dan indeks penerimaan publik</p>
                  </div>
                </div>
                {openSections.sosial ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openSections.sosial && (
                <div className="p-5 space-y-4 text-xs">
                  {/* Tenaga Kerja Slider */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">Jumlah Tenaga Kerja Lokal (orang):</label>
                      <span className="font-mono font-bold text-[#D68910] bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                        {formData.lapanganKerja} Orang
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="300"
                      step="1"
                      value={formData.lapanganKerja || 5}
                      onChange={(e) => setFormData({ ...formData, lapanganKerja: Number(e.target.value) })}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D68910]"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="font-semibold text-slate-700 block">
                      Skor Penerimaan Masyarakat (Berdasarkan Konsultasi Publik AMDAL):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {[
                        { val: 1, label: '1 - Sangat Rendah', desc: 'Resistensi tinggi masyarakat' },
                        { val: 2, label: '2 - Rendah', desc: 'Ada keberatan signifikan' },
                        { val: 3, label: '3 - Moderat', desc: 'Netral dengan syarat kompensasi' },
                        { val: 4, label: '4 - Baik', desc: 'Mendukung program daur ulang' },
                        { val: 5, label: '5 - Sangat Baik', desc: 'Dukungan penuh multi-pihak' },
                      ].map((item) => {
                        const isSelected = formData.skorPenerimaanMasyarakat === item.val;
                        return (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setFormData({ ...formData, skorPenerimaanMasyarakat: item.val as any })}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'border-[#1E5631] bg-[#EBF5EE] ring-1 ring-[#1E5631]'
                                : 'border-[#CBD5E1] bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-bold ${isSelected ? 'text-[#1E5631]' : 'text-slate-800'}`}>
                                {item.label}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#1E5631]" />}
                            </div>
                            <span className="text-[10px] text-[#64748B] block leading-tight">{item.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 5: Kesiapan Teknologi (10%) */}
            <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => toggleSection('kesiapan')}
                className="w-full p-4 bg-slate-50 border-b border-[#CBD5E1] flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#041534]">
                        Kesiapan Teknologi (Technology Readiness Level / TRL)
                      </h3>
                      <span className="text-[11px] font-extrabold bg-slate-700 text-white px-2 py-0.5 rounded">
                        Bobot 10%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">Tingkat kematangan pengujian dan rekam jejak operasional vendor</p>
                  </div>
                </div>
                {openSections.kesiapan ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openSections.kesiapan && (
                <div className="p-5 space-y-3 text-xs">
                  <label className="font-semibold text-slate-700 block">
                    Tingkat Kematangan Teknologi &amp; Rekam Jejak Lapangan:
                  </label>
                  <select
                    value={formData.tingkatKematangan}
                    onChange={(e) => setFormData({ ...formData, tingkatKematangan: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-[#CBD5E1] rounded focus:outline-none focus:border-[#1E5631] text-xs bg-white text-slate-800"
                  >
                    <option value="">-- Pilih Tingkat Kematangan TRL --</option>
                    <option value="pilot">
                      Baru Diuji Coba (Skala Lab / Pilot) — TRL 4-6
                    </option>
                    <option value="commercial">
                      Sudah Beroperasi di Daerah Lain (Komersial Teruji) — TRL 7-8
                    </option>
                    <option value="national_registry">
                      Sudah Terverifikasi di Registry Nasional LKPP — TRL 9 (Prioritas Pengadaan)
                    </option>
                  </select>
                </div>
              )}
            </div>

            {/* Form Footer Action Bar */}
            <div className="flex flex-wrap items-center justify-between p-4 bg-white rounded-xl border border-[#CBD5E1] gap-3">
              <button
                type="button"
                onClick={handleSaveDraftClick}
                className="px-4 py-2 border border-[#CBD5E1] text-[#1B2A4A] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Draf Formulir</span>
              </button>

              <button
                type="button"
                onClick={handleCalculateClick}
                className="px-6 py-2.5 bg-[#1E5631] hover:bg-[#163F24] active:bg-[#0E2917] text-white rounded text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
              >
                <span>Hitung Skor GVMS &amp; Buka Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Live-Updating Score Summary Side Panel with Sensitivity Mode */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-2.5">
                <div className="text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">
                  Ringkasan Skor &amp; Estimasi
                </div>
                <button
                  onClick={() => setSensitivityMode(!sensitivityMode)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                    sensitivityMode
                      ? 'bg-[#EBF5EE] text-[#1E5631] border-[#1E5631]'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                  title="Aktifkan simulasi target skor"
                >
                  <Zap className="w-3 h-3 text-[#D68910]" />
                  <span>{sensitivityMode ? 'Mode Sensitivitas: Aktif' : 'Simulasi Target'}</span>
                </button>
              </div>

              {/* Running GVMS Score Big Badge */}
              <div className="text-center p-4 bg-[#F8F9FF] rounded-lg border border-[#CBD5E1]">
                <div className="text-xs font-semibold text-[#64748B] mb-1">
                  Skor GVMS Terakumulasi
                </div>
                <div className="text-4xl font-extrabold font-mono tracking-tight text-[#041534]">
                  {scores.gvmsTotal}
                  <span className="text-base text-slate-400 font-normal"> / 100</span>
                </div>

                <div className="mt-2.5">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${
                      scores.gvmsTotal >= 75
                        ? 'bg-[#EBF5EE] text-[#1E5631] border-[#1E5631]/30'
                        : scores.gvmsTotal >= 50
                        ? 'bg-[#Eff4FF] text-[#1B2A4A] border-[#1B2A4A]/30'
                        : scores.gvmsTotal >= 35
                        ? 'bg-[#FEF6E9] text-[#D68910] border-[#D68910]/30'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {scores.category}
                  </span>
                </div>
              </div>

              {/* Sensitivity Simulation Mode Box */}
              {sensitivityMode && (
                <div className="p-3.5 bg-[#FEF6E9] rounded-lg border border-[#D68910]/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#D68910] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      Target Skor Pokja:
                    </span>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-[#CBD5E1]">
                      {targetScore} Poin
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="1"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#D68910]"
                  />
                  <div className="pt-1">
                    <span className="font-bold text-slate-800 text-[11px] block mb-1">Rekomendasi Penyesuaian:</span>
                    <ul className="space-y-1 text-[11px] text-slate-700">
                      {sensitivityTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-[#D68910] font-bold">&bull;</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* 5 Dimensions Weighted Sub-Scores breakdown */}
              <div className="space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Kontribusi 5 Dimensi:
                </div>

                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-700 font-medium">Biaya Siklus Hidup (30%)</span>
                      <span className="font-mono font-bold text-[#1B2A4A]">
                        {scores.weighted.lcc} <span className="text-slate-400 font-normal">/ 30</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1B2A4A] h-full transition-all duration-300"
                        style={{ width: `${(scores.weighted.lcc / 30) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-700 font-medium">Kinerja Lingkungan (25%)</span>
                      <span className="font-mono font-bold text-[#1E5631]">
                        {scores.weighted.lingkungan} <span className="text-slate-400 font-normal">/ 25</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E5631] h-full transition-all duration-300"
                        style={{ width: `${(scores.weighted.lingkungan / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-700 font-medium">Kinerja Layanan (20%)</span>
                      <span className="font-mono font-bold text-[#1F6F6F]">
                        {scores.weighted.layanan} <span className="text-slate-400 font-normal">/ 20</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1F6F6F] h-full transition-all duration-300"
                        style={{ width: `${(scores.weighted.layanan / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-700 font-medium">Nilai Sosial &amp; Eko (15%)</span>
                      <span className="font-mono font-bold text-[#D68910]">
                        {scores.weighted.sosialEkonomi} <span className="text-slate-400 font-normal">/ 15</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#D68910] h-full transition-all duration-300"
                        style={{ width: `${(scores.weighted.sosialEkonomi / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-700 font-medium">Kesiapan TRL (10%)</span>
                      <span className="font-mono font-bold text-slate-700">
                        {scores.weighted.kesiapanTeknologi} <span className="text-slate-400 font-normal">/ 10</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-700 h-full transition-all duration-300"
                        style={{ width: `${(scores.weighted.kesiapanTeknologi / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="pt-3 border-t border-[#CBD5E1] space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Nilai VfM Bersih (Net):</span>
                  <span className="font-bold text-[#1E5631] font-mono">{scores.keyIndicators.netVfm}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Emisi Bersih Terhindarkan:</span>
                  <span className="font-semibold text-slate-800 font-mono text-[11px]">{scores.keyIndicators.emisiBersihTerhindarkan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Efisiensi Anggaran Daerah:</span>
                  <span className="font-semibold text-slate-800 font-mono text-[11px]">{scores.keyIndicators.efisiensiAnggaran}</span>
                </div>
              </div>

              {/* Callout Ambang Batas */}
              <div className="p-3 bg-[#F7F5F0] rounded-lg border border-[#E2E8F0] text-[11px] text-[#45464e] leading-relaxed">
                <div className="font-bold text-[#041534] flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E5631]" />
                  <span>Ambang Batas Kelayakan (&gt; 75.0)</span>
                </div>
                {scores.gvmsTotal >= 75 ? (
                  <span className="text-[#1E5631] font-semibold">
                    Proposal ini melampaui batas ambang minimum (+{scores.deltaAmbang} poin) dan memenuhi syarat rekomendasi KPBU.
                  </span>
                ) : (
                  <span className="text-amber-800">
                    Skor saat ini berada di bawah ambang batas ({scores.deltaAmbang} poin). Periksa kembali efisiensi CAPEX/OPEX atau tingkat recovery.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
