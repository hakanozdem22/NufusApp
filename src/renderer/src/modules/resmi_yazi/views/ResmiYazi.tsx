import { Search, CheckCircle, AlertCircle } from 'lucide-react'
import { useResmiYaziViewModel } from '../viewmodels/useResmiYaziViewModel'
import { EvrakHeader } from '../components/EvrakHeader'
import { EvrakListTable } from '../components/EvrakListTable'
import { EvrakFormModal } from '../components/EvrakFormModal'
import { EvrakDeleteModal } from '../components/EvrakDeleteModal'

export const ResmiYazi = () => {
  const vm = useResmiYaziViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900 relative overflow-hidden">
      {/* BİLDİRİM ÇUBUĞU */}
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${vm.bildirim.tur === 'basari' ? 'bg-green-600' : 'bg-red-600'} text-white`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      <EvrakDeleteModal
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.silmeIsleminiOnayla}
      />

      {/* Üst Bar */}
      <EvrakHeader onPrint={vm.pdfAl} onNew={vm.onNew} yukleniyor={vm.yukleniyor} />

      {/* Liste */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="mx-6 mt-4 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            className="w-full pl-10 p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Konu veya Kurum ara..."
            value={vm.arama}
            onChange={(e) => vm.setArama(e.target.value)}
          />
        </div>

        <EvrakListTable
          data={vm.filtrelenmis}
          onOpenFile={(path) => window.api.openFile(path)}
          onEdit={vm.onEdit}
          onDelete={vm.setSilinecekId}
        />
      </div>

      {/* Kayıt Modalı */}
      <EvrakFormModal
        isOpen={vm.modalAcik}
        onClose={() => vm.setModalAcik(false)}
        onSave={vm.kaydet}
        formData={vm.formData}
        setFormData={vm.setFormData}
        onFileSelect={vm.dosyaSec}
        kurumListesi={vm.kurumListesi}
      />
    </div>
  )
}
