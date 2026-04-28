import { ReactElement } from 'react'
import { List, Printer, Loader2, Trash2, ArchiveX } from 'lucide-react'
import { ZimmetKayit } from '../models/zimmet-types'

interface ZimmetYazdirListeProps {
  liste: ZimmetKayit[]
  toplamTutar: number
  yukleniyor: boolean
  onDeleteTemp: (tempId: number) => void
  onSave: () => void
}

export const ZimmetYazdirListe = ({
  liste,
  toplamTutar,
  yukleniyor,
  onDeleteTemp,
  onSave
}: ZimmetYazdirListeProps): ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col h-full overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="px-8 py-5 bg-amber-50/50 dark:bg-amber-900/20 border-b border-amber-100/50 dark:border-amber-900/30 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <List size={16} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest">GÜNCEL LİSTE ({liste.length})</span>
        </div>
        <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-amber-200/50 dark:border-amber-800/50 text-xs font-black text-blue-600 dark:text-blue-400 shadow-sm">
          TOPLAM: {toplamTutar.toFixed(2)} ₺
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide py-4">
        {liste.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4 animate-pulse">
              <ArchiveX size={32} strokeWidth={1.5} />
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Henüz evrak eklenmedi</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-gray-800/30">
                <th className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">BARKOD</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">KURUM/YER</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">TUTAR</th>
                <th className="px-8 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
              {liste.map((item) => (
                <tr key={item.tempId} className="group hover:bg-slate-50/50 dark:hover:bg-gray-800/20 transition-all duration-300">
                  <td className="px-8 py-4">
                    <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                      {item.barkod || '---'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[120px] block uppercase">
                      {item.yer}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                      {item.ucret} ₺
                    </span>
                  </td>
                  <td className="px-8 py-4 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => onDeleteTemp(item.tempId!)}
                      className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all flex items-center justify-center active:scale-90"
                      title="Listeden Çıkar"
                    >
                      <Trash2 size={14} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30 shrink-0">
        <button
          onClick={onSave}
          disabled={liste.length === 0 || yukleniyor}
          className={`w-full py-5 rounded-2.5xl font-black shadow-xl flex justify-center items-center gap-3 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] ${
            liste.length === 0 || yukleniyor 
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed shadow-none' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/20 ring-4 ring-green-600/0 hover:ring-green-600/10'
          }`}
        >
          {yukleniyor ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} strokeWidth={2.5} />}
          KAYDET VE LİSTEYİ YAZDIR
        </button>
      </div>
    </div>
  )
}
