import { ReactElement } from 'react'
import { CheckCircle, Clock, FolderOpen, Edit2, Trash2, Calendar, Hash, Building2, FileText, Activity } from 'lucide-react'
import { Evrak } from '../models/evrak-types'

interface EvrakListTableProps {
  data: Evrak[]
  onOpenFile: (path: string) => void
  onEdit: (evrak: Evrak) => void
  onDelete: (id: number) => void
}

export const EvrakListTable = ({ data, onOpenFile, onEdit, onDelete }: EvrakListTableProps): ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex-1 overflow-hidden group relative">
      <div className="overflow-auto scrollbar-hide absolute inset-0">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-md">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Tür</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center gap-2"><Calendar size={12} strokeWidth={2.5} /> Tarih</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-2"><Hash size={12} strokeWidth={2.5} /> Sayı</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><Building2 size={12} strokeWidth={2.5} /> Kurum</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><FileText size={12} strokeWidth={2.5} /> Konu</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">
                 <div className="flex items-center justify-center gap-2"><Activity size={12} strokeWidth={2.5} /> Durum</div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Eylem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <FileText size={64} strokeWidth={1} />
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 italic">Henüz Bir Evrak Kaydı Bulunmuyor</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((evrak) => (
                <tr key={evrak.id} className="group/row hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-all duration-300">
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border
                        ${evrak.tur === 'Gelen Evrak' 
                          ? 'bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30 shadow-sm' 
                          : 'bg-orange-100/50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/30 shadow-sm'
                        }`}
                    >
                      {evrak.tur}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-gray-500 dark:text-gray-400 text-xs">
                    {evrak.tarih}
                  </td>
                  <td className="px-6 py-6 font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {evrak.sayi || '---'}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight leading-none mb-1">{evrak.kurum}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Hedef Merci</span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-6 text-xs font-bold text-gray-600 dark:text-gray-400 truncate max-w-xs transition-all group-hover/row:text-gray-900 dark:group-hover/row:text-white"
                    title={evrak.konu}
                  >
                    {evrak.konu}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex justify-center">
                      {evrak.durum === 'Cevap Bekleniyor' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest animate-pulse">
                          <Clock size={12} strokeWidth={3} /> BEKLİYOR
                        </div>
                      )}
                      {evrak.durum === 'Cevaplandı' && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-900/30 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle size={12} strokeWidth={3} /> TAMAMLANDI
                        </div>
                      )}
                      {evrak.durum === 'Cevap Gerekmiyor' && (
                        <span className="text-gray-300 dark:text-gray-700 font-bold">---</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all duration-300">
                      {evrak.dosya_yolu && (
                        <button
                          onClick={() => onOpenFile(evrak.dosya_yolu)}
                          className="w-10 h-10 flex items-center justify-center text-indigo-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                          title="Dosyayı Görüntüle"
                        >
                          <FolderOpen size={18} strokeWidth={2.5} />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(evrak)}
                        className="w-10 h-10 flex items-center justify-center text-blue-600 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Düzenle"
                      >
                        <Edit2 size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => onDelete(evrak.id!)}
                        className="w-10 h-10 flex items-center justify-center text-red-600 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Sil"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
