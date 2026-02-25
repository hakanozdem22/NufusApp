import { useState, useEffect } from 'react'
import {
  ApostilUlke,
  ApostilDosya,
  ULKE_KODLARI,
  ULKE_LINKLERI,
  EKLENECEK_ULKELER_LISTESI,
  SiteLink
} from '../models/apostil-types'

const flagImages = import.meta.glob('../../../assets/flags/*.{png,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
})

export const useEApostilViewModel = () => {
  const [liste, setListe] = useState<ApostilUlke[]>([])
  const [arama, setArama] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [imgHatalari, setImgHatalari] = useState<Record<number, boolean>>({})
  const [yukleniyor, setYukleniyor] = useState(false)
  const [onayModali, setOnayModali] = useState(false)

  // FORM & DOSYALAR
  const [form, setForm] = useState<any>({
    ulke_adi: '',
    bayrak_url: '',
    site_url: [] as SiteLink[],
    aciklama: ''
  })
  const [dosyalar, setDosyalar] = useState<ApostilDosya[]>([])
  const [yeniDosya, setYeniDosya] = useState<any>({ ad: '', yol: '', tip: 'DOSYA' })

  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [silinecekId, setSilinecekId] = useState<number | null>(null)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const verileriGetir = async () => {
    try {
      if (window.api) {
        const data = await window.api.getEApostil()
        setListe(data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    verileriGetir()
  }, [])

  // --- MODAL AÇILINCA DOSYALARI ÇEK ---
  useEffect(() => {
    if (modalAcik && form.id) {
      const dosyaGetir = async () => {
        try {
          if (window.api) {
            const data = await window.api.getEApostilFiles(form.id)
            setDosyalar(data || [])
          }
        } catch (e) {
          console.log('Dosya tablosu henüz yok veya hata')
        }
      }
      dosyaGetir()
    } else {
      setDosyalar([])
    }
  }, [modalAcik, form.id])

  // --- BAYRAK BULUCU ---
  const getFlagSrc = (codeOrUrl: string) => {
    if (!codeOrUrl) return null
    if (codeOrUrl.startsWith('data:image') || codeOrUrl.startsWith('http')) return codeOrUrl
    if (codeOrUrl.length < 5) {
      const lowerCode = codeOrUrl.toLowerCase()
      const pathPng = `../../../assets/flags/${lowerCode}.png`
      const pathSvg = `../../../assets/flags/${lowerCode}.svg`
      const pathJpg = `../../../assets/flags/${lowerCode}.jpg`
      return (flagImages[pathPng] || flagImages[pathSvg] || flagImages[pathJpg] || null) as string
    }
    return null
  }

  const getFlagByName = (name: string) => {
    if (!name) return null
    const upper = name.toUpperCase().trim()
    const code = ULKE_KODLARI[upper]
    if (code) return getFlagSrc(code)
    return null
  }

  // --- TOPLU EKLEME ---
  const varsayilanlariYukle = async () => {
    setOnayModali(false)
    setYukleniyor(true)
    let eklenenSayisi = 0
    try {
      if (window.api) {
        for (const ulkeAdi of EKLENECEK_ULKELER_LISTESI) {
          const varMi = liste.some((item) => item.ulke_adi.toUpperCase() === ulkeAdi)
          if (!varMi) {
            const link = ULKE_LINKLERI[ulkeAdi] || ''
            await window.api.addEApostil({
              ulke_adi: ulkeAdi,
              bayrak_url: ULKE_KODLARI[ulkeAdi] || '',
              // Varsayılan linki nesne olarak ekle
              site_url: link
                ? JSON.stringify([{ url: link, aciklama: '' }] as SiteLink[])
                : JSON.stringify([]),
              aciklama: 'Lahey (Apostil) Sözleşmesine Taraf Ülke',
              dosya_yolu: ''
            })
            eklenenSayisi++
          }
        }
        await verileriGetir()
        mesajGoster(`${eklenenSayisi} yeni ülke eklendi.`)
      }
    } catch (e) {
      mesajGoster('Hata.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  // --- DOSYA İŞLEMLERİ ---
  const dosyaSec = async () => {
    if (window.api) {
      const path = await window.api.selectFile()
      if (path) {
        setYeniDosya({ ...yeniDosya, yol: path, tip: 'DOSYA' })
      }
    }
  }

  const dosyaEkle = async () => {
    if (!yeniDosya.ad || !yeniDosya.yol) return mesajGoster('Ad ve Dosya/Link giriniz.', 'hata')
    if (!form.id) return mesajGoster('Önce ülkeyi kaydedin.', 'hata')

    try {
      if (window.api) {
        await window.api.addEApostilFile({
          e_apostil_id: form.id,
          ad: yeniDosya.ad,
          yol: yeniDosya.yol,
          tip: yeniDosya.tip
        })
        const data = await window.api.getEApostilFiles(form.id)
        setDosyalar(data)
        setYeniDosya({ ad: '', yol: '', tip: 'DOSYA' })
        mesajGoster('Eklendi.')
      }
    } catch (e) {
      mesajGoster('Hata.', 'hata')
    }
  }

  const dosyaSil = async (id: number) => {
    if (window.api) {
      await window.api.deleteEApostilFile(id)
      const data = await window.api.getEApostilFiles(form.id)
      setDosyalar(data)
    }
  }

  const dosyaAc = (yol: string, tip: string) => {
    if (window.api) {
      if (tip === 'LINK') {
        const safeUrl = yol.startsWith('http') ? yol : `https://${yol}`
        window.api.openExternal(safeUrl)
      } else window.api.openFile(yol)
    }
  }

  const kaydet = async () => {
    if (!form.ulke_adi) return mesajGoster('Ülke adı zorunludur.', 'hata')
    try {
      if (window.api) {
        const payload = { ...form }
        if (Array.isArray(payload.site_url)) {
          // Boş olanları filtrele ve JSON string yap
          const urls = (payload.site_url as SiteLink[]).filter((u) => u.url.trim() !== '')
          payload.site_url = JSON.stringify(urls)
        }

        if (form.id) {
          await window.api.updateEApostil(payload)
          mesajGoster('Güncellendi.')
        } else {
          await window.api.addEApostil(payload)
          mesajGoster('Eklendi.')
        }

        if (form.id) {
          setImgHatalari((prev) => {
            const n = { ...prev }
            delete n[form.id]
            return n
          })
        }
        setModalAcik(false)
        verileriGetir()
      }
    } catch (e) {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const silmeIsleminiOnayla = async () => {
    if (silinecekId === null) return
    try {
      if (window.api) {
        await window.api.deleteEApostil(silinecekId)
        verileriGetir()
        mesajGoster('Silindi.')
      }
    } catch (e) {
      mesajGoster('Hata.', 'hata')
    } finally {
      setSilinecekId(null)
    }
  }

  const duzenle = (item: any) => {
    let parsedSites: SiteLink[] = []
    try {
      if (item.site_url) {
        if (item.site_url.startsWith('[')) {
          const raw = JSON.parse(item.site_url)
          // Eski format (string[]) kontrolü
          if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
            parsedSites = raw.map((r: string) => ({ url: r, aciklama: '' }))
          } else {
            parsedSites = raw
          }
        } else {
          // Tek string url gelirse
          parsedSites = [{ url: item.site_url, aciklama: '' }]
        }
      }
    } catch (e) {
      parsedSites = []
    }

    setForm({ ...item, site_url: parsedSites })
    setModalAcik(true)
  }

  const yeniEkle = () => {
    setForm({ ulke_adi: '', bayrak_url: '', site_url: [{ url: '', aciklama: '' }], aciklama: '' })
    setModalAcik(true)
  }

  const handleFlagUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (form.id)
          setImgHatalari((prev) => {
            const n = { ...prev }
            delete n[form.id]
            return n
          })
        setForm((prev: any) => ({ ...prev, bayrak_url: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const filtrelenenler = liste.filter((item) =>
    item.ulke_adi.toLowerCase().includes(arama.toLowerCase())
  )

  return {
    filtrelenenler,
    arama,
    setArama,
    yukleniyor,
    varsayilanlariYukle,
    yeniEkle,
    getFlagSrc,
    getFlagByName,
    imgHatalari,
    setImgHatalari,
    duzenle,
    silinecekId,
    setSilinecekId,
    silmeIsleminiOnayla,
    onayModali,
    setOnayModali,
    modalAcik,
    setModalAcik,
    form,
    setForm,
    kaydet,
    handleFlagUpload,
    dosyalar,
    yeniDosya,
    setYeniDosya,
    dosyaEkle,
    dosyaSec,
    dosyaSil,
    dosyaAc,
    bildirim
  }
}
