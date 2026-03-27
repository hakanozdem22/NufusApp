import { usePostaZimmetViewModel } from '../viewmodels/usePostaZimmetViewModel'
import { ZimmetArsivListe } from '../components/ZimmetArsivListe'
import { ZimmetDeleteModal } from '../components/ZimmetModals'
import { CheckCircle, AlertCircle, Archive } from 'lucide-react'

export const PostaArsiv = (): React.ReactElement => {
  const vm = usePostaZimmetViewModel()

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 relative overflow-hidden transition-colors duration-500">
      {/* BİLDİRİM */}
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
        isOpen={vm.silinecekId !== null}
        onClose={() => vm.setSilinecekId(null)}
        onConfirm={vm.arsivdenSil}
        isArchive={true}
      />

      {/* HEADER */}
      <div className="px-10 py-8 bg-white/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative overflow-hidden group">
        <div className="absolute -left-12 -top-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shadow-inner">
            <Archive size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              POSTA KAYIT ARŞİVİ
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> GEÇMİŞ ZİMMET KAYITLARI
            </p>
          </div>
        </div>
      </div>

      {/* ANA EKRAN */}
      <div className="flex-1 overflow-hidden p-10 max-w-[1400px] mx-auto w-full">
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
