import { CheckCircle, AlertCircle } from 'lucide-react'
import { useEgitimViewModel } from '../viewmodels/useEgitimViewModel'
import { EgitimSettingsPanel } from '../components/EgitimSettingsPanel'
import { EgitimDraftPanel } from '../components/EgitimDraftPanel'
import { EgitimSavedPanel } from '../components/EgitimSavedPanel'
import { EgitimDeleteModal, EgitimSaveModal } from '../components/EgitimModals'

export const EgitimRobotu = () => {
  const vm = useEgitimViewModel()

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      {/* BİLDİRİM ÇUBUĞU */}
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${vm.bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* SİLME ONAY MODALI */}
      <EgitimDeleteModal
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.planSilOnayla}
      />

      {/* SOL PANEL */}
      <EgitimSettingsPanel
        tarih={vm.tarih}
        setTarih={vm.setTarih}
        seciliEgitici={vm.seciliEgitici}
        setSeciliEgitici={vm.setSeciliEgitici}
        personelListesi={vm.personelListesi}
        saatHedefi={vm.saatHedefi}
        setSaatHedefi={vm.setSaatHedefi}
        sabahOturum={vm.sabahOturum}
        setSabahOturum={vm.setSabahOturum}
        ogleOturum={vm.ogleOturum}
        setOgleOturum={vm.setOgleOturum}
        zorunluDersler={vm.zorunluDersler}
        zorunluDersToggle={vm.zorunluDersToggle}
        zorunluDersMenuAcik={vm.zorunluDersMenuAcik}
        setZorunluDersMenuAcik={vm.setZorunluDersMenuAcik}
        konular={vm.konular}
        robotCalistir={vm.robotCalistir}
        manKonu={vm.manKonu}
        setManKonu={vm.setManKonu}
        manSaat={vm.manSaat}
        setManSaat={vm.setManSaat}
        manOturumSecimi={vm.manOturumSecimi}
        setManOturumSecimi={vm.setManOturumSecimi}
        manuelEkle={vm.manuelEkle}
        refreshData={vm.refreshData}
      />

      {/* SAĞ PANEL */}
      <div className="flex-1 flex overflow-hidden">
        {/* SOL YARI: TASLAK */}
        <EgitimDraftPanel
          taslak={vm.taslak}
          setTaslak={vm.setTaslak}
          onSave={vm.kaydetButonunaBasildi}
        />

        {/* SAĞ YARI: KAYITLI PLANLAR */}
        <EgitimSavedPanel
          kayitliPlanlar={vm.kayitliPlanlar}
          setSilinecekId={vm.setSilinecekId}
          raporAl={vm.raporAl}
          yukleniyor={vm.yukleniyor}
        />
      </div>

      {/* KAYIT MODALI */}
      <EgitimSaveModal
        isOpen={vm.kayitModalAcik}
        onClose={() => vm.setKayitModalAcik(false)}
        onConfirm={vm.gercekKayıtIslemi}
        planAdiInput={vm.planAdiInput}
        setPlanAdiInput={vm.setPlanAdiInput}
      />
    </div>
  )
}
