import { List, Trash2, Save, Calendar, Clock, User, AlertCircle } from 'lucide-react'
import { EgitimDers } from '../models/egitim-types'

interface EgitimDraftPanelProps {
  taslak: EgitimDers[]
  setTaslak: (val: EgitimDers[]) => void
  onSave: () => void
}

export const EgitimDraftPanel = ({ taslak, setTaslak, onSave }: EgitimDraftPanelProps) => {
  // Dersleri tarihe göre grupla
  const groupedTaslak = taslak.reduce(
    (acc, ders) => {
      const date = ders.tarih
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(ders)
      return acc
    },
    {} as Record<string, EgitimDers[]>
  )

  // Tarihleri sırala
  const sortedDates = Object.keys(groupedTaslak).sort((a, b) => a.localeCompare(b))

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden relative">
      {/* BAŞLIK */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center z-10">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <List size={18} />
            </div>
            Taslak Program
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-1">
            {taslak.length > 0 ? `${taslak.length} ders planlandı` : 'Henüz ders eklenmedi'}
          </p>
        </div>

        {taslak.length > 0 && (
          <button
            onClick={() => setTaslak([])}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
            TEMİZLE
          </button>
        )}
      </div>

      {/* İÇERİK - TIMELINE VIEW */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {taslak.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-60">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Calendar size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg text-gray-500 dark:text-gray-400">Taslak Boş</p>
              <p className="text-sm">Sol panelden robotu çalıştırın veya manuel ders ekleyin.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-20">
            {sortedDates.map((date) => (
              <div key={date} className="relative pl-4">
                {/* Tarih Başlığı (Sticky olabilir ama şimdilik normal) */}
                <div className="flex items-center gap-3 mb-3 sticky top-0 bg-gray-50/95 dark:bg-gray-900/95 p-2 rounded-lg backdrop-blur-sm z-10 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-1.5 rounded-md">
                    <Calendar size={16} />
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                    {new Date(date).toLocaleDateString('tr-TR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700 ml-2"></div>
                </div>

                {/* Ders Kartları */}
                <div className="space-y-3 pl-2 border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-3">
                  {groupedTaslak[date].map((ders, idx) => (
                    <div
                      key={idx}
                      className={`relative group bg-white dark:bg-gray-800 p-3 rounded-xl border transition-all hover:shadow-md ${
                        ders.zorunlu
                          ? 'border-l-4 border-l-indigo-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-700 dark:border-r-gray-700'
                          : 'border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[19px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${
                          ders.zorunlu
                            ? 'bg-indigo-500 border-white dark:border-gray-900'
                            : 'bg-gray-300 dark:bg-gray-600 border-white dark:border-gray-900'
                        }`}
                      ></div>

                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock size={10} />
                              {ders.saat}
                            </span>
                            {ders.zorunlu && (
                              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded flex items-center gap-1">
                                <AlertCircle size={10} /> Zorunlu
                              </span>
                            )}
                          </div>

                          <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight mb-1">
                            {ders.konu}
                          </h4>

                          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                            <User size={12} />
                            {ders.egitici}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            // Silme işlemi için taslak state'ini güncellememiz lazım
                            // Bu biraz hacky, çünkü index tarihler arasında kayboluyor
                            // Gerçek uygulamada unique ID kullanmak daha iyi
                            const newTaslak = [...taslak]
                            const indexToRemove = taslak.findIndex((t) => t === ders)
                            if (indexToRemove > -1) {
                              newTaslak.splice(indexToRemove, 1)
                              setTaslak(newTaslak)
                            }
                          }}
                          className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Dersi Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER - KAYDET BUTTON */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-20">
        <button
          onClick={onSave}
          disabled={taslak.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold shadow-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] ${
            taslak.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200 dark:shadow-none'
          }`}
        >
          <Save size={20} />
          BU PLANI KAYDET
        </button>
      </div>
    </div>
  )
}
