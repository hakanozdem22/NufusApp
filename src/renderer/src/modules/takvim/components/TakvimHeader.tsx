import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
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
}: TakvimHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
          <CalendarIcon size={28} />
        </div>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <select
              value={ay}
              onChange={onMonthChange}
              className="text-xl font-bold text-gray-800 dark:text-white bg-transparent outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            >
              {AYLAR.map((a, i) => (
                <option key={i} value={i} className="dark:bg-gray-800">
                  {a}
                </option>
              ))}
            </select>
            <select
              value={yil}
              onChange={onYearChange}
              className="text-xl font-bold text-gray-800 dark:text-white bg-transparent outline-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            >
              {YILLAR.map((y) => (
                <option key={y} value={y} className="dark:bg-gray-800">
                  {y}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ajanda ve Planlama</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
        <button
          onClick={onPrevMonth}
          className="p-2 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition text-gray-600 dark:text-gray-200"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={onToday}
          className="px-4 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition"
        >
          Bugün
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded-md transition text-gray-600 dark:text-gray-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <button
        onClick={onQuickAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition"
      >
        <Plus size={18} /> Görev Ekle
      </button>
    </div>
  )
}
