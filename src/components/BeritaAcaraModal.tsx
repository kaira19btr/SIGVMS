import React from 'react';
import { X, Printer, Download, CheckCircle, FileCheck, Shield } from 'lucide-react';
import { AssessmentData, DimensionScores } from '../types/gvms';
import { formatIDR, formatNumberID } from '../utils/gvmsCalculator';

interface BeritaAcaraModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentData;
  scores: DimensionScores;
}

export const BeritaAcaraModal: React.FC<BeritaAcaraModalProps> = ({
  isOpen,
  onClose,
  assessment,
  scores,
}) => {
  if (!isOpen) return null;

  const docNumber = `BA-GVMS/${assessment.id.replace('PROP-', '').replace('GVMS-', '')}/LKPP-KLHK/${new Date().getFullYear()}`;
  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    const textContent = `LEMBAGA KEBIJAKAN PENGADAAN BARANG/JASA PEMERINTAH (LKPP)
KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN REPUBLIK INDONESIA
POKJA PEMILIHAN PENGADAAN FASILITAS PENGOLAHAN SAMPAH RAMAH LINGKUNGAN

================================================================================
BERITA ACARA EVALUASI GREEN VALUE-FOR-MONEY SCORE (GVMS)
Nomor: ${docNumber}
Tanggal: ${currentDateStr}
================================================================================

Pada hari ini, ${currentDateStr}, telah dilakukan evaluasi teknis, finansial, dan lingkungan terhadap proposal pengadaan teknologi pengolahan sampah dengan rincian:

I. IDENTITAS PROPOSAL & PENGUSUL
1. Nomor Registrasi   : ${assessment.id}
2. Nama Teknologi     : ${assessment.namaTeknologi}
3. Badan Usaha / Vendor: ${assessment.pengusul}
4. Pemerintah Daerah  : ${assessment.daerah} (${assessment.provinsi || 'Indonesia'})
5. Kapasitas Olah     : ${assessment.kapasitasHarian} Ton/Hari

II. HASIL PENILAIAN MULTIKRITERIA 5 DIMENSI GVMS
1. Biaya Siklus Hidup (Bobot 30%) : Skor Mentah ${scores.raw.lcc}/100 | Kontribusi Terbobot: ${scores.weighted.lcc} poin
2. Kinerja Lingkungan (Bobot 25%): Skor Mentah ${scores.raw.lingkungan}/100 | Kontribusi Terbobot: ${scores.weighted.lingkungan} poin
3. Kinerja Layanan (Bobot 20%)   : Skor Mentah ${scores.raw.layanan}/100 | Kontribusi Terbobot: ${scores.weighted.layanan} poin
4. Nilai Sosial & Eko (Bobot 15%): Skor Mentah ${scores.raw.sosialEkonomi}/100 | Kontribusi Terbobot: ${scores.weighted.sosialEkonomi} poin
5. Kesiapan Teknologi (Bobot 10%): Skor Mentah ${scores.raw.kesiapanTeknologi}/100 | Kontribusi Terbobot: ${scores.weighted.kesiapanTeknologi} poin

TOTAL SKOR AKHIR GVMS : ${scores.gvmsTotal} / 100
KLASIFIKASI           : ${scores.category} (${scores.tierLabel})
STATUS KELAYAKAN      : ${scores.isApproved ? 'MEMENUHI SYARAT (DIREKOMENDASIKAN)' : 'BELUM MEMENUHI AMBANG BATAS'}

III. KESIMPULAN & REKOMENDASI POKJA PEMILIHAN
Berdasarkan Keputusan Kepala LKPP Nomor 12/2024 dan Permen LHK No. 70/2016:
${scores.isApproved 
  ? 'Proposal dinyatakan LAYAK dan direkomendasikan untuk melanjutkan ke tahap penetapan pemenang lelang / perjanjian kerjasama KPBU.' 
  : 'Proposal dinyatakan PERLU PERBAIKAN dan disarankan melakukan penyesuaian asumsi biaya CAPEX/OPEX serta peningkatan standar teknologi pengendalian emisi.'}

POKJA PEMILIHAN PENGADAAN LKPP & DITJEN PSLB3 KLHK
Ketua Pokja Pemilihan: Dr. Ir. Hendra Gunawan, M.Env
Anggota Teknis KLHK   : Siti Nurhaliza, S.T., M.Sc.
Pejabat Pembuat Komitmen: Bambang Suprayitno, M.Si
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Berita-Acara-GVMS-${assessment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-3xl w-full my-8 flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-[#1B2A4A] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-[#b5f1bf]" />
            <h3 className="text-sm font-bold">Pratinjau Berita Acara Evaluasi Resmi</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-xs flex items-center gap-1 transition-colors"
              title="Cetak Berita Acara"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={handleDownloadDoc}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-xs flex items-center gap-1 transition-colors"
              title="Unduh Salinan Dokumen"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh TXT</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-white/10 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div className="p-8 text-[#0b1c30] text-xs leading-relaxed bg-white overflow-y-auto max-h-[75vh] print:max-h-none print:p-0">
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-[#1B2A4A] pb-4 mb-5 text-center">
            <div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">
              Republik Indonesia
            </div>
            <div className="text-base font-extrabold text-[#1B2A4A] tracking-tight mt-0.5">
              LEMBAGA KEBIJAKAN PENGADAAN BARANG/JASA PEMERINTAH (LKPP)
            </div>
            <div className="text-xs font-semibold text-[#1E5631]">
              KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN — DITJEN PSLB3
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              Kompleks Pengadaan Berkelanjutan SPSE RI • Gedung LKPP Lantai 7, Jakarta Selatan
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center my-4">
            <h4 className="font-bold text-sm text-[#041534] uppercase underline tracking-wide">
              BERITA ACARA HASIL EVALUASI GREEN VALUE-FOR-MONEY SCORE (GVMS)
            </h4>
            <div className="font-mono text-[11px] text-slate-600 mt-0.5">
              Nomor: {docNumber}
            </div>
          </div>

          <p className="mt-4">
            Pada hari ini, <span className="font-semibold">{currentDateStr}</span>, bertempat di Ruang Evaluasi Pokja Pengadaan LKPP Jakarta, telah dilaksanakan penilaian komprehensif terhadap dokumen penawaran teknis dan tekno-ekonomis fasilitas pengolahan sampah sebagai berikut:
          </p>

          {/* Table 1: Metadata */}
          <div className="my-4 border border-[#CBD5E1] rounded overflow-hidden">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-[#CBD5E1] bg-slate-50">
                  <td className="p-2 font-semibold text-slate-700 w-1/3">Kode Registrasi Proposal</td>
                  <td className="p-2 font-mono font-bold text-[#1B2A4A]">{assessment.id}</td>
                </tr>
                <tr className="border-b border-[#CBD5E1]">
                  <td className="p-2 font-semibold text-slate-700">Nama Usulan Teknologi</td>
                  <td className="p-2 font-bold text-slate-900">{assessment.namaTeknologi}</td>
                </tr>
                <tr className="border-b border-[#CBD5E1] bg-slate-50">
                  <td className="p-2 font-semibold text-slate-700">Badan Usaha / Konsorsium Pengusul</td>
                  <td className="p-2 text-slate-800">{assessment.pengusul}</td>
                </tr>
                <tr className="border-b border-[#CBD5E1]">
                  <td className="p-2 font-semibold text-slate-700">Wilayah Penugasan / Pemda</td>
                  <td className="p-2 text-slate-800">{assessment.daerah}, {assessment.provinsi || 'Indonesia'}</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold text-slate-700">Kapasitas Desain Terpasang</td>
                  <td className="p-2 font-semibold text-slate-800">{assessment.kapasitasHarian} Ton / Hari</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: 5 Dimensions Breakdown */}
          <div className="my-4">
            <h5 className="font-bold text-[#1B2A4A] text-xs uppercase mb-2">
              Rincian Perhitungan 5 Dimensi GVMS
            </h5>
            <table className="w-full border border-[#CBD5E1] text-center border-collapse">
              <thead className="bg-[#1B2A4A] text-white text-[11px]">
                <tr>
                  <th className="p-2 text-left">Pilar Dimensi Penilaian</th>
                  <th className="p-2">Bobot</th>
                  <th className="p-2">Skor Normalisasi</th>
                  <th className="p-2">Poin Terbobot</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 text-left font-medium">1. Biaya Siklus Hidup (LCC)</td>
                  <td className="p-2 font-bold">30%</td>
                  <td className="p-2 font-mono">{scores.raw.lcc} / 100</td>
                  <td className="p-2 font-bold font-mono text-[#1E5631]">{scores.weighted.lcc}</td>
                  <td className="p-2 text-green-700 font-semibold">Tercapai</td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="p-2 text-left font-medium">2. Kinerja Lingkungan</td>
                  <td className="p-2 font-bold">25%</td>
                  <td className="p-2 font-mono">{scores.raw.lingkungan} / 100</td>
                  <td className="p-2 font-bold font-mono text-[#1E5631]">{scores.weighted.lingkungan}</td>
                  <td className="p-2 text-green-700 font-semibold">Tercapai</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-medium">3. Kinerja Layanan Teknis</td>
                  <td className="p-2 font-bold">20%</td>
                  <td className="p-2 font-mono">{scores.raw.layanan} / 100</td>
                  <td className="p-2 font-bold font-mono text-[#1E5631]">{scores.weighted.layanan}</td>
                  <td className="p-2 text-green-700 font-semibold">Tercapai</td>
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="p-2 text-left font-medium">4. Nilai Sosial &amp; Ekonomi</td>
                  <td className="p-2 font-bold">15%</td>
                  <td className="p-2 font-mono">{scores.raw.sosialEkonomi} / 100</td>
                  <td className="p-2 font-bold font-mono text-[#1E5631]">{scores.weighted.sosialEkonomi}</td>
                  <td className="p-2 text-green-700 font-semibold">Tercapai</td>
                </tr>
                <tr>
                  <td className="p-2 text-left font-medium">5. Kesiapan Teknologi (TRL)</td>
                  <td className="p-2 font-bold">10%</td>
                  <td className="p-2 font-mono">{scores.raw.kesiapanTeknologi} / 100</td>
                  <td className="p-2 font-bold font-mono text-[#1E5631]">{scores.weighted.kesiapanTeknologi}</td>
                  <td className="p-2 text-green-700 font-semibold">Tercapai</td>
                </tr>
                <tr className="bg-[#Eff4FF] font-bold text-slate-900 border-t-2 border-[#1B2A4A]">
                  <td className="p-2.5 text-left uppercase text-[#1B2A4A]">Total Skor GVMS Terakumulasi</td>
                  <td className="p-2.5">100%</td>
                  <td className="p-2.5">-</td>
                  <td className="p-2.5 font-mono text-sm text-[#1E5631]">{scores.gvmsTotal}</td>
                  <td className="p-2.5 text-[#1B2A4A]">{scores.category}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conclusion Box */}
          <div className={`p-4 rounded-lg border my-4 ${scores.isApproved ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'}`}>
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase mb-1">
              <Shield className="w-4 h-4 text-[#1E5631]" />
              Kesimpulan &amp; Rekomendasi Pokja
            </div>
            <p className="text-slate-800 text-[11px] leading-relaxed">
              Berdasarkan hasil kalkulasi algoritma GVMS sesuai Keputusan Kepala LKPP Nomor 12/2024, proposal ini memperoleh skor agregat <strong>{scores.gvmsTotal}</strong> dari skala 100, yaitu {scores.deltaAmbang >= 0 ? `${scores.deltaAmbang} poin di atas` : `${Math.abs(scores.deltaAmbang)} poin di bawah`} ambang batas kelayakan minimal (75.0).
            </p>
            <div className="mt-2 font-semibold text-slate-900">
              Rekomendasi Pokja: <span className={scores.isApproved ? 'text-[#1E5631]' : 'text-amber-800'}>
                {scores.isApproved 
                  ? 'DISETUJUI untuk penerbitan Sertifikat Kelayakan Pengadaan Hijau dan kelanjutan proses penandatanganan PKS / SPSE.' 
                  : 'DITUNDA untuk perbaikan parameter tekno-ekonomis dalam jangka waktu 14 hari kalender.'}
              </span>
            </div>
          </div>

          {/* Committee Signatures */}
          <div className="mt-8 pt-4 border-t border-[#CBD5E1] grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[10px] text-slate-500">Ketua Pokja Pemilihan LKPP</div>
              <div className="h-14 flex items-end justify-center font-bold text-slate-800 underline">
                Dr. Ir. Hendra Gunawan, M.Env
              </div>
              <div className="text-[9px] text-slate-400">NIP. 19740812 199903 1 002</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500">Tim Teknis KLHK Ditjen PSLB3</div>
              <div className="h-14 flex items-end justify-center font-bold text-slate-800 underline">
                Siti Nurhaliza, S.T., M.Sc.
              </div>
              <div className="text-[9px] text-slate-400">NIP. 19820514 200604 2 001</div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500">Pejabat Pembuat Komitmen (PPK)</div>
              <div className="h-14 flex items-end justify-center font-bold text-slate-800 underline">
                Bambang Suprayitno, M.Si
              </div>
              <div className="text-[9px] text-slate-400">NIP. 19790321 200212 1 004</div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-50 p-4 border-t border-[#CBD5E1] flex justify-end space-x-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-[#CBD5E1] text-[#45464e] hover:bg-slate-100 rounded text-xs font-semibold"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#1B2A4A] hover:bg-[#253961] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
