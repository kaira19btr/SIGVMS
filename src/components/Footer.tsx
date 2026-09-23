import React from 'react';
import { ShieldCheck, ExternalLink, Building2, Trees, Award } from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';

interface FooterProps {
  onOpenGuide?: () => void;
  onOpenHelp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuide, onOpenHelp }) => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#061D12] via-[#082618] to-[#031109] text-[#F0FDF4] py-12 px-4 md:px-10 border-t border-emerald-800/60 mt-auto shadow-inner">
      <div className="max-w-[1440px] mx-auto flex flex-col justify-between space-y-8">
        {/* Top Grid of Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-900/60">
          
          {/* Col 1: Brand & Ministry Identification */}
          <div className="space-y-3 md:col-span-1">
            <OfficialLogo size="md" variant="light" showSubtitle={true} />
            <p className="text-xs text-emerald-200/80 leading-relaxed pt-1">
              Platform Penilaian Green Value-for-Money Pengadaan Teknologi Pengolahan Sampah Ramah Lingkungan di Indonesia.
            </p>
            <div className="text-[11px] text-emerald-400/90 font-medium">
              Direktorat Pengembangan Strategi dan Kebijakan Pengadaan Khusus LKPP &bull; Ditjen PSLB3 KLHK
            </div>
          </div>

          {/* Col 2: Regulatory & Legal Links */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Regulasi &amp; Kebijakan</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-200/90">
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-[#FACC15] transition-colors duration-150 flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>Kerangka Regulasi GVMS LKPP No. 12/2024</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-[#FACC15] transition-colors duration-150 flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>Standar Baku Mutu Permen LHK 70/2016</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-[#FACC15] transition-colors duration-150 flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>Pedoman KPBU Perpres No. 38/2015</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-[#FACC15] transition-colors duration-150 flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>Kebijakan Pengadaan Hijau Perpres 12/2021</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Evaluator Support */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Bantuan &amp; Evaluator</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-200/90">
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-[#FACC15] transition-colors duration-150 text-left cursor-pointer"
                >
                  Panduan Verifikasi Vendor &amp; Rekam Jejak
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelp}
                  className="hover:text-[#FACC15] transition-colors duration-150 text-left cursor-pointer"
                >
                  Pusat Bantuan &amp; Metodologi Skoring
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenHelp}
                  className="hover:text-[#FACC15] transition-colors duration-150 text-left cursor-pointer"
                >
                  Kalkulator Baseline Emisi Metana
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenGuide}
                  className="hover:text-[#FACC15] transition-colors duration-150 text-left cursor-pointer"
                >
                  Standar Biaya Masukan (SBM) 2025
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional Partners */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Lembaga Pengampu</span>
            </div>
            <div className="text-xs text-emerald-200/80 space-y-1.5 leading-relaxed">
              <p>1. Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)</p>
              <p>2. Kementerian Lingkungan Hidup dan Kehutanan (KLHK)</p>
              <p>3. Kementerian PPN / Bappenas</p>
              <p>4. Badan Riset dan Inovasi Nasional (BRIN)</p>
              <p>5. Badan Siber dan Sandi Negara (BSSN RI)</p>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-300/80 text-[11px]">
          <p>
            &copy; 2025–2026 Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP) bekerjasama dengan Bappenas &amp; KLHK RI.
          </p>
          <div className="flex items-center space-x-6">
            <span className="inline-flex items-center text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#FACC15] mr-1.5" />
              Kepatuhan ISO 27001 Sistem Pemerintahan Berbasis Elektronik (SPBE)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
