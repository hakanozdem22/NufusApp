import { useState, useMemo } from 'react'
import { Folder, Trash2, Plus, Save, X, RefreshCw, Library } from 'lucide-react'
import { useArsivSettings } from '../viewmodels/useArsivSettings'

import { DeleteConfirmModal } from '../components/DeleteConfirmModal'

export const ArsivSettings = () => {
  const vm = useArsivSettings()

  const [activeTab, setActiveTab] = useState<'klasor' | 'dusunce' | 'komisyon'>('klasor')

  // Form States
  const [yeniKlasor, setYeniKlasor] = useState({ ad: '', sure: 'C', kod: '' })
  const [yeniDusunce, setYeniDusunce] = useState('')
  const [yeniKomisyon, setYeniKomisyon] = useState({ ad: '', unvan: '' })
  const [duzenleId, setDuzenleId] = useState<string | number | null>(null)
  const [duzenleKlasor, setDuzenleKlasor] = useState({ ad: '', sure: '', kod: '' })

  // Delete Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: 'klasor' | 'dusunce' | 'komisyon'
    id: string | number | null
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'klasor',
    id: null,
    title: '',
    message: ''
  })

  // Pagination for Folders
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredKlasorler = useMemo(() => {
    return vm.arsivKlasorleri || []
  }, [vm.arsivKlasorleri])

  const totalPages = Math.ceil(filteredKlasorler.length / itemsPerPage)
  const currentKlasorler = filteredKlasorler.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAddKlasor = () => {
    if (!yeniKlasor.ad) return
    vm.klasorEkle(yeniKlasor.ad, yeniKlasor.sure, yeniKlasor.kod)
    setYeniKlasor({ ad: '', sure: 'C', kod: '' })
  }

  const handleUpdateKlasor = (id: string | number) => {
    if (!duzenleKlasor.ad) return
    vm.klasorGuncelle(id, duzenleKlasor.ad, duzenleKlasor.sure, duzenleKlasor.kod)
    setDuzenleId(null)
  }

  /* DÜŞÜNCE */
  const handleAddDusunce = () => {
    if (!yeniDusunce) return
    vm.dusunceEkle(yeniDusunce)
    setYeniDusunce('')
  }

  /* İMHA KOMİSYONU */
  const handleAddKomisyon = () => {
    if (!yeniKomisyon.ad) return
    vm.imhaKomisyonuEkle(yeniKomisyon.ad, yeniKomisyon.unvan, 'UYE')
    setYeniKomisyon({ ad: '', unvan: '' })
  }

  const openDeleteModal = (
    type: 'klasor' | 'dusunce' | 'komisyon',
    id: string | number,
    message: string
  ) => {
    setConfirmModal({
      isOpen: true,
      type,
      id,
      title: 'Silme Onayı',
      message
    })
  }

  const handleConfirmDelete = () => {
    if (!confirmModal.id) return

    if (confirmModal.type === 'klasor') {
      vm.klasorSil(confirmModal.id)
    } else if (confirmModal.type === 'dusunce') {
      vm.dusunceSil(confirmModal.id as string)
    } else if (confirmModal.type === 'komisyon') {
      vm.imhaKomisyonuSil(confirmModal.id as number)
    }
    setConfirmModal({ ...confirmModal, isOpen: false })
  }

  /* RENDER HELPERS */
  const renderKlasorTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Ekleme Formu */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-blue-500" />
          Yeni Klasör Tanımı Ekle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Klasör Adı (Örn: Personel Özlük)"
            value={yeniKlasor.ad}
            onChange={(e) => setYeniKlasor({ ...yeniKlasor, ad: e.target.value })}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="text"
            placeholder="Dosyalama Kodu (Örn: 900)"
            value={yeniKlasor.kod}
            onChange={(e) => setYeniKlasor({ ...yeniKlasor, kod: e.target.value })}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <select
            value={yeniKlasor.sure}
            onChange={(e) => setYeniKlasor({ ...yeniKlasor, sure: e.target.value })}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="A">Süresiz (A)</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="10">10 Yıl</option>
            <option value="15">15 Yıl</option>
            <option value="20">20 Yıl</option>
            <option value="50">50 Yıl</option>
            <option value="100">100 Yıl</option>
          </select>
          <button
            onClick={handleAddKlasor}
            disabled={!yeniKlasor.ad}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Kaydet
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 font-medium">Klasör Adı</th>
                <th className="px-6 py-3 font-medium">Dosyalama Kodu</th>
                <th className="px-6 py-3 font-medium">Saklama Süresi</th>
                <th className="px-6 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {currentKlasorler.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  {duzenleId === item.id ? (
                    <>
                      <td className="px-6 py-3">
                        <input
                          value={duzenleKlasor.ad}
                          onChange={(e) =>
                            setDuzenleKlasor({ ...duzenleKlasor, ad: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          value={duzenleKlasor.kod}
                          onChange={(e) =>
                            setDuzenleKlasor({ ...duzenleKlasor, kod: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          value={duzenleKlasor.sure}
                          onChange={(e) =>
                            setDuzenleKlasor({ ...duzenleKlasor, sure: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateKlasor(item.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setDuzenleId(null)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {item.ad}
                      </td>
                      <td className="px-6 py-3 text-gray-500">{item.dosyalama_kodu || '-'}</td>
                      <td className="px-6 py-3 text-gray-500">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.saklama_suresi === 'A'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : item.saklama_suresi === 'C'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {item.saklama_suresi}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setDuzenleId(item.id)
                              setDuzenleKlasor({
                                ad: item.ad,
                                sure: item.saklama_suresi,
                                kod: item.dosyalama_kodu
                              })
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Folder size={16} />
                          </button>
                          <button
                            onClick={() => {
                              openDeleteModal(
                                'klasor',
                                item.id,
                                `"${item.ad}" klasör tanımını silmek istediğinize emin misiniz?`
                              )
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {currentKlasorler.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Henüz bir klasör tanımı eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Toplam {filteredKlasorler.length} kayıt, sayfa {currentPage} / {totalPages}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                    currentPage === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderDusunceTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-green-500" />
          Yeni Düşünce Ekle
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Düşünce Açıklaması (Örn: Gereği Düşünüldü)"
            value={yeniDusunce}
            onChange={(e) => setYeniDusunce(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <button
            onClick={handleAddDusunce}
            disabled={!yeniDusunce}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            Kaydet
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 font-medium">Düşünce / Açıklama</th>
              <th className="px-6 py-3 font-medium text-right w-24">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {vm.arsivDusunceler?.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {item.aciklama}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => {
                      openDeleteModal(
                        'dusunce',
                        item.id,
                        'Bu düşünce tanımını silmek istediğinize emin misiniz?'
                      )
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {(!vm.arsivDusunceler || vm.arsivDusunceler.length === 0) && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Henüz bir düşünce tanımı eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderKomisyonTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-purple-500" />
          Yeni Komisyon Üyesi Ekle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={yeniKomisyon.ad}
            onChange={(e) => setYeniKomisyon({ ...yeniKomisyon, ad: e.target.value })}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <input
            type="text"
            placeholder="Ünvan"
            value={yeniKomisyon.unvan}
            onChange={(e) => setYeniKomisyon({ ...yeniKomisyon, unvan: e.target.value })}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          <button
            onClick={handleAddKomisyon}
            disabled={!yeniKomisyon.ad}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Üye Ekle
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 font-medium">Ad Soyad</th>
              <th className="px-6 py-3 font-medium">Ünvan</th>
              <th className="px-6 py-3 font-medium">Görevi</th>
              <th className="px-6 py-3 font-medium text-right w-24">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {vm.imhaKomisyonu?.map((uye) => (
              <tr
                key={uye.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {uye.ad_soyad}
                </td>
                <td className="px-6 py-3 text-gray-500">{uye.unvan}</td>
                <td className="px-6 py-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      uye.gorev === 'BASKAN'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                        : uye.gorev === 'UYE1'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          : uye.gorev === 'UYE2'
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {uye.gorev === 'BASKAN'
                      ? 'KOMİSYON BAŞKANI'
                      : uye.gorev === 'UYE1'
                        ? '1. ÜYE'
                        : uye.gorev === 'UYE2'
                          ? '2. ÜYE'
                          : 'ÜYE'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {uye.gorev !== 'BASKAN' && (
                      <button
                        onClick={() => vm.imhaKomisyonuGuncelle(uye.id, 'BASKAN')}
                        className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors"
                        title="Başkan Yap"
                      >
                        <Library size={16} />
                      </button>
                    )}
                    {uye.gorev !== 'UYE1' && (
                      <button
                        onClick={() => vm.imhaKomisyonuGuncelle(uye.id, 'UYE1')}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="1. Üye Yap"
                      >
                        <span className="text-[10px] font-bold">1</span>
                      </button>
                    )}
                    {uye.gorev !== 'UYE2' && (
                      <button
                        onClick={() => vm.imhaKomisyonuGuncelle(uye.id, 'UYE2')}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                        title="2. Üye Yap"
                      >
                        <span className="text-[10px] font-bold">2</span>
                      </button>
                    )}
                    {uye.gorev !== 'UYE' && (
                      <button
                        onClick={() => vm.imhaKomisyonuGuncelle(uye.id, 'UYE')}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                        title="Normal Üye Yap"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        openDeleteModal(
                          'komisyon',
                          uye.id,
                          `"${uye.ad_soyad}" isimli komisyon üyesini silmek istediğinize emin misiniz?`
                        )
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors ml-1"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!vm.imhaKomisyonu || vm.imhaKomisyonu.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Henüz komisyon üyesi eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Library size={24} className="text-blue-600 dark:text-blue-400" />
            Arşiv Yönetimi
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Klasör tanımları, saklama süreleri ve imha komisyonu ayarları
          </p>
        </div>
        <button
          onClick={vm.syncArsivData}
          disabled={vm.yukleniyor}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-lg transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} className={vm.yukleniyor ? 'animate-spin' : ''} />
          {vm.yukleniyor ? 'İşleniyor...' : 'Verilerden Çek'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit dark:bg-gray-800">
        <button
          onClick={() => setActiveTab('klasor')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'klasor'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          Klasör Tanımları
        </button>
        <button
          onClick={() => setActiveTab('dusunce')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'dusunce'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          Düşünceler
        </button>
        <button
          onClick={() => setActiveTab('komisyon')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'komisyon'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          İmha Komisyonu
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'klasor' && renderKlasorTab()}
        {activeTab === 'dusunce' && renderDusunceTab()}
        {activeTab === 'komisyon' && renderKomisyonTab()}
      </div>

      <DeleteConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  )
}
