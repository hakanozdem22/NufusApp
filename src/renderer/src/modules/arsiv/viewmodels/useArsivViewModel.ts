import { useState, useEffect } from 'react'
import { ArsivKayit, ArsivFiltre } from '../models/arsiv-types'

export const useArsivViewModel = () => {
  const [liste, setListe] = useState<ArsivKayit[]>([])
  const [filtreler, setFiltreler] = useState<ArsivFiltre>({ ad: '', yili: '', kodu: '' })
  /* YENİ: Genişletilmiş Klasör Tanımları Tipi */
  const [klasorTanimlari, setKlasorTanimlari] = useState<
    { id: number; ad: string; saklama_suresi?: string; dosyalama_kodu?: string }[]
  >([])
  /* YENİ: Düşünceler */
  const [arsivDusunceler, setArsivDusunceler] = useState<{ id: string; aciklama: string }[]>([])

  // const [personeller, setPersoneller] = useState<any[]>([]) // REMOVED
  const [imhaKomisyonu, setImhaKomisyonu] = useState<
    { id: any; ad_soyad: string; unvan: string; gorev: 'BASKAN' | 'UYE' | 'UYE1' | 'UYE2' }[]
  >([])

  // Çoklu Seçim
  const [secilenler, setSecilenler] = useState<number[]>([])

  // Modallar
  const [kayitModal, setKayitModal] = useState(false)
  const [topluGuncelleModal, setTopluGuncelleModal] = useState(false)
  const [yazdirModal, setYazdirModal] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [topluSilmeModal, setTopluSilmeModal] = useState(false)
  const [importModal, setImportModal] = useState(false)

  // Düzenleme Drawer (modal'dan ayrı, deep-clone ile)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [editOriginal, setEditOriginal] = useState<any>({})

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
  const [komisyon, setKomisyon] = useState({
    baskan: { id: '', ad_soyad: '', unvan: '' },
    uye1: { id: '', ad_soyad: '', unvan: '' },
    uye2: { id: '', ad_soyad: '', unvan: '' }
  })

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const veriGetir = async () => {
    try {
      if (window.api && window.api.getArsiv) {
        const data = await window.api.getArsiv(filtreler)
        // Sıralama: Varsa 'sira' alanına göre, yoksa 'id' ye göre
        const sortedData = (data || []).sort((a: any, b: any) => {
          if (a.sira !== undefined && b.sira !== undefined) {
            return a.sira - b.sira
          }
          return b.id - a.id // Eskiler varsayılan olarak id'ye göre sıralansın (yeniden eskiye)
        })
        setListe(sortedData)

        // Klasör Tanımları
        const tanimlar = await window.api.getArsivTanimlar()
        setKlasorTanimlari(tanimlar || [])

        // Düşünceler
        const dusunceler = await window.api.getArsivDusunceTanimlari()
        setArsivDusunceler(dusunceler || [])

        // İmha Komisyonu
        const komisyonData = await window.api.getArsivImhaKomisyonu()
        setImhaKomisyonu(komisyonData || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    veriGetir()
  }, [filtreler])

  // --- OTOMATİK KOMİSYON SEÇİMİ ---
  useEffect(() => {
    if (imhaKomisyonu.length > 0) {
      const baskan = imhaKomisyonu.find((u) => u.gorev === 'BASKAN')

      // Üye listesi (Özel roller + normal üyeler)
      const uyeler = imhaKomisyonu.filter((u) => ['UYE', 'UYE1', 'UYE2'].includes(u.gorev))

      // Spesifik olarak atanmışları ara
      const specificUye1 = imhaKomisyonu.find((u) => u.gorev === 'UYE1')
      const specificUye2 = imhaKomisyonu.find((u) => u.gorev === 'UYE2')

      // Atanmış varsa onu al, yoksa listedeki ilk uygun kişiyi al
      const u1 = specificUye1 || uyeler[0]
      // İkinci üye için u1 dışındaki ilk uygun kişiyi al
      const u2 = specificUye2 || uyeler.find((u) => String(u.id) !== String(u1?.id))

      setKomisyon({
        baskan: baskan
          ? { id: String(baskan.id), ad_soyad: baskan.ad_soyad, unvan: baskan.unvan || '' }
          : { id: '', ad_soyad: '', unvan: '' },
        uye1: u1
          ? { id: String(u1.id), ad_soyad: u1.ad_soyad, unvan: u1.unvan || '' }
          : { id: '', ad_soyad: '', unvan: '' },
        uye2: u2
          ? { id: String(u2.id), ad_soyad: u2.ad_soyad, unvan: u2.unvan || '' }
          : { id: '', ad_soyad: '', unvan: '' }
      })
    }
  }, [imhaKomisyonu])

  // --- MODAL AÇILINCA VERİLERİ TAZELE ---
  useEffect(() => {
    if (yazdirModal && window.api) {
      window.api.getArsivImhaKomisyonu().then((data) => {
        if (data) setImhaKomisyonu(data)
      })
    }
  }, [yazdirModal])

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

  const importFromExcel = async (data: any[]) => {
    setYukleniyor(true)
    try {
      if (window.api) {
        await window.api.addArsivBatch(data)
        mesajGoster(`${data.length} kayıt başarıyla içe aktarıldı.`)
        veriGetir()
      }
    } catch (e) {
      console.error(e)
      mesajGoster('Excel aktarımında hata oluştu.', 'hata')
    } finally {
      setYukleniyor(false)
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
    const klon = JSON.parse(JSON.stringify(item))
    setEditForm(klon)
    setEditOriginal({ ...item })
    setEditDrawerOpen(true)
  }

  const editKaydet = async () => {
    if (!editForm.klasor_adi?.trim()) {
      mesajGoster('Klasör adı zorunludur.', 'hata')
      return
    }
    try {
      if (window.api) {
        await window.api.updateArsiv(editForm)
        setEditDrawerOpen(false)
        setEditForm({})
        setEditOriginal({})
        veriGetir()
        mesajGoster('Kayıt güncellendi.')
      }
    } catch {
      mesajGoster('Güncelleme hatası.', 'hata')
    }
  }

  const editIptal = () => {
    setEditDrawerOpen(false)
    setEditForm({})
    setEditOriginal({})
  }

  const raporAl = async () => {
    setYukleniyor(true)
    try {
      if (window.api) {
        let raporVerisi = liste
        const buYil = new Date().getFullYear()

        if (raporTipi === 'IMHA') {
          raporVerisi = liste.filter((item) => {
            const yilStr = String(item.yili || '')
              .split('.')[0]
              .trim()
            const sureStr = String(item.saklama_suresi || '').trim()

            const yil = parseInt(yilStr)
            const sure = parseInt(sureStr)

            // Yıl veya süre geçerli bir sayı değilse listeye dahil etme
            if (isNaN(yil) || isNaN(sure)) {
              return false
            }

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

        // Kaymakam bilgisini al
        let kaymakamAdi = ''
        try {
          kaymakamAdi = await window.api.getSetting('kaymakam')
        } catch (e) {
          console.error('Kaymakam bilgisi alınamadı', e)
        }

        const resStr = await window.api.createPdfArsiv({
          rapor_tipi: raporTipi,
          kayitlar: raporVerisi,
          komisyon: { ...komisyon, kaymakam: kaymakamAdi }
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
    editDrawerOpen,
    editForm,
    setEditForm,
    editOriginal,
    editKaydet,
    editIptal,
    raporAl,
    imhaKomisyonu,
    importFromExcel,
    importModal,
    setImportModal,
    arsivDusunceler
  }
}
