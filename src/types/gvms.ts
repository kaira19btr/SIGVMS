export interface AssessmentData {
  id: string;
  namaTeknologi: string;
  pengusul: string;
  daerah: string;
  provinsi?: string;
  spesifikasiSingkat?: string;
  kategoriTeknologi?: string;
  tanggalPenilaian: string;
  status: 'Terverifikasi' | 'Perlu Perbaikan' | 'Ditolak' | 'Dalam Proses';
  
  // Dimensi 1: Biaya Siklus Hidup (30%)
  capex: number; // in Rupiah
  opex: number; // in Rupiah per year
  umurAset: number; // in years

  // Dimensi 2: Kinerja Lingkungan (25%)
  emisiGRK: number; // ton CO2e/th
  penghindaranMetana: number; // %
  residuTPA: number; // %

  // Dimensi 3: Kinerja Layanan (20%)
  kapasitasHarian: number; // ton/hari
  ketersediaanUptime: number; // %
  tingkatPemulihan: number; // %

  // Dimensi 4: Nilai Sosial & Ekonomi (15%)
  lapanganKerja: number; // orang
  skorPenerimaanMasyarakat: 1 | 2 | 3 | 4 | 5;

  // Dimensi 5: Kesiapan Teknologi (10%)
  tingkatKematangan: 'pilot' | 'commercial' | 'national_registry' | '';
}

export interface DimensionScores {
  raw: {
    lcc: number;
    lingkungan: number;
    layanan: number;
    sosialEkonomi: number;
    kesiapanTeknologi: number;
  };
  weighted: {
    lcc: number;
    lingkungan: number;
    layanan: number;
    sosialEkonomi: number;
    kesiapanTeknologi: number;
  };
  gvmsTotal: number;
  category: 'Sangat Layak (Kategori Hijau)' | 'Layak Direkomendasikan' | 'Perlu Perbaikan' | 'Tidak Direkomendasikan';
  tierLabel: string;
  deltaAmbang: number; // delta vs 75.0
  isApproved: boolean;
  keyIndicators: {
    netVfm: string;
    emisiBersihTerhindarkan: string;
    efisiensiAnggaran: string;
  };
}

export interface CustomWeights {
  lcc: number; // default 0.30
  lingkungan: number; // default 0.25
  layanan: number; // default 0.20
  sosialEkonomi: number; // default 0.15
  kesiapanTeknologi: number; // default 0.10
}

export interface UserSession {
  id: string;
  name: string;
  nip: string;
  role: string;
  agency: string;
  department: string;
  certId: string;
  loginTime: string;
}

export type PageView = 'beranda' | 'penilaian' | 'hasil' | 'registry' | 'komparasi' | 'login';
