import { useState, useEffect } from 'react'
import { Personel } from '../../personel_terfi/models/personel-terfi-types'

export const useSettingsViewModel = () => {
  const [username, setUsername] = useState('')
  const [kaymakam, setKaymakam] = useState('')
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [personeller, setPersoneller] = useState<Personel[]>([])

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  /* PROFİL AYARLARI */
  /* PROFİL AYARLARI */
  const [profileImage, setProfileImage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [nameSurname, setNameSurname] = useState<string>('')

  const ayarlariGetir = async () => {
    try {
      if (window.api) {
        const u = await window.api.getSetting('username')
        if (u) setUsername(u)
        const k = await window.api.getSetting('kaymakam')
        if (k) setKaymakam(k)

        // Profil Ayarları
        const img = await window.api.getSetting('profile_image')
        if (img) setProfileImage(img)
        const mail = await window.api.getSetting('recovery_email')
        if (mail) setEmail(mail)
        const ns = await window.api.getSetting('name_surname')
        if (ns) setNameSurname(ns)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const personelleriGetir = async (): Promise<void> => {
    try {
      if (window.api) {
        const data = await window.api.getPersoneller()
        setPersoneller(data)
      }
    } catch {
      // sessiz hata
    }
  }

  const saveProfileSettings = async () => {
    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.setSetting('profile_image', profileImage)
        await window.api.setSetting('recovery_email', email)
        await window.api.setSetting('name_surname', nameSurname)
        mesajGoster('Profil ayarları kaydedildi.')

        // Event trigger to update other components immediately if needed
        window.dispatchEvent(new Event('profile-updated'))
      }
    } catch {
      mesajGoster('Hata oluştu.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  const kaydet = async (): Promise<void> => {
    if (!username) {
      mesajGoster('Kullanıcı adı boş olamaz.', 'hata')
      return
    }

    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.setSetting('username', username)
        await window.api.setSetting('kaymakam', kaymakam)
        mesajGoster('Ayarlar başarıyla kaydedildi.')
      }
    } catch {
      mesajGoster('Kayıt sırasında hata oluştu.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  const kaymakamKaydet = async (): Promise<void> => {
    if (!kaymakam) {
      mesajGoster('Kaymakam adı boş olamaz.', 'hata')
      return
    }

    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.setSetting('kaymakam', kaymakam)
        mesajGoster('Kaymakam bilgisi kaydedildi.')
      }
    } catch {
      mesajGoster('Kayıt sırasında hata oluştu.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  const personelSil = async (id: number): Promise<void> => {
    if (!confirm('Bu personeli silmek istediğinize emin misiniz?')) return
    try {
      if (window.api) {
        await window.api.deletePersonel(id)
        mesajGoster('Personel silindi.')
        personelleriGetir()
      }
    } catch {
      mesajGoster('Silme işlemi başarısız.', 'hata')
    }
  }

  /* ARŞİV KLASÖR YÖNETİMİ */
  const [arsivKlasorleri, setArsivKlasorleri] = useState<{ id: number; ad: string }[]>([])

  const klasorListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getArsivTanimlar()
        setArsivKlasorleri(data)
      }
    } catch {
      // sessiz
    }
  }

  const klasorEkle = async (ad: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.addArsivTanim(ad)
        mesajGoster('Klasör tanımı eklendi.')
        klasorListele()
      }
    } catch {
      mesajGoster('Klasör eklenirken hata oluştu.', 'hata')
    }
  }

  const klasorSil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteArsivTanim(id)
        mesajGoster('Klasör tanımı silindi.')
        klasorListele()
      }
    } catch {
      mesajGoster('Silme işlemi başarısız.', 'hata')
    }
  }

  /* ARŞİV İMHA KOMİSYONU */
  const [imhaKomisyonu, setImhaKomisyonu] = useState<
    { id: number; ad_soyad: string; unvan: string; gorev: 'BASKAN' | 'UYE' }[]
  >([])

  const imhaKomisyonuListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getArsivImhaKomisyonu()
        // Varsayılan olarak UYE ata (eski kayıtlar için)
        const formatted = data.map((d) => ({ ...d, gorev: d.gorev || 'UYE' }))
        setImhaKomisyonu(formatted)
      }
    } catch {
      // sessiz
    }
  }

  const imhaKomisyonuEkle = async (ad: string, unvan: string, gorev: 'BASKAN' | 'UYE') => {
    if (!ad) return

    // Başkan kontrolü
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

  /* KURUM TANIMLARI */
  const [kurumListesi, setKurumListesi] = useState<{ id: number; ad: string }[]>([])

  const kurumListele = async () => {
    try {
      if (window.api) {
        const data = await window.api.getKurumTanimlari()
        setKurumListesi(data)
      }
    } catch {
      // sessiz
    }
  }

  const kurumEkle = async (ad: string) => {
    if (!ad) return
    try {
      if (window.api) {
        await window.api.addKurumTanim(ad)
        mesajGoster('Kurum eklendi.')
        kurumListele()
      }
    } catch {
      mesajGoster('Kurum eklenirken hata oluştu.', 'hata')
    }
  }

  const kurumSil = async (id: number) => {
    // UI tarafından onay alınmalı
    try {
      if (window.api) {
        await window.api.deleteKurumTanim(id)
        mesajGoster('Kurum silindi.')
        kurumListele()
      }
    } catch {
      mesajGoster('Silme işlemi başarısız.', 'hata')
    }
  }

  /* EĞİTİM AYARLARI */
  const [egitimKonular, setEgitimKonular] = useState<{ id: number; baslik: string; sira?: number }[]>([])
  const [egitimEgiticiler, setEgitimEgiticiler] = useState<
    { id: number; ad_soyad: string; unvan: string }[]
  >([])
  const [egitimPersoneller, setEgitimPersoneller] = useState<
    { id: number; ad_soyad: string; unvan: string; cinsiyet: string; grup?: string }[]
  >([])
  const [egitimDuzenleyenler, setEgitimDuzenleyenler] = useState<
    { id: number; ad_soyad: string; unvan: string }[]
  >([])

  const getEgitimData = async () => {
    try {
      if (window.api) {
        const konular = await window.api.getEgitimKonular()
        setEgitimKonular(konular)

        const egiticiler = await window.api.getEgitimEgiticiler()
        setEgitimEgiticiler(egiticiler)

        const personeller = await window.api.getEgitimPersoneller()
        setEgitimPersoneller(personeller)

        const duzenleyenler = await window.api.getEgitimDuzenleyenler()
        setEgitimDuzenleyenler(duzenleyenler)
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
    // UI'dan onay alınmalı
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
    // UI'dan onay alınmalı
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
    // UI'dan onay alınmalı
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
    // UI'dan onay alınmalı
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
    ayarlariGetir()
    personelleriGetir()
    klasorListele()
    imhaKomisyonuListele()
    kurumListele()
    getEgitimData()
  }, [])

  return {
    username,
    setUsername,
    kaymakam,
    setKaymakam,
    bildirim,
    yukleniyor,
    kaydet,
    kaymakamKaydet,
    personeller,
    personelSil,
    // Arşiv
    arsivKlasorleri,
    klasorEkle,
    klasorSil,
    // Arşiv İmha Komisyonu
    imhaKomisyonu,
    imhaKomisyonuEkle,
    imhaKomisyonuSil,
    // Kurum
    kurumListesi,
    kurumEkle,
    kurumSil,

    // EĞİTİM AYARLARI
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
    getEgitimData,
    mesajGoster,

    // Profil
    profileImage,
    setProfileImage,
    email,
    setEmail,
    nameSurname,
    setNameSurname,
    saveProfileSettings
  }
}
