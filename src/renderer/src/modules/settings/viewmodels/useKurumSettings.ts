import { useState, useEffect } from 'react'

export const useKurumSettings = () => {
  const [kurumListesi, setKurumListesi] = useState<{ id: number; ad: string }[]>([])
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const kurumListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getKurumTanimlari()
        setKurumListesi(data || [])
      }
    } catch {
      // sessiz
    }
  }

  const kurumEkle = async (ad: string) => {
    if (!ad) return
    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.addKurumTanim(ad)
        mesajGoster('Kurum eklendi.')
        kurumListele()
      }
    } catch {
      mesajGoster('Kurum eklenirken hata oluştu.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  const kurumSil = async (id: number) => {
    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.deleteKurumTanim(id)
        mesajGoster('Kurum silindi.')
        kurumListele()
      }
    } catch {
      mesajGoster('Silme işlemi başarısız.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    kurumListele()
  }, [])

  return {
    kurumListesi,
    kurumEkle,
    kurumSil,
    bildirim,
    yukleniyor
  }
}
