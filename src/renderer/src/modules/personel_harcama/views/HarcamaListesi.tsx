import { useState, useEffect, useCallback, ReactElement } from 'react'
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
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  CalendarDays,
  FileBarChart,
  FileText,
  Plus,
  History,
  Zap,
  ArrowRight
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

export const HarcamaListesi = (): ReactElement => {
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
  const [silinecekHarcamaId, setSilinecekHarcamaId] = useState<number | null>(null) // Harcama/Kayıt Silme İçin

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
  const verileriGetir = useCallback(async () => {
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
  }, [referansTarih])

  const ayDegistir = useCallback(
    (yon: number) => {
      const yeni = new Date(referansTarih)
      yeni.setMonth(yeni.getMonth() + yon)
      setReferansTarih(yeni)
    },
    [referansTarih]
  )

  useEffect(() => {
    verileriGetir()
  }, [verileriGetir])

  // --- HARCAMA PERSONEL İŞLEMLERİ ---
  const harcamaPersonelEkle = async () => {
    if (!yeniPersonelAd.trim()) return mesajGoster('İsim giriniz.', 'hata')
    try {
      await window.api.addHarcamaSabitPersonel(yeniPersonelAd)
      setYeniPersonelAd('')
      verileriGetir()
      mesajGoster('Kişi listeye ve ayarlara eklendi.')
    } catch {
      mesajGoster('Hata oluştu veya kişi zaten var.', 'hata')
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

    if ((!girilen || parseFloat(girilen) === 0) && mevcut) {
      setSilinecekHarcamaId(mevcut.id)
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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide py-3 px-4 max-w-[1600px] mx-auto w-full">
        
        {/* ÜST BİLGİ VE DÖNEM SEÇİCİ */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl flex flex-wrap justify-between items-center gap-4 relative overflow-hidden group mb-4">
           <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          
           <div className="flex items-center gap-4 relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black text-gray-800 dark:text-white tracking-tight leading-none mb-0.5 uppercase">
                  Harcama Yönetimi
                </h1>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic">
                   Personel aidat ve harcama takip sistemi
                </p>
              </div>
           </div>

           <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-inner">
             <button
               onClick={() => ayDegistir(-1)}
               className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 rounded-lg hover:bg-blue-500 hover:text-white shadow-sm transition-all active:scale-90"
             >
               <ChevronLeft size={20} strokeWidth={3} />
             </button>

             <div className="flex flex-col items-center px-6 text-center min-w-[200px]">
               <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1 text-center w-full">
                 AKTİF HESAP DÖNEMİ
               </span>
               <div className="text-xs font-black text-gray-700 dark:text-gray-200 uppercase tracking-tight">
                 {baslikTarih}
               </div>
             </div>

             <button
               onClick={() => ayDegistir(1)}
               className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-200 rounded-lg hover:bg-blue-500 hover:text-white shadow-sm transition-all active:scale-90"
             >
               <ChevronRight size={20} strokeWidth={3} />
             </button>
           </div>
        </div>

        {/* BİLDİRİM ÇUBUĞU */}
        {bildirim && (
          <div
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-lg shadow-2xl backdrop-blur-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 ${
              bildirim.tur === 'basari' 
                ? 'bg-green-500/90 border-green-400/50 text-white' 
                : 'bg-red-500/90 border-red-400/50 text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {bildirim.tur === 'basari' ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <AlertCircle size={22} strokeWidth={2.5} />}
            </div>
            <span className="font-black text-sm uppercase tracking-widest">{bildirim.mesaj}</span>
          </div>
        )}

        {/* HARCAMA SİLME MODALI */}
        {silinecekHarcamaId !== null && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-sm text-center animate-in zoom-in duration-300">
               <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-6 shadow-inner">
                 <Trash2 size={40} strokeWidth={2.5} />
               </div>
               <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-2 uppercase tracking-tight">Kayıt Silinsin mi?</h3>
               <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-8">Bu işlem geri alınamaz.</p>
               <div className="flex gap-4">
                 <button
                   onClick={() => setSilinecekHarcamaId(null)}
                   className="flex-1 py-4 px-6 rounded-xl bg-slate-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                 >
                   İPTAL
                 </button>
                 <button
                   onClick={harcamaSilmeOnayiVer}
                   className="flex-1 py-4 px-6 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-500/20 transition-all active:scale-95"
                 >
                   SİL
                 </button>
               </div>
            </div>
          </div>
        )}


        {/* ÖZET KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Devir Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-3 group hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 shadow-inner group-hover:bg-slate-200 transition-colors">
                <History size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Önceki Devir</p>
                <div className="text-base font-black text-gray-800 dark:text-white tracking-tighter">
                  {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(ozet.devir)} <span className="text-xs">₺</span>
                </div>
              </div>
            </div>

            {/* Gelir Card */}
            <div className="bg-emerald-600 p-3 rounded-lg shadow-xl shadow-emerald-500/20 flex items-center gap-3 group hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white shadow-inner">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-100/70 uppercase tracking-widest leading-none mb-1">Toplam Gelir</p>
                <div className="text-base font-black text-white tracking-tighter">
                  +{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(ozet.gelir)} <span className="text-xs opacity-70">₺</span>
                </div>
              </div>
            </div>

            {/* Gider Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-3 group hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/20 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner group-hover:bg-rose-100 transition-colors">
                <TrendingDown size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-black text-rose-400 dark:text-rose-500 uppercase tracking-widest leading-none mb-1">Toplam Gider</p>
                <div className="text-base font-black text-rose-600 dark:text-rose-400 tracking-tighter">
                  -{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(ozet.gider)} <span className="text-xs opacity-70">₺</span>
                </div>
              </div>
            </div>

            {/* Kasa Card */}
            <div className="bg-indigo-600 p-3 rounded-lg shadow-xl shadow-indigo-500/20 flex items-center gap-3 group hover:scale-[1.02] transition-all duration-300 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white shadow-inner relative z-10">
                <CreditCard size={20} strokeWidth={2.5} />
              </div>
              <div className="relative z-10">
                <p className="text-[9px] font-black text-indigo-100/70 uppercase tracking-widest leading-none mb-1">Kasa Bakiyesi</p>
                <div className="text-base font-black text-white tracking-tighter">
                  {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(ozet.kasa)} <span className="text-xs opacity-70">₺</span>
                </div>
              </div>
            </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 overflow-hidden pb-4">
            {/* SOL: GİDER LİSTESİ */}
            <div className="flex flex-col gap-6 min-h-0 overflow-hidden">
                {/* GİDER FORMU */}
                <div
                    className={`p-5 rounded-lg border backdrop-blur-xl transition-all duration-500 shadow-xl relative overflow-hidden group/form ${
                    editId 
                        ? 'bg-orange-600 border-orange-400 shadow-orange-500/20 text-white' 
                        : 'bg-white/80 dark:bg-gray-900/80 border-gray-100 dark:border-gray-800'
                    }`}
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-inner ${editId ? 'bg-white/20 text-white' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                                {editId ? <Edit2 size={20} strokeWidth={2.5} /> : <Zap size={20} strokeWidth={2.5} />}
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-sm font-black uppercase tracking-widest">
                                    {editId ? 'GİDERİ DÜZENLE' : 'YENİ GİDER KAYDI'}
                                </h2>
                                <p className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${editId ? 'text-orange-100' : 'text-gray-400 underline underline-offset-4 decoration-rose-500/30'}`}>
                                    {editId ? 'KAYIT GÜNCELLEME MODU' : 'HARCAMA BİLGİLERİ GİRİŞİ'}
                                </p>
                            </div>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all ${editId ? 'bg-white/10 border-white/20' : 'bg-slate-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-inner'}`}>
                             <CalendarDays size={14} className={editId ? 'text-white' : 'text-blue-500'} />
                             <input
                                type="date"
                                className="text-[10px] font-black outline-none bg-transparent dark:text-white cursor-pointer uppercase tracking-tighter"
                                value={tarih}
                                onChange={(e) => setTarih(e.target.value)}
                             />
                        </div>
                    </div>

                    <form onSubmit={giderKaydet} className="flex flex-col gap-4 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative group/input">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${editId ? 'text-white/60' : 'text-gray-400 group-focus-within/input:text-blue-500'}`}>
                                    <FileText size={16} strokeWidth={2.5} />
                                </div>
                                <input
                                    className={`w-full border-none pl-11 pr-4 py-2 rounded-lg text-xs font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all ${
                                        editId 
                                            ? 'bg-white/20 text-white placeholder-white/50 focus:bg-white/30' 
                                            : 'bg-slate-50 dark:bg-gray-800/80 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 shadow-inner'
                                    }`}
                                    placeholder="Harcama açıklaması..."
                                    value={giderBaslik}
                                    onChange={(e) => setGiderBaslik(e.target.value)}
                                />
                            </div>
                            
                            <div className="relative group/input">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${editId ? 'text-white/60' : 'text-gray-400 group-focus-within/input:text-emerald-500 font-black text-base'}`}>
                                    ₺
                                </div>
                                <input
                                    type="number"
                                    className={`w-full border-none pl-10 pr-4 py-2 rounded-lg text-xs font-black outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all text-right ${
                                        editId 
                                            ? 'bg-white/20 text-white placeholder-white/50 focus:bg-white/30' 
                                            : 'bg-slate-50 dark:bg-gray-800/80 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 shadow-inner'
                                    }`}
                                    placeholder="0.00"
                                    value={giderTutar}
                                    onChange={(e) => setGiderTutar(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={yukleniyor}
                                className={`flex-1 h-9 rounded-lg text-white font-black text-[10px] tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 ${
                                    editId 
                                        ? 'bg-white text-orange-600 shadow-white/10' 
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20'
                                }`}
                            >
                                <Save size={16} strokeWidth={3} />
                                {editId ? 'UYGULA' : 'KAYDET'}
                            </button>
                            
                            {editId && (
                                <button
                                    type="button"
                                    onClick={giderFormuTemizle}
                                    className="h-9 w-9 flex items-center justify-center bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all active:scale-90 shadow-inner"
                                    title="Moddan Çık"
                                >
                                    <XCircle size={18} strokeWidth={2.5} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col min-h-0 flex-1 overflow-hidden relative">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
                                <TrendingDown size={18} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-black text-gray-800 dark:text-white text-[11px] tracking-widest uppercase leading-none mb-1">
                                    Son Harcamalar
                                </h3>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Bu Ayın Gider Kalemleri</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm">
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest leading-none">
                                {giderler.length} İŞLEM
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-4">
                        {giderler.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-30 py-20">
                                <FileBarChart size={64} strokeWidth={1} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center italic">Henüz Bir Gider Kaydı Bulunmuyor</p>
                            </div>
                        ) : (
                             giderler.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-emerald-500/20 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all duration-300 shadow-sm"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 bg-rose-500/10 rounded-full flex flex-col justify-end overflow-hidden group-hover:bg-rose-500/30 transition-colors">
                                                 <div className="w-full h-1/2 bg-rose-500 rounded-full"></div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight group-hover:text-rose-600 transition-colors mb-1">
                                                    {item.baslik}
                                                </span>
                                                <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-70">
                                                    <CalendarDays size={12} className="text-blue-500" strokeWidth={3} />
                                                    {item.tarih.split('-').reverse().join('.')}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-3 relative z-10">
                                            <span className="font-black text-lg text-rose-600 dark:text-rose-400 tracking-tighter">
                                                -{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(item.tutar)} <span className="text-xs">₺</span>
                                            </span>
                                            
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                <button
                                                    onClick={() => giderDuzenle(item)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 text-blue-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 size={14} strokeWidth={2.5} />
                                                </button>
                                                <button
                                                    onClick={() => setSilinecekHarcamaId(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 text-rose-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-rose-600 hover:text-white transition-all active:scale-90"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={14} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* SAĞ: GELİR LİSTESİ (PERSONEL AİDAT) */}
            <div className="flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl min-h-0 overflow-hidden relative group/aidat">
                <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover/aidat:scale-125 transition-transform duration-1000"></div>

                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 dark:bg-gray-800/30 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                            <TrendingUp size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-black text-gray-800 dark:text-white text-[11px] tracking-widest uppercase leading-none mb-1">
                                Personel Aidat Takip
                            </h3>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none italic underline underline-offset-4 decoration-emerald-500/30">Gelir Kayıt Listesi</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto relative">
                        <div className="relative group/person">
                            <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/person:text-blue-500 transition-colors" />
                            <input
                                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-none pl-9 pr-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-tight outline-none ring-4 ring-transparent focus:ring-blue-500/10 w-full sm:w-40 transition-all dark:text-white shadow-inner placeholder-gray-400"
                                placeholder="YENİ İSİM..."
                                value={yeniPersonelAd}
                                onChange={(e) => setYeniPersonelAd(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && harcamaPersonelEkle()}
                            />
                        </div>
                        <button
                            onClick={harcamaPersonelEkle}
                            className="h-8 px-3 flex items-center justify-center bg-emerald-600 text-white rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group/plus"
                            title="Listeye Ekle"
                        >
                            <Plus size={18} strokeWidth={3} className="group-hover/plus:rotate-90 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-24 space-y-1.5 relative z-10">
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
                                className={`flex justify-between items-center py-1 px-2 rounded-lg border transition-all duration-300 group/item ${
                                    kayit 
                                        ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40 shadow-sm' 
                                        : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-blue-500/20 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[9px] transition-all shadow-inner ${
                                            kayit 
                                                ? 'bg-emerald-600 text-white shadow-emerald-500/30' 
                                                : 'bg-slate-100 dark:bg-gray-700 text-gray-400 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:shadow-lg group-hover/item:shadow-blue-500/20'
                                        }`}>
                                            {p.ad_soyad.charAt(0)}
                                        </div>
                                        {kayit && (
                                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full animate-pulse shadow-sm" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-black uppercase tracking-tight leading-none mb-0.5 ${kayit ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-200 group-hover/item:text-blue-600'} transition-colors`}>
                                            {p.ad_soyad}
                                        </span>
                                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">
                                            {p.kaynak === 'GLOBAL' ? 'SABİT PERSONEL' : 'HESAP KALEMİ'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative group/inp">
                                        <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-black text-[9px] transition-colors ${kayit ? 'text-emerald-600' : 'text-gray-400 group-focus-within/inp:text-blue-500'}`}>₺</span>
                                        <input
                                            type="number"
                                            className={`w-20 border-none pl-6 pr-2 py-1 rounded-lg text-[10px] font-black text-right outline-none transition-all shadow-inner ${
                                                kayit 
                                                    ? 'bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 focus:bg-white dark:focus:bg-gray-900 border border-emerald-200' 
                                                    : 'bg-slate-50 dark:bg-gray-900/80 dark:text-white focus:bg-white dark:focus:bg-gray-900 border border-transparent'
                                            }`}
                                            value={inputDegeri}
                                            onChange={(e) =>
                                                setGelirInputlari({ ...gelirInputlari, [p.ad_soyad]: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => satirKaydet(p.ad_soyad)}
                                            className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all shadow-sm active:scale-90 ${
                                                kayit
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                                                    : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10'
                                            }`}
                                            title="Kaydı Kaydet"
                                        >
                                            <Save size={14} strokeWidth={2.5} />
                                        </button>
                                        {kayit && (
                                          <button
                                              onClick={() => setSilinecekHarcamaId(kayit.id)}
                                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all opacity-0 group-hover/item:opacity-100"
                                              title="Kaydı Temizle/Sil"
                                          >
                                              <Trash2 size={14} strokeWidth={2.5} />
                                          </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {personeller.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-30 py-20">
                            <TrendingUp size={64} strokeWidth={1} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center italic">Henüz Bir Personel Kaydı Bulunmuyor</p>
                        </div>
                    )}
                </div>

                {/* PDF ALTSIRASI */}
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/10 p-2 flex gap-3 shadow-2xl rounded-lg z-20 group/report">
                    <div className="relative flex-1 group/sel">
                        <FileBarChart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within/sel:text-blue-400 pointer-events-none transition-colors" />
                        <select
                            value={raporTuru}
                            onChange={(e: any) => setRaporTuru(e.target.value)}
                            className="w-full bg-white/10 dark:bg-black/20 border border-white/10 pl-9 pr-8 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none transition-all text-white cursor-pointer"
                        >
                            <option value="TUMU" className="bg-gray-800">TAM LİSTE RAPORU</option>
                            <option value="GELIR" className="bg-gray-800">SADECE GELİRLER</option>
                            <option value="GIDER" className="bg-gray-800">SADECE GİDERLER</option>
                        </select>
                        <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 rotate-90 pointer-events-none" />
                    </div>
                    <button
                        onClick={pdfAl}
                        disabled={yukleniyor}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg text-[9px] font-black tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2 group/pdf"
                    >
                        {yukleniyor ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} strokeWidth={3} className="group-hover/pdf:scale-110 transition-transform" />}
                        PDF
                        <ArrowRight size={10} className="ml-1 opacity-50 group-hover/pdf:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
