import { CheckSquare, Square, ListFilter, Edit2, Trash2 } from 'lucide-react'
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
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold uppercase text-xs border-b dark:border-gray-600 sticky top-0">
            <tr>
              <th className="p-3 w-8 text-center cursor-pointer" onClick={onSelectAll}>
                {secilenler.length > 0 && secilenler.length === liste.length ? (
                  <CheckSquare size={18} className="text-blue-600" />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
              </th>
              <th className="p-3 w-8 text-center">#</th>
              <th className="p-3">Klasör Adı</th>
              <th className="p-3">Tipi</th>
              <th className="p-3 w-16 text-center">Yılı</th>
              <th className="p-3 w-24 text-center">Klasör adeti</th>
              <th className="p-3 w-24 text-center">Evrak Say.</th>
              <th className="p-3 w-24 text-center">Saklama yılı</th>
              <th className="p-3">Kodu</th>
              <th className="p-3">Düşünceler</th>
              <th className="p-3 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {liste.map((item, idx) => (
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
                <td className="p-3 text-center text-gray-400">{idx + 1}</td>

                {/* KLASÖR ADI VE ÇOKLU SEÇİM BUTONU */}
                <td className="p-3 font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  {item.klasor_adi}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectSameName(item.klasor_adi)
                    }}
                    title={`"${item.klasor_adi}" adındaki tüm kayıtları seç`}
                    className="opacity-0 group-hover:opacity-100 p-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition"
                  >
                    <ListFilter size={14} />
                  </button>
                </td>

                <td className="p-3 text-gray-500 dark:text-gray-400 text-xs">{item.tipi}</td>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400 text-center">
                  {String(item.yili || '').split('.')[0]}
                </td>
                <td className="p-3 text-center bg-gray-50 dark:bg-gray-700/50 font-mono dark:text-gray-300">
                  {item.klasor_no}
                </td>
                <td className="p-3 text-gray-700 dark:text-gray-300 text-center font-medium">
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
                    className="p-1.5 text-blue-500 hover:bg-blue-100 rounded mr-1"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item.id)
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-100 rounded"
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
