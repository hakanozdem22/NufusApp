import { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Edit2,
  Trash2,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Printer,
  Loader2,
  UserPlus,
  UserMinus
} from 'lucide-react'

// Veri Tipleri
interface Harcama {
  id: number
  baslik: string
  tutar: number
  kategori: string
  tarih: string
  tur: 'GELIR' | 'GIDER'
}

interface PersonelItem {
  id: number
  ad_soyad: string
  kaynak: 'GLOBAL' | 'YEREL'
}

export const HarcamaListesi = () => {
  // --- STATE TANIMLARI ---
  const [liste, setListe] = useState<Harcama[]>([])
  const [personeller, setPersoneller] = useState<PersonelItem[]>([])
  const [ozet, setOzet] = useState({ devir: 0, gelir: 0, gider: 0, kasa: 0 })
  const [yukleniyor, setYukleniyor] = useState(false)
  const [raporTuru, setRaporTuru] = useState<'TUMU' | 'GELIR' | 'GIDER'>('TUMU')

  // Gider Formu
  const [editId, setEditId] = useState<number | null>(null)
  const [giderBaslik, setGiderBaslik] = useState('')
  const [giderTutar, setGiderTutar] = useState('')

  // Personel Ekleme
  const [yeniPersonelAd, setYeniPersonelAd] = useState('')

  // Gelir Girişi
  const [gelirInputlari, setGelirInputlari] = useState<{ [key: string]: string }>({})

  // Ortak
  const [tarih, setTarih] = useState(new Date().toISOString().split('T')[0])

  // BİLDİRİM & MODAL STATE'LERİ (ALERT YERİNE)
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)
  const [silinecekHarcamaId, setSilinecekHarcamaId] = useState<number | null>(null) // Harcama Silme İçin
  const [silinecekPersonel, setSilinecekPersonel] = useState<{ id: number; kaynak: string } | null>(
    null
  ) // Personel Silme İçin

  // --- TARİH ---
  const [referansTarih, setReferansTarih] = useState(new Date())
  const donemHesapla = (refDate: Date) => {
    const yil = refDate.getFullYear()
    const ay = refDate.getMonth()
    const gun = refDate.getDate()
    let baslangic, bitis
    if (gun < 15) {
      baslangic = new Date(yil, ay - 1, 15)
      bitis = new Date(yil, ay, 14)
    } else {
      baslangic = new Date(yil, ay, 15)
      bitis = new Date(yil, ay + 1, 14)
    }
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { bas: fmt(baslangic), bit: fmt(bitis), basObj: baslangic, bitObj: bitis }
  }
  const donem = donemHesapla(referansTarih)
  const baslikTarih = `${donem.basObj.getDate()} ${donem.basObj.toLocaleDateString('tr-TR', { month: 'long' })} - ${donem.bitObj.getDate()} ${donem.bitObj.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`

  // Bildirim Gösterici (Alert Yerine)
  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  // --- VERİ ÇEKME ---
  const verileriGetir = async () => {
    try {
      const { bas, bit } = donemHesapla(referansTarih)
      if (!window.api) return

      // Harcamaları Çek
      const gelenListe = await window.api.getHarcamalarByMonth({ baslangic: bas, bitis: bit })
      const devir = await window.api.getDevirBakiyesi(bas)

      // Hesaplamalar
      const buAyGelir = gelenListe
        .filter((x: any) => x.tur === 'GELIR')
        .reduce((acc: number, curr: any) => acc + curr.tutar, 0)
      const buAyGider = gelenListe
        .filter((x: any) => x.tur === 'GIDER')
        .reduce((acc: number, curr: any) => acc + curr.tutar, 0)

      setListe(gelenListe)
      setOzet({
        devir: devir,
        gelir: buAyGelir,
        gider: buAyGider,
        kasa: devir + (buAyGelir - buAyGider)
      })
      setGelirInputlari({})

      // Personel Listesini Oluştur (Sabit Liste + Bu Ay İşlem Görenler)
      const sabitPersoneller = await window.api.getHarcamaSabitPersoneller()

      // Bu ay gelir kaydı olan herkesi bul
      const islemGorenIsimler = new Set(
        gelenListe.filter((x: any) => x.tur === 'GELIR').map((x: any) => x.baslik)
      )

      // Sabit listedekileri ekle
      const birlesikListe: PersonelItem[] = sabitPersoneller.map((p: any) => ({
        id: p.id,
        ad_soyad: p.ad_soyad,
        kaynak: 'GLOBAL' // Artık hepsi "Sabit/Global" muamelesi görebilir
      }))

      // Listede olmayan ama işlem görenleri ekle (Manuel eklenmiş veya silinmiş ama kaydı duran)
      islemGorenIsimler.forEach((isim) => {
        if (!birlesikListe.find((p) => p.ad_soyad === isim)) {
          birlesikListe.push({
            id: -1, // Geçici ID
            ad_soyad: isim as string,
            kaynak: 'YEREL' // "Listede Yok" anlamında
          })
        }
      })

      // İsme göre sırala
      birlesikListe.sort((a, b) => a.ad_soyad.localeCompare(b.ad_soyad))
      setPersoneller(birlesikListe)
    } catch (error) {
      console.error(error)
      mesajGoster('Veri çekme hatası: ' + error, 'hata')
    }
  }

  // Debug için: Liste değiştiğinde logla
  useEffect(() => {
    console.log('Personel Listesi Güncellendi:', personeller)
  }, [personeller])

  useEffect(() => {
    verileriGetir()
  }, [referansTarih])

  const ayDegistir = (yon: number) => {
    const yeni = new Date(referansTarih)
    yeni.setMonth(yeni.getMonth() + yon)
    setReferansTarih(yeni)
  }

  // --- HARCAMA PERSONEL İŞLEMLERİ ---
  const harcamaPersonelEkle = async () => {
    if (!yeniPersonelAd.trim()) return mesajGoster('İsim giriniz.', 'hata')
    try {
      // Artık direkt ayarlar listesine ekliyoruz
      await window.api.addHarcamaSabitPersonel(yeniPersonelAd)
      setYeniPersonelAd('')
      verileriGetir()
      mesajGoster('Kişi listeye ve ayarlara eklendi.')
    } catch (e) {
      mesajGoster('Hata oluştu veya kişi zaten var.', 'hata')
    }
  }

  // Personel Silme Butonuna Basınca (Modal Aç)
  const personelSilButonu = (id: number, kaynak: string) => {
    // Eğer kaynak YEREL ise (listede yok ama işlemi var), sadece listeden gizle (aslında işlem yapmadıkça zaten görünmeyecek)
    // Eğer kaynak GLOBAL ise (sabit listede), kalıcı silinsin mi sorusu
    setSilinecekPersonel({ id, kaynak })
  }

  // Personel Silme Onayı (Modal'dan Gelen)
  const personelSilmeOnayla = async () => {
    if (!silinecekPersonel) return
    try {
      if (silinecekPersonel.id !== -1) {
        await window.api.deleteHarcamaSabitPersonel(silinecekPersonel.id)
        mesajGoster('Kişi ayarlar listesinden çıkarıldı.')
      } else {
        // Kaydı varsa silinemez uyarısı veya sadece görünümden kalkması (render mantığında zaten kalkar)
        mesajGoster('Bu kişi sabit listede değil, sadece işlem kaydı var.', 'hata')
      }
      verileriGetir()
    } catch (e) {
      mesajGoster('Silme hatası.', 'hata')
    } finally {
      setSilinecekPersonel(null)
    }
  }

  // --- PDF ---
  const pdfAl = async () => {
    if (liste.length === 0) return mesajGoster('Kayıt yok.', 'hata')
    setYukleniyor(true)
    let yazdirilacakListe = liste
    if (raporTuru === 'GELIR') yazdirilacakListe = liste.filter((x) => x.tur === 'GELIR')
    else if (raporTuru === 'GIDER') yazdirilacakListe = liste.filter((x) => x.tur === 'GIDER')

    if (yazdirilacakListe.length === 0) {
      setYukleniyor(false)
      return mesajGoster('Kayıt bulunamadı.', 'hata')
    }

    try {
      const resultStr = await window.api.createPdfHarcama({
        liste: yazdirilacakListe,
        ozet: ozet,
        donem: baslikTarih,
        rapor_turu: raporTuru
      })

      const res = JSON.parse(resultStr)
      if (res.success) {
        mesajGoster('Rapor oluşturuldu.')
      } else {
        throw new Error(res.error || 'PDF oluşturulamadı.')
      }
    } catch (e: any) {
      console.error(e)
      mesajGoster('PDF hatası: ' + e.message, 'hata')
    } finally {
      setYukleniyor(false)
    }
  }

  // --- GİDER CRUD ---
  const giderFormuTemizle = () => {
    setEditId(null)
    setGiderBaslik('')
    setGiderTutar('')
  }

  const giderKaydet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!giderBaslik || !giderTutar) return mesajGoster('Eksik bilgi.', 'hata')

    const veri = {
      baslik: giderBaslik,
      tutar: parseFloat(giderTutar),
      kategori: 'Genel',
      tarih,
      tur: 'GIDER'
    }
    try {
      if (editId) await window.api.updateHarcama({ id: editId, ...veri })
      else await window.api.addHarcama(veri)
      giderFormuTemizle()
      await verileriGetir()
      mesajGoster(editId ? 'Gider güncellendi.' : 'Gider eklendi.')
    } catch {
      mesajGoster('Hata.', 'hata')
    }
  }

  const giderDuzenle = (item: any) => {
    setEditId(item.id)
    setGiderBaslik(item.baslik)
    setGiderTutar(item.tutar.toString())
    setTarih(item.tarih)
  }

  // --- GELİR CRUD ---
  const getPersonelGelirKaydi = (adSoyad: string) =>
    liste.find((x) => x.tur === 'GELIR' && x.baslik === adSoyad)

  const satirKaydet = async (adSoyad: string) => {
    const girilen = gelirInputlari[adSoyad]
    const mevcut = getPersonelGelirKaydi(adSoyad)
    if (!girilen && !mevcut) return

    // Eğer tutar boş veya 0 ise ve kayıt varsa sil
    if ((!girilen || parseFloat(girilen) === 0) && mevcut) {
      setSilinecekHarcamaId(mevcut.id) // Silme modalını aç
      return
    }

    const tutar = parseFloat(girilen || mevcut?.tutar.toString() || '0')
    try {
      if (mevcut)
        await window.api.updateHarcama({
          id: mevcut.id,
          baslik: adSoyad,
          tutar,
          kategori: 'Aidat/Gelir',
          tarih: mevcut.tarih,
          tur: 'GELIR'
        })
      else
        await window.api.addHarcama({
          baslik: adSoyad,
          tutar,
          kategori: 'Aidat/Gelir',
          tarih,
          tur: 'GELIR'
        })

      await verileriGetir()
      const tmp = { ...gelirInputlari }
      delete tmp[adSoyad]
      setGelirInputlari(tmp)
      mesajGoster('Gelir kaydedildi.')
    } catch (e) {
      mesajGoster('Hata.', 'hata')
    }
  }

  const harcamaSil = async (id: number) => {
    try {
      await window.api.deleteHarcama(id)
      if (editId === id) giderFormuTemizle()
      await verileriGetir()
      setSilinecekHarcamaId(null)
      mesajGoster('Silindi.')
    } catch {
      mesajGoster('Silme hatası.', 'hata')
    }
  }

  const harcamaSilmeOnayiVer = async () => {
    if (silinecekHarcamaId) await harcamaSil(silinecekHarcamaId)
  }

  const giderler = liste.filter((x) => x.tur === 'GIDER')

  return (
    <div className="p-6 space-y-4 flex flex-col h-full overflow-hidden relative box-border bg-gray-50/30 dark:bg-gray-900">
      {/* BİLDİRİM ÇUBUĞU */}
      {bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {bildirim.tur === 'basari' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{bildirim.mesaj}</span>
        </div>
      )}

      {/* HARCAMA SİLME MODALI */}
      {silinecekHarcamaId !== null && (
        <div className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border dark:border-gray-700 w-80 text-center animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Harcamayı Sil?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">Bu işlem geri alınamaz.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSilinecekHarcamaId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-medium"
              >
                Vazgeç
              </button>
              <button
                onClick={harcamaSilmeOnayiVer}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERSONEL ÇIKARMA MODALI */}
      {silinecekPersonel !== null && (
        <div className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border dark:border-gray-700 w-80 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <UserMinus size={24} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
              Kişiyi Listeden Çıkar?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">
              Bu kişiyi ({silinecekPersonel.kaynak === 'YEREL' ? 'Yerel' : 'Global'}) harcama
              listesinden gizlemek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSilinecekPersonel(null)}
                className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Vazgeç
              </button>
              <button
                onClick={personelSilmeOnayla}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
              >
                Çıkar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÜST BİLGİ */}
      <div className="flex justify-center items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0 relative">
        <div className="flex items-center gap-2">
          <button
            onClick={() => ayDegistir(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
          >
            <ChevronLeft />
          </button>
          <div className="text-center w-64">
            <h2 className="text-sm font-bold uppercase text-gray-800 dark:text-gray-100">
              {baslikTarih}
            </h2>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              FİNANSAL DÖNEM
            </div>
          </div>
          <button
            onClick={() => ayDegistir(1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* ÖZET KARTLARI */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Devir</div>
          <div className="font-bold text-xl text-gray-700 dark:text-gray-200">
            {ozet.devir.toFixed(2)} ₺
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
          <div className="text-xs text-green-700 dark:text-green-400 uppercase font-bold">
            Gelir
          </div>
          <div className="font-bold text-xl text-green-700 dark:text-green-400">
            +{ozet.gelir.toFixed(2)} ₺
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 shadow-sm">
          <div className="text-xs text-red-700 dark:text-red-400 uppercase font-bold">Gider</div>
          <div className="font-bold text-xl text-red-700 dark:text-red-400">
            -{ozet.gider.toFixed(2)} ₺
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="text-xs text-blue-700 dark:text-blue-400 uppercase font-bold">Kasa</div>
          <div className="font-bold text-xl text-blue-700 dark:text-blue-400">
            {ozet.kasa.toFixed(2)} ₺
          </div>
        </div>
      </div>

      {/* GİDER FORMU */}
      <div
        className={`p-4 rounded-xl border shrink-0 transition-colors shadow-sm flex flex-col gap-3 ${editId ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
      >
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
            {editId ? 'Gideri Düzenle' : 'Gider Girişi'}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">
              İşlem Tarihi:
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-600 p-1.5 rounded-lg text-sm outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
            />
          </div>
        </div>
        <form onSubmit={giderKaydet} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs ml-1 text-gray-500 dark:text-gray-400 font-medium">
              Gider Açıklaması
            </label>
            <input
              className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 dark:text-white"
              placeholder="Örn: Market alışverişi..."
              value={giderBaslik}
              onChange={(e) => setGiderBaslik(e.target.value)}
            />
          </div>
          <div className="w-32">
            <label className="text-xs ml-1 text-gray-500 dark:text-gray-400 font-medium">
              Tutar
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-700 dark:text-white"
              placeholder="0"
              value={giderTutar}
              onChange={(e) => setGiderTutar(e.target.value)}
            />
          </div>
          <button
            className={`px-6 py-2.5 rounded-lg text-white font-bold text-sm shadow hover:opacity-90 transition flex items-center gap-2 ${editId ? 'bg-orange-500' : 'bg-red-600'}`}
          >
            <Save size={18} /> {editId ? 'Güncelle' : 'Gider Ekle'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={giderFormuTemizle}
              className="p-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <XCircle size={20} />
            </button>
          )}
        </form>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0 overflow-hidden pb-4">
        {/* SOL: GİDER LİSTESİ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden shadow-sm">
          <div className="bg-red-50 dark:bg-red-900/20 p-3 text-center text-xs font-bold text-red-700 dark:text-red-400 uppercase border-b border-red-100 dark:border-red-900 shrink-0">
            Gider Listesi
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {giderler.length === 0 ? (
              <div className="text-center text-gray-400 text-sm mt-10">Kayıt yok.</div>
            ) : (
              giderler.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border-b border-gray-50 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm group transition"
                >
                  <div>
                    <div className="font-medium text-gray-700 dark:text-gray-200">
                      {item.baslik}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.tarih).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-600 dark:text-red-400">
                      -{item.tutar} ₺
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => giderDuzenle(item)}
                        className="text-blue-500 dark:text-blue-400 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setSilinecekHarcamaId(item.id)}
                        className="text-red-500 dark:text-red-400 p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAĞ: GELİR LİSTESİ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-hidden shadow-sm relative">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 text-center text-xs font-bold text-green-700 dark:text-green-400 uppercase border-b border-green-100 dark:border-green-900 shrink-0 flex items-center justify-between px-3">
            <span>Personel Gelir Durumu</span>
            <div className="flex items-center gap-1">
              <input
                className="border border-green-200 dark:border-green-800 rounded p-1 text-xs w-32 outline-none focus:border-green-500 bg-white dark:bg-gray-900 dark:text-white"
                placeholder="İsim Ekle..."
                value={yeniPersonelAd}
                onChange={(e) => setYeniPersonelAd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && harcamaPersonelEkle()}
              />
              <button
                onClick={harcamaPersonelEkle}
                className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                title="Sadece bu listeye ekle"
              >
                <UserPlus size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-16">
            {personeller.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10">Personel listeniz boş.</div>
            )}
            {personeller.map((p) => {
              const kayit = getPersonelGelirKaydi(p.ad_soyad)
              const inputDegeri =
                gelirInputlari[p.ad_soyad] !== undefined
                  ? gelirInputlari[p.ad_soyad]
                  : kayit
                    ? kayit.tutar.toString()
                    : ''
              return (
                <div
                  key={p.id}
                  className={`flex justify-between items-center p-3 border rounded-lg transition group ${kayit ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700'}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <button
                      onClick={() => personelSilButonu(p.id, p.kaynak)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span
                      className={`font-medium truncate ${kayit ? 'text-green-800 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'} ${p.kaynak === 'YEREL' ? 'italic' : ''}`}
                    >
                      {p.ad_soyad}{' '}
                      {p.kaynak === 'YEREL' && (
                        <span className="text-[9px] bg-gray-200 dark:bg-gray-600 px-1 rounded text-gray-500 dark:text-gray-300">
                          Yerel
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      className={`w-20 p-1.5 text-right text-sm border rounded outline-none focus:ring-2 ${kayit ? 'border-green-300 dark:border-green-800 focus:ring-green-500 font-bold text-green-700 dark:text-green-400 bg-white dark:bg-gray-800' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white'}`}
                      value={inputDegeri}
                      onChange={(e) =>
                        setGelirInputlari({ ...gelirInputlari, [p.ad_soyad]: e.target.value })
                      }
                    />
                    <button
                      onClick={() => satirKaydet(p.ad_soyad)}
                      className="p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition shadow-sm"
                    >
                      <Save size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-3 flex gap-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <select
              value={raporTuru}
              onChange={(e: any) => setRaporTuru(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-sm outline-none focus:border-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium"
            >
              <option value="TUMU">Tüm Rapor</option>
              <option value="GELIR">Sadece Gelirler</option>
              <option value="GIDER">Sadece Giderler</option>
            </select>
            <button
              onClick={pdfAl}
              disabled={yukleniyor}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition shadow-sm"
            >
              {yukleniyor ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}{' '}
              Rapor Al
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
