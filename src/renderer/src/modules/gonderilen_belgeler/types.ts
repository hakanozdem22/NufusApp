export interface GonderilenBelge {
  id?: string
  durum: 'geldi' | 'bekliyor'
  tarih: string
  evrak_no: string
  belge_turu: string
  gonderilen_yer: string
  aciklama?: string
}
