import { Archive, Search } from 'lucide-react'
import { ArsivFiltre } from '../models/arsiv-types'

interface ArsivHeaderProps {
  filtreler: ArsivFiltre
  setFiltreler: (val: ArsivFiltre) => void
  onSearch: () => void
}

export const ArsivHeader = ({ filtreler, setFiltreler, onSearch }: ArsivHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 shadow-sm shrink-0 flex items-center gap-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg">
        <Archive size={32} />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dijital Arşiv Yönetimi</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Fiziksel klasör ve evrak takibi</p>
      </div>
      <div className="ml-auto flex gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border dark:border-gray-600">
        <input
          placeholder="Klasör Adı Ara..."
          className="p-2 border dark:border-gray-600 rounded text-sm w-48 outline-none bg-white dark:bg-gray-800 dark:text-white"
          value={filtreler.ad}
          onChange={(e) => setFiltreler({ ...filtreler, ad: e.target.value })}
        />
        <input
          placeholder="Yılı"
          className="p-2 border dark:border-gray-600 rounded text-sm w-20 outline-none bg-white dark:bg-gray-800 dark:text-white"
          value={filtreler.yili}
          onChange={(e) => setFiltreler({ ...filtreler, yili: e.target.value })}
        />
        <input
          placeholder="Dosya Kodu"
          className="p-2 border dark:border-gray-600 rounded text-sm w-24 outline-none bg-white dark:bg-gray-800 dark:text-white"
          value={filtreler.kodu}
          onChange={(e) => setFiltreler({ ...filtreler, kodu: e.target.value })}
        />
        <button onClick={onSearch} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          <Search size={18} />
        </button>
      </div>
    </div>
  )
}
