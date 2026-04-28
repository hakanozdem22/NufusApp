import { Search, CheckCircle, AlertCircle } from 'lucide-react'
import { useResmiYaziViewModel } from '../viewmodels/useResmiYaziViewModel'
import { EvrakHeader } from '../components/EvrakHeader'
import { EvrakListTable } from '../components/EvrakListTable'
import { EvrakInlineForm } from '../components/EvrakInlineForm'
import { EvrakDeleteModal } from '../components/EvrakDeleteModal'

export const ResmiYazi = (): React.ReactElement => {
  const vm = useResmiYaziViewModel()

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 relative overflow-hidden transition-colors duration-500">
      {/* BİLDİRİM ÇUBUĞU */}
      {vm.bildirim && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 ${
            vm.bildirim.tur === 'basari' 
              ? 'bg-green-500/90 border-green-400/50 text-white' 
              : 'bg-red-500/90 border-red-400/50 text-white'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            {vm.bildirim.tur === 'basari' ? (
              <CheckCircle size={22} strokeWidth={2.5} />
            ) : (
              <AlertCircle size={22} strokeWidth={2.5} />
            )}
          </div>
          <span className="font-black text-sm uppercase tracking-widest">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      <EvrakDeleteModal
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.silmeIsleminiOnayla}
      />

      {/* Üst Bar - Header Section */}
      <EvrakHeader onPrint={vm.pdfAl} yukleniyor={vm.yukleniyor} />

      {/* Ana İçerik Alanı - Side-by-Side */}
      <div className="flex-1 overflow-hidden flex p-8 gap-8 max-w-[1920px] mx-auto w-full">
        {/* SOL PANEL: GİRİŞ FORMU */}
        <div className="w-[28%] flex flex-col h-full shrink-0">
          <EvrakInlineForm
            formData={vm.formData}
            setFormData={vm.setFormData}
            onSave={vm.kaydet}
            onFileSelect={vm.dosyaSec}
            onCancel={vm.onNew}
            kurumListesi={vm.kurumListesi}
            isEditing={!!vm.formData.id}
            onDelete={() => vm.formData.id && vm.setSilinecekId(vm.formData.id)}
          />
        </div>

        {/* SAĞ PANEL: LİSTE ve ARAMA */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Arama Barı */}
          <div className="relative group/search mb-6">
            <Search 
                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-purple-500 transition-colors" 
                size={20} 
                strokeWidth={2.5}
            />
            <input
              className="w-full h-14 pl-16 pr-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all dark:text-white shadow-lg placeholder-gray-400"
              placeholder="Konu, Sayı veya Kurum ismi ile filtrele..."
              value={vm.arama}
              onChange={(e) => vm.setArama(e.target.value)}
            />
          </div>

          <div className="flex-1 relative min-h-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden flex flex-col">
            <EvrakListTable
              data={vm.filtrelenmis}
              onOpenFile={(path) => window.api.openFile(path)}
              onEdit={vm.onEdit}
              onDelete={vm.setSilinecekId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
