import { Car } from 'lucide-react'
import { DashboardCard } from '../../dashboard/components/DashboardCard'

export const SurucuBelgesiDashboard = (): React.ReactElement => {
  return (
    <div className="p-6 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Sürücü Belgesi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Tebdil */}
        <DashboardCard
          title="Tebdil"
          desc="Yabancı ehliyetlerin Türk ehliyetine dönüştürülmesi"
          icon={Car}
          colorClass="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
          path="/tebdil"
        />
      </div>
    </div>
  )
}
