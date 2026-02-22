import { Search, Printer, Loader2, UserCheck, UserPlus } from 'lucide-react'

interface TerfiHeaderProps {
  arama: string
  setArama: (val: string) => void
  onPrintList: () => void
  onAddPersonnel: () => void
  yukleniyor: boolean
}

export const TerfiHeader = ({
  arama,
  setArama,
  onPrintList,
  onAddPersonnel,
  yukleniyor
}: TerfiHeaderProps): React.ReactElement => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <UserCheck size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Personel Terfi Takibi
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Derece/Kademe ilerlemeleri</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative mr-2">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="pl-10 p-2 border rounded-lg text-sm w-48 outline-none focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>

        {/* BUTON 2: PERSONEL EKLE */}
        <button
          onClick={onAddPersonnel}
          disabled={yukleniyor}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition disabled:bg-gray-400"
        >
          <UserPlus size={16} /> Personel Ekle
        </button>

        {/* TEK BUTON: PERSONEL TERFİ LİSTESİ ÇIKTISI */}
        <button
          onClick={onPrintList}
          disabled={yukleniyor}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition disabled:bg-gray-400"
        >
          {yukleniyor ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
          Personel Terfi Listesi Çıktısı
        </button>
      </div>
    </div>
  )
}
