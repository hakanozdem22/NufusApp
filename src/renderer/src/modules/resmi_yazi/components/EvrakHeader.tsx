import { Printer, Plus, Loader2 } from 'lucide-react'

interface EvrakHeaderProps {
  onPrint: () => void
  onNew: () => void
  yukleniyor: boolean
}

export const EvrakHeader = ({ onPrint, onNew, yukleniyor }: EvrakHeaderProps) => {
  return (
    <div className="mx-4 mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center transition-colors">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Resmi Yazı Takip</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Gelen/Giden Evrak Yönetimi</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrint}
          disabled={yukleniyor}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition"
        >
          {yukleniyor ? <Loader2 className="animate-spin" /> : <Printer size={18} />} Listeyi Yazdır
        </button>
        <button
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition"
        >
          <Plus size={18} /> Yeni Evrak
        </button>
      </div>
    </div>
  )
}
