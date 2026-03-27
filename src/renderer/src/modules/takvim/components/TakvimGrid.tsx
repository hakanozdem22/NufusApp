import React, { ReactElement } from 'react'
import { Paperclip, Trash2, CalendarCheck2, Star, Zap } from 'lucide-react'
import { GUNLER, TakvimEtkinlik } from '../models/takvim-types'

interface TakvimGridProps {
  yil: number
  ay: number
  gunSayisi: number
  baslangicBosluk: number
  dbEtkinlikler: TakvimEtkinlik[]
  resmiTatiller: TakvimEtkinlik[]
  onDayClick: (gun: number) => void
  onDelete: (id: number) => void
}

export const TakvimGrid = ({
  yil,
  ay,
  gunSayisi,
  baslangicBosluk,
  dbEtkinlikler,
  resmiTatiller,
  onDayClick,
  onDelete
}: TakvimGridProps): ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col h-full overflow-hidden group">
      {/* Gün İsimleri Header */}
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
        {GUNLER.map((gun) => {
          const isWeekend = gun === 'Cumartesi' || gun === 'Pazar'
          return (
            <div
              key={gun}
              className={`py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] border-r border-gray-100/50 dark:border-gray-700/50 last:border-r-0
                ${isWeekend ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500'}`}
            >
              {gun}
            </div>
          )
        })}
      </div>

      {/* Takvim Izgarası */}
      <div className="grid grid-cols-7 flex-1 auto-rows-[1fr] relative">
        {/* Boşluklar */}
        {Array.from({ length: baslangicBosluk }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="border-b border-r border-gray-50 dark:border-gray-800/50 bg-slate-50/20 dark:bg-gray-950/20"
          ></div>
        ))}

        {/* Günler */}
        {Array.from({ length: gunSayisi }).map((_, i) => {
          const gun = i + 1
          const tamTarih = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`
          const dateObj = new Date(yil, ay, gun)
          const bugunMu = new Date().toDateString() === dateObj.toDateString()
          const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6

          const gununEtkinlikleri = [
            ...dbEtkinlikler.filter((e) => e.tarih === tamTarih),
            ...resmiTatiller.filter((e) => e.tarih === tamTarih)
          ]

          return (
            <div
              key={gun}
              onClick={() => onDayClick(gun)}
              className={`
                border-b border-r border-gray-100/50 dark:border-gray-800/50 p-3 relative group/day hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 cursor-pointer flex flex-col gap-2 
                ${bugunMu ? 'bg-blue-50/30 dark:bg-blue-900/10' : isWeekend ? 'bg-rose-50/20 dark:bg-rose-900/5' : ''} 
              `}
            >
              <div className="flex justify-between items-start">
                 <span
                  className={`text-xs font-black w-8 h-8 flex items-center justify-center rounded-[0.8rem] transition-all duration-500
                    ${bugunMu 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                        : isWeekend 
                            ? 'text-rose-500 dark:text-rose-400 font-black' 
                            : 'text-gray-700 dark:text-gray-300 group-hover/day:text-blue-500'
                    }`}
                >
                  {gun}
                </span>
                
                {bugunMu && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-100/50 dark:bg-blue-900/30 rounded-full border border-blue-200/50 dark:border-blue-800/50 animate-pulse">
                     <Zap size={8} className="text-blue-600 dark:text-blue-400 fill-blue-600" />
                     <span className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">BUGÜN</span>
                  </div>
                )}
              </div>

              {/* Etkinlik Listesi Cell İçinde */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto scrollbar-hide max-h-[100px] mt-1 pr-1">
                {gununEtkinlikleri.map((etkinlik, idx) => {
                  const isResmi = etkinlik.tur === 'RESMI' || etkinlik.tur === 'DINI'
                  return (
                    <div
                      key={etkinlik.id || `temp-${idx}`}
                      className={`text-[9px] px-2 py-1.5 rounded-xl border flex items-center gap-2 group/item relative pr-6 shadow-sm transition-all hover:scale-[1.02]
                        ${isResmi 
                          ? 'bg-rose-100/60 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800 font-bold' 
                          : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800/50'
                        }`}
                      title={etkinlik.baslik}
                    >
                      <div className={`w-1 h-1 rounded-full shrink-0 ${isResmi ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
                      {etkinlik.dosya_yolu && <Paperclip size={10} className="shrink-0 opacity-50" />}
                      <span className="truncate uppercase font-black tracking-tighter">{etkinlik.baslik}</span>
                      
                      {!isResmi && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (etkinlik.id) onDelete(etkinlik.id as number)
                          }}
                          className="absolute right-1 w-5 h-5 flex items-center justify-center text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all shadow-sm"
                        >
                          <Trash2 size={10} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Hover Indicator */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover/day:opacity-30 transition-opacity">
                <CalendarCheck2 size={16} strokeWidth={1} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
