import { Mail, Globe } from 'lucide-react'
import { DashboardCard } from '../../dashboard/components/DashboardCard'

export const DisIliskilerDashboard = (): React.ReactElement => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Mail className="text-blue-600 dark:text-blue-400" size={28} />
          Posta
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Posta Zimmet"
          desc="Giden evrak ve posta zimmet takibi"
          icon={Mail}
          colorClass="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
          path="/posta-zimmet"
        />

        <DashboardCard
          title="Yabancı Temsilcilikler"
          desc="Yabancı misyon iletişim bilgileri"
          icon={Globe}
          colorClass="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
          path="/yabanci-temsilcilikler"
        />

        <DashboardCard
          title="Türk Yurtdışı Temsilcilikleri"
          desc="Yurtdışındaki Türk misyonları"
          icon={Globe}
          colorClass="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
          path="/turk-yurtdisi-temsilcilikleri"
        />
      </div>
    </div>
  )
}
