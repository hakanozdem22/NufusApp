import { X, Save, AlertCircle, User, Phone, AtSign } from 'lucide-react'
import { FormEvent } from 'react'

interface RehberFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (e: FormEvent) => void
  formId: number | null
  formAd: string
  setFormAd: (val: string) => void
  formTel: string
  setFormTel: (val: string) => void
  formEmail: string
  setFormEmail: (val: string) => void
  formNot: string
  setFormNot: (val: string) => void
  hata: string | null
}

export const RehberFormModal = ({
  isOpen,
  onClose,
  onSave,
  formId,
  formAd,
  setFormAd,
  formTel,
  setFormTel,
  formEmail,
  setFormEmail,
  formNot,
  setFormNot,
  hata
}: RehberFormModalProps) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transition-colors">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b dark:border-gray-600 flex justify-between items-center transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">
            {formId ? 'Düzenle' : 'Yeni Ekle'}
          </h3>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-red-500 transition" />
          </button>
        </div>

        <form onSubmit={onSave} className="p-4 space-y-3">
          {hata && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-xs flex items-center gap-2">
              <AlertCircle size={14} /> <span>{hata}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
              <input
                className="w-full pl-8 p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                placeholder="Ad Soyad"
                value={formAd}
                onChange={(e) => setFormAd(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                <input
                  className="w-full pl-8 p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="05XX..."
                  value={formTel}
                  onChange={(e) => setFormTel(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-Posta
              </label>
              <div className="relative">
                <AtSign className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
                <input
                  className="w-full pl-8 p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="mail@..."
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Not
            </label>
            <textarea
              className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
              placeholder="Not..."
              value={formNot}
              onChange={(e) => setFormNot(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              <Save size={16} /> Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
