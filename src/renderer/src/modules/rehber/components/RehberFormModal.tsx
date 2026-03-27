import React, { FormEvent } from 'react'
import { X, Save, AlertCircle, User, Phone, AtSign } from 'lucide-react'

interface RehberFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (e: FormEvent) => void
  formId: number | null
  formAd: string
  setFormAd: (val: string) => void
  formTel: string
  setFormTel: (val: string) => void
  formEmail: string
  setFormEmail: (val: string) => void
  formNot: string
  setFormNot: (val: string) => void
  hata: string | null
}

export const RehberFormModal = ({
  isOpen,
  onClose,
  onSave,
  formId,
  formAd,
  setFormAd,
  formTel,
  setFormTel,
  formEmail,
  setFormEmail,
  formNot,
  setFormNot,
  hata
}: RehberFormModalProps): React.ReactElement | null => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-gray-800 animate-in zoom-in-95 duration-500">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="flex flex-col">
             <h3 className="font-black text-gray-800 dark:text-gray-100 text-xl tracking-tight">
              {formId ? 'Bilgileri Düzenle' : 'Yeni Kayıt Oluştur'}
            </h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Rehber Modülü</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={onSave} className="p-8 space-y-6">
          {hata && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in shake duration-500">
              <AlertCircle size={18} strokeWidth={2.5} /> <span>{hata}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
              AD SOYAD / KURUM ADI <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 group-focus-within:bg-blue-50 dark:group-focus-within:bg-blue-900/30 transition-all">
                 <User size={16} strokeWidth={2.5} />
              </div>
              <input
                className="w-full pl-14 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                placeholder="Örn: Ahmet Yılmaz veya T.C. Kapaklı Belediyesi"
                value={formAd}
                onChange={(e) => setFormAd(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                TELEFON NUMARASI
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 group-focus-within:bg-blue-50 dark:group-focus-within:bg-blue-900/30 transition-all">
                  <Phone size={16} strokeWidth={2.5} />
                </div>
                <input
                  className="w-full pl-14 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                  placeholder="05XX XXX XX XX"
                  value={formTel}
                  onChange={(e) => setFormTel(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
                E-POSTA ADRESİ
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 group-focus-within:bg-blue-50 dark:group-focus-within:bg-blue-900/30 transition-all">
                  <AtSign size={16} strokeWidth={2.5} />
                </div>
                <input
                  className="w-full pl-14 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white transition-all shadow-sm"
                  placeholder="mail@ornek.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">
              EK NOTLAR
            </label>
            <textarea
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 h-24 resize-none bg-white dark:bg-gray-800 dark:text-white transition-all shadow-sm"
              placeholder="Kayıt ile ilgili eklemek istediğiniz detaylar..."
              value={formNot}
              onChange={(e) => setFormNot(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl text-sm font-black hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 flex justify-center items-center gap-3 shadow-lg shadow-blue-500/25 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Save size={20} strokeWidth={2.5} /> KAYDI TAMAMLA
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
