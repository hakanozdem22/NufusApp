import { useState, useEffect, ReactElement } from 'react'
import { Not } from '../types'
import { Plus, X, Edit2, Trash2, Search, StickyNote } from 'lucide-react'

const RENKLER = [
  { key: 'yellow', bg: 'bg-yellow-100', border: 'border-yellow-300', header: 'bg-yellow-200', dot: 'bg-yellow-400', label: 'Sarı' },
  { key: 'blue', bg: 'bg-blue-100', border: 'border-blue-300', header: 'bg-blue-200', dot: 'bg-blue-400', label: 'Mavi' },
  { key: 'green', bg: 'bg-green-100', border: 'border-green-300', header: 'bg-green-200', dot: 'bg-green-400', label: 'Yeşil' },
  { key: 'pink', bg: 'bg-pink-100', border: 'border-pink-300', header: 'bg-pink-200', dot: 'bg-pink-400', label: 'Pembe' },
  { key: 'purple', bg: 'bg-purple-100', border: 'border-purple-300', header: 'bg-purple-200', dot: 'bg-purple-400', label: 'Mor' },
  { key: 'orange', bg: 'bg-orange-100', border: 'border-orange-300', header: 'bg-orange-200', dot: 'bg-orange-400', label: 'Turuncu' }
]

const getRenk = (key: string) => RENKLER.find((r) => r.key === key) || RENKLER[0]

const formatDate = (iso?: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const Notlar = (): ReactElement => {
  const [notlar, setNotlar] = useState<Not[]>([])
  const [arama, setArama] = useState('')
  const [modalAcik, setModalAcik] = useState(false)
  const [silOnay, setSilOnay] = useState<string | null>(null)
  const [duzenleNot, setDuzenleNot] = useState<Not | null>(null)
  const [hata, setHata] = useState<string | null>(null)
  const [kaydediliyor, setKaydediliyor] = useState(false)

  const [form, setForm] = useState<{ baslik: string; icerik: string; renk: string }>({
    baslik: '',
    icerik: '',
    renk: 'yellow'
  })

  const yukle = async (): Promise<void> => {
    try {
      if (window.api) {
        const data = await window.api.getNotlar()
        setNotlar(data || [])
      }
    } catch (e: any) {
      console.error('getNotlar hatası:', e)
    }
  }

  useEffect(() => {
    yukle()
  }, [])

  const modalAc = (not?: Not): void => {
    setHata(null)
    if (not) {
      setDuzenleNot(not)
      setForm({ baslik: not.baslik || '', icerik: not.icerik, renk: not.renk })
    } else {
      setDuzenleNot(null)
      setForm({ baslik: '', icerik: '', renk: 'yellow' })
    }
    setModalAcik(true)
  }

  const modalKapat = (): void => {
    setModalAcik(false)
    setDuzenleNot(null)
    setHata(null)
  }

  const kaydet = async (): Promise<void> => {
    if (!form.icerik.trim()) return
    setKaydediliyor(true)
    setHata(null)
    try {
      const now = new Date().toISOString()
      if (duzenleNot) {
        await window.api.updateNot({
          id: duzenleNot.id,
          baslik: form.baslik.trim(),
          icerik: form.icerik.trim(),
          renk: form.renk,
          guncelleme_tarihi: now
        })
      } else {
        await window.api.addNot({
          baslik: form.baslik.trim(),
          icerik: form.icerik.trim(),
          renk: form.renk,
          tarih: now,
          guncelleme_tarihi: now
        })
      }
      await yukle()
      modalKapat()
    } catch (e: any) {
      console.error('kaydet hatası:', e)
      setHata('Kayıt sırasında hata oluştu: ' + (e?.message || String(e)))
    } finally {
      setKaydediliyor(false)
    }
  }

  const sil = async (id: string): Promise<void> => {
    try {
      await window.api.deleteNot(id)
      setSilOnay(null)
      await yukle()
    } catch (e: any) {
      console.error('silme hatası:', e)
    }
  }

  const filtreliNotlar = notlar.filter((n) => {
    const ara = arama.toLowerCase()
    return (
      (n.baslik || '').toLowerCase().includes(ara) ||
      n.icerik.toLowerCase().includes(ara)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
            <StickyNote size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Notlar</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">{notlar.length} not</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Arama */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 w-48"
            />
          </div>
          {/* Yeni Not */}
          <button
            onClick={() => modalAc()}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-bold rounded-xl shadow-md shadow-yellow-400/30 transition-all"
          >
            <Plus size={16} />
            Yeni Not
          </button>
        </div>
      </div>

      {/* Notlar Grid */}
      {filtreliNotlar.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-300 dark:text-gray-700">
          <StickyNote size={64} strokeWidth={1} />
          <p className="mt-4 text-base font-semibold">
            {arama ? 'Arama sonucu bulunamadı' : 'Henüz not eklenmedi'}
          </p>
          {!arama && (
            <button
              onClick={() => modalAc()}
              className="mt-4 px-4 py-2 bg-yellow-400 text-white text-sm font-bold rounded-xl hover:bg-yellow-500 transition-all"
            >
              İlk notu ekle
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtreliNotlar.map((not) => {
            const renk = getRenk(not.renk)
            return (
              <div
                key={not.id}
                className={`flex flex-col rounded-2xl border ${renk.bg} ${renk.border} shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
              >
                {/* Not Başlığı Bandı */}
                <div className={`${renk.header} px-4 py-2.5 flex items-center justify-between shrink-0`}>
                  <span className="text-xs font-bold text-gray-600 truncate max-w-[140px]">
                    {not.baslik || 'Not'}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => modalAc(not)}
                      className="p-1 rounded-lg hover:bg-black/10 transition-colors text-gray-500 hover:text-gray-700"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => setSilOnay(not.id!)}
                      className="p-1 rounded-lg hover:bg-red-200 transition-colors text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {/* Not İçeriği */}
                <div className="px-4 py-3 flex-1 overflow-hidden">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed break-words line-clamp-6">
                    {not.icerik}
                  </p>
                </div>
                {/* Not Alt Bilgi */}
                <div className="px-4 pb-2.5 shrink-0">
                  <span className="text-[10px] text-gray-400">
                    {formatDate(not.guncelleme_tarihi || not.tarih)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Not Ekleme/Düzenleme Modalı */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-base font-black text-gray-800 dark:text-gray-100">
                {duzenleNot ? 'Notu Düzenle' : 'Yeni Not'}
              </h2>
              <button
                onClick={modalKapat}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Başlık */}
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                  Başlık (opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="Not başlığı..."
                  value={form.baslik}
                  onChange={(e) => setForm({ ...form, baslik: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                />
              </div>
              {/* İçerik */}
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block">
                  İçerik
                </label>
                <textarea
                  placeholder="Notunuzu yazın..."
                  value={form.icerik}
                  onChange={(e) => setForm({ ...form, icerik: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none"
                />
              </div>
              {/* Renk Seçimi */}
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                  Renk
                </label>
                <div className="flex items-center gap-2">
                  {RENKLER.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => setForm({ ...form, renk: r.key })}
                      title={r.label}
                      className={`w-7 h-7 rounded-full ${r.dot} transition-all ${form.renk === r.key ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'opacity-60 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            {hata && (
              <div className="mx-6 mb-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
                {hata}
              </div>
            )}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={modalKapat}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={kaydet}
                disabled={!form.icerik.trim() || kaydediliyor}
                className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all"
              >
                {kaydediliyor ? 'Kaydediliyor...' : duzenleNot ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {silOnay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-black text-gray-800 dark:text-gray-100 mb-2">Notu Sil</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Bu notu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSilOnay(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => sil(silOnay)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all"
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
