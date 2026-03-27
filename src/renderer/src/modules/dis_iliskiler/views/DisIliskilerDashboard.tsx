import React from 'react'
import { Mail, Globe, ExternalLink } from 'lucide-react'
import { DashboardCard } from '../../dashboard/components/DashboardCard'

export const DisIliskilerDashboard = (): React.ReactElement => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto w-full px-10 py-12">
        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Globe size={26} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
              Dış İlişkiler ve Posta
            </h1>
          </div>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] ml-16 italic">
            Kurumlar Arası ve Uluslararası İletişim Paneli
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DashboardCard
            title="Posta Zimmet"
            desc="Gelen ve giden tüm evrakların dijital zimmet kaydı ve takibi."
            icon={Mail}
            colorClass="blue"
            path="/posta-zimmet"
          />

          <DashboardCard
            title="Yabancı Temsilcilikler"
            desc="Türkiye'deki yabancı misyonlar ve konsoloslukların güncel iletişim datası."
            icon={Globe}
            colorClass="emerald"
            path="/yabanci-temsilcilikler"
          />

          <DashboardCard
            title="Türk Temsilcilikleri"
            desc="Yurtdışındaki T.C. Büyükelçilikleri ve Başkonsoloslukları rehberi."
            icon={ExternalLink}
            colorClass="rose"
            path="/turk-yurtdisi-temsilcilikleri"
          />
        </div>

        {/* Bilgilendirme Notu */}
        <div className="mt-12 p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-gray-800 shadow-xl">
           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl italic">
            * Dış İlişkiler modülü, kurumun dış dünya ile olan yazışma trafiğini ve diplomatik iletişim verilerini yönetmek üzere tasarlanmıştır. Verilerin doğruluğu ve güncelliği için periyodik kontroller yapılmalıdır.
           </p>
        </div>
      </div>
    </div>
  )
}
