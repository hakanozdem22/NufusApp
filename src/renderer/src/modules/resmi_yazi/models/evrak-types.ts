export interface Evrak {
  id?: number
  tur: 'Gelen Evrak' | 'Giden Evrak'
  tarih: string
  sayi: string
  kurum: string
  konu: string
  dosya_yolu: string
  durum: 'Cevap Gerekmiyor' | 'Cevap Bekleniyor' | 'Cevaplandı'
}
