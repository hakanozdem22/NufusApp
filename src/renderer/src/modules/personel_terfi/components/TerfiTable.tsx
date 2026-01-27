import { CheckSquare, Square, Pencil } from 'lucide-react'
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
}: TerfiTableProps): React.ReactElement => {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-colors">
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 font-bold uppercase text-xs border-b dark:border-gray-700 sticky top-0 z-10 transition-colors">
            <tr>
              <th
                className="p-3 w-10 text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={onSelectAll}
              >
                {selectedIds.length > 0 && selectedIds.length === data.length ? (
                  <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Square size={18} className="text-gray-400 dark:text-gray-500" />
                )}
              </th>
              <th className="p-3">Ad Soyad</th>
              <th className="p-3">Sicil No</th>
              <th className="p-3">Unvan</th>
              <th className="p-3">Kadro</th>
              <th className="p-3 text-center">Mevcut</th>
              <th className="p-3 text-center">Sonraki</th>
              <th className="p-3 text-center">Terfi Tarihi</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {data.map((p) => {
              return (
                <tr
                  key={p.id}
                  className={`hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition ${selectedIds.includes(p.id) ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                  onClick={() => onSelectOne(p.id)}
                >
                  <td className="p-3 text-center">
                    {selectedIds.includes(p.id) ? (
                      <CheckSquare size={18} className="text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square size={18} className="text-gray-300 dark:text-gray-600" />
                    )}
                  </td>
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{p.ad_soyad}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">{p.sicil_no}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{p.unvan}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300">{p.kadro}</td>
                  <td className="p-3 text-center font-mono dark:text-gray-300">
                    {p.derece}/{p.kademe}
                  </td>
                  <td className="p-3 text-center font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {p.sonraki_terfi ? new Date(p.sonraki_terfi).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="p-3 text-center text-gray-600 dark:text-gray-400">
                    {p.terfi_tarihi ? new Date(p.terfi_tarihi).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(p)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition"
                      title="Düzenle"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium flex justify-between">
        <span>Toplam Personel: {data.length}</span>
        <span>Seçili: {selectedIds.length}</span>
      </div>
    </div>
  )
}
