import { Printer, X, Loader2 } from 'lucide-react'
import { ModernCombobox } from '../../../shared/components/ModernCombobox'

interface ArsivReportModalProps {
  isOpen: boolean
  onClose: () => void
  onPrint: () => void
  raporTipi: string
  setRaporTipi: (val: string) => void
  komisyon: {
    baskan: { id: string; ad_soyad: string; unvan: string }
    uye1: { id: string; ad_soyad: string; unvan: string }
    uye2: { id: string; ad_soyad: string; unvan: string }
  }
  setKomisyon: (val: any) => void
  yukleniyor: boolean
  imhaKomisyonu?: {
    id: any
    ad_soyad: string
    unvan: string
    gorev: 'BASKAN' | 'UYE' | 'UYE1' | 'UYE2'
  }[]
}

export const ArsivReportModal = ({
  isOpen,
  onClose,
  onPrint,
  raporTipi,
  setRaporTipi,
  komisyon,
  setKomisyon,
  yukleniyor,
  imhaKomisyonu
}: ArsivReportModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl rounded-2xl border border-white/20 dark:border-gray-800 shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 relative">
        {/* Background glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="relative px-4 py-3 flex justify-between items-center bg-transparent border-b border-gray-100/50 dark:border-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <Printer size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-gray-800 dark:text-white text-sm tracking-tight leading-none mb-0.5 uppercase">
                Raporlama
              </h3>
              <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                Rapor Aracı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-4 relative">
          <div className="space-y-2 mb-4">
            <label className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1.5 block px-0.5">Rapor Türü</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'LISTE', label: 'Arşiv Envanter Listesi', color: 'blue', desc: 'Tüm kayıtların dökümü' },
                { id: 'IMHA', label: 'İmhalık Olanları Listele', color: 'red', desc: 'Süresi dolan evraklar' },
                { id: 'ETIKET', label: 'Klasör Arkalığı (Etiket Basımı)', color: 'emerald', desc: 'Standart klasör etiketi formatı' }
              ].map((type) => (
                <label
                  key={type.id}
                  className={`flex flex-col p-2.5 rounded-lg border cursor-pointer transition-all duration-300 relative overflow-hidden group/opt ${
                    raporTipi === type.id
                      ? `bg-${type.color}-500/[0.08] dark:bg-${type.color}-500/[0.12] border-${type.color}-500 shadow-lg shadow-${type.color}-500/10 ring-1 ring-${type.color}-500/50`
                      : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="rpt"
                        checked={raporTipi === type.id}
                        onChange={() => setRaporTipi(type.id)}
                        className={`w-3.5 h-3.5 accent-${type.color}-600 cursor-pointer`}
                      />
                      <div>
                        <span className={`text-[11px] font-black uppercase tracking-tight ${raporTipi === type.id ? `text-${type.color}-600 dark:text-${type.color}-400` : 'text-gray-700 dark:text-white'}`}>
                          {type.label}
                        </span>
                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{type.desc}</p>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/[0.03] dark:bg-orange-900/10 p-3 rounded-xl border border-orange-500/10 dark:border-orange-500/20 shadow-inner mb-4">
            <div className="flex items-center gap-1.5 mb-3 px-0.5">
              <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse"></div>
              <strong className="text-[8px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                Komisyon
              </strong>
            </div>

            <div className="space-y-2">
              {/* Başkan */}
              <div className="bg-white/40 dark:bg-gray-800/40 p-2.5 rounded-lg border border-white/20 dark:border-gray-700/50 shadow-sm">
                <label className="text-[7px] font-black text-orange-600 dark:text-orange-400 mb-1.5 block uppercase tracking-widest px-0.5">
                  Başkan
                </label>
                <div className="space-y-1.5">
                  <ModernCombobox
                    className="w-full"
                    value={komisyon.baskan.id}
                    options={
                      imhaKomisyonu
                        ?.filter((u) => ['BASKAN', 'UYE', 'UYE1', 'UYE2'].includes(u.gorev))
                        .map((p) => ({
                          value: String(p.id),
                          label: p.ad_soyad
                        })) || []
                    }
                    placeholder="Seçiniz..."
                    searchPlaceholder="Ara..."
                    onChange={(val) => {
                      const p = imhaKomisyonu?.find((per) => String(per.id) === String(val))
                      if (p) {
                        setKomisyon({
                          ...komisyon,
                          baskan: { id: String(p.id), ad_soyad: p.ad_soyad, unvan: p.unvan || '' }
                        })
                      }
                    }}
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      placeholder="Ad Soyad"
                      className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-1.5 rounded-md text-[10px] font-bold text-gray-800 dark:text-white outline-none transition-all shadow-sm"
                      value={komisyon.baskan.ad_soyad}
                      onChange={(e) =>
                        setKomisyon({
                          ...komisyon,
                          baskan: { ...komisyon.baskan, ad_soyad: e.target.value }
                        })
                      }
                    />
                    <input
                      placeholder="Unvan"
                      className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-1.5 rounded-md text-[10px] font-bold text-gray-800 dark:text-white outline-none transition-all shadow-sm"
                      value={komisyon.baskan.unvan}
                      onChange={(e) =>
                        setKomisyon({
                          ...komisyon,
                          baskan: { ...komisyon.baskan, unvan: e.target.value }
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Üyeler */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'uye1', label: 'Üye 1' },
                  { key: 'uye2', label: 'Üye 2' }
                ].map((item) => (
                  <div key={item.key} className="bg-white/40 dark:bg-gray-800/40 p-2.5 rounded-lg border border-white/20 dark:border-gray-700/50 shadow-sm">
                    <label className="text-[7px] font-black text-orange-600 dark:text-orange-400 mb-1.5 block uppercase tracking-widest px-0.5">
                      {item.label}
                    </label>
                    <div className="space-y-1.5">
                      <ModernCombobox
                        className="w-full"
                        value={komisyon[item.key].id}
                        options={
                          imhaKomisyonu
                            ?.filter((u) => ['UYE', 'UYE1', 'UYE2'].includes(u.gorev))
                            .map((p) => ({
                              value: String(p.id),
                              label: p.ad_soyad
                            })) || []
                        }
                        placeholder="Seç..."
                        onChange={(val) => {
                          const p = imhaKomisyonu?.find((per) => String(per.id) === String(val))
                          if (p) {
                            setKomisyon({
                              ...komisyon,
                              [item.key]: { id: String(p.id), ad_soyad: p.ad_soyad, unvan: p.unvan || '' }
                            })
                          }
                        }}
                      />
                      <input
                        placeholder="Ad Soyad"
                        className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-1.5 rounded-md text-[9px] font-bold text-gray-800 dark:text-white outline-none transition-all shadow-sm"
                        value={komisyon[item.key].ad_soyad}
                        onChange={(e) =>
                          setKomisyon({
                            ...komisyon,
                            [item.key]: { ...komisyon[item.key], ad_soyad: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 relative">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg font-black text-[9px] uppercase tracking-[0.15em] border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95"
            >
              İptal
            </button>
            <button
              onClick={onPrint}
              disabled={yukleniyor}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.15em] shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {yukleniyor ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} strokeWidth={2.5} />}
              YAZDIR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
