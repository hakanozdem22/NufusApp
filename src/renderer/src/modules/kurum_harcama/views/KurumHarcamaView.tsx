import { useState, useEffect, useMemo, ReactElement } from 'react'
import {
  Plus, Search, Edit2, Trash2, X, Save, TrendingUp,
  TrendingDown, Wallet, AlertCircle, Filter, Tag,
  ChevronDown, ChevronUp, Building2
} from 'lucide-react'

interface KurumHarcama {
  id: string
  baslik: string
  tutar: number
  kategori: string
  tarih: string
  tur: 'GELIR' | 'GIDER'
  aciklama: string
}

interface Kategori {
  id: string
  ad: string
  tur: 'GELIR' | 'GIDER' | 'HER_IKISI'
}

type TabTur = 'TUMU' | 'GELIR' | 'GIDER'

const VARSAYILAN_KATEGORILER = [
  { ad: 'Personel', tur: 'GIDER' },
  { ad: 'Malzeme / Kırtasiye', tur: 'GIDER' },
  { ad: 'Bakım / Onarım', tur: 'GIDER' },
  { ad: 'Elektrik / Su / Doğalgaz', tur: 'GIDER' },
  { ad: 'İnternet / Telefon', tur: 'GIDER' },
  { ad: 'Ulaşım', tur: 'GIDER' },
  { ad: 'Eğitim', tur: 'GIDER' },
  { ad: 'Diğer Gider', tur: 'GIDER' },
  { ad: 'Bütçe Ödeneği', tur: 'GELIR' },
  { ad: 'Döner Sermaye', tur: 'GELIR' },
  { ad: 'Bağış / Yardım', tur: 'GELIR' },
  { ad: 'Diğer Gelir', tur: 'GELIR' },
]

const emptyForm = {
  baslik: '', tutar: '', kategori: '', tarih: new Date().toISOString().split('T')[0],
  tur: 'GIDER' as 'GELIR' | 'GIDER', aciklama: ''
}

const fmt = (n: number) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺'

export const KurumHarcamaView = (): ReactElement => {
  const [kayitlar, setKayitlar] = useState<KurumHarcama[]>([])
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])
  const [aktifTab, setAktifTab] = useState<TabTur>('TUMU')
  const [arama, setArama] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('Tümü')
  const [baslangic, setBaslangic] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]
  })
  const [bitis, setBitis] = useState(() => new Date().toISOString().split('T')[0])

  const [modalAcik, setModalAcik] = useState(false)
  const [kategoriModalAcik, setKategoriModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<KurumHarcama | null>(null)
  const [silOnay, setSilOnay] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [yeniKat, setYeniKat] = useState({ ad: '', tur: 'HER_IKISI' as Kategori['tur'] })
  const [silKatOnay, setSilKatOnay] = useState<string | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)

  const yukle = async (): Promise<void> => {
    try {
      const [data, kats] = await Promise.all([
        window.api.getKurumHarcamalar({ baslangic, bitis }),
        window.api.getKurumHarcamaKategoriler()
      ])
      setKayitlar(data || [])
      setKategoriler(kats || [])
    } catch (e: any) {
      console.error('Yükleme hatası:', e)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { yukle() }, [baslangic, bitis])

  const filtrelenmis = useMemo(() => {
    let res = kayitlar
    if (aktifTab !== 'TUMU') res = res.filter(k => k.tur === aktifTab)
    if (arama) {
      const q = arama.toLowerCase()
      res = res.filter(k => k.baslik.toLowerCase().includes(q) || k.kategori.toLowerCase().includes(q))
    }
    if (kategoriFilter !== 'Tümü') res = res.filter(k => k.kategori === kategoriFilter)
    return res
  }, [kayitlar, aktifTab, arama, kategoriFilter])

  const { toplamGelir, toplamGider, netBakiye } = useMemo(() => {
    const toplamGelir = kayitlar.filter(k => k.tur === 'GELIR').reduce((s, k) => s + Number(k.tutar), 0)
    const toplamGider = kayitlar.filter(k => k.tur === 'GIDER').reduce((s, k) => s + Number(k.tutar), 0)
    return { toplamGelir, toplamGider, netBakiye: toplamGelir - toplamGider }
  }, [kayitlar])

  const modalAc = (kayit?: KurumHarcama): void => {
    setHata(null)
    if (kayit) {
      setDuzenle(kayit)
      setForm({ baslik: kayit.baslik, tutar: String(kayit.tutar), kategori: kayit.kategori, tarih: kayit.tarih, tur: kayit.tur, aciklama: kayit.aciklama || '' })
    } else {
      setDuzenle(null)
      setForm({ ...emptyForm })
    }
    setModalAcik(true)
  }

  const kaydet = async (): Promise<void> => {
    if (!form.baslik.trim()) { setHata('Başlık zorunludur.'); return }
    if (!form.tutar || isNaN(Number(form.tutar))) { setHata('Geçerli bir tutar girin.'); return }
    setYukleniyor(true); setHata(null)
    try {
      const payload = { ...form, tutar: Number(form.tutar) }
      if (duzenle) await window.api.updateKurumHarcama({ id: duzenle.id, ...payload })
      else await window.api.addKurumHarcama(payload)
      await yukle()
      setModalAcik(false)
    } catch (e: any) {
      setHata('Hata: ' + (e?.message || String(e)))
    } finally { setYukleniyor(false) }
  }

  const sil = async (id: string): Promise<void> => {
    try { await window.api.deleteKurumHarcama(id); await yukle() }
    finally { setSilOnay(null) }
  }

  const kategoriEkle = async (): Promise<void> => {
    if (!yeniKat.ad.trim()) return
    await window.api.addKurumHarcamaKategori(yeniKat)
    setYeniKat({ ad: '', tur: 'HER_IKISI' })
    await yukle()
  }

  const kategoriSil = async (id: string): Promise<void> => {
    await window.api.deleteKurumHarcamaKategori(id)
    setSilKatOnay(null)
    await yukle()
  }

  const formKategoriler = useMemo(() => {
    const liste = kategoriler.filter(k => k.tur === 'HER_IKISI' || k.tur === form.tur)
    const varsayilanFiltrelenmis = VARSAYILAN_KATEGORILER.filter(
      v => (v.tur === form.tur || v.tur === 'HER_IKISI') && !liste.some(k => k.ad === v.ad)
    )
    return [...liste.map(k => k.ad), ...varsayilanFiltrelenmis.map(v => v.ad)]
  }, [kategoriler, form.tur])

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                <Building2 size={22} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Kurum Harcama</h1>
            </div>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest ml-13">Gelir & Gider Yönetim Paneli</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setKategoriModalAcik(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-all text-xs font-black uppercase tracking-tighter"
            >
              <Tag size={14} strokeWidth={2.5} /> Kategoriler
            </button>
            <button
              onClick={() => modalAc()}
              className="flex items-center gap-2.5 bg-violet-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-violet-500/25 hover:bg-violet-700 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
            >
              <Plus size={18} strokeWidth={3} /> Yeni Kayıt
            </button>
          </div>
        </div>
      </div>

      {/* ÖZET KARTLAR */}
      <div className="max-w-[1600px] mx-auto w-full px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner shrink-0">
              <TrendingUp size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toplam Gelir</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">{fmt(toplamGelir)}</p>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner shrink-0">
              <TrendingDown size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Toplam Gider</p>
              <p className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tight mt-0.5">{fmt(toplamGider)}</p>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl p-6 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner shrink-0 ${netBakiye >= 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
              <Wallet size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Bakiye</p>
              <p className={`text-2xl font-black tracking-tight mt-0.5 ${netBakiye >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>{fmt(netBakiye)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FİLTRELER */}
      <div className="max-w-[1600px] mx-auto w-full px-8 pt-6">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-gray-800 shadow-xl p-4 flex flex-wrap gap-3 items-center">
          {/* Tarih aralığı */}
          <div className="flex items-center gap-2 shrink-0">
            <input type="date" value={baslangic} onChange={e => setBaslangic(e.target.value)}
              className="bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-violet-500 dark:text-white transition-all" />
            <span className="text-gray-400 text-xs font-bold">—</span>
            <input type="date" value={bitis} onChange={e => setBitis(e.target.value)}
              className="bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-violet-500 dark:text-white transition-all" />
          </div>

          <div className="w-px h-7 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

          {/* Tür tab */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            {(['TUMU', 'GELIR', 'GIDER'] as TabTur[]).map(tab => (
              <button key={tab} onClick={() => setAktifTab(tab)}
                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all ${
                  aktifTab === tab
                    ? tab === 'GELIR' ? 'bg-emerald-600 text-white shadow-sm' : tab === 'GIDER' ? 'bg-red-600 text-white shadow-sm' : 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}>
                {tab === 'TUMU' ? 'Tümü' : tab === 'GELIR' ? 'Gelir' : 'Gider'}
              </button>
            ))}
          </div>

          {/* Arama */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={2.5} />
            <input type="text" placeholder="Başlık veya kategori ara..." value={arama} onChange={e => setArama(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold outline-none focus:border-violet-500 dark:text-white transition-all" />
          </div>

          {/* Kategori filtre */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shrink-0">
            <Filter size={13} className="text-gray-400" />
            <select value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none py-1.5 cursor-pointer pr-3">
              <option value="Tümü">Tüm Kategoriler</option>
              {[...new Set([...kategoriler.map(k => k.ad), ...VARSAYILAN_KATEGORILER.map(v => v.ad)])].sort().map(ad => (
                <option key={ad} value={ad}>{ad}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLO */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-6 min-h-0">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col h-full">
          <div className="overflow-auto scrollbar-hide flex-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <th className="px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-32">Tarih</th>
                  <th className="px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Başlık</th>
                  <th className="px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Kategori</th>
                  <th className="px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-24 text-center">Tür</th>
                  <th className="px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right w-36">Tutar</th>
                  <th className="px-7 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right w-24">Eylem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
                {filtrelenmis.length === 0 ? (
                  <tr><td colSpan={6} className="px-7 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Wallet size={48} strokeWidth={1} />
                      <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Kayıt bulunamadı</p>
                    </div>
                  </td></tr>
                ) : (
                  filtrelenmis.map(k => (
                    <tr key={k.id} className="group hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-all duration-200">
                      <td className="px-7 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {k.tarih ? new Date(k.tarih).toLocaleDateString('tr-TR') : '—'}
                      </td>
                      <td className="px-7 py-4">
                        <div>
                          <p className="font-black text-gray-800 dark:text-gray-200 text-sm tracking-tight">{k.baslik}</p>
                          {k.aciklama && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-xs">{k.aciklama}</p>}
                        </div>
                      </td>
                      <td className="px-7 py-4">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-tighter">{k.kategori || '—'}</span>
                      </td>
                      <td className="px-7 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${k.tur === 'GELIR' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                          {k.tur === 'GELIR' ? <ChevronUp size={11} strokeWidth={3} /> : <ChevronDown size={11} strokeWidth={3} />}
                          {k.tur === 'GELIR' ? 'Gelir' : 'Gider'}
                        </span>
                      </td>
                      <td className={`px-7 py-4 text-right font-black text-base tracking-tight ${k.tur === 'GELIR' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {k.tur === 'GELIR' ? '+' : '-'}{fmt(Number(k.tutar))}
                      </td>
                      <td className="px-7 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-200">
                          <button onClick={() => modalAc(k)} className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" title="Düzenle">
                            <Edit2 size={14} strokeWidth={2.5} />
                          </button>
                          <button onClick={() => setSilOnay(k.id)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Sil">
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filtrelenmis.length > 0 && (
                <tfoot className="sticky bottom-0">
                  <tr className="bg-slate-50/95 dark:bg-gray-800/95 backdrop-blur-md border-t-2 border-gray-200 dark:border-gray-700">
                    <td colSpan={4} className="px-7 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {filtrelenmis.length} kayıt
                    </td>
                    <td className="px-7 py-3 text-right font-black text-sm text-gray-800 dark:text-gray-200">
                      {(() => {
                        const t = filtrelenmis.reduce((s, k) => k.tur === 'GELIR' ? s + Number(k.tutar) : s - Number(k.tutar), 0)
                        return <span className={t >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>{t >= 0 ? '+' : ''}{fmt(t)}</span>
                      })()}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* EKLE / DÜZENLE MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-10 py-7 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
              <div>
                <h3 className="font-black text-xl text-gray-800 dark:text-white tracking-tight">
                  {duzenle ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Gelir / Gider Formu</p>
              </div>
              <button onClick={() => setModalAcik(false)} className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm border border-gray-100 dark:border-gray-700">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto max-h-[75vh] scrollbar-hide space-y-5">
              {hata && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
                  <AlertCircle size={16} /> {hata}
                </div>
              )}

              {/* GELİR / GİDER toggle */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TÜR</label>
                <div className="flex gap-2">
                  {(['GELIR', 'GIDER'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, tur: t, kategori: '' })}
                      className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                        form.tur === t
                          ? t === 'GELIR' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}>
                      {t === 'GELIR' ? '↑ Gelir' : '↓ Gider'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">BAŞLIK <span className="text-red-500">*</span></label>
                <input placeholder="Açıklayıcı bir başlık girin" value={form.baslik} onChange={e => setForm({ ...form, baslik: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-violet-500/10 transition-all dark:text-white shadow-inner" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TUTAR (₺) <span className="text-red-500">*</span></label>
                  <input type="number" min="0" step="0.01" placeholder="0.00" value={form.tutar} onChange={e => setForm({ ...form, tutar: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-violet-500/10 transition-all dark:text-white shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TARİH</label>
                  <input type="date" value={form.tarih} onChange={e => setForm({ ...form, tarih: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-violet-500/10 transition-all dark:text-white shadow-inner appearance-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KATEGORİ</label>
                <input list="kategori-list" placeholder="Kategori seç veya yaz" value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-violet-500/10 transition-all dark:text-white shadow-inner" />
                <datalist id="kategori-list">
                  {formKategoriler.map(ad => <option key={ad} value={ad} />)}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">AÇIKLAMA / NOT</label>
                <textarea rows={2} placeholder="İsteğe bağlı notlar..." value={form.aciklama} onChange={e => setForm({ ...form, aciklama: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-violet-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-violet-500/10 transition-all dark:text-white shadow-inner resize-none" />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setModalAcik(false)} className="flex-1 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">Vazgeç</button>
                <button type="button" onClick={kaydet} disabled={yukleniyor}
                  className="flex-[2] py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-700 shadow-xl shadow-violet-500/25 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                  <Save size={18} strokeWidth={3} /> {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KATEGORİ YÖNETİM MODAL */}
      {kategoriModalAcik && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
              <h3 className="font-black text-lg text-gray-800 dark:text-white tracking-tight">Kategori Yönetimi</h3>
              <button onClick={() => setKategoriModalAcik(false)} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm border border-gray-100 dark:border-gray-700">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-8 space-y-5 overflow-y-auto max-h-[70vh] scrollbar-hide">
              {/* Yeni kategori ekle */}
              <div className="flex gap-2">
                <input placeholder="Kategori adı" value={yeniKat.ad} onChange={e => setYeniKat({ ...yeniKat, ad: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && kategoriEkle()}
                  className="flex-1 bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-violet-500 dark:text-white" />
                <select value={yeniKat.tur} onChange={e => setYeniKat({ ...yeniKat, tur: e.target.value as Kategori['tur'] })}
                  className="bg-slate-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-violet-500 dark:text-white cursor-pointer">
                  <option value="GELIR">Gelir</option>
                  <option value="GIDER">Gider</option>
                  <option value="HER_IKISI">Her İkisi</option>
                </select>
                <button onClick={kategoriEkle} className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-black hover:bg-violet-700 transition-all active:scale-95">
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Kayıtlı kategoriler */}
              <div className="space-y-2">
                {kategoriler.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">Henüz kategori eklenmemiş</p>
                ) : (
                  kategoriler.map(k => (
                    <div key={k.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{k.ad}</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${k.tur === 'GELIR' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : k.tur === 'GIDER' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                          {k.tur === 'GELIR' ? 'Gelir' : k.tur === 'GIDER' ? 'Gider' : 'Her İkisi'}
                        </span>
                      </div>
                      {silKatOnay === k.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => kategoriSil(k.id)} className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black hover:bg-red-700 transition-all">Sil</button>
                          <button onClick={() => setSilKatOnay(null)} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg text-[10px] font-black">İptal</button>
                        </div>
                      ) : (
                        <button onClick={() => setSilKatOnay(k.id)} className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <Trash2 size={13} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SİL ONAY */}
      {silOnay && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 text-center tracking-tight">Kaydı Sil?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center text-sm font-medium">Bu kayıt <span className="text-red-500 font-black italic">kalıcı olarak</span> silinecek.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => sil(silOnay)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all active:scale-95">Sil</button>
              <button onClick={() => setSilOnay(null)} className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95">Vazgeç</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
