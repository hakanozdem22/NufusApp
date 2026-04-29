import {
  Wallet,
  Mail,
  MailOpen,
  Phone,
  FileText,
  UserCheck,
  GraduationCap,
  Calendar,
  Archive,
  Globe,
  Package,
  StickyNote,
  Send,
  ClipboardList,
  BookOpen,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react'
import { DashboardCard } from '../components/DashboardCard'

export const Dashboard = (): React.ReactElement => {
  return (
    <div className="relative p-6 lg:p-10 min-h-full bg-slate-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      {/* REFIRNED AMBIENT LIGHTING */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 dark:bg-purple-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse [animation-delay:2.5s]"></div>

      <div className="max-w-[1700px] mx-auto relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">
                SİSTEM ÇEVRİMİÇİ
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white tracking-tighter leading-none">
              Hoş Geldiniz
            </h1>
            <p className="text-gray-400 dark:text-gray-500 font-bold text-[13px] tracking-tight">
              Personel İşleri ve Mevzuat Yönetim Ekosistemi
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 dark:border-gray-800 shadow-lg">
            <div className="px-4 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Son Güncelleme: Bugün
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4">
          {/* 1. Takvim / Ajanda */}
          <DashboardCard
            title="Takvim / Ajanda"
            desc="Etkinlik ve planlama"
            icon={Calendar}
            color="pink"
            path="/takvim"
          />

          {/* 2. Arşiv Yönetim */}
          <DashboardCard
            title="Arşiv Yönetim"
            desc="Klasör ve evrak takibi"
            icon={Archive}
            color="cyan"
            path="/arsiv"
          />

          {/* 4. Harcama */}
          <DashboardCard
            title="Harcama"
            desc="Gelir ve gider takibi"
            icon={Wallet}
            color="blue"
            path="/harcama"
          />

          {/* 5. Posta Zimmet */}
          <DashboardCard
            title="Posta Zimmet"
            desc="Evrak kayıt ve takip"
            icon={Mail}
            color="orange"
            path="/posta-zimmet"
          />

          {/* 5.1 Yabancı Temsilcilikler */}
          <DashboardCard
            title="Yabancı Temsilcilikler"
            desc="Misyon iletişim bilgileri"
            icon={Globe}
            color="teal"
            path="/yabanci-temsilcilikler"
          />

          {/* 5.2 Türk Yurtdışı Temsilcilikleri */}
          <DashboardCard
            title="Türk Temsilcilikleri"
            desc="Yurtdışı misyon rehberi"
            icon={Globe}
            color="rose"
            path="/turk-yurtdisi-temsilcilikleri"
          />

          {/* 5.3 Apostil */}
          <DashboardCard
            title="Apostil"
            desc="Yabancı belge tasdiki"
            icon={FileText}
            color="cyan"
            path="/apostil"
          />

          {/* 6. Resmi Yazı Takip */}
          <DashboardCard
            title="Resmi Yazı"
            desc="Evrak yönetimi"
            icon={FileText}
            color="purple"
            path="/resmi-yazi"
          />

          {/* 7. Hizmet İçi Eğitim */}
          <DashboardCard
            title="Hizmet İçi Eğitim"
            desc="Ders ve planlama"
            icon={GraduationCap}
            color="red"
            path="/egitim"
          />

          {/* 8. Terfi */}
          <DashboardCard
            title="Personel Terfi"
            desc="Derece ve kademe"
            icon={UserCheck}
            color="indigo"
            path="/personel-terfi"
          />

          {/* 10. Rehber */}
          <DashboardCard
            title="Telefon Rehberi"
            desc="Kurumsal iletişim"
            icon={Phone}
            color="green"
            path="/rehber"
          />

          {/* 12. Envanter */}
          <DashboardCard
            title="Taşınır Envanteri (Elektronik)"
            desc="Malzeme yönetimi"
            icon={Package}
            color="emerald"
            path="/envanter"
          />

          {/* 13. Notlar */}
          <DashboardCard
            title="Notlar"
            desc="Kişisel notlar ve anımsatıcılar"
            icon={StickyNote}
            color="orange"
            path="/notlar"
          />

          {/* 14. Posta Arşivi */}
          <DashboardCard
            title="Posta Arşivi"
            desc="Gelen evrak arşivi"
            icon={MailOpen}
            color="teal"
            path="/posta-arsiv"
          />

          {/* 15. Gönderilen Belgeler */}
          <DashboardCard
            title="Gönderilen Belgeler"
            desc="Kurumlara gönderilen evrak"
            icon={Send}
            color="purple"
            path="/gonderilen-belgeler"
          />

          {/* 16. Personel Görevlendirmeleri */}
          <DashboardCard
            title="Görevlendirmeler"
            desc="Personel görev atamaları"
            icon={ClipboardList}
            color="indigo"
            path="/personel-gorevlendirme"
          />

          {/* 17. Personel İşleri */}
          <DashboardCard
            title="Personel İşleri"
            desc="Özlük ve sicil işlemleri"
            icon={Users}
            color="blue"
            path="/personel-isleri"
          />

          {/* 18. Belgeler Arşivi */}
          <DashboardCard
            title="Belgeler"
            desc="PDF belge arşivi"
            icon={BookOpen}
            color="rose"
            path="/belgeler"
          />

          {/* 19. Belge Doğrulama */}
          <DashboardCard
            title="Belge Doğrulama"
            desc="Ülke bazlı doğrulama siteleri"
            icon={ShieldCheck}
            color="emerald"
            path="/belge-dogrulama"
          />

          {/* 20. Kurum Harcama */}
          <DashboardCard
            title="Kurum Harcama"
            desc="Gelir ve gider yönetimi"
            icon={Building2}
            color="purple"
            path="/kurum-harcama"
          />
        </div>
      </div>
    </div>
  )
}
