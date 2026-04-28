import { ReactElement } from 'react'
import { Search, Printer, Loader2, UserCheck, UserPlus, FileText } from 'lucide-react'

interface TerfiHeaderProps {
  arama: string
  setArama: (val: string) => void
  onPrintList: () => void
  onAddPersonnel: () => void
  yukleniyor: boolean
}

export const TerfiHeader = ({
  arama,
  setArama,
  onPrintList,
  onAddPersonnel,
  yukleniyor
}: TerfiHeaderProps): ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-xl flex flex-wrap justify-between items-center gap-4 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

      <div className="flex items-center gap-6 relative shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
          <UserCheck size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-gray-800 dark:text-white tracking-tight leading-none mb-1 uppercase">
            Personel Terfi Takibi
          </h1>
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic">
            Derece ve Kademe İlerleme Yönetimi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative group/search">
          <Search 
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-indigo-500 transition-colors" 
              size={18} 
              strokeWidth={2.5}
          />
          <input
            className="pl-14 pr-6 py-2 w-64 bg-slate-50 dark:bg-gray-800/80 border-none rounded-lg text-sm font-bold outline-none ring-4 ring-transparent focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-white shadow-inner placeholder-gray-400"
            placeholder="Personel ismi ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>

        <button
          onClick={onAddPersonnel}
          disabled={yukleniyor}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-black text-xs flex items-center gap-3 shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 group/add"
        >
          <UserPlus size={18} strokeWidth={3} className="group-hover/add:scale-110 transition-transform" /> 
          YENİ PERSONEL
        </button>

        <button
          onClick={onPrintList}
          disabled={yukleniyor}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-black text-xs flex items-center gap-3 shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 group/print"
        >
          {yukleniyor 
            ? <Loader2 size={18} className="animate-spin" /> 
            : <Printer size={18} strokeWidth={3} className="group-hover/print:scale-110 transition-transform" />
          }
          TERFİ LİSTESİ AL
          <FileText size={14} className="ml-1 opacity-50" />
        </button>
      </div>
    </div>
  )
}
