import { useState, useEffect } from 'react'
import { EgitimKonu, EgitimPlan, PersonelBasic, EgitimDers } from '../models/egitim-types'

export const useEgitimViewModel = () => {
  // --- STATE ---
  const [konular, setKonular] = useState<EgitimKonu[]>([])
  const [personelListesi, setPersonelListesi] = useState<PersonelBasic[]>([])
  const [duzenleyenler, setDuzenleyenler] = useState<PersonelBasic[]>([]) // YENİ
  const [kayitliPlanlar, setKayitliPlanlar] = useState<EgitimPlan[]>([])

  // Ayarlar
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0])
  const [seciliEgitici, setSeciliEgitici] = useState('')
  const [seciliDuzenleyen, setSeciliDuzenleyen] = useState('') // YENİ
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
        const duz = await window.api.getEgitimDuzenleyenler() // Düzenleyenleri getir

        if (Array.isArray(k)) setKonular(k)

        setKayitliPlanlar(p || [])
        setPersonelListesi(pers || [])
        setDuzenleyenler(duz || [])
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

  // YARDIMCI: Saat Aralığından Süre Hesapla (Örn: "08:30 - 11:00" -> 2.5)
  const calculateDuration = (timeStr: string): number => {
    try {
      if (!timeStr || !timeStr.includes('-')) return 3 // Varsayılan
      const parts = timeStr.split('-')
      if (parts.length !== 2) return 3

      const [startStr, endStr] = parts
      const [startH, startM] = startStr.trim().split(':').map(Number)
      const [endH, endM] = endStr.trim().split(':').map(Number)

      const startTotal = startH * 60 + startM
      const endTotal = endH * 60 + endM

      const diffMinutes = endTotal - startTotal
      return diffMinutes > 0 ? diffMinutes / 60 : 3
    } catch {
      return 3
    }
  }

  // ...

  const robotCalistir = () => {
    if (!seciliEgitici) return mesajGoster('Lütfen önce eğitici seçiniz!', 'hata')
    const currentDate = new Date(tarih)
    let totalHours = 0
    const targetHours = parseInt(saatHedefi) || 100
    const newSchedule: EgitimDers[] = []

    // ID karşılaştırması string güvenli olsun
    const egiticiObj = personelListesi.find((p) => String(p.id) === String(seciliEgitici))
    const egiticiAd = egiticiObj
      ? `${egiticiObj.ad_soyad} ${egiticiObj.unvan ? ' - ' + egiticiObj.unvan : ''}`
      : 'Bilinmiyor'

    // 1. LİSTELERİ HAZIRLA
    // Zorunlular ve Adaylar
    const zorunluKonuObjeleri = konular.filter((k) => zorunluDersler.includes(k.baslik))
    const adayKonular = konular.filter((k) => !zorunluDersler.includes(k.baslik))

    // 2. KAÇ DERS LAZIM?
    const approximateLessonCount = Math.ceil(targetHours / 3)
    const gerekenEkDers = Math.max(0, approximateLessonCount - zorunluKonuObjeleri.length)

    // 3. KARIŞIK SEÇ (Shuffle)
    const karisikAdaylar = [...adayKonular].sort(() => 0.5 - Math.random())
    const eklenenler = karisikAdaylar.slice(0, gerekenEkDers)

    // 4. BİRLEŞTİR VE ID'YE GÖRE SIRALA
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
      totalHours += calculateDuration(sabahOturum)

      // Öğle Grubu (Aynı Konu)
      newSchedule.push({
        konu: havuz[subjectIdx],
        egitici: egiticiAd,
        tarih: dateStr,
        saat: ogleOturum,
        zorunlu: false
      })
      totalHours += calculateDuration(ogleOturum)

      subjectIdx++ // Sıradaki konu (ID sıralı listeden)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setTaslak(newSchedule)
    mesajGoster(`Taslak plan oluşturuldu. Tahmini Toplam: ${totalHours.toFixed(1)} Saat`)
  }

  const manuelEkle = () => {
    if (!manKonu || !seciliEgitici) return mesajGoster('Lütfen konu ve eğitici seçiniz!', 'hata')
    const egiticiObj = personelListesi.find((p) => String(p.id) === String(seciliEgitici))
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
          personeller: detay.personeller,
          duzenleyen:
            duzenleyenler.find((d) => String(d.id) === String(seciliDuzenleyen)) || null // YENİ: Rapora ekle
        }

        if (tip === 'NORMAL') {
          const resultStr = await window.api.createPdfEgitim(raporData)
          let result
          try {
            result = JSON.parse(resultStr)
          } catch {
            result = { success: false, error: 'PDF oluşturma yanıtı geçersiz.' }
          }

          if (result.success) {
            mesajGoster('İmza Çizelgesi (Yerel) oluşturuldu.')
          } else {
            console.error(result.error)
            mesajGoster(`HATA: ${result.error}`, 'hata')
          }
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
    duzenleyenler,
    kayitliPlanlar,
    tarih,
    setTarih,
    seciliEgitici,
    setSeciliEgitici,
    seciliDuzenleyen,
    setSeciliDuzenleyen,
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
