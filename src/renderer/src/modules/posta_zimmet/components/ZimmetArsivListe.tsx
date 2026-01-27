import { History, Search, Trash2 } from 'lucide-react'
import { ZimmetKayit } from '../models/zimmet-types'

interface ZimmetArsivListeProps {
  arsivListe: ZimmetKayit[]
  arama: string
  setArama: (val: string) => void
  onSearch: (val: string) => void
  onDelete: (id: number) => void
  onToggleStatus: (item: ZimmetKayit) => void
}

export const ZimmetArsivListe = ({
  arsivListe,
  arama,
  setArama,
  onSearch,
  onDelete,
  onToggleStatus
}: ZimmetArsivListeProps) => {
  return (
    <div className="w-[65%] flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center gap-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold">
          <History size={20} className="text-orange-500" /> Geçmiş Kayıtlar
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            className="w-full pl-9 p-2 border dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500"
            placeholder="Ara..."
            value={arama}
            onChange={(e) => {
              setArama(e.target.value)
              onSearch(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 font-bold text-xs sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-3 text-center">Durum</th>
              <th className="p-3">Tarih</th>
              <th className="p-3">Barkod</th>
              <th className="p-3">Evrak No</th>
              <th className="p-3">Gideceği Yer</th>
              <th className="p-3 text-right">Tutar</th>
              <th className="p-3 text-center">Sil</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {arsivListe.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-400">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              arsivListe.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onToggleStatus(item)}
                      className={`flex items-center justify-center w-full py-1 rounded text-[10px] font-bold border ${item.durum === 'GELDİ' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'}`}
                    >
                      {item.durum === 'GELDİ' ? 'GELDİ' : 'BEKLİYOR'}
                    </button>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap">
                    {item.tarih.split(' ')[0]}
                  </td>
                  <td className="p-3 font-mono text-blue-600 dark:text-blue-400 font-medium">
                    {item.barkod}
                  </td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{item.evrak_no}</td>
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{item.yer}</td>
                  <td className="p-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    {item.ucret.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDelete(item.id!)}
                      className="text-gray-300 hover:text-red-500 transition p-1"
                    >
                      <Trash2 size={16} />
                    </button>
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
