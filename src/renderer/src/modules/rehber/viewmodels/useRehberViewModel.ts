import { useState, useEffect } from 'react'
import { Kisi } from '../models/rehber-types'

export const useRehberViewModel = () => {
  const [kisiler, setKisiler] = useState<Kisi[]>([])
  const [arama, setArama] = useState('')

  // Modal State
  const [modalAcik, setModalAcik] = useState(false)
  const [formId, setFormId] = useState<number | null>(null)
  const [formAd, setFormAd] = useState('')
  const [formTel, setFormTel] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formNot, setFormNot] = useState('')

  // Hata ve Kopyalama Bildirimi
  const [hata, setHata] = useState<string | null>(null)
  const [kopyalandiBilgi, setKopyalandiBilgi] = useState<{
    id: number
    tur: 'tel' | 'mail'
  } | null>(null)

  const verileriGetir = async () => {
    try {
      if (window.api) {
        const data = await window.api.getRehber()
        setKisiler(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    verileriGetir()
  }, [])

  const temizleVeKapat = () => {
    setFormId(null)
    setFormAd('')
    setFormTel('')
    setFormEmail('')
    setFormNot('')
    setHata(null)
    setModalAcik(false)
  }

  const kaydet = async (e: React.FormEvent) => {
    e.preventDefault()
    setHata(null)

    if (!formAd) return setHata('Lütfen bir isim giriniz.')
    if (!formTel && !formEmail) return setHata('Telefon veya E-posta en az biri girilmelidir.')

    const veri = { ad_soyad: formAd, telefon: formTel, email: formEmail, aciklama: formNot }

    try {
      if (formId) {
        await window.api.updateRehber({ ...veri, id: formId })
      } else {
        await window.api.addRehber(veri)
      }
      temizleVeKapat()
      verileriGetir()
    } catch (e) {
      console.error(e)
      setHata('Kayıt sırasında hata oluştu.')
    }
  }

  const sil = async (id: number) => {
    try {
      await window.api.deleteRehber(id)
      verileriGetir()
    } catch (e) {
      console.error(e)
    }
  }

  const duzenle = (kisi: Kisi) => {
    setFormId(kisi.id)
    setFormAd(kisi.ad_soyad)
    setFormTel(kisi.telefon || '')
    setFormEmail(kisi.email || '')
    setFormNot(kisi.aciklama || '')
    setHata(null)
    setModalAcik(true)
  }

  const panoyaKopyala = (text: string, id: number, tur: 'tel' | 'mail') => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setKopyalandiBilgi({ id, tur })
    setTimeout(() => setKopyalandiBilgi(null), 1500)
  }

  const filtrelenmis = kisiler.filter(
    (k) =>
      k.ad_soyad.toLowerCase().includes(arama.toLowerCase()) ||
      (k.telefon && k.telefon.includes(arama)) ||
      (k.email && k.email.toLowerCase().includes(arama.toLowerCase()))
  )

  return {
    arama,
    setArama,
    filtrelenmis,
    modalAcik,
    setModalAcik,
    temizleVeKapat,
    kaydet,
    sil,
    duzenle,
    panoyaKopyala,
    kopyalandiBilgi,
    // Form props
    formId,
    formAd,
    setFormAd,
    formTel,
    setFormTel,
    formEmail,
    setFormEmail,
    formNot,
    setFormNot,
    hata
  }
}
