import { FileText, X } from 'lucide-react'
import { DUSUNCELER } from '../models/arsiv-types'

interface ArsivFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  form: any
  setForm: (val: any) => void
  klasorTanimlari: any[]
}

export const ArsivFormModal = ({
  isOpen,
  onClose,
  onSave,
  form,
  setForm,
  klasorTanimlari
}: ArsivFormModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b dark:border-gray-600 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FileText size={18} /> {form.id ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Klasör Adı / Konusu
            </label>
            <input
              list="klasorListesi"
              className="w-full border dark:border-gray-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
              value={form.klasor_adi}
              onChange={(e) => setForm({ ...form, klasor_adi: e.target.value })}
              placeholder="Seçiniz veya Yazınız..."
            />
            <datalist id="klasorListesi">
              {klasorTanimlari.map((t: any) => (
                <option key={t.id} value={t.ad} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Tipi
            </label>
            <select
              className="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
              value={form.tipi}
              onChange={(e) => setForm({ ...form, tipi: e.target.value })}
            >
              <option value="KLASÖR">KLASÖR</option>
              <option value="DOSYA">DOSYA</option>
              <option value="KUTU">KUTU</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Yılı
            </label>
            <input
              type="number"
              className="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
              value={form.yili}
              onChange={(e) => setForm({ ...form, yili: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Kodu
            </label>
            <input
              className="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
              value={form.dosyalama_kodu}
              onChange={(e) => setForm({ ...form, dosyalama_kodu: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Saklama Yılı
            </label>
            <input
              type="number"
              className="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
              value={form.saklama_suresi}
              onChange={(e) => setForm({ ...form, saklama_suresi: e.target.value })}
            />
          </div>

          <div className="col-span-2 grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-700/30 p-2 rounded border dark:border-gray-600">
            <div>
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                Klasör Adeti
              </label>
              <input
                className="w-full border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
                value={form.klasor_no}
                onChange={(e) => setForm({ ...form, klasor_no: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                Evrak Başlangıç
              </label>
              <input
                className="w-full border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
                value={form.bas_no}
                onChange={(e) => setForm({ ...form, bas_no: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                Evrak Bitiş
              </label>
              <input
                className="w-full border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
                value={form.bitis_no}
                onChange={(e) => setForm({ ...form, bitis_no: e.target.value })}
              />
            </div>
          </div>

          {/* DÜŞÜNCELER (TEKLİ KAYIT) */}
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Düşünceler</label>
            <select
              className="w-full border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none"
              value={form.aciklama}
              onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
            >
              <option value="">Seçiniz...</option>
              {DUSUNCELER.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t dark:border-gray-600 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-gray-600 dark:text-gray-200 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md"
          >
            KAYDET
          </button>
        </div>
      </div>
    </div>
  )
}
