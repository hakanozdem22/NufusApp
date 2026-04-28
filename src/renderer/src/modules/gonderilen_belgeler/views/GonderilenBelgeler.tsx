import { useState, useEffect, ReactElement, FormEvent } from 'react'
import { GonderilenBelge } from '../types'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Clock
} from 'lucide-react'

type SortKey = 'tarih' | 'evrak_no' | 'belge_turu' | 'gonderilen_yer' | 'durum'
type SortDir = 'asc' | 'desc'

const formatTarih = (iso: string): string => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

const BOSH_FORM: Partial<GonderilenBelge> = {
  durum: 'bekliyor',
  tarih: '',
  evrak_no: '',
  belge_turu: '',
  gonderilen_yer: '',
  aciklama: ''
}

export const GonderilenBelgeler = (): ReactElement => {
  const [liste, setListe] = useState<GonderilenBelge[]>([])
  const [arama, setArama] = useState('')
  const [durumFiltre, setDurumFiltre] = useState<'hepsi' | 'bekliyor' | 'geldi'>('hepsi')
  const [sortKey, setSortKey] = useState<SortKey>('tarih')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const [modalAcik, setModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<GonderilenBelge | null>(null)
  const [silinecekId, setSilinecekId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<GonderilenBelge>>(BOSH_FORM)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [bildirim, setBildirim] = useState<{ mesaj: string; tur: 'basari' | 'hata' } | null>(null)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ mesaj, tur })
    setTimeout(() => setBildirim(null), 3000)
  }

  const yukle = async (): Promise<void> => {
    try {
      if (window.api?.getGonderilenBelgeler) {
        const data = await window.api.getGonderilenBelgeler()
        setListe(data || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    yukle()
  }, [])

  const modalAc = (kayit?: GonderilenBelge): void => {
    if (kayit) {
      setDuzenle(kayit)
      setForm({ ...kayit })
    } else {
      setDuzenle(null)
      setForm({ ...BOSH_FORM })
    }
    setModalAcik(true)
  }

  const modalKapat = (): void => {
    setModalAcik(false)
    setDuzenle(null)
  }

  const kaydet = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!form.tarih || !form.evrak_no?.trim() || !form.belge_turu?.trim() || !form.gonderilen_yer?.trim()) {
      mesajGoster('Tarih, Evrak No, Belge Türü ve Gönderilen Yer zorunludur.', 'hata')
      return
    }
    setKaydediliyor(true)
    try {
      if (duzenle) {
        await window.api.updateGonderilenBelge({ ...form, id: duzenle.id })
        mesajGoster('Kayıt güncellendi.')
      } else {
        await window.api.addGonderilenBelge(form)
        mesajGoster('Kayıt eklendi.')
      }
      await yukle()
      modalKapat()
    } catch (e: any) {
      mesajGoster('Hata: ' + (e?.message || String(e)), 'hata')
    } finally {
      setKaydediliyor(false)
    }
  }

  const durumDegistir = async (kayit: GonderilenBelge): Promise<void> => {
    const yeniDurum = kayit.durum === 'geldi' ? 'bekliyor' : 'geldi'
    try {
      await window.api.updateGonderilenBelge({ ...kayit, durum: yeniDurum })
      setListe((prev) =>
        prev.map((r) => (r.id === kayit.id ? { ...r, durum: yeniDurum } : r))
      )
    } catch {
      mesajGoster('Durum güncellenemedi.', 'hata')
    }
  }

  const sil = async (): Promise<void> => {
    if (!silinecekId) return
    try {
      await window.api.deleteGonderilenBelge(silinecekId)
      setSilinecekId(null)
      mesajGoster('Kayıt silindi.')
      await yukle()
    } catch {
      mesajGoster('Silme hatası.', 'hata')
    }
  }

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtreliListe = liste
    .filter((r) => {
      const ara = arama.toLowerCase()
      const aramaUyumu =
        r.evrak_no.toLowerCase().includes(ara) ||
        r.belge_turu.toLowerCase().includes(ara) ||
        r.gonderilen_yer.toLowerCase().includes(ara)
      const durumUyumu = durumFiltre === 'hepsi' || r.durum === durumFiltre
      return aramaUyumu && durumUyumu
    })
    .sort((a, b) => {
      const av = String(a[sortKey] || '')
      const bv = String(b[sortKey] || '')
      return sortDir === 'asc' ? av.localeCompare(bv, 'tr') : bv.localeCompare(av, 'tr')
    })

  const bekleyenSayisi = liste.filter((r) => r.durum === 'bekliyor').length
  const geldiSayisi = liste.filter((r) => r.durum === 'geldi').length

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey !== col ? null : sortDir === 'asc' ? (
      <ChevronUp size={11} strokeWidth={3} className="inline ml-0.5" />
    ) : (
      <ChevronDown size={11} strokeWidth={3} className="inline ml-0.5" />
    )

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide py-6 px-6 max-w-[1400px] mx-auto w-full">

        {/* Bildirim */}
        {bildirim && (
          <div
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${bildirim.tur === 'basari' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {bildirim.tur === 'basari' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold">{bildirim.mesaj}</span>
          </div>
        )}

        {/* Başlık */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm">
              <Send size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-800 dark:text-gray-100 tracking-tight leading-none uppercase">
                Gönderilen Belgeler
              </h1>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">
                {liste.length} toplam · {bekleyenSayisi} bekliyor · {geldiSayisi} teslim edildi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Durum filtresi */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5 gap-0.5">
              {(['hepsi', 'bekliyor', 'geldi'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDurumFiltre(d)}
                  className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider ${
                    durumFiltre === d
                      ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {d === 'hepsi' ? 'Hepsi' : d === 'bekliyor' ? 'Bekliyor' : 'Teslim'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Evrak no, tür, yer..."
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                className="pl-8 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/40 w-48"
              />
            </div>
            <button
              onClick={() => modalAc()}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-500/20 transition-all"
            >
              <Plus size={14} strokeWidth={2.5} />
              Yeni Ekle
            </button>
          </div>
        </div>

        {/* Tablo */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50">
                <th className="px-5 py-3 text-left w-10">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">#</span>
                </th>
                {(
                  [
                    { key: 'durum', label: 'İşlem' },
                    { key: 'tarih', label: 'Tarih' },
                    { key: 'evrak_no', label: 'Evrak No' },
                    { key: 'belge_turu', label: 'Belge Türü' },
                    { key: 'gonderilen_yer', label: 'Gönderilen Yer' }
                  ] as { key: SortKey; label: string }[]
                ).map(({ key, label }) => (
                  <th
                    key={key}
                    className="px-5 py-3 text-left cursor-pointer select-none group"
                    onClick={() => handleSort(key)}
                  >
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-violet-500 transition-colors">
                      {label} <SortIcon col={key} />
                    </span>
                  </th>
                ))}
                <th className="px-5 py-3 text-left">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Açıklama
                  </span>
                </th>
                <th className="px-5 py-3 text-right w-24">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    İşlem
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {filtreliListe.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-300 dark:text-gray-700">
                    <Send size={40} strokeWidth={1} className="mx-auto mb-3" />
                    <p className="text-sm font-semibold">
                      {arama || durumFiltre !== 'hepsi'
                        ? 'Arama sonucu bulunamadı'
                        : 'Henüz belge eklenmedi'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtreliListe.map((kayit, idx) => (
                  <tr
                    key={kayit.id}
                    className="group hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-black text-gray-300 dark:text-gray-600">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {kayit.durum === 'geldi' ? (
                        <button
                          onClick={() => durumDegistir(kayit)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-[11px] font-black hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors cursor-pointer"
                          title="Tıkla: Bekliyor yap"
                        >
                          <CheckCircle size={11} strokeWidth={2.5} />
                          GELDİ
                        </button>
                      ) : (
                        <button
                          onClick={() => durumDegistir(kayit)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-[11px] font-black hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
                          title="Tıkla: Geldi yap"
                        >
                          <Clock size={11} strokeWidth={2.5} />
                          BEKLİYOR
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-bold text-gray-600 dark:text-gray-400 font-mono">
                        {formatTarih(kayit.tarih)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-black text-gray-700 dark:text-gray-300 font-mono tracking-tight">
                        {kayit.evrak_no}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2.5 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 rounded-lg text-[11px] font-bold">
                        {kayit.belge_turu}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 text-[12px] tracking-tight">
                        {kayit.gonderilen_yer}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 italic">
                        {kayit.aciklama || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => modalAc(kayit)}
                          className="w-7 h-7 flex items-center justify-center text-violet-600 hover:bg-violet-600 hover:text-white rounded-lg transition-all border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                          title="Düzenle"
                        >
                          <Edit2 size={12} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setSilinecekId(kayit.id!)}
                          className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
                          title="Sil"
                        >
                          <Trash2 size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ekleme/Düzenleme Modalı */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-tight">
                {duzenle ? 'Belgeyi Düzenle' : 'Yeni Belge Ekle'}
              </h2>
              <button
                onClick={modalKapat}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </div>
            <form onSubmit={kaydet} className="px-6 py-5 space-y-4">
              {/* Durum */}
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                  İşlem Durumu
                </label>
                <div className="flex gap-3">
                  {(['bekliyor', 'geldi'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, durum: d })}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                        form.durum === d
                          ? d === 'geldi'
                            ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400'
                            : 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {d === 'geldi' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {d === 'geldi' ? 'GELDİ' : 'BEKLİYOR'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Tarih <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/40 font-semibold"
                    value={form.tarih || ''}
                    onChange={(e) => setForm({ ...form, tarih: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Evrak No <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/40 font-semibold"
                    value={form.evrak_no || ''}
                    onChange={(e) => setForm({ ...form, evrak_no: e.target.value })}
                    placeholder="Örn: 2024/1234"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Belge Türü <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/40 font-semibold"
                  value={form.belge_turu || ''}
                  onChange={(e) => setForm({ ...form, belge_turu: e.target.value })}
                  placeholder="Örn: Yazışma, Dilekçe, Tebligat..."
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Gönderilen Yer <span className="text-red-400">*</span>
                </label>
                <input
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/40 font-semibold"
                  value={form.gonderilen_yer || ''}
                  onChange={(e) => setForm({ ...form, gonderilen_yer: e.target.value })}
                  placeholder="Kurum / kişi adı giriniz"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Açıklama
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/40 font-semibold resize-none"
                  value={form.aciklama || ''}
                  onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
                  placeholder="Ek notlar..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={modalKapat}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={kaydediliyor}
                  className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Save size={13} />
                  {kaydediliyor ? 'Kaydediliyor...' : duzenle ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onayı */}
      {silinecekId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 mb-2">Kaydı Sil</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Bu belgeyi silmek istediğinize emin misiniz?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSilinecekId(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={sil}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
