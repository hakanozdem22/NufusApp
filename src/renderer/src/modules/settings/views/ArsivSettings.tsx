import { useState } from 'react'
import { Plus, Trash2, Folder, Archive, UserCheck, Crown, User } from 'lucide-react'
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel'

export const ArsivSettings = () => {
  const vm = useSettingsViewModel()
  const [yeniKlasor, setYeniKlasor] = useState('')
  const [yeniUye, setYeniUye] = useState<{ ad: string; unvan: string; gorev: 'BASKAN' | 'UYE' }>({
    ad: '',
    unvan: '',
    gorev: 'UYE'
  })

  // Zaten başkan var mı?
  const baskanVar = vm.imhaKomisyonu.some((u) => u.gorev === 'BASKAN')

  const handleEkle = () => {
    if (yeniKlasor.trim()) {
      vm.klasorEkle(yeniKlasor.trim())
      setYeniKlasor('')
    }
  }

  const handleUyeEkle = () => {
    if (yeniUye.ad.trim()) {
      vm.imhaKomisyonuEkle(yeniUye.ad.trim(), yeniUye.unvan.trim(), yeniUye.gorev)
      setYeniUye({ ad: '', unvan: '', gorev: 'UYE' })
    }
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Bildirim */}
      {vm.bildirim && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${vm.bildirim.tur === 'basari' ? 'bg-green-600' : 'bg-red-600'} text-white`}
        >
          {vm.bildirim.mesaj}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Archive className="text-orange-600 dark:text-orange-400" size={20} />
            Arşiv Klasör Tanımları
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Arşiv modülünde kullanılacak varsayılan klasör isimlerini yönetin. Yeni bir kayıt
            eklerken buradaki isimler otomatik önerilecektir.
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Folder
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Yeni klasör adı girin (Örn: GİDEN EVRAK)"
                value={yeniKlasor}
                onChange={(e) => setYeniKlasor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEkle()}
              />
            </div>
            <button
              onClick={handleEkle}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50"
              disabled={!yeniKlasor.trim()}
            >
              <Plus size={18} />
              Ekle
            </button>
          </div>
        </div>

        <div className="p-0">
          {vm.arsivKlasorleri.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 italic">
              <Folder size={48} className="mx-auto mb-3 opacity-20" />
              Henüz klasör tanımı eklenmemiş.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
              {vm.arsivKlasorleri.map((klasor) => (
                <li
                  key={klasor.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                      {klasor.ad.charAt(0).toUpperCase()}
                    </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {klasor.ad}
                    </span>
                  </div>
                  <button
                    onClick={() => vm.klasorSil(klasor.id)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
                    title="Sil"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* İMHA KOMİSYONU */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <UserCheck className="text-blue-600 dark:text-blue-400" size={20} />
            İmha Komisyonu Üyeleri
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Arşiv imha tutanaklarında yer alacak komisyon üyelerini yönetin. En fazla 1 Başkan
            seçebilirsiniz.
          </p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 space-y-4">
          {/* Görev Seçimi */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Görevi:</label>
            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-1">
              <button
                onClick={() => !baskanVar && setYeniUye({ ...yeniUye, gorev: 'BASKAN' })}
                disabled={baskanVar}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                  yeniUye.gorev === 'BASKAN'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${baskanVar ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Crown size={14} />
                Başkan
              </button>
              <button
                onClick={() => setYeniUye({ ...yeniUye, gorev: 'UYE' })}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${
                  yeniUye.gorev === 'UYE'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <User size={14} />
                Üye
              </button>
            </div>
            {baskanVar && (
              <span className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                Komisyon Başkanı zaten mevcut.
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Ad Soyad"
                value={yeniUye.ad}
                onChange={(e) => setYeniUye({ ...yeniUye, ad: e.target.value })}
              />
            </div>
            <div className="w-1/2">
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Unvan (Örn: Şube Müdürü, Memur vb.)"
                value={yeniUye.unvan}
                onChange={(e) => setYeniUye({ ...yeniUye, unvan: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleUyeEkle()}
              />
            </div>
            <button
              onClick={handleUyeEkle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50"
              disabled={!yeniUye.ad.trim()}
            >
              <Plus size={18} />
              Ekle
            </button>
          </div>
        </div>

        <div className="p-0">
          {vm.imhaKomisyonu.length === 0 ? (
            <div className="p-8 text-center text-gray-400 dark:text-gray-500 italic">
              <UserCheck size={48} className="mx-auto mb-3 opacity-20" />
              Henüz komisyon üyesi eklenmemiş.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
              {vm.imhaKomisyonu
                .sort((a, _b) => (a.gorev === 'BASKAN' ? -1 : 1)) // Başkanı en üste al
                .map((uye) => (
                  <li
                    key={uye.id}
                    className={`flex items-center justify-between p-4 transition group ${
                      uye.gorev === 'BASKAN'
                        ? 'bg-blue-50/50 dark:bg-blue-900/10'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            uye.gorev === 'BASKAN'
                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {uye.ad_soyad.charAt(0).toUpperCase()}
                        </span>
                        {uye.gorev === 'BASKAN' && (
                          <div className="absolute -top-1 -right-1 bg-yellow-400 text-white p-0.5 rounded-full shadow-sm">
                            <Crown size={10} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800 dark:text-gray-100">
                            {uye.ad_soyad}
                          </p>
                          {uye.gorev === 'BASKAN' && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded">
                              Başkan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{uye.unvan}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => vm.imhaKomisyonuSil(uye.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
