import { CheckCircle, AlertCircle } from 'lucide-react'
import { useArsivViewModel } from '../viewmodels/useArsivViewModel'
import { ArsivHeader } from '../components/ArsivHeader'
import { ArsivToolbar } from '../components/ArsivToolbar'
import { ArsivTable } from '../components/ArsivTable'
import { ArsivDeleteModal, ArsivBulkDeleteModal } from '../components/ArsivModals'
import { ArsivFormModal } from '../components/ArsivFormModal'
import { ArsivBulkUpdateModal } from '../components/ArsivBulkUpdateModal'
import { ArsivReportModal } from '../components/ArsivReportModal'

export const Arsiv = () => {
  const vm = useArsivViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 relative">
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${vm.bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* MODALLAR */}
      <ArsivDeleteModal
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.silmeOnayla}
      />

      <ArsivBulkDeleteModal
        isOpen={vm.topluSilmeModal}
        count={vm.secilenler.length}
        onClose={() => vm.setTopluSilmeModal(false)}
        onConfirm={vm.topluSil}
      />

      <ArsivHeader
        filtreler={vm.filtreler}
        setFiltreler={vm.setFiltreler}
        onSearch={vm.veriGetir}
      />

      <ArsivToolbar
        onAdd={vm.yeniKayit}
        selectedCount={vm.secilenler.length}
        onBulkUpdate={() => vm.setTopluGuncelleModal(true)}
        onBulkDelete={() => vm.setTopluSilmeModal(true)}
        onReport={() => vm.setYazdirModal(true)}
      />

      <ArsivTable
        liste={vm.liste}
        secilenler={vm.secilenler}
        onSelectAll={vm.tumunuSec}
        onSelectOne={vm.tekSec}
        onSelectSameName={vm.ayniIsmiSec}
        onEdit={vm.duzenle}
        onDelete={vm.setSilinecekId}
      />

      <ArsivBulkUpdateModal
        isOpen={vm.topluGuncelleModal}
        onClose={() => vm.setTopluGuncelleModal(false)}
        onConfirm={vm.topluGuncelle}
        count={vm.secilenler.length}
        klasorTanimlari={vm.klasorTanimlari}
        form={vm.topluUpdateForm}
        setForm={vm.setTopluUpdateForm}
      />

      <ArsivFormModal
        isOpen={vm.kayitModal}
        onClose={() => vm.setKayitModal(false)}
        onSave={vm.kaydet}
        form={vm.form}
        setForm={vm.setForm}
        klasorTanimlari={vm.klasorTanimlari}
      />

      <ArsivReportModal
        isOpen={vm.yazdirModal}
        onClose={() => vm.setYazdirModal(false)}
        onPrint={vm.raporAl}
        raporTipi={vm.raporTipi}
        setRaporTipi={vm.setRaporTipi}
        komisyon={vm.komisyon}
        setKomisyon={vm.setKomisyon}
        yukleniyor={vm.yukleniyor}
        imhaKomisyonu={vm.imhaKomisyonu}
      />
    </div>
  )
}
