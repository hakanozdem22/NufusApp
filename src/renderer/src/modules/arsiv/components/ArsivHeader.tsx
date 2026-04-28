import { ReactElement } from 'react'
import { Archive, Search, Filter } from 'lucide-react'
import { ArsivFiltre } from '../models/arsiv-types'

interface ArsivHeaderProps {
  filtreler: ArsivFiltre
  setFiltreler: (val: ArsivFiltre) => void
  onSearch: () => void
}

export const ArsivHeader = ({ filtreler, setFiltreler, onSearch }: ArsivHeaderProps): ReactElement => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-4 rounded-xl border border-white/20 dark:border-gray-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
      
      {/* BAŞLIK */}
      <div className="flex items-center gap-4 relative shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
          <Archive size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-800 dark:text-white tracking-tight leading-none mb-1.5">
            Dijital Arşiv
          </h1>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black tracking-[0.2em] uppercase italic leading-none">
            Fiziksel Dosya ve Evrak Havuzu
          </p>
        </div>
      </div>

      {/* ARAMA VE FİLTRELEME - Premium Search Bar */}
      <div className="flex-1 max-w-2xl w-full relative">
        <div className="flex items-center p-1 bg-white/40 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-transparent focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-gray-900 rounded-[1.2rem] shadow-inner group/search transition-all duration-300">
          <div className="relative flex-1">
            <Search
              size={18}
              strokeWidth={2.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-blue-500 transition-colors"
            />
            <input
              placeholder="Klasör Adı veya Açıklama ile ara..."
              className="w-full pl-12 pr-4 py-2 bg-transparent text-sm font-bold focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400/70"
              value={filtreler.ad}
              onChange={(e) => setFiltreler({ ...filtreler, ad: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700/50 mx-2"></div>

          <div className="flex items-center gap-2 px-4 shrink-0">
            <Filter size={14} className="text-gray-400" />
            <input
              placeholder="YIL"
              className="w-16 bg-transparent text-sm text-center focus:outline-none text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest placeholder-gray-400"
              value={filtreler.yili}
              onChange={(e) => setFiltreler({ ...filtreler, yili: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              maxLength={4}
            />
          </div>

          <button
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Search size={14} strokeWidth={3} /> ARA
          </button>
        </div>
      </div>

      {/* SİSTEM DURUMU */}
      <div className="hidden lg:flex flex-col items-end shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase leading-none italic">
          Arşiv Motoru v2.0
        </span>
        <div className="flex items-center gap-2 mt-2 px-2.5 py-1 bg-green-500/10 rounded-full border border-green-500/20">
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-green-600 dark:text-green-500 tracking-widest">
            AKTİF SİNKRONİZASYON
          </span>
        </div>
      </div>
    </div>
  )
}
