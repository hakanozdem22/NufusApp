import { Globe, FileText, Trash2 } from 'lucide-react'
import { TebdilUlke, ULKE_LINKLERI } from '../models/tebdil-types'

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
        {liste.map((item: any) => {
          const flagSrc = getFlagSrc(item.bayrak_url) || getFlagByName(item.ulke_adi)
          const showImage = flagSrc && !imgHatalari[item.id]

          // --- SECTION 2: DOĞRULAMA SİTELERİ (RESERVED FOR WORLD ICON) ---
          const sites: string[] = (() => {
            const urlsFound: string[] = []
            try {
              if (item.site_url) {
                const raw = item.site_url
                if (typeof raw === 'string') {
                  const trimmed = raw.trim()
                  if (trimmed.startsWith('[')) {
                    const parsed = JSON.parse(trimmed)
                    if (Array.isArray(parsed)) {
                      parsed.forEach((u: any) => {
                        const link = typeof u === 'string' ? u : u?.url
                        if (link && typeof link === 'string' && link.trim()) {
                          if (!urlsFound.includes(link.trim())) urlsFound.push(link.trim())
                        }
                      })
                    }
                  } else if (trimmed.length > 0) {
                    if (!urlsFound.includes(trimmed)) urlsFound.push(trimmed)
                  }
                } else if (Array.isArray(raw)) {
                  raw.forEach((u: any) => {
                    const link = typeof u === 'string' ? u : u?.url
                    if (link && typeof link === 'string' && link.trim()) {
                      if (!urlsFound.includes(link.trim())) urlsFound.push(link.trim())
                    }
                  })
                }
              }
            } catch (e) {
              console.error('Link parse hatası:', e)
            }

            // Fallback Linkler
            const upperName = (item.ulke_adi || '').toLocaleUpperCase('tr-TR').trim()
            if (upperName && ULKE_LINKLERI[upperName]) {
              const fallbackLink = ULKE_LINKLERI[upperName]
              if (!urlsFound.includes(fallbackLink)) {
                urlsFound.push(fallbackLink)
              }
            }
            return urlsFound
          })()

          // --- SECTION 1: RESMİ BELGELER VE DOSYALAR (RESERVED FOR DOCUMENT ICON) ---
          const dosyaSayisi = Number(item.dosya_sayisi || 0)
          const linkSayisi = Number(item.link_sayisi || 0)

          // Debugging
          if (dosyaSayisi > 0 || linkSayisi > 0 || sites.length > 0) {
            console.log(
              `[TEBDIL STATUS] ${item.ulke_adi}: Files=${dosyaSayisi}, AddedLinks=${linkSayisi}, ValidationSites=${sites.length}`
            )
          }

          // Ikon Mantığı (Kullanıcının beklentisine göre):
          const hasValidationSites = sites.length > 0
          const hasResmiBelgeVeyaDosya = dosyaSayisi > 0 || linkSayisi > 0

          const isGreenActive = hasValidationSites || hasResmiBelgeVeyaDosya

          return (
            <div
              key={String(item.id)}
              onClick={() => onEdit(item)}
              className={`bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm hover:shadow-xl transition-all group flex flex-col overflow-hidden relative cursor-pointer h-[240px] ${
                isGreenActive
                  ? 'border-green-300 dark:border-green-900/50 hover:border-green-500'
                  : 'border-transparent hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              {/* DURUM İKONLARI (SOL ÜST) */}
              <div className="absolute top-2 left-2 z-10 flex gap-1.5">
                {/* DÜNYA İKONU (Doğrulama Siteleri Varsa Yeşil) */}
                <div
                  className={`p-1 rounded-full shadow-lg border-2 transition-all relative group/link ${
                    hasValidationSites
                      ? 'bg-green-600 text-white border-green-400'
                      : 'bg-blue-600 text-white border-blue-400'
                  }`}
                  onClick={(e) => {
                    if (sites.length === 1) {
                      e.stopPropagation()
                      window.api?.openExternal(sites[0])
                    }
                  }}
                  title={hasValidationSites ? 'Doğrulama Sitesi/Referans Mevcut' : 'Site Yok'}
                >
                  <Globe size={13} strokeWidth={3} />
                  {sites.length > 1 && (
                    <div className="hidden group-hover/link:flex absolute top-full left-0 mt-1 flex-col bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl z-50 min-w-[200px] overflow-hidden">
                      {sites.map((u, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation()
                            window.api?.openExternal(u)
                          }}
                          className="px-4 py-3 text-xs text-left hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400 font-bold truncate border-b last:border-0 border-gray-100 dark:border-gray-700 transition-colors"
                        >
                          Bağlantı {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* BELGE İKONU (Link veya Dosya Eklendiyse Yeşil) */}
                <div
                  className={`p-1 rounded-full shadow-lg border-2 transition-all ${
                    hasResmiBelgeVeyaDosya
                      ? 'bg-green-600 text-white border-green-400'
                      : 'bg-blue-600 text-white border-blue-400'
                  }`}
                  title={
                    hasResmiBelgeVeyaDosya
                      ? `${dosyaSayisi} Dosya, ${linkSayisi} Belge Mevcut`
                      : 'Belge/Dosya Yok'
                  }
                >
                  <FileText size={13} strokeWidth={3} />
                </div>
              </div>

              {/* SİLME BUTONU (SAĞ ÜST) */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
                className="absolute top-2 right-2 z-10 bg-white/90 dark:bg-gray-800/90 p-1.5 rounded-full text-gray-400 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-gray-100 dark:border-gray-700"
              >
                <Trash2 size={16} />
              </button>

              {/* GÖRSEL ALANI */}
              <div className="h-32 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700 relative flex items-center justify-center overflow-hidden p-2">
                {showImage ? (
                  <img
                    src={String(flagSrc)}
                    alt={item.ulke_adi}
                    onError={() => setImgHatalari({ ...imgHatalari, [item.id]: true })}
                    className="h-full w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Globe size={64} className="text-gray-200 dark:text-gray-600 stroke-1" />
                )}
              </div>

              {/* İÇERİK ALANI */}
              <div className="p-4 flex flex-col flex-1 overflow-hidden transition-colors">
                <h3
                  className="font-bold text-gray-800 dark:text-gray-200 text-lg leading-tight line-clamp-1 mb-1"
                  title={item.ulke_adi}
                >
                  {item.ulke_adi}
                </h3>
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
