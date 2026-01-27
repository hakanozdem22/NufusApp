import { List, Trash2, Save } from 'lucide-react'
import { EgitimDers } from '../models/egitim-types'

interface EgitimDraftPanelProps {
  taslak: EgitimDers[]
  setTaslak: (val: EgitimDers[]) => void
  onSave: () => void
}

export const EgitimDraftPanel = ({ taslak, setTaslak, onSave }: EgitimDraftPanelProps) => {
  return (
    <div className="flex-1 flex flex-col border-r dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[300px]">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <List size={18} /> TASLAK ({taslak.length})
        </h3>
        {taslak.length > 0 && (
          <button onClick={() => setTaslak([])} className="text-xs text-red-500 hover:underline">
            Temizle
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-2 bg-gray-50/50 dark:bg-gray-900/50">
        <table className="w-full text-xs text-left bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700 font-bold text-gray-600 dark:text-gray-300 border-b dark:border-gray-600 sticky top-0">
            <tr>
              <th className="p-2">Tarih/Saat</th>
              <th className="p-2">Konu</th>
              <th className="p-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {taslak.map((t, i) => (
              <tr
                key={i}
                className={`hover:bg-blue-50 dark:hover:bg-blue-900/10 ${t.zorunlu ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}
              >
                <td className="p-2 whitespace-nowrap">
                  <div className="font-bold text-gray-700 dark:text-gray-200">{t.tarih}</div>
                  <div className="text-gray-500 dark:text-gray-400">{t.saat}</div>
                </td>
                <td className="p-2">
                  <div className="font-medium text-gray-800 dark:text-gray-200">{t.konu}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{t.egitici}</div>
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => setTaslak(taslak.filter((_, idx) => idx !== i))}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <button
          onClick={onSave}
          disabled={taslak.length === 0}
          className={`w-full py-3 rounded-lg font-bold shadow-lg flex justify-center items-center gap-2 transition ${taslak.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          <Save size={18} /> BU PLANI KAYDET
        </button>
      </div>
    </div>
  )
}
