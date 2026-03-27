import { Trash2 } from 'lucide-react'

interface EvrakDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const EvrakDeleteModal = ({ isOpen, onClose, onConfirm }: EvrakDeleteModalProps) => {
  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <Trash2 size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Emin misiniz?</h3>
        <p className="text-gray-500 text-sm mb-6">Bu evrak kaydı kalıcı olarak silinecektir.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  )
}
