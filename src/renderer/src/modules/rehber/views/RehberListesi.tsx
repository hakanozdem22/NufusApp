import React from 'react'
import { Search, Plus } from 'lucide-react'
import { useRehberViewModel } from '../viewmodels/useRehberViewModel'
import { RehberCard } from '../components/RehberCard'
import { RehberFormModal } from '../components/RehberFormModal'

export const RehberListesi = (): React.ReactElement => {
  const vm = useRehberViewModel()

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500">
      {/* ÜST ARAÇ ÇUBUĞU */}
      <div className="sticky top-0 z-20 bg-slate-50/80 dark:bg-gray-950/80 backdrop-blur-md px-8 py-6 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-6 items-center justify-between">
          {/* ARAMA ALANI */}
          <div className="relative w-full md:max-w-md group">
            <Search 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
              size={18} 
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Rehberde hızlıca ara..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all text-sm font-medium"
              value={vm.arama}
              onChange={(e) => vm.setArama(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              vm.temizleVeKapat()
              vm.setModalAcik(true)
            }}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all active:scale-95 font-black text-sm"
          >
            <Plus size={18} strokeWidth={3} /> YENİ KAYIT EKLE
          </button>
        </div>
      </div>

      {/* LİSTE ALANI */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 content-start">
            {vm.filtrelenmis.map((kisi) => (
              <RehberCard
                key={kisi.id}
                kisi={kisi}
                onEdit={vm.duzenle}
                onDelete={vm.sil}
                onCopy={vm.panoyaKopyala}
                kopyalandiBilgi={vm.kopyalandiBilgi}
              />
            ))}
          </div>

          {vm.filtrelenmis.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-4">
                <Search size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-200 mb-1">Kayıt Bulunamadı</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                Arama kriterlerinize uygun sonuç bulamadık. Lütfen farklı bir anahtar kelime deneyin.
              </p>
            </div>
          )}
        </div>
      </div>

      <RehberFormModal
        isOpen={vm.modalAcik}
        onClose={vm.temizleVeKapat}
        onSave={vm.kaydet}
        formId={vm.formId}
        formAd={vm.formAd}
        setFormAd={vm.setFormAd}
        formTel={vm.formTel}
        setFormTel={vm.setFormTel}
        formEmail={vm.formEmail}
        setFormEmail={vm.setFormEmail}
        formNot={vm.formNot}
        setFormNot={vm.setFormNot}
        hata={vm.hata}
      />
    </div>
  )
}
