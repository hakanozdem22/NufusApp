import React from 'react'
import { Phone, Mail, Edit2, Trash2 } from 'lucide-react'
import { Kisi } from '../models/rehber-types'

interface RehberCardProps {
  kisi: Kisi
  onEdit: (kisi: Kisi) => void
  onDelete: (id: number) => void
  onCopy: (text: string, id: number, tur: 'tel' | 'mail') => void
  kopyalandiBilgi: { id: number; tur: 'tel' | 'mail' } | null
}

export const RehberCard = ({
  kisi,
  onEdit,
  onDelete,
  onCopy,
  kopyalandiBilgi
}: RehberCardProps): React.ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-500 group relative flex flex-col h-full overflow-hidden">
      {/* DEKORATİF ARKA PLAN */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

      {/* ÜST KISIM */}
      <div className="flex items-start justify-between mb-5 relative">
        <div className="flex flex-col gap-3 overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xl shrink-0 border border-blue-100/50 dark:border-blue-800/50 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            {kisi.ad_soyad.charAt(0).toUpperCase()}
          </div>
          <h3
            className="font-black text-gray-800 dark:text-gray-100 text-[15px] leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            title={kisi.ad_soyad}
          >
            {kisi.ad_soyad}
          </h3>
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={() => onEdit(kisi)}
            className="p-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all active:scale-90"
            title="Düzenle"
          >
            <Edit2 size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onDelete(kisi.id)}
            className="p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-90"
            title="Sil"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bilgiler */}
      <div className="space-y-3 flex-1 relative">
        {kisi.telefon && (
          <div
            className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group/item overflow-hidden"
            onClick={() => onCopy(kisi.telefon, kisi.id, 'tel')}
          >
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform">
              <Phone
                size={14}
                strokeWidth={2.5}
                className="text-gray-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400"
              />
            </div>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-xs truncate tracking-tight">{kisi.telefon}</span>
            {kopyalandiBilgi?.id === kisi.id && kopyalandiBilgi?.tur === 'tel' && (
              <div className="absolute right-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-lg animate-in fade-in slide-in-from-right-2 duration-300">
                KOPYALANDI
              </div>
            )}
          </div>
        )}
        
        {kisi.email && (
          <div
            className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group/item overflow-hidden"
            onClick={() => onCopy(kisi.email, kisi.id, 'mail')}
          >
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/item:scale-110 transition-transform">
              <Mail
                size={14}
                strokeWidth={2.5}
                className="text-gray-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400"
              />
            </div>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-xs truncate tracking-tight uppercase" title={kisi.email}>
              {kisi.email.split('@')[0]}
            </span>
            {kopyalandiBilgi?.id === kisi.id && kopyalandiBilgi?.tur === 'mail' && (
              <div className="absolute right-2 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-lg animate-in fade-in slide-in-from-right-2 duration-300">
                KOPYALANDI
              </div>
            )}
          </div>
        )}

        {/* Not Alanı */}
        {kisi.aciklama && (
          <div className="mt-2 p-3 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
              {kisi.aciklama}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
