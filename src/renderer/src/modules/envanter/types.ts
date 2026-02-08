export interface EnvanterMalzeme {
  id?: string
  ad: string
  marka: string
  kategori: string
  adet: number
  konum: string
  personel: string
  durum: string // "Sağlam", "Arızalı", "Hurda"
  aciklama?: string
  tarih?: string // ISO or YYYY-MM-DD
  seri_no?: string
}

export interface EnvanterKategori {
  id: string
  ad: string
}

export interface EnvanterYer {
  id: string
  yer_adi: string
}

export interface EnvanterMalzemeTanim {
  id: string
  ad: string
  kategori: string
}

export interface EnvanterMarkaTanim {
  id: string
  ad: string
  kategori: string
  malzeme_adi: string
}

export interface EnvanterPersonelTanim {
  id: string
  ad: string
}
