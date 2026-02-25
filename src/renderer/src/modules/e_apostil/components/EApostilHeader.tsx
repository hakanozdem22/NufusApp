import { Globe, Download, Loader2, Search, Plus } from 'lucide-react'

interface EApostilHeaderProps {
  onLoadDefaults: () => void
  yukleniyor: boolean
  arama: string
  setArama: (val: string) => void
  onNew: () => void
}

export const EApostilHeader = ({
  onLoadDefaults,
  yukleniyor,
  arama,
  setArama,
  onNew
}: EApostilHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Globe size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Apostil Ülkeleri</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ülke bazlı doğrulama ve resmi yazılar
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onLoadDefaults}
          disabled={yukleniyor}
          className="bg-green-600 hover:bg-green-700 text-white px-4 h-10 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition mr-2"
        >
          {yukleniyor ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          Varsayılanları Yükle
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="pl-10 pr-3 h-10 border dark:border-gray-600 rounded-lg text-sm w-64 outline-none focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
            placeholder="Ülke Ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>
        <button
          onClick={onNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 h-10 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={18} /> Yeni Ekle
        </button>
      </div>
    </div>
  )
}
