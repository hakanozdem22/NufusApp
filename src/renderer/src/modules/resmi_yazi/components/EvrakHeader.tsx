import { Printer, Loader2, FileText } from 'lucide-react'

interface EvrakHeaderProps {
  onPrint: () => void
  onNew: () => void
  yukleniyor: boolean
}

export const EvrakHeader = ({
  onPrint,
  yukleniyor
}: Omit<EvrakHeaderProps, 'onNew'>): React.ReactElement => {
  return (
    <div className="px-10 py-8 bg-white/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative overflow-hidden group">
      {/* Background Decoration */}
      <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-600 shadow-inner group-hover:rotate-6 transition-all duration-500">
          <FileText size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none mb-1">
            RESMİ YAZI TAKİP
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Gelen ve Giden Evrak Arşivi
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <button
          onClick={onPrint}
          disabled={yukleniyor}
          className="h-12 border border-purple-100 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 px-8 rounded-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all active:scale-95 group/print disabled:opacity-50"
        >
          {yukleniyor ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Printer size={16} strokeWidth={2.5} className="group-hover/print:scale-110 transition-transform" />
          )} 
          LİSTEYİ YAZDIR
        </button>
      </div>
    </div>
  )
}
