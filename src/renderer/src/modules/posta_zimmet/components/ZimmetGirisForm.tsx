import React, { FormEvent, ReactElement } from 'react'
import { Plus, FileText, Hash, QrCode, MapPin, CreditCard } from 'lucide-react'

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
}: ZimmetGirisFormProps): ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="flex items-center gap-3 mb-8 relative">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 shadow-inner">
          <FileText size={20} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h3 className="font-black text-gray-800 dark:text-gray-100 text-lg tracking-tight">Yeni Evrak Girişi</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Posta Zimmet İşlemi</p>
        </div>
      </div>

      <form onSubmit={onAdd} className="space-y-6 relative">
        <div className="grid grid-cols-2 gap-5">
           <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">EVRAK NUMARASI</label>
            <div className="relative group/input">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={16} strokeWidth={2.5} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                value={evrakNo}
                onChange={(e) => setEvrakNo(e.target.value)}
                placeholder="---"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">BARKOD / RR NO</label>
            <div className="relative group/input">
              <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={16} strokeWidth={2.5} />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-black font-mono uppercase outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                value={barkod}
                onChange={(e) => setBarkod(e.target.value.toUpperCase())}
                placeholder="RR1234..."
                maxLength={13}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">GİDECEĞİ YER / KURUM</label>
          <div className="relative group/input">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={16} strokeWidth={2.5} />
            <input
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold uppercase outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
              value={yer}
              onChange={(e) => setYer(e.target.value.toUpperCase())}
              placeholder="KURUM VEYA KİŞİ ADI..."
              list="kurumlar"
            />
            <datalist id="kurumlar">
              {kurumListesi.map((k) => (
                <option key={k.id} value={k.ad} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">TOPLAM ÜCRET (₺)</label>
          <div className="relative group/input">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors" size={16} strokeWidth={2.5} />
            <input
              type="number"
              step="0.1"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-black outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
              value={ucret}
              onChange={(e) => setUcret(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[1.8rem] font-black shadow-lg shadow-blue-500/25 flex justify-center items-center gap-3 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] mt-2">
          <Plus size={18} strokeWidth={3} /> LİSTEYE EKLE
        </button>
      </form>
    </div>
  )
}
