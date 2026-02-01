import { Trash2, UserPlus, Users, Info, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export const HarcamaSettings = () => {
  const [personeller, setPersoneller] = useState<any[]>([])
  const [yeniAd, setYeniAd] = useState('')
  const [loading, setLoading] = useState(false)
  const [bildirim, setBildirim] = useState<{ tur: 'basari' | 'hata'; mesaj: string } | null>(null)
  const [silinecekId, setSilinecekId] = useState<number | null>(null)

  const mesajGoster = (mesaj: string, tur: 'basari' | 'hata' = 'basari') => {
    setBildirim({ tur, mesaj })
    setTimeout(() => setBildirim(null), 3000)
  }

  const verileriGetir = async () => {
    try {
      const list = await window.api.getHarcamaSabitPersoneller()
      setPersoneller(list)
    } catch (error) {
      console.error(error)
      mesajGoster('Liste yüklenirken hata oluştu', 'hata')
    }
  }

  useEffect(() => {
    verileriGetir()
  }, [])

  const ekle = async () => {
    if (!yeniAd.trim()) return
    setLoading(true)
    try {
      await window.api.addHarcamaSabitPersonel(yeniAd)
      setYeniAd('')
      await verileriGetir()
      mesajGoster('Personel başarıyla eklendi.')
    } catch (error) {
      console.error(error)
      mesajGoster('Ekleme sırasında hata oluştu.', 'hata')
    } finally {
      setLoading(false)
    }
  }

  const silIstegi = (id: number) => {
    setSilinecekId(id)
  }

  const silOnayla = async () => {
    if (!silinecekId) return
    try {
      await window.api.deleteHarcamaSabitPersonel(silinecekId)
      await verileriGetir()
      mesajGoster('Personel silindi.')
    } catch (error) {
      console.error(error)
      mesajGoster('Silme hatası.', 'hata')
    } finally {
      setSilinecekId(null)
    }
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Bildirim */}
      {bildirim && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg flex items-center gap-2 ${bildirim.tur === 'basari' ? 'bg-green-600' : 'bg-red-600'} text-white animate-in slide-in-from-right-4`}
        >
          {bildirim.tur === 'basari' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {bildirim.mesaj}
        </div>
      )}

      {/* Silme Onay Modalı */}
      {silinecekId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Silmek İstediğinize Emin misiniz?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Bu personeli listeden çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSilinecekId(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                >
                  Vazgeç
                </button>
                <button
                  onClick={silOnayla}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header / Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users className="text-indigo-600 dark:text-indigo-400" size={20} />
            Personel Harcama Listesi
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Personel Harcama modülünde her ay otomatik olarak listelenecek personelleri buradan
            yönetebilirsiniz.
          </p>
        </div>
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-300 rounded-lg shrink-0 h-fit">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 dark:text-blue-200 text-sm">Nasıl Çalışır?</h4>
              <p className="text-blue-600 dark:text-blue-300 text-xs mt-1 leading-relaxed">
                Buraya eklediğiniz kişiler, Personel Harcama modülünde "Personel Gelir Durumu"
                listesinde her ay otomatik olarak 0 TL bakiye ile görünür.
              </p>
            </div>
          </div>
        </div>

        {/* Ekleme Formu */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Ad Soyad giriniz..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
              value={yeniAd}
              onChange={(e) => setYeniAd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ekle()}
            />
          </div>
          <button
            onClick={ekle}
            disabled={loading || !yeniAd.trim()}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <UserPlus size={18} />
            Ekle
          </button>
        </div>

        {/* Liste */}
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {personeller.length === 0 ? (
            <div className="p-10 text-center text-gray-400 dark:text-gray-500">
              Henüz kayıtlı personel yok.
            </div>
          ) : (
            personeller.map((p) => (
              <div
                key={p.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-200 ml-2">
                  {p.ad_soyad}
                </span>
                <button
                  onClick={() => silIstegi(p.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Sil"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
