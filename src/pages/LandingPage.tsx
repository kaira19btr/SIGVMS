import React, { useState, useMemo } from 'react';
import { PageView, AssessmentData } from '../types/gvms';
import { calculateGVMS, formatIDR } from '../utils/gvmsCalculator';
import { 
  ArrowRight, 
  Database, 
  CheckCircle2, 
  Coins, 
  Leaf, 
  Wrench, 
  Users, 
  Cpu, 
  ShieldCheck, 
  FileCheck,
  Scale,
  Sparkles,
  ChevronRight,
  Sliders,
  HelpCircle,
  Eye,
  Layers,
  Building,
  Award,
  Trees
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
  onOpenGuide: () => void;
  onLoadSimulatedData?: (data: Partial<AssessmentData>) => void;
  registry: AssessmentData[];
  onSelectAssessment: (item: AssessmentData) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  onOpenGuide,
  onLoadSimulatedData,
  registry,
  onSelectAssessment,
}) => {
  // Live Interactive Hero Sandbox State
  const [simKapasitas, setSimKapasitas] = useState(150);
  const [simCapexMiliar, setSimCapexMiliar] = useState(45);
  const [simMetana, setSimMetana] = useState(85);
  const [simResidu, setSimResidu] = useState(8);

  // Active dimension tab in deep dive
  const [activeDimension, setActiveDimension] = useState<number>(0);

  // FAQ open/close accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculate live score from hero sliders
  const simScores = useMemo(() => {
    const dummy: AssessmentData = {
      id: 'SIM-QUICK-01',
      namaTeknologi: 'Simulasi Cepat Mandiri',
      pengusul: 'Simulasi Pokja',
      daerah: 'Kota Percontohan',
      tanggalPenilaian: 'Hari ini',
      status: 'Dalam Proses',
      capex: simCapexMiliar * 1_000_000_000,
      opex: (simCapexMiliar * 0.08) * 1_000_000_000, // standard 8% opex
      umurAset: 20,
      emisiGRK: simKapasitas * 95,
      penghindaranMetana: simMetana,
      residuTPA: simResidu,
      kapasitasHarian: simKapasitas,
      ketersediaanUptime: 92,
      tingkatPemulihan: 90,
      lapanganKerja: Math.round(simKapasitas * 0.35),
      skorPenerimaanMasyarakat: 4,
      tingkatKematangan: 'commercial',
    };
    return calculateGVMS(dummy);
  }, [simKapasitas, simCapexMiliar, simMetana, simResidu]);

  const handleApplySimToForm = () => {
    if (onLoadSimulatedData) {
      onLoadSimulatedData({
        capex: simCapexMiliar * 1_000_000_000,
        opex: Math.round(simCapexMiliar * 0.08 * 1_000_000_000),
        kapasitasHarian: simKapasitas,
        penghindaranMetana: simMetana,
        residuTPA: simResidu,
      });
    }
    onNavigate('penilaian');
  };

  const dimensionsData = [
    {
      title: 'Biaya Siklus Hidup (LCC)',
      weight: '30%',
      icon: Coins,
      color: '#0E3B24',
      bgLight: '#E8F3EB',
      summary: 'Kalkulasi total belanja modal (CAPEX), beban pemeliharaan operasional (OPEX) tahunan, dan biaya pengolahan per ton sampah selama masa manfaat 20 tahun.',
      parameters: ['CAPEX Investasi Konstruksi & Mesin', 'OPEX Listrik, Bahan Kimia & Tenaga Kerja', 'Masa Manfaat Aset Teknis', 'Estimasi Nilai Tipping Fee per Ton'],
      regulasi: 'Standar Biaya Masukan (SBM) PMK Kemenkeu & ISO 14040 Life-Cycle Assessment.',
      tips: 'Pastikan rasio OPEX terhadap CAPEX tidak melebihi 10% per tahun agar tidak membebani APBD secara berkepanjangan.',
    },
    {
      title: 'Kinerja Lingkungan',
      weight: '25%',
      icon: Leaf,
      color: '#1E5631',
      bgLight: '#E8F5EC',
      summary: 'Pengurangan emisi gas rumah kaca (GRK), pencegahan pelepasan metana dari landfill, dan minimalisasi residu abu/sludge yang tetap harus dibuang ke TPA.',
      parameters: ['Pengurangan Ton CO2e per Tahun', 'Tingkat Penghindaran Gas Metana Landfill (%)', 'Persentase Residu Dibuang ke TPA (≤10%)', 'Baku Mutu Cerobong Permen LHK 70/2016'],
      regulasi: 'Permen LHK No. P.70/2016 & Standar MRV Nilai Ekonomi Karbon (NEK).',
      tips: 'Fasilitas dengan residu ke TPA di bawah 10% mendapatkan skor normalisasi tertinggi (95–100 poin).',
    },
    {
      title: 'Kinerja Layanan Teknis',
      weight: '20%',
      icon: Wrench,
      color: '#134B2C',
      bgLight: '#EBF3ED',
      summary: 'Kepastian kapasitas serapan sampah harian kota, keandalan uptime fasilitas (≥330 hari/tahun), dan efisiensi recovery energi/material sirkular.',
      parameters: ['Kapasitas Desain Bersih (Ton/Hari)', 'Ketersediaan Operasional / Uptime (>90%)', 'Recovery Rate Energi atau Produk RDF/Kompos (%)', 'Toleransi Terhadap Kadar Air Tinggi (50-70%)'],
      regulasi: 'Standar Pelayanan Minimal (SPM) Pekerjaan Umum & KLHK.',
      tips: 'Perhitungkan jadwal shutdown berkala untuk overhaul mesin dan penggantian filter baghouse.',
    },
    {
      title: 'Nilai Sosial & Ekonomi',
      weight: '15%',
      icon: Users,
      color: '#8A5A00',
      bgLight: '#FEF8EB',
      summary: 'Dampak nyata terhadap penyerapan tenaga kerja lokal ber-KTP daerah dan kesepakatan sosial masyarakat sekitar lokasi pabrik.',
      parameters: ['Jumlah Tenaga Kerja Lokal Langsung', 'Skor Penerimaan Masyarakat (AMDAL)', 'Peluang Pengembangan Koperasi Pengumpul Sampah', 'Mitigasi Bau dan Kebisingan Pemukiman'],
      regulasi: 'Pedoman Konsultasi Publik AMDAL PP No. 22/2021.',
      tips: 'Libatkan komunitas pemulung dan bank sampah setempat ke dalam rantai pasok pemilahan awal.',
    },
    {
      title: 'Kesiapan Teknologi (TRL)',
      weight: '10%',
      icon: Cpu,
      color: '#1F6F6F',
      bgLight: '#EAF4F4',
      summary: 'Kematangan teknologi teruji di lapangan dengan rekam jejak operasional tanpa insiden kritis minimal 1 tahun kalender.',
      parameters: ['Technology Readiness Level (TRL 4–9)', 'Sertifikasi Paten & Bukti Operasional Komersial', 'Ketersediaan Suku Cadang Dalam Negeri (TKDN)', 'Daftar Referensi Proyek Pemda Lain'],
      regulasi: 'Katalog Elektronik Sektoral LKPP & Penilaian TRL Kemenristek/BRIN.',
      tips: 'Proposal dengan TRL 9 (sudah terdaftar di e-Katalog SPSE) langsung mendapatkan skor penuh 100 poin untuk dimensi ini.',
    },
  ];

  const faqs = [
    {
      q: 'Apa itu Green Value-for-Money Score (GVMS) dalam pengadaan publik?',
      a: 'GVMS adalah metodologi penilaian berbasis bukti yang menggabungkan efisiensi fiskal biaya siklus hidup (LCC) dengan dampak lingkungan, kelayakan teknis, dan kemanfaatan sosial untuk memilih teknologi pengolahan sampah yang paling berkelanjutan.',
    },
    {
      q: 'Bagaimana ambang batas kelayakan (threshold) 75.0 ditentukan?',
      a: 'Berdasarkan Keputusan Kepala LKPP No. 12/2024, nilai komposit 75.0 merupakan batas minimal di mana efisiensi ekonomi dan perlindungan lingkungan berada pada titik impas optimal untuk mendapatkan penjaminan KPBU dari PT PII / SMI.',
    },
    {
      q: 'Apakah daerah dapat mengubah bobot standar 5 dimensi?',
      a: 'Bobot standar LKPP adalah 30-25-20-15-10. Pada menu Komparasi Usulan, Pokja Pemilihan dapat melakukan simulasi penyesuaian bobot lokal untuk melihat sensitivitas trade-off sesuai prioritas daerah.',
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-[#E7F2EB] via-[#F1F6F3] to-[#E3EFE7] min-h-screen text-[#0E2917]">
      {/* Hero Section with Dominant Forest Green Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#041B0E] via-[#092B19] via-[#0E3B24] to-[#134D2E] pt-12 pb-16 px-4 md:px-10 border-b border-emerald-800 text-white shadow-xl">
        
        {/* Subtle decorative background glow and grid */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FACC15]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-[1280px] mx-auto relative z-10">
          
          {/* Regulatory Tag */}
          <div className="inline-flex items-center space-x-2 bg-[#134B2C] border border-emerald-600/70 rounded-lg px-3.5 py-1 text-xs font-semibold text-emerald-100 mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse"></span>
            <span>Standar Pengadaan Berkelanjutan LKPP No. 12/2024 &bull; Baku Mutu Emisi Permen LHK</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Column: Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Kalkulator Green Value-for-Money Score
              </h1>
              
              <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
                Instrumen resmi evaluasi berbasis bukti untuk menilai kelayakan biaya siklus hidup (LCC), reduksi emisi gas rumah kaca, dan keandalan operasional teknologi pengolahan sampah di Indonesia.
              </p>

              {/* Main Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onNavigate('penilaian')}
                  className="bg-[#FACC15] hover:bg-yellow-400 active:bg-yellow-500 text-[#0E3B24] font-extrabold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-md flex items-center space-x-2 transition-all cursor-pointer group"
                >
                  <span>Mulai Penilaian Baru</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('registry')}
                  className="bg-[#134B2C] hover:bg-[#1A5C38] border border-emerald-600 text-emerald-100 font-bold text-xs sm:text-sm px-4 py-3 rounded-lg shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4 text-[#FACC15]" />
                  <span>Lihat Registry ({registry.length} Terverifikasi)</span>
                </button>
              </div>

              {/* 3 Compliance Badges */}
              <div className="pt-4 border-t border-emerald-800/80 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
                  <span>Standar Biaya Masukan (SBM) 2025</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
                  <span>Life-Cycle Assessment ISO 14040</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FACC15]" />
                  <span>Validasi Emisi MRV Bappenas</span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Interactive Live Sandbox Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFFFFF] text-slate-900 rounded-2xl border border-emerald-700/50 p-6 shadow-2xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-[#0E3B24]" />
                    <span className="text-xs font-bold text-[#0E3B24] uppercase tracking-wider">
                      Simulator Cepat Nilai GVMS
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#EBF5EE] text-[#0E3B24] font-mono px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    Interaktif
                  </span>
                </div>

                {/* Score Gauge Preview */}
                <div className="flex items-center justify-between p-3.5 bg-[#F2F7F4] rounded-xl border border-emerald-200">
                  <div>
                    <span className="text-[11px] text-slate-600 block font-medium">Estimasi Skor GVMS:</span>
                    <div className="text-3xl font-black font-mono text-[#0E3B24]">
                      {simScores.gvmsTotal}
                      <span className="text-xs text-slate-400 font-normal"> / 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        simScores.gvmsTotal >= 75
                          ? 'bg-[#EBF5EE] text-[#0E3B24] border-emerald-300'
                          : 'bg-[#FFF7ED] text-[#9A3412] border-amber-300'
                      }`}
                    >
                      {simScores.category}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                      {simScores.deltaAmbang >= 0 ? `+${simScores.deltaAmbang}` : simScores.deltaAmbang} vs Ambang 75.0
                    </span>
                  </div>
                </div>

                {/* 4 Quick Sliders */}
                <div className="space-y-3 text-xs">
                  {/* Slider 1: Kapasitas */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>Kapasitas Harian:</span>
                      <span className="font-mono font-bold text-[#0E3B24]">{simKapasitas} Ton/Hari</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="1000"
                      step="10"
                      value={simKapasitas}
                      onChange={(e) => setSimKapasitas(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0E3B24]"
                    />
                  </div>

                  {/* Slider 2: CAPEX */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>Investasi CAPEX:</span>
                      <span className="font-mono font-bold text-[#0E3B24]">Rp {simCapexMiliar} Miliar</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="500"
                      step="5"
                      value={simCapexMiliar}
                      onChange={(e) => setSimCapexMiliar(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0E3B24]"
                    />
                  </div>

                  {/* Slider 3: Metana */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>Penghindaran Metana:</span>
                      <span className="font-mono font-bold text-[#1E5631]">{simMetana}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="98"
                      step="1"
                      value={simMetana}
                      onChange={(e) => setSimMetana(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E5631]"
                    />
                  </div>

                  {/* Slider 4: Residu */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span>Residu Dibuang ke TPA:</span>
                      <span className="font-mono font-bold text-slate-800">{simResidu}%</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="40"
                      step="1"
                      value={simResidu}
                      onChange={(e) => setSimResidu(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D97706]"
                    />
                  </div>
                </div>

                {/* Transfer button */}
                <button
                  onClick={handleApplySimToForm}
                  className="w-full py-2.5 bg-[#0E3B24] hover:bg-[#134B2C] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Gunakan Parameter Ini di Formulir Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FACC15]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3 Info Cards: Tiga Pilar Kalkulasi Keputusan */}
      <section className="py-14 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#134B2C] mb-1 flex items-center gap-1.5">
            <Trees className="w-3.5 h-3.5 text-[#0E3B24]" />
            <span>Arsitektur Evaluasi Pengadaan Hijau</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#0E3B24]">
            Tiga Pilar Kalkulasi Keputusan Pengadaan Sampah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Modul terintegrasi yang menjembatani evaluasi administratif dengan validasi teknis di lapangan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-emerald-200/80 p-6 shadow-sm flex flex-col justify-between hover:border-[#0E3B24] hover:shadow-md transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#0E3B24] flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform border border-emerald-200">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-[#0E3B24] tracking-wider uppercase">
                Modul 01 &bull; Kesiapan Lokal
              </div>
              <h3 className="text-base font-bold text-[#0E3B24]">
                Nilai Kesesuaian Teknologi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uji kecocokan teknologi terhadap karakteristik sampah daerah Indonesia (kadar air tinggi 50–70%, nilai kalor, densitas) dan rekam jejak TRL 4–9.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0E3B24] flex items-center justify-between">
              <span>Validasi TRL &amp; Karakteristik</span>
              <span className="text-[#1E5631] font-bold">Teruji</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-emerald-200/80 p-6 shadow-sm flex flex-col justify-between hover:border-[#0E3B24] hover:shadow-md transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#0E3B24] flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform border border-emerald-200">
                <Coins className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-[#0E3B24] tracking-wider uppercase">
                Modul 02 &bull; Fiskal Menyeluruh
              </div>
              <h3 className="text-base font-bold text-[#0E3B24]">
                Hitung Biaya Siklus Hidup (LCC)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kalkulasi total CAPEX, OPEX tahunan, masa pakai aset 15–25 tahun, serta biaya satuan per ton sampah untuk menentukan kebutuhan tipping fee fiskal daerah.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0E3B24] flex items-center justify-between">
              <span>SBM 2025 &amp; NPV 20 Tahun</span>
              <span className="text-[#1E5631] font-bold">Terukur</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-emerald-200/80 p-6 shadow-sm flex flex-col justify-between hover:border-[#0E3B24] hover:shadow-md transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF5EE] text-[#0E3B24] flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform border border-emerald-200">
                <Scale className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-[#0E3B24] tracking-wider uppercase">
                Modul 03 &bull; Pengambilan Keputusan
              </div>
              <h3 className="text-base font-bold text-[#0E3B24]">
                Bandingkan Opsi Pengadaan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Komparasi multikriteria hingga 3 teknologi secara berdampingan. Lengkap dengan rekomendasi objektif dan ekspor Berita Acara resmi Pokja.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#0E3B24] flex items-center justify-between">
              <span>Berita Acara Otomatis</span>
              <span className="text-[#1E5631] font-bold">Standar LKPP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 5 Dimensions Deep Dive Tabbed Explorer */}
      <section className="py-10 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="bg-white rounded-2xl border border-emerald-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#134B2C] block mb-0.5">
                Eksplorasi Interaktif
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0E3B24]">
                5 Dimensi Penilaian GVMS &amp; Metodologi
              </h3>
            </div>
            <button
              onClick={onOpenGuide}
              className="text-xs font-bold text-[#0E3B24] hover:underline flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Lihat Dokumen Regulasi LKPP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab buttons for 5 dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {dimensionsData.map((d, idx) => {
              const isActive = activeDimension === idx;
              const IconComp = d.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveDimension(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#0E3B24] bg-[#EBF5EE] ring-2 ring-[#0E3B24]/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-[#F9FCFA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <IconComp className="w-4 h-4" style={{ color: d.color }} />
                    <span className="font-extrabold text-xs font-mono text-[#0E3B24]">
                      {d.weight}
                    </span>
                  </div>
                  <span className={`text-xs font-bold block leading-snug ${isActive ? 'text-[#0E3B24]' : 'text-slate-700'}`}>
                    {d.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Dimension Details Box */}
          <div className="p-6 rounded-xl border border-emerald-200 bg-[#F4F9F6] space-y-4">
            {(() => {
              const cur = dimensionsData[activeDimension];
              const IconComp = cur.icon;
              return (
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-emerald-200 shadow-xs">
                      <IconComp className="w-5 h-5" style={{ color: cur.color }} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#0E3B24]">
                        {cur.title} &bull; Bobot {cur.weight}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Komponen Inti Evaluasi Nilai Manfaat Hijau
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    {cur.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                      <span className="font-bold text-[#0E3B24] block mb-2">Parameter Utama:</span>
                      <ul className="space-y-1.5 text-slate-600 text-[11px]">
                        {cur.parameters.map((p, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-[#0E3B24] font-bold">&bull;</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                      <span className="font-bold text-[#1E5631] block mb-2">Rujukan Regulasi:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {cur.regulasi}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                      <span className="font-bold text-[#8A5A00] block mb-2">Tips Pokja Pemilihan:</span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {cur.tips}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Interactive Case Studies / Verified Project Carousel */}
      <section className="py-12 px-4 md:px-10 max-w-[1280px] mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#134B2C] mb-1">
              Studi Kasus Nyata di Indonesia
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0E3B24]">
              Proposal Terverifikasi di Registry Nasional
            </h3>
          </div>

          <button
            onClick={() => onNavigate('registry')}
            className="text-xs font-bold text-[#0E3B24] hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            <span>Buka Semua Proposal ({registry.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {registry.slice(0, 3).map((item) => {
            const sc = calculateGVMS(item);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-emerald-200/80 p-5 shadow-sm flex flex-col justify-between hover:border-[#0E3B24] hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#EBF5EE] rounded text-[#0E3B24]">
                      {item.id}
                    </span>
                    <span className="text-[11px] font-bold text-[#0E3B24] bg-[#EBF5EE] px-2 py-0.5 rounded border border-emerald-300">
                      Skor {sc.gvmsTotal}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#0E3B24] group-hover:text-[#1E5631] transition-colors leading-snug">
                      {item.namaTeknologi}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.daerah} &bull; {item.pengusul}
                    </p>
                  </div>

                  <div className="p-3 bg-[#F4F9F6] rounded-lg border border-emerald-100 text-[11px] space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span>Kapasitas:</span>
                      <strong className="text-slate-800 font-mono">{item.kapasitasHarian} Ton/Hari</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Investasi CAPEX:</span>
                      <strong className="text-slate-800 font-mono">{formatIDR(item.capex)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Reduksi Metana:</span>
                      <strong className="text-[#0E3B24] font-mono">{item.penghindaranMetana}%</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectAssessment(item);
                      onNavigate('hasil');
                    }}
                    className="text-xs font-bold text-[#0E3B24] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#134B2C]" />
                    <span>Periksa Hasil Lengkap</span>
                  </button>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-12 px-4 md:px-10 max-w-[1280px] mx-auto border-t border-emerald-200/80 mb-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-center space-y-1 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#134B2C]">
              Pusat Informasi &amp; Jawaban
            </span>
            <h3 className="text-2xl font-bold text-[#0E3B24]">
              Pertanyaan yang Sering Diajukan Pokja
            </h3>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-emerald-200/80 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#0E3B24] flex items-center justify-between hover:bg-[#F4F9F6] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400 font-mono text-base ml-2">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#F9FCFA]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
