import { useState, useEffect, useCallback } from 'react'
import { TurkTemsilcilik, ULKE_KODLARI } from '../models/turk-temsilcilik-types'
import { EKLENECEK_TURK_TEMSILCILIKLERI_DETAYLI } from '../models/turk-temsilcilik-data'

const flagImages = import.meta.glob('../../../assets/flags/*.{png,svg,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default'
})

export const useTurkTemsilcilikViewModel = () => {
  const [temsilcilikler, setTemsilcilikler] = useState<TurkTemsilcilik[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [aramaMetni, setAramaMetni] = useState('')

  const [imgHatalari, setImgHatalari] = useState<Record<string, boolean>>({})

  const fetchTemsilcilikler = useCallback(async () => {
    try {
      setLoading(true)
      const data = await window.api.getTurkTemsilcilikler()
      setTemsilcilikler(data)
      setError(null)
    } catch (err: any) {
      console.error('Türk temsilcilikleri çekerken hata:', err)
      setError('Veriler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTemsilcilikler()
  }, [fetchTemsilcilikler])

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

  const varsayilanlariYukle = async () => {
    setLoading(true)
    try {
      if (window.api) {
        const existingKeys = temsilcilikler.map(
          (t) =>
            `${t.ulke.toLocaleUpperCase('tr-TR').trim()}_${t.sehir.toLocaleUpperCase('tr-TR').trim()}`
        )

        const toAdd = EKLENECEK_TURK_TEMSILCILIKLERI_DETAYLI.filter(
          (data) =>
            !existingKeys.includes(
              `${data.ulke.toLocaleUpperCase('tr-TR').trim()}_${data.sehir.toLocaleUpperCase('tr-TR').trim()}`
            )
        )

        const toUpdate = temsilcilikler.filter((t) => !t.telefon || !t.adres)

        for (const data of toAdd) {
          await window.api.addTurkTemsilcilik(data)
        }

        const currentCountries = new Set(
          temsilcilikler.map((t) => t.ulke.toLocaleUpperCase('tr-TR').trim())
        )
        toAdd.forEach((d) => currentCountries.add(d.ulke.toLocaleUpperCase('tr-TR').trim()))

        const allCountries = Object.keys(ULKE_KODLARI)
        const toAddEmtpy = allCountries.filter((c) => !currentCountries.has(c))

        for (const ulke of toAddEmtpy) {
          await window.api.addTurkTemsilcilik({
            ulke,
            tip: 'Büyükelçilik',
            sehir: ulke, // Usually capital
            adres: `${ulke} Türk Büyükelçiliği, Büyükelçilik Caddesi No:1, ${ulke}`,
            telefon: '+90 312 292 10 00', // MFA Call center as placeholder
            eposta: `embassy.${ulke.toLowerCase().replace(/[^a-z]/g, '')}@mfa.gov.tr`,
            web_sitesi: `http://${ulke.toLowerCase().replace(/[^a-z]/g, '')}.emb.mfa.gov.tr`,
            bayrak_kodu: ''
          })
        }

        for (const existing of toUpdate) {
          const detay = EKLENECEK_TURK_TEMSILCILIKLERI_DETAYLI.find(
            (d) =>
              d.ulke.toLocaleUpperCase('tr-TR').trim() ===
                existing.ulke.toLocaleUpperCase('tr-TR').trim() &&
              d.sehir.toLocaleUpperCase('tr-TR').trim() ===
                existing.sehir.toLocaleUpperCase('tr-TR').trim()
          )
          if (detay) {
            await window.api.updateTurkTemsilcilik({ ...existing, ...detay, id: existing.id })
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

  const temsilcilikEkle = async (data: Omit<TurkTemsilcilik, 'id'>) => {
    try {
      await window.api.addTurkTemsilcilik(data)
      await fetchTemsilcilikler()
      return true
    } catch (err: any) {
      console.error('Türk Temsilcilik eklerken hata:', err)
      throw new Error(err.message || 'Temsilcilik eklenemedi')
    }
  }

  const temsilcilikGuncelle = async (data: TurkTemsilcilik) => {
    try {
      await window.api.updateTurkTemsilcilik(data)
      await fetchTemsilcilikler()
      return true
    } catch (err: any) {
      console.error('Türk Temsilcilik güncellerken hata:', err)
      throw new Error(err.message || 'Temsilcilik güncellenemedi')
    }
  }

  const temsilcilikSil = async (id: string) => {
    try {
      await window.api.deleteTurkTemsilcilik(id)
      await fetchTemsilcilikler()
      return true
    } catch (err: any) {
      console.error('Türk Temsilcilik silerken hata:', err)
      throw new Error(err.message || 'Temsilcilik silinemedi')
    }
  }

  const filterliListe = temsilcilikler.filter((t) => {
    const metinEslesti =
      t.ulke.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      t.sehir.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      (t.tip && t.tip.toLowerCase().includes(aramaMetni.toLowerCase()))
    return metinEslesti
  })

  const groupedTemsilcilikler: Record<string, TurkTemsilcilik[]> = {}
  filterliListe.forEach((t) => {
    const key = t.ulke.toLocaleUpperCase('tr-TR').trim()
    if (!groupedTemsilcilikler[key]) {
      groupedTemsilcilikler[key] = []
    }
    groupedTemsilcilikler[key].push(t)
  })

  const sortedCountries = Object.keys(groupedTemsilcilikler).sort((a, b) =>
    a.localeCompare(b, 'tr-TR')
  )

  const groupedAndSortedList = sortedCountries.map((country) => groupedTemsilcilikler[country])

  return {
    temsilciliklerGrup: groupedAndSortedList,
    temsilcilikler: filterliListe,
    loading,
    error,
    aramaMetni,
    setAramaMetni,
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
