import { FileText, X, Upload } from 'lucide-react'
import { Evrak } from '../models/evrak-types'
import { FormEvent } from 'react'

interface EvrakFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (e: FormEvent) => void
  formData: Evrak
  setFormData: (data: Evrak) => void
  onFileSelect: () => void
  kurumListesi?: { id: number; ad: string }[]
}

export const EvrakFormModal = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  onFileSelect,
  kurumListesi = []
}: EvrakFormModalProps) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 transition-colors">
        <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2 transition-colors">
          <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <FileText className="text-blue-600 dark:text-blue-400" /> Evrak Formu
          </h3>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Evrak Türü
              </label>
              <select
                className="w-full border p-2 rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                value={formData.tur}
                onChange={(e) => setFormData({ ...formData, tur: e.target.value as any })}
              >
                <option>Giden Evrak</option>
                <option>Gelen Evrak</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Durum</label>
              <select
                className="w-full border p-2 rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                value={formData.durum}
                onChange={(e) => setFormData({ ...formData, durum: e.target.value as any })}
              >
                <option>Cevap Gerekmiyor</option>
                <option>Cevap Bekleniyor</option>
                <option>Cevaplandı</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Tarih</label>
              <input
                className="w-full border p-2 rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                value={formData.tarih}
                onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Sayı / No
              </label>
              <input
                className="w-full border p-2 rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                value={formData.sayi}
                onChange={(e) => setFormData({ ...formData, sayi: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Kurum / Muhatap
            </label>
            <input
              className="w-full border p-2 rounded bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              value={formData.kurum}
              onChange={(e) => setFormData({ ...formData, kurum: e.target.value })}
              required
              list="kurumlar"
            />
            <datalist id="kurumlar">
              {kurumListesi.map((k) => (
                <option key={k.id} value={k.ad} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Konu</label>
            <textarea
              className="w-full border p-2 rounded h-20 resize-none bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              value={formData.konu}
              onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Dosya Eki</label>
            <div className="flex gap-2">
              <input
                className="w-full border p-2 rounded bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 outline-none transition-colors"
                value={formData.dosya_yolu}
                readOnly
                placeholder="Dosya seçilmedi"
              />
              <button
                type="button"
                onClick={onFileSelect}
                className="px-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded transition-colors"
              >
                <Upload size={18} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t dark:border-gray-700 mt-2 transition-colors">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
