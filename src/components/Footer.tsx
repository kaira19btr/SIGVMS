import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenGuide?: () => void;
  onOpenHelp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuide, onOpenHelp }) => {
  return (
    <footer className="w-full bg-[#041534] text-[#f8f9ff] py-10 px-4 md:px-10 border-t border-[#1b2a4a] mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col justify-between space-y-8">
        {/* Top Grid of Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#1b2a4a]">
          {/* Col 1: Brand & Ministry Identification */}
          <div className="space-y-2 md:col-span-1">
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#1b2a4a] text-white flex items-center justify-center text-xs font-bold border border-slate-700">
                G
              </span>
              Sistem GVMS LKPP
            </div>
            <p className="text-xs text-[#8392b7] leading-relaxed">
              Platform Penilaian Green Value-for-Money Pengadaan Teknologi Pengolahan Sampah Perkotaan di Indonesia.
            </p>
            <div className="pt-2 text-[11px] text-[#8392b7]">
              Direktorat Pengembangan Strategi dan Kebijakan Pengadaan Khusus
            </div>
          </div>

          {/* Col 2: Regulatory & Legal Links */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Regulasi &amp; Kebijakan
            </div>
            <ul className="space-y-1.5 text-xs text-[#cbdbf5]">
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors duration-150 flex items-center gap-1 text-left"
                >
                  <span>Kerangka Regulasi GVMS LKPP</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors duration-150 flex items-center gap-1 text-left"
                >
                  <span>Standar Baku Emisi Permen LHK 70/2016</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors duration-150 flex items-center gap-1 text-left"
                >
                  <span>Pedoman KPBU Perpres No. 38/2015</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors duration-150 flex items-center gap-1 text-left"
                >
                  <span>Kebijakan Privasi Data Tata Kelola</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Evaluator Support */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Bantuan &amp; Evaluator
            </div>
            <ul className="space-y-1.5 text-xs text-[#cbdbf5]">
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors duration-150 text-left"
                >
                  Panduan Verifikasi Vendor &amp; Rekam Jejak
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelp}
                  className="hover:text-white transition-colors duration-150 text-left"
                >
                  Pusat Bantuan &amp; Metodologi Skoring
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelp}
                  className="hover:text-white transition-colors duration-150 text-left"
                >
                  Kalkulator Simulasi Baseline Emisi
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-white transition-colors duration-150 text-left"
                >
                  Standar Biaya Masukan (SBM) 2025
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Partners */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Lembaga Pengampu
            </div>
            <div className="text-xs text-[#cbdbf5] space-y-1.5 leading-relaxed">
              <p>1. Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)</p>
              <p>2. Kementerian Lingkungan Hidup dan Kehutanan (KLHK)</p>
              <p>3. Kementerian PPN / Bappenas</p>
              <p>4. Badan Riset dan Inovasi Nasional (BRIN)</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8392b7] text-[11px]">
          <p>
            © 2025–2026 Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP) bekerjasama dengan Bappenas &amp; KLHK RI.
          </p>
          <div className="flex items-center space-x-6">
            <span className="inline-flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#b5f1bf] mr-1.5" />
              Kepatuhan ISO 27001 Sistem Pemerintahan Berbasis Elektronik (SPBE)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
