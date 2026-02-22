import { Printer, Loader2 } from 'lucide-react'
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden transition-colors">
        <div className="bg-blue-600 text-white p-3 font-bold text-center text-sm tracking-wide uppercase">
          Raporlama
        </div>
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                raporTipi === 'LISTE'
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 dark:ring-blue-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="rpt"
                checked={raporTipi === 'LISTE'}
                onChange={() => setRaporTipi('LISTE')}
                className="accent-blue-600"
              />{' '}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Arşiv Envanter Listesi
              </span>
            </label>
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                raporTipi === 'IMHA'
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-500 ring-1 dark:ring-red-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="rpt"
                checked={raporTipi === 'IMHA'}
                onChange={() => setRaporTipi('IMHA')}
                className="accent-red-600"
              />{' '}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                İmhalık Olanları Listele
              </span>
            </label>
            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                raporTipi === 'ETIKET'
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-500 ring-1 dark:ring-green-500/50'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
              }`}
            >
              <input
                type="radio"
                name="rpt"
                checked={raporTipi === 'ETIKET'}
                onChange={() => setRaporTipi('ETIKET')}
                className="accent-green-600"
              />{' '}
              <span className="text-sm font-bold text-green-700 dark:text-green-400">
                Klasör Arkalığı (Etiket Basımı)
              </span>
            </label>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-200 dark:border-orange-800/50 text-xs mb-6 transition-colors shadow-sm">
            <strong className="block mb-2 text-orange-800 dark:text-orange-400">
              Komisyon Bilgileri
            </strong>
            <div className="grid gap-3">
              {/* Başkan */}
              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded border border-orange-300 dark:border-orange-700/50 shadow-sm">
                <label className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-2 block uppercase tracking-wide">
                  Komisyon Başkanı
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
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
                      placeholder="Seç..."
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
                  </div>
                  <div className="col-span-4">
                    <input
                      placeholder="Ad Soyad"
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 w-full text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-orange-500"
                      value={komisyon.baskan.ad_soyad}
                      onChange={(e) =>
                        setKomisyon({
                          ...komisyon,
                          baskan: { ...komisyon.baskan, ad_soyad: e.target.value }
                        })
                      }
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      placeholder="Unvan"
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 w-full text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-orange-500"
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
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded border border-orange-300 dark:border-orange-700/50 shadow-sm">
                  <label className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-1 block uppercase tracking-wide">
                    Birinci Üye
                  </label>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <ModernCombobox
                        className="w-full"
                        value={komisyon.uye1.id}
                        options={
                          imhaKomisyonu
                            ?.filter((u) => ['UYE', 'UYE1', 'UYE2'].includes(u.gorev))
                            .map((p) => ({
                              value: String(p.id),
                              label: p.ad_soyad
                            })) || []
                        }
                        placeholder="Seç..."
                        searchPlaceholder="Ara..."
                        onChange={(val) => {
                          const p = imhaKomisyonu?.find((per) => String(per.id) === String(val))
                          if (p) {
                            setKomisyon({
                              ...komisyon,
                              uye1: { id: String(p.id), ad_soyad: p.ad_soyad, unvan: p.unvan || '' }
                            })
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        placeholder="Ad Soyad 1"
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-orange-500 w-full"
                        value={komisyon.uye1.ad_soyad}
                        onChange={(e) =>
                          setKomisyon({
                            ...komisyon,
                            uye1: { ...komisyon.uye1, ad_soyad: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        placeholder="Unvan 1"
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-orange-500 w-full"
                        value={komisyon.uye1.unvan}
                        onChange={(e) =>
                          setKomisyon({
                            ...komisyon,
                            uye1: { ...komisyon.uye1, unvan: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded border border-orange-300 dark:border-orange-700/50 shadow-sm">
                  <label className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-1 block uppercase tracking-wide">
                    İkinci Üye
                  </label>
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <ModernCombobox
                        className="w-full"
                        value={komisyon.uye2.id}
                        options={
                          imhaKomisyonu
                            ?.filter((u) => ['UYE', 'UYE1', 'UYE2'].includes(u.gorev))
                            .map((p) => ({
                              value: String(p.id),
                              label: p.ad_soyad
                            })) || []
                        }
                        placeholder="Seç..."
                        searchPlaceholder="Ara..."
                        onChange={(val) => {
                          const p = imhaKomisyonu?.find((per) => String(per.id) === String(val))
                          if (p) {
                            setKomisyon({
                              ...komisyon,
                              uye2: { id: String(p.id), ad_soyad: p.ad_soyad, unvan: p.unvan || '' }
                            })
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        placeholder="Ad Soyad 2"
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-orange-500 w-full"
                        value={komisyon.uye2.ad_soyad}
                        onChange={(e) =>
                          setKomisyon({
                            ...komisyon,
                            uye2: { ...komisyon.uye2, ad_soyad: e.target.value }
                          })
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        placeholder="Unvan 2"
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 outline-none focus:ring-1 focus:ring-orange-500 w-full"
                        value={komisyon.uye2.unvan}
                        onChange={(e) =>
                          setKomisyon({
                            ...komisyon,
                            uye2: { ...komisyon.uye2, unvan: e.target.value }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
            >
              Vazgeç
            </button>
            <button
              onClick={onPrint}
              disabled={yukleniyor}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              {yukleniyor ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}{' '}
              YAZDIR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
