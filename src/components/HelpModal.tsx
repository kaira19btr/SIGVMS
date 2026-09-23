import React from 'react';
import { X, HelpCircle, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <HelpCircle className="w-5 h-5 text-[#b5f1bf]" />
            <div>
              <h3 className="text-sm font-bold">Pusat Bantuan &amp; Glosarium GVMS</h3>
              <p className="text-xs text-slate-300">Penjelasan parameter dan panduan Pokja Pengadaan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-[#0b1c30]">
          <div>
            <h4 className="font-bold text-[#1B2A4A] text-sm mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1E5631]" />
              Glosarium Parameter Penilaian
            </h4>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-slate-50 border border-[#E2E8F0] rounded">
                <span className="font-bold text-[#1B2A4A]">CAPEX Awal (Rp):</span> Total investasi modal untuk pembangunan fasilitas pengolahan, pengadaan mesin, instalasi cerobong dan instrumentasi MRV.
              </div>
              <div className="p-2.5 bg-slate-50 border border-[#E2E8F0] rounded">
                <span className="font-bold text-[#1B2A4A]">OPEX Tahunan (Rp):</span> Biaya operasional dan pemeliharaan per tahun, termasuk listrik, bahan kimia, gaji operator, dan penggantian spare part.
              </div>
              <div className="p-2.5 bg-slate-50 border border-[#E2E8F0] rounded">
                <span className="font-bold text-[#1B2A4A]">Penghindaran Metana (%):</span> Persentase gas metana (CH4) yang tidak terbentuk di TPA karena sampah organik diolah secara termal atau biologis (faktor GWP metana = 28x CO2).
              </div>
              <div className="p-2.5 bg-slate-50 border border-[#E2E8F0] rounded">
                <span className="font-bold text-[#1B2A4A]">Residu Dibuang ke TPA (%):</span> Rasio fly ash / bottom ash / residu padat yang tetap harus dibuang ke TPA setelah proses pengolahan selesai (ditargetkan ≤ 10%).
              </div>
              <div className="p-2.5 bg-slate-50 border border-[#E2E8F0] rounded">
                <span className="font-bold text-[#1B2A4A]">Tingkat Kematangan Teknologi (TRL):</span>
                <ul className="list-disc list-inside mt-1 text-[#64748B] space-y-0.5">
                  <li><span className="font-medium text-slate-800">TRL 4-6 (Pilot):</span> Pengujian skala laboratorium atau fasilitas percontohan terbatas.</li>
                  <li><span className="font-medium text-slate-800">TRL 7-8 (Komersial):</span> Beroperasi komersial di kota/daerah lain dengan catatan rekam jejak minimum 1 tahun.</li>
                  <li><span className="font-medium text-slate-800">TRL 9 (Registry Nasional LKPP):</span> Telah terverifikasi katalog elektronik pengadaan publik nasional.</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#1B2A4A] text-sm mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E5631]" />
              Kriteria Kelayakan Pokja
            </h4>
            <div className="p-3 bg-[#F7F5F0] border border-[#E2E8F0] rounded text-[11px] leading-relaxed">
              Proposal yang memperoleh skor <strong>≥ 75.0</strong> memenuhi syarat untuk diteruskan ke tahap negosiasi teknis dan rancangan kontrak Kerjasama Pemerintah dengan Badan Usaha (KPBU) sesuai Surat Edaran LKPP No. 12/2024.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1B2A4A] hover:bg-[#253961] text-white rounded text-xs font-semibold"
          >
            Tutup Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};
