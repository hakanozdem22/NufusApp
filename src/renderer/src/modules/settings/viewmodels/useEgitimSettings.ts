import { useState, useEffect } from 'react'

export const useEgitimSettings = () => {
  const [egitimKonular, setEgitimKonular] = useState<
    { id: number; baslik: string; sira?: number }[]
  >([])
  const [egitimEgiticiler, setEgitimEgiticiler] = useState<
    { id: number; ad_soyad: string; unvan: string }[]
  >([])
  const [egitimPersoneller, setEgitimPersoneller] = useState<
    { id: number; ad_soyad: string; unvan: string; cinsiyet: string; grup?: string }[]
  >([])
  const [egitimDuzenleyenler, setEgitimDuzenleyenler] = useState<
    { id: number; ad_soyad: string; unvan: string }[]
  >([])
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const getEgitimData = async () => {
    try {
      if (window.api) {
        const konular = await window.api.getEgitimKonular()
        setEgitimKonular(konular || [])

        const egiticiler = await window.api.getEgitimEgiticiler()
        setEgitimEgiticiler(egiticiler || [])

        const personeller = await window.api.getEgitimPersoneller()
        setEgitimPersoneller(personeller || [])

        const duzenleyenler = await window.api.getEgitimDuzenleyenler()
        setEgitimDuzenleyenler(duzenleyenler || [])
      }
    } catch {
      // sessiz
    }
  }

  const konuEkle = async (baslik: string) => {
    if (!baslik) return
    try {
      if (window.api) {
        await window.api.addEgitimKonu(baslik)
        mesajGoster('Konu eklendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const konuSil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteEgitimKonu(id)
        mesajGoster('Konu silindi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Silinemedi.', 'hata')
    }
  }

  const konuGuncelle = async (id: number, baslik: string, sira?: number) => {
    if (!baslik) return
    try {
      if (window.api) {
        await window.api.updateEgitimKonu({ id, baslik, sira })
        mesajGoster('Konu güncellendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Güncellenemedi.', 'hata')
    }
  }

  const egiticiEkle = async (ad: string, unvan: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.addEgitimEgitici({ ad, unvan })
        mesajGoster('Eğitici eklendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const egiticiSil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteEgitimEgitici(id)
        mesajGoster('Eğitici silindi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Silinemedi.', 'hata')
    }
  }

  const egiticiGuncelle = async (id: number, ad: string, unvan: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.updateEgitimEgitici({ id, ad, unvan })
        mesajGoster('Eğitici güncellendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Güncellenemedi.', 'hata')
    }
  }

  const egitimPersonelEkle = async (ad: string, unvan: string, cinsiyet: string, grup: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.addEgitimPersonel({ ad, unvan, cinsiyet, grup })
        mesajGoster('Personel eklendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const egitimPersonelSil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteEgitimPersonel(id)
        mesajGoster('Personel silindi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Silinemedi.', 'hata')
    }
  }

  const egitimPersonelGuncelle = async (
    id: number,
    ad: string,
    unvan: string,
    cinsiyet: string,
    grup: string
  ) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.updateEgitimPersonel({ id, ad, unvan, cinsiyet, grup })
        mesajGoster('Personel güncellendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Güncellenemedi.', 'hata')
    }
  }

  const duzenleyenEkle = async (ad: string, unvan: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.addEgitimDuzenleyen({ ad, unvan })
        mesajGoster('Düzenleyen eklendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const duzenleyenSil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteEgitimDuzenleyen(id)
        mesajGoster('Düzenleyen silindi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Silinemedi.', 'hata')
    }
  }

  const duzenleyenGuncelle = async (id: number, ad: string, unvan: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.updateEgitimDuzenleyen({ id, ad, unvan })
        mesajGoster('Düzenleyen güncellendi.')
        getEgitimData()
      }
    } catch {
      mesajGoster('Güncellenemedi.', 'hata')
    }
  }

  useEffect(() => {
    getEgitimData()
  }, [])

  return {
    egitimKonular,
    konuEkle,
    konuSil,
    konuGuncelle,
    egitimEgiticiler,
    egiticiEkle,
    egiticiSil,
    egiticiGuncelle,
    egitimPersoneller,
    egitimPersonelEkle,
    egitimPersonelSil,
    egitimPersonelGuncelle,
    egitimDuzenleyenler,
    duzenleyenEkle,
    duzenleyenSil,
    duzenleyenGuncelle,
    bildirim,
    mesajGoster,
    getEgitimData
  }
}
