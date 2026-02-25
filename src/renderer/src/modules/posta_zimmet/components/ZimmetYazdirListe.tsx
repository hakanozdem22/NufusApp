import { List, Printer, Loader2, Trash2 } from 'lucide-react'
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
}: ZimmetYazdirListeProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex-1 flex flex-col overflow-hidden">
      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/30 flex justify-between items-center">
        <div className="text-xs font-bold text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
          <List size={16} /> YAZDIRILACAK LİSTE ({liste.length})
        </div>
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
          Top: {toplamTutar.toFixed(2)} ₺
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {liste.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs">
            <Printer size={32} className="mb-2 opacity-20" />
            Henüz evrak eklenmedi
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-bold sticky top-0">
              <tr>
                <th className="p-2">Barkod</th>
                <th className="p-2">Yer</th>
                <th className="p-2 text-right">Tutar</th>
                <th className="p-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {liste.map((item) => (
                <tr key={item.tempId} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="p-2 font-mono text-gray-700 dark:text-gray-300">
                    {item.barkod || '-'}
                  </td>
                  <td className="p-2 truncate max-w-[100px] text-gray-700 dark:text-gray-300">
                    {item.yer}
                  </td>
                  <td className="p-2 text-right font-medium text-gray-700 dark:text-gray-300">
                    {item.ucret}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => onDeleteTemp(item.tempId!)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onSave}
          disabled={liste.length === 0 || yukleniyor}
          className={`w-full py-3 rounded-lg font-bold shadow flex justify-center items-center gap-2 transition ${liste.length === 0 || yukleniyor ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {yukleniyor ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}{' '}
          KAYDET VE YAZDIR
        </button>
      </div>
    </div>
  )
}
