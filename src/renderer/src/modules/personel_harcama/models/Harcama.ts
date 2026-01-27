export interface Harcama {
  id: number // Soru işareti KALKTI
  baslik: string
  tutar: number
  kategori: string
  tarih: string
  aciklama?: string
  tur: 'GELIR' | 'GIDER'
}
