import { ReactElement } from 'react'
import { CheckCircle, AlertCircle, Archive, BarChart3, Clock, Layers } from 'lucide-react'
import { useArsivViewModel } from '../viewmodels/useArsivViewModel'
import { ArsivHeader } from '../components/ArsivHeader'
import { ArsivToolbar } from '../components/ArsivToolbar'
import { ArsivTable } from '../components/ArsivTable'
import { ArsivDeleteModal, ArsivBulkDeleteModal } from '../components/ArsivModals'
import { ArsivFormModal } from '../components/ArsivFormModal'
import { ArsivBulkUpdateModal } from '../components/ArsivBulkUpdateModal'
import { ArsivReportModal } from '../components/ArsivReportModal'
import { ArsivExcelImportModal } from '../components/ArsivExcelImportModal'

export const Arsiv = (): ReactElement => {
  const vm = useArsivViewModel()

  // --- ÖZET HESAPLAMALAR ---
  const buYil = new Date().getFullYear()
  const stats = {
    toplam: vm.liste.length,
    imhaGelen: vm.liste.filter((item) => {
      const yil = parseInt(String(item.yili || '0'))
      const sure = parseInt(String(item.saklama_suresi || '0'))
      return yil + sure < buYil
    }).length,
    toplamEvrak: vm.liste.reduce((sum, item) => sum + (item.evrak_sayisi || 0), 0),
    benzersizKlasor: new Set(vm.liste.map((item) => item.klasor_adi)).size
  }

  return (
    <div className="relative p-4 lg:p-6 h-full bg-slate-50 dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      {/* AMBIENT LIGHTING */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:4s]"></div>

      <div className="max-w-[1600px] mx-auto relative z-10 h-full flex flex-col gap-4">
        {vm.bildirim && (
          <div
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-[1.8rem] shadow-2xl backdrop-blur-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 ${
              vm.bildirim.tur === 'basari' 
                ? 'bg-green-500/90 border-green-400/50 text-white' 
                : 'bg-red-500/90 border-red-400/50 text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              {vm.bildirim.tur === 'basari' ? (
                <CheckCircle size={22} strokeWidth={2.5} />
              ) : (
                <AlertCircle size={22} strokeWidth={2.5} />
              )}
            </div>
            <span className="font-black text-sm uppercase tracking-widest block">
              {vm.bildirim.mesaj}
            </span>
          </div>
        )}

        {/* MODALLAR (unmodified) */}
        {vm.importModal && (
          <ArsivExcelImportModal
            onClose={() => vm.setImportModal(false)}
            onImport={async (data) => {
              await vm.importFromExcel(data)
              vm.setImportModal(false)
            }}
          />
        )}

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

        {/* DASHBOARD KARTLARI - Premium Modern Styling (Horizontal) - Compact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'TOPLAM KAYIT', val: stats.toplam, desc: 'Aktif Arşiv Verisi', color: 'blue', icon: Layers },
            { label: 'İMHASI GELEN', val: stats.imhaGelen, desc: 'Süresi Dolanlar', color: 'red', icon: Clock },
            { label: 'TOPLAM EVRAK', val: stats.toplamEvrak.toLocaleString(), desc: 'İçerik Sayısı', color: 'emerald', icon: BarChart3 },
            { label: 'BENZERSİZ KLASÖR', val: stats.benzersizKlasor, desc: 'Fiziksel Birimler', color: 'indigo', icon: Archive }
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl p-3 rounded-xl border border-white/20 dark:border-gray-800 shadow-sm flex items-center gap-3 group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:scale-[1.02] active:scale-95 ring-1 ring-transparent hover:ring-blue-500/30 overflow-hidden"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110
                ${card.color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
                ${card.color === 'red' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : ''}
                ${card.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                ${card.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : ''}
              `}>
                <card.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-1 opacity-70">
                  {card.label}
                </p>
                <h3 className="text-lg font-black text-gray-800 dark:text-white leading-none tracking-tight">
                  {card.val}
                </h3>
              </div>
            </div>
          ))}
        </div>

          <ArsivToolbar
            onAdd={vm.yeniKayit}
            selectedCount={vm.secilenler.length}
            onBulkUpdate={() => vm.setTopluGuncelleModal(true)}
            onBulkDelete={() => vm.setTopluSilmeModal(true)}
            onReport={() => vm.setYazdirModal(true)}
            onImport={() => vm.setImportModal(true)}
          />

          <div className="min-h-0 flex-1 relative mb-4">
            <ArsivTable
              liste={vm.liste}
              secilenler={vm.secilenler}
              onSelectAll={vm.tumunuSec}
              onSelectOne={vm.tekSec}
              onSelectSameName={vm.ayniIsmiSec}
              onEdit={vm.duzenle}
              onDelete={vm.setSilinecekId}
            />
          </div>
        </div>

        <ArsivBulkUpdateModal
          isOpen={vm.topluGuncelleModal}
          onClose={() => vm.setTopluGuncelleModal(false)}
          onConfirm={vm.topluGuncelle}
          count={vm.secilenler.length}
          klasorTanimlari={vm.klasorTanimlari}
          form={vm.topluUpdateForm}
          setForm={vm.setTopluUpdateForm}
          arsivDusunceler={vm.arsivDusunceler}
        />

        <ArsivFormModal
          isOpen={vm.kayitModal}
          onClose={() => vm.setKayitModal(false)}
          onSave={vm.kaydet}
          form={vm.form}
          setForm={vm.setForm}
          klasorTanimlari={vm.klasorTanimlari}
          arsivDusunceler={vm.arsivDusunceler}
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
