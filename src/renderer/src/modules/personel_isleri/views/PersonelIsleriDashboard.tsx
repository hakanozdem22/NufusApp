import React, { ReactElement } from 'react'
import { Wallet, UserCheck, GraduationCap, Users, LayoutDashboard, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const PersonelIsleriDashboard = (): ReactElement => {
  const navigate = useNavigate()

  const cards = [
    {
      title: 'HARCAMA YÖNETİMİ',
      desc: 'Personel aidat, gelir, gider ve kasa takibi',
      icon: Wallet,
      color: 'from-blue-500 to-indigo-600',
      path: '/harcama',
      stat: 'Finansal Takip'
    },
    {
      title: 'TERFİ TAKİBİ',
      desc: 'Derece, kademe ve terfi ilerleme yönetimi',
      icon: UserCheck,
      color: 'from-indigo-500 to-purple-600',
      path: '/personel-terfi',
      stat: 'Kariyer Planlama'
    },
    {
      title: 'HİZMET İÇİ EĞİTİM',
      desc: 'Personel eğitim planlama ve ders robotu',
      icon: GraduationCap,
      color: 'from-rose-500 to-red-600',
      path: '/egitim',
      stat: 'Gelişim & Eğitim'
    }
  ]

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide py-6 px-4 max-w-[1400px] mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-6 relative group">
           <div className="flex items-center gap-6 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
                <Users size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight leading-none mb-2 uppercase">
                  Personel İşleri
                </h1>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic flex items-center gap-2">
                  <LayoutDashboard size={14} className="text-indigo-500" /> İnsan Kaynakları Yönetim Paneli
                </p>
              </div>
           </div>
           
           {/* Decorative line */}
           <div className="h-1 w-24 bg-gradient-to-r from-indigo-600 to-transparent rounded-full opacity-30"></div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(card.path)}
                    className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 text-left overflow-hidden flex flex-col min-h-[260px]"
                >
                    {/* Background Glow */}
                    <div className={`absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-1000`}></div>
                    
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500`}>
                        <card.icon size={24} strokeWidth={2.5} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{card.stat}</span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
                        </div>
                        <h2 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
                            {card.title}
                        </h2>
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 leading-relaxed">
                            {card.desc}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                         <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                             <span className="text-[10px] font-black uppercase tracking-widest">Modüle Git</span>
                             <ChevronRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                         </div>
                    </div>
                </button>
            ))}
        </div>

        {/* Footer Info */}
        <div className="mt-6 flex items-center justify-center border-t border-gray-100 dark:border-gray-800 pt-8 opacity-40 group hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic text-center">
                Kurumsal İnsan Kaynakları ve Veri Yönetim Sistemi v3.0
            </p>
        </div>
      </div>
    </div>
  )
}
