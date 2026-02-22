import { Globe, Trash2, Phone, Mail, MapPin, Plus } from 'lucide-react'
import { Temsilcilik } from '../models/temsilcilik-types'

interface TemsilcilikCardProps {
  temsilcilikList: Temsilcilik[]
  onEdit: (t: Temsilcilik) => void
  onDelete: (id: string) => void
  onAddCity: (ulke: string, bayrakKodu?: string) => void
  getFlagByName: (name: string) => string | null
  imgHatalari: Record<string, boolean>
  setImgHatalari: (val: Record<string, boolean>) => void
}

export const TemsilcilikCard = ({
  temsilcilikList,
  onEdit,
  onDelete,
  onAddCity,
  getFlagByName,
  imgHatalari,
  setImgHatalari
}: TemsilcilikCardProps) => {
  if (!temsilcilikList || temsilcilikList.length === 0) return null

  const firstItem = temsilcilikList[0]
  const customCodeItem = temsilcilikList.find((t) => t.bayrak_kodu)
  const autoFlagSrc = getFlagByName(firstItem.ulke)
  const flagSrc = customCodeItem?.bayrak_kodu
    ? `https://flagcdn.com/w160/${customCodeItem.bayrak_kodu.toLowerCase()}.png`
    : autoFlagSrc
  const showImage = flagSrc && !imgHatalari[firstItem.id]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm hover:shadow-xl transition-all group flex flex-col overflow-hidden relative min-h-[260px] border-transparent hover:border-blue-400 dark:hover:border-blue-500">
      {/* GÖRSEL ALANI */}
      <div className="h-28 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700 relative flex items-center justify-center overflow-hidden p-3 shrink-0">
        {showImage ? (
          <img
            src={String(flagSrc)}
            alt={firstItem.ulke}
            onError={() => setImgHatalari({ ...imgHatalari, [firstItem.id]: true })}
            className="h-full w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
        ) : (
          <Globe size={48} className="text-gray-200 dark:text-gray-600 stroke-1" />
        )}
      </div>

      {/* İÇERİK ALANI (Ülke Adı) */}
      <div className="px-4 pt-3 pb-2 shrink-0 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
        <h3
          className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-tight line-clamp-1 text-center"
          title={firstItem.ulke}
        >
          {firstItem.ulke}
        </h3>
      </div>

      {/* TEMSİLCİLİKLER LİSTESİ */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar relative">
        {temsilcilikList.map((temsilcilik) => (
          <div
            key={temsilcilik.id}
            className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2.5 border border-gray-100 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors relative group/item"
          >
            {/* Başlık (Şehir & Tipi) */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-500" />
                  {temsilcilik.sehir}
                </div>
                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5 ml-5">
                  {temsilcilik.tip}
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-600">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(temsilcilik)
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  title="Düzenle"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </button>
                <div className="w-px h-3 bg-gray-200 dark:bg-gray-600"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(temsilcilik.id)
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* İletişim */}
            <div className="space-y-1 ml-5">
              {temsilcilik.telefon && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <Phone size={10} className="text-gray-400 shrink-0" />
                  <span className="truncate">{temsilcilik.telefon}</span>
                </div>
              )}
              {temsilcilik.eposta && (
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <Mail size={10} className="text-gray-400 shrink-0" />
                  <span className="truncate">{temsilcilik.eposta}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ŞEHİR EKLE BUTONU */}
      <div className="p-2 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-800/30 shrink-0">
        <button
          onClick={() => onAddCity(firstItem.ulke, firstItem.bayrak_kodu)}
          className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-dashed border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
        >
          <Plus size={14} /> Şehir Ekle
        </button>
      </div>
    </div>
  )
}
