import { useState, useEffect } from 'react'
import { Harcama } from '../models/Harcama'

export const useHarcama = () => {
  const [kayitlar, setKayitlar] = useState<Harcama[]>([])
  const [devirBakiye, setDevirBakiye] = useState(0)
  const [seciliTarih, setSeciliTarih] = useState(new Date())

  const formatYilAy = (date: Date) => date.toISOString().slice(0, 7)
  const formatAyBasi = (date: Date) => `${formatYilAy(date)}-01`

  const fetchData = async () => {
    try {
      const yilAy = formatYilAy(seciliTarih)
      const ayBasi = formatAyBasi(seciliTarih)

      // window.api kullanıyoruz
      const ayKayitlari = await window.api.getHarcamalarByMonth(yilAy)
      const devir = await window.api.getDevir(ayBasi)

      setKayitlar(ayKayitlari)
      setDevirBakiye(devir)
    } catch (error) {
      console.error('Veri çekme hatası:', error)
    }
  }

  const addYeniKayit = async (yeniKayit: Harcama) => {
    try {
      await window.api.addHarcama(yeniKayit)
      await fetchData()
      return true
    } catch (error) {
      console.error('Ekleme hatası:', error)
      return false
    }
  }

  const oncekiAy = () => {
    const yeniTarih = new Date(seciliTarih)
    yeniTarih.setMonth(yeniTarih.getMonth() - 1)
    setSeciliTarih(yeniTarih)
  }

  const sonrakiAy = () => {
    const yeniTarih = new Date(seciliTarih)
    yeniTarih.setMonth(yeniTarih.getMonth() + 1)
    setSeciliTarih(yeniTarih)
  }

  useEffect(() => {
    fetchData()
  }, [seciliTarih])

  const buAyGelir = kayitlar
    .filter((x) => x.tur === 'GELIR')
    .reduce((acc, curr) => acc + curr.tutar, 0)
  const buAyGider = kayitlar
    .filter((x) => x.tur === 'GIDER')
    .reduce((acc, curr) => acc + curr.tutar, 0)
  const genelBakiye = devirBakiye + (buAyGelir - buAyGider)

  return {
    kayitlar,
    ozet: { devirBakiye, buAyGelir, buAyGider, genelBakiye },
    seciliTarih,
    addYeniKayit,
    oncekiAy,
    sonrakiAy,
    refresh: fetchData
  }
}
