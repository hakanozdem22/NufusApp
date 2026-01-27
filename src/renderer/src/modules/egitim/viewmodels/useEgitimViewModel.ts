import { useState, useEffect } from 'react'
import { EgitimKonu, EgitimPlan, PersonelBasic, EgitimDers } from '../models/egitim-types'

export const useEgitimViewModel = () => {
  // --- STATE ---
  const [konular, setKonular] = useState<EgitimKonu[]>([])
  const [personelListesi, setPersonelListesi] = useState<PersonelBasic[]>([])
  const [kayitliPlanlar, setKayitliPlanlar] = useState<EgitimPlan[]>([])

  // Ayarlar
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0])
  const [seciliEgitici, setSeciliEgitici] = useState('')
  const [saatHedefi, setSaatHedefi] = useState('100')
  const [sabahOturum, setSabahOturum] = useState('08:30 - 11:00')
  const [ogleOturum, setOgleOturum] = useState('13:30 - 16:00')

  // Zorunlu Ders & Manuel
  const [zorunluDersler, setZorunluDersler] = useState<string[]>([])
  const [zorunluDersMenuAcik, setZorunluDersMenuAcik] = useState(false)
  const [manKonu, setManKonu] = useState('')
  const [manOturumSecimi, setManOturumSecimi] = useState<'sabah' | 'ogle' | 'ikisi'>('ikisi')
  const [manSaat, setManSaat] = useState('09:00 - 12:00')

  // Taslak & UI
  const [taslak, setTaslak] = useState<EgitimDers[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)

  // MODALLAR
  const [kayitModalAcik, setKayitModalAcik] = useState(false)
  const [planAdiInput, setPlanAdiInput] = useState('')

  // UI Kontrolleri
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [silinecekId, setSilinecekId] = useState<number | null>(null)

  // Mesaj Gösterici
  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  // Sıralama
  // Sıralama
  const dersSiralama = (a: any, b: any) => {
    // Helper to parse "1.1 - Konu" -> [1, 10]
    const getParts = (str: string) => {
      try {
        const code = str.split(' - ')[0].trim()
        const partsStr = code.split('.')
        const parts: number[] = []

        partsStr.forEach((p, i) => {
          // Noktadan sonraki ilk eleman (index 1) tek haneli ise sonuna 0 ekle
          if (i === 1 && p.length === 1) {
            parts.push(parseInt(p + '0'))
          } else {
            parts.push(parseInt(p))
          }
        })
        return parts
      } catch {
        return [9999]
      }
    }

    const partsA = getParts(a.baslik)
    const partsB = getParts(b.baslik)

    // Parça parça karşılaştır
    const len = Math.max(partsA.length, partsB.length)
    for (let i = 0; i < len; i++) {
      const valA = partsA[i] !== undefined ? partsA[i] : 0
      const valB = partsB[i] !== undefined ? partsB[i] : 0
      if (valA !== valB) return valA - valB
    }

    return a.baslik.localeCompare(b.baslik)
  }

  // Veri Çekme
  const verileriGetir = async () => {
    try {
      if (window.api) {
        const k = await window.api.getEgitimKonular()
        const p = await window.api.getEgitimPlanlar()
        const pers = await window.api.getEgitimEgiticiler() // Sadece eğiticileri getir

        if (Array.isArray(k)) setKonular(k)

        setKayitliPlanlar(p || [])
        setPersonelListesi(pers || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    verileriGetir()
  }, [])

  // Oturum seçimine göre saati güncelle
  useEffect(() => {
    if (manOturumSecimi === 'sabah') setManSaat(sabahOturum)
    else if (manOturumSecimi === 'ogle') setManSaat(ogleOturum)
    else setManSaat(`${sabahOturum} / ${ogleOturum}`) // Bilgi amaçlı
  }, [manOturumSecimi, sabahOturum, ogleOturum])

  // Fonksiyonlar
  const zorunluDersToggle = (baslik: string) => {
    if (zorunluDersler.includes(baslik))
      setZorunluDersler(zorunluDersler.filter((z) => z !== baslik))
    else setZorunluDersler([...zorunluDersler, baslik])
  }

  const robotCalistir = () => {
    if (!seciliEgitici) return mesajGoster('Lütfen önce eğitici seçiniz!', 'hata')
    const currentDate = new Date(tarih)
    let totalHours = 0
    const targetHours = parseInt(saatHedefi) || 100
    const newSchedule: EgitimDers[] = []

    const egiticiObj = personelListesi.find((p) => p.id == parseInt(seciliEgitici))
    const egiticiAd = egiticiObj
      ? `${egiticiObj.ad_soyad} ${egiticiObj.unvan ? ' - ' + egiticiObj.unvan : ''}`
      : 'Bilinmiyor'

    // 1. LİSTELERİ HAZIRLA
    // Zorunlular ve Adaylar
    const zorunluKonuObjeleri = konular.filter((k) => zorunluDersler.includes(k.baslik))
    const adayKonular = konular.filter((k) => !zorunluDersler.includes(k.baslik))

    // 2. KAÇ DERS LAZIM?
    const gunlukSaat = 6
    const hedefSaatInt = parseInt(saatHedefi) || 100
    const toplamDersSayisi = Math.ceil(hedefSaatInt / gunlukSaat)

    // Eksik kalan kısım kadar rastgele seç
    const gerekenEkDers = Math.max(0, toplamDersSayisi - zorunluKonuObjeleri.length)

    // 3. KARIŞIK SEÇ (Shuffle)
    const karisikAdaylar = [...adayKonular].sort(() => 0.5 - Math.random())
    const eklenenler = karisikAdaylar.slice(0, gerekenEkDers)

    // 4. BİRLEŞTİR VE ID'YE GÖRE SIRALA
    // "seçtiğim zorunlu ders de olsun ... karışık seçip id sine göre sıralasın"
    const birlesikHavuz = [...zorunluKonuObjeleri, ...eklenenler]
    const siraliHavuz = birlesikHavuz.sort(dersSiralama).map((k) => k.baslik)

    // İşlenecek havuz artık bu
    const havuz = siraliHavuz
    let subjectIdx = 0

    while (totalHours < targetHours && subjectIdx < havuz.length) {
      const day = currentDate.getDay()
      if (day === 0 || day === 6) {
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }
      const dateStr = currentDate.toISOString().split('T')[0]

      // Sabah Grubu
      newSchedule.push({
        konu: havuz[subjectIdx],
        egitici: egiticiAd,
        tarih: dateStr,
        saat: sabahOturum,
        zorunlu: false
      })
      totalHours += 3

      // Öğle Grubu (Aynı Konu)
      newSchedule.push({
        konu: havuz[subjectIdx],
        egitici: egiticiAd,
        tarih: dateStr,
        saat: ogleOturum,
        zorunlu: false
      })
      totalHours += 3

      subjectIdx++ // Sıradaki konu (ID sıralı listeden)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setTaslak(newSchedule)
    mesajGoster('Taslak plan oluşturuldu.')
  }

  const manuelEkle = () => {
    if (!manKonu || !seciliEgitici) return mesajGoster('Lütfen konu ve eğitici seçiniz!', 'hata')
    const egiticiObj = personelListesi.find((p) => p.id == parseInt(seciliEgitici))
    const egiticiAd = egiticiObj
      ? `${egiticiObj.ad_soyad} ${egiticiObj.unvan ? ' - ' + egiticiObj.unvan : ''}`
      : ''

    // manSaat artık aktif olarak kullanılıyor (Sabah/Öğle için)
    // İkisi seçilirse standart saatler kullanılır

    const yeniDersler: any[] = []

    if (manOturumSecimi === 'sabah') {
      yeniDersler.push({ konu: manKonu, egitici: egiticiAd, tarih: tarih, saat: manSaat })
    } else if (manOturumSecimi === 'ogle') {
      yeniDersler.push({ konu: manKonu, egitici: egiticiAd, tarih: tarih, saat: manSaat })
    } else {
      // İkisi durumu:
      // Eğer kullanıcı saati "Sabah / Öğle" formatında değiştirdiyse onu ayrıştır
      // Değiştirmediyse zaten global state'ten geliyor
      const separator = ' / '
      let sSaat = sabahOturum
      let oSaat = ogleOturum

      if (manSaat && manSaat.includes(separator)) {
        const parts = manSaat.split(separator)
        if (parts.length === 2) {
          sSaat = parts[0].trim()
          oSaat = parts[1].trim()
        }
      }

      yeniDersler.push({ konu: manKonu, egitici: egiticiAd, tarih: tarih, saat: sSaat })
      yeniDersler.push({ konu: manKonu, egitici: egiticiAd, tarih: tarih, saat: oSaat })
    }

    setTaslak([...taslak, ...yeniDersler].sort((a, b) => a.tarih.localeCompare(b.tarih)))
  }

  const kaydetButonunaBasildi = () => {
    if (taslak.length === 0) return mesajGoster('Kaydedilecek taslak boş!', 'hata')
    setPlanAdiInput('')
    setKayitModalAcik(true)
  }

  const gercekKayıtIslemi = async () => {
    if (!planAdiInput) return mesajGoster('Lütfen bir plan adı giriniz.', 'hata')
    try {
      if (window.api) {
        await window.api.saveEgitimPlan({
          adi: planAdiInput,
          tarih: new Date().toISOString().split('T')[0],
          dersler: taslak
        })
        setKayitModalAcik(false)
        setTaslak([])
        verileriGetir()
        mesajGoster('Plan başarıyla kaydedildi!')
      }
    } catch (e: any) {
      if (e.message && e.message.includes('UNIQUE'))
        mesajGoster('HATA: Bu isimde bir plan zaten var.', 'hata')
      else mesajGoster('Kayıt sırasında hata oluştu.', 'hata')
    }
  }

  // --- RAPOR ALMA ---
  const raporAl = async (planId: number, tip: 'NORMAL' | 'EK2' | 'EK3') => {
    setYukleniyor(true)
    try {
      if (window.api) {
        const detay = await window.api.getEgitimPlanDetay(planId)

        // Ortak Veri Paketi
        const raporData = {
          program_adi: detay.plan.adi,
          dersler: detay.dersler,
          personeller: detay.personeller
        }

        if (tip === 'NORMAL') {
          await window.api.createPdfEgitim(raporData)
          mesajGoster('İmza Çizelgesi (Yerel) oluşturuldu.')
        } else {
          const googleData = { tip: tip, veri: raporData }
          const sonucStr = await window.api.createGoogleReport(googleData)
          const sonuc = JSON.parse(sonucStr)

          if (sonuc.success) {
            mesajGoster(`Başarılı! Dosya indirildi.`)
            // Otomatik Aç
            if (window.api && sonuc.path) {
              window.api.openFile(sonuc.path)
            }
          } else {
            console.error(sonuc.error)
            mesajGoster(`HATA: ${sonuc.error}`, 'hata')
          }
        }
      }
    } catch (e) {
      console.error(e)
      mesajGoster(`İşlem sırasında hata oluştu: ${String(e)}`, 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  // --- SİLME ---
  const planSilOnayla = async () => {
    if (silinecekId === null) return
    try {
      if (window.api) {
        await window.api.deleteEgitimPlan(silinecekId)
        verileriGetir()
        mesajGoster('Plan silindi.')
      }
    } catch {
      mesajGoster('Silme hatası.', 'hata')
    } finally {
      setSilinecekId(null)
    }
  }

  return {
    konular,
    personelListesi,
    kayitliPlanlar,
    tarih,
    setTarih,
    seciliEgitici,
    setSeciliEgitici,
    saatHedefi,
    setSaatHedefi,
    sabahOturum,
    setSabahOturum,
    ogleOturum,
    setOgleOturum,
    zorunluDersler,
    setZorunluDersler,
    zorunluDersMenuAcik,
    setZorunluDersMenuAcik,
    manKonu,
    setManKonu,
    manOturumSecimi,
    setManOturumSecimi,
    manSaat,
    setManSaat,
    taslak,
    setTaslak,
    yukleniyor,
    kayitModalAcik,
    setKayitModalAcik,
    planAdiInput,
    setPlanAdiInput,
    bildirim,
    silinecekId,
    setSilinecekId,
    zorunluDersToggle,
    robotCalistir,
    manuelEkle,
    kaydetButonunaBasildi,
    gercekKayıtIslemi,

    raporAl,
    planSilOnayla,
    refreshData: verileriGetir
  }
}
