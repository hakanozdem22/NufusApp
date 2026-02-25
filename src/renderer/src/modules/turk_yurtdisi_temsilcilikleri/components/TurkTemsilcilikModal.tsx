import { useState, useEffect } from 'react'
import { TurkTemsilcilik } from '../models/turk-temsilcilik-types'
import { Globe, X, MapPin, Phone, Mail, Link as LinkIcon, Building2, Save } from 'lucide-react'
import { useTurkTemsilcilikViewModel } from '../viewmodels/useTurkTemsilcilikViewModel'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  initialData?: TurkTemsilcilik | null
}

export function TurkTemsilcilikModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<TurkTemsilcilik>>({
    ulke: '',
    tip: 'Büyükelçilik',
    sehir: '',
    adres: '',
    telefon: '',
    eposta: '',
    web_sitesi: '',
    bayrak_kodu: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getFlagByName } = useTurkTemsilcilikViewModel()

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        ulke: '',
        tip: 'Büyükelçilik',
        sehir: '',
        adres: '',
        telefon: '',
        eposta: '',
        web_sitesi: '',
        bayrak_kodu: ''
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydedilirken bir hata oluştu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const autoFlagSrc = getFlagByName(formData.ulke || '')
  const flagSrc = formData.bayrak_kodu
    ? `https://flagcdn.com/w160/${formData.bayrak_kodu.toLowerCase()}.png`
    : autoFlagSrc

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-700 transition-colors">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-500 px-8 py-5 flex justify-between items-center shrink-0 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-black/10 blur-2xl"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner border border-white/30 text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {initialData ? 'Temsilcilik Detayları' : 'Yeni Temsilcilik Ekle'}
              </h2>
              <p className="text-red-50 text-sm font-medium opacity-90">
                {initialData ? formData.ulke : 'Sisteme yeni bir Türk temsilciliği tanımlayın'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors relative z-10"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 p-8 transition-colors">
          <form
            id="turk-temsilcilik-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-12 gap-8 h-full"
          >
            {/* LEFT COLUMN: Main Info & Flag */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>

                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Flag Display */}
                  <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-inner group-hover:shadow-md transition-all">
                    {flagSrc ? (
                      <img
                        src={String(flagSrc)}
                        className="w-full h-full object-cover"
                        alt="Flag"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                        <Globe size={48} className="mb-2 opacity-30" />
                        <span className="text-xs font-semibold">Bayrak Yok</span>
                      </div>
                    )}
                  </div>

                  {/* Country Name */}
                  <div className="w-full text-left space-y-1.5 mt-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Ülke Adı
                    </label>
                    <input
                      required
                      spellCheck={false}
                      className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3.5 rounded-xl text-lg font-bold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                      value={formData.ulke || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, ulke: e.target.value.toUpperCase() })
                      }
                      placeholder="Örn: ALMANYA"
                    />
                  </div>

                  {/* Bayrak Kodu */}
                  <div className="w-full text-left space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Özel Bayrak Kodu{' '}
                      <span className="text-[10px] opacity-70 lowercase capitalize normal-case">
                        &nbsp;(Opsiyonel)
                      </span>
                    </label>
                    <input
                      spellCheck={false}
                      maxLength={2}
                      className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3.5 rounded-xl text-lg font-bold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                      value={formData.bayrak_kodu || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, bayrak_kodu: e.target.value.toUpperCase() })
                      }
                      placeholder="Örn: US, DE, FR"
                    />
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-tight text-center">
                      * Ülke adıyla bayrak eşleşmezse, buraya 2 harfli ülke kodunu girerek bayrağı
                      atayabilirsiniz. (Boş bırakılırsa ülke adı kullanılır)
                    </p>
                  </div>

                  {/* Type Selection */}
                  <div className="w-full text-left space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Temsilcilik Tipi
                    </label>
                    <select
                      value={formData.tip || ''}
                      onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                    >
                      <option value="Büyükelçilik">Büyükelçilik</option>
                      <option value="Daimi Temsilcilik">Daimi Temsilcilik</option>
                      <option value="Başkonsolosluk">Başkonsolosluk</option>
                      <option value="Konsolosluk">Konsolosluk</option>
                      <option value="Fahri Başkonsolosluk">Fahri Başkonsolosluk</option>
                      <option value="Fahri Konsolosluk">Fahri Konsolosluk</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Contact Info */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex items-center transition-colors">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                      <MapPin size={18} />
                    </div>
                    Konum ve Adres Bilgileri
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Bulunduğu Şehir
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-colors"
                      value={formData.sehir || ''}
                      onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
                      placeholder="Örn: Berlin"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Açık Adres
                    </label>
                    <textarea
                      rows={3}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-colors resize-none"
                      value={formData.adres || ''}
                      onChange={(e) => setFormData({ ...formData, adres: e.target.value })}
                      placeholder="Temsilciliğin tam adresi..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex items-center transition-colors">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                      <Phone size={18} />
                    </div>
                    İletişim Bilgileri
                  </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <Phone size={12} /> Telefon Numarası
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-colors"
                      value={formData.telefon || ''}
                      onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                      placeholder="+49 ..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <Mail size={12} /> E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-colors"
                      value={formData.eposta || ''}
                      onChange={(e) => setFormData({ ...formData, eposta: e.target.value })}
                      placeholder="ornek@mfa.gov.tr"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                      <LinkIcon size={12} /> Web Sitesi
                    </label>
                    <input
                      type="url"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-colors"
                      value={formData.web_sitesi || ''}
                      onChange={(e) => setFormData({ ...formData, web_sitesi: e.target.value })}
                      placeholder="http://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-4 shrink-0 relative z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] transition-colors">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all text-sm"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="turk-temsilcilik-form"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-500 dark:to-rose-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none hover:shadow-red-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting
              ? 'Kaydediliyor...'
              : initialData
                ? 'Değişiklikleri Kaydet'
                : 'Temsilciliği Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
