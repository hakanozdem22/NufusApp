import { BookOpen, RefreshCw, ExternalLink } from 'lucide-react'

interface MevzuatHeaderProps {
  onRefresh: () => void
  onOpenExternal: () => void
}

export const MevzuatHeader = ({ onRefresh, onOpenExternal }: MevzuatHeaderProps) => {
  return (
    <div className="mx-4 mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Mevzuat Kütüphanesi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Google Drive Entegrasyonu</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition"
          title="Sayfayı Yenile"
        >
          <RefreshCw size={16} /> Yenile
        </button>
        <button
          onClick={onOpenExternal}
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
        >
          <ExternalLink size={16} /> Tarayıcıda Aç
        </button>
      </div>
    </div>
  )
}
