import { LucideIcon, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DashboardCardProps {
  title: string
  desc: string
  icon: LucideIcon
  color:
    | 'pink'
    | 'cyan'
    | 'blue'
    | 'orange'
    | 'teal'
    | 'rose'
    | 'purple'
    | 'red'
    | 'indigo'
    | 'green'
    | 'emerald'
  path: string
}

const colorMap = {
  pink: 'from-pink-500 to-rose-500 shadow-pink-500/20 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
  cyan: 'from-cyan-500 to-blue-500 shadow-cyan-500/20 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20',
  blue: 'from-blue-500 to-indigo-500 shadow-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  orange:
    'from-orange-500 to-amber-500 shadow-orange-500/20 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
  teal: 'from-teal-500 to-emerald-500 shadow-teal-500/20 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20',
  rose: 'from-rose-500 to-red-500 shadow-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20',
  purple:
    'from-purple-500 to-fuchsia-500 shadow-purple-500/20 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  red: 'from-red-500 to-orange-500 shadow-red-500/20 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
  indigo:
    'from-indigo-500 to-blue-500 shadow-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
  green:
    'from-green-500 to-emerald-500 shadow-green-500/20 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  emerald:
    'from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
}

export const DashboardCard = ({
  title,
  desc,
  icon: Icon,
  color,
  path
}: DashboardCardProps): React.ReactElement => {
  const navigate = useNavigate()
  const themeClasses = colorMap[color] || colorMap.blue
  const themeArray = themeClasses.split(' ')

  const gradientFrom = themeArray[0]
  const gradientTo = themeArray[1]
  const textClasses = `${themeArray[3]} ${themeArray[4]}`
  const bgClasses = `${themeArray[5]} ${themeArray[6]}`

  return (
    <div
      onClick={() => navigate(path)}
      className="group relative bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-gray-800/50 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center gap-4 overflow-hidden hover:scale-[1.02] active:scale-95 ring-1 ring-transparent hover:ring-blue-500/30"
    >
      {/* COMPACT ICON CONTAINER */}
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${bgClasses} ${textClasses} group-hover:scale-110 transition-transform duration-300 relative`}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-300`}
        ></div>
        <Icon size={24} strokeWidth={2.5} className="relative z-10" />
      </div>

      <div className="flex flex-col min-w-0">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
          {title}
        </h3>
        <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-tight mt-0.5 truncate pr-2">
          {desc}
        </p>
      </div>

      <div
        className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:bg-gradient-to-r ${gradientFrom} ${gradientTo} group-hover:text-white transition-all duration-300`}
      >
        <ChevronRight size={14} strokeWidth={3} />
      </div>
    </div>
  )
}
