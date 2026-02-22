import { Wallet, UserCheck, GraduationCap } from 'lucide-react'
import { DashboardCard } from '../../dashboard/components/DashboardCard'

export const PersonelIsleriDashboard = (): React.ReactElement => {
  return (
    <div className="p-6 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Personel İşleri</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Personel Harcama */}
        <DashboardCard
          title="Harcama"
          desc="Gelir, gider ve kasa takibi"
          icon={Wallet}
          colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          path="/harcama"
        />

        {/* Personel Terfi */}
        <DashboardCard
          title="Terfi"
          desc="Derece, kademe ve terfi takibi"
          icon={UserCheck}
          colorClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
          path="/personel-terfi"
        />

        {/* Eğitim Robotu (Hizmet İçi Eğitim) */}
        <DashboardCard
          title="Hizmet İçi Eğitim"
          desc="Otomatik ders planlama"
          icon={GraduationCap}
          colorClass="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
          path="/egitim"
        />
      </div>
    </div>
  )
}
