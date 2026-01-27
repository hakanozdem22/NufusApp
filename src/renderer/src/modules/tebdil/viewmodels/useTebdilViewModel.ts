import { useState, useEffect } from 'react'
import { TebdilUlke, TebdilDosya, ULKE_KODLARI, SiteLink } from '../models/tebdil-types'

const flagImages = import.meta.glob('../../../assets/flags/*.{png,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
})

export const useTebdilViewModel = () => {
  const [liste, setListe] = useState<TebdilUlke[]>([])
  const [arama, setArama] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [imgHatalari, setImgHatalari] = useState<Record<number, boolean>>({})
  const [yukleniyor, setYukleniyor] = useState(false)
  const [onayModali, setOnayModali] = useState(false)

  const [aktifTab, setAktifTab] = useState<'VIYANA_1968' | 'CENEVRE_1949' | 'IKILI_ANLASMA'>(
    'VIYANA_1968'
  )

  // FORM & DOSYALAR
  const [form, setForm] = useState<any>({
    ulke_adi: '',
    bayrak_url: '',
    site_url: [] as SiteLink[],
    aciklama: '',
    konvansiyon: 'VIYANA_1968'
  })
  const [dosyalar, setDosyalar] = useState<TebdilDosya[]>([])
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
        const data = await window.api.getTebdil()
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
            const data = await window.api.getTebdilFiles(form.id)
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
    const upper = name.toLocaleUpperCase('tr-TR').trim()
    const code = ULKE_KODLARI[upper]
    if (code) return getFlagSrc(code)
    return null
  }

  // --- TOPLU EKLEME (FETCH FROM BACKEND) ---
  const varsayilanlariYukle = async () => {
    setOnayModali(false)
    setYukleniyor(true)
    try {
      if (window.api) {
        const res = await window.api.fetchTebdilData()
        if (res.success) {
          await verileriGetir()
          mesajGoster('Ülkeler güncellendi.')
        } else {
          mesajGoster('Hata oluştu.', 'hata')
        }
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
        await window.api.addTebdilFile({
          tebdil_id: form.id,
          ad: yeniDosya.ad,
          yol: yeniDosya.yol,
          tip: yeniDosya.tip
        })
        const data = await window.api.getTebdilFiles(form.id)
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
      await window.api.deleteTebdilFile(id)
      const data = await window.api.getTebdilFiles(form.id)
      setDosyalar(data)
    }
  }

  const dosyaAc = (yol: string, tip: string) => {
    if (window.api) {
      if (tip === 'LINK') window.api.openExternal(yol)
      else window.api.openFile(yol)
    }
  }

  const kaydet = async () => {
    if (!form.ulke_adi) return mesajGoster('Ülke adı zorunludur.', 'hata')
    try {
      if (window.api) {
        const payload = { ...form }
        // Eğer yeni ise ve konvansiyon yoksa, aktifTab'ı kullan
        if (!payload.id && !payload.konvansiyon) {
          payload.konvansiyon = aktifTab
        }

        if (Array.isArray(payload.site_url)) {
          const urls = (payload.site_url as SiteLink[]).filter((u) => u.url.trim() !== '')
          payload.site_url = JSON.stringify(urls)
        }

        if (form.id) {
          await window.api.updateTebdil(payload)
          mesajGoster('Güncellendi.')
        } else {
          await window.api.addTebdil(payload)
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
        await window.api.deleteTebdil(silinecekId)
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
          if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') {
            parsedSites = raw.map((r: string) => ({ url: r, aciklama: '' }))
          } else {
            parsedSites = raw
          }
        } else {
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
    setForm({
      ulke_adi: '',
      bayrak_url: '',
      site_url: [{ url: '', aciklama: '' }],
      aciklama: '',
      konvansiyon: aktifTab
    })
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

  const filtrelenenler = liste.filter((item) => {
    const nameMatch = item.ulke_adi.toLowerCase().includes(arama.toLowerCase())
    // Eski verilerde konvansiyon sütunu boş olabilir, varsayılan VIYANA_1968
    const itemKonvansiyon = item.konvansiyon || 'VIYANA_1968'
    return nameMatch && itemKonvansiyon === aktifTab
  })

  return {
    filtrelenenler,
    aktifTab,
    setAktifTab,
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
