import React, { ReactElement } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Hash } from 'lucide-react'
import { AYLAR, YILLAR } from '../models/takvim-types'

interface TakvimHeaderProps {
  ay: number
  yil: number
  onMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onQuickAdd: () => void
}

export const TakvimHeader = ({
  ay,
  yil,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onQuickAdd
}: TakvimHeaderProps): ReactElement => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl gap-6 relative overflow-hidden group">
      {/* Decorative Blur */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
      
      <div className="flex items-center gap-6 relative">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
          <CalendarIcon size={28} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="relative group/select">
              <select
                value={ay}
                onChange={onMonthChange}
                className="text-xl font-black text-gray-800 dark:text-white bg-white/40 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl border border-white/20 dark:border-transparent outline-none cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-all appearance-none pr-8 uppercase tracking-tight"
              >
                {AYLAR.map((a, i) => (
                  <option key={i} value={i} className="dark:bg-gray-900 font-bold">
                    {a}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-blue-500 transition-colors">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>

            <div className="relative group/select">
              <select
                value={yil}
                onChange={onYearChange}
                className="text-xl font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 dark:border-transparent outline-none cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-all appearance-none pr-8 tracking-tighter"
              >
                {YILLAR.map((y) => (
                  <option key={y} value={y} className="dark:bg-gray-900 font-bold">
                    {y}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 group-hover/select:text-blue-600 transition-colors">
                <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>
          </div>
          <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase mt-2 italic flex items-center gap-2">
            <Hash size={10} /> KURUMSAL AJANDA VE PERSONEL TAKVİMİ
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 relative">
        <div className="flex items-center gap-2 p-1.5 bg-white/20 dark:bg-gray-950/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-gray-800 shadow-inner">
          <button
            onClick={onPrevMonth}
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-300 rounded-xl hover:bg-blue-600 hover:text-white shadow-sm border border-transparent hover:border-blue-400 transition-all active:scale-90"
            title="Önceki Ay"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          
          <button
            onClick={onToday}
            className="px-5 h-9 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-white/20 dark:border-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            BUGÜN
          </button>

          <button
            onClick={onNextMonth}
            className="w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-300 rounded-xl hover:bg-blue-600 hover:text-white shadow-sm border border-transparent hover:border-blue-400 transition-all active:scale-90"
            title="Sonraki Ay"
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        <button
          onClick={onQuickAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-blue-500/20 transition-all active:scale-95 group/btn"
        >
          <Plus
            size={16}
            strokeWidth={3}
            className="group-hover/btn:rotate-90 transition-transform"
          />{' '}
          GÖREV EKLE
        </button>
      </div>
    </div>
  )
}
