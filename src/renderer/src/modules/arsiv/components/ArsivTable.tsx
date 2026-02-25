import {
  CheckSquare,
  Square,
  ListFilter,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react'
import { useState, useMemo } from 'react'
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
}: ArsivTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ArsivKayit | null
    direction: 'asc' | 'desc'
  } | null>(null)

  const handleSort = (key: keyof ArsivKayit) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedListe = useMemo(() => {
    if (!sortConfig || !sortConfig.key) return liste

    return [...liste].sort((a: any, b: any) => {
      // Ana sıralama kriteri
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }

      // İkincil sıralama: Eğer ana kriter eşitse...
      // Eğer Klasör Adı'na göre sıralıyorsak, aynı isimleri Yılı'na göre sırala
      if (sortConfig.key === 'klasor_adi') {
        const yilA = parseInt(a.yili || '0')
        const yilB = parseInt(b.yili || '0')
        // Yıllar küçükten büyüğe (eskiden yeniye) olsun
        if (yilA < yilB) return -1
        if (yilA > yilB) return 1
      }

      // Diğer durumlarda, veya ikincil kriter de eşitse, klasör_no'ya göre (varsa) sırala
      // Bu sayede aynı yıl içindekiler de sıralı durur (Sıra No gibi)
      const noA = parseInt(a.klasor_no || '0')
      const noB = parseInt(b.klasor_no || '0')
      if (noA < noB) return -1
      if (noA > noB) return 1

      return 0
    })
  }, [liste, sortConfig])

  const renderSortIcon = (key: keyof ArsivKayit) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} className="ml-1 text-blue-600" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-blue-600" />
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold uppercase text-xs border-b dark:border-gray-600 sticky top-0">
            <tr>
              <th className="p-3 w-10 text-center cursor-pointer relative group">
                <div className="flex items-center justify-center" onClick={onSelectAll}>
                  {secilenler.length > 0 && secilenler.length === liste.length ? (
                    <CheckSquare size={18} className="text-blue-600" />
                  ) : (
                    <Square size={18} className="text-gray-400" />
                  )}
                </div>
                {secilenler.length > 0 && (
                  <button
                    onClick={onSelectAll}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    title="Seçimleri Kaldır"
                  >
                    <X size={10} />
                  </button>
                )}
              </th>

              {/* SIRA NO: Görsel sıra (1...N) */}
              <th className="p-3 w-16 text-center">Sıra No</th>

              {/* Sortable: Klasör Adı */}
              <th
                className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort('klasor_adi')}
              >
                <div className="flex items-center">
                  Klasör Adı
                  {renderSortIcon('klasor_adi')}
                </div>
              </th>

              <th className="p-3 w-24 text-center">Klasör Adeti</th>
              <th className="p-3">Tipi</th>

              {/* Sortable: Yılı */}
              <th
                className="p-3 w-16 text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort('yili')}
              >
                <div className="flex items-center justify-center">
                  Yılı
                  {renderSortIcon('yili')}
                </div>
              </th>

              <th className="p-3 w-24 text-center">Aralık</th>
              <th className="p-3 w-24 text-center">Saklama Yılı</th>
              <th className="p-3">Kodu</th>

              {/* Sortable: Düşünceler */}
              <th
                className="p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort('aciklama')}
              >
                <div className="flex items-center">
                  Düşünceler
                  {renderSortIcon('aciklama')}
                </div>
              </th>

              <th className="p-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {sortedListe.map((item, idx) => (
              <tr
                key={item.id}
                className={`hover:bg-blue-50 dark:hover:bg-blue-900/10 group transition ${secilenler.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onClick={() => onSelectOne(item.id)}
              >
                <td className="p-3 text-center cursor-pointer">
                  {secilenler.includes(item.id) ? (
                    <CheckSquare size={18} className="text-blue-600" />
                  ) : (
                    <Square size={18} className="text-gray-300" />
                  )}
                </td>

                {/* Visual Index: 1...N */}
                <td className="p-3 text-center text-gray-400 font-mono">{idx + 1}</td>

                {/* KLASÖR ADI VE ÇOKLU SEÇİM BUTONU */}
                <td className="p-3 font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  {item.klasor_adi}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSameName(item.klasor_adi)
                    }}
                    title={`"${item.klasor_adi}" adındaki tüm kayıtları seç`}
                    className="opacity-0 group-hover:opacity-100 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition"
                  >
                    <ListFilter size={14} />
                  </button>
                </td>

                {/* Klasör Adeti / Evrak Sayısı */}
                <td className="p-3 text-center bg-gray-50 dark:bg-gray-700/50 font-bold dark:text-gray-300">
                  {item.evrak_sayisi}
                </td>

                <td className="p-3 text-gray-500 dark:text-gray-400 text-xs">{item.tipi}</td>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400 text-center">
                  {String(item.yili || '').split('.')[0]}
                </td>

                {/* Aralık */}
                <td className="p-3 text-gray-700 dark:text-gray-300 text-center font-medium text-xs">
                  {item.bas_no && item.bitis_no ? `${item.bas_no}-${item.bitis_no}` : '-'}
                </td>

                <td className="p-3 text-center text-xs">{item.saklama_suresi}</td>
                <td className="p-3 font-mono text-xs">{item.dosyalama_kodu}</td>
                <td
                  className="p-3 text-xs text-gray-500 italic max-w-xs truncate"
                  title={item.aciklama}
                >
                  {item.aciklama}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(item)
                    }}
                    className="p-3 text-blue-500 hover:bg-blue-100 rounded mr-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id)
                    }}
                    className="p-3 text-red-500 hover:bg-red-100 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
