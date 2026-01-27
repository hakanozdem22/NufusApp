import { Globe, Download, Loader2, Search, Plus } from 'lucide-react'

interface TebdilHeaderProps {
  onLoadDefaults: () => void
  yukleniyor: boolean
  arama: string
  setArama: (val: string) => void
  onNew: () => void
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
  setAktifTab
}: TebdilHeaderProps) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'VIYANA_1968', label: '1968 Viyana' },
    { id: 'CENEVRE_1949', label: '1949 Cenevre' },
    { id: 'IKILI_ANLASMA', label: 'İkili Anlaşma' }
  ]

  return (
    <div className="flex flex-col gap-6 mb-8 shrink-0 w-full">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 gap-6 overflow-hidden">
        {/* 1. SECTION: TITLE & ICON */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-200 dark:shadow-none">
            <Globe size={26} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Tebdil (Ehliyet) Ülkeleri
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Karayolu Trafik Konvansiyonu Tarafları
            </p>
          </div>
        </div>

        {/* 2. SECTION: TABS & ACTIONS */}
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full xl:w-auto xl:justify-end flex-wrap xl:flex-nowrap">
          {/* TABS (Segmented Control) */}
          <div className="flex p-1.5 bg-gray-100/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shrink-0 w-full lg:w-auto overflow-x-auto min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAktifTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-1 lg:flex-none ${
                  aktifTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm scale-[1.02]'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="w-px h-10 bg-gray-200 dark:bg-gray-700 hidden lg:block mx-1 shrink-0"></div>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
            {/* Search */}
            <div className="relative w-full lg:w-64 group shrink-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                className="pl-10 pr-4 h-11 w-full border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-gray-50 dark:bg-gray-700/50 dark:text-white transition-all"
                placeholder="Ülke ara..."
                value={arama}
                onChange={(e) => setArama(e.target.value)}
              />
            </div>

            {/* Buttons Group */}
            <div className="flex gap-2 shrink-0 w-full sm:w-auto">
              {/* Load Data - Secondary Action */}
              <button
                onClick={onLoadDefaults}
                disabled={yukleniyor}
                className="h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm flex items-center justify-center gap-2 transition-all flex-1 sm:flex-none"
              >
                {yukleniyor ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                <span className="hidden sm:inline">Verileri Getir</span>
                <span className="inline sm:hidden">Getir</span>
              </button>

              {/* New Item - Primary Action */}
              <button
                onClick={onNew}
                className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex-1 sm:flex-none"
              >
                <Plus size={18} />
                <span className="whitespace-nowrap">Yeni Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
