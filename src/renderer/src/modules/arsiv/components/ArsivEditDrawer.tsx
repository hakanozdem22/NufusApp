import { useEffect } from 'react'
import { X, Save, RotateCcw, FileEdit } from 'lucide-react'
import { DUSUNCELER } from '../models/arsiv-types'

interface ArsivEditDrawerProps {
  isOpen: boolean
  form: any
  setForm: (val: any) => void
  original: any
  onSave: () => void
  onClose: () => void
  klasorTanimlari: any[]
  arsivDusunceler: any[]
}

const isDirty = (form: any, original: any, field: string): boolean =>
  String(form[field] ?? '') !== String(original[field] ?? '')

const FieldLabel = ({
  label,
  dirty
}: {
  label: string
  dirty: boolean
}) => (
  <label className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest mb-1 px-0.5">
    <span className={dirty ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}>{label}</span>
    {dirty && (
      <span className="text-[8px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1 py-0.5 rounded leading-none">
        DEĞİŞTİ
      </span>
    )}
  </label>
)

export const ArsivEditDrawer = ({
  isOpen,
  form,
  setForm,
  original,
  onSave,
  onClose,
  klasorTanimlari,
  arsivDusunceler
}: ArsivEditDrawerProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const dirtyCount = [
    'klasor_adi', 'tipi', 'yili', 'klasor_no', 'evrak_sayisi',
    'bas_no', 'bitis_no', 'saklama_suresi', 'dosyalama_kodu', 'aciklama'
  ].filter((f) => isDirty(form, original, f)).length

  const handleKlasorChange = (val: string) => {
    const tanim = klasorTanimlari.find((k) => k.ad === val)
    if (tanim) {
      setForm({
        ...form,
        klasor_adi: val,
        saklama_suresi: tanim.saklama_suresi || form.saklama_suresi,
        dosyalama_kodu: tanim.dosyalama_kodu || form.dosyalama_kodu
      })
    } else {
      setForm({ ...form, klasor_adi: val })
    }
  }

  const inputCls = (field: string) =>
    `w-full p-2 rounded-lg text-xs font-bold outline-none transition-all shadow-sm
    ${isDirty(form, original, field)
      ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-400/30'
      : 'bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500'
    }`

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[420px] z-[95] flex flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-100 dark:border-gray-800 animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileEdit size={17} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-800 dark:text-white tracking-tight leading-none mb-0.5 uppercase">
                Kaydı Düzenle
              </h2>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 truncate max-w-[220px]">
                {original.klasor_adi || '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dirtyCount > 0 && (
              <span className="text-[9px] font-black px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                {dirtyCount} değişiklik
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Klasör Adı */}
          <div>
            <FieldLabel label="Klasör Adı / Konusu" dirty={isDirty(form, original, 'klasor_adi')} />
            <input
              list="editKlasorListesi"
              className={inputCls('klasor_adi')}
              value={form.klasor_adi || ''}
              onChange={(e) => handleKlasorChange(e.target.value)}
              placeholder="Klasör adı..."
            />
            <datalist id="editKlasorListesi">
              {klasorTanimlari.map((t: any) => (
                <option key={t.id} value={t.ad} />
              ))}
            </datalist>
          </div>

          {/* Tip + Yıl */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Tipi" dirty={isDirty(form, original, 'tipi')} />
              <select
                className={inputCls('tipi') + ' appearance-none cursor-pointer'}
                value={form.tipi || ''}
                onChange={(e) => setForm({ ...form, tipi: e.target.value })}
              >
                <option value="KLASÖR">📂 KLASÖR</option>
                <option value="DOSYA">📄 DOSYA</option>
                <option value="KUTU">📦 KUTU</option>
              </select>
            </div>
            <div>
              <FieldLabel label="Dosyalama Yılı" dirty={isDirty(form, original, 'yili')} />
              <input
                className={inputCls('yili')}
                value={form.yili || ''}
                onChange={(e) => setForm({ ...form, yili: e.target.value })}
                placeholder="Örn: 2024 veya -"
              />
              {String(form.yili || '').trim() === '-' && (
                <p className="mt-1 text-[9px] font-bold text-indigo-500 flex items-center gap-1">
                  <span>∞</span> Bu kayıt süresiz saklanacak
                </p>
              )}
            </div>
          </div>

          {/* Dosyalama Kodu + Saklama Süresi */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Dosyalama Kodu" dirty={isDirty(form, original, 'dosyalama_kodu')} />
              <input
                className={inputCls('dosyalama_kodu') + ' uppercase tracking-tighter'}
                value={form.dosyalama_kodu || ''}
                onChange={(e) => setForm({ ...form, dosyalama_kodu: e.target.value })}
                placeholder="Örn: 120.02"
              />
            </div>
            <div>
              <FieldLabel label="Saklama Süresi (Yıl)" dirty={isDirty(form, original, 'saklama_suresi')} />
              <input
                type="text"
                className={inputCls('saklama_suresi')}
                value={form.saklama_suresi || ''}
                onChange={(e) => setForm({ ...form, saklama_suresi: e.target.value })}
                placeholder="Yıl veya -"
              />
            </div>
          </div>

          {/* Numaralar */}
          <div className="bg-blue-500/5 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-500/10 dark:border-blue-500/20 space-y-2">
            <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Numara Bilgileri</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'klasor_no', label: 'Klasör No' },
                { key: 'evrak_sayisi', label: 'Adet' },
                { key: 'bas_no', label: 'Baş No' },
                { key: 'bitis_no', label: 'Bitiş No' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-0.5">
                  <label className={`text-[8px] font-black uppercase tracking-wide px-0.5 ${isDirty(form, original, key) ? 'text-amber-500' : 'text-blue-500/70'}`}>
                    {label}
                  </label>
                  <input
                    className={`w-full p-1.5 rounded-md text-[10px] font-black text-center outline-none transition-all
                      ${isDirty(form, original, key)
                        ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-300 dark:border-amber-700 text-gray-800 dark:text-white'
                        : 'bg-white dark:bg-gray-800 border border-blue-100 dark:border-blue-900/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    value={form[key] ?? ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <FieldLabel label="Düşünceler / Açıklama" dirty={isDirty(form, original, 'aciklama')} />
            <input
              list="editDusunceListesi"
              className={inputCls('aciklama') + ' italic'}
              value={form.aciklama || ''}
              onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
              placeholder="Ek notlar..."
            />
            <datalist id="editDusunceListesi">
              {arsivDusunceler.map((d: any) => (
                <option key={d.id} value={d.aciklama} />
              ))}
              {DUSUNCELER.map((d, i) => (
                <option key={`def-${i}`} value={d} />
              ))}
            </datalist>
          </div>

          {/* Orijinal Değerler (değişiklik varsa göster) */}
          {dirtyCount > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Önceki Değerler</p>
              <div className="space-y-1">
                {[
                  { key: 'klasor_adi', label: 'Klasör Adı' },
                  { key: 'tipi', label: 'Tipi' },
                  { key: 'yili', label: 'Yıl' },
                  { key: 'dosyalama_kodu', label: 'Kod' },
                  { key: 'saklama_suresi', label: 'Saklama' },
                  { key: 'aciklama', label: 'Açıklama' }
                ].filter(({ key }) => isDirty(form, original, key)).map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2 text-[10px]">
                    <span className="text-gray-400 font-bold w-20 shrink-0">{label}:</span>
                    <span className="text-gray-500 dark:text-gray-400 line-through truncate">
                      {String(original[key] ?? '—')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 shrink-0 bg-gray-50/30 dark:bg-gray-900/30">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <RotateCcw size={12} />
            İptal
          </button>
          <button
            onClick={onSave}
            disabled={dirtyCount === 0}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Save size={13} />
            Kaydet {dirtyCount > 0 && `(${dirtyCount})`}
          </button>
        </div>
      </div>
    </>
  )
}
