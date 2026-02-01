import { useState } from 'react'
import { Building2, Plus, Trash2, Search } from 'lucide-react'
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel'

export const KurumSettings = () => {
  const { kurumListesi, kurumEkle, kurumSil, yukleniyor, bildirim } = useSettingsViewModel()

  const [yeniKurum, setYeniKurum] = useState('')
  const [arama, setArama] = useState('')

  const [silinecekId, setSilinecekId] = useState<number | null>(null)

  const handleEkle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!yeniKurum.trim()) return

    await kurumEkle(yeniKurum.trim())
    setYeniKurum('')
  }

  const filteredList = kurumListesi.filter((k) => k.ad.toLowerCase().includes(arama.toLowerCase()))

  const silmeIsleminiBaslat = (id: number) => {
    setSilinecekId(id)
  }

  const silmeIsleminiOnayla = async () => {
    if (silinecekId) {
      await kurumSil(silinecekId)
      setSilinecekId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* SİLME ONAY MODALI */}
      {silinecekId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border dark:border-gray-700 w-80 text-center animate-in fade-in zoom-in duration-200 transition-colors">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">Kurumu Sil?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-6">
              Bu kurumu listeden silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSilinecekId(null)}
                className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={silmeIsleminiOnayla}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Building2 className="text-orange-600 dark:text-orange-500" size={20} />
            Kurum Tanımları
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Posta, Zimmet ve Resmi Yazı modüllerinde kullanılacak kurum isimlerini yönetin.
          </p>
        </div>

        <div className="p-6">
          {/* Ekleme Formu */}
          <form onSubmit={handleEkle} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={yeniKurum}
                onChange={(e) => setYeniKurum(e.target.value)}
                placeholder="Yeni Kurum Adı Giriniz..."
                className="w-full pl-4 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/40 focus:border-orange-400 dark:text-white outline-none transition-all uppercase placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={yukleniyor || !yeniKurum.trim()}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-orange-200 dark:shadow-none"
            >
              <Plus size={20} />
              <span>Ekle</span>
            </button>
          </form>

          {/* Arama ve Liste */}
          <div className="space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={arama}
                onChange={(e) => setArama(e.target.value)}
                placeholder="Listede ara..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white rounded-lg focus:outline-none focus:border-orange-300 dark:focus:border-orange-700 transition-colors"
              />
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-colors">
              <div>
                {filteredList.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {arama ? 'Sonuç bulunamadı.' : 'Henüz kurum eklenmemiş.'}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {filteredList.map((kurum) => (
                      <div
                        key={kurum.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                      >
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {kurum.ad}
                        </span>
                        <button
                          onClick={() => silmeIsleminiBaslat(kurum.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 p-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 flex justify-between transition-colors">
                <span>Toplam {filteredList.length} kayıt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bildirim && (
        <div
          className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-lg text-white animate-in slide-in-from-right duration-300 z-50 flex items-center gap-3 ${bildirim.tur === 'hata' ? 'bg-red-600' : 'bg-green-600'
            }`}
        >
          <span>{bildirim.mesaj}</span>
        </div>
      )}
    </div>
  )
}
