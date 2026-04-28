import { ReactElement } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { useTakvimViewModel } from '../viewmodels/useTakvimViewModel'
import { TakvimHeader } from '../components/TakvimHeader'
import { TakvimGrid } from '../components/TakvimGrid'
import { TakvimSidebar } from '../components/TakvimSidebar'
import { TakvimDetailModal } from '../components/TakvimDetailModal'

export const Takvim = (): ReactElement => {
  const vm = useTakvimViewModel()

  return (
    <div className="relative p-4 lg:p-6 h-full bg-slate-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      {/* AMBIENT LIGHTING */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none animate-pulse [animation-delay:3s]"></div>

      <div className="max-w-[1800px] mx-auto relative z-10 h-full flex flex-col">
        {vm.bildirim && (
          <div
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-[1.8rem] shadow-2xl backdrop-blur-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 ${
              vm.bildirim.tur === 'basari' 
                ? 'bg-green-500/90 border-green-400/50 text-white' 
                : 'bg-red-500/90 border-red-400/50 text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
              {vm.bildirim.tur === 'basari' ? (
                <CheckCircle size={22} strokeWidth={2.5} />
              ) : (
                <AlertCircle size={22} strokeWidth={2.5} />
              )}
            </div>
            <span className="font-black text-sm uppercase tracking-widest">
              {vm.bildirim.mesaj}
            </span>
          </div>
        )}

        {/* ÜST BAŞLIK - Modern Header */}
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
        <div className="flex flex-1 overflow-hidden gap-4 mt-4">
          {/* SOL: TAKVİM IZGARASI - Primary Content Area */}
          <div className="flex-1 min-w-0">
            <TakvimGrid
              yil={vm.yil}
              ay={vm.ay}
              gunSayisi={vm.gunSayisi}
              baslangicBosluk={vm.baslangicBosluk}
              dbEtkinlikler={vm.dbEtkinlikler}
              resmiTatiller={vm.resmiTatiller}
              onDayClick={vm.gunTikla}
              onDelete={vm.sil}
            />
          </div>

          {/* SAĞ: YAKLAŞAN ETKİNLİKLER - Side Information */}
          <TakvimSidebar
            yaklasanlar={vm.yaklasanlar}
            onItemClick={(tarih) => vm.gunTikla(parseInt(tarih.split('-')[2]))}
            onDelete={vm.sil}
          />
        </div>
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
