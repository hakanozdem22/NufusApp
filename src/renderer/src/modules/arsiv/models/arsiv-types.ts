export interface ArsivKayit {
  id: number
  klasor_adi: string
  klasor_no: string
  tipi: string
  yili: string
  bas_no: string
  bitis_no: string
  evrak_sayisi: number
  saklama_suresi: number | string
  dosyalama_kodu: string
  aciklama: string
  konum?: string
  imha_durumu?: string
  _mergedIds?: number[]
  sira?: number
}

export interface ArsivFiltre {
  ad: string
  yili: string
  kodu: string
}

export const DUSUNCELER = [
  'Birim Arşivinde süresiz saklanır',
  'Kurum Arşivinde süresiz saklanır',
  'Taşra Birim arşivinde süresiz saklanır',
  'Birim Arşivinde imha edilir',
  'Kurum Arşivinde imha edilir',
  'Taşra Birim arşivinde imha edilir',
  'Devlet Arşivine gönderilir',
  'Örnekleri alınarak Devlet Arşivine gönderilir',
  'Ayıklama ve imha komisyonunca değerlendirilir'
]
