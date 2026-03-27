import React, { ReactElement } from 'react'
import { CheckSquare, Square, Pencil, User, Hash, Briefcase, Calendar, Clock, Activity, ArrowUpCircle } from 'lucide-react'
import { Personel } from '../models/personel-terfi-types'

interface TerfiTableProps {
  data: Personel[]
  selectedIds: number[]
  onSelectAll: () => void
  onSelectOne: (id: number) => void
  onEdit: (personel: Personel) => void
}

export const TerfiTable = ({
  data,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onEdit
}: TerfiTableProps): ReactElement => {
  // Çalışma süresi hesaplama fonksiyonu
  const calculateDuration = (startDateStr?: string): string => {
    if (!startDateStr) return '-'
    const start = new Date(startDateStr)
    const now = new Date()

    let years = now.getFullYear() - start.getFullYear()
    let months = now.getMonth() - start.getMonth()
    let days = now.getDate() - start.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += lastMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    const parts: string[] = []
    if (years > 0) parts.push(`${years}Y`)
    if (months > 0) parts.push(`${months}A`)
    if (days > 0) parts.push(`${days}G`)

    return parts.length > 0 ? parts.join(' ') : '0G'
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl flex-1 overflow-hidden group relative">
      <div className="overflow-auto scrollbar-hide absolute inset-0">
        <table className="w-full text-left border-separate border-spacing-0 min-w-full">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-md">
              <th
                className="px-8 py-2 text-center cursor-pointer border-b border-gray-100 dark:border-gray-700 w-16"
                onClick={onSelectAll}
              >
                <div className="flex justify-center transition-transform active:scale-95">
                  {selectedIds.length > 0 && selectedIds.length === data.length ? (
                    <CheckSquare size={20} className="text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/20" strokeWidth={3} />
                  ) : (
                    <Square size={20} className="text-gray-300 dark:text-gray-600" strokeWidth={2.5} />
                  )}
                </div>
              </th>
              <th className="px-6 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><User size={12} strokeWidth={2.5} /> Ad Soyad</div>
              </th>
              <th className="px-6 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><Hash size={12} strokeWidth={2.5} /> Sicil</div>
              </th>
              <th className="px-6 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><Briefcase size={12} strokeWidth={2.5} /> Unvan</div>
              </th>
              <th className="px-6 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-2"><Calendar size={12} strokeWidth={2.5} /> İşe Giriş</div>
              </th>
              <th className="px-6 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-2"><Clock size={12} strokeWidth={2.5} /> Hizmet</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center gap-2"><ArrowUpCircle size={12} strokeWidth={2.5} /> Der/Kad</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">
                 <div className="flex items-center justify-center gap-2">Son Terfi</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">
                 <div className="flex items-center justify-center gap-2"><Activity size={12} strokeWidth={2.5} /> Sonraki</div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
            {data.length === 0 ? (
               <tr>
               <td colSpan={10} className="px-8 py-32 text-center text-gray-400 italic font-black uppercase tracking-widest opacity-20">
                 Personel kaydı bulunamadı
               </td>
             </tr>
            ) : (
                data.map((p) => {
                const isSelected = selectedIds.includes(p.id)
                return (
                    <tr
                    key={p.id}
                    className={`group/row cursor-pointer transition-all duration-300 ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : 'hover:bg-slate-50/50 dark:hover:bg-gray-800/40'}`}
                    onClick={() => onSelectOne(p.id)}
                    >
                    <td className="px-8 py-1.5 text-center">
                        <div className="flex justify-center transition-transform active:scale-90 duration-300">
                            {isSelected ? (
                            <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400 shadow-md" strokeWidth={3} />
                            ) : (
                            <Square size={18} className="text-gray-200 dark:text-gray-700 group-hover/row:text-indigo-300 transition-colors" strokeWidth={2} />
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-6">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-800 dark:text-gray-100 tracking-tight uppercase group-hover/row:text-indigo-600 transition-colors">{p.ad_soyad}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Aktif Personel</span>
                        </div>
                    </td>
                    <td className="px-6 py-1.5 font-mono text-xs font-black text-gray-500 dark:text-gray-400">{p.sicil_no}</td>
                    <td className="px-6 py-1.5 text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-tighter">
                        {p.unvan || 'BELİRTİLMEDİ'}
                    </td>
                    <td className="px-6 py-1.5 text-center font-bold text-gray-500 dark:text-gray-400 text-xs">
                        {p.ise_giris_tarihi ? p.ise_giris_tarihi.split('-').reverse().join('.') : '---'}
                    </td>
                    <td className="px-6 py-1.5">
                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg w-fit shadow-inner">
                             <Clock size={10} className="text-blue-500" />
                             <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{calculateDuration(p.ise_giris_tarihi)}</span>
                        </div>
                    </td>
                    <td className="px-6 py-1.5 text-center">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/10 text-xs font-black font-mono tracking-widest mx-auto">
                            {p.derece}/{p.kademe}
                        </div>
                    </td>
                    <td className="px-6 py-6 text-center text-xs font-bold text-gray-500 dark:text-gray-400 italic">
                        {p.terfi_tarihi ? p.terfi_tarihi.split('-').reverse().join('.') : '---'}
                    </td>
                    <td className="px-6 py-1.5 text-center">
                        <div className="inline-flex items-center justify-center px-4 py-1.5 bg-emerald-100/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg shadow-sm text-xs font-black font-mono tracking-tight mx-auto">
                            {p.sonraki_terfi ? p.sonraki_terfi.split('-').reverse().join('.') : '---'}
                        </div>
                    </td>
                    <td className="px-8 py-1.5 text-right">
                        <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(p)
                        }}
                        className="w-7 h-7 flex items-center justify-center text-blue-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90 opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0 duration-300"
                        title="Düzenle"
                        >
                        <Pencil size={14} strokeWidth={3} />
                        </button>
                    </td>
                    </tr>
                )
                })
            )}
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-2xl flex items-center gap-10 z-30 pointer-events-none group-hover:scale-105 transition-transform">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">TOPLAM: {data.length}</span>
        </div>
        <div className="w-px h-3 bg-white/20"></div>
        <div className="flex items-center gap-3 font-black text-indigo-400 opacity-80">
            <CheckSquare size={12} strokeWidth={3} />
            <span className="text-[10px] uppercase tracking-widest">SEÇİLİ: {selectedIds.length}</span>
        </div>
      </div>
    </div>
  )
}
