import { CheckCircle, AlertCircle } from 'lucide-react'
import { useTakvimViewModel } from '../viewmodels/useTakvimViewModel'
import { TakvimHeader } from '../components/TakvimHeader'
import { TakvimGrid } from '../components/TakvimGrid'
import { TakvimSidebar } from '../components/TakvimSidebar'
import { TakvimDetailModal } from '../components/TakvimDetailModal'

export const Takvim = () => {
  const vm = useTakvimViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6 relative overflow-hidden font-sans text-gray-800 dark:text-gray-200">
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all ${vm.bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* ÜST BAŞLIK */}
      <TakvimHeader
        ay={vm.ay}
        yil={vm.yil}
        onMonthChange={vm.ayDegistir}
        onYearChange={vm.yilDegistir}
        onPrevMonth={vm.oncekiAy}
        onNextMonth={vm.sonrakiAy}
        onToday={vm.bugunGit}
        onQuickAdd={vm.hizliGorevEkle}
      />

      {/* İÇERİK ALANI (IZGARA + YAKLAŞANLAR) */}
      <div className="flex flex-1 overflow-hidden gap-6">
        {/* SOL: TAKVİM IZGARASI */}
        <TakvimGrid
          yil={vm.yil}
          ay={vm.ay}
          gunSayisi={vm.gunSayisi}
          baslangicBosluk={vm.baslangicBosluk}
          dbEtkinlikler={vm.dbEtkinlikler}
          resmiTatiller={vm.resmiTatiller}
          onDayClick={vm.gunTikla}
        />

        {/* SAĞ: YAKLAŞAN ETKİNLİKLER */}
        <TakvimSidebar
          yaklasanlar={vm.yaklasanlar}
          onItemClick={(tarih) => vm.gunTikla(parseInt(tarih.split('-')[2]))}
          onDelete={vm.sil}
        />
      </div>

      {/* DETAYLI GÜN MODALI */}
      <TakvimDetailModal
        isOpen={vm.modalAcik}
        onClose={() => vm.setModalAcik(false)}
        seciliTarih={vm.seciliTarih}
        aktifGunEtkinlikleri={vm.aktifGunEtkinlikleri}
        onFileOpen={vm.dosyaAc}
        onEdit={vm.duzenle}
        onDelete={vm.sil}
        duzenlemeModu={vm.duzenlemeModu}
        yeniEtkinlik={vm.yeniEtkinlik}
        setYeniEtkinlik={vm.setYeniEtkinlik}
        onFileSelect={vm.dosyaSec}
        onCancelEdit={vm.onCancelEdit}
        onSave={vm.kaydet}
      />
    </div>
  )
}
