import { useEffect, useState } from 'react'
import { EnvanterMalzeme, EnvanterKategori, EnvanterYer, EnvanterPersonelTanim } from '../types'
import { Plus, Search, FileText, Settings as ConfigIcon, Edit, Trash, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Toast, ToastType } from '../../../shared/components/Toast'

export const EnvanterDashboard = () => {
    const navigate = useNavigate()
    const [items, setItems] = useState<EnvanterMalzeme[]>([])
    const [filteredItems, setFilteredItems] = useState<EnvanterMalzeme[]>([])
    const [loading, setLoading] = useState(false)

    // Toast State
    const [toastState, setToastState] = useState<{ show: boolean; message: string; type: ToastType }>({
        show: false,
        message: '',
        type: 'success'
    })

    const showToast = (message: string, type: ToastType) => {
        setToastState({ show: true, message, type })
    }

    // ... existing filters state ...
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
    const [editingItem, setEditingItem] = useState<EnvanterMalzeme | null>(null)
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState<Partial<EnvanterMalzeme>>({
        ad: '', marka: '', kategori: '', adet: 1, konum: '', personel: '', durum: 'Sağlam'
    })

    // Definition Lists for Form (Auto-complete / Select)
    const [personeller, setPersoneller] = useState<EnvanterPersonelTanim[]>([])

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await window.api.getEnvanterMalzemeler({})
            setItems(data)
            setFilteredItems(data)

            const cats = await window.api.getEnvanterKategoriler()
            setKategoriler(cats)
            const locs = await window.api.getEnvanterYerler()
            setYerler(locs)
            const pers = await window.api.getEnvanterPersonelTanimlari()
            setPersoneller(pers)
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
            res = res.filter(i => i.ad.toLowerCase().includes(lower) || i.marka.toLowerCase().includes(lower) || i.seri_no?.toLowerCase().includes(lower))
        }
        if (kategoriFilter !== 'Tümü') res = res.filter(i => i.kategori === kategoriFilter)
        if (yerFilter !== 'Tümü') res = res.filter(i => i.konum === yerFilter)
        if (durumFilter !== 'Tümü') res = res.filter(i => i.durum === durumFilter)
        setFilteredItems(res)
    }, [items, searchText, kategoriFilter, yerFilter, durumFilter])

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmationId(id)
    }

    const handleConfirmDelete = async () => {
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

    const handleEdit = (item: EnvanterMalzeme) => {
        setEditingItem(item)
        setFormData(item)
        setIsModalOpen(true)
    }

    const handleAddNew = () => {
        setEditingItem(null)
        setFormData({
            ad: '', marka: '', kategori: '', adet: 1, konum: '', personel: '', durum: 'Sağlam', tarih: new Date().toISOString().split('T')[0]
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingItem && editingItem.id) {
                await window.api.updateEnvanterMalzeme({ ...formData, id: editingItem.id })
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

    const handlePrint = async (summary: boolean) => {
        try {
            showToast('PDF hazırlanıyor...', 'warning')
            // PDF generation
            await window.api.createPdfEnvanter({
                liste: filteredItems,
                title: summary ? "ENVANTER ÖZET RAPORU" : "ENVANTER DETAY LİSTESİ",
                summary
            })
            showToast('PDF başarıyla oluşturuldu.', 'success')
        } catch (error) {
            console.error(error)
            showToast('PDF oluşturulamadı.', 'error')
        }
    }

    return (
        <div className="p-6 h-full flex flex-col gap-4 relative">
            {toastState.show && (
                <Toast
                    message={toastState.message}
                    type={toastState.type}
                    onClose={() => setToastState(prev => ({ ...prev, show: false }))}
                />
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Envanter Yönetimi</h1>
                    <p className="text-gray-500 text-sm">Taşınır Malzeme Listesi ve İşlemleri</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handlePrint(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">
                        <FileText size={18} /> Özet
                    </button>
                    <button onClick={() => handlePrint(false)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                        <FileText size={18} /> Liste Yazdır
                    </button>
                    <button onClick={() => navigate('/ayarlar')} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition">
                        <ConfigIcon size={18} /> Tanımlar
                    </button>
                    <button onClick={handleAddNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
                        <Plus size={18} /> Yeni Ekle
                    </button>
                </div>
            </div>

            {/* FILTERS */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-2.5 left-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Malzeme Adı, Marka veya Seri No ara..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)}
                    className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="Tümü">Tüm Kategoriler</option>
                    {kategoriler.map(c => <option key={c.id} value={c.ad}>{c.ad}</option>)}
                </select>
                <select
                    value={yerFilter} onChange={(e) => setYerFilter(e.target.value)}
                    className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="Tümü">Tüm Yerler</option>
                    {yerler.map(y => <option key={y.id} value={y.yer_adi}>{y.yer_adi}</option>)}
                </select>
                <select
                    value={durumFilter} onChange={(e) => setDurumFilter(e.target.value)}
                    className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="Tümü">Tüm Durumlar</option>
                    <option value="Sağlam">Sağlam</option>
                    <option value="Arızalı">Arızalı</option>
                    <option value="Hurda">Hurda</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex-1 relative">
                <div className="overflow-auto absolute inset-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                            <tr>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Malzeme Adı</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Marka</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Kategori</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Adet</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Konum</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Zimmetli Personel</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Durum</th>
                                <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={8} className="p-4 text-center">Yükleniyor...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={8} className="p-4 text-center text-gray-500">Kayıt bulunamadı.</td></tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{item.ad}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{item.marka}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{item.kategori}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{item.adet}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{item.konum}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-400">{item.personel}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold
                         ${item.durum === 'Sağlam' ? 'bg-green-100 text-green-700' :
                                                    item.durum === 'Arızalı' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                       `}>
                                                {item.durum}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteClick(item.id!)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* DELETE CONFIRMATION MODAL */}
                {deleteConfirmationId && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm overflow-hidden p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Silme Onayı</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirmationId(null)}
                                    className="px-4 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <h3 className="font-bold text-lg dark:text-white">{editingItem ? 'Malzeme Düzenle' : 'Yeni Malzeme Ekle'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Malzeme Adı</label>
                                <input required className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.ad} onChange={e => setFormData({ ...formData, ad: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Marka</label>
                                    <input className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.marka} onChange={e => setFormData({ ...formData, marka: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Kategori</label>
                                    <input list="cat-list" className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.kategori} onChange={e => setFormData({ ...formData, kategori: e.target.value })} />
                                    <datalist id="cat-list">
                                        {kategoriler.map(c => <option key={c.id} value={c.ad} />)}
                                    </datalist>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Adet</label>
                                    <input type="number" min="1" className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.adet} onChange={e => setFormData({ ...formData, adet: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tarih</label>
                                    <input type="date" className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.tarih} onChange={e => setFormData({ ...formData, tarih: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Konum</label>
                                    <select className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.konum} onChange={e => setFormData({ ...formData, konum: e.target.value })}>
                                        <option value="">Seçiniz</option>
                                        {yerler.map(y => <option key={y.id} value={y.yer_adi}>{y.yer_adi}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Durum</label>
                                    <select className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={formData.durum} onChange={e => setFormData({ ...formData, durum: e.target.value })}>
                                        <option value="Sağlam">Sağlam</option>
                                        <option value="Arızalı">Arızalı</option>
                                        <option value="Hurda">Hurda</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Personel (Zimmet)</label>
                                <input list="pers-list" className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.personel} onChange={e => setFormData({ ...formData, personel: e.target.value })} placeholder="Personel Adı" />
                                <datalist id="pers-list">
                                    {personeller.map(p => <option key={p.id} value={p.ad} />)}
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Açıklama / Seri No</label>
                                <textarea rows={2} className="w-full border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.aciklama} onChange={e => setFormData({ ...formData, aciklama: e.target.value })} />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">İptal</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
