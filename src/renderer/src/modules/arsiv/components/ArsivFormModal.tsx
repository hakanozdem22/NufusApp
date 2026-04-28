import { FileText, X } from 'lucide-react'
import { DUSUNCELER } from '../models/arsiv-types'

interface ArsivFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  form: any
  setForm: (val: any) => void
  klasorTanimlari: any[]
  arsivDusunceler: any[]
}

export const ArsivFormModal = ({
  isOpen,
  onClose,
  onSave,
  form,
  setForm,
  klasorTanimlari,
  arsivDusunceler
}: ArsivFormModalProps) => {
  if (!isOpen) return null

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-2xl border border-white/20 dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 relative">
        {/* Background glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative px-4 py-3 flex justify-between items-center bg-transparent border-b border-gray-100/50 dark:border-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <FileText size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-gray-800 dark:text-white text-sm tracking-tight leading-none mb-0.5 uppercase">
                {form.id ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}
              </h3>
              <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                Arşiv Envanter Yönetimi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 relative">
          <div className="col-span-2">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1 block px-0.5">
              Klasör Adı / Konusu
            </label>
            <div className="relative group">
              <input
                list="klasorListesi"
                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-2 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-gray-800 dark:text-white font-bold transition-all shadow-sm placeholder-gray-400 text-xs"
                value={form.klasor_adi}
                onChange={(e) => handleKlasorChange(e.target.value)}
                placeholder="Örn: Personel Özlük Dosyaları..."
              />
              <datalist id="klasorListesi">
                {klasorTanimlari.map((t: any) => (
                  <option key={t.id} value={t.ad} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-0.5">
              Tipi
            </label>
            <select
              className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-800 dark:text-white font-bold transition-all appearance-none cursor-pointer text-xs"
              value={form.tipi}
              onChange={(e) => setForm({ ...form, tipi: e.target.value })}
            >
              <option value="KLASÖR">📂 KLASÖR</option>
              <option value="DOSYA">📄 DOSYA</option>
              <option value="KUTU">📦 KUTU</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-0.5">
              Dosyalama Yılı
            </label>
            <input
              className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-800 dark:text-white font-bold transition-all shadow-sm text-xs"
              value={form.yili}
              onChange={(e) => setForm({ ...form, yili: e.target.value })}
              placeholder="Örn: 2024 veya -"
            />
            {String(form.yili || '').trim() === '-' && (
              <p className="text-[9px] font-bold text-indigo-500 flex items-center gap-1 px-0.5">
                <span>∞</span> Bu kayıt süresiz saklanacak
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-0.5">
              Dosyalama Kodu
            </label>
            <input
              className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-800 dark:text-white font-black transition-all shadow-sm placeholder-gray-400 uppercase tracking-tighter text-xs"
              value={form.dosyalama_kodu}
              onChange={(e) => setForm({ ...form, dosyalama_kodu: e.target.value })}
              placeholder="Örn: 120.02"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-0.5">
              Saklama Süresi (Yıl)
            </label>
            {String(form.yili || '').trim() === '-' ? (
              <div className="w-full flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/30">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
                  SÜRESİZ SAKLANIR
                </span>
              </div>
            ) : (
              <input
                type="number"
                className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-800 dark:text-white font-bold transition-all shadow-sm text-xs"
                value={form.saklama_suresi}
                onChange={(e) => setForm({ ...form, saklama_suresi: e.target.value })}
              />
            )}
          </div>

          <div className="col-span-2 grid grid-cols-4 gap-2 bg-blue-500/5 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-500/10 dark:border-blue-500/20 shadow-inner">
            <div className="space-y-0.5">
              <label className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em] px-0.5">Klasör No</label>
              <input
                className="w-full bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/50 p-1.5 rounded-md text-[10px] font-black text-center text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                value={form.klasor_no}
                onChange={(e) => setForm({ ...form, klasor_no: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <label className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em] px-0.5">Adet</label>
              <input
                className="w-full bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/50 p-1.5 rounded-md text-[10px] font-black text-center text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                value={form.evrak_sayisi}
                onChange={(e) => setForm({ ...form, evrak_sayisi: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <label className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em] px-0.5">Baş No</label>
              <input
                className="w-full bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/50 p-1.5 rounded-md text-[10px] font-black text-center text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                value={form.bas_no}
                onChange={(e) => setForm({ ...form, bas_no: e.target.value })}
              />
            </div>
            <div className="space-y-0.5">
              <label className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em] px-0.5">Bitiş No</label>
              <input
                className="w-full bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/50 p-1.5 rounded-md text-[10px] font-black text-center text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                value={form.bitis_no}
                onChange={(e) => setForm({ ...form, bitis_no: e.target.value })}
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1 block px-0.5">Düşünceler / Açıklama</label>
            <input
              list="dusunceListesi"
              className="w-full bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-800 dark:text-white font-bold transition-all shadow-sm italic placeholder-gray-400 text-xs"
              value={form.aciklama}
              onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
              placeholder="Ek notlar buraya..."
            />
            <datalist id="dusunceListesi">
              {arsivDusunceler.map((d: any) => (
                <option key={d.id} value={d.aciklama} />
              ))}
              {DUSUNCELER.map((d, i) => (
                <option key={`def-${i}`} value={d} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="px-4 py-3 flex justify-end gap-2 relative">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg font-black text-[9px] uppercase tracking-[0.15em] border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            Vazgeç
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.15em] shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            KAYDET
          </button>
        </div>
      </div>
    </div>
  )
}
