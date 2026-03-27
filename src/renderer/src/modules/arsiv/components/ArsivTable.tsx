import React, { ReactElement, useState, useMemo } from 'react'
import {
  CheckSquare,
  Square,
  ListFilter,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Archive,
  Layers,
  Calendar,
  Layers2,
  FileDigit,
  ShieldCheck,
  MoreHorizontal
} from 'lucide-react'
import { ArsivKayit } from '../models/arsiv-types'

interface ArsivTableProps {
  liste: ArsivKayit[]
  secilenler: number[]
  onSelectAll: () => void
  onSelectOne: (id: number) => void
  onSelectSameName: (name: string) => void
  onEdit: (item: ArsivKayit) => void
  onDelete: (id: number) => void
}

export const ArsivTable = ({
  liste,
  secilenler,
  onSelectAll,
  onSelectOne,
  onSelectSameName,
  onEdit,
  onDelete
}: ArsivTableProps): ReactElement => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArsivKayit | null
    direction: 'asc' | 'desc'
  } | null>(null)

  const handleSort = (key: keyof ArsivKayit): void => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedListe = useMemo(() => {
    if (!sortConfig || !sortConfig.key) return liste

    return [...liste].sort((a: ArsivKayit, b: ArsivKayit) => {
      // Ana sıralama kriteri
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }

      // İkincil sıralama: Eğer Klasör Adı'na göre sıralıyorsak, aynı isimleri Yılı'na göre sırala
      if (sortConfig.key === 'klasor_adi') {
        const yilA = parseInt(a.yili || '0')
        const yilB = parseInt(b.yili || '0')
        if (yilA < yilB) return -1
        if (yilA > yilB) return 1
      }

      const noA = parseInt(a.klasor_no || '0')
      const noB = parseInt(b.klasor_no || '0')
      if (noA < noB) return -1
      if (noA > noB) return 1

      return 0
    })
  }, [liste, sortConfig])

  const renderSortIcon = (key: keyof ArsivKayit): ReactElement => {
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown size={12} className="ml-1 opacity-30" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={12} className="ml-1 text-blue-500" />
    ) : (
      <ArrowDown size={12} className="ml-1 text-blue-500" />
    )
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col h-full relative group">
      <div className="overflow-auto scrollbar-hide absolute inset-0">
        <table className="w-full text-left border-separate border-spacing-0 min-w-[1200px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-md">
              <th className="px-8 py-2 text-center w-20 border-b border-gray-100 dark:border-gray-700">
                <button
                  onClick={onSelectAll}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm flex items-center justify-center transition-all active:scale-90"
                >
                  {secilenler.length > 0 && secilenler.length === liste.length ? (
                    <CheckSquare size={20} strokeWidth={2.5} className="text-blue-500 animate-in zoom-in" />
                  ) : (
                    <Square size={20} strokeWidth={2} className="text-gray-200 dark:text-gray-500" />
                  )}
                </button>
              </th>

              <th
                className="px-6 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 group/th"
                onClick={() => handleSort('klasor_adi')}
              >
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover/th:text-blue-500 transition-colors">
                  <Archive size={14} /> Klasör Bilgisi {renderSortIcon('klasor_adi')}
                </div>
              </th>

              <th className="px-6 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <Layers2 size={14} /> Detaylar
                </div>
              </th>

              <th className="px-6 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Açıklama
                </div>
              </th>

              <th
                className="px-6 py-2 cursor-pointer border-b border-gray-100 dark:border-gray-700 group/th w-28 text-center"
                onClick={() => handleSort('yili')}
              >
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover/th:text-blue-500 transition-colors">
                  <Calendar size={14} /> Yıl {renderSortIcon('yili')}
                </div>
              </th>

              <th className="px-6 py-2 border-b border-gray-100 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">
                  <FileDigit size={14} /> Kod / Aralik
                </div>
              </th>

              <th className="px-6 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <ShieldCheck size={14} /> Saklama / Durum
                </div>
              </th>

              <th className="px-8 py-2 border-b border-gray-100 dark:border-gray-700 text-right">
                <div className="flex items-center justify-end gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <MoreHorizontal size={14} /> Eylem
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
            {sortedListe.map((item, idx) => {
              const isSelected = secilenler.includes(item.id)
              const saklamaSuresi = parseInt(item.saklama_suresi || '0')
              const yil = parseInt(String(item.yili || '0'))
              const buYil = new Date().getFullYear()
              const imhaZamani = yil + saklamaSuresi
              const imhaDurumu = imhaZamani < buYil ? 'GİTMİŞ' : 'BEKLİYOR'

              return (
                <tr
                  key={item.id}
                  className={`group/row transition-all duration-300 relative ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-900/10'
                      : 'hover:bg-slate-50/80 dark:hover:bg-gray-800/30'
                  }`}
                  onClick={() => onSelectOne(item.id)}
                >
                  <td className="px-8 py-2 text-center">
                    <div className="w-8 h-8 rounded-lg border border-gray-100 dark:border-gray-700 mx-auto flex items-center justify-center transition-all">
                       {isSelected ? (
                        <CheckSquare size={18} strokeWidth={3} className="text-blue-500 animate-in zoom-in-75" />
                      ) : (
                        <span className="text-[10px] font-black text-gray-300 dark:text-gray-600">{String(idx + 1).padStart(2, '0')}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-2">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800 dark:text-gray-100 text-[13px] leading-tight group-hover/row:text-blue-600 transition-colors uppercase tracking-tight">
                          {item.klasor_adi}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700 w-fit">
                          <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">ID: {item.id}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectSameName(item.klasor_adi)
                        }}
                        className="opacity-0 group-hover/row:opacity-100 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-500 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"
                        title="Aynı isimdekileri seç"
                      >
                        <ListFilter size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-2">
                    <div className="flex items-center gap-1.5">
                       <span className="text-[9px] font-black px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg border border-gray-200/50 dark:border-gray-700/50 uppercase tracking-tighter">
                        {item.tipi || 'BELİRTİLMEMİŞ'}
                      </span>
                      <span className="text-[10px] font-black text-gray-800 dark:text-gray-200">{item.evrak_sayisi} EVRAK</span>
                    </div>
                  </td>

                  <td className="px-6 py-2">
                    <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{item.aciklama || 'AÇIKLAMA YOK'}</span>
                  </td>

                  <td className="px-6 py-2 text-center">
                    <div className="inline-flex px-2 py-0.5 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg font-black text-[10px] tracking-widest shadow-sm">
                      {String(item.yili || '').split('.')[0]}
                    </div>
                  </td>

                  <td className="px-6 py-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono text-[11px] font-bold text-gray-600 dark:text-gray-400 tracking-tighter uppercase">{item.dosyalama_kodu || '---'}</span>
                      {item.bas_no && (
                         <span className="text-[8px] font-black text-gray-400 bg-gray-50 dark:bg-gray-800 px-1.5 rounded-md border dark:border-gray-700">{item.bas_no} - {item.bitis_no}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-black text-gray-800 dark:text-gray-200">{item.saklama_suresi} YIL</span>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest w-fit border
                        ${imhaDurumu === 'GİTMİŞ' 
                          ? 'bg-red-500/10 text-red-600 border-red-200/50 dark:border-red-900/30' 
                          : 'bg-green-500/10 text-green-600 border-green-200/50 dark:border-green-900/30'
                        }`}>
                        <div className={`w-1 h-1 rounded-full ${imhaDurumu === 'GİTMİŞ' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        {imhaDurumu}
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-2 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 translate-x-2 group-hover/row:translate-x-0 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(item)
                        }}
                        className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800"
                        title="Düzenle"
                      >
                        <Edit2 size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item.id)
                        }}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800"
                        title="Sil"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {liste.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 opacity-20 scale-110">
            <Layers className="text-gray-300 dark:text-gray-700 mb-6" size={80} strokeWidth={1} />
            <p className="text-sm font-black uppercase tracking-[0.4em] text-gray-500">Kayıt Bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  )
}
