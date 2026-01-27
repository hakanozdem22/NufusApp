import { useState, useEffect } from 'react'
import { ToastType } from '../../../shared/components/Toast'
import { Personel } from '../models/personel-terfi-types'

export const usePersonelTerfiViewModel = () => {
  const [personeller, setPersoneller] = useState<Personel[]>([])
  const [arama, setArama] = useState('')
  const [secilenler, setSecilenler] = useState<number[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: '',
    type: 'success'
  })

  // Toast Helper
  const showToast = (type: ToastType, message: string): void => {
    setToast({ show: true, type, message })
  }

  const verileriGetir = async (): Promise<void> => {
    try {
      if (window.api) {
        const data = await window.api.getPersoneller()
        setPersoneller(data)
      }
    } catch (e) {
      console.error(e)
      showToast('error', 'Personel listesi alınamadı.')
    }
  }

  useEffect(() => {
    verileriGetir()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtrelenenler = personeller.filter((p) =>
    p.ad_soyad.toLowerCase().includes(arama.toLowerCase())
  )

  // Seçim
  const tumunuSec = (): void => {
    if (secilenler.length === filtrelenenler.length) setSecilenler([])
    else setSecilenler(filtrelenenler.map((p) => p.id))
  }

  const tekSec = (id: number): void => {
    if (secilenler.includes(id)) setSecilenler(secilenler.filter((sid) => sid !== id))
    else setSecilenler([...secilenler, id])
  }

  // Modal State
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenlenecekPersonel, setDuzenlenecekPersonel] = useState<Personel | null>(null)

  // --- PDF RAPORLAMA ---
  const raporAl = async (): Promise<void> => {
    setYukleniyor(true)
    try {
      let veri: Personel[] = []

      // TERFI_LISTESI: Filtrelenmiş ve ekranda görünen (veya hak kazanan?) personeli yazdırır.
      // Kullanıcı "Seçilenler" mantığını kaldırdığı için doğrudan listedeki herkesi veya terfi hak edenleri alabiliriz.
      // Şimdilik filtrelenmiş listeyi baz alalım.
      veri = filtrelenenler

      if (window.api) {
        // Backend tarafında 'TERFI_LISTESI' tipini karşılayan logic olmalı, yoksa 'TERFI' olarak gönderip tüm listeyi mi verelim?
        // Güvenli olması için 'TERFI' tipini kullanıp tüm listeyi gönderelim.
        const resultStr = await window.api.createPdfTerfi({
          tip: 'TERFI', // Backend bu tipi biliyor
          liste: veri
        })

        try {
          const res = JSON.parse(resultStr)
          if (res.success) {
            await window.api.openFile(res.path)
            showToast('success', 'PDF oluşturuldu ve açılıyor.')
          } else {
            throw new Error(res.error || 'PDF oluşturulamadı.')
          }
        } catch (err: any) {
          console.error('PDF Yanıt Hatası:', err)
          // Eğer JSON değilse veya parse hatası ise
          if (err instanceof SyntaxError) {
            throw new Error('PDF motorundan geçersiz yanıt alındı.')
          }
          throw err
        }
      }
    } catch (e: any) {
      console.error('PDF Hatası:', e)
      // Hata mesajını backend'den al veya varsayılan göster
      const errMsg = e.message || e.toString() || 'Yazdırma işlemi sırasında bir hata oluştu.'
      showToast('error', errMsg.includes('Python') ? 'Python motoru başlatılamadı.' : errMsg)
    } finally {
      setYukleniyor(false)
    }
  }

  const duzenlemeyiBaslat = (personel: Personel | null) => {
    setDuzenlenecekPersonel(personel)
    setModalAcik(true)
  }

  const personelKaydet = async (data: any) => {
    try {
      if (window.api) {
        if (duzenlenecekPersonel && duzenlenecekPersonel.id) {
          // GÜNCELLEME
          await window.api.updatePersonel({ ...data, id: duzenlenecekPersonel.id })
          showToast('success', 'Personel güncellendi.')
        } else {
          // EKLEME
          await window.api.addPersonel(data)
          showToast('success', 'Personel eklendi.')
        }
        setModalAcik(false)
        setDuzenlenecekPersonel(null)
        verileriGetir()
      }
    } catch {
      showToast('error', 'İşlem sırasında hata oluştu.')
    }
  }

  return {
    personeller,
    arama,
    setArama,
    secilenler,
    yukleniyor,
    toast,
    setToast,
    filtrelenenler,
    tumunuSec,
    tekSec,
    raporAl,
    modalAcik,
    setModalAcik,
    personelKaydet, // İsim değişti: personelEkle -> personelKaydet
    duzenlenecekPersonel,
    duzenlemeyiBaslat
  }
}
