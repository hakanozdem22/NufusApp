import { ReactElement } from 'react'
import { Toast } from '../../../shared/components/Toast'
import { usePersonelTerfiViewModel } from '../viewmodels/usePersonelTerfiViewModel'
import { TerfiHeader } from '../components/TerfiHeader'
import { TerfiTable } from '../components/TerfiTable'
import { PersonelFormModal } from '../components/PersonelFormModal'

export const PersonelTerfi = (): ReactElement => {
  const vm = usePersonelTerfiViewModel()

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 relative transition-colors duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 overflow-auto scrollbar-hide py-8 px-8 max-w-[1700px] mx-auto w-full">
        {/* TOAST BİLDİRİMİ */}
        {vm.toast.show && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                <Toast
                    message={vm.toast.message}
                    type={vm.toast.type}
                    onClose={() => vm.setToast({ ...vm.toast, show: false })}
                />
            </div>
        )}

        {/* MODAL */}
        <PersonelFormModal
          isOpen={vm.modalAcik}
          onClose={() => vm.setModalAcik(false)}
          onSave={vm.personelKaydet}
          initialData={vm.duzenlenecekPersonel}
        />

        {/* ÜST BAR */}
        <TerfiHeader
          arama={vm.arama}
          setArama={vm.setArama}
          onPrintList={() => vm.raporAl()}
          onAddPersonnel={() => vm.duzenlemeyiBaslat(null)}
          yukleniyor={vm.yukleniyor}
        />

        {/* Ana İçerik Alanı */}
        <div className="flex-1 flex flex-col min-h-0 mt-8">
          {/* İÇERİK: TABLO */}
           <TerfiTable
            data={vm.filtrelenenler}
            selectedIds={vm.secilenler}
            onSelectAll={vm.tumunuSec}
            onSelectOne={vm.tekSec}
            onEdit={vm.duzenlemeyiBaslat}
          />
        </div>
      </div>
    </div>
  )
}
