import { useState, useEffect } from 'react'

export const useArsivSettings = () => {
  const [arsivKlasorleri, setArsivKlasorleri] = useState<any[]>([])
  const [arsivDusunceler, setArsivDusunceler] = useState<any[]>([])
  const [imhaKomisyonu, setImhaKomisyonu] = useState<
    { id: any; ad_soyad: string; unvan: string; gorev: 'BASKAN' | 'UYE' | 'UYE1' | 'UYE2' }[]
  >([])
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const klasorListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getArsivTanimlar()
        setArsivKlasorleri(data || [])
      }
    } catch (e) {
      console.error('VM: klasorListele error', e)
    }
  }

  const klasorEkle = async (ad: string, sure: string, kod: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.addArsivTanim({ ad, saklama_suresi: sure, dosyalama_kodu: kod })
        mesajGoster('Klasör tanımı eklendi.')
        klasorListele()
      }
    } catch {
      mesajGoster('Klasör eklenirken hata oluştu.', 'hata')
    }
  }

  const klasorGuncelle = async (id: number | string, ad: string, sure: string, kod: string) => {
    try {
      if (window.api) {
        await window.api.updateArsivTanim({ id, ad, saklama_suresi: sure, dosyalama_kodu: kod })
        mesajGoster('Klasör tanımı güncellendi.')
        klasorListele()
      }
    } catch {
      mesajGoster('Güncelleme hatası.', 'hata')
    }
  }

  const klasorSil = async (id: number | string) => {
    try {
      if (window.api) {
        await window.api.deleteArsivTanim(id)
        mesajGoster('Klasör tanımı silindi.')
        klasorListele()
      }
    } catch {
      mesajGoster('Silme hatası.', 'hata')
    }
  }

  const dusunceListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getArsivDusunceTanimlari()
        setArsivDusunceler(data || [])
      }
    } catch (e) {
      console.error('VM: dusunceListele error', e)
    }
  }

  const dusunceEkle = async (aciklama: string) => {
    if (!aciklama) return
    try {
      if (window.api) {
        await window.api.addArsivDusunceTanim(aciklama)
        mesajGoster('Düşünce eklendi.')
        dusunceListele()
      }
    } catch {
      mesajGoster('Ekleme hatası.', 'hata')
    }
  }

  const dusunceSil = async (id: string) => {
    try {
      if (window.api) {
        await window.api.deleteArsivDusunceTanim(id)
        mesajGoster('Düşünce silindi.')
        dusunceListele()
      }
    } catch {
      mesajGoster('Silme hatası.', 'hata')
    }
  }

  const imhaKomisyonuListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getArsivImhaKomisyonu()
        if (data && Array.isArray(data)) {
          const formatted = data.map((d: any) => ({ ...d, gorev: d.gorev || 'UYE' }))
          setImhaKomisyonu(formatted)
        } else {
          setImhaKomisyonu([])
        }
      }
    } catch {
      // sessiz
    }
  }

  const imhaKomisyonuEkle = async (ad: string, unvan: string, gorev: 'BASKAN' | 'UYE') => {
    if (!ad) return
    if (gorev === 'BASKAN') {
      const baskanVar = imhaKomisyonu.some((u) => u.gorev === 'BASKAN')
      if (baskanVar) {
        mesajGoster('Komisyonda sadece 1 adet Başkan olabilir.', 'hata')
        return
      }
    }
    try {
      if (window.api) {
        await window.api.addArsivImhaKomisyonu({ ad_soyad: ad, unvan, gorev })
        mesajGoster('Komisyon üyesi eklendi.')
        imhaKomisyonuListele()
      }
    } catch {
      mesajGoster('Üye eklenirken hata oluştu.', 'hata')
    }
  }

  const imhaKomisyonuSil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteArsivImhaKomisyonu(id)
        mesajGoster('Komisyon üyesi silindi.')
        imhaKomisyonuListele()
      }
    } catch {
      mesajGoster('Silme işlemi başarısız.', 'hata')
    }
  }

  const imhaKomisyonuGuncelle = async (
    id: number | string,
    yeniGorev: 'BASKAN' | 'UYE' | 'UYE1' | 'UYE2'
  ) => {
    try {
      if (window.api) {
        // Eğer yeni görev özel bir rol ise (BAŞKAN, UYE1, UYE2), mevcut rol sahibini ÜYE yap
        if (yeniGorev !== 'UYE') {
          const mevcutRolSahibi = imhaKomisyonu.find((u) => u.gorev === yeniGorev)
          if (mevcutRolSahibi && mevcutRolSahibi.id !== id) {
            await window.api.updateArsivImhaKomisyonu({ id: mevcutRolSahibi.id, gorev: 'UYE' })
          }
        }

        // Seçilen kişiyi güncelle
        await window.api.updateArsivImhaKomisyonu({ id, gorev: yeniGorev })

        let mesaj = 'Üye görevi güncellendi.'
        if (yeniGorev === 'BASKAN') mesaj = 'Komisyon Başkanı güncellendi.'
        else if (yeniGorev === 'UYE1') mesaj = '1. Üye güncellendi.'
        else if (yeniGorev === 'UYE2') mesaj = '2. Üye güncellendi.'

        mesajGoster(mesaj)
        imhaKomisyonuListele()
      }
    } catch {
      mesajGoster('Güncelleme hatası.', 'hata')
    }
  }

  const syncArsivData = async () => {
    setYukleniyor(true)
    try {
      if (window.api) {
        const res = await window.api.syncArsivDefinitions()
        mesajGoster(
          `Senkronizasyon tamamlandı. ${res.klasorCount} klasör, ${res.dusunceCount} düşünce eklendi.`
        )
        klasorListele()
        dusunceListele()
      }
    } catch (e: any) {
      mesajGoster(`Senkronizasyon hatası: ${e.message || e}`, 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  useEffect(() => {
    klasorListele()
    dusunceListele()
    imhaKomisyonuListele()
  }, [])

  return {
    arsivKlasorleri,
    klasorEkle,
    klasorGuncelle,
    klasorSil,
    arsivDusunceler,
    dusunceEkle,
    dusunceSil,
    imhaKomisyonu,
    imhaKomisyonuEkle,
    imhaKomisyonuSil,
    imhaKomisyonuGuncelle,
    syncArsivData,
    bildirim,
    yukleniyor
  }
}
