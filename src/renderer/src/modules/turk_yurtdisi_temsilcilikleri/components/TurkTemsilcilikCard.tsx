import React, { ReactElement } from 'react'
import { Globe, Trash2, Phone, Mail, MapPin, Plus, Edit3 } from 'lucide-react'
import { TurkTemsilcilik } from '../models/turk-temsilcilik-types'

interface TurkTemsilcilikCardProps {
  temsilcilikList: TurkTemsilcilik[]
  onEdit: (t: TurkTemsilcilik) => void
  onDelete: (id: string) => void
  onAddCity: (ulke: string, bayrakKodu?: string) => void
  getFlagByName: (name: string) => string | null
  imgHatalari: Record<string, boolean>
  setImgHatalari: (val: Record<string, boolean>) => void
}

export const TurkTemsilcilikCard = ({
  temsilcilikList,
  onEdit,
  onDelete,
  onAddCity,
  getFlagByName,
  imgHatalari,
  setImgHatalari
}: TurkTemsilcilikCardProps): ReactElement | null => {
  if (!temsilcilikList || temsilcilikList.length === 0) return null

  const firstItem = temsilcilikList[0]
  const customCodeItem = temsilcilikList.find((t) => t.bayrak_kodu)
  const autoFlagSrc = getFlagByName(firstItem.ulke)
  const flagSrc = customCodeItem?.bayrak_kodu
    ? `https://flagcdn.com/w160/${customCodeItem.bayrak_kodu.toLowerCase()}.png`
    : autoFlagSrc
  const showImage = flagSrc && !imgHatalari[firstItem.id]

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col overflow-hidden relative group hover:shadow-red-500/10 transition-all duration-500 border-white/20">
      {/* GÖRSEL ALANI - Bayrak */}
      <div className="h-32 bg-slate-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50 relative flex items-center justify-center overflow-hidden p-6 shrink-0 group/flag">
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent opacity-0 group-hover/flag:opacity-100 transition-opacity duration-500 z-10"></div>
        {showImage ? (
          <img
            src={String(flagSrc)}
            alt={firstItem.ulke}
            onError={() => setImgHatalari({ ...imgHatalari, [firstItem.id]: true })}
            className="h-full w-auto object-contain drop-shadow-2xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-700 relative z-0 rounded-md border border-gray-100/50"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-gray-300 dark:text-gray-600">
            <Globe size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* İÇERİK ALANI (Ülke Adı) */}
      <div className="px-6 py-4 bg-red-50/30 dark:bg-red-950/20 border-b border-red-100/50 dark:border-red-900/30 relative overflow-hidden text-center">
        <div className="absolute -left-4 -top-4 w-12 h-12 bg-red-500/10 rounded-full blur-xl"></div>
        <h3
          className="font-black text-gray-800 dark:text-gray-100 text-[16px] leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-red-600 transition-colors"
          title={firstItem.ulke}
        >
          {firstItem.ulke}
        </h3>
      </div>

      {/* TEMSİLCİLİKLER LİSTESİ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {temsilcilikList.map((temsilcilik) => (
          <div
            key={temsilcilik.id}
            className="group/item relative bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-red-500/30 hover:bg-red-50/30 dark:hover:bg-red-900/20 transition-all duration-300 shadow-sm"
          >
            {/* Şehir & Tipi */}
            <div className="flex flex-col gap-1 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                    <MapPin size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight">{temsilcilik.sehir}</span>
                </div>
                
                {/* Aksiyonlar */}
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all scale-90 group-hover/item:scale-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(temsilcilik)
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center transition-all active:scale-90"
                  >
                    <Edit3 size={14} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(temsilcilik.id)
                    }}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 text-gray-400 hover:text-red-600 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center transition-all active:scale-90"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <span className="text-[9px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest ml-8 opacity-70 italic">{temsilcilik.tip}</span>
            </div>

            {/* İletişim Detayları */}
            <div className="space-y-2 ml-8">
              {temsilcilik.telefon && (
                <div className="flex items-center gap-2.5 group/phone">
                  <Phone size={10} className="text-gray-300 dark:text-gray-600 group-hover/phone:text-red-500 transition-colors" />
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 truncate" title={temsilcilik.telefon}>{temsilcilik.telefon}</span>
                </div>
              )}
              {temsilcilik.eposta && (
                <div className="flex items-center gap-2.5 group/mail text-wrap break-all">
                  <Mail size={10} className="text-gray-300 dark:text-gray-600 group-hover/mail:text-red-500 transition-colors shrink-0" />
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400" title={temsilcilik.eposta}>{temsilcilik.eposta}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTION */}
      <div className="p-4 bg-slate-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <button
          onClick={() => onAddCity(firstItem.ulke, firstItem.bayrak_kodu)}
          className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 border border-dashed border-red-200 dark:border-red-800/50 rounded-2xl hover:bg-white hover:border-red-400 dark:hover:border-red-600 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={14} strokeWidth={3} /> Şehir Ekle
        </button>
      </div>
    </div>
  )
}
