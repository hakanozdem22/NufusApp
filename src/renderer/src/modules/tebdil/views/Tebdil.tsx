import { CheckCircle, AlertCircle } from 'lucide-react'
import { useTebdilViewModel } from '../viewmodels/useTebdilViewModel'
import { TebdilHeader } from '../components/TebdilHeader'
import { TebdilList } from '../components/TebdilList'
import { TebdilDeleteModal, TebdilDefaultModal } from '../components/TebdilModals'
import { TebdilFormModal } from '../components/TebdilFormModal'

export const Tebdil = () => {
  const vm = useTebdilViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6 relative overflow-hidden">
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${vm.bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{vm.bildirim.mesaj}</span>
        </div>
      )}

      <TebdilDeleteModal
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.silmeIsleminiOnayla}
      />

      <TebdilDefaultModal
        isOpen={vm.onayModali}
        onClose={() => vm.setOnayModali(false)}
        onConfirm={vm.varsayilanlariYukle}
      />

      {/* ÜST BAR */}
      <TebdilHeader
        onLoadDefaults={() => vm.setOnayModali(true)}
        yukleniyor={vm.yukleniyor}
        arama={vm.arama}
        setArama={vm.setArama}
        onNew={vm.yeniEkle}
        aktifTab={vm.aktifTab}
        setAktifTab={vm.setAktifTab}
      />

      {/* KARTLAR */}
      <TebdilList
        liste={vm.filtrelenenler}
        getFlagSrc={vm.getFlagSrc}
        getFlagByName={vm.getFlagByName}
        imgHatalari={vm.imgHatalari}
        setImgHatalari={vm.setImgHatalari}
        onEdit={vm.duzenle}
        onDelete={vm.setSilinecekId}
      />

      {/* DÜZENLEME MODALI */}
      <TebdilFormModal
        isOpen={vm.modalAcik}
        onClose={() => vm.setModalAcik(false)}
        onSave={vm.kaydet}
        form={vm.form}
        setForm={vm.setForm}
        getFlagSrc={vm.getFlagSrc}
        handleFlagUpload={vm.handleFlagUpload}
        dosyalar={vm.dosyalar}
        yeniDosya={vm.yeniDosya}
        setYeniDosya={vm.setYeniDosya}
        dosyaSec={vm.dosyaSec}
        dosyaEkle={vm.dosyaEkle}
        dosyaSil={vm.dosyaSil}
        dosyaAc={vm.dosyaAc}
      />
    </div>
  )
}
