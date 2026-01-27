import { Trash2, CloudDownload } from 'lucide-react'

interface TebdilDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const TebdilDeleteModal = ({ isOpen, onClose, onConfirm }: TebdilDeleteModalProps) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-80 text-center animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
          <Trash2 size={24} />
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">Ülkeyi Sil?</h3>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  )
}

interface TebdilDefaultModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const TebdilDefaultModal = ({ isOpen, onClose, onConfirm }: TebdilDefaultModalProps) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-96 text-center animate-in fade-in zoom-in duration-200 transition-colors">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
          <CloudDownload size={24} />
        </div>
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">Verileri Getir?</h3>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-bold transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
          >
            GETİR
          </button>
        </div>
      </div>
    </div>
  )
}
