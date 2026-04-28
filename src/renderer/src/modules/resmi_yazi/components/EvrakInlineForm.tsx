import React from 'react'
import { FileText, Upload, Send, X } from 'lucide-react'
import { Evrak } from '../models/evrak-types'

interface EvrakInlineFormProps {
  formData: Evrak
  setFormData: (data: Evrak) => void
  onSave: (e: React.FormEvent) => void
  onFileSelect: () => void
  onCancel: () => void
  kurumListesi?: { id: number; ad: string }[]
  isEditing: boolean
  onDelete?: () => void
}

export const EvrakInlineForm = ({
  formData,
  setFormData,
  onSave,
  onFileSelect,
  onCancel,
  kurumListesi = [],
  isEditing,
  onDelete
}: EvrakInlineFormProps): React.ReactElement => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col h-full group">
      {/* HEADER */}
      <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-500/5 to-transparent flex justify-between items-center transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600 shadow-inner group-hover:rotate-6 transition-transform duration-500">
            <FileText size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              {isEditing ? 'EVRAK DÜZENLE' : 'YENİ EVRAK KAYDI'}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
              DİJİTAL ARŞİV GİRİŞİ
            </p>
          </div>
        </div>
        {isEditing && (
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* FORM */}
      <form id="evrak-form" onSubmit={onSave} className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              EVRAK TÜRÜ
            </label>
            <select
              className="w-full h-14 px-6 bg-slate-50 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all appearance-none cursor-pointer"
              value={formData.tur}
              onChange={(e) => setFormData({ ...formData, tur: e.target.value as 'Gelen Evrak' | 'Giden Evrak' })}
            >
              <option>Giden Evrak</option>
              <option>Gelen Evrak</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              DURUM
            </label>
            <select
              className="w-full h-14 px-6 bg-slate-50 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all appearance-none cursor-pointer"
              value={formData.durum}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  durum: e.target.value as 'Cevap Gerekmiyor' | 'Cevap Bekleniyor' | 'Cevaplandı'
                })
              }
            >
              <option>Cevap Gerekmiyor</option>
              <option>Cevap Bekleniyor</option>
              <option>Cevaplandı</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              TARİH
            </label>
            <input
              className="w-full h-14 px-6 bg-slate-50 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all placeholder:text-gray-300"
              value={formData.tarih}
              onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
              placeholder="GG.AA.YYYY"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
              SAYI / NO
            </label>
            <input
              className="w-full h-14 px-6 bg-slate-50 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all placeholder:text-gray-300"
              value={formData.sayi}
              onChange={(e) => setFormData({ ...formData, sayi: e.target.value })}
              placeholder="E-12345678..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
            KURUM / MUHATAP
          </label>
          <input
            className="w-full h-14 px-6 bg-slate-50 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all placeholder:text-gray-300"
            value={formData.kurum}
            onChange={(e) => setFormData({ ...formData, kurum: e.target.value })}
            required
            list="kurumlar"
            placeholder="Kurum adını yazın..."
          />
          <datalist id="kurumlar">
            {kurumListesi.map((k) => (
              <option key={k.id} value={k.ad} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
             KONU
          </label>
          <textarea
            className="w-full px-6 py-5 bg-slate-50 dark:bg-gray-800/50 border border-transparent focus:border-purple-500/50 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition-all resize-none h-32 placeholder:text-gray-300 scrollbar-hide"
            value={formData.konu}
            onChange={(e) => setFormData({ ...formData, konu: e.target.value })}
            required
            placeholder="Evrak konusunu detaylıca belirtin..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest px-1">
            DİJİTAL DOSYA EKİ
          </label>
          <div className="flex gap-4">
            <input
              className="flex-1 h-14 px-6 bg-slate-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl text-xs font-bold outline-none border border-transparent"
              value={formData.dosya_yolu || ''}
              readOnly
              placeholder="Dosya seçilmedi..."
            />
            <button
              type="button"
              onClick={onFileSelect}
              className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 transition-all active:scale-95"
            >
              <Upload size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </form>

      {/* FOOTER */}
      <div className="p-8 bg-slate-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 flex gap-4">
        {isEditing && (
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 h-16 bg-white dark:bg-gray-800 border-2 border-red-500/20 text-red-500 rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95 shadow-lg shadow-red-500/5 px-4"
          >
            <X size={18} strokeWidth={3} />
            SİL
          </button>
        )}
        <button
          type="submit"
          form="evrak-form"
          className={`${
            isEditing ? 'flex-[2]' : 'w-full'
          } h-16 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-500/20 transition-all active:scale-95 group/btn`}
        >
          <Send
            size={18}
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
          {isEditing ? 'GÜNCELLE' : 'EVRAKI KAYDET'}
        </button>
      </div>
    </div>
  )
}
