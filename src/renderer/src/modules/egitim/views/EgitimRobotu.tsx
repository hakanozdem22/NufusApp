import { useState, ReactElement } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useEgitimViewModel } from '../viewmodels/useEgitimViewModel'
import { EgitimSettingsPanel } from '../components/EgitimSettingsPanel'
import { EgitimDraftPanel } from '../components/EgitimDraftPanel'
import { EgitimSavedPanel } from '../components/EgitimSavedPanel'
import { EgitimDeleteModal, EgitimSaveModal } from '../components/EgitimModals'

type TabType = 'robot' | 'draft' | 'saved_plans'

export const EgitimRobotu = (): ReactElement => {
  const vm = useEgitimViewModel()
  const [activeTab, setActiveTab] = useState<TabType>('robot')

  // Robotu çalıştır ve taslak sekmesine git
  const handleRobotCalistir = () => {
    vm.robotCalistir()
    setActiveTab('draft')
  }

  // Manuel ekle ve taslak sekmesine git (isteğe bağlı)
  const handleManuelEkle = () => {
    vm.manuelEkle()
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'draft':
        return (
          <div className="h-full overflow-hidden p-8">
            <div className="w-full h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
              <EgitimDraftPanel
                taslak={vm.taslak}
                setTaslak={vm.setTaslak}
                onSave={vm.kaydetButonunaBasildi}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
        )
      case 'saved_plans':
        return (
          <div className="h-full overflow-hidden p-8">
            <div className="w-full h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
              <EgitimSavedPanel
                kayitliPlanlar={vm.kayitliPlanlar}
                setSilinecekId={vm.setSilinecekId}
                raporAl={vm.raporAl}
                yukleniyor={vm.yukleniyor}
                planSec={vm.planSec}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                taslakCount={vm.taslak.length}
              />
            </div>
          </div>
        )

      case 'robot':
      default:
        return (
          <div className="h-full overflow-hidden p-8">
            <div className="w-full h-full rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
              <EgitimSettingsPanel
                tarih={vm.tarih}
                setTarih={vm.setTarih}
                seciliEgitici={vm.seciliEgitici}
                setSeciliEgitici={vm.setSeciliEgitici}
                personelListesi={vm.personelListesi}
                duzenleyenler={vm.duzenleyenler}
                seciliDuzenleyen={vm.seciliDuzenleyen}
                setSeciliDuzenleyen={vm.setSeciliDuzenleyen}
                seciliOnaylayan={vm.seciliOnaylayan}
                setSeciliOnaylayan={vm.setSeciliOnaylayan}
                saatHedefi={vm.saatHedefi}
                setSaatHedefi={vm.setSaatHedefi}
                sabahOturum={vm.sabahOturum}
                setSabahOturum={vm.setSabahOturum}
                ogleOturum={vm.ogleOturum}
                setOgleOturum={vm.setOgleOturum}
                zorunluDersler={vm.zorunluDersler}
                zorunluDersToggle={vm.zorunluDersToggle}
                zorunluTumunuSec={vm.zorunluTumunuSec}
                zorunluTumunuTemizle={vm.zorunluTumunuTemizle}
                zorunluDersMenuAcik={vm.zorunluDersMenuAcik}
                setZorunluDersMenuAcik={vm.setZorunluDersMenuAcik}
                konular={vm.konular}
                robotCalistir={handleRobotCalistir}
                manKonu={vm.manKonu}
                setManKonu={vm.setManKonu}
                manSaat={vm.manSaat}
                setManSaat={vm.setManSaat}
                manOturumSecimi={vm.manOturumSecimi}
                setManOturumSecimi={vm.setManOturumSecimi}
                manuelEkle={handleManuelEkle}
                refreshData={vm.refreshData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                taslakCount={vm.taslak.length}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 overflow-hidden relative transition-colors duration-500">
      {/* BİLDİRİM TOAST */}
      {vm.bildirim && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-xl shadow-2xl backdrop-blur-xl border flex items-center gap-4 animate-in slide-in-from-top-8 duration-500 ${
            vm.bildirim.tur === 'basari'
              ? 'bg-emerald-500/90 border-emerald-400/50 text-white'
              : 'bg-rose-500/90 border-rose-400/50 text-white'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
             {vm.bildirim.tur === 'basari' ? <CheckCircle size={22} strokeWidth={2.5} /> : <AlertCircle size={22} strokeWidth={2.5} />}
          </div>
          <span className="font-black text-sm uppercase tracking-widest">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* ANA İÇERİK ALANI */}
      <div className="flex-1 overflow-hidden relative">{renderContent()}</div>

      {/* SİLME ONAY MODALI */}
      <EgitimDeleteModal
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.planSilOnayla}
      />

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
