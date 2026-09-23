import React, { useState, useMemo } from 'react';
import { PageView, AssessmentData, CustomWeights } from '../types/gvms';
import { calculateGVMS, formatIDR, formatNumberID, DEFAULT_WEIGHTS } from '../utils/gvmsCalculator';
import { 
  Plus, 
  Trash2, 
  Trophy, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  Printer, 
  FileText, 
  Scale, 
  ShieldCheck, 
  ChevronRight,
  Sliders,
  RotateCcw,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { BeritaAcaraModal } from '../components/BeritaAcaraModal';

interface ComparisonPageProps {
  selectedItems: AssessmentData[];
  registry: AssessmentData[];
  onNavigate: (page: PageView) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: AssessmentData) => void;
  onSelectForDashboard: (item: AssessmentData) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  selectedItems,
  registry,
  onNavigate,
  onRemoveItem,
  onAddItem,
  onSelectForDashboard,
}) => {
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showBeritaAcara, setShowBeritaAcara] = useState(false);
  const [highlightBest, setHighlightBest] = useState(true);
  const [showWeightAdjuster, setShowWeightAdjuster] = useState(false);

  // Custom weights for interactive sensitivity
  const [weights, setWeights] = useState<CustomWeights>({ ...DEFAULT_WEIGHTS });

  // Compute calculated scores for each item with custom weights
  const scoredItems = useMemo(() => {
    return selectedItems.map((item) => ({
      data: item,
      scores: calculateGVMS(item, weights),
    }));
  }, [selectedItems, weights]);

  // Find winner (highest score)
  const winnerIndex = useMemo(() => {
    if (scoredItems.length === 0) return -1;
    let maxIdx = 0;
    let maxScore = -1;
    scoredItems.forEach((si, idx) => {
      if (si.scores.gvmsTotal > maxScore) {
        maxScore = si.scores.gvmsTotal;
        maxIdx = idx;
      }
    });
    return maxIdx;
  }, [scoredItems]);

  const [selectedWinnerIdx, setSelectedWinnerIdx] = useState<number | null>(null);
  const activeWinner = selectedWinnerIdx !== null && scoredItems[selectedWinnerIdx] 
    ? scoredItems[selectedWinnerIdx] 
    : winnerIndex >= 0 
    ? scoredItems[winnerIndex] 
    : null;

  // Best metrics across candidates for comparison highlighting
  const bestMetrics = useMemo(() => {
    if (selectedItems.length === 0) return {};
    let minCapex = Infinity;
    let minOpex = Infinity;
    let maxRecovery = -1;
    let maxMetana = -1;
    let minResidu = Infinity;
    let maxTenaga = -1;

    selectedItems.forEach((i) => {
      if (i.capex < minCapex) minCapex = i.capex;
      if (i.opex < minOpex) minOpex = i.opex;
      if (i.tingkatPemulihan > maxRecovery) maxRecovery = i.tingkatPemulihan;
      if (i.penghindaranMetana > maxMetana) maxMetana = i.penghindaranMetana;
      if (i.residuTPA < minResidu) minResidu = i.residuTPA;
      if (i.lapanganKerja > maxTenaga) maxTenaga = i.lapanganKerja;
    });

    return { minCapex, minOpex, maxRecovery, maxMetana, minResidu, maxTenaga };
  }, [selectedItems]);

  const handleDownloadComparison = () => {
    if (scoredItems.length === 0) return;

    let content = `HASIL KOMPARASI MULTIKRITERIA PENGADAAN TEKNOLOGI SAMPAH
SISTEM GVMS LKPP & KLHK REPUBLIK INDONESIA
Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
Bobot Evaluasi: LCC ${(weights.lcc * 100).toFixed(0)}%, Lingkungan ${(weights.lingkungan * 100).toFixed(0)}%, Layanan ${(weights.layanan * 100).toFixed(0)}%, Sosial ${(weights.sosialEkonomi * 100).toFixed(0)}%, Kesiapan ${(weights.kesiapanTeknologi * 100).toFixed(0)}%
================================================================================

`;

    scoredItems.forEach((si, idx) => {
      const isWinner = idx === winnerIndex;
      content += `[OPSI ${String.fromCharCode(65 + idx)}] ${si.data.namaTeknologi} ${isWinner ? '★ REKOMENDASI TERTINGGI' : ''}
Pengusul       : ${si.data.pengusul} (${si.data.daerah})
Skor GVMS Total: ${si.scores.gvmsTotal} / 100 (${si.scores.category})
- Biaya LCC    : ${si.scores.raw.lcc}/100 -> Terbobot: ${si.scores.weighted.lcc} poin
- Lingkungan   : ${si.scores.raw.lingkungan}/100 -> Terbobot: ${si.scores.weighted.lingkungan} poin
- Layanan      : ${si.scores.raw.layanan}/100 -> Terbobot: ${si.scores.weighted.layanan} poin
- Sosial & Eko : ${si.scores.raw.sosialEkonomi}/100 -> Terbobot: ${si.scores.weighted.sosialEkonomi} poin
- Kesiapan TRL : ${si.scores.raw.kesiapanTeknologi}/100 -> Terbobot: ${si.scores.weighted.kesiapanTeknologi} poin

PARAMETER TEKNO-EKONOMIS:
CAPEX Awal     : ${formatIDR(si.data.capex)}
OPEX Tahunan   : ${formatIDR(si.data.opex)}/th
Kapasitas      : ${si.data.kapasitasHarian} Ton/hari
Reduksi Metana : ${si.data.penghindaranMetana}%
Residu ke TPA  : ${si.data.residuTPA}%
Tenaga Kerja   : ${si.data.lapanganKerja} Orang
--------------------------------------------------------------------------------
`;
    });

    content += `
JUSTIFIKASI POKJA PEMILIHAN:
Opsi rekomendasi terbaik berdasarkan analisis multi-kriteria GVMS adalah "${activeWinner?.data.namaTeknologi}" dengan skor akhir ${activeWinner?.scores.gvmsTotal}. Memenuhi prinsip pengadaan publik berkelanjutan sesuai Keputusan Kepala LKPP No. 12/2024.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Komparasi-GVMS-LKPP-${new Date().getFullYear()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Candidates not already selected
  const availableCandidates = useMemo(() => {
    const selectedIds = new Set(selectedItems.map((i) => i.id));
    return registry.filter((item) => !selectedIds.has(item.id));
  }, [registry, selectedItems]);

  const resetWeights = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
  };

  return (
    <div className="w-full bg-[#F7F5F0]/60 min-h-screen py-8 px-4 md:px-10">
      {/* Berita Acara Modal for winner */}
      {activeWinner && (
        <BeritaAcaraModal
          isOpen={showBeritaAcara}
          onClose={() => setShowBeritaAcara(false)}
          assessment={activeWinner.data}
          scores={activeWinner.scores}
        />
      )}

      {/* Add from registry modal */}
      {showPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-xl w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1]">
              <h3 className="text-sm font-bold text-[#041534]">
                Pilih Opsi dari Registry untuk Dikomparasikan
              </h3>
              <button
                onClick={() => setShowPickerModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableCandidates.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  Semua proposal dari registry telah ditambahkan ke lembar komparasi.
                </p>
              ) : (
                availableCandidates.map((item) => {
                  const s = calculateGVMS(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3 border border-[#CBD5E1] rounded-lg hover:border-[#1E5631] flex items-center justify-between transition-colors bg-white"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[#041534]">
                          {item.namaTeknologi}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.daerah} &bull; {item.pengusul}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-xs text-[#1E5631]">
                          Skor: {s.gvmsTotal}
                        </span>
                        <button
                          onClick={() => {
                            onAddItem(item);
                            setShowPickerModal(false);
                          }}
                          className="px-3 py-1 bg-[#1E5631] text-white rounded text-xs font-semibold hover:bg-[#163F24]"
                        >
                          Pilih
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-[#CBD5E1] flex justify-end">
              <button
                onClick={() => setShowPickerModal(false)}
                className="px-4 py-1.5 border border-[#CBD5E1] rounded text-xs text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="text-xs text-[#64748B] flex items-center space-x-2">
          <button onClick={() => onNavigate('beranda')} className="hover:text-[#1E5631] font-medium">
            Beranda
          </button>
          <span>&gt;</span>
          <button onClick={() => onNavigate('registry')} className="hover:text-[#1E5631] font-medium">
            Registry Teknologi
          </button>
          <span>&gt;</span>
          <span className="text-[#041534] font-bold">Komparasi Multikriteria Proposal</span>
        </div>

        {/* Top Title & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#CBD5E1] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#041534]">
                Perbandingan Opsi Teknologi Sampah
              </h1>
              <span className="text-xs font-mono font-bold bg-[#EBF3F5] text-[#1F6F6F] px-2.5 py-0.5 rounded border border-[#CBD5E1]">
                {selectedItems.length} dari Maks 3 Opsi
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Evaluasi perbandingan berdampingan (head-to-head) untuk justifikasi penetapan pemenang pengadaan SPSE.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setShowWeightAdjuster(!showWeightAdjuster)}
              className={`px-3.5 py-2 border rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors ${
                showWeightAdjuster
                  ? 'bg-[#EBF5EE] border-[#1E5631] text-[#1E5631]'
                  : 'bg-white border-[#CBD5E1] text-[#1B2A4A] hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simulasi Bobot Kustom</span>
            </button>

            {selectedItems.length < 3 && (
              <button
                onClick={() => setShowPickerModal(true)}
                className="px-3.5 py-2 border border-[#CBD5E1] bg-white text-[#1E5631] hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#1E5631]" />
                <span>Tambah Opsi ({3 - selectedItems.length} slot)</span>
              </button>
            )}

            <button
              onClick={handleDownloadComparison}
              disabled={selectedItems.length === 0}
              className="px-3.5 py-2 border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#1B2A4A] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Hasil Komparasi</span>
            </button>

            <button
              onClick={() => setShowBeritaAcara(true)}
              disabled={!activeWinner}
              className="px-4 py-2 bg-[#1B2A4A] hover:bg-[#253961] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara Evaluasi</span>
            </button>
          </div>
        </div>

        {/* Interactive Multi-Criteria Weight Sensitivity Panel */}
        {showWeightAdjuster && (
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-5 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#041534] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#1E5631]" />
                  <span>Simulasi Pembobotan Multikriteria Lokal Pokja</span>
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Sesuaikan bobot persentase 5 dimensi untuk menguji sensitivitas prioritas kebijakan daerah.
                </p>
              </div>
              <button
                onClick={resetWeights}
                className="text-xs text-[#1E5631] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Standar LKPP (30-25-20-15-10)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">LCC:</span>
                  <span className="font-mono font-bold text-[#1B2A4A]">{(weights.lcc * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={weights.lcc}
                  onChange={(e) => setWeights({ ...weights, lcc: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1B2A4A]"
                />
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Lingkungan:</span>
                  <span className="font-mono font-bold text-[#1E5631]">{(weights.lingkungan * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.50"
                  step="0.05"
                  value={weights.lingkungan}
                  onChange={(e) => setWeights({ ...weights, lingkungan: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1E5631]"
                />
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Layanan:</span>
                  <span className="font-mono font-bold text-[#1F6F6F]">{(weights.layanan * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.40"
                  step="0.05"
                  value={weights.layanan}
                  onChange={(e) => setWeights({ ...weights, layanan: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1F6F6F]"
                />
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Sosial &amp; Eko:</span>
                  <span className="font-mono font-bold text-[#D68910]">{(weights.sosialEkonomi * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={weights.sosialEkonomi}
                  onChange={(e) => setWeights({ ...weights, sosialEkonomi: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#D68910]"
                />
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Kesiapan TRL:</span>
                  <span className="font-mono font-bold text-slate-700">{(weights.kesiapanTeknologi * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.05"
                  value={weights.kesiapanTeknologi}
                  onChange={(e) => setWeights({ ...weights, kesiapanTeknologi: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty State warning if none selected */}
        {selectedItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#CBD5E1] p-12 text-center shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#Eff4FF] text-[#1B2A4A] flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#041534]">
                Belum Ada Opsi yang Dipilih untuk Dikomparasikan
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1">
                Silakan pilih 2 hingga 3 teknologi dari basis data Registry untuk membandingkan biaya siklus hidup, emisi, dan kelayakan pengadaan.
              </p>
            </div>
            <button
              onClick={() => onNavigate('registry')}
              className="px-5 py-2 bg-[#1E5631] text-white rounded text-xs font-bold hover:bg-[#163F24] inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Buka Registry Teknologi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Side-by-Side Comparison Columns */}
            <div
              className={`grid grid-cols-1 ${
                selectedItems.length === 1
                  ? 'md:grid-cols-1 max-w-xl mx-auto'
                  : selectedItems.length === 2
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-3'
              } gap-6 items-stretch`}
            >
              {scoredItems.map((si, idx) => {
                const isWinner = idx === winnerIndex;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <div
                    key={si.data.id}
                    className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all relative ${
                      isWinner
                        ? 'border-2 border-[#1E5631] ring-1 ring-[#1E5631]/20 shadow-md'
                        : 'border-[#CBD5E1]'
                    }`}
                  >
                    {/* Top Badge: Recommendation or Option Letter */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded bg-[#1B2A4A] text-white text-xs font-bold flex items-center justify-center">
                          {letter}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          Opsi Proposal {letter}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 bg-[#EBF5EE] text-[#1E5631] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#1E5631]/30 uppercase tracking-wider">
                            <Trophy className="w-3 h-3 text-[#D68910]" />
                            Rekomendasi Tertinggi
                          </span>
                        )}

                        {selectedItems.length > 1 && (
                          <button
                            onClick={() => onRemoveItem(si.data.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Hapus dari lembar komparasi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Proposal Identification */}
                    <div className="space-y-1 mb-4">
                      <h3 className="text-base font-bold text-[#041534] leading-snug">
                        {si.data.namaTeknologi}
                      </h3>
                      <div className="text-xs font-medium text-slate-600">
                        {si.data.pengusul}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Lokasi: <span className="font-semibold text-slate-700">{si.data.daerah}</span>
                      </div>
                    </div>

                    {/* Overall Score Box */}
                    <div className="p-3.5 bg-[#F8F9FF] rounded-lg border border-[#CBD5E1] text-center mb-4">
                      <span className="text-[11px] text-[#64748B] block">Total Skor GVMS</span>
                      <div className="text-3xl font-extrabold font-mono text-[#041534] my-0.5">
                        {si.scores.gvmsTotal}
                        <span className="text-xs font-normal text-slate-400"> / 100</span>
                      </div>
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          si.scores.gvmsTotal >= 75
                            ? 'bg-[#EBF5EE] text-[#1E5631] border-[#1E5631]/30'
                            : 'bg-[#Eff4FF] text-[#1B2A4A] border-[#1B2A4A]/30'
                        }`}
                      >
                        {si.scores.category}
                      </span>
                    </div>

                    {/* 5 Dimensions Mini Bars */}
                    <div className="space-y-2.5 mb-5 text-xs">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Skor Terbobot 5 Dimensi:
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-600">LCC ({(weights.lcc * 100).toFixed(0)}%)</span>
                          <span className="font-mono font-bold text-slate-800">{si.scores.weighted.lcc}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1B2A4A] h-full"
                            style={{ width: `${(si.scores.weighted.lcc / (weights.lcc * 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-600">Lingkungan ({(weights.lingkungan * 100).toFixed(0)}%)</span>
                          <span className="font-mono font-bold text-slate-800">{si.scores.weighted.lingkungan}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1E5631] h-full"
                            style={{ width: `${(si.scores.weighted.lingkungan / (weights.lingkungan * 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-600">Layanan ({(weights.layanan * 100).toFixed(0)}%)</span>
                          <span className="font-mono font-bold text-slate-800">{si.scores.weighted.layanan}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1F6F6F] h-full"
                            style={{ width: `${(si.scores.weighted.layanan / (weights.layanan * 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-600">Sosial &amp; Eko ({(weights.sosialEkonomi * 100).toFixed(0)}%)</span>
                          <span className="font-mono font-bold text-slate-800">{si.scores.weighted.sosialEkonomi}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#D68910] h-full"
                            style={{ width: `${(si.scores.weighted.sosialEkonomi / (weights.sosialEkonomi * 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-600">Kesiapan TRL ({(weights.kesiapanTeknologi * 100).toFixed(0)}%)</span>
                          <span className="font-mono font-bold text-slate-800">{si.scores.weighted.kesiapanTeknologi}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-700 h-full"
                            style={{ width: `${(si.scores.weighted.kesiapanTeknologi / (weights.kesiapanTeknologi * 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Technical / Financial Comparison Matrix */}
                    <div className="border-t border-[#CBD5E1] pt-3 text-xs space-y-2 mb-4">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Investasi CAPEX</span>
                        <span className={`font-mono font-bold ${highlightBest && si.data.capex === bestMetrics.minCapex ? 'text-[#1E5631] bg-[#EBF5EE] px-1.5 rounded' : 'text-slate-800'}`}>
                          {formatIDR(si.data.capex)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">OPEX Tahunan</span>
                        <span className={`font-mono font-bold ${highlightBest && si.data.opex === bestMetrics.minOpex ? 'text-[#1E5631] bg-[#EBF5EE] px-1.5 rounded' : 'text-slate-800'}`}>
                          {formatIDR(si.data.opex)}/th
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Kapasitas Harian</span>
                        <span className="font-mono font-bold text-slate-800">{si.data.kapasitasHarian} TPD</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Penghindaran Metana</span>
                        <span className={`font-mono font-bold ${highlightBest && si.data.penghindaranMetana === bestMetrics.maxMetana ? 'text-[#1E5631] bg-[#EBF5EE] px-1.5 rounded' : 'text-[#1E5631]'}`}>
                          {si.data.penghindaranMetana}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Residu Buang TPA</span>
                        <span className={`font-mono font-bold ${highlightBest && si.data.residuTPA === bestMetrics.minResidu ? 'text-[#1E5631] bg-[#EBF5EE] px-1.5 rounded' : 'text-slate-800'}`}>
                          {si.data.residuTPA}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Tenaga Kerja Lokal</span>
                        <span className="font-mono font-bold text-slate-800">{si.data.lapanganKerja} Orang</span>
                      </div>
                    </div>

                    {/* Bottom Action for this Option */}
                    <div className="pt-2 border-t border-[#CBD5E1] space-y-1.5">
                      <button
                        onClick={() => {
                          setSelectedWinnerIdx(idx);
                          setShowBeritaAcara(true);
                        }}
                        className={`w-full py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs ${
                          isWinner
                            ? 'bg-[#1E5631] hover:bg-[#163F24] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Pilih Sebagai Pemenang Evaluasi</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectForDashboard(si.data);
                          onNavigate('hasil');
                        }}
                        className="w-full py-1.5 rounded text-xs font-semibold hover:bg-slate-50 border border-[#CBD5E1] text-[#1B2A4A] flex items-center justify-center gap-1"
                      >
                        <span>Buka Detail di Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Justification Card: Kebijakan & Trade-Off Pengadaan */}
            {activeWinner && (
              <div className="bg-white rounded-xl border border-[#CBD5E1] p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-[#CBD5E1]">
                  <ShieldCheck className="w-5 h-5 text-[#1E5631]" />
                  <h3 className="text-base font-bold text-[#041534]">
                    Justifikasi Kebijakan &amp; Komparasi Trade-Off Pengadaan
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-700 leading-relaxed">
                  <div className="space-y-1">
                    <span className="font-bold text-[#1B2A4A] block">1. Efisiensi Biaya Siklus Hidup (LCC)</span>
                    <p className="text-[#64748B]">
                      Meskipun salah satu alternatif mungkin menawarkan CAPEX awal lebih rendah, <strong className="text-slate-900">{activeWinner.data.namaTeknologi}</strong> menghasilkan total biaya per ton terendah berkat umur pakai 20 tahun dan efisiensi konsumsi energi operasional yang terukur.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-[#1E5631] block">2. Kepatuhan Mitigasi Iklim KLHK</span>
                    <p className="text-[#64748B]">
                      Tingkat penghindaran metana sebesar <strong className="text-slate-900">{activeWinner.data.penghindaranMetana}%</strong> serta residu ke TPA hanya <strong className="text-slate-900">{activeWinner.data.residuTPA}%</strong> memenuhi standar SPM persampahan nasional dan layak mendapatkan insentif pasar karbon/kredit emisi.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-[#1F6F6F] block">3. Rekomendasi Resmi Pokja SPSE</span>
                    <p className="text-[#64748B]">
                      Pokja Pemilihan menyimpulkan bahwa opsi dengan skor GVMS <strong className="text-[#1E5631] font-mono">{activeWinner.scores.gvmsTotal}</strong> merupakan pilihan pengadaan paling optimal (Green Value-for-Money) untuk dialokasikan dalam penetapan pemenang kontrak publik.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#CBD5E1] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-[#64748B]">
                    Status: <strong className="text-[#1E5631]">Siap Ditandatangani Pokja Pemilihan ({activeWinner.data.namaTeknologi})</strong>
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowBeritaAcara(true)}
                      className="px-4 py-1.5 bg-[#1B2A4A] text-white rounded font-bold hover:bg-[#253961] shadow-xs flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Cetak Berita Acara Pemenang Opsi</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
