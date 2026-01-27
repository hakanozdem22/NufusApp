import { Printer, Loader2 } from 'lucide-react'

interface ArsivReportModalProps {
  isOpen: boolean
  onClose: () => void
  onPrint: () => void
  raporTipi: string
  setRaporTipi: (val: string) => void
  komisyon: { baskan: string; uye1: string; uye2: string }
  setKomisyon: (val: { baskan: string; uye1: string; uye2: string }) => void
  yukleniyor: boolean
}

export const ArsivReportModal = ({
  isOpen,
  onClose,
  onPrint,
  raporTipi,
  setRaporTipi,
  komisyon,
  setKomisyon,
  yukleniyor
}: ArsivReportModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden transition-colors">
        <div className="bg-blue-600 text-white p-3 font-bold text-center text-sm tracking-wide uppercase">
          Raporlama
        </div>
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                raporTipi === 'LISTE'
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 dark:ring-blue-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="rpt"
                checked={raporTipi === 'LISTE'}
                onChange={() => setRaporTipi('LISTE')}
                className="accent-blue-600"
              />{' '}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Arşiv Envanter Listesi
              </span>
            </label>
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                raporTipi === 'IMHA'
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-500 ring-1 dark:ring-red-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="rpt"
                checked={raporTipi === 'IMHA'}
                onChange={() => setRaporTipi('IMHA')}
                className="accent-red-600"
              />{' '}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                İmhalık Olanları Raporla
              </span>
            </label>
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                raporTipi === 'ETIKET'
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-500 ring-1 dark:ring-green-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="rpt"
                checked={raporTipi === 'ETIKET'}
                onChange={() => setRaporTipi('ETIKET')}
                className="accent-green-600"
              />{' '}
              <span className="text-sm font-bold text-green-700 dark:text-green-400">
                Klasör Arkalığı (Etiket Basımı)
              </span>
            </label>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700/50 text-xs mb-6 transition-colors">
            <strong className="block mb-2 text-yellow-800 dark:text-yellow-400">Komisyon</strong>
            <div className="grid gap-2">
              <input
                placeholder="Başkan"
                className="border border-yellow-300 dark:border-yellow-600 p-2 rounded bg-white dark:bg-gray-800 w-full text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                value={komisyon.baskan}
                onChange={(e) => setKomisyon({ ...komisyon, baskan: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Üye 1"
                  className="border border-yellow-300 dark:border-yellow-600 p-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                  value={komisyon.uye1}
                  onChange={(e) => setKomisyon({ ...komisyon, uye1: e.target.value })}
                />
                <input
                  placeholder="Üye 2"
                  className="border border-yellow-300 dark:border-yellow-600 p-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-1 focus:ring-yellow-500 transition-colors"
                  value={komisyon.uye2}
                  onChange={(e) => setKomisyon({ ...komisyon, uye2: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={onPrint}
              disabled={yukleniyor}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              {yukleniyor ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}{' '}
              YAZDIR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
