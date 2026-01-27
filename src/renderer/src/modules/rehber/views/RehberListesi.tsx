import { Search, Plus } from 'lucide-react'
import { useRehberViewModel } from '../viewmodels/useRehberViewModel'
import { RehberCard } from '../components/RehberCard'
import { RehberFormModal } from '../components/RehberFormModal'

export const RehberListesi = () => {
  const vm = useRehberViewModel()

  return (
    <div className="p-4 h-screen flex flex-col bg-gray-50/50 dark:bg-gray-900 transition-colors">
      {/* ÜST BAR */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Rehber</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Kişi ve Kurumlar</p>
        </div>
        <button
          onClick={() => {
            vm.temizleVeKapat()
            vm.setModalAcik(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm text-sm transition"
        >
          <Plus size={16} /> Ekle
        </button>
      </div>

      {/* ARAMA */}
      <div className="mb-3 relative shrink-0">
        <Search className="absolute left-2.5 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Hızlı ara..."
          className="w-full pl-8 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none shadow-sm text-sm"
          value={vm.arama}
          onChange={(e) => vm.setArama(e.target.value)}
        />
      </div>

      {/* LİSTE */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 pb-10 content-start">
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

        {vm.filtrelenmis.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-400 dark:text-gray-500 text-xs">
            Kayıt bulunamadı.
          </div>
        )}
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
