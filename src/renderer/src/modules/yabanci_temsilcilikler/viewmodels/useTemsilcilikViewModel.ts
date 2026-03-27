import { useState, useEffect, useCallback } from 'react'
import { Temsilcilik, ULKE_KODLARI } from '../models/temsilcilik-types'
import { EKLENECEK_TEMSILCILIKLER_DETAYLI } from '../models/temsilcilik-data'

const flagImages = import.meta.glob('../../../assets/flags/*.{png,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
})

export const useTemsilcilikViewModel = () => {
  const [temsilcilikler, setTemsilcilikler] = useState<Temsilcilik[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Arama ve Filtreleme
  const [aramaMetni, setAramaMetni] = useState('')
  const [secilenSehir, setSecilenSehir] = useState<string>('')

  // Görsel Hataları Takibi
  const [imgHatalari, setImgHatalari] = useState<Record<string, boolean>>({})

  const fetchTemsilcilikler = useCallback(async () => {
    try {
      setLoading(true)
      const data = await window.api.getTemsilcilikler()
      setTemsilcilikler(data)
      setError(null)
    } catch (err: any) {
      console.error('Temsilcilikleri çekerken hata:', err)
      setError('Veriler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemsilcilikler()
  }, [fetchTemsilcilikler])

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

  // --- TOPLU EKLEME (Eksik Ülkeleri Tamamlama) ---
  const varsayilanlariYukle = async () => {
    setLoading(true)
    try {
      if (window.api) {
        const existingKeys = temsilcilikler.map(
          (t) =>
            `${t.ulke.toLocaleUpperCase('tr-TR').trim()}_${t.sehir.toLocaleUpperCase('tr-TR').trim()}`
        )

        // Eksik olanları listeleyelim
        const toAdd = EKLENECEK_TEMSILCILIKLER_DETAYLI.filter(
          (data) =>
            !existingKeys.includes(
              `${data.ulke.toLocaleUpperCase('tr-TR').trim()}_${data.sehir.toLocaleUpperCase('tr-TR').trim()}`
            )
        )

        // Boş iletişim bilgisine sahip olanları güncelleyelim
        const toUpdate = temsilcilikler.filter((t) => !t.telefon || !t.adres)

        // Yeni eksikleri ekle
        for (const data of toAdd) {
          await window.api.addTemsilcilik(data)
        }

        // Hali hazırda eklenmiş ama bilgileri boş olanları güncelle
        for (const existing of toUpdate) {
          const detay = EKLENECEK_TEMSILCILIKLER_DETAYLI.find(
            (d) =>
              d.ulke.toLocaleUpperCase('tr-TR').trim() ===
                existing.ulke.toLocaleUpperCase('tr-TR').trim() &&
              d.sehir.toLocaleUpperCase('tr-TR').trim() ===
                existing.sehir.toLocaleUpperCase('tr-TR').trim()
          )
          if (detay) {
            await window.api.updateTemsilcilik({ ...existing, ...detay, id: existing.id })
          }
        }

        await fetchTemsilcilikler()
      }
    } catch (e) {
      console.error('Toplu ekleme hatası', e)
    } finally {
      setLoading(false)
    }
  }

  const temsilcilikEkle = async (data: Omit<Temsilcilik, 'id'>) => {
    try {
      await window.api.addTemsilcilik(data)
      await fetchTemsilcilikler()
      return true
    } catch (err: any) {
      console.error('Temsilcilik eklerken hata:', err)
      throw new Error(err.message || 'Temsilcilik eklenemedi')
    }
  }

  const temsilcilikGuncelle = async (data: Temsilcilik) => {
    try {
      await window.api.updateTemsilcilik(data)
      await fetchTemsilcilikler()
      return true
    } catch (err: any) {
      console.error('Temsilcilik güncellerken hata:', err)
      throw new Error(err.message || 'Temsilcilik güncellenemedi')
    }
  }

  const temsilcilikSil = async (id: string) => {
    try {
      await window.api.deleteTemsilcilik(id)
      await fetchTemsilcilikler()
      return true
    } catch (err: any) {
      console.error('Temsilcilik silerken hata:', err)
      throw new Error(err.message || 'Temsilcilik silinemedi')
    }
  }

  const filterliListe = temsilcilikler.filter((t) => {
    const metinEslesti =
      t.ulke.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      t.sehir.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      (t.tip && t.tip.toLowerCase().includes(aramaMetni.toLowerCase()))
    const sehirEslesti = secilenSehir ? t.sehir === secilenSehir : true
    return metinEslesti && sehirEslesti
  })

  // Group by country, preserving all individual missions
  const groupedTemsilcilikler: Record<string, Temsilcilik[]> = {}
  filterliListe.forEach((t) => {
    const key = t.ulke.toLocaleUpperCase('tr-TR').trim()
    if (!groupedTemsilcilikler[key]) {
      groupedTemsilcilikler[key] = []
    }
    groupedTemsilcilikler[key].push(t)
  })

  // Sort countries alphabetically
  const sortedCountries = Object.keys(groupedTemsilcilikler).sort((a, b) =>
    a.localeCompare(b, 'tr-TR')
  )

  const groupedAndSortedList = sortedCountries.map((country) => groupedTemsilcilikler[country])

  // Mevcut benzersiz şehirleri çıkar (Selectbox/Tab için)
  const mevcutSehirler = Array.from(new Set(temsilcilikler.map((t) => t.sehir).filter(Boolean)))

  return {
    temsilciliklerGrup: groupedAndSortedList,
    temsilcilikler: filterliListe, // Orijinal düz liste, TemsilcilikModal vb. işlemler için tutulabilir
    loading,
    error,
    aramaMetni,
    setAramaMetni,
    secilenSehir,
    setSecilenSehir,
    mevcutSehirler,
    imgHatalari,
    setImgHatalari,
    getFlagByName,
    temsilcilikEkle,
    temsilcilikGuncelle,
    temsilcilikSil,
    yenile: fetchTemsilcilikler,
    varsayilanlariYukle
  }
}
