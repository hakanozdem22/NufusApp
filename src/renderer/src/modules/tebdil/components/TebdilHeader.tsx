import { Globe, Download, Loader2, Search, Plus, Trash2 } from 'lucide-react'

interface TebdilHeaderProps {
  onLoadDefaults: () => void
  yukleniyor: boolean
  arama: string
  setArama: (val: string) => void
  onNew: () => void
  onClear: () => void
  aktifTab: 'VIYANA_1968' | 'CENEVRE_1949' | 'IKILI_ANLASMA'
  setAktifTab: (tab: 'VIYANA_1968' | 'CENEVRE_1949' | 'IKILI_ANLASMA') => void
}

type TabType = 'VIYANA_1968' | 'CENEVRE_1949' | 'IKILI_ANLASMA'

export const TebdilHeader = ({
  onLoadDefaults,
  yukleniyor,
  arama,
  setArama,
  onNew,
  aktifTab,
  setAktifTab,
  onClear
}: TebdilHeaderProps) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'VIYANA_1968', label: '1968 Viyana' },
    { id: 'CENEVRE_1949', label: '1949 Cenevre' },
    { id: 'IKILI_ANLASMA', label: 'İkili Anlaşma' }
  ]

  return (
    <div className="mb-6 shrink-0 w-full">
      <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* LEFT SIDE: Icon + Title */}
          <div className="flex items-center gap-4 self-start lg:self-center shrink-0">
            {/* Icon */}
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
              <Globe size={22} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                Tebdil (Ehliyet) Ülkeleri
              </h1>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Karayolu Trafik Konvansiyonu Tarafları
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Tabs & Controls Column */}
          <div className="flex flex-col gap-3 w-full lg:w-auto">
            {/* Row 1: Tabs (Expands to match Row 2 width) */}
            <div className="flex p-1 bg-gray-100/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAktifTab(tab.id)}
                  className={`flex-1 h-6 flex items-center justify-center rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap px-2 ${
                    aktifTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Row 2: Search + Buttons */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Search */}
              <div className="relative w-full sm:w-[180px] group shrink-0">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                  size={15}
                />
                <input
                  className="pl-8 pr-3 h-8 w-full border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-gray-50 dark:bg-gray-700/50 dark:text-white transition-all"
                  placeholder="Ülke ara..."
                  value={arama}
                  onChange={(e) => setArama(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <button
                  onClick={onLoadDefaults}
                  disabled={yukleniyor}
                  className="h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                >
                  {yukleniyor ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  <span className="whitespace-nowrap">Verileri Getir</span>
                </button>

                <button
                  onClick={onClear}
                  className="h-8 px-3 rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                  title="Bu bölümdeki tüm kartları sil"
                >
                  <Trash2 size={14} />
                  <span className="whitespace-nowrap">Temizle</span>
                </button>

                <button
                  onClick={onNew}
                  className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex-1 sm:flex-none"
                >
                  <Plus size={14} />
                  <span className="whitespace-nowrap">Yeni Ekle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
