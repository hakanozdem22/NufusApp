import { useState, ReactElement } from 'react'
import { Globe, Search, Plus } from 'lucide-react'
import { TurkTemsilcilikCard } from '../components/TurkTemsilcilikCard'
import { TurkTemsilcilikModal } from '../components/TurkTemsilcilikModal'
import { useTurkTemsilcilikViewModel } from '../viewmodels/useTurkTemsilcilikViewModel'
import { TurkTemsilcilik } from '../models/turk-temsilcilik-types'

export const TurkYurtdisiTemsilcilikleriView = (): ReactElement => {
  const {
    temsilciliklerGrup,
    loading,
    error,
    aramaMetni,
    setAramaMetni,
    getFlagByName,
    imgHatalari,
    setImgHatalari,
    temsilcilikEkle,
    temsilcilikGuncelle,
    temsilcilikSil
  } = useTurkTemsilcilikViewModel()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TurkTemsilcilik | null>(null)

  const handleEdit = (item: TurkTemsilcilik): void => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleModalClose = (): void => {
    setModalOpen(false)
    setTimeout(() => setEditingItem(null), 200)
  }

  const handleAddCityForCountry = (countryName: string, flagCode?: string): void => {
    setEditingItem({
      id: '',
      ulke: countryName,
      bayrak_kodu: flagCode || '',
      tip: 'Başkonsolosluk',
      sehir: '',
      adres: '',
      telefon: '',
      eposta: '',
      web_sitesi: ''
    } as unknown as TurkTemsilcilik)
    setModalOpen(true)
  }

  const handleSave = async (data: any): Promise<void> => {
    if (editingItem && editingItem.id) {
      await temsilcilikGuncelle({ ...data, id: editingItem.id })
    } else {
      await temsilcilikEkle(data)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500 overflow-hidden">
      {/* PREMIUM HEADER - Red Theme for TR */}
      <div className="p-8 shrink-0 w-full max-w-[1700px] mx-auto">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-10 py-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-500/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          
          <div className="flex flex-col xl:flex-row justify-between items-center gap-8 relative">
            {/* SOL: İkon + Başlık */}
            <div className="flex items-center gap-6 self-start xl:self-center shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:rotate-6 transition-transform duration-500">
                <Globe size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight leading-none mb-1.5 uppercase">
                  Türk Temsilcilikleri
                </h1>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic">
                  Yurtdışındaki T.C. diplomatik misyon rehberi
                </p>
              </div>
            </div>

            {/* SAĞ: Arama ve Butonlar */}
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full xl:w-auto">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative group/search w-full sm:w-80">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-red-500 transition-colors"
                    size={18}
                    strokeWidth={2.5}
                  />
                  <input
                    className="pl-14 pr-6 py-4 w-full bg-slate-50 dark:bg-gray-800/80 border-none rounded-lg text-sm font-bold outline-none ring-4 ring-transparent focus:ring-red-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all dark:text-white shadow-inner placeholder-gray-400"
                    placeholder="Ülke ismi ile ara..."
                    value={aramaMetni}
                    onChange={(e) => setAramaMetni(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null)
                    setModalOpen(true)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-lg shadow-red-500/20 transition-all active:scale-90 shrink-0"
                >
                  <Plus size={22} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KARTLARIN EKRANI */}
      <div className="flex-1 overflow-y-auto px-8 pb-12 scrollbar-hide max-w-[1700px] mx-auto w-full">
        {loading && temsilciliklerGrup.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500 font-black uppercase tracking-widest bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30 p-20 gap-4 text-center">
            <AlertCircle size={48} /> {error}
          </div>
        ) : temsilciliklerGrup.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-6 p-20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <Globe className="w-24 h-24 text-gray-200 dark:text-gray-700 stroke-1" />
            <p className="text-sm font-black uppercase tracking-[0.3em] text-center">Temsilcilik kaydı bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {temsilciliklerGrup.map((grup) => (
              <TurkTemsilcilikCard
                key={grup[0].ulke}
                temsilcilikList={grup}
                onEdit={handleEdit}
                onDelete={temsilcilikSil}
                onAddCity={handleAddCityForCountry}
                getFlagByName={getFlagByName}
                imgHatalari={imgHatalari}
                setImgHatalari={setImgHatalari}
              />
            ))}
          </div>
        )}
      </div>

      <TurkTemsilcilikModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        initialData={editingItem}
        onSave={handleSave}
      />
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
