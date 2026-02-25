import { useState, useEffect } from 'react'
import { Personel } from '../../personel_terfi/models/personel-terfi-types'

export const useProfileSettings = () => {
  const [username, setUsername] = useState('')
  const [kaymakam, setKaymakam] = useState('')
  const [profileImage, setProfileImage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [nameSurname, setNameSurname] = useState<string>('')
  const [personeller, setPersoneller] = useState<Personel[]>([])

  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

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
        setPersoneller(data || [])
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

  useEffect(() => {
    ayarlariGetir()
    personelleriGetir()
  }, [])

  return {
    username,
    setUsername,
    kaymakam,
    setKaymakam,
    profileImage,
    setProfileImage,
    email,
    setEmail,
    nameSurname,
    setNameSurname,
    personeller,
    bildirim,
    yukleniyor,
    saveProfileSettings,
    kaydet,
    kaymakamKaydet,
    personelSil
  }
}
