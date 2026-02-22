import { Plus, Edit2, Trash2, Printer, FileSpreadsheet } from 'lucide-react'

interface ArsivToolbarProps {
  onAdd: () => void
  selectedCount: number
  onBulkUpdate: () => void
  onBulkDelete: () => void
  onReport: () => void
  onImport: () => void
}

export const ArsivToolbar = ({
  onAdd,
  selectedCount,
  onBulkUpdate,
  onBulkDelete,
  onReport,
  onImport
}: ArsivToolbarProps) => {
  return (
    <div className="bg-gray-200 dark:bg-gray-800/50 p-2 border-b dark:border-gray-700 flex gap-2 shadow-inner shrink-0">
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition"
      >
        <Plus size={16} className="text-green-600 dark:text-green-400" /> Ekle [Insert]
      </button>

      <button
        onClick={onImport}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition"
      >
        <FileSpreadsheet size={16} className="text-green-600 dark:text-teal-400" /> Excel'den Al
      </button>

      {selectedCount > 0 && (
        <>
          <button
            onClick={onBulkUpdate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 border border-orange-700 rounded text-white text-sm font-bold shadow-sm transition animate-pulse"
          >
            <Edit2 size={16} /> {selectedCount} Güncelle
          </button>
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 border border-red-700 rounded text-white text-sm font-bold shadow-sm transition hover:bg-red-700"
          >
            <Trash2 size={16} /> {selectedCount} Sil
          </button>
        </>
      )}
      <div className="w-px bg-gray-400 dark:bg-gray-600 mx-2"></div>
      <button
        onClick={onReport}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-bold text-gray-700 dark:text-gray-200 shadow-sm transition"
      >
        <Printer size={16} className="text-blue-600 dark:text-blue-400" /> Raporla ve Yazdır
      </button>
    </div>
  )
}
