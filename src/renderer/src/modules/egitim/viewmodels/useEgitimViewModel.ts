import { useState, useEffect } from 'react'
import { EgitimKonu, EgitimPlan, PersonelBasic, EgitimDers } from '../models/egitim-types'

export const useEgitimViewModel = () => {
  // --- STATE ---
  const [konular, setKonular] = useState<EgitimKonu[]>([])
  const [personelListesi, setPersonelListesi] = useState<PersonelBasic[]>([])
  const [duzenleyenler, setDuzenleyenler] = useState<PersonelBasic[]>([]) // YENİ
  const [kayitliPlanlar, setKayitliPlanlar] = useState<EgitimPlan[]>([])
  const [seciliPlan, setSeciliPlan] = useState<EgitimPlan | null>(null) // YENİ: Seçili Plan (İmza Çizelgesi'nden gelen)

  // Ayarlar
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0])
  const [seciliEgitici, setSeciliEgitici] = useState('')
  const [seciliDuzenleyen, setSeciliDuzenleyen] = useState('')
  const [seciliOnaylayan, setSeciliOnaylayan] = useState('') // YENİ: Onaylayan
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
  const [silinecekId, setSilinecekId] = useState<number | string | null>(null)

  // Mesaj Gösterici
  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  // Sıralama - Sıra numarasına göre
  const dersSiralama = (a: any, b: any) => {
    const siraA = a.sira ?? 9999
    const siraB = b.sira ?? 9999
    if (siraA !== siraB) return siraA - siraB
    return (a.baslik || '').localeCompare(b.baslik || '')
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

  // Eğitici seçildiğinde otomatik onaylayan olarak da ayarla
  useEffect(() => {
    if (seciliEgitici) {
      setSeciliOnaylayan(seciliEgitici)
    }
  }, [seciliEgitici])

  // Fonksiyonlar
  const zorunluDersToggle = (baslik: string) => {
    setZorunluDersler((prev) => {
      const newList = prev.includes(baslik) ? prev.filter((z) => z !== baslik) : [...prev, baslik]
      return newList
    })
  }

  const zorunluTumunuSec = () => {
    setZorunluDersler(konular.map((k) => k.baslik))
  }

  const zorunluTumunuTemizle = () => {
    setZorunluDersler([])
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

  const robotCalistir = () => {
    if (!seciliEgitici) return mesajGoster('Lütfen önce eğitici seçiniz!', 'hata')

    const targetHours = parseInt(saatHedefi) || 100
    const newSchedule: EgitimDers[] = []

    // Eğitici bilgisi
    const egiticiObj = personelListesi.find((p) => String(p.id) === String(seciliEgitici))
    const egiticiAd = egiticiObj
      ? `${egiticiObj.ad_soyad}${egiticiObj.unvan ? ' - ' + egiticiObj.unvan : ''}`
      : 'Bilinmiyor'

    // Her konu için günlük toplam saat (sabah + öğle)
    const saatPerKonu = calculateDuration(sabahOturum) + calculateDuration(ogleOturum)

    // 1. ZORUNLU DERSLER — Bunlar kesinlikle dahil olacak
    const zorunluKonuObjeleri = konular
      .filter((k) => zorunluDersler.includes(k.baslik))
      .sort(dersSiralama)

    // 2. KALAN SAATLERİ HESAPLA
    const zorunluSaat = zorunluKonuObjeleri.length * saatPerKonu
    const kalanSaat = Math.max(0, targetHours - zorunluSaat)
    const gerekenEkKonu = Math.ceil(kalanSaat / saatPerKonu)

    // 3. ADAY KONULARDAN KARIŞIK SEÇ (Fisher-Yates Shuffle)
    const adayKonular = konular.filter((k) => !zorunluDersler.includes(k.baslik))
    const karisikAdaylar = [...adayKonular]
    for (let i = karisikAdaylar.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[karisikAdaylar[i], karisikAdaylar[j]] = [karisikAdaylar[j], karisikAdaylar[i]]
    }
    const secilenAdaylar = karisikAdaylar.slice(0, gerekenEkKonu)

    // 4. BİRLEŞTİR VE SIRA NUMARASINA GÖRE SIRALA
    const tamHavuz = [...zorunluKonuObjeleri, ...secilenAdaylar].sort(dersSiralama)

    // 5. PROGRAMI OLUŞTUR — Tüm havuzu kullan (zorunlular kesinlikle dahil)
    const currentDate = new Date(tarih)
    let totalHours = 0

    for (let idx = 0; idx < tamHavuz.length; idx++) {
      // Hafta sonlarını atla
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1)
      }

      const dateStr = currentDate.toISOString().split('T')[0]
      const konu = tamHavuz[idx]
      const isZorunlu = zorunluDersler.includes(konu.baslik)

      // Sabah Oturumu
      newSchedule.push({
        konu: konu.baslik,
        egitici: egiticiAd,
        tarih: dateStr,
        saat: sabahOturum,
        zorunlu: isZorunlu
      })
      totalHours += calculateDuration(sabahOturum)

      // Öğle Oturumu (Aynı Konu)
      newSchedule.push({
        konu: konu.baslik,
        egitici: egiticiAd,
        tarih: dateStr,
        saat: ogleOturum,
        zorunlu: isZorunlu
      })
      totalHours += calculateDuration(ogleOturum)

      currentDate.setDate(currentDate.getDate() + 1)
    }

    setTaslak(newSchedule)
    mesajGoster(
      `Taslak oluşturuldu: ${tamHavuz.length} konu, ${totalHours.toFixed(1)} saat (${zorunluKonuObjeleri.length} zorunlu)`
    )
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
  const raporAl = async (planId: number | string, tip: 'NORMAL' | 'EK2' | 'EK3') => {
    setYukleniyor(true)
    try {
      if (window.api) {
        const detay = await window.api.getEgitimPlanDetay(planId)

        // Ortak Veri Paketi
        const raporData = {
          program_adi: detay.plan.adi,
          dersler: detay.dersler,
          personeller: detay.personeller,
          duzenleyen: duzenleyenler.find((d) => String(d.id) === String(seciliDuzenleyen)) || null,
          onaylayan: duzenleyenler.find((d) => String(d.id) === String(seciliOnaylayan)) || null
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
        } else if (tip === 'EK2' || tip === 'EK3') {
          const payload = {
            tip: tip,
            veri: {
              program_adi: raporData.program_adi || 'Taslak Eğitim Programı',
              dersler: raporData.dersler || [],
              personeller: raporData.personeller || [],
              duzenleyen: raporData.duzenleyen,
              onaylayan: raporData.onaylayan
            },
            desktop_path: null // Varsayılan masaüstü
          }

          const res = await window.api.createEkExcel(payload)
          if (res.success) {
            mesajGoster(`${tip} başarıyla oluşturuldu.`)
          } else {
            mesajGoster(`HATA: ${res.error}`, 'hata')
          }
        }
      } else {
        mesajGoster('API bağlantısı kurulamadı (Electron modu değil).', 'hata')
      }
    } catch (error: any) {
      console.error(error)
      mesajGoster(`HATA: ${error.message || 'Bilinmeyen hata'}`, 'hata')
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
    seciliOnaylayan, // YENİ
    setSeciliOnaylayan, // YENİ
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
    zorunluTumunuSec,
    zorunluTumunuTemizle,
    robotCalistir,
    manuelEkle,
    kaydetButonunaBasildi,
    gercekKayıtIslemi,

    raporAl,
    planSilOnayla,
    refreshData: verileriGetir,
    seciliPlan,
    setSeciliPlan, // Bunu da dışarı açalım ama asıl planSec kullanılmalı
    planSec: async (plan: EgitimPlan) => {
      setYukleniyor(true)
      try {
        if (window.api) {
          const detay = await window.api.getEgitimPlanDetay(plan.id)
          // Detay: { plan: {id, adi, ...}, dersler: [...], personeller: [...] }
          // Bizim seciliPlan state'imiz EgitimPlan tipinde, dersler field'ı var
          const fullPlan: EgitimPlan = {
            ...plan,
            dersler: detay.dersler || []
          }
          setSeciliPlan(fullPlan)
          return fullPlan
        } else {
          // Fallback (Dev/Mock)
          setSeciliPlan(plan)
          return plan
        }
      } catch (e) {
        console.error('Plan detayları alınamadı', e)
        // Hata olsa da en azından ID'yi set et ki UI seçili göstersin
        setSeciliPlan(plan)
        return plan
      } finally {
        setYukleniyor(false)
      }
    }
  }
}
