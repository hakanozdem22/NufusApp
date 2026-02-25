import { useState, useEffect } from 'react'
import { TakvimEtkinlik, DINI_BAYRAMLAR } from '../models/takvim-types'

export const useTakvimViewModel = () => {
  const [tarih, setTarih] = useState(new Date())
  const [dbEtkinlikler, setDbEtkinlikler] = useState<TakvimEtkinlik[]>([])
  const [resmiTatiller, setResmiTatiller] = useState<TakvimEtkinlik[]>([])

  // MODAL VE SEÇİM STATE'LERİ
  const [seciliTarih, setSeciliTarih] = useState<string>('')
  const [modalAcik, setModalAcik] = useState(false)
  const [aktifGunEtkinlikleri, setAktifGunEtkinlikleri] = useState<TakvimEtkinlik[]>([])
  const [yeniEtkinlik, setYeniEtkinlik] = useState<{
    baslik: string
    dosya_yolu: string
    tarih: string
  }>({
    baslik: '',
    dosya_yolu: '',
    tarih: ''
  })
  const [duzenlemeModu, setDuzenlemeModu] = useState<number | null>(null)

  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  // --- TATİL HESAPLAMA ---
  useEffect(() => {
    const tumTatiller: TakvimEtkinlik[] = []
    for (let y = 2020; y <= 2050; y++) {
      tumTatiller.push(
        { id: `rt-${y}-01`, tarih: `${y}-01-01`, baslik: 'Yılbaşı', tur: 'RESMI' },
        {
          id: `rt-${y}-02`,
          tarih: `${y}-04-23`,
          baslik: 'Ulusal Egemenlik ve Çocuk Bayramı',
          tur: 'RESMI'
        },
        { id: `rt-${y}-03`, tarih: `${y}-05-01`, baslik: 'Emek ve Dayanışma Günü', tur: 'RESMI' },
        {
          id: `rt-${y}-04`,
          tarih: `${y}-05-19`,
          baslik: "Atatürk'ü Anma, Gençlik ve Spor Bayramı",
          tur: 'RESMI'
        },
        {
          id: `rt-${y}-05`,
          tarih: `${y}-07-15`,
          baslik: 'Demokrasi ve Milli Birlik Günü',
          tur: 'RESMI'
        },
        { id: `rt-${y}-06`, tarih: `${y}-08-30`, baslik: 'Zafer Bayramı', tur: 'RESMI' },
        { id: `rt-${y}-07`, tarih: `${y}-10-29`, baslik: 'Cumhuriyet Bayramı', tur: 'RESMI' }
      )
    }
    DINI_BAYRAMLAR.forEach((bayram, index) => {
      tumTatiller.push({ id: `dt-${index}`, tarih: bayram.date, baslik: bayram.title, tur: 'DINI' })
    })
    setResmiTatiller(tumTatiller)
  }, [])

  const veriGetir = async () => {
    try {
      if (window.api) {
        const data = await window.api.getTakvim()
        setDbEtkinlikler(data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    veriGetir()
  }, [])

  // Güncelleme sonrası aktif gün listesini de güncelle
  useEffect(() => {
    if (seciliTarih) {
      const gunun = [
        ...dbEtkinlikler.filter((e) => e.tarih === seciliTarih),
        ...resmiTatiller.filter((e) => e.tarih === seciliTarih)
      ]
      setAktifGunEtkinlikleri(gunun)
    }
  }, [dbEtkinlikler, resmiTatiller, seciliTarih])

  // Takvim Navigasyon
  const yil = tarih.getFullYear()
  const ay = tarih.getMonth()

  const ayDegistir = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setTarih(new Date(yil, parseInt(e.target.value), 1))
  const yilDegistir = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setTarih(new Date(parseInt(e.target.value), ay, 1))

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const gunSayisi = getDaysInMonth(yil, ay)
  const baslangicBosluk = getFirstDayOfMonth(yil, ay)

  const oncekiAy = () => setTarih(new Date(yil, ay - 1, 1))
  const sonrakiAy = () => setTarih(new Date(yil, ay + 1, 1))
  const bugunGit = () => setTarih(new Date())

  // --- İŞLEMLER ---
  const gunTikla = (gun: number) => {
    const tiklananTarih = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`
    modalAc(tiklananTarih)
  }

  const modalAc = (tarihStr: string) => {
    setSeciliTarih(tarihStr)
    setYeniEtkinlik({ baslik: '', dosya_yolu: '', tarih: tarihStr })
    setDuzenlemeModu(null)
    setModalAcik(true)
  }

  const hizliGorevEkle = () => {
    const bugun = new Date()
    const bugunStr = `${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, '0')}-${String(bugun.getDate()).padStart(2, '0')}`
    modalAc(bugunStr)
  }

  const dosyaSec = async () => {
    if (window.api) {
      const path = await window.api.selectFile()
      if (path) setYeniEtkinlik({ ...yeniEtkinlik, dosya_yolu: path })
    }
  }

  const dosyaAc = async (path: string) => {
    if (path && window.api) await window.api.openFile(path)
  }

  const kaydet = async () => {
    if (!yeniEtkinlik.baslik) return mesajGoster('Başlık giriniz.', 'hata')
    try {
      if (window.api) {
        if (duzenlemeModu) {
          await window.api.updateTakvim({
            id: duzenlemeModu,
            baslik: yeniEtkinlik.baslik,
            tarih: yeniEtkinlik.tarih || seciliTarih,
            dosya_yolu: yeniEtkinlik.dosya_yolu
          })
          mesajGoster('Etkinlik güncellendi.')
        } else {
          await window.api.addTakvim({
            baslik: yeniEtkinlik.baslik,
            tarih: yeniEtkinlik.tarih || seciliTarih,
            dosya_yolu: yeniEtkinlik.dosya_yolu
          })
          mesajGoster('Etkinlik eklendi.')
        }
        setYeniEtkinlik({ baslik: '', dosya_yolu: '', tarih: '' })
        setDuzenlemeModu(null)
        veriGetir()
        setModalAcik(false)
      }
    } catch (e) {
      mesajGoster('Hata oluştu.', 'hata')
    }
  }

  const duzenle = (item: any) => {
    setDuzenlemeModu(item.id)
    setYeniEtkinlik({ baslik: item.baslik, dosya_yolu: item.dosya_yolu || '', tarih: item.tarih })
  }

  const sil = async (id: number) => {
    try {
      if (window.api) {
        await window.api.deleteTakvim(id)
        veriGetir()
        if (duzenlemeModu === id) {
          setDuzenlemeModu(null)
          setYeniEtkinlik({ baslik: '', dosya_yolu: '', tarih: '' })
        }
        mesajGoster('Silindi.')
      }
    } catch (e) {
      mesajGoster('Hata.', 'hata')
    }
  }

  const onCancelEdit = () => {
    setDuzenlemeModu(null)
    setYeniEtkinlik({ baslik: '', dosya_yolu: '', tarih: '' })
  }

  // --- YAKLAŞAN ETKİNLİKLER HESAPLAMA ---
  const getYaklasanlar = () => {
    const bugun = new Date()
    const bugunStr = bugun.toISOString().split('T')[0]

    // 15 gün sonrasını hesapla
    const onBesGunSonra = new Date(bugun)
    onBesGunSonra.setDate(bugun.getDate() + 15)
    const onBesGunSonraStr = onBesGunSonra.toISOString().split('T')[0]

    // Tüm etkinlikleri birleştir (DB + Resmi)
    const tumEtkinlikler = [
      ...dbEtkinlikler.map((e) => ({ ...e, tur: 'GOREV' })),
      ...resmiTatiller
    ] as TakvimEtkinlik[]

    // Filtreleme:
    // 1. Resmi ve Dini tatilleri ÇIKAR (sadece görevler kalsın isteniyor yaklaşanlarda)
    // 2. Tarih aralığı: Bugün ve önümüzdeki 15 gün
    return tumEtkinlikler
      .filter((e) => {
        const isTatil = e.tur === 'RESMI' || e.tur === 'DINI'
        const tarihUygun = e.tarih >= bugunStr && e.tarih <= onBesGunSonraStr
        return !isTatil && tarihUygun
      })
      .sort((a, b) => a.tarih.localeCompare(b.tarih))
    // Slice kaldırıldı veya artırılabilir, 15 gün kuralı zaten sınırlıyor
  }

  const yaklasanlar = getYaklasanlar()

  return {
    tarih,
    ayDegistir,
    yilDegistir,
    oncekiAy,
    sonrakiAy,
    bugunGit,
    yil,
    ay,
    gunSayisi,
    baslangicBosluk,
    dbEtkinlikler,
    resmiTatiller,
    modalAcik,
    setModalAcik,
    seciliTarih,
    aktifGunEtkinlikleri,
    yeniEtkinlik,
    setYeniEtkinlik,
    duzenlemeModu,
    bildirim,
    hizliGorevEkle,
    gunTikla,
    dosyaSec,
    dosyaAc,
    kaydet,
    duzenle,
    sil,
    onCancelEdit,
    yaklasanlar
  }
}
