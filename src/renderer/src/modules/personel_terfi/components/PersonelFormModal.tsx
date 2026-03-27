import React, { useState, useEffect } from 'react'
import { X, Save, User, UserCheck, Calendar } from 'lucide-react'

interface PersonelFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
}

export const PersonelFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialData
}: PersonelFormModalProps): React.ReactElement | null => {
  const [form, setForm] = useState({
    ad_soyad: '',
    sicil_no: '',
    unvan: '',
    kadro: '',
    derece: '',
    kademe: '',
    ek_gosterge: '',
    atanma_tarihi: '',
    terfi_tarihi: '',
    terfi_suresi: 12,
    sonraki_terfi: '',
    aciklama: '',
    departman: '',
    ise_giris_tarihi: ''
  })

  // Modal açıldığında veya initialData değiştiğinde formu doldur
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        // Tarihleri input type="date" için formatla (YYYY-MM-DD)
        atanma_tarihi: initialData.atanma_tarihi ? initialData.atanma_tarihi.split('T')[0] : '',
        terfi_tarihi: initialData.terfi_tarihi ? initialData.terfi_tarihi.split('T')[0] : '',
        sonraki_terfi: initialData.sonraki_terfi ? initialData.sonraki_terfi.split('T')[0] : '',
        ise_giris_tarihi: initialData.ise_giris_tarihi
          ? initialData.ise_giris_tarihi.split('T')[0]
          : ''
      })
    } else {
      // Yeni kayıt
      setForm({
        ad_soyad: '',
        sicil_no: '',
        unvan: '',
        kadro: '',
        derece: '',
        kademe: '',
        ek_gosterge: '',
        atanma_tarihi: '',
        terfi_tarihi: '',
        terfi_suresi: 12,
        sonraki_terfi: '',
        aciklama: '',
        departman: '',
        ise_giris_tarihi: ''
      })
    }
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserCheck size={24} /> {initialData ? 'Personel Düzenle' : 'Personel Ekle'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Kişisel Bilgiler */}
            <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <User size={16} /> Kişisel Bilgiler
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    required
                    name="ad_soyad"
                    value={form.ad_soyad}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Tam İsim"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Sicil No
                  </label>
                  <input
                    name="sicil_no"
                    value={form.sicil_no}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Sicil No"
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Ünvan
                  </label>
                  <input
                    name="unvan"
                    value={form.unvan}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Örn: V.H.K.İ."
                  />
                </div>
              </div>
            </div>

            {/* Kadro ve Terfi */}
            <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <Calendar size={16} /> Kadro ve Terfi Bilgileri
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    İşe Giriş Tarihi
                  </label>
                  <input
                    type="date"
                    name="ise_giris_tarihi"
                    value={form.ise_giris_tarihi}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Derece
                  </label>
                  <input
                    name="derece"
                    value={form.derece}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Kademe
                  </label>
                  <input
                    name="kademe"
                    value={form.kademe}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="4"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Ek Gösterge
                  </label>
                  <input
                    name="ek_gosterge"
                    value={form.ek_gosterge}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Kadro
                  </label>
                  <input
                    name="kadro"
                    value={form.kadro}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                    placeholder="Kadro"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Terfi Tarihi
                  </label>
                  <input
                    type="date"
                    name="terfi_tarihi"
                    value={form.terfi_tarihi}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">
                    Sonraki Terfi
                  </label>
                  <input
                    type="date"
                    name="sonraki_terfi"
                    value={form.sonraki_terfi}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center gap-2"
          >
            <Save size={18} /> Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}
