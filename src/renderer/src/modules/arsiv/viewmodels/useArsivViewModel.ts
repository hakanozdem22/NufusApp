import { useState, useEffect } from 'react'
import { ArsivKayit, ArsivFiltre } from '../models/arsiv-types'

export const useArsivViewModel = () => {
  const [liste, setListe] = useState<ArsivKayit[]>([])
  const [filtreler, setFiltreler] = useState<ArsivFiltre>({ ad: '', yili: '', kodu: '' })
  const [klasorTanimlari, setKlasorTanimlari] = useState<any[]>([])

  // Çoklu Seçim
  const [secilenler, setSecilenler] = useState<number[]>([])

  // Modallar
  const [kayitModal, setKayitModal] = useState(false)
  const [topluGuncelleModal, setTopluGuncelleModal] = useState(false)
  const [yazdirModal, setYazdirModal] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [topluSilmeModal, setTopluSilmeModal] = useState(false)

  // UI Kontrolleri
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [silinecekId, setSilinecekId] = useState<number | null>(null)

  // Formlar
  const simdikiYil = new Date().getFullYear().toString()
  const [form, setForm] = useState<any>({})
  const [topluForm, setTopluForm] = useState({
    baslangic_no: '1',
    bitis_no: '100',
    kapasite: '400',
    baslangic_klasor_no: '1'
  })
  const [topluMod, setTopluMod] = useState(false)

  // Toplu Güncelleme Formu
  const [topluUpdateForm, setTopluUpdateForm] = useState({
    klasor_adi: '',
    aciklama: '',
    tipi: '',
    yili: '',
    konum: '',
    saklama_suresi: '',
    imha_durumu: '',
    dosyalama_kodu: ''
  })

  const [raporTipi, setRaporTipi] = useState('LISTE')
  const [komisyon, setKomisyon] = useState({ baskan: '', uye1: '', uye2: '' })

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const veriGetir = async () => {
    try {
      if (window.api && window.api.getArsiv) {
        const data = await window.api.getArsiv(filtreler)
        setListe(data || [])
        const tanimlar = await window.api.getArsivTanimlar()
        setKlasorTanimlari(tanimlar || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    veriGetir()
  }, [filtreler])

  // --- OTOMATİK SIRA NO ---
  useEffect(() => {
    if (kayitModal && !form.id && !topluMod) {
      const noGetir = async () => {
        if (window.api) {
          const no = await window.api.getNextArsivNo(form.yili || simdikiYil)
          setForm((prev) => ({ ...prev, klasor_no: no.toString() }))
        }
      }
      noGetir()
    }
  }, [form.yili, kayitModal, topluMod])

  useEffect(() => {
    if (kayitModal && topluMod) {
      const noGetir = async () => {
        if (window.api) {
          const no = await window.api.getNextArsivNo(form.yili || simdikiYil)
          setTopluForm((prev) => ({ ...prev, baslangic_klasor_no: no.toString() }))
        }
      }
      noGetir()
    }
  }, [form.yili, kayitModal, topluMod])

  // --- SEÇİM FONKSİYONLARI ---
  const tumunuSec = () => {
    if (secilenler.length === liste.length) setSecilenler([])
    else setSecilenler(liste.map((item) => item.id))
  }

  const tekSec = (id: number) => {
    if (secilenler.includes(id)) setSecilenler(secilenler.filter((sid) => sid !== id))
    else setSecilenler([...secilenler, id])
  }

  const ayniIsmiSec = (isim: string) => {
    const benzerIdler = liste.filter((item) => item.klasor_adi === isim).map((item) => item.id)

    const yeniSecim = Array.from(new Set([...secilenler, ...benzerIdler]))
    setSecilenler(yeniSecim)
    mesajGoster(`"${isim}" adlı ${benzerIdler.length} kayıt seçildi.`)
  }

  const kaydet = async () => {
    try {
      if (window.api) {
        if (topluMod) {
          await window.api.addArsivToplu({ ...form, ...topluForm })
          mesajGoster('Toplu kayıt tamamlandı.')
        } else {
          if (form.id) await window.api.updateArsiv(form)
          else await window.api.addArsiv(form)
          mesajGoster(form.id ? 'Kayıt güncellendi.' : 'Yeni kayıt eklendi.')
        }
        setKayitModal(false)
        veriGetir()
      }
    } catch (e) {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const topluGuncelle = async () => {
    if (secilenler.length === 0) return mesajGoster('Kayıt seçmediniz.', 'hata')
    try {
      if (window.api) {
        await window.api.updateArsivToplu({ ids: secilenler, updates: topluUpdateForm })
        setTopluGuncelleModal(false)
        setSecilenler([])
        setTopluUpdateForm({
          klasor_adi: '',
          aciklama: '',
          tipi: '',
          yili: '',
          konum: '',
          saklama_suresi: '',
          imha_durumu: '',
          dosyalama_kodu: ''
        })
        veriGetir()
        mesajGoster('Seçili kayıtlar güncellendi.')
      }
    } catch (e) {
      mesajGoster('Güncelleme hatası.', 'hata')
    }
  }

  const topluSil = async () => {
    if (secilenler.length === 0) return
    try {
      if (window.api) {
        await window.api.deleteArsivToplu(secilenler)
        setTopluSilmeModal(false)
        setSecilenler([])
        veriGetir()
        mesajGoster('Seçili kayıtlar silindi.')
      }
    } catch (e) {
      mesajGoster('Silme hatası.', 'hata')
    }
  }

  const silmeOnayla = async () => {
    if (silinecekId === null) return
    try {
      if (window.api) {
        await window.api.deleteArsiv(silinecekId)
        veriGetir()
        mesajGoster('Kayıt silindi.')
      }
    } catch {
      mesajGoster('Silme hatası.', 'hata')
    } finally {
      setSilinecekId(null)
    }
  }

  const yeniKayit = () => {
    setForm({
      klasor_adi: '',
      tipi: 'KLASÖR',
      yili: simdikiYil,
      klasor_no: '',
      bas_no: '',
      bitis_no: '',
      saklama_suresi: 10,
      dosyalama_kodu: '121-02',
      evrak_sayisi: 0,
      aciklama: '',
      konum: ''
    })
    setTopluMod(false)
    setKayitModal(true)
  }

  const duzenle = (item: any) => {
    setForm(item)
    setTopluMod(false)
    setKayitModal(true)
  }

  const raporAl = async () => {
    setYukleniyor(true)
    try {
      if (window.api) {
        let raporVerisi = liste
        const buYil = new Date().getFullYear()

        if (raporTipi === 'IMHA') {
          raporVerisi = liste.filter((item) => {
            const yilStr = String(item.yili || '').split('.')[0]
            const yil = parseInt(yilStr) || 0
            const sure = parseInt(item.saklama_suresi as string) || 10
            const suresiDolmus = yil + sure < buYil
            const secilmis = secilenler.includes(item.id)
            return suresiDolmus || secilmis
          })

          if (raporVerisi.length === 0) {
            setYukleniyor(false)
            return mesajGoster('İmhalık kayıt bulunamadı.', 'hata')
          }
        } else {
          if (secilenler.length > 0) {
            raporVerisi = liste.filter((item) => secilenler.includes(item.id))
          }
        }

        const resStr = await window.api.createPdfArsiv({
          rapor_tipi: raporTipi,
          kayitlar: raporVerisi,
          komisyon: komisyon
        })
        const result = JSON.parse(resStr)
        if (result.success && result.path) {
          window.api.openFile(result.path)
          mesajGoster('PDF oluşturuldu.')
        } else {
          mesajGoster('PDF oluşturulamadı.', 'hata')
        }
        setYazdirModal(false)
      }
    } catch (e) {
      mesajGoster('PDF hatası.', 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  return {
    liste,
    filtreler,
    setFiltreler,
    klasorTanimlari,
    secilenler,
    tumunuSec,
    tekSec,
    ayniIsmiSec,
    kayitModal,
    setKayitModal,
    topluGuncelleModal,
    setTopluGuncelleModal,
    yazdirModal,
    setYazdirModal,
    yukleniyor,
    topluSilmeModal,
    setTopluSilmeModal,
    bildirim,
    silinecekId,
    setSilinecekId,
    form,
    setForm,
    topluForm,
    setTopluForm,
    topluMod,
    setTopluMod,
    topluUpdateForm,
    setTopluUpdateForm,
    raporTipi,
    setRaporTipi,
    komisyon,
    setKomisyon,
    veriGetir,
    kaydet,
    topluGuncelle,
    topluSil,
    silmeOnayla,
    yeniKayit,
    duzenle,
    raporAl
  }
}
