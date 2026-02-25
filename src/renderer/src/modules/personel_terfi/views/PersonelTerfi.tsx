import { Toast } from '../../../shared/components/Toast'
import { usePersonelTerfiViewModel } from '../viewmodels/usePersonelTerfiViewModel'
import { TerfiHeader } from '../components/TerfiHeader'
import { TerfiTable } from '../components/TerfiTable'
import { PersonelFormModal } from '../components/PersonelFormModal'

export const PersonelTerfi = (): React.ReactElement => {
  const vm = usePersonelTerfiViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6 relative transition-colors">
      {/* TOAST BİLDİRİMİ */}
      {vm.toast.show && (
        <Toast
          message={vm.toast.message}
          type={vm.toast.type}
          onClose={() => vm.setToast({ ...vm.toast, show: false })}
        />
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

      <div className="flex-1 flex flex-col min-h-0">
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
  )
}
