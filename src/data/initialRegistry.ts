import { AssessmentData } from '../types/gvms';

export const INITIAL_REGISTRY_DATA: AssessmentData[] = [
  {
    id: 'GVMS-2025-084',
    namaTeknologi: 'Refuse Derived Fuel (RDF) Modular Plant v2',
    pengusul: 'Konsorsium Waste-to-Energy Jawa Barat',
    daerah: 'Kota Cimahi',
    provinsi: 'Jawa Barat',
    spesifikasiSingkat: 'Kapasitas: 120 TPD • Nilai Kalori: ≥ 3.200 kkal/kg • Emisi CO2e Rendah',
    kategoriTeknologi: 'Waste-to-Fuel Thermal Solid',
    tanggalPenilaian: '18 Feb 2025',
    status: 'Terverifikasi',
    capex: 45_000_000_000,
    opex: 3_200_000_000,
    umurAset: 20,
    emisiGRK: 14250,
    penghindaranMetana: 84.5,
    residuTPA: 8.2,
    kapasitasHarian: 150,
    ketersediaanUptime: 92.0,
    tingkatPemulihan: 91.8,
    lapanganKerja: 42,
    skorPenerimaanMasyarakat: 4,
    tingkatKematangan: 'commercial',
  },
  {
    id: 'GVMS-2025-062',
    namaTeknologi: 'Biodrying & Komposting Skala Kawasan 80TPD',
    pengusul: 'PT Bio Lestari Mandiri Bersama',
    daerah: 'Kota Surabaya',
    provinsi: 'Jawa Timur',
    spesifikasiSingkat: 'Kapasitas: 80 TPD • Reduksi Kelembaban: 45% • Standar SNI Pupuk Organik',
    kategoriTeknologi: 'Biological & Aerobic Treatment',
    tanggalPenilaian: '04 Feb 2025',
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
  },
  {
    id: 'GVMS-2025-047',
    namaTeknologi: 'Pirolisis Gasifikasi Terdesentralisasi Banyumas',
    pengusul: 'Inovasi Energi Banyumas PT',
    daerah: 'Kab. Banyumas',
    provinsi: 'Jawa Tengah',
    spesifikasiSingkat: 'Kapasitas: 40 TPD • Output: Syngas & Biochar • Uji Baku Emisi Berjalan',
    kategoriTeknologi: 'Thermochemical Advanced Gasification',
    tanggalPenilaian: '28 Jan 2025',
    status: 'Perlu Perbaikan',
    capex: 28_000_000_000,
    opex: 2_900_000_000,
    umurAset: 15,
    emisiGRK: 16500,
    penghindaranMetana: 72.0,
    residuTPA: 18.0,
    kapasitasHarian: 60,
    ketersediaanUptime: 84.0,
    tingkatPemulihan: 70.0,
    lapanganKerja: 35,
    skorPenerimaanMasyarakat: 3,
    tingkatKematangan: 'pilot',
  },
  {
    id: 'GVMS-2025-031',
    namaTeknologi: 'Material Recovery Facility (MRF) Otomatis',
    pengusul: 'PT Bali Sirkular Presisi',
    daerah: 'Kota Denpasar',
    provinsi: 'Bali',
    spesifikasiSingkat: 'Kapasitas: 150 TPD • Sensor Optik AI-Sorting • Recovery Rate Plastik 92%',
    kategoriTeknologi: 'Mechanical Sorting & Material Circularity',
    tanggalPenilaian: '15 Jan 2025',
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
  },
  {
    id: 'GVMS-2025-015',
    namaTeknologi: 'Insinerasi Termal Konvensional Tanpa Gas Clean',
    pengusul: 'PT Multi Wahana Perkasa',
    daerah: 'Kota Tangerang',
    provinsi: 'Banten',
    spesifikasiSingkat: 'Kapasitas: 60 TPD • Flue Gas Non-Compliance • Risiko Dioksin Tinggi',
    kategoriTeknologi: 'Direct Thermal Combustion',
    tanggalPenilaian: '10 Jan 2025',
    status: 'Ditolak',
    capex: 65_000_000_000,
    opex: 5_500_000_000,
    umurAset: 15,
    emisiGRK: 32000,
    penghindaranMetana: 50.0,
    residuTPA: 28.0,
    kapasitasHarian: 60,
    ketersediaanUptime: 75.0,
    tingkatPemulihan: 45.0,
    lapanganKerja: 24,
    skorPenerimaanMasyarakat: 2,
    tingkatKematangan: 'pilot',
  },
];

export const DEFAULT_FORM_STATE: AssessmentData = {
  id: 'PROP-2025-WTE-008',
  namaTeknologi: 'Fasilitas RDF & Recovery Material Kota Cimahi',
  pengusul: 'Konsorsium Waste-to-Energy Jawa Barat',
  daerah: 'Kota Cimahi',
  provinsi: 'Jawa Barat',
  spesifikasiSingkat: 'Kapasitas: 150 Ton/hari • Reduksi Emisi 68% • Recovery 91,8%',
  kategoriTeknologi: 'Waste-to-Fuel Thermal Solid',
  tanggalPenilaian: '23 September 2026',
  status: 'Dalam Proses',
  
  // Dimensi 1
  capex: 385_000_000_000,
  opex: 28_400_000_000,
  umurAset: 20,

  // Dimensi 2
  emisiGRK: 14250,
  penghindaranMetana: 84.5,
  residuTPA: 8.2,

  // Dimensi 3
  kapasitasHarian: 750,
  ketersediaanUptime: 92.0,
  tingkatPemulihan: 91.8,

  // Dimensi 4
  lapanganKerja: 142,
  skorPenerimaanMasyarakat: 4,

  // Dimensi 5
  tingkatKematangan: 'commercial',
};

const STORAGE_KEY = 'lkpp_gvms_registry_v1';

export function getStoredRegistry(): AssessmentData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed reading from localStorage:', err);
  }
  return INITIAL_REGISTRY_DATA;
}

export function saveStoredRegistry(data: AssessmentData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed writing to localStorage:', err);
  }
}
