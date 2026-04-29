import { useState, useEffect, ReactElement } from 'react'
import {
  Plus, Trash2, FileText, X, ChevronDown, ChevronUp,
  UserCheck, AlertCircle, Settings, RefreshCw, Users, CheckCircle, Eraser
} from 'lucide-react'

interface TerfiSatiri {
  id: number
  ad_soyad: string
  sicil_no: string
  gorev_yeri_unvani: string
  kadro: string
  almakta: string
  emekli_muktesep: string
  kazanilan: string
  gecerlilik: string
  aciklamalar: string
}

const BOŞ_SATIR = (): TerfiSatiri => ({
  id: Date.now() + Math.random(),
  ad_soyad: '', sicil_no: '',
  gorev_yeri_unvani: 'Kapaklı İlçe Nüfus Müdürlüğü V.H.K.İ.',
  kadro: '', almakta: '', emekli_muktesep: '', kazanilan: '', gecerlilik: '',
  aciklamalar: '657 S.D.M. Kanununun 64.maddesi'
})

const bugunAy = (): { baslangic: string; bitis: string } => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const son = new Date(y, now.getMonth() + 1, 0).getDate()
  return { baslangic: `${y}-${m}-01`, bitis: `${y}-${m}-${String(son).padStart(2,'0')}` }
}

const formatTarihTR = (iso: string): string => {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${parseInt(d)}.${parseInt(m)}.${y}`
}

// Bir sonraki derece/kademeyi hesapla (657 sayılı kanun basit kademe artışı)
const hesaplaKazanilan = (derece: string, kademe: string): string => {
  const d = parseInt(derece)
  const k = parseInt(kademe)
  if (!d || !k) return ''
  return `${d}/${k + 1}`
}

const personeldenSatirYap = (p: any): TerfiSatiri => ({
  id: Date.now() + Math.random(),
  ad_soyad: p.ad_soyad || '',
  sicil_no: String(p.sicil_no || ''),
  gorev_yeri_unvani: `Kapaklı İlçe Nüfus Müdürlüğü ${p.unvan || ''}`.trim(),
  kadro: String(p.derece || ''),
  almakta: `${p.derece || ''}/${p.kademe || ''}`,
  emekli_muktesep: `${p.derece || ''}/${p.kademe || ''}`,
  kazanilan: hesaplaKazanilan(String(p.derece || ''), String(p.kademe || '')),
  gecerlilik: p.sonraki_terfi || p.terfi_tarihi || '',
  aciklamalar: '657 S.D.M. Kanununun 64.maddesi'
})

export const DereceTerfiView = (): ReactElement => {
  const { baslangic: initBas, bitis: initBit } = bugunAy()
  const [donemBas, setDonemBas] = useState(initBas)
  const [donemBit, setDonemBit] = useState(initBit)
  const [satirlar, setSatirlar] = useState<TerfiSatiri[]>([BOŞ_SATIR()])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [cekYukleniyor, setCekYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)
  const [basari, setBasari] = useState<string | null>(null)
  const [imzaAcik, setImzaAcik] = useState(false)
  const [cekMenuAcik, setCekMenuAcik] = useState(false)

  const [teklif_eden_ad, setTeklifEdenAd] = useState('')
  const [teklif_eden_unvan, setTeklifEdenUnvan] = useState('İlçe Nüfus Müdürü')
  const [onaylayan_ad, setOnaylayanAd] = useState('')
  const [onaylayan_unvan, setOnaylayanUnvan] = useState('Kaymakam')
  const [onay_tarihi, setOnayTarihi] = useState('')

  // Sayfa açılışında sadece imza bilgilerini yükle
  useEffect(() => {
    const imzaYukle = async (): Promise<void> => {
      try {
        if (window.api?.getSetting) {
          const md = await window.api.getSetting('mudur_adi')
          if (md) setTeklifEdenAd(md)
          const km = await window.api.getSetting('kaymakam_adi')
          if (km) setOnaylayanAd(km)
        }
      } catch { /* sessiz */ }
    }
    imzaYukle()
  }, [])

  // ── Personel Çekme Fonksiyonları ──────────────────────────
  const personelCek = async (sadeceDönem: boolean): Promise<void> => {
    setCekMenuAcik(false)
    setCekYukleniyor(true)
    setHata(null)
    try {
      if (!window.api?.getPersoneller) throw new Error('Personel servisi bulunamadı.')
      const data: any[] = await window.api.getPersoneller()
      if (!data || data.length === 0) throw new Error('Terfi modülünde personel kaydı yok.')

      const liste = sadeceDönem
        ? data.filter((p: any) => {
            const st = p.sonraki_terfi || p.terfi_tarihi
            return st && st >= donemBas && st <= donemBit
          })
        : data

      if (sadeceDönem && liste.length === 0) {
        setHata(`${formatTarihTR(donemBas)} – ${formatTarihTR(donemBit)} döneminde terfi tarihi olan personel bulunamadı.`)
        return
      }

      setSatirlar(liste.map(personeldenSatirYap))
      setBasari(`${liste.length} personel yüklendi.${sadeceDönem ? ' (Dönem filtreli)' : ' (Tüm personel)'}`)
      setTimeout(() => setBasari(null), 3000)
    } catch (e: any) {
      setHata(e?.message || 'Personel yükleme hatası.')
    } finally {
      setCekYukleniyor(false)
    }
  }

  // ── Satır İşlemleri ───────────────────────────────────────
  const satirGuncelle = (id: number, alan: keyof TerfiSatiri, deger: string): void =>
    setSatirlar(prev => prev.map(s => s.id === id ? { ...s, [alan]: deger } : s))

  const satirEkle = (): void => setSatirlar(prev => [...prev, BOŞ_SATIR()])

  const satirSil = (id: number): void => {
    if (satirlar.length === 1) return
    setSatirlar(prev => prev.filter(s => s.id !== id))
  }

  // ── PDF ───────────────────────────────────────────────────
  const pdfOlustur = async (): Promise<void> => {
    const dolu = satirlar.filter(s => s.ad_soyad.trim())
    if (dolu.length === 0) { setHata('En az bir personel satırı doldurulmalıdır.'); return }
    setYukleniyor(true); setHata(null); setBasari(null)
    try {
      const resultStr = await window.api.createPdfTerfi({
        tip: 'DERECE_TERFI_LISTE', liste: dolu,
        donem_bas: donemBas, donem_bit: donemBit,
        teklif_eden_ad, teklif_eden_unvan,
        onaylayan_ad, onaylayan_unvan, onay_tarihi
      })
      const res = JSON.parse(resultStr)
      if (res.success) { await window.api.openFile(res.path); setBasari('PDF oluşturuldu.') }
      else setHata(res.error || 'PDF oluşturulamadı.')
    } catch (e: any) {
      setHata(e?.message || 'PDF oluşturma hatası.')
    } finally { setYukleniyor(false) }
  }

  const col = 'px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold outline-none focus:border-indigo-500 dark:text-white w-full transition-colors'

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50" onClick={() => cekMenuAcik && setCekMenuAcik(false)}>

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <UserCheck size={22} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Derece Terfi Listesi</h1>
            </div>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest ml-13">Onaya Sunulacak Terfi Teklif Belgesi</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Dönem */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2.5 shadow-sm">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">AİT OLDUĞU AY</span>
              <input type="date" value={donemBas} onChange={e => setDonemBas(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none dark:text-white" />
              <span className="text-gray-400 font-bold">—</span>
              <input type="date" value={donemBit} onChange={e => setDonemBit(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none dark:text-white" />
            </div>

            {/* Personel Çek butonu + dropdown */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setCekMenuAcik(!cekMenuAcik)}
                disabled={cekYukleniyor}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {cekYukleniyor
                  ? <RefreshCw size={14} strokeWidth={2.5} className="animate-spin" />
                  : <Users size={14} strokeWidth={2.5} />
                }
                {cekYukleniyor ? 'Yükleniyor...' : 'Personel Çek'}
                <ChevronDown size={12} className={`transition-transform ${cekMenuAcik ? 'rotate-180' : ''}`} />
              </button>

              {cekMenuAcik && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => personelCek(true)}
                    className="w-full flex items-start gap-3 px-5 py-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <CheckCircle size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-gray-200">Dönem Filtreli Çek</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                        {formatTarihTR(donemBas)} – {formatTarihTR(donemBit)} arasında terfi tarihi olan personeli getirir
                      </p>
                    </div>
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />
                  <button
                    onClick={() => personelCek(false)}
                    className="w-full flex items-start gap-3 px-5 py-4 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                      <Users size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 dark:text-gray-200">Tüm Personeli Çek</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Terfi modülündeki tüm personeli listeler</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setImzaAcik(!imzaAcik)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-black text-gray-500 hover:text-indigo-600 transition-all shadow-sm">
              <Settings size={14} strokeWidth={2.5} />
              İmza Bilgileri
              {imzaAcik ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <button onClick={satirEkle}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-black text-gray-500 hover:text-blue-600 transition-all shadow-sm">
              <Plus size={14} strokeWidth={3} /> Satır Ekle
            </button>

            <button
              onClick={() => setSatirlar([BOŞ_SATIR()])}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-2xl text-xs font-black text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all shadow-sm"
            >
              <Eraser size={14} strokeWidth={2.5} /> Listeyi Temizle
            </button>

            <button onClick={pdfOlustur} disabled={yukleniyor}
              className="flex items-center gap-2.5 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-95 text-xs font-black uppercase tracking-widest disabled:opacity-50">
              <FileText size={16} strokeWidth={2.5} />
              {yukleniyor ? 'Hazırlanıyor...' : 'PDF Oluştur'}
            </button>
          </div>
        </div>

        {/* İMZA PANELİ */}
        {imzaAcik && (
          <div className="max-w-[1700px] mx-auto px-8 pb-5 animate-in slide-in-from-top-2 duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teklif Eden Adı Soyadı</label>
                <input value={teklif_eden_ad} onChange={e => setTeklifEdenAd(e.target.value)} placeholder="Ad Soyad" className={col} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unvanı</label>
                <input value={teklif_eden_unvan} onChange={e => setTeklifEdenUnvan(e.target.value)} className={col} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Onaylayan Adı Soyadı</label>
                <input value={onaylayan_ad} onChange={e => setOnaylayanAd(e.target.value)} placeholder="Ad Soyad" className={col} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Onay Tarihi</label>
                <input type="date" value={onay_tarihi} onChange={e => setOnayTarihi(e.target.value)} className={col + ' appearance-none'} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BİLDİRİMLER */}
      <div className="max-w-[1700px] mx-auto w-full px-8 pt-4 space-y-2">
        {hata && (
          <div className="flex items-center gap-2 px-5 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
            <AlertCircle size={16} /> {hata}
            <button onClick={() => setHata(null)} className="ml-auto"><X size={14} /></button>
          </div>
        )}
        {basari && (
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-bold">
            <CheckCircle size={16} /> {basari}
          </div>
        )}
      </div>

      {/* TABLO */}
      <div className="flex-1 max-w-[1700px] mx-auto w-full px-8 py-4 overflow-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50/90 dark:bg-gray-800/90">
                  {['#','ADI SOYADI','SİCİL NO','GÖREV YERİ ÜNVANI','KADRO','ALMAKTA','EMEKLİ MÜKTESEP','KAZANILAN','GEÇERLİLİK','AÇIKLAMALAR',''].map((h, i) => (
                    <th key={i} className="px-3 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
                {satirlar.map((satir, idx) => (
                  <tr key={satir.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-all group">
                    <td className="px-3 py-2 text-center w-8">
                      <span className="text-xs font-black text-gray-400">{idx + 1}</span>
                    </td>
                    <td className="px-2 py-2 min-w-[130px]">
                      <input value={satir.ad_soyad} onChange={e => satirGuncelle(satir.id, 'ad_soyad', e.target.value)} placeholder="Adı Soyadı" className={col} />
                    </td>
                    <td className="px-2 py-2 w-20">
                      <input value={satir.sicil_no} onChange={e => satirGuncelle(satir.id, 'sicil_no', e.target.value)} placeholder="247" className={col + ' text-center'} />
                    </td>
                    <td className="px-2 py-2 min-w-[190px]">
                      <input value={satir.gorev_yeri_unvani} onChange={e => satirGuncelle(satir.id, 'gorev_yeri_unvani', e.target.value)} className={col} />
                    </td>
                    <td className="px-2 py-2 w-14">
                      <input value={satir.kadro} onChange={e => satirGuncelle(satir.id, 'kadro', e.target.value)} placeholder="4" className={col + ' text-center'} />
                    </td>
                    <td className="px-2 py-2 w-18">
                      <input value={satir.almakta} onChange={e => satirGuncelle(satir.id, 'almakta', e.target.value)} placeholder="4/1" className={col + ' text-center'} />
                    </td>
                    <td className="px-2 py-2 w-22">
                      <input value={satir.emekli_muktesep} onChange={e => satirGuncelle(satir.id, 'emekli_muktesep', e.target.value)} placeholder="4/1" className={col + ' text-center'} />
                    </td>
                    <td className="px-2 py-2 w-18">
                      <input value={satir.kazanilan} onChange={e => satirGuncelle(satir.id, 'kazanilan', e.target.value)} placeholder="4/2" className={col + ' text-center font-mono'} />
                    </td>
                    <td className="px-2 py-2 w-28">
                      <input type="date" value={satir.gecerlilik} onChange={e => satirGuncelle(satir.id, 'gecerlilik', e.target.value)} className={col + ' appearance-none'} />
                    </td>
                    <td className="px-2 py-2 min-w-[170px]">
                      <input value={satir.aciklamalar} onChange={e => satirGuncelle(satir.id, 'aciklamalar', e.target.value)} placeholder="657 S.D.M. Kanununun..." className={col} />
                    </td>
                    <td className="px-2 py-2 w-10 text-center">
                      <button onClick={() => satirSil(satir.id)} disabled={satirlar.length === 1}
                        className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-20 mx-auto opacity-0 group-hover:opacity-100">
                        <Trash2 size={13} strokeWidth={2.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-gray-800/30">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {satirlar.filter(s => s.ad_soyad).length} personel  ·  {formatTarihTR(donemBas)} — {formatTarihTR(donemBit)}
            </span>
            <button onClick={satirEkle} className="flex items-center gap-1.5 text-[11px] font-black text-blue-500 hover:text-blue-700 transition-colors">
              <Plus size={13} strokeWidth={3} /> Satır Ekle
            </button>
          </div>
        </div>

        <div className="mt-4 px-5 py-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl">
          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            <strong>Personel Çek</strong> butonu ile Terfi modülünden otomatik veri alınır.
            "Dönem Filtreli" seçeneği yalnızca seçili ayda terfi tarihi gelenleri listeler.
            Kazanılan derece/kademe otomatik hesaplanır, gerekirse düzenleyebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
