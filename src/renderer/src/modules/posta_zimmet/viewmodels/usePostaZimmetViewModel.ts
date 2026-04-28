import { useState, useEffect, createElement } from 'react'
import { pdf } from '@react-pdf/renderer'
import { ZimmetPdfDocument } from '../components/ZimmetPdfDocument'
import { ZimmetArsivPdfDocument } from '../components/ZimmetArsivPdfDocument'
import { ZimmetKayit } from '../models/zimmet-types'

export const usePostaZimmetViewModel = () => {
  const [liste, setListe] = useState<ZimmetKayit[]>([])
  const [arsivListe, setArsivListe] = useState<ZimmetKayit[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)

  // Form State
  const [evrakNo, setEvrakNo] = useState('')
  const [barkod, setBarkod] = useState('')
  const [yer, setYer] = useState('')
  const [ucret, setUcret] = useState('210')

  const [arama, setArama] = useState('')
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)

  // Modallar
  const [silinecekId, setSilinecekId] = useState<number | null>(null)
  const [listedenSilinecekTempId, setListedenSilinecekTempId] = useState<number | null>(null)
  const [kayitOnayModalAcik, setKayitOnayModalAcik] = useState(false)

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

  const arsivGetir = async (query = '') => {
    try {
      let veri
      if (query && window.api.searchZimmet) {
        veri = await window.api.searchZimmet(query)
      } else if (window.api.getZimmet) {
        veri = await window.api.getZimmet(100)
      }
      if (veri) setArsivListe(veri)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    arsivGetir()
    kurumListele()
  }, [])

  const listeyeEkle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!yer) return mesajGoster('Gideceği yer zorunludur!', 'hata')

    // Kurum kontrolü ve otomatik ekleme
    const girilenYer = yer.toUpperCase()
    const kurumMevcut = kurumListesi.find((k) => k.ad === girilenYer)

    if (!kurumMevcut && window.api) {
      try {
        await window.api.addKurumTanim(girilenYer)
        kurumListele() // Listeyi güncelle
      } catch (e) {
        console.error('Kurum otomatik eklenemedi', e)
      }
    }

    const yeniKayit: ZimmetKayit = {
      tempId: Date.now(),
      tarih: new Date().toLocaleDateString('tr-TR'),
      barkod: barkod.toUpperCase() || '-',
      evrak_no: evrakNo || '-',
      yer: girilenYer,
      ucret: parseFloat(ucret) || 0
    }

    setListe([...liste, yeniKayit])
    setEvrakNo('')
    setBarkod('')
    setYer('')
  }

  const geciciListedenCikar = () => {
    if (listedenSilinecekTempId) {
      setListe(liste.filter((item) => item.tempId !== listedenSilinecekTempId))
      setListedenSilinecekTempId(null)
    }
  }

  const kaydetButonunaBasildi = () => {
    if (liste.length === 0) return mesajGoster('Yazdırılacak liste boş!', 'hata')
    setKayitOnayModalAcik(true)
  }

  const kaydetVeYazdir = async () => {
    setKayitOnayModalAcik(false)
    setYukleniyor(true)
    try {
      // 1. ADIM: Önce buluta kaydet (Firebase Firestore)
      const bugunTam = new Date().toLocaleString('tr-TR')
      const kaydedilecekListe = [...liste] // PDF için kopyasını sakla
      for (const item of liste) {
        await window.api.addZimmet({ ...item, tarih: bugunTam })
      }

      // 2. ADIM: Bulut kaydı başarılı — listeyi temizle ve arşivi güncelle
      setListe([])
      arsivGetir()

      // 3. ADIM: PDF oluşturmayı dene (başarısız olsa bile kayıt zaten bulutta)
      try {
        const doc = createElement(ZimmetPdfDocument, { liste: kaydedilecekListe }) as any
        const blob = await pdf(doc).toBlob()
        const buffer = await blob.arrayBuffer()

        if (window.api && window.api.saveZimmetPdf) {
          const res = await window.api.saveZimmetPdf(buffer)
          if (res.success) {
            mesajGoster('Buluta kaydedildi ve PDF Masaüstüne oluşturuldu.', 'basari')
          } else {
            console.error(res.error)
            mesajGoster('Buluta kaydedildi ama PDF oluşturulamadı.', 'basari')
          }
        } else {
          // Fallback — tarayıcıda PDF'i yeni sekmede aç
          const url = URL.createObjectURL(blob)
          window.open(url)
          mesajGoster('Buluta kaydedildi ve PDF açıldı.', 'basari')
        }
      } catch (pdfErr) {
        console.error('PDF oluşturma hatası:', pdfErr)
        mesajGoster('Buluta kaydedildi ama PDF oluşturulamadı.', 'basari')
      }
    } catch (e) {
      console.error(e)
      mesajGoster('Buluta kaydetme sırasında hata oluştu.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  const arsivPdfOlustur = async () => {
    if (arsivListe.length === 0) return mesajGoster('Arşivde kayıt yok!', 'hata')
    try {
      mesajGoster('PDF hazırlanıyor...', 'basari')
      const doc = createElement(ZimmetArsivPdfDocument, { liste: arsivListe }) as any
      const blob = await pdf(doc).toBlob()
      const buffer = await blob.arrayBuffer()
      if (window.api && window.api.saveZimmetPdf) {
        const res = await window.api.saveZimmetPdf(buffer)
        if (res.success) {
          mesajGoster('Arşiv PDF masaüstüne kaydedildi.', 'basari')
        } else {
          mesajGoster('PDF oluşturulamadı.', 'hata')
        }
      } else {
        const url = URL.createObjectURL(blob)
        window.open(url)
        mesajGoster('PDF açıldı.', 'basari')
      }
    } catch (e) {
      console.error(e)
      mesajGoster('PDF oluşturma hatası.', 'hata')
    }
  }

  const arsivdenSil = async () => {
    if (silinecekId === null) return
    try {
      await window.api.deleteZimmet(silinecekId)
      arsivGetir(arama)
      mesajGoster('Kayıt arşivden silindi.', 'basari')
    } catch (e) {
      mesajGoster('Silme hatası.', 'hata')
    } finally {
      setSilinecekId(null)
    }
  }

  const durumDegistir = async (item: ZimmetKayit) => {
    const yeniDurum = item.durum === 'BEKLİYOR' ? 'GELDİ' : 'BEKLİYOR'
    await window.api.updateZimmetDurum(item.id!, yeniDurum)
    arsivGetir(arama)
  }

  const toplamTutar = liste.reduce((acc, curr) => acc + curr.ucret, 0)

  return {
    liste,
    arsivListe,
    yukleniyor,
    evrakNo,
    setEvrakNo,
    barkod,
    setBarkod,
    yer,
    setYer,
    ucret,
    setUcret,
    arama,
    setArama,
    bildirim,
    silinecekId,
    setSilinecekId,
    listedenSilinecekTempId,
    setListedenSilinecekTempId,
    kayitOnayModalAcik,
    setKayitOnayModalAcik,
    arsivGetir,
    listeyeEkle,
    geciciListedenCikar,
    kaydetButonunaBasildi,
    kaydetVeYazdir,
    arsivPdfOlustur,
    arsivdenSil,
    durumDegistir,
    toplamTutar,
    kurumListesi
  }
}
