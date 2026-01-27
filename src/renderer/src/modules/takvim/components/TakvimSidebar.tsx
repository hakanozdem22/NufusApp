import { Bell, CalendarDays, Paperclip, Trash2 } from 'lucide-react'
import { TakvimEtkinlik } from '../models/takvim-types'

interface TakvimSidebarProps {
  yaklasanlar: TakvimEtkinlik[]
  onItemClick: (tarih: string) => void
  onDelete: (id: number) => void
}

export const TakvimSidebar = ({ yaklasanlar, onItemClick, onDelete }: TakvimSidebarProps) => {
  const gunFarkiHesapla = (hedefTarih: string) => {
    const bugun = new Date()
    bugun.setHours(0, 0, 0, 0)
    const hedef = new Date(hedefTarih)
    const diffTime = Math.abs(hedef.getTime() - bugun.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Bugün'
    if (diffDays === 1) return 'Yarın'
    return `${diffDays} gün sonra`
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shrink-0 transition-colors">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <Bell size={18} className="text-orange-500" />
        <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Yaklaşanlar / Ajanda</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {yaklasanlar.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500 text-xs py-10 flex flex-col items-center gap-2">
            <CalendarDays size={32} className="opacity-20" />
            Yaklaşan etkinlik yok.
          </div>
        ) : (
          yaklasanlar.map((item, idx) => {
            const isResmi = item.tur === 'RESMI' || item.tur === 'DINI'
            return (
              <div
                key={item.id || idx}
                onClick={() => onItemClick(item.tarih)}
                className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-md relative group
                  ${
                    isResmi
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
                  }`}
              >
                {!isResmi && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id as number)
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="flex justify-between items-start mb-1 pr-6">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isResmi
                        ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                        : 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    {gunFarkiHesapla(item.tarih)}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {item.tarih.split('-').reverse().join('.')}
                  </span>
                </div>
                <h4
                  className={`text-xs font-bold leading-tight ${
                    isResmi ? 'text-red-900 dark:text-red-100' : 'text-blue-900 dark:text-blue-100'
                  }`}
                >
                  {item.baslik}
                </h4>
                {item.dosya_yolu && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                    <Paperclip size={10} /> Dosya ekli
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
