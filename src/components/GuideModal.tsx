import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle, ExternalLink, BookOpen, Shield } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'metodologi' | 'regulasi' | 'tahapan'>('metodologi');

  if (!isOpen) return null;

  const handleDownloadGuide = () => {
    const guideText = `PANDUAN TEKNIS PENILAIAN GREEN VALUE-FOR-MONEY SCORE (GVMS)
LEMBAGA KEBIJAKAN PENGADAAN BARANG/JASA PEMERINTAH (LKPP)
KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN (KLHK) RI
EDISI 2025 / 2026

1. DASAR HUKUM
- Peraturan Presiden Nomor 12 Tahun 2021 tentang Perubahan atas Perpres 16/2018 tentang Pengadaan Barang/Jasa Pemerintah.
- Peraturan Presiden Nomor 38 Tahun 2015 tentang Kerjasama Pemerintah dengan Badan Usaha (KPBU).
- Peraturan Menteri LHK Nomor P.70/MENLHK/SETJEN/KUM.1/8/2016 tentang Baku Mutu Emisi Usaha dan/atau Kegiatan Pengolahan Sampah secara Termal.
- Keputusan Kepala LKPP Nomor 12/2024 tentang Pengadaan Berkelanjutan.

2. BOBOT 5 DIMENSI PENILAIAN
1. Biaya Siklus Hidup (Life-Cycle Cost / LCC) — Bobot 30%
   Parameter: CAPEX Awal, OPEX Tahunan, Masa Manfaat Aset, LCC/ton sampah diolah.
2. Kinerja Lingkungan (Environmental Performance) — Bobot 25%
   Parameter: Pengurangan Emisi GRK (tCO2e/th), Penghindaran Metana (%), Residu ke TPA (%).
3. Kinerja Layanan (Service Performance) — Bobot 20%
   Parameter: Kapasitas Olah Harian (TPD), Ketersediaan Operasional / Uptime (%), Tingkat Pemulihan (Recovery Rate %).
4. Nilai Sosial & Ekonomi (Social & Economic Value) — Bobot 15%
   Parameter: Penyerapan Tenaga Kerja Lokal (orang), Indeks Penerimaan Masyarakat (Skala Likert 1-5).
5. Kesiapan Teknologi (Technology Readiness Level / TRL) — Bobot 10%
   Parameter: Kematangan Teknologi & Rekam Jejak (Pilot TRL 4-6, Komersial TRL 7-8, Registry Nasional TRL 9).

3. FORMULA PERHITUNGAN
GVMS = 0.30×SkorLCC + 0.25×SkorLingkungan + 0.20×SkorLayanan + 0.15×SkorSosialEkonomi + 0.10×SkorKesiapanTeknologi

4. AMBANG BATAS KELAYAKAN
- Skor >= 75.0 : Sangat Layak (Kategori Hijau) — Prioritas PKS / Penjaminan PII & PT SMI
- Skor 50.0 - 74.9 : Layak Direkomendasikan — Syarat mitigasi risiko operasional
- Skor 35.0 - 49.9 : Perlu Perbaikan — Revisi teknis & optimasi biaya
- Skor < 35.0 : Tidak Direkomendasikan / Diskualifikasi

Dokumen Resmi Terverifikasi SPSE Republik Indonesia.`;

    const blob = new Blob([guideText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Panduan-Teknis-GVMS-LKPP-2025.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#b5f1bf]" />
            </div>
            <div>
              <h3 className="text-base font-bold">Panduan Penilaian Green Value-for-Money Score (GVMS)</h3>
              <p className="text-xs text-slate-300">Standar Evaluasi Pengadaan Pengolahan Sampah — LKPP &amp; Ditjen PSLB3 KLHK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2E8F0] bg-slate-50 px-5 pt-2 text-xs font-semibold text-[#45464e]">
          <button
            onClick={() => setActiveTab('metodologi')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'metodologi'
                ? 'border-[#1E5631] text-[#1E5631]'
                : 'border-transparent hover:text-[#041534]'
            }`}
          >
            5 Pilar Metodologi
          </button>
          <button
            onClick={() => setActiveTab('regulasi')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'regulasi'
                ? 'border-[#1E5631] text-[#1E5631]'
                : 'border-transparent hover:text-[#041534]'
            }`}
          >
            Kerangka Regulasi &amp; Standar
          </button>
          <button
            onClick={() => setActiveTab('tahapan')}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === 'tahapan'
                ? 'border-[#1E5631] text-[#1E5631]'
                : 'border-transparent hover:text-[#041534]'
            }`}
          >
            Alur Evaluasi Pokja
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-[#0b1c30] space-y-4">
          {activeTab === 'metodologi' && (
            <div className="space-y-4">
              <div className="bg-[#F7F5F0] p-3.5 rounded-lg border border-[#E2E8F0]">
                <h4 className="font-bold text-[#1B2A4A] text-sm mb-1">Rumus Utama GVMS</h4>
                <div className="p-2 bg-white rounded border border-[#CBD5E1] font-mono text-[11px] text-[#1E5631] font-bold">
                  GVMS = (0.30 × Skor LCC) + (0.25 × Skor Lingkungan) + (0.20 × Skor Layanan) + (0.15 × Skor Sosial) + (0.10 × Skor Kesiapan)
                </div>
                <p className="text-[#64748B] text-[11px] mt-1.5">
                  Setiap parameter dinormalisasi ke rentang 0–100 berdasarkan benchmark biaya fiskal, standar emisi KLHK, keandalan uptime, serapan tenaga kerja, dan kematangan TRL.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border border-[#CBD5E1] rounded-lg bg-white">
                  <span className="font-bold text-[#1B2A4A] block">1. Biaya Siklus Hidup (30%)</span>
                  <p className="text-[#64748B] text-[11px] mt-1">
                    Evaluasi CAPEX total, OPEX tahunan, masa pakai depresiasi aset teknis, serta efisiensi beban tipping fee per ton sampah diolah.
                  </p>
                </div>
                <div className="p-3 border border-[#CBD5E1] rounded-lg bg-white">
                  <span className="font-bold text-[#1E5631] block">2. Kinerja Lingkungan (25%)</span>
                  <p className="text-[#64748B] text-[11px] mt-1">
                    Pengurangan emisi GRK, tingkat penghindaran gas metana landfill, dan persentase residu yang dialihkan dari pembuangan TPA.
                  </p>
                </div>
                <div className="p-3 border border-[#CBD5E1] rounded-lg bg-white">
                  <span className="font-bold text-[#1F6F6F] block">3. Kinerja Layanan (20%)</span>
                  <p className="text-[#64748B] text-[11px] mt-1">
                    Throughput harian (ton/hari), ketersediaan operasional minimal 335 hari/tahun (92% uptime), dan rasio pemulihan energi/material.
                  </p>
                </div>
                <div className="p-3 border border-[#CBD5E1] rounded-lg bg-white">
                  <span className="font-bold text-[#D68910] block">4. Nilai Sosial &amp; Ekonomi (15%)</span>
                  <p className="text-[#64748B] text-[11px] mt-1">
                    Penyerapan tenaga kerja lokal ber-KTP setempat dan indeks kesepakatan sosial berdasarkan konsultasi publik AMDAL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regulasi' && (
            <div className="space-y-3">
              <div className="border border-[#CBD5E1] rounded-lg p-3 bg-white">
                <div className="font-bold text-[#1B2A4A] flex items-center justify-between">
                  <span>Perpres No. 12 Tahun 2021</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">Pengadaan Hijau</span>
                </div>
                <p className="text-[#64748B] mt-1">
                  Mewajibkan Kementerian/Lembaga dan Pemerintah Daerah mengutamakan aspek keberlanjutan ekonomi, sosial, dan lingkungan hidup dalam pengadaan barang/jasa pemerintah.
                </p>
              </div>

              <div className="border border-[#CBD5E1] rounded-lg p-3 bg-white">
                <div className="font-bold text-[#1B2A4A] flex items-center justify-between">
                  <span>Permen LHK No. P.70/2016</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">Baku Mutu Emisi</span>
                </div>
                <p className="text-[#64748B] mt-1">
                  Baku Mutu Emisi Usaha dan/atau Kegiatan Pengolahan Sampah Termal (Partikulat, SO2, NOx, HCl, HF, CO, Total Hidrokarbon, Dioksin/Furan).
                </p>
              </div>

              <div className="border border-[#CBD5E1] rounded-lg p-3 bg-white">
                <div className="font-bold text-[#1B2A4A] flex items-center justify-between">
                  <span>Perpres No. 38 Tahun 2015 &amp; PT SMI / PII</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">Skema KPBU</span>
                </div>
                <p className="text-[#64748B] mt-1">
                  Proposal dengan skor GVMS ≥ 75.0 berhak diajukan dalam skema Kerjasama Pemerintah dengan Badan Usaha (KPBU) dengan penjaminan kelaikan finansial.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'tahapan' && (
            <div className="space-y-3">
              <ol className="relative border-l border-slate-200 ml-3 space-y-3">
                <li className="ml-4">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-[#1E5631]"></div>
                  <h5 className="font-bold text-[#1B2A4A]">Tahap 1: Pengisian Data Parameter (Halaman 2)</h5>
                  <p className="text-[#64748B] text-[11px]">PPK/Pokja memasukkan rincian finansial, kinerja teknis, emisi, dan kesiapan vendor.</p>
                </li>
                <li className="ml-4">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-[#1E5631]"></div>
                  <h5 className="font-bold text-[#1B2A4A]">Tahap 2: Verifikasi Ambang Batas (Halaman 3)</h5>
                  <p className="text-[#64748B] text-[11px]">Sistem menghitung skor agregat komposit dan membandingkannya terhadap ambang batas 75.0.</p>
                </li>
                <li className="ml-4">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-[#1F6F6F]"></div>
                  <h5 className="font-bold text-[#1B2A4A]">Tahap 3: Pendaftaran ke Registry (Halaman 4)</h5>
                  <p className="text-[#64748B] text-[11px]">Proposal disimpan ke basis data terverifikasi nasional sebagai rujukan daerah lain.</p>
                </li>
                <li className="ml-4">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-[#1B2A4A]"></div>
                  <h5 className="font-bold text-[#1B2A4A]">Tahap 4: Komparasi Multikriteria &amp; Berita Acara (Halaman 5)</h5>
                  <p className="text-[#64748B] text-[11px]">Pokja membandingkan hingga 3 alternatif dan mencetak Berita Acara resmi pengadaan.</p>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">
            Direktorat Pengembangan Strategi Pengadaan LKPP &copy; 2025
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#CBD5E1] text-[#45464e] hover:bg-slate-100 rounded text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleDownloadGuide}
              className="px-4 py-1.5 bg-[#1E5631] hover:bg-[#163F24] text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Panduan PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
