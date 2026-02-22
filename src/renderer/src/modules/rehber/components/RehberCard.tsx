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
}: RehberCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition flex flex-col gap-1.5 group relative h-full">
      {/* Üst Kısım */}
      <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700 pb-1.5 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0 border border-blue-100 dark:border-blue-800">
            {kisi.ad_soyad.charAt(0).toUpperCase()}
          </div>
          <h3
            className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate"
            title={kisi.ad_soyad}
          >
            {kisi.ad_soyad}
          </h3>
        </div>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(kisi)}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(kisi.id)}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Bilgiler (Flex-1 ile alanı doldurur) */}
      <div className="space-y-1 pl-0.5 flex-1">
        {kisi.telefon && (
          <div
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition group/item"
            onClick={() => onCopy(kisi.telefon, kisi.id, 'tel')}
          >
            <Phone
              size={12}
              className="text-gray-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 shrink-0"
            />
            <span className="font-mono text-xs truncate">{kisi.telefon}</span>
            {kopyalandiBilgi?.id === kisi.id && kopyalandiBilgi?.tur === 'tel' && (
              <span className="text-[9px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded ml-auto">
                Kopya
              </span>
            )}
          </div>
        )}
        {kisi.email && (
          <div
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition group/item"
            onClick={() => onCopy(kisi.email, kisi.id, 'mail')}
          >
            <Mail
              size={12}
              className="text-gray-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 shrink-0"
            />
            <span className="text-xs truncate" title={kisi.email}>
              {kisi.email}
            </span>
            {kopyalandiBilgi?.id === kisi.id && kopyalandiBilgi?.tur === 'mail' && (
              <span className="text-[9px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 rounded ml-auto">
                Kopya
              </span>
            )}
          </div>
        )}
        {/* Not Alanı */}
        {kisi.aciklama && (
          <div className="mt-0.5 pt-1 border-t border-dashed border-gray-100">
            <p className="text-[10px] text-gray-400 line-clamp-2">{kisi.aciklama}</p>
          </div>
        )}
      </div>
    </div>
  )
}
