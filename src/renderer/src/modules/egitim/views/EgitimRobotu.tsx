import { useState } from 'react'
import { CheckCircle, AlertCircle, Bot, ClipboardList, LayoutDashboard, List } from 'lucide-react'
import { useEgitimViewModel } from '../viewmodels/useEgitimViewModel'
import { EgitimSettingsPanel } from '../components/EgitimSettingsPanel'
import { EgitimDraftPanel } from '../components/EgitimDraftPanel'
import { EgitimSavedPanel } from '../components/EgitimSavedPanel'
import { EgitimDeleteModal, EgitimSaveModal } from '../components/EgitimModals'

type TabType = 'robot' | 'draft' | 'saved_plans'

export const EgitimRobotu = () => {
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
          <div className="h-full overflow-hidden p-4">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <EgitimDraftPanel
                taslak={vm.taslak}
                setTaslak={vm.setTaslak}
                onSave={vm.kaydetButonunaBasildi}
              />
            </div>
          </div>
        )
      case 'saved_plans':
        return (
          <div className="h-full overflow-hidden p-4">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <EgitimSavedPanel
                kayitliPlanlar={vm.kayitliPlanlar}
                setSilinecekId={vm.setSilinecekId}
                raporAl={vm.raporAl}
                yukleniyor={vm.yukleniyor}
                planSec={vm.planSec}
              />
            </div>
          </div>
        )

      case 'robot':
      default:
        return (
          <div className="h-full overflow-hidden p-4">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
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
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900 overflow-hidden relative font-sans">
      {/* ÜST TAB BAR */}
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-20">
        {/* LOGO ALANI */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-none">
              Hizmet İçi Eğitim
            </h1>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Otomasyon Modülü
            </span>
          </div>
        </div>

        {/* TABLAR */}
        <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('robot')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold ${
              activeTab === 'robot'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Bot size={16} />
            Eğitim Robotu
          </button>

          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold ${
              activeTab === 'draft'
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <List size={16} />
            Taslak Plan
            {vm.taslak.length > 0 && (
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-full text-[9px]">
                {vm.taslak.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('saved_plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xs font-bold ${
              activeTab === 'saved_plans'
                ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <ClipboardList size={16} />
            İmza Çizelgesi
          </button>
        </div>
      </div>

      {/* BİLDİRİM TOAST */}
      {vm.bildirim && (
        <div
          className={`absolute top-20 left-1/2 transform -translate-x-1/2 z-[70] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 transition-all duration-300 animate-in slide-in-from-top-4 fade-in ${
            vm.bildirim.tur === 'basari'
              ? 'bg-green-600 text-white shadow-green-200'
              : 'bg-red-600 text-white shadow-red-200'
          }`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span className="font-bold text-xs">{vm.bildirim.mesaj}</span>
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
