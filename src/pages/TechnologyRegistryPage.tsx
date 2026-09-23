import React, { useState, useMemo } from 'react';
import { PageView, AssessmentData } from '../types/gvms';
import { calculateGVMS, formatIDR } from '../utils/gvmsCalculator';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Scale, 
  CheckCircle2, 
  Eye, 
  Trash2, 
  CheckSquare, 
  Square,
  Sparkles,
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Building,
  TrendingUp,
  Zap,
  Tag
} from 'lucide-react';

interface TechnologyRegistryPageProps {
  registry: AssessmentData[];
  onNavigate: (page: PageView) => void;
  onSelectAssessment: (item: AssessmentData) => void;
  selectedForCompare: AssessmentData[];
  onToggleCompare: (item: AssessmentData) => void;
  onClearCompare: () => void;
  onDeleteAssessment?: (id: string) => void;
}

export const TechnologyRegistryPage: React.FC<TechnologyRegistryPageProps> = ({
  registry,
  onNavigate,
  onSelectAssessment,
  selectedForCompare,
  onToggleCompare,
  onClearCompare,
  onDeleteAssessment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [minScore, setMinScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'date-desc'>('score-desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Quick View Drawer State
  const [quickViewItem, setQuickViewItem] = useState<AssessmentData | null>(null);

  // Available unique regions
  const regions = useMemo(() => {
    const set = new Set<string>();
    registry.forEach((item) => {
      if (item.daerah) set.add(item.daerah);
    });
    return Array.from(set);
  }, [registry]);

  // Filter & sort logic
  const filteredItems = useMemo(() => {
    return registry
      .filter((item) => {
        const matchesQuery =
          item.namaTeknologi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.pengusul.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.daerah.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase());

        const scores = calculateGVMS(item);
        let matchesStatus = true;
        if (selectedStatus === 'Terverifikasi') {
          matchesStatus = scores.gvmsTotal >= 75 || item.status === 'Terverifikasi';
        } else if (selectedStatus === 'Perlu Perbaikan') {
          matchesStatus = (scores.gvmsTotal >= 35 && scores.gvmsTotal < 75) || item.status === 'Perlu Perbaikan';
        } else if (selectedStatus === 'Ditolak') {
          matchesStatus = scores.gvmsTotal < 35 || item.status === 'Ditolak';
        }

        const matchesRegion = selectedRegion === 'Semua' || item.daerah === selectedRegion;
        const matchesScore = scores.gvmsTotal >= minScore;
        const matchesCat = selectedCategory === 'Semua' || (item.kategoriTeknologi && item.kategoriTeknologi.toLowerCase().includes(selectedCategory.toLowerCase()));

        return matchesQuery && matchesStatus && matchesRegion && matchesScore && matchesCat;
      })
      .sort((a, b) => {
        const scoreA = calculateGVMS(a).gvmsTotal;
        const scoreB = calculateGVMS(b).gvmsTotal;
        if (sortBy === 'score-desc') return scoreB - scoreA;
        if (sortBy === 'score-asc') return scoreA - scoreB;
        return 0;
      });
  }, [registry, searchQuery, selectedStatus, selectedRegion, selectedCategory, minScore, sortBy]);

  // Select top 3 automatically
  const handleSelectTop3 = () => {
    const sorted = [...registry].sort((a, b) => calculateGVMS(b).gvmsTotal - calculateGVMS(a).gvmsTotal);
    onClearCompare();
    sorted.slice(0, 3).forEach((item) => onToggleCompare(item));
  };

  const isSelected = (id: string) => selectedForCompare.some((item) => item.id === id);

  return (
    <div className="w-full bg-[#F7F5F0]/60 min-h-screen py-8 px-4 md:px-10 relative">
      {/* Quick View Side Drawer */}
      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4 border-l border-[#CBD5E1]">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                  {quickViewItem.id}
                </span>
                <span className="text-xs text-slate-400">Ringkasan Cepat</span>
              </div>
              <button
                onClick={() => setQuickViewItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#041534] leading-snug">
                {quickViewItem.namaTeknologi}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {quickViewItem.pengusul} &bull; {quickViewItem.daerah}
              </p>
            </div>

            {/* Score Box in Drawer */}
            {(() => {
              const sc = calculateGVMS(quickViewItem);
              return (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F8F9FF] rounded-lg border border-[#CBD5E1] text-center">
                    <span className="text-xs text-slate-500">Skor Total GVMS:</span>
                    <div className="text-3xl font-bold font-mono text-[#041534] my-1">
                      {sc.gvmsTotal} <span className="text-xs font-normal text-slate-400">/ 100</span>
                    </div>
                    <span
                      className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        sc.gvmsTotal >= 75
                          ? 'bg-[#EBF5EE] text-[#1E5631] border-[#1E5631]/30'
                          : 'bg-[#Eff4FF] text-[#1B2A4A] border-[#1B2A4A]/30'
                      }`}
                    >
                      {sc.category}
                    </span>
                  </div>

                  {/* 5 Dimensi in Drawer */}
                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-slate-700">Dekomposisi Poin:</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-600">LCC (30%)</span>
                        <strong className="font-mono text-slate-800">{sc.weighted.lcc} / 30</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Lingkungan (25%)</span>
                        <strong className="font-mono text-[#1E5631]">{sc.weighted.lingkungan} / 25</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Layanan (20%)</span>
                        <strong className="font-mono text-[#1F6F6F]">{sc.weighted.layanan} / 20</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Sosial &amp; Eko (15%)</span>
                        <strong className="font-mono text-[#D68910]">{sc.weighted.sosialEkonomi} / 15</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Kesiapan TRL (10%)</span>
                        <strong className="font-mono text-slate-700">{sc.weighted.kesiapanTeknologi} / 10</strong>
                      </div>
                    </div>
                  </div>

                  {/* Specs in Drawer */}
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">CAPEX:</span>
                      <strong className="font-mono text-slate-800">{formatIDR(quickViewItem.capex)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">OPEX Tahunan:</span>
                      <strong className="font-mono text-slate-800">{formatIDR(quickViewItem.opex)}/th</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kapasitas Harian:</span>
                      <strong className="font-mono text-slate-800">{quickViewItem.kapasitasHarian} TPD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Residu ke TPA:</span>
                      <strong className="font-mono text-slate-800">{quickViewItem.residuTPA}%</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        onSelectAssessment(quickViewItem);
                        onNavigate('hasil');
                        setQuickViewItem(null);
                      }}
                      className="w-full py-2 bg-[#1E5631] text-white rounded text-xs font-bold hover:bg-[#163F24] transition-colors"
                    >
                      Buka di Dashboard Lengkap
                    </button>
                    <button
                      onClick={() => {
                        onToggleCompare(quickViewItem);
                        setQuickViewItem(null);
                      }}
                      className="w-full py-2 border border-[#CBD5E1] text-[#1F6F6F] rounded text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      {isSelected(quickViewItem.id) ? 'Hapus dari Komparasi' : 'Tambahkan ke Komparasi'}
                    </button>
                  </div>
                </div>
              );
            })()}
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
          <span className="text-[#041534] font-bold">Registry Teknologi Terverifikasi</span>
        </div>

        {/* Top Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#CBD5E1] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#041534]">
                Registry Teknologi Pengolahan Sampah
              </h1>
              <span className="text-xs font-mono font-bold bg-[#EBF5EE] text-[#1E5631] px-2.5 py-0.5 rounded border border-[#CBD5E1]">
                Katalog Nasional
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Basis data proposal teknologi yang telah dinilai menggunakan instrumen Green Value-for-Money Score (GVMS).
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleSelectTop3}
              className="px-3 py-2 bg-white border border-[#CBD5E1] hover:border-[#1E5631] text-[#1E5631] rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Pilih otomatis 3 usulan dengan skor tertinggi"
            >
              <Zap className="w-3.5 h-3.5 text-[#D68910]" />
              <span>Pilih 3 Terbaik Otomatis</span>
            </button>

            <button
              onClick={() => onNavigate('penilaian')}
              className="bg-[#1E5631] hover:bg-[#163F24] active:bg-[#0E2917] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Penilaian Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & View Switcher */}
        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama teknologi, pengusul, atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#CBD5E1] rounded text-xs focus:outline-none focus:border-[#1E5631] text-slate-800"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-xs focus:outline-none focus:border-[#1E5631] bg-white text-slate-800"
              >
                <option value="Semua">Semua Status Kelayakan</option>
                <option value="Terverifikasi">Terverifikasi (Sangat Layak &ge;75)</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan (50-74)</option>
                <option value="Ditolak">Ditolak (&lt;50)</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-xs focus:outline-none focus:border-[#1E5631] bg-white text-slate-800"
              >
                <option value="Semua">Semua Wilayah</option>
                {regions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#CBD5E1] rounded text-xs focus:outline-none focus:border-[#1E5631] bg-white text-slate-800"
              >
                <option value="score-desc">Skor: Tertinggi</option>
                <option value="score-asc">Skor: Terendah</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="sm:col-span-1 flex items-center justify-end">
              <div className="flex border border-[#CBD5E1] rounded p-0.5 bg-slate-50">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-xs text-[#1E5631]' : 'text-slate-400'
                  }`}
                  title="Tampilan Tabel"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-xs text-[#1E5631]' : 'text-slate-400'
                  }`}
                  title="Tampilan Kartu Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Minimum Score Slider Filter */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-slate-600 font-medium">Filter Ambang Skor Minimal:</span>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-36 h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1E5631]"
              />
              <span className="font-mono font-bold text-[#1E5631] bg-slate-100 px-2 py-0.5 rounded">
                &ge; {minScore} Poin
              </span>
            </div>

            {/* Comparison Selection Bar */}
            {selectedForCompare.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-[#1F6F6F] font-bold">
                  {selectedForCompare.length} dari 3 Opsi Terpilih
                </span>
                <button
                  onClick={onClearCompare}
                  className="text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Reset
                </button>
                <button
                  onClick={() => onNavigate('komparasi')}
                  className="px-3 py-1 bg-[#1F6F6F] hover:bg-[#185555] text-white rounded font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Buka Komparasi</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content View: Table or Grid */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl border border-[#CBD5E1] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#1B2A4A] text-white text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 w-12 text-center">Pilih</th>
                    <th className="p-3.5">Nama Teknologi &amp; Spesifikasi</th>
                    <th className="p-3.5">Daerah / Pengusul</th>
                    <th className="p-3.5 text-center">Skor GVMS</th>
                    <th className="p-3.5 text-center">Status Verifikasi</th>
                    <th className="p-3.5">Tanggal Penilaian</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Tidak ada teknologi yang cocok dengan kriteria filter. Silakan ubah filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const scores = calculateGVMS(item);
                      const selected = isSelected(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            selected ? 'bg-[#EBF3F5]/40' : ''
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => onToggleCompare(item)}
                              className="text-slate-500 hover:text-[#1F6F6F] transition-colors"
                              title="Pilih untuk komparasi"
                            >
                              {selected ? (
                                <CheckSquare className="w-4 h-4 text-[#1F6F6F]" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-[#041534] text-xs leading-snug">
                              {item.namaTeknologi}
                            </div>
                            <div className="text-[11px] text-[#64748B] mt-0.5">
                              {item.spesifikasiSingkat || `Kapasitas: ${item.kapasitasHarian} TPD • Residu TPA: ${item.residuTPA}%`}
                            </div>
                            <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                              ID: {item.id}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{item.daerah}</div>
                            <div className="text-[11px] text-slate-500">{item.pengusul}</div>
                          </td>

                          <td className="p-3.5 text-center">
                            <span className="text-base font-extrabold font-mono text-[#041534] block">
                              {scores.gvmsTotal}
                            </span>
                            <span className="text-[10px] text-slate-400">skala 100</span>
                          </td>

                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                scores.gvmsTotal >= 75
                                  ? 'bg-[#EBF5EE] text-[#1E5631] border-[#1E5631]/30'
                                  : scores.gvmsTotal >= 50
                                  ? 'bg-[#Eff4FF] text-[#1B2A4A] border-[#1B2A4A]/30'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {scores.gvmsTotal >= 75
                                ? 'Terverifikasi'
                                : scores.gvmsTotal >= 50
                                ? 'Perlu Perbaikan'
                                : 'Ditolak'}
                            </span>
                          </td>

                          <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                            {item.tanggalPenilaian}
                          </td>

                          <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setQuickViewItem(item)}
                              className="px-2.5 py-1 border border-[#CBD5E1] bg-white hover:bg-slate-50 text-slate-700 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
                              title="Tinjau Cepat"
                            >
                              <span>Tinjau</span>
                            </button>

                            <button
                              onClick={() => {
                                onSelectAssessment(item);
                                onNavigate('hasil');
                              }}
                              className="px-2.5 py-1 border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#1B2A4A] rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1 shadow-xs"
                              title="Buka Dashboard Hasil"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Detail</span>
                            </button>

                            <button
                              onClick={() => onToggleCompare(item)}
                              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1 shadow-xs ${
                                selected
                                  ? 'bg-[#1F6F6F] text-white'
                                  : 'border border-[#CBD5E1] bg-white hover:bg-slate-50 text-[#1F6F6F]'
                              }`}
                              title="Tambahkan ke lembar perbandingan"
                            >
                              <Scale className="w-3 h-3" />
                              <span>{selected ? 'Terpilih' : 'Bandingkan'}</span>
                            </button>

                            {onDeleteAssessment && item.id.startsWith('PROP-') && (
                              <button
                                onClick={() => onDeleteAssessment(item.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors inline-block align-middle"
                                title="Hapus Usulan Draf"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View (Interactive Bento Cards) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const sc = calculateGVMS(item);
              const selected = isSelected(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between hover:border-[#1E5631] transition-all ${
                    selected ? 'border-[#1F6F6F] ring-1 ring-[#1F6F6F]' : 'border-[#CBD5E1]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                        {item.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          sc.gvmsTotal >= 75
                            ? 'bg-[#EBF5EE] text-[#1E5631] border-[#1E5631]/30'
                            : 'bg-[#Eff4FF] text-[#1B2A4A] border-[#1B2A4A]/30'
                        }`}
                      >
                        Skor: {sc.gvmsTotal}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#041534] leading-snug">
                        {item.namaTeknologi}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.pengusul} &bull; {item.daerah}
                      </p>
                    </div>

                    {/* Progress bars mini preview */}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-slate-600">
                        <span>LCC (30%)</span>
                        <strong className="font-mono">{sc.weighted.lcc}</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1B2A4A] h-full" style={{ width: `${(sc.weighted.lcc / 30) * 100}%` }}></div>
                      </div>

                      <div className="flex justify-between text-slate-600">
                        <span>Lingkungan (25%)</span>
                        <strong className="font-mono">{sc.weighted.lingkungan}</strong>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1E5631] h-full" style={{ width: `${(sc.weighted.lingkungan / 25) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Kapasitas:</span>
                        <strong className="font-mono text-slate-800">{item.kapasitasHarian} TPD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>CAPEX:</span>
                        <strong className="font-mono text-slate-800">{formatIDR(item.capex)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onSelectAssessment(item);
                        onNavigate('hasil');
                      }}
                      className="px-3 py-1.5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>

                    <button
                      onClick={() => onToggleCompare(item)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-xs ${
                        selected
                          ? 'bg-[#1F6F6F] text-white'
                          : 'bg-[#1E5631] hover:bg-[#163F24] text-white'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{selected ? 'Terpilih' : 'Bandingkan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
