import { ReactElement } from 'react'
import { List, Trash2, Calendar, Clock, User, AlertCircle, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react'
import { EgitimDers } from '../models/egitim-types'

interface EgitimDraftPanelProps {
  taslak: EgitimDers[]
  setTaslak: (val: EgitimDers[]) => void
  onSave: () => void
  activeTab: 'robot' | 'draft' | 'saved_plans'
  setActiveTab: (tab: 'robot' | 'draft' | 'saved_plans') => void
}

export const EgitimDraftPanel = ({
  taslak,
  setTaslak,
  onSave,
  activeTab,
  setActiveTab
}: EgitimDraftPanelProps): ReactElement => {
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
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden relative text-left">
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>

      {/* BAŞLIK */}
      <div className="px-10 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10 bg-white/50 dark:bg-gray-800/20 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute -left-12 -top-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
            <Sparkles size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              Taslak Program
            </h3>
            <div className="flex items-center gap-2">
              <List size={12} className="text-indigo-500" />
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic leading-none">
                {taslak.length > 0 ? `${taslak.length} DERS PLANLANDI` : 'HENÜZ DERS EKLENMEDİ'}
              </span>
            </div>
          </div>
        </div>

        {/* ORTA NAVİGASYON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-slate-100 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-1 gap-1 border border-gray-200 dark:border-gray-700 shadow-inner z-20">
          <button
            onClick={() => setActiveTab('robot')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === 'robot'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            Robot
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest relative ${
              activeTab === 'draft'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            Taslak
            {taslak.length > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                  activeTab === 'draft' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {taslak.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('saved_plans')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === 'saved_plans'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            İmza Çizelgesi
          </button>
        </div>

        {taslak.length > 0 && (
          <button
            onClick={() => setTaslak([])}
            className="relative z-10 flex items-center gap-2 px-6 py-3 text-[10px] font-black text-rose-500 bg-white dark:bg-gray-800 hover:bg-rose-500 hover:text-white rounded-xl transition-all active:scale-95 uppercase tracking-widest border border-rose-100 dark:border-gray-700 shadow-sm"
          >
            <Trash2 size={16} strokeWidth={3} />
            TÜMÜNÜ SİL
          </button>
        )}
      </div>

      {/* İÇERİK - TIMELINE VIEW */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        {taslak.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 opacity-30 py-20">
            <div className="w-32 h-32 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-inner">
              <Calendar size={64} strokeWidth={1} className="text-gray-400 dark:text-gray-600" />
            </div>
            <div className="text-center max-w-xs px-4">
              <p className="font-black text-xs uppercase tracking-[0.3em] mb-3">Program Planı Boş</p>
              <p className="text-[11px] font-bold italic leading-relaxed">Sol panelden robotu çalıştırın veya manuel ders ekleyerek taslağı oluşturun.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12 pb-32 max-w-4xl mx-auto">
            {sortedDates.map((date) => (
              <div key={date} className="relative group/day">
                {/* Tarih Başlığı */}
                <div className="flex items-center gap-6 mb-6 sticky top-0 py-3 bg-slate-50/80 dark:bg-gray-900/80 backdrop-blur-xl z-20 rounded-2xl px-4 border border-gray-100/50 dark:border-gray-800 shadow-sm transition-all group-hover/day:border-indigo-500/20">
                  <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                    <Calendar size={18} strokeWidth={3} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-gray-800 dark:text-white text-sm uppercase tracking-tight">
                        {new Date(date).toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                        })}
                    </span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{groupedTaslak[date].length} Oturum Planlandı</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
                </div>

                {/* Vertical Line */}
                <div className="absolute left-[34px] top-20 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-full opacity-10"></div>

                {/* Ders Kartları */}
                <div className="space-y-6 pl-16 pr-4 relative">
                  {groupedTaslak[date].map((ders, idx) => (
                    <div
                      key={idx}
                      className={`relative group bg-white dark:bg-gray-800 p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
                        ders.zorunlu
                          ? 'border-indigo-500/30 shadow-xl shadow-indigo-500/5'
                          : 'border-gray-100 dark:border-gray-800 shadow-lg'
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[44px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 shadow-lg transition-transform group-hover:scale-125 z-10 ${
                          ders.zorunlu
                            ? 'bg-indigo-600 border-white dark:border-gray-900'
                            : 'bg-slate-300 dark:bg-gray-600 border-white dark:border-gray-900'
                        }`}
                      ></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-gray-900/60 rounded-lg border border-gray-100 dark:border-gray-700 shadow-inner">
                                <Clock size={10} className="text-blue-500" strokeWidth={3} />
                                <span className="text-[9px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{ders.saat}</span>
                            </div>
                            
                            {ders.zorunlu && (
                              <div className="flex items-center gap-2 px-2 py-1 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/20">
                                <AlertCircle size={10} strokeWidth={3} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Zorunlu</span>
                              </div>
                            )}
                          </div>

                          <h4 className="font-black text-gray-800 dark:text-gray-100 text-sm leading-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                            {ders.konu}
                          </h4>

                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50/50 dark:bg-gray-800/30 rounded-lg border border-gray-100/50 dark:border-gray-700/50 w-fit">
                            <div className="w-5 h-5 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
                                <User size={10} strokeWidth={3} />
                            </div>
                           <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest italic">{ders.egitici}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                             <button
                                onClick={() => {
                                    const newTaslak = [...taslak]
                                    const indexToRemove = taslak.findIndex((t) => t === ders)
                                    if (indexToRemove > -1) {
                                    newTaslak.splice(indexToRemove, 1)
                                    setTaslak(newTaslak)
                                    }
                                }}
                                className="w-9 h-9 flex items-center justify-center text-rose-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                                title="Dersi Sil"
                            >
                                <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                        </div>
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
      <div className="px-10 py-7 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 flex items-center justify-between gap-10">
        <div className="hidden lg:flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Plan Onay ve Kayıt</span>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-300">Bu taslak programı doğruladıysanız veri merkezine kaydedebilirsiniz.</p>
        </div>
        
        <button
          onClick={onSave}
          disabled={taslak.length === 0}
          className={`flex-1 lg:flex-none px-12 py-4.5 rounded-xl font-black text-xs uppercase tracking-[0.3em] flex justify-center items-center gap-4 transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden group/save ${
            taslak.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/save:translate-x-full transition-transform duration-1000"></div>
          {taslak.length === 0 ? <AlertCircle size={20} strokeWidth={3} /> : <CheckCircle2 size={20} strokeWidth={3} />}
          BU PLANI VERİ TABANINA KAYDET
          <ChevronRight size={16} strokeWidth={3} className="ml-2 group-hover/save:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
