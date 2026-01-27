import { Paperclip } from 'lucide-react'
import { GUNLER, TakvimEtkinlik } from '../models/takvim-types'

interface TakvimGridProps {
  yil: number
  ay: number
  gunSayisi: number
  baslangicBosluk: number
  dbEtkinlikler: TakvimEtkinlik[]
  resmiTatiller: TakvimEtkinlik[]
  onDayClick: (gun: number) => void
}

export const TakvimGrid = ({
  yil,
  ay,
  gunSayisi,
  baslangicBosluk,
  dbEtkinlikler,
  resmiTatiller,
  onDayClick
}: TakvimGridProps) => {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {GUNLER.map((gun) => (
          <div
            key={gun}
            className={`py-3 text-center text-xs font-bold uppercase tracking-wider ${gun === 'Cumartesi' || gun === 'Pazar' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {gun}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {Array.from({ length: baslangicBosluk }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="border-b border-r border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50"
          ></div>
        ))}

        {Array.from({ length: gunSayisi }).map((_, i) => {
          const gun = i + 1
          const tamTarih = `${yil}-${String(ay + 1).padStart(2, '0')}-${String(gun).padStart(2, '0')}`
          const bugunMu = new Date().toDateString() === new Date(yil, ay, gun).toDateString()
          const dateObj = new Date(yil, ay, gun)
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
                            border-b border-r border-gray-100 dark:border-gray-700/50 p-2 min-h-[100px] relative group hover:bg-blue-50/80 dark:hover:bg-blue-900/10 transition cursor-pointer flex flex-col gap-1 
                            ${bugunMu ? 'bg-blue-50 dark:bg-blue-900/20' : isWeekend ? 'bg-red-50/30 dark:bg-red-900/10' : ''} 
                        `}
            >
              <span
                className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${bugunMu ? 'bg-blue-600 text-white shadow-md' : isWeekend ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {gun}
              </span>

              <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar max-h-[80px]">
                {gununEtkinlikleri.map((etkinlik, idx) => {
                  const isResmi = etkinlik.tur === 'RESMI' || etkinlik.tur === 'DINI'
                  return (
                    <div
                      key={etkinlik.id || `temp-${idx}`}
                      className={`text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center gap-1 ${isResmi ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800 font-bold' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'}`}
                      title={etkinlik.baslik}
                    >
                      {etkinlik.dosya_yolu && <Paperclip size={10} className="shrink-0" />}
                      {etkinlik.baslik}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
