import {
  Wallet,
  Mail,
  Phone,
  FileText,
  UserCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  Archive,
  Globe,
  Car
} from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'

export const Dashboard = () => {
  return (
    <div className="p-6 dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* 1. Takvim / Ajanda */}
        <DashboardCard
          title="Takvim / Ajanda"
          desc="Etkinlik ve plan takibi"
          icon={Calendar}
          colorClass="bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
          path="/takvim"
        />

        {/* 2. Arşiv Yönetim */}
        <DashboardCard
          title="Arşiv Yönetim"
          desc="Fiziksel klasör ve evrak takibi"
          icon={Archive}
          colorClass="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400"
          path="/arsiv"
        />

        {/* 3. E-Apostil */}
        <DashboardCard
          title="Apostil"
          desc="E-Apostil başvuru ve sorgulama"
          icon={Globe}
          colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
          path="/e-apostil"
        />

        {/* 4. Harcama */}
        <DashboardCard
          title="Harcama"
          desc="Gelir, gider ve kasa takibi"
          icon={Wallet}
          colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          path="/harcama"
        />

        {/* 5. Posta Zimmet */}
        <DashboardCard
          title="Posta Zimmet"
          desc="Evrak kayıt ve barkod basımı"
          icon={Mail}
          colorClass="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
          path="/posta-zimmet"
        />

        {/* 6. Resmi Yazı Takip */}
        <DashboardCard
          title="Resmi Yazı Takip"
          desc="Gelen/Giden evrak yönetimi"
          icon={FileText}
          colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
          path="/resmi-yazi"
        />

        {/* 7. Hizmet İçi Eğitim */}
        <DashboardCard
          title="Hizmet İçi Eğitim"
          desc="Otomatik ders planlama"
          icon={GraduationCap}
          colorClass="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
          path="/egitim"
        />

        {/* 8. Terfi */}
        <DashboardCard
          title="Terfi"
          desc="Derece, kademe ve terfi takibi"
          icon={UserCheck}
          colorClass="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
          path="/personel-terfi"
        />

        {/* 9. Mevzuat */}
        <DashboardCard
          title="Mevzuat"
          desc="Yönetmelik ve genelgeler"
          icon={BookOpen}
          colorClass="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
          path="/mevzuat"
        />

        {/* 10. Rehber */}
        <DashboardCard
          title="Telefon Rehberi"
          desc="Kişi ve kurum iletişim listesi"
          icon={Phone}
          colorClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
          path="/rehber"
        />

        {/* 11. Tebdil */}
        <DashboardCard
          title="Tebdil"
          desc="Sürücü belgesi tebdil işlemleri"
          icon={Car}
          colorClass="bg-lime-50 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400"
          path="/tebdil"
        />
      </div>
    </div>
  )
}
