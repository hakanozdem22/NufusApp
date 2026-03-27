export interface TakvimEtkinlik {
  id?: number | string
  baslik: string
  tarih: string
  dosya_yolu?: string
  tur?: 'GOREV' | 'RESMI' | 'DINI'
}

export const AYLAR = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık'
]
export const GUNLER = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
export const YILLAR = Array.from({ length: 31 }, (_, i) => 2020 + i)

export const DINI_BAYRAMLAR = [
  // 2025
  { date: '2025-03-29', title: 'Ramazan Bayramı Arifesi' },
  { date: '2025-03-30', title: 'Ramazan Bayramı 1. Gün' },
  { date: '2025-03-31', title: 'Ramazan Bayramı 2. Gün' },
  { date: '2025-04-01', title: 'Ramazan Bayramı 3. Gün' },
  { date: '2025-06-05', title: 'Kurban Bayramı Arifesi' },
  { date: '2025-06-06', title: 'Kurban Bayramı 1. Gün' },
  { date: '2025-06-07', title: 'Kurban Bayramı 2. Gün' },
  { date: '2025-06-08', title: 'Kurban Bayramı 3. Gün' },
  { date: '2025-06-09', title: 'Kurban Bayramı 4. Gün' },
  // 2026
  { date: '2026-03-19', title: 'Ramazan Bayramı Arifesi' },
  { date: '2026-03-20', title: 'Ramazan Bayramı 1. Gün' },
  { date: '2026-03-21', title: 'Ramazan Bayramı 2. Gün' },
  { date: '2026-03-22', title: 'Ramazan Bayramı 3. Gün' },
  { date: '2026-05-26', title: 'Kurban Bayramı Arifesi' },
  { date: '2026-05-27', title: 'Kurban Bayramı 1. Gün' },
  { date: '2026-05-28', title: 'Kurban Bayramı 2. Gün' },
  { date: '2026-05-29', title: 'Kurban Bayramı 3. Gün' },
  { date: '2026-05-30', title: 'Kurban Bayramı 4. Gün' },
  // 2027-2030 (Kısaltıldı)
  { date: '2027-03-09', title: 'Ramazan Bayramı 1. Gün' },
  { date: '2027-05-16', title: 'Kurban Bayramı 1. Gün' },
  { date: '2028-02-26', title: 'Ramazan Bayramı 1. Gün' },
  { date: '2028-05-05', title: 'Kurban Bayramı 1. Gün' },
  { date: '2029-02-14', title: 'Ramazan Bayramı 1. Gün' },
  { date: '2029-04-24', title: 'Kurban Bayramı 1. Gün' },
  { date: '2030-02-04', title: 'Ramazan Bayramı 1. Gün' },
  { date: '2030-04-13', title: 'Kurban Bayramı 1. Gün' }
]
