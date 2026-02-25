import { Plus, FileText } from 'lucide-react'
import { FormEvent } from 'react'

interface ZimmetGirisFormProps {
  evrakNo: string
  setEvrakNo: (val: string) => void
  barkod: string
  setBarkod: (val: string) => void
  yer: string
  setYer: (val: string) => void
  ucret: string
  setUcret: (val: string) => void
  onAdd: (e: FormEvent) => void
  kurumListesi?: { id: number; ad: string }[]
}

export const ZimmetGirisForm = ({
  evrakNo,
  setEvrakNo,
  barkod,
  setBarkod,
  yer,
  setYer,
  ucret,
  setUcret,
  onAdd,
  kurumListesi = []
}: ZimmetGirisFormProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-blue-700 dark:text-blue-400 font-bold border-b dark:border-gray-700 pb-2">
        <FileText size={18} /> Evrak Girişi
      </div>
      <form onSubmit={onAdd} className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Evrak No</label>
          <input
            className="w-full border dark:border-gray-600 p-2 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 outline-none"
            value={evrakNo}
            onChange={(e) => setEvrakNo(e.target.value)}
            placeholder="Sayı..."
            autoFocus
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Barkod</label>
          <input
            className="w-full border dark:border-gray-600 p-2 rounded-lg text-sm font-mono uppercase bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 outline-none"
            value={barkod}
            onChange={(e) => setBarkod(e.target.value.toUpperCase())}
            placeholder="RR..."
            maxLength={13}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Gideceği Yer</label>
          <input
            className="w-full border dark:border-gray-600 p-2 rounded-lg text-sm uppercase bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 outline-none"
            value={yer}
            onChange={(e) => setYer(e.target.value.toUpperCase())}
            placeholder="Kurum/Kişi Adı..."
            list="kurumlar"
          />
          <datalist id="kurumlar">
            {kurumListesi.map((k) => (
              <option key={k.id} value={k.ad} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Ücret</label>
          <input
            type="number"
            step="0.1"
            className="w-full border dark:border-gray-600 p-2 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white focus:border-blue-500 outline-none"
            value={ucret}
            onChange={(e) => setUcret(e.target.value)}
          />
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-bold shadow flex justify-center items-center gap-2">
          <Plus size={18} /> Listeye Ekle
        </button>
      </form>
    </div>
  )
}
