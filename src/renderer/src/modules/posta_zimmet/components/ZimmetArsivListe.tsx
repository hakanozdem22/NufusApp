import React, { ReactElement } from 'react'
import { History, Search, Trash2, Calendar, FileCheck2, MapPin, CreditCard, Hash, QrCode } from 'lucide-react'
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
}: ZimmetArsivListeProps): ReactElement => {
  return (
    <div className="flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden h-full relative group">
      {/* HEADER SECTION */}
      <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0 relative">
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-800 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <History size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Geçmiş Kayıtlar</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Zimmet Arşiv Havuzu</p>
          </div>
        </div>

        <div className="relative flex-1 max-w-md w-full group/search">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-blue-500 transition-colors" size={18} strokeWidth={2.5} />
          <input
            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-gray-800 border-none rounded-[1.8rem] text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-white shadow-inner"
            placeholder="Barkod, Evrak No veya Kurum ara..."
            value={arama}
            onChange={(e) => {
              setArama(e.target.value)
              onSearch(e.target.value)
            }}
          />
        </div>
      </div>

      {/* DATA TABLE AREA */}
      <div className="flex-1 overflow-auto scrollbar-hide relative min-h-0">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-md">
              <th className="px-10 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-32 text-center">İşlem</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-44">
                <div className="flex items-center gap-2"><Calendar size={12} strokeWidth={2.5} /> Tarih</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><QrCode size={12} strokeWidth={2.5} /> Barkod</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><Hash size={12} strokeWidth={2.5} /> Evrak No</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2"><MapPin size={12} strokeWidth={2.5} /> Gideceği Yer</div>
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">
                <div className="flex items-center gap-2 justify-end"><CreditCard size={12} strokeWidth={2.5} /> Ücret</div>
              </th>
              <th className="px-10 py-5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Eylem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50 relative">
            {arsivListe.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-10 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <FileCheck2 size={64} strokeWidth={1} />
                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Arşivde kayıtlı evrak bulunamadı</p>
                  </div>
                </td>
              </tr>
            ) : (
              arsivListe.map((item) => (
                <tr key={item.id} className="group/row hover:bg-slate-50/50 dark:hover:bg-gray-800/40 transition-all duration-300">
                  <td className="px-10 py-6">
                    <button
                      onClick={() => onToggleStatus(item)}
                      className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 flex items-center justify-center gap-2
                        ${item.durum === 'GELDİ' 
                          ? 'bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800/50 shadow-sm hover:bg-green-100' 
                          : 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 shadow-sm hover:bg-amber-100'
                        }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${item.durum === 'GELDİ' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      {item.durum}
                    </button>
                  </td>
                  <td className="px-6 py-6 font-bold text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                    {item.tarih ? item.tarih.split(' ')[0] : '---'}
                  </td>
                  <td className="px-6 py-6 font-mono text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                    {item.barkod || '---'}
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">{item.evrak_no}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase leading-none">{item.yer}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Hedef Kurum</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right font-black text-gray-800 dark:text-white text-sm">
                    {(Number(item.ucret) || 0).toFixed(2)} ₺
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0 transition-all duration-300">
                      <button
                        onClick={() => onDelete(item.id!)}
                        className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-gray-800 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700"
                        title="Kayıt Sil"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
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
