import { useState } from 'react'
import {
  Plus,
  Trash2,
  // GraduationCap,
  User,
  BookOpen,
  Users,
  Briefcase,
  Sun,
  Moon,
  Edit,
  Check,
  X,
  RefreshCw
} from 'lucide-react'
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel'

export const EgitimSettings = () => {
  const {
    egitimKonular,
    konuEkle,
    konuSil,
    konuGuncelle,
    egitimEgiticiler,
    egiticiEkle,
    egiticiSil,
    egiticiGuncelle, // ADDED
    egitimDuzenleyenler,
    duzenleyenEkle,
    duzenleyenSil,
    duzenleyenGuncelle,
    egitimPersoneller,
    egitimPersonelEkle,
    egitimPersonelSil,
    egitimPersonelGuncelle, // ADDED
    bildirim,
    getEgitimData, // ADDED for refresh
    mesajGoster // ADDED for error messages
    // personeller // REMOVED (Unused)
  } = useSettingsViewModel()

  // STATES
  const [yeniKonu, setYeniKonu] = useState('')
  const [duzenlenenKonuId, setDuzenlenenKonuId] = useState<number | null>(null)

  // Eğitici State
  const [yeniEgitici, setYeniEgitici] = useState({ ad: '', unvan: '' })
  const [duzenlenenEgiticiId, setDuzenlenenEgiticiId] = useState<number | null>(null) // YENİ

  // Düzenleyen State
  const [yeniDuzenleyen, setYeniDuzenleyen] = useState({ ad: '', unvan: '' })
  const [duzenlenenDuzenleyenId, setDuzenlenenDuzenleyenId] = useState<number | null>(null)



  // Personel State
  const [yeniPersonel, setYeniPersonel] = useState({
    ad: '',
    unvan: '',
    cinsiyet: 'Erkek',
    grup: 'Sabah'
  })
  const [duzenlenenPersonelId, setDuzenlenenPersonelId] = useState<number | null>(null) // YENİ

  // const [silKonuId, setSilKonuId] = useState<number | null>(null)
  // const [silEgiticiId, setSilEgiticiId] = useState<number | null>(null)
  // const [silPersonelId, setSilPersonelId] = useState<number | null>(null)

  // HANDLERS
  const handleKonuSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!yeniKonu.trim()) return

    if (duzenlenenKonuId !== null) {
      await konuGuncelle(duzenlenenKonuId, yeniKonu.trim())
      setDuzenlenenKonuId(null)
    } else {
      await konuEkle(yeniKonu.trim())
    }
    setYeniKonu('')
  }

  const baslaDuzenle = (id: number, baslik: string) => {
    setDuzenlenenKonuId(id)
    setYeniKonu(baslik)
  }

  const iptalDuzenle = () => {
    setDuzenlenenKonuId(null)
    setYeniKonu('')
  }

  // EĞİTİCİ İŞLEMLERİ
  const handleEgiticiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!yeniEgitici.ad.trim()) return

    if (duzenlenenEgiticiId !== null) {
      await egiticiGuncelle(duzenlenenEgiticiId, yeniEgitici.ad.trim(), yeniEgitici.unvan.trim())
      setDuzenlenenEgiticiId(null)
    } else {
      await egiticiEkle(yeniEgitici.ad.trim(), yeniEgitici.unvan.trim())
    }
    setYeniEgitici({ ad: '', unvan: '' })
  }

  const baslaEgiticiDuzenle = (item: any) => {
    setDuzenlenenEgiticiId(item.id)
    setYeniEgitici({ ad: item.ad_soyad, unvan: item.unvan })
  }

  const iptalEgiticiDuzenle = () => {
    setDuzenlenenEgiticiId(null)
    setYeniEgitici({ ad: '', unvan: '' })
  }

  // DÜZENLEYEN İŞLEMLERİ
  const handleDuzenleyenSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!yeniDuzenleyen.ad.trim()) return

    if (duzenlenenDuzenleyenId !== null) {
      await duzenleyenGuncelle(
        duzenlenenDuzenleyenId,
        yeniDuzenleyen.ad.trim(),
        yeniDuzenleyen.unvan.trim()
      )
      setDuzenlenenDuzenleyenId(null)
    } else {
      await duzenleyenEkle(yeniDuzenleyen.ad.trim(), yeniDuzenleyen.unvan.trim())
    }
    setYeniDuzenleyen({ ad: '', unvan: '' })
  }

  const baslaDuzenleyenDuzenle = (item: any) => {
    setDuzenlenenDuzenleyenId(item.id)
    setYeniDuzenleyen({ ad: item.ad_soyad, unvan: item.unvan })
  }

  const iptalDuzenleyenDuzenle = () => {
    setDuzenlenenDuzenleyenId(null)
    setYeniDuzenleyen({ ad: '', unvan: '' })
  }

  // PERSONEL İŞLEMLERİ
  const handlePersonelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!yeniPersonel.ad.trim()) return

    if (duzenlenenPersonelId !== null) {
      await egitimPersonelGuncelle(
        duzenlenenPersonelId,
        yeniPersonel.ad.trim(),
        yeniPersonel.unvan.trim(),
        yeniPersonel.cinsiyet,
        yeniPersonel.grup
      )
      setDuzenlenenPersonelId(null)
    } else {
      await egitimPersonelEkle(
        yeniPersonel.ad.trim(),
        yeniPersonel.unvan.trim(),
        yeniPersonel.cinsiyet,
        yeniPersonel.grup
      )
    }
    setYeniPersonel({ ad: '', unvan: '', cinsiyet: 'Erkek', grup: 'Sabah' })
  }

  const baslaPersonelDuzenle = (item: any) => {
    setDuzenlenenPersonelId(item.id)
    setYeniPersonel({
      ad: item.ad_soyad,
      unvan: item.unvan,
      cinsiyet: item.cinsiyet,
      grup: item.grup || 'Sabah'
    })
  }

  const iptalPersonelDuzenle = () => {
    setDuzenlenenPersonelId(null)
    setYeniPersonel({ ad: '', unvan: '', cinsiyet: 'Erkek', grup: 'Sabah' })
  }

  // NAME FORMATTER: Ad TitleCase, Soyad UPPERCASE
  const formatAdSoyad = (val: string) => {
    if (!val) return ''
    const parts = val.split(' ')
    if (parts.length === 1) {
      return (
        parts[0].charAt(0).toLocaleUpperCase('tr-TR') + parts[0].slice(1).toLocaleLowerCase('tr-TR')
      )
    }
    const lastIndex = parts.length - 1
    return parts
      .map((part, index) => {
        // Son parça (eğer boşluk sonrasıysa) BÜYÜK
        if (index === lastIndex) return part.toLocaleUpperCase('tr-TR')
        // Diğerleri Title Case
        return part.charAt(0).toLocaleUpperCase('tr-TR') + part.slice(1).toLocaleLowerCase('tr-TR')
      })
      .join(' ')
  }

  const sabahGrubu = egitimPersoneller.filter((p) => !p.grup || p.grup === 'Sabah')
  const ogleGrubu = egitimPersoneller.filter((p) => p.grup === 'Öğle')

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 1. EĞİTİCİLER */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <User className="text-orange-600" size={24} />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Eğiticiler</h3>
            <p className="text-gray-500 text-xs">Eğitim verecek eğitmenleri tanımlayın.</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleEgiticiSubmit} className="flex gap-3 mb-6 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Eğitici Adı</label>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={yeniEgitici.ad}
                onChange={(e) =>
                  setYeniEgitici({ ...yeniEgitici, ad: formatAdSoyad(e.target.value) })
                }
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 outline-none dark:text-white ${duzenlenenEgiticiId ? 'border-orange-300 focus:ring-orange-200 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-600 focus:ring-orange-100 focus:border-orange-400'}`}
              />
            </div>
            <div className="w-1/4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Unvan</label>
              <input
                type="text"
                placeholder="Unvan"
                value={yeniEgitici.unvan}
                onChange={(e) => setYeniEgitici({ ...yeniEgitici, unvan: e.target.value })}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 outline-none uppercase dark:text-white ${duzenlenenEgiticiId ? 'border-orange-300 focus:ring-orange-200 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-600 focus:ring-orange-100 focus:border-orange-400'}`}
              />
            </div>

            {duzenlenenEgiticiId ? (
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!yeniEgitici.ad.trim()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={18} /> Güncelle
                </button>
                <button
                  type="button"
                  onClick={iptalEgiticiDuzenle}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <X size={18} /> İptal
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!yeniEgitici.ad.trim()}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} /> Ekle
              </button>
            )}
          </form>
          <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            {egitimEgiticiler.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">Liste boş.</div>
            ) : (
              <table className="w-full text-sm text-left opacity-100">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-2">Ad Soyad</th>
                    <th className="px-4 py-2">Unvan</th>
                    <th className="px-4 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {egitimEgiticiler.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${duzenlenenEgiticiId === item.id
                        ? 'bg-orange-50 dark:bg-orange-900/20'
                        : 'bg-white dark:bg-gray-800'
                        }`}
                    >
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                        {item.ad_soyad}
                      </td>
                      <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{item.unvan}</td>
                      <td className="px-4 py-2 text-right flex justify-end gap-1">
                        <button
                          onClick={() => baslaEgiticiDuzenle(item)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => egiticiSil(item.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 2. DÜZENLEYENLER */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <Briefcase className="text-purple-600" size={24} />
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Düzenleyen Kişiler</h3>
            <p className="text-gray-500 text-xs">Eğitimi düzenleyen kişileri tanımlayın.</p>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handleDuzenleyenSubmit} className="flex gap-3 mb-6 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Düzenleyen Adı
              </label>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={yeniDuzenleyen.ad}
                onChange={(e) =>
                  setYeniDuzenleyen({ ...yeniDuzenleyen, ad: formatAdSoyad(e.target.value) })
                }
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 outline-none dark:text-white ${duzenlenenDuzenleyenId ? 'border-purple-300 focus:ring-purple-200 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 focus:ring-purple-100 focus:border-purple-400'}`}
              />
            </div>
            <div className="w-1/4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Unvan</label>
              <input
                type="text"
                placeholder="Unvan"
                value={yeniDuzenleyen.unvan}
                onChange={(e) => setYeniDuzenleyen({ ...yeniDuzenleyen, unvan: e.target.value })}
                className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 outline-none uppercase dark:text-white ${duzenlenenDuzenleyenId ? 'border-purple-300 focus:ring-purple-200 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 focus:ring-purple-100 focus:border-purple-400'}`}
              />
            </div>

            {duzenlenenDuzenleyenId ? (
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!yeniDuzenleyen.ad.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={18} /> Güncelle
                </button>
                <button
                  type="button"
                  onClick={iptalDuzenleyenDuzenle}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <X size={18} /> İptal
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!yeniDuzenleyen.ad.trim()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} /> Ekle
              </button>
            )}
          </form>
          <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            {egitimDuzenleyenler.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">Liste boş.</div>
            ) : (
              <table className="w-full text-sm text-left opacity-100">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-2">Ad Soyad</th>
                    <th className="px-4 py-2">Unvan</th>
                    <th className="px-4 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {egitimDuzenleyenler.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${duzenlenenDuzenleyenId === item.id
                        ? 'bg-purple-50 dark:bg-purple-900/20'
                        : 'bg-white dark:bg-gray-800'
                        }`}
                    >
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                        {item.ad_soyad}
                      </td>
                      <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{item.unvan}</td>
                      <td className="px-4 py-2 text-right flex justify-end gap-1">
                        <button
                          onClick={() => baslaDuzenleyenDuzenle(item)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => duzenleyenSil(item.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 2. PERSONEL (Unvan + Cinsiyet) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <Users className="text-blue-600" size={24} />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Personel Listesi</h3>
            <p className="text-gray-500 text-xs">
              Eğitime katılacak personeli unvan ve cinsiyet bilgisiyle ekleyin.
            </p>
          </div>
        </div>
        <div className="p-6">
          <form
            onSubmit={handlePersonelSubmit}
            className={`grid grid-cols-12 gap-3 mb-6 p-4 rounded-xl border transition-colors ${duzenlenenPersonelId ? 'bg-orange-50 border-orange-200' : 'bg-blue-50/50 border-blue-100'}`}
          >
            <div className="col-span-12 mb-2 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Grup Seçimi:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="grup"
                  value="Sabah"
                  checked={yeniPersonel.grup === 'Sabah'}
                  onChange={() => setYeniPersonel({ ...yeniPersonel, grup: 'Sabah' })}
                  className="accent-blue-600"
                />
                <span className="text-sm flex items-center gap-1">
                  <Sun size={14} className="text-orange-500" /> Sabah Grubu
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="grup"
                  value="Öğle"
                  checked={yeniPersonel.grup === 'Öğle'}
                  onChange={() => setYeniPersonel({ ...yeniPersonel, grup: 'Öğle' })}
                  className="accent-blue-600"
                />
                <span className="text-sm flex items-center gap-1">
                  <Moon size={14} className="text-indigo-500" /> Öğle Grubu
                </span>
              </label>
            </div>

            <div className="col-span-6">
              <input
                type="text"
                placeholder="Ad Soyad"
                value={yeniPersonel.ad}
                onChange={(e) =>
                  setYeniPersonel({ ...yeniPersonel, ad: formatAdSoyad(e.target.value) })
                }
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm dark:text-white"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                placeholder="Unvan"
                value={yeniPersonel.unvan}
                onChange={(e) => setYeniPersonel({ ...yeniPersonel, unvan: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none uppercase text-sm dark:text-white"
              />
            </div>
            <div className="col-span-2">
              <select
                value={yeniPersonel.cinsiyet}
                onChange={(e) => setYeniPersonel({ ...yeniPersonel, cinsiyet: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm dark:text-white"
              >
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>
            <div className="col-span-1">
              {duzenlenenPersonelId ? (
                <div className="flex flex-col gap-1 h-full">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs flex items-center justify-center font-bold"
                    title="Güncelle"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={iptalPersonelDuzenle}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs flex items-center justify-center"
                    title="İptal"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!yeniPersonel.ad.trim()}
                  className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-2 gap-6">
            {/* SABAH GRUBU */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-100 dark:border-orange-800/30 p-3 flex items-center gap-2">
                <Sun size={16} className="text-orange-600 dark:text-orange-400" />
                <h4 className="font-bold text-orange-900 dark:text-orange-100 text-sm">
                  Sabah Grubu ({sabahGrubu.length})
                </h4>
              </div>
              <div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-800">
                {sabahGrubu.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Liste boş.</div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {sabahGrubu.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 group ${duzenlenenPersonelId === item.id
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'bg-white dark:bg-gray-800'
                            }`}
                        >
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                            {item.ad_soyad}
                          </td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">
                            {item.unvan}
                          </td>
                          <td className="px-3 py-2 text-right flex justify-end gap-1">
                            <button
                              onClick={() => baslaPersonelDuzenle(item)}
                              className="text-gray-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => egitimPersonelSil(item.id)}
                              className="text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* ÖĞLE GRUBU */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/30 p-3 flex items-center gap-2">
                <Moon size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-sm">
                  Öğle Grubu ({ogleGrubu.length})
                </h4>
              </div>
              <div className="max-h-96 overflow-y-auto bg-white dark:bg-gray-800">
                {ogleGrubu.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Liste boş.</div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {ogleGrubu.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 group ${duzenlenenPersonelId === item.id
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'bg-white dark:bg-gray-800'
                            }`}
                        >
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                            {item.ad_soyad}
                          </td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">
                            {item.unvan}
                          </td>
                          <td className="px-3 py-2 text-right flex justify-end gap-1">
                            <button
                              onClick={() => baslaPersonelDuzenle(item)}
                              className="text-gray-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => egitimPersonelSil(item.id)}
                              className="text-gray-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. KONULAR */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-teal-600 dark:text-teal-400" size={24} />
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Eğitim Konuları</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Standart eğitim konu başlıklarını yönetin.
              </p>
            </div>
          </div>
          <button
            onClick={() => getEgitimData()}
            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
            title="Sıraya Göre Yenile"
          >
            <RefreshCw size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="p-6">
            <form onSubmit={handleKonuSubmit} className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Konu Başlığı Giriniz..."
                value={yeniKonu}
                onChange={(e) => setYeniKonu(e.target.value)}
                className={`flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 outline-none uppercase transition-colors dark:text-white ${duzenlenenKonuId
                  ? 'border-orange-200 focus:ring-orange-100 focus:border-orange-400'
                  : 'border-gray-200 focus:ring-teal-100 focus:border-teal-400'
                  }`}
              />
              {duzenlenenKonuId ? (
                <>
                  <button
                    type="submit"
                    disabled={!yeniKonu.trim()}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Check size={18} /> Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={iptalDuzenle}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <X size={18} /> İptal
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  disabled={!yeniKonu.trim()}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={18} /> Ekle
                </button>
              )}
            </form>
            <div className="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
              {egitimKonular.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">Liste boş.</div>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {egitimKonular.map((item) => (
                    <li
                      key={item.id}
                      className={`px-4 py-3 flex items-center justify-between transition-colors ${duzenlenenKonuId === item.id ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="number"
                          defaultValue={item.sira ?? ''}
                          placeholder="#"
                          onBlur={(e) => {
                            const newSira = e.target.value ? parseInt(e.target.value) : undefined
                            if (newSira !== item.sira) {
                              // Duplicate check
                              if (newSira !== undefined) {
                                const duplicate = egitimKonular.find(
                                  (k) => k.id !== item.id && k.sira === newSira
                                )
                                if (duplicate) {
                                  mesajGoster(`Bu sıra numarası (${newSira}) zaten "${duplicate.baslik}" konusuna verilmiş!`, 'hata')
                                  e.target.value = item.sira?.toString() ?? ''
                                  return
                                }
                              }
                              konuGuncelle(item.id, item.baslik, newSira)
                            }
                          }}
                          className="w-16 px-2 py-1 text-center text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none"
                          title="Sıra numarası"
                        />
                        <span
                          className={`text-gray-700 dark:text-gray-200 font-medium text-sm ${duzenlenenKonuId === item.id ? 'text-orange-900 dark:text-orange-100' : ''}`}
                        >
                          {item.baslik}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => baslaDuzenle(item.id, item.baslik)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => konuSil(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {bildirim && (
        <div
          className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-lg text-white animate-in slide-in-from-right duration-300 z-50 flex items-center gap-3 ${bildirim.tur === 'hata' ? 'bg-red-600' : 'bg-green-600'}`}
        >
          <span>{bildirim.mesaj}</span>
        </div>
      )}
    </div>
  )
}
