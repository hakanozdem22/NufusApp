import { ReactElement } from 'react'
import { Edit2, Trash2, FileSpreadsheet, PackagePlus, FileDown } from 'lucide-react'

interface ArsivToolbarProps {
  onAdd: () => void
  selectedCount: number
  onBulkUpdate: () => void
  onBulkDelete: () => void
  onReport: () => void
  onImport: () => void
}

export const ArsivToolbar = ({
  onAdd,
  selectedCount,
  onBulkUpdate,
  onBulkDelete,
  onReport,
  onImport
}: ArsivToolbarProps): ReactElement => {
  return (
    <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-2.5 lg:p-3 rounded-xl border border-white/20 dark:border-gray-800 shadow-xl flex flex-wrap items-center gap-3 transition-all duration-500 group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* ANA İŞLEMLER */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2.5 px-5 lg:px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/40 transition-all active:scale-95 group/btn"
      >
        <PackagePlus size={16} strokeWidth={3} className="group-hover/btn:rotate-12 transition-transform" />
        YENİ KLASÖR KAYDI
      </button>

      <button
        onClick={onImport}
        className="flex items-center gap-2.5 px-5 lg:px-6 py-2.5 bg-emerald-500/10 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-tight border border-emerald-500/20 dark:border-emerald-800 transition-all hover:bg-emerald-500/20 dark:hover:bg-emerald-900/40 active:scale-95 group/excel"
      >
        <FileSpreadsheet size={16} strokeWidth={2.5} className="group-hover/excel:translate-y-[-2px] transition-transform" />
        EXCEL&apos;DEN AKTAR
      </button>

      {/* AYIRICI */}
      <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block opacity-50"></div>

      {/* RAPORLAMA */}
      <button
        onClick={onReport}
        className="flex items-center gap-2.5 px-5 lg:px-6 py-2.5 bg-white/40 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-tight border border-white/20 dark:border-gray-700 shadow-sm transition-all hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-900/50 active:scale-95"
      >
        <FileDown size={16} strokeWidth={2.5} className="text-blue-500" />
        RAPOR HAZIRLA VE YAZDIR
      </button>

      {/* TOPLU İŞLEMLER (YALNIZCA SEÇİM VARSA) */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2.5 ml-auto pr-2 animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 dark:bg-orange-950/30 border border-orange-500/20 dark:border-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg text-[8px] font-black uppercase tracking-widest animate-pulse shadow-sm">
            <div className="w-1 h-1 rounded-full bg-orange-500"></div>
            {selectedCount} KAYIT SEÇİLDİ
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={onBulkUpdate}
              className="w-9 h-9 bg-white/40 dark:bg-gray-800 text-orange-500 rounded-lg border border-white/20 dark:border-gray-700 shadow-lg shadow-orange-500/5 hover:bg-orange-500 hover:text-white transition-all active:scale-90 flex items-center justify-center"
              title="Seçilenleri Toplu Güncelle"
            >
              <Edit2 size={16} strokeWidth={2.5} />
            </button>
            
            <button
              onClick={onBulkDelete}
              className="w-9 h-9 bg-white/40 dark:bg-gray-800 text-red-500 rounded-lg border border-white/20 dark:border-gray-700 shadow-lg shadow-red-500/5 hover:bg-red-500 hover:text-white transition-all active:scale-90 flex items-center justify-center"
              title="Seçilenleri Toplu Sil"
            >
              <Trash2 size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
