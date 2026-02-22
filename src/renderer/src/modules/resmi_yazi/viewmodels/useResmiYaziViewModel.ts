import { useState, useEffect } from 'react'
import { Evrak } from '../models/evrak-types'

export const useResmiYaziViewModel = () => {
  const [liste, setListe] = useState<Evrak[]>([])
  const [arama, setArama] = useState('')

  // UI Durumları
  const [modalAcik, setModalAcik] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [silinecekId, setSilinecekId] = useState<number | null>(null)

  const [formData, setFormData] = useState<Evrak>({
    tur: 'Giden Evrak',
    tarih: new Date().toLocaleDateString('tr-TR'),
    sayi: '',
    kurum: '',
    konu: '',
    dosya_yolu: '',
    durum: 'Cevap Gerekmiyor'
  })

  // Bildirim Gösterici
  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  // Kurum Listesi
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

  const verileriGetir = async () => {
    try {
      if (window.api && window.api.getEvraklar) {
        const data = await window.api.getEvraklar()
        setListe(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    verileriGetir()
    kurumListele()
  }, [])

  const dosyaSec = async () => {
    try {
      if (window.api) {
        const path = await window.api.selectFile()
        if (path) setFormData({ ...formData, dosya_yolu: path })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.kurum || !formData.konu) return mesajGoster('Kurum ve Konu zorunludur!', 'hata')

    // Kurum kontrolü ve otomatik ekleme
    const girilenKurum = formData.kurum.toUpperCase()
    const kurumMevcut = kurumListesi.find((k) => k.ad === girilenKurum)

    if (!kurumMevcut && window.api) {
      try {
        await window.api.addKurumTanim(girilenKurum)
        kurumListele() // Listeyi güncelle
      } catch (e) {
        console.error('Kurum otomatik eklenemedi', e)
      }
    }

    try {
      if (window.api) {
        if (formData.id) {
          await window.api.updateEvrak({ ...formData, kurum: girilenKurum })
          mesajGoster('Evrak güncellendi.')
        } else {
          await window.api.addEvrak({ ...formData, kurum: girilenKurum })
          mesajGoster('Yeni evrak eklendi.')
        }
        setModalAcik(false)
        verileriGetir()
      }
    } catch (e) {
      mesajGoster('İşlem hatası.', 'hata')
    }
  }

  // Silme Onayı
  const silmeIsleminiOnayla = async () => {
    if (silinecekId === null) return
    try {
      if (window.api) {
        await window.api.deleteEvrak(silinecekId)
        mesajGoster('Kayıt silindi.', 'basari')
        verileriGetir()
      }
    } catch (e) {
      mesajGoster('Silme hatası.', 'hata')
    } finally {
      setSilinecekId(null)
    }
  }

  const pdfAl = async () => {
    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.createPdfResmiYazi(liste)
        mesajGoster('PDF Oluşturuldu.', 'basari')
      }
    } catch (e) {
      mesajGoster('PDF Hatası.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  const onNew = () => {
    setFormData({
      tur: 'Giden Evrak',
      tarih: new Date().toLocaleDateString('tr-TR'),
      sayi: '',
      kurum: '',
      konu: '',
      dosya_yolu: '',
      durum: 'Cevap Gerekmiyor'
    })
    setModalAcik(true)
  }

  const onEdit = (evrak: Evrak) => {
    setFormData(evrak)
    setModalAcik(true)
  }

  const filtrelenmis = liste.filter(
    (x) =>
      x.konu.toLowerCase().includes(arama.toLowerCase()) ||
      x.kurum.toLowerCase().includes(arama.toLowerCase())
  )

  return {
    liste,
    arama,
    setArama,
    modalAcik,
    setModalAcik,
    yukleniyor,
    bildirim,
    silinecekId,
    setSilinecekId,
    formData,
    setFormData,
    filtrelenmis,
    onNew,
    onEdit,
    dosyaSec,
    kaydet,
    silmeIsleminiOnayla,
    pdfAl,
    verileriGetir,
    kurumListesi
  }
}
