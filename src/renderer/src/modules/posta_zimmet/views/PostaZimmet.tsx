import { CheckCircle, AlertCircle } from 'lucide-react'
import { usePostaZimmetViewModel } from '../viewmodels/usePostaZimmetViewModel'
import { ZimmetGirisForm } from '../components/ZimmetGirisForm'
import { ZimmetYazdirListe } from '../components/ZimmetYazdirListe'
import { ZimmetArsivListe } from '../components/ZimmetArsivListe'
import { ZimmetDeleteModal, ZimmetSaveModal } from '../components/ZimmetModals'

export const PostaZimmet = () => {
  const vm = usePostaZimmetViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900 relative overflow-hidden">
      {/* BİLDİRİM */}
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${vm.bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{vm.bildirim.mesaj}</span>
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
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* SOL: GİRİŞ ve LİSTE */}
        <div className="w-[35%] flex flex-col gap-4">
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

          <ZimmetYazdirListe
            liste={vm.liste}
            toplamTutar={vm.toplamTutar}
            yukleniyor={vm.yukleniyor}
            onDeleteTemp={vm.setListedenSilinecekTempId}
            onSave={vm.kaydetButonunaBasildi}
          />
        </div>

        {/* SAĞ: ARŞİV */}
        <ZimmetArsivListe
          arsivListe={vm.arsivListe}
          arama={vm.arama}
          setArama={vm.setArama}
          onSearch={vm.arsivGetir}
          onDelete={vm.setSilinecekId}
          onToggleStatus={vm.durumDegistir}
        />
      </div>
    </div>
  )
}
