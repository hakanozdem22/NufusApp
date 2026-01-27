import { Globe, FileText, Trash2 } from 'lucide-react'
import { TebdilUlke } from '../models/tebdil-types'

interface TebdilListProps {
  liste: TebdilUlke[]
  getFlagSrc: (codeOrUrl: string) => string | null
  getFlagByName: (name: string) => string | null
  imgHatalari: Record<number, boolean>
  setImgHatalari: (val: Record<number, boolean>) => void
  onEdit: (item: TebdilUlke) => void
  onDelete: (id: number) => void
}

export const TebdilList = ({
  liste,
  getFlagSrc,
  getFlagByName,
  imgHatalari,
  setImgHatalari,
  onEdit,
  onDelete
}: TebdilListProps) => {
  return (
    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {liste.map((item) => {
          const flagSrc = getFlagSrc(item.bayrak_url) || getFlagByName(item.ulke_adi)
          const showImage = flagSrc && !imgHatalari[item.id]

          return (
            <div
              key={item.id}
              onClick={() => onEdit(item)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group flex flex-col overflow-hidden relative cursor-pointer h-[240px]"
            >
              {/* ÜST İKONLAR (DURUM GÖSTERGESİ) */}
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                {/* Link Varsa Yeşil Dünya İkonu */}
                {(() => {
                  let urls: string[] = []
                  try {
                    if (item.site_url) {
                      if (item.site_url.startsWith('[')) urls = JSON.parse(item.site_url)
                      else urls = [item.site_url]
                    }
                  } catch {
                    urls = []
                  }

                  if (urls.length > 0) {
                    return (
                      <div
                        className="p-1.5 rounded-full shadow-sm backdrop-blur bg-green-100/90 text-green-700 border border-green-200 relative group/link"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (urls.length === 1) {
                            window.api?.openExternal(urls[0])
                          }
                        }}
                        title={
                          urls.length === 1
                            ? 'Doğrulama Linki'
                            : `${urls.length} Adet Doğrulama Linki`
                        }
                      >
                        <Globe size={14} />
                        {urls.length > 1 && (
                          <div className="hidden group-hover/link:flex absolute top-full right-0 mt-1 flex-col bg-white border rounded shadow-lg z-50 min-w-[150px] overflow-hidden">
                            {urls.map((u, i) => (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  window.api?.openExternal(u)
                                }}
                                className="px-3 py-2 text-xs text-left hover:bg-gray-100 text-blue-600 truncate border-b last:border-0"
                              >
                                Site {i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  }
                  return null
                })()}
                {/* Dosya Varsa Mavi Dosya İkonu (Basit kontrol: Eski sistem dosya_yolu doluysa veya yeni sistemde tıklayınca görünür) */}
                <div
                  className="p-1.5 rounded-full shadow-sm backdrop-blur bg-blue-100/90 text-blue-700 border border-blue-200"
                  title="Resmi Yazılar / Dosyalar"
                >
                  <FileText size={14} />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
                className="absolute top-2 left-2 z-10 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full text-gray-400 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>

              <div className="h-32 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700 relative flex items-center justify-center overflow-hidden p-2">
                {showImage ? (
                  <img
                    src={String(flagSrc)}
                    alt={item.ulke_adi}
                    onError={() => setImgHatalari({ ...imgHatalari, [item.id]: true })}
                    className="h-full w-auto object-contain drop-shadow-md transition-transform"
                  />
                ) : (
                  <Globe size={64} className="text-gray-300 stroke-1" />
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <h3
                    className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-tight line-clamp-1"
                    title={item.ulke_adi}
                  >
                    {item.ulke_adi}
                  </h3>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {item.aciklama || <span className="italic opacity-50">Açıklama yok</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
