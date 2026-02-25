import { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DashboardCardProps {
  title: string
  desc: string
  icon: LucideIcon
  colorClass: string
  path: string
}

export const DashboardCard = ({
  title,
  desc,
  icon: Icon,
  colorClass,
  path
}: DashboardCardProps) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(path)}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer flex items-center gap-4 group"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colorClass} group-hover:scale-110 transition-transform`}
      >
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  )
}
