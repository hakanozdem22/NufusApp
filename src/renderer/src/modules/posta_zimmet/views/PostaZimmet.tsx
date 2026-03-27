import { CheckCircle, AlertCircle } from 'lucide-react'
import { usePostaZimmetViewModel } from '../viewmodels/usePostaZimmetViewModel'
import { ZimmetGirisForm } from '../components/ZimmetGirisForm'
import { ZimmetYazdirListe } from '../components/ZimmetYazdirListe'
import { ZimmetDeleteModal, ZimmetSaveModal } from '../components/ZimmetModals'

export const PostaZimmet = (): React.ReactElement => {
  const vm = usePostaZimmetViewModel()

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 relative overflow-hidden transition-colors duration-500">
      {/* BİLDİRİM - Premium Floating Toast */}
      {vm.bildirim && (
        <div
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-[1.8rem] shadow-2xl backdrop-blur-xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 ${
            vm.bildirim.tur === 'basari' 
              ? 'bg-green-500/90 border-green-400/50 text-white' 
              : 'bg-red-500/90 border-red-400/50 text-white'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            {vm.bildirim.tur === 'basari' ? <CheckCircle size={22} strokeWidth={2.5} /> : <AlertCircle size={22} strokeWidth={2.5} />}
          </div>
          <span className="font-black text-sm uppercase tracking-widest">{vm.bildirim.mesaj}</span>
        </div>
      )}

      {/* MODALLAR */}
      <ZimmetDeleteModal
        isOpen={vm.silinecekId !== null || vm.listedenSilinecekTempId !== null}
        onClose={() => {
          vm.setSilinecekId(null)
          vm.setListedenSilinecekTempId(null)
        }}
        onConfirm={() => (vm.silinecekId ? vm.arsivdenSil() : vm.geciciListedenCikar())}
        isArchive={vm.silinecekId !== null}
      />

      <ZimmetSaveModal
        isOpen={vm.kayitOnayModalAcik}
        onClose={() => vm.setKayitOnayModalAcik(false)}
        onConfirm={vm.kaydetVeYazdir}
        itemCount={vm.liste.length}
      />

      {/* ANA EKRAN */}
      <div className="flex-1 overflow-hidden p-8 flex max-w-[1700px] mx-auto w-full gap-8">
        {/* SOL: GİRİŞ FORMU */}
        <div className="w-[35%] flex flex-col h-full">
          <ZimmetGirisForm
            evrakNo={vm.evrakNo}
            setEvrakNo={vm.setEvrakNo}
            barkod={vm.barkod}
            setBarkod={vm.setBarkod}
            yer={vm.yer}
            setYer={vm.setYer}
            ucret={vm.ucret}
            setUcret={vm.setUcret}
            onAdd={vm.listeyeEkle}
            kurumListesi={vm.kurumListesi}
          />
        </div>

        {/* SAĞ: GÜNCEL LİSTE */}
        <div className="flex-1 min-h-0 h-full flex flex-col">
          <ZimmetYazdirListe
            liste={vm.liste}
            toplamTutar={vm.toplamTutar}
            yukleniyor={vm.yukleniyor}
            onDeleteTemp={vm.setListedenSilinecekTempId}
            onSave={vm.kaydetButonunaBasildi}
          />
        </div>
      </div>
    </div>
  )
}
