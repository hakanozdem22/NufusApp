import { useEffect, useState, FormEvent, ReactElement } from 'react'
import { EnvanterMalzeme, EnvanterKategori, EnvanterYer, EnvanterPersonelTanim } from '../types'
import {
  Plus,
  Search,
  FileText,
  Settings as ConfigIcon,
  Edit,
  Trash,
  X,
  Database,
  Filter,
  CheckCircle2,
  AlertCircle,
  Archive,
  Save,
  Package
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Toast, ToastType } from '../../../shared/components/Toast'
import { EnvanterImportModal } from '../components/EnvanterImportModal'

export const EnvanterDashboard = (): ReactElement => {
  const navigate = useNavigate()
  const [items, setItems] = useState<EnvanterMalzeme[]>([])
  const [filteredItems, setFilteredItems] = useState<EnvanterMalzeme[]>([])
  const [loading, setLoading] = useState(false)

  // Toast State
  const [toastState, setToastState] = useState<{ show: boolean; message: string; type: ToastType }>(
    {
      show: false,
      message: '',
      type: 'success'
    }
  )

  const showToast = (message: string, type: ToastType): void => {
    setToastState({ show: true, message, type })
  }

  // Filters
  const [searchText, setSearchText] = useState('')
  const [kategoriFilter, setKategoriFilter] = useState('Tümü')
  const [yerFilter, setYerFilter] = useState('Tümü')
  const [durumFilter, setDurumFilter] = useState('Tümü')

  // Definitions for filters
  const [kategoriler, setKategoriler] = useState<EnvanterKategori[]>([])
  const [yerler, setYerler] = useState<EnvanterYer[]>([])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EnvanterMalzeme | null>(null)
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<EnvanterMalzeme>>({
    ad: '',
    marka: '',
    kategori: '',
    adet: 1,
    konum: '',
    personel: '',
    durum: 'Sağlam'
  })

  // Definition Lists for Form (Auto-complete / Select)
  const [personeller, setPersoneller] = useState<EnvanterPersonelTanim[]>([])

  const fetchData = async (): Promise<void> => {
    setLoading(true)
    try {
      if (window.api) {
        const data = await window.api.getEnvanterMalzemeler({})
        setItems(data)
        setFilteredItems(data)

        const cats = await window.api.getEnvanterKategoriler()
        setKategoriler(cats)
        const locs = await window.api.getEnvanterYerler()
        setYerler(locs)
        const pers = await window.api.getEnvanterPersonelTanimlari()
        setPersoneller(pers)
      }
    } catch (e) {
      console.error(e)
      showToast('Veriler yüklenirken hata oluştu.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let res = items
    if (searchText) {
      const lower = searchText.toLowerCase()
      res = res.filter(
        (i) =>
          i.ad.toLowerCase().includes(lower) ||
          i.marka.toLowerCase().includes(lower) ||
          i.seri_no?.toLowerCase().includes(lower)
      )
    }
    if (kategoriFilter !== 'Tümü') res = res.filter((i) => i.kategori === kategoriFilter)
    if (yerFilter !== 'Tümü') res = res.filter((i) => i.konum === yerFilter)
    if (durumFilter !== 'Tümü') res = res.filter((i) => i.durum === durumFilter)
    setFilteredItems(res)
  }, [items, searchText, kategoriFilter, yerFilter, durumFilter])

  const handleDeleteClick = (id: string): void => {
    setDeleteConfirmationId(id)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteConfirmationId) return
    try {
      await window.api.deleteEnvanterMalzeme(deleteConfirmationId)
      showToast('Kayıt başarıyla silindi.', 'success')
      fetchData()
    } catch (e) {
      console.error(e)
      showToast('Silme işlemi başarısız.', 'error')
    } finally {
      setDeleteConfirmationId(null)
    }
  }

  const handleEdit = (item: EnvanterMalzeme): void => {
    setEditingItem(item)
    setFormData(item)
    setIsModalOpen(true)
  }

  const handleAddNew = (): void => {
    setEditingItem(null)
    setFormData({
      ad: '',
      marka: '',
      kategori: '',
      adet: 1,
      konum: '',
      personel: '',
      durum: 'Sağlam',
      tarih: new Date().toISOString().split('T')[0]
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      if (editingItem && editingItem.id) {
        await window.api.updateEnvanterMalzeme({ ...formData, id: editingItem.id } as EnvanterMalzeme)
        showToast('Kayıt güncellendi.', 'success')
      } else {
        await window.api.addEnvanterMalzeme(formData)
        showToast('Yeni kayıt eklendi.', 'success')
      }
      setIsModalOpen(false)
      fetchData()
    } catch (e) {
      console.error(e)
      showToast('İşlem sırasında hata oluştu.', 'error')
    }
  }

  const handlePrint = async (summary: boolean): Promise<void> => {
    try {
      showToast('PDF hazırlanıyor...', 'warning')
      await window.api.createPdfEnvanter({
        liste: filteredItems,
        title: summary ? 'ENVANTER ÖZET RAPORU' : 'ENVANTER DETAY LİSTESİ',
        summary
      })
      showToast('PDF başarıyla oluşturuldu.', 'success')
    } catch (error) {
      console.error(error)
      showToast('PDF oluşturulamadı.', 'error')
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50 transition-colors duration-500">
      {toastState.show && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
        />
      )}

      {/* STICKY HEADER AREA */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <Package size={22} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Envanter Yönetimi</h1>
              </div>
              <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest ml-13">Taşınır Malzeme Kontrol Paneli</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 p-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <button
                  onClick={() => handlePrint(true)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all uppercase tracking-tighter"
                >
                  <FileText size={16} strokeWidth={2.5} /> Özet Rapor
                </button>
                <button
                  onClick={() => handlePrint(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all uppercase tracking-tighter"
                >
                  <FileText size={16} strokeWidth={2.5} /> Detaylı Liste
                </button>
              </div>

              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all active:scale-95 text-xs font-black uppercase tracking-tighter"
              >
                <Database size={16} strokeWidth={2.5} /> Veri İçe Aktar
              </button>

              <button
                onClick={() => navigate('/ayarlar')}
                className="w-12 h-12 bg-white dark:bg-gray-800 text-gray-500 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:text-blue-600 hover:shadow-md transition-all flex items-center justify-center active:scale-95"
                title="Sistem Tanımları"
              >
                <ConfigIcon size={20} strokeWidth={2.5} />
              </button>

              <button
                onClick={handleAddNew}
                className="flex items-center gap-2.5 bg-blue-600 text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
              >
                <Plus size={18} strokeWidth={3} /> Yeni Malzeme
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-[1600px] mx-auto w-full px-8 pt-8">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white dark:border-gray-800 shadow-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Ad, Marka veya Seri No ile ara..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-[1.8rem] bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shrink-0">
               <Filter size={14} className="text-gray-400" />
               <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none pr-4 py-2 cursor-pointer"
              >
                <option value="Tümü">Tüm Kategoriler</option>
                {kategoriler.map((c) => (
                  <option key={c.id} value={c.ad}>{c.ad}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shrink-0">
               <Filter size={14} className="text-gray-400" />
               <select
                value={yerFilter}
                onChange={(e) => setYerFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none pr-4 py-2 cursor-pointer"
              >
                <option value="Tümü">Tüm Konumlar</option>
                {yerler.map((y) => (
                  <option key={y.id} value={y.yer_adi}>{y.yer_adi}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shrink-0">
               <Filter size={14} className="text-gray-400" />
               <select
                value={durumFilter}
                onChange={(e) => setDurumFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none pr-4 py-2 cursor-pointer"
              >
                <option value="Tümü">Tüm Durumlar</option>
                <option value="Sağlam">Sağlam</option>
                <option value="Arızalı">Arızalı</option>
                <option value="Hurda">Hurda</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE AREA */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-8 relative min-h-0">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col h-full relative">
          <div className="overflow-auto scrollbar-hide absolute inset-0">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-[20%]">Malzeme Bilgisi</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Grup / Kategori</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-center">Miktar</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Konum / Yer</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Zimmet Sorumlusu</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Durum</th>
                  <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 text-right">Eylem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-gray-800/50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-8 py-4">
                        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                        <Archive size={48} strokeWidth={1} />
                        <p className="font-bold text-gray-500 uppercase tracking-widest">Kayıtlı malzeme bulunamadı</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-gray-800/30 transition-all duration-300"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.ad}</span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">{item.marka || 'Marka Belirtilmemiş'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="font-black text-gray-700 dark:text-gray-300 text-sm">{item.adet}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          {item.konum}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 dark:text-gray-300 text-xs">{item.personel || '---'}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Sorumlu</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest
                           ${
                             item.durum === 'Sağlam'
                               ? 'bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200/50'
                               : item.durum === 'Arızalı'
                                 ? 'bg-amber-100/50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200/50'
                                 : 'bg-red-100/50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/50'
                           }
                         `}>
                          {item.durum === 'Sağlam' ? <CheckCircle2 size={12} strokeWidth={3} /> : <AlertCircle size={12} strokeWidth={3} />}
                          {item.durum}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <button
                            onClick={() => handleEdit(item)}
                            className="w-9 h-9 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg hover:shadow-blue-500/20"
                            title="Düzenle"
                          >
                            <Edit size={16} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id!)}
                            className="w-9 h-9 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/20"
                            title="Sil"
                          >
                            <Trash size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmationId && (
          <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden p-8 border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
                 <Trash size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 text-center tracking-tight">Kaydı Sil?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center text-sm font-medium leading-relaxed">
                Bu malzemeyi envanterden kalıcı olarak çıkarmak üzeresiniz. Bu işlem <span className="text-red-500 font-black italic">geri alınamaz.</span>
              </p>
              <div className="flex flex-col gap-3">
                 <button
                  onClick={handleConfirmDelete}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all active:scale-95"
                >
                  SİLME İŞLEMİNİ ONAYLA
                </button>
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                >
                  vazgeç
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT/ADD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-10 py-7 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
              <div className="flex flex-col">
                <h3 className="font-black text-xl text-gray-800 dark:text-white tracking-tight">
                  {editingItem ? 'Malzeme Kartını Düzenle' : 'Yeni Malzeme Tanımla'}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5 italic">Taşınır Malzeme Kayıt Formu</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 hover:shadow-md transition-all active:scale-90 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 overflow-y-auto max-h-[75vh] scrollbar-hide space-y-8">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MALZEME ADI / TANIMI <span className="text-red-500">*</span></label>
                <input
                  required
                  placeholder="Örn: LG 27inc Monitör"
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">MARKA / MODEL</label>
                  <input
                    placeholder="Örn: Asus, Samsung vb."
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                    value={formData.marka}
                    onChange={(e) => setFormData({ ...formData, marka: e.target.value })}
                  />
                </div>
                <div className="space-y-2 relative group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KATEGORİ</label>
                  <input
                    list="cat-list-form"
                    placeholder="Seçiniz veya yazınız"
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  />
                  <datalist id="cat-list-form">
                    {kategoriler.map((c) => (
                      <option key={c.id} value={c.ad} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TOPLAM ADET</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                    value={formData.adet}
                    onChange={(e) => setFormData({ ...formData, adet: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GİRİŞ TARİHİ</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner appearance-none"
                    value={formData.tarih}
                    onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KONUM / DEPO</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner cursor-pointer"
                    value={formData.konum}
                    onChange={(e) => setFormData({ ...formData, konum: e.target.value })}
                  >
                    <option value="">Depo / Oda Seçiniz</option>
                    {yerler.map((y) => (
                      <option key={y.id} value={y.yer_adi}>{y.yer_adi}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GÜNCEL DURUM</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner cursor-pointer"
                    value={formData.durum}
                    onChange={(e) => setFormData({ ...formData, durum: e.target.value })}
                  >
                    <option value="Sağlam">🟢 Sağlam (Kullanımda)</option>
                    <option value="Arızalı">🟡 Arızalı (Beklemede)</option>
                    <option value="Hurda">🔴 Hurda (Kayıt Dışı)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 relative group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ZİMMETLİ PERSONEL</label>
                <input
                  list="pers-list-form"
                  placeholder="Personel araması için yazmaya başlayın..."
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner"
                  value={formData.personel}
                  onChange={(e) => setFormData({ ...formData, personel: e.target.value })}
                />
                <datalist id="pers-list-form">
                  {personeller.map((p) => (
                    <option key={p.id} value={p.ad} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">AÇIKLAMA / SERİ NUMARASI</label>
                <textarea
                  rows={3}
                  placeholder="Cihazın seri numarasını veya diğer önemli notları buraya ekleyin..."
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner resize-none"
                  value={formData.aciklama}
                  onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 py-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2.5xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95"
                >
                  vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2.5xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Save size={18} strokeWidth={3} /> VERİLERİ KAYDET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {isImportModalOpen && (
        <EnvanterImportModal
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={() => {
            fetchData()
            showToast('Veriler başarıyla aktarıldı.', 'success')
          }}
        />
      )}
    </div>
  )
}
