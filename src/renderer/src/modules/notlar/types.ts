export interface Not {
  id?: string
  baslik?: string
  icerik: string
  renk: string // 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange'
  tarih?: string // ISO date string
  guncelleme_tarihi?: string
}
