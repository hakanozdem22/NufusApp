import { ReactElement } from 'react'
import { Bell, CalendarDays, Paperclip, Trash2, Clock, ChevronRight, Zap } from 'lucide-react'
import { TakvimEtkinlik } from '../models/takvim-types'

interface TakvimSidebarProps {
  yaklasanlar: TakvimEtkinlik[]
  onItemClick: (tarih: string) => void
  onDelete: (id: number) => void
}

export const TakvimSidebar = ({ yaklasanlar, onItemClick, onDelete }: TakvimSidebarProps): ReactElement => {
  const gunFarkiHesapla = (hedefTarih: string): string => {
    const bugun = new Date()
    bugun.setHours(0, 0, 0, 0)
    const hedef = new Date(hedefTarih)
    const diffTime = Math.abs(hedef.getTime() - bugun.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'BUGÜN'
    if (diffDays === 1) return 'YARIN'
    return `${diffDays} GÜN SONRA`
  }

  return (
    <div className="w-96 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl flex flex-col overflow-hidden shrink-0 transition-all duration-500 group relative">
      {/* Decorative pulse element */}
      <div className="absolute top-8 right-8 w-2 h-2 bg-orange-500 rounded-full animate-ping opacity-20"></div>

      <div className="p-6 border-b border-white/10 dark:border-gray-800 bg-white/10 dark:bg-gray-800/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-inner">
            <Bell size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-black text-gray-800 dark:text-gray-100 text-sm tracking-tight uppercase">Yaklaşanlar</h3>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mt-1">Gündem Özeti</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-white/50 dark:bg-gray-800 rounded-full border border-white/20 shadow-sm">
          <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{yaklasanlar.length} GÖREV</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
        {yaklasanlar.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 py-20 flex flex-col items-center gap-4 opacity-30">
            <div className="w-16 h-16 rounded-3xl bg-white/20 dark:bg-gray-800 border-2 border-dashed border-white/20 flex items-center justify-center">
              <CalendarDays size={32} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Yaklaşan etkinlik yok</p>
          </div>
        ) : (
          yaklasanlar.map((item, idx) => {
            const isResmi = item.tur === 'RESMI' || item.tur === 'DINI'
            const gunFarki = gunFarkiHesapla(item.tarih)
            const isToday = gunFarki === 'BUGÜN'

            return (
              <div
                key={item.id || idx}
                onClick={() => onItemClick(item.tarih)}
                className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group/item overflow-hidden
                  ${
                    isResmi
                      ? 'bg-rose-500/10 dark:bg-rose-500/10 border-rose-500/20 shadow-lg shadow-rose-500/5'
                      : 'bg-white/40 dark:bg-gray-800/40 border-white/20 dark:border-gray-700 shadow-sm'
                  }`}
              >
                {/* Background glow for current item */}
                {isToday && <div className="absolute -left-10 -top-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>}

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div
                    className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border flex items-center gap-1.5 shadow-sm
                    ${
                      isResmi
                        ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/20'
                        : isToday
                          ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/20'
                          : 'bg-white/60 dark:bg-gray-700 text-gray-400 border-white/20'
                    }`}
                  >
                    {isToday && <Zap size={8} className="fill-white" />}
                    {gunFarki}
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 group-hover/item:text-blue-500 transition-colors">
                    <Clock size={12} />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {item.tarih.split('-').reverse().join('.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 relative z-10 pr-6">
                  <div className="flex flex-col flex-1">
                    <h4
                      className={`text-sm font-black leading-tight uppercase tracking-tight group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors ${
                        isResmi ? 'text-rose-600 dark:text-rose-400' : 'text-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {item.baslik}
                    </h4>

                    {item.dosya_yolu && (
                      <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-white/20 dark:bg-gray-900/50 rounded-xl border border-white/10 dark:border-gray-800 w-fit">
                        <Paperclip size={10} className="text-gray-400" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dosya Ekli</span>
                      </div>
                    )}
                  </div>

                  <div className="opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all duration-300">
                    <ChevronRight size={18} className="text-blue-500 underline-offset-4" strokeWidth={3} />
                  </div>
                </div>

                {!isResmi && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id as number)
                    }}
                    className="absolute bottom-4 right-4 w-9 h-9 rounded-xl bg-white/80 dark:bg-gray-700 text-gray-400 hover:text-red-500 shadow-sm border border-white/20 dark:border-gray-600 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all active:scale-90 scale-90 group-hover/item:scale-100 duration-300"
                    title="Sil"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
