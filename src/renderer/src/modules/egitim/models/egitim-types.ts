export interface EgitimKonu {
  id: number
  baslik: string
}

export interface EgitimPlan {
  id: number
  adi: string
  olusturma_tarihi: string
  tarih: string
  dersler: any[]
}

export interface EgitimDers {
  konu: string
  egitici: string
  tarih: string
  saat: string
  zorunlu?: boolean
}

export interface PersonelBasic {
  id: number
  ad_soyad: string
  unvan?: string
}
