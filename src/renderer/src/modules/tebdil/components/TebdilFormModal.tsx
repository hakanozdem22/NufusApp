import { useRef } from 'react'
import {
  Globe,
  X,
  ImageIcon,
  ExternalLink,
  FileText,
  Paperclip,
  Link as LinkIcon,
  Trash2,
  UploadCloud,
  Save,
  Plus
} from 'lucide-react'
import { TebdilDosya, SiteLink } from '../models/tebdil-types'

interface TebdilFormState {
  id?: number
  ulke_adi: string
  bayrak_url: string
  site_url: SiteLink[]
  aciklama: string
}

interface TebdilDosyaState {
  ad: string
  yol: string
  tip: 'DOSYA' | 'LINK'
}

interface TebdilFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  form: TebdilFormState
  setForm: (val: TebdilFormState) => void
  getFlagSrc: (codeOrUrl: string) => string | null
  handleFlagUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  dosyalar: TebdilDosya[]
  yeniDosya: TebdilDosyaState
  setYeniDosya: (val: TebdilDosyaState) => void
  dosyaSec: () => void
  dosyaEkle: () => void
  dosyaSil: (id: number) => void
  dosyaAc: (yol: string, tip: string) => void
}

export const TebdilFormModal = ({
  isOpen,
  onClose,
  onSave,
  form,
  setForm,
  getFlagSrc,
  handleFlagUpload,
  dosyalar,
  yeniDosya,
  setYeniDosya,
  dosyaSec,
  dosyaEkle,
  dosyaSil,
  dosyaAc
}: TebdilFormModalProps): React.ReactElement | null => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

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
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-500 px-8 py-5 flex justify-between items-center shrink-0 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-black/10 blur-2xl"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner border border-white/30 text-white">
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {form.id ? 'Ülke Detayları' : 'Yeni Tebdil Ülkesi Ekle'}
              </h2>
              <p className="text-blue-100 text-sm font-medium opacity-90">
                {form.id ? form.ulke_adi : 'Sisteme yeni bir Tebdil ülkesi tanımlayın'}
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
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT COLUMN: Main Info */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Flag & Name Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>

                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-inner group-hover:shadow-md transition-all">
                    {form.bayrak_url && getFlagSrc(form.bayrak_url) ? (
                      <img
                        src={getFlagSrc(form.bayrak_url)!}
                        className="w-full h-full object-cover"
                        alt="Flag"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                        <ImageIcon size={48} className="mb-2 opacity-50" />
                        <span className="text-xs font-semibold">Bayrak Yok</span>
                      </div>
                    )}

                    {/* Upload Overlay */}
                    <div
                      className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={32} className="text-white mb-2" />
                      <span className="text-white text-xs font-bold px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                        GÖRSEL GÜNCELLE
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFlagUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="w-full text-left space-y-4 mt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                        Ülke Adı
                      </label>
                      <input
                        spellCheck={false}
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3.5 rounded-xl text-lg font-bold text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                        value={form.ulke_adi}
                        onChange={(e) =>
                          setForm({ ...form, ulke_adi: e.target.value.toUpperCase() })
                        }
                        placeholder="Örn: ALMANYA"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                        Açıklama / Notlar
                      </label>
                      <textarea
                        spellCheck={false}
                        className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none resize-none h-32 leading-relaxed"
                        value={form.aciklama}
                        onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
                        placeholder="Ülke ile ilgili önemli notları buraya ekleyebilirsiniz..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Resources */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              {/* Section: Files */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center transition-colors">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                      <FileText size={18} />
                    </div>
                    Resmi Belgeler ve Dosyalar
                  </h3>
                  {!form.id && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                      Önce kaydedin
                    </span>
                  )}
                </div>

                {form.id ? (
                  <div className="p-6 space-y-4 flex flex-col">
                    {/* Add File Area */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600 border-dashed flex gap-3 items-end transition-colors hover:border-blue-300 dark:hover:border-blue-500">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                          Dosya Adı
                        </label>
                        <input
                          spellCheck={false}
                          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors"
                          placeholder="Belge Adı"
                          value={yeniDosya.ad}
                          onChange={(e) => setYeniDosya({ ...yeniDosya, ad: e.target.value })}
                        />
                      </div>

                      {yeniDosya.tip === 'DOSYA' ? (
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            Dosya Seçimi
                          </label>
                          <div className="flex gap-2">
                            <input
                              readOnly
                              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 outline-none cursor-not-allowed transition-colors"
                              value={
                                yeniDosya.yol ? '.../' + yeniDosya.yol.split(/[/\\]/).pop() : ''
                              }
                              placeholder="Dosya seçilmedi"
                            />
                            <button
                              onClick={dosyaSec}
                              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500 transition-all active:scale-95"
                              title="Dosya Seç"
                            >
                              <Paperclip size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            URL Adresi
                          </label>
                          <input
                            className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-colors"
                            placeholder="https://..."
                            value={yeniDosya.yol}
                            onChange={(e) => setYeniDosya({ ...yeniDosya, yol: e.target.value })}
                          />
                        </div>
                      )}

                      <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-600 shrink-0 h-[42px] items-center transition-colors">
                        <button
                          onClick={() => setYeniDosya({ ...yeniDosya, tip: 'DOSYA', yol: '' })}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${yeniDosya.tip === 'DOSYA' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                          Dosya
                        </button>
                        <button
                          onClick={() => setYeniDosya({ ...yeniDosya, tip: 'LINK', yol: '' })}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${yeniDosya.tip === 'LINK' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                          Link
                        </button>
                      </div>

                      <button
                        onClick={dosyaEkle}
                        disabled={!yeniDosya.ad || !yeniDosya.yol}
                        className="h-[42px] px-5 bg-gray-900 dark:bg-black text-white rounded-lg hover:bg-black dark:hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold text-sm shadow-lg shadow-gray-200 dark:shadow-none"
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    </div>

                    {/* Files List */}
                    <div className="mt-4">
                      {dosyalar.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dosyalar.map((d) => (
                            <div
                              key={d.id}
                              className="group bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all flex items-start gap-3"
                            >
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${d.tip === 'LINK' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'}`}
                              >
                                {d.tip === 'LINK' ? <LinkIcon size={20} /> : <FileText size={20} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm whitespace-normal break-words">
                                  {d.ad}
                                </h4>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono whitespace-normal break-all">
                                  {d.yol}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => dosyaAc(d.yol, d.tip)}
                                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                  title="Aç"
                                >
                                  <ExternalLink size={14} />
                                </button>
                                <button
                                  onClick={() => dosyaSil(d.id)}
                                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                  title="Sil"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/30 dark:bg-gray-800/30 transition-colors">
                          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-full mb-3">
                            <FileText size={24} className="text-gray-300 dark:text-gray-500" />
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                            Henüz dosya eklenmemiş
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs">
                            Yukarıdaki panelden dosya veya link ekleyebilirsiniz.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/50 p-6 transition-colors">
                    <div className="text-center opacity-70">
                      <Save size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Dosya eklemek için önce ülkeyi kaydediniz.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Validation Sites */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 flex justify-between items-center transition-colors">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                      <Globe size={18} />
                    </div>
                    Doğrulama Siteleri
                  </h3>
                  <button
                    onClick={() => {
                      const currentSites = Array.isArray(form.site_url)
                        ? form.site_url
                        : form.site_url
                          ? [form.site_url]
                          : []
                      setForm({ ...form, site_url: [...currentSites, { url: '', aciklama: '' }] })
                    }}
                    className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800 font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center gap-1"
                  >
                    <Plus size={12} /> Yeni Site
                  </button>
                </div>

                <div className="p-6 flex flex-col">
                  {(() => {
                    const sites = Array.isArray(form.site_url)
                      ? form.site_url
                      : form.site_url
                        ? [form.site_url]
                        : []

                    if (sites.length === 0)
                      return (
                        <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50/30 dark:bg-gray-800/30 transition-colors">
                          <Globe size={24} className="text-gray-300 dark:text-gray-500 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                            Henüz doğrulama sitesi eklenmemiş
                          </p>
                        </div>
                      )

                    return (
                      <div className="space-y-3">
                        {sites.map((site: SiteLink, idx: number) => (
                          <div
                            key={idx}
                            className="flex gap-4 items-start bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm focus-within:border-blue-300 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 dark:focus-within:ring-blue-900/20 transition-all group"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 ml-1">
                                  Doğrulama URL
                                </label>
                                <div className="relative">
                                  <Globe
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                  />
                                  <input
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-blue-600 dark:text-blue-400 font-medium outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 transition-all"
                                    placeholder="https://..."
                                    value={site.url || ''}
                                    onChange={(e) => {
                                      const newSites = [...sites]
                                      newSites[idx] = { ...newSites[idx], url: e.target.value }
                                      setForm({ ...form, site_url: newSites })
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 ml-1">
                                  Site Açıklaması
                                </label>
                                <input
                                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500 transition-all"
                                  placeholder="Örn: E-Devlet Sorgulama"
                                  value={site.aciklama || ''}
                                  onChange={(e) => {
                                    const newSites = [...sites]
                                    newSites[idx] = { ...newSites[idx], aciklama: e.target.value }
                                    setForm({ ...form, site_url: newSites })
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-1 pt-6">
                              {site.url && (
                                <button
                                  onClick={() => window.api.openExternal(site.url)}
                                  className="p-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                  title="Siteye Git"
                                >
                                  <ExternalLink size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  const newSites = sites.filter((_, i) => i !== idx)
                                  setForm({ ...form, site_url: newSites })
                                }}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Sil"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-4 shrink-0 relative z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] transition-colors">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all text-sm"
          >
            Vazgeç
          </button>
          <button
            onClick={onSave}
            className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all text-sm flex items-center gap-2"
          >
            <Save size={18} />
            {form.id ? 'Değişiklikleri Kaydet' : 'Ülkeyi Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
