import { useState, useMemo } from 'react'
import { FileText, Search, ShieldCheck, X, Calendar, Building2, Globe, AlertTriangle } from 'lucide-react'
import apostilData from '../data.json'

interface ApostilCountry {
  id: number
  ulke: string
  imzaTarihi: string
  onayKatilim: string
  yururlukTarihi: string
  durumNotu: string
  yetkiliMakam: string
}

const typeLabels: Record<string, { label: string; color: string }> = {
  'R': { label: 'Onay', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  'A': { label: 'Katılım', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  'Su': { label: 'Halef Olma', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  'A**': { label: 'Koşullu Katılım', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
}

function getTypeInfo(code: string) {
  return typeLabels[code] || { label: code, color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' }
}

function hasObjection(durumNotu: string) {
  return durumNotu.toLowerCase().includes('itiraz')
}

interface ApostilModalProps {
  country: ApostilCountry
  onClose: () => void
}

function ApostilModal({ country, onClose }: ApostilModalProps) {
  const typeInfo = getTypeInfo(country.yururlukTarihi)
  const objection = hasObjection(country.durumNotu)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-7 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -right-4 -bottom-12 w-40 h-40 bg-white/5 rounded-full" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          <div className="flex items-start gap-4 relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <Globe size={24} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight mb-1">
                {country.ulke}
              </h2>
              {country.yetkiliMakam && (
                <p className="text-blue-200 text-xs font-medium leading-relaxed">
                  {country.yetkiliMakam}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-white/15 text-white`}>
                  {typeInfo.label}
                </span>
                {objection && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-200">
                    <AlertTriangle size={11} strokeWidth={3} />
                    İtirazlı
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          {/* Tarihler */}
          <div className="grid grid-cols-2 gap-3">
            {country.imzaTarihi && (
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar size={13} className="text-gray-400" strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">İmza Tarihi</span>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{country.imzaTarihi}</p>
              </div>
            )}
            {country.onayKatilim && (
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar size={13} className="text-gray-400" strokeWidth={2.5} />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Onay / Katılım</span>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{country.onayKatilim}</p>
              </div>
            )}
          </div>

          {/* Katılım Türü */}
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <ShieldCheck size={13} className="text-gray-400" strokeWidth={2.5} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Katılım Türü</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>

          {/* Yetkili Makam */}
          {country.yetkiliMakam && (
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 size={13} className="text-gray-400" strokeWidth={2.5} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yetkili Makam</span>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">{country.yetkiliMakam}</p>
            </div>
          )}

          {/* Bildiri / Not */}
          {country.durumNotu && (
            <div className={`rounded-xl p-4 ${objection ? 'bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30' : 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={13} className={objection ? 'text-amber-500' : 'text-blue-500'} strokeWidth={2.5} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${objection ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  Bildiri / Not
                </span>
              </div>
              <p className={`text-sm font-medium leading-relaxed ${objection ? 'text-amber-800 dark:text-amber-200' : 'text-blue-800 dark:text-blue-200'}`}>
                {country.durumNotu}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const ApostilView = (): React.ReactElement => {
  const [aramaMetni, setAramaMetni] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<ApostilCountry | null>(null)

  const filteredData = useMemo(() => {
    if (!aramaMetni.trim()) return apostilData as ApostilCountry[]
    return (apostilData as ApostilCountry[]).filter((item) =>
      item.ulke.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      item.yetkiliMakam.toLowerCase().includes(aramaMetni.toLowerCase())
    )
  }, [aramaMetni])

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500 overflow-hidden">
      {/* PREMIUM HEADER */}
      <div className="p-8 shrink-0 w-full max-w-[1700px] mx-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-10 py-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

          <div className="flex flex-col xl:flex-row justify-between items-center gap-8 relative">
            {/* SOL: İkon + Başlık */}
            <div className="flex items-center gap-6 self-start xl:self-center shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500">
                <FileText size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight leading-none mb-1.5 uppercase">
                  Apostil
                </h1>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic">
                  Yabancı Resmi Belgelerin Tasdiki Rehberi
                </p>
              </div>
            </div>

            {/* SAĞ: Arama */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group/search w-full sm:w-80">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-blue-500 transition-colors"
                  size={18}
                  strokeWidth={2.5}
                />
                <input
                  className="pl-14 pr-6 py-4 w-full bg-slate-50 dark:bg-gray-800/80 border-none rounded-lg text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-white shadow-inner placeholder-gray-400"
                  placeholder="Ülke veya makam ara..."
                  value={aramaMetni}
                  onChange={(e) => setAramaMetni(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLO EKRANI */}
      <div className="flex-1 overflow-y-auto px-8 pb-12 scrollbar-hide max-w-[1700px] mx-auto w-full">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    SIRA/ÜLKE
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    İMZA TARİHİ
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    KATILIM
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    TÜR
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    BİLDİRİ / NOT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-400 dark:text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={40} className="opacity-20" />
                        <span className="text-sm font-black uppercase tracking-widest">Kayıt Bulunamadı</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => {
                    const typeInfo = getTypeInfo(item.yururlukTarihi)
                    const objection = hasObjection(item.durumNotu)
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedCountry(item as ApostilCountry)}
                        className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 flex items-center justify-center font-black text-xs shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {item.ulke}
                              </p>
                              {item.yetkiliMakam && (
                                <p className="text-xs text-gray-400 truncate max-w-[200px]" title={item.yetkiliMakam}>
                                  {item.yetkiliMakam}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {item.imzaTarihi || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          {item.onayKatilim || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black tracking-widest uppercase ${typeInfo.color}`}>
                            <ShieldCheck size={13} strokeWidth={2.5} />
                            {typeInfo.label}
                          </span>
                          {objection && (
                            <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                              İtirazlı
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 max-w-xs truncate" title={item.durumNotu}>
                          {item.durumNotu || '-'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedCountry && (
        <ApostilModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  )
}
