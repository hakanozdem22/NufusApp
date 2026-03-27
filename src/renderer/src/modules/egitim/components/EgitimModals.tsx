import { Trash2, Save, X } from 'lucide-react'

interface EgitimDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const EgitimDeleteModal = ({ isOpen, onClose, onConfirm }: EgitimDeleteModalProps) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl border w-80 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <Trash2 size={24} />
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">Planı Sil?</h3>
        <p className="text-gray-500 text-xs mb-6">Bu işlem geri alınamaz.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  )
}

interface EgitimSaveModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  planAdiInput: string
  setPlanAdiInput: (val: string) => void
}

export const EgitimSaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  planAdiInput,
  setPlanAdiInput
}: EgitimSaveModalProps) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
          <h3 className="font-bold text-green-800 flex items-center gap-2">
            <Save size={18} /> Planı Kaydet
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bu plana bir isim verin:
          </label>
          <input
            type="text"
            autoFocus
            className="w-full border-2 border-green-100 rounded-lg p-2.5 outline-none focus:border-green-500 text-gray-800"
            placeholder="Örn: 2026 - 1. Dönem Planı"
            value={planAdiInput}
            onChange={(e) => setPlanAdiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
            >
              KAYDET
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
