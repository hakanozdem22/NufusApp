import { CheckCircle, Clock, FolderOpen, Edit2, Trash2 } from 'lucide-react'
import { Evrak } from '../models/evrak-types'

interface EvrakListTableProps {
  data: Evrak[]
  onOpenFile: (path: string) => void
  onEdit: (evrak: Evrak) => void
  onDelete: (id: number) => void
}

export const EvrakListTable = ({ data, onOpenFile, onEdit, onDelete }: EvrakListTableProps) => {
  return (
    <div className="mx-6 mt-4 mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex-1 overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 font-bold uppercase text-xs sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-3 text-center">Tür</th>
            <th className="p-3 text-center">Tarih</th>
            <th className="p-3 text-center">Sayı</th>
            <th className="p-3 text-center">Kurum</th>
            <th className="p-3 text-center">Konu</th>
            <th className="p-3 text-center">Durum</th>
            <th className="p-3 text-center">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {data.map((evrak) => (
            <tr key={evrak.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 text-center">
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${evrak.tur === 'Gelen Evrak' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'}`}
                >
                  {evrak.tur}
                </span>
              </td>
              <td className="p-3 text-gray-700 dark:text-gray-300">{evrak.tarih}</td>
              <td className="p-3 font-mono text-gray-600 dark:text-gray-400">{evrak.sayi}</td>
              <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{evrak.kurum}</td>
              <td
                className="p-3 text-gray-600 dark:text-gray-400 truncate max-w-xs text-left"
                title={evrak.konu}
              >
                {evrak.konu}
              </td>
              <td className="p-3 flex justify-center">
                {evrak.durum === 'Cevap Bekleniyor' && (
                  <span className="text-red-600 flex items-center gap-1">
                    <Clock size={14} /> Bekliyor
                  </span>
                )}
                {evrak.durum === 'Cevaplandı' && (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={14} /> Tamam
                  </span>
                )}
                {evrak.durum === 'Cevap Gerekmiyor' && <span className="text-gray-400">-</span>}
              </td>
              <td className="p-3">
                <div className="flex justify-center gap-1">
                  {evrak.dosya_yolu && (
                    <button
                      onClick={() => onOpenFile(evrak.dosya_yolu)}
                      className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                      title="Dosyayı Aç"
                    >
                      <FolderOpen size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(evrak)}
                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(evrak.id!)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
