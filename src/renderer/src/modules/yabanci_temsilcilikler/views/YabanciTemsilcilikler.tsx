import { useState } from 'react'
import { Globe, Search, Plus, Trash2, Download, Loader2 } from 'lucide-react'
import { TemsilcilikCard } from '../components/TemsilcilikCard'
import { TemsilcilikModal } from '../components/TemsilcilikModal'
import { useTemsilcilikViewModel } from '../viewmodels/useTemsilcilikViewModel'
import { Temsilcilik } from '../models/temsilcilik-types'

export function YabanciTemsilciliklerView() {
  const {
    temsilciliklerGrup,
    temsilcilikler,
    loading,
    error,
    aramaMetni,
    setAramaMetni,
    secilenSehir,
    setSecilenSehir,
    mevcutSehirler,
    getFlagByName,
    imgHatalari,
    setImgHatalari,
    temsilcilikEkle,
    temsilcilikGuncelle,
    temsilcilikSil,
    varsayilanlariYukle
  } = useTemsilcilikViewModel()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Temsilcilik | null>(null)

  const handleEdit = (item: Temsilcilik) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setTimeout(() => setEditingItem(null), 200)
  }

  const handleAddCityForCountry = (countryName: string, flagCode?: string) => {
    setEditingItem({
      id: '',
      ulke: countryName,
      bayrak_kodu: flagCode || '',
      tip: 'Konsolosluk',
      sehir: '',
      adres: '',
      telefon: '',
      eposta: '',
      web_sitesi: ''
    } as unknown as Temsilcilik)
    setModalOpen(true)
  }

  const handleSave = async (data: any) => {
    if (editingItem && editingItem.id) {
      await temsilcilikGuncelle({ ...data, id: editingItem.id })
    } else {
      await temsilcilikEkle(data)
    }
  }

  const onClear = async () => {
    const onay = confirm(`Tüm kayıtlar (${temsilcilikler.length} adet) silinecek. Emin misiniz?`)
    if (!onay) return
    for (const ulke of temsilcilikler) {
      await temsilcilikSil(ulke.id)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6 relative">
      {/* HEADER GİBİ ÜST BAR (Tebdil'e Benzer) */}
      <div className="mb-6 shrink-0 w-full">
        <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* SOL: İkon + Başlık */}
            <div className="flex items-center gap-4 self-start lg:self-center shrink-0">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
                <Globe size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                  Yabancı Temsilcilikler
                </h1>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Türkiye'deki büyükelçilik ve konsoloslukların iletişim rehberi
                </p>
              </div>
            </div>

            {/* SAĞ: Arama ve Butonlar */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {/* Filtre / Tip (Tebdil Row 1) */}
              <div className="flex p-1 bg-gray-100/80 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50 w-full sm:min-w-[300px] overflow-x-auto custom-scrollbar">
                <button
                  onClick={() => setSecilenSehir('')}
                  className={`flex-1 h-6 flex items-center justify-center rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap px-2 ${
                    secilenSehir === ''
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Tüm Şehirler
                </button>
                {mevcutSehirler.map((sehir) => (
                  <button
                    key={sehir}
                    onClick={() => setSecilenSehir(sehir)}
                    className={`flex-1 h-6 flex items-center justify-center rounded-md text-xs font-semibold transition-all duration-200 whitespace-nowrap px-2 ${
                      secilenSehir === sehir
                        ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {sehir}
                  </button>
                ))}
              </div>

              {/* Arama + Butonlar (Tebdil Row 2) */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative w-full sm:w-[180px] group shrink-0">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                    size={15}
                  />
                  <input
                    className="pl-8 pr-3 h-8 w-full border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-gray-50 dark:bg-gray-700/50 dark:text-white transition-all"
                    placeholder="Ülke ara..."
                    value={aramaMetni}
                    onChange={(e) => setAramaMetni(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                  <button
                    onClick={varsayilanlariYukle}
                    disabled={loading}
                    className="h-8 px-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span className="whitespace-nowrap">Eksikleri Seç</span>
                  </button>

                  <button
                    onClick={onClear}
                    className="h-8 px-3 rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                  >
                    <Trash2 size={14} />
                    <span className="whitespace-nowrap">Temizle</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setModalOpen(true)
                    }}
                    className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex-1 sm:flex-none"
                  >
                    <Plus size={14} />
                    <span className="whitespace-nowrap">Yeni Ekle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KARTLARIN EKRANI */}
      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
        {loading && temsilciliklerGrup.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 font-medium">
            {error}
          </div>
        ) : temsilciliklerGrup.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3 p-10 bg-white/50 dark:bg-gray-800/10 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <Globe className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            <p className="font-medium text-gray-500 text-center">
              Temsilcilik kaydı bulunamadı.
              <br />
              <button
                onClick={varsayilanlariYukle}
                className="mt-2 text-indigo-600 hover:underline"
              >
                Gerekli ülkeleri otomatik yüklemek için tıklayın.
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {temsilciliklerGrup.map((grup) => (
              <TemsilcilikCard
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

      <TemsilcilikModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        initialData={editingItem}
        onSave={handleSave}
      />
    </div>
  )
}
