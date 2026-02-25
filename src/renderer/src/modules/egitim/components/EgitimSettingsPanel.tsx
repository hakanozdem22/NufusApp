import { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  Play,
  Plus,
  CheckSquare,
  RefreshCw,
  Search,
  X,
  CheckCheck,
  Users,
  Clock,
  ChevronDown,
  LayoutTemplate,
  BookOpen,
  Target
} from 'lucide-react'
import { EgitimKonu, PersonelBasic } from '../models/egitim-types'

interface EgitimSettingsPanelProps {
  tarih: string
  setTarih: (val: string) => void
  seciliEgitici: string
  setSeciliEgitici: (val: string) => void
  duzenleyenler: PersonelBasic[]
  seciliDuzenleyen: string
  setSeciliDuzenleyen: (val: string) => void
  seciliOnaylayan: string
  setSeciliOnaylayan: (val: string) => void
  personelListesi: PersonelBasic[]
  saatHedefi: string
  setSaatHedefi: (val: string) => void
  sabahOturum: string
  setSabahOturum: (val: string) => void
  ogleOturum: string
  setOgleOturum: (val: string) => void
  zorunluDersler: string[]
  zorunluDersToggle: (baslik: string) => void
  zorunluTumunuSec: () => void
  zorunluTumunuTemizle: () => void
  zorunluDersMenuAcik: boolean
  setZorunluDersMenuAcik: (val: boolean) => void
  konular: EgitimKonu[]
  robotCalistir: () => void
  manKonu: string
  setManKonu: (val: string) => void
  manSaat: string
  setManSaat: (val: string) => void
  manOturumSecimi: 'sabah' | 'ogle' | 'ikisi'
  setManOturumSecimi: (val: 'sabah' | 'ogle' | 'ikisi') => void
  manuelEkle: () => void
  refreshData: () => void
}

export const EgitimSettingsPanel = ({
  tarih,
  setTarih,
  seciliEgitici,
  setSeciliEgitici,
  duzenleyenler,
  seciliDuzenleyen,
  setSeciliDuzenleyen,
  seciliOnaylayan,
  setSeciliOnaylayan,
  personelListesi,
  saatHedefi,
  setSaatHedefi,
  sabahOturum,
  setSabahOturum,
  ogleOturum,
  setOgleOturum,
  zorunluDersler,
  zorunluDersToggle,
  zorunluTumunuSec,
  zorunluTumunuTemizle,
  zorunluDersMenuAcik,
  setZorunluDersMenuAcik,
  konular,
  robotCalistir,
  manKonu,
  setManKonu,
  manSaat,
  setManSaat,
  manOturumSecimi,
  setManOturumSecimi,
  manuelEkle,
  refreshData
}: EgitimSettingsPanelProps) => {
  // Zorunlu ders arama filtresi
  const [zorunluArama, setZorunluArama] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklayınca menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setZorunluDersMenuAcik(false)
        setZorunluArama('')
      }
    }
    if (zorunluDersMenuAcik) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [zorunluDersMenuAcik, setZorunluDersMenuAcik])

  // Sıralama fonksiyonu
  const siraliKonular = [...konular].sort((a, b) => {
    const siraA = a.sira ?? 9999
    const siraB = b.sira ?? 9999
    if (siraA !== siraB) return siraA - siraB
    return (a.baslik || '').localeCompare(b.baslik || '')
  })

  // Filtrelenmiş konular
  const filtrelenmisKonular = siraliKonular.filter((k) =>
    k.baslik.toLocaleLowerCase('tr-TR').includes(zorunluArama.toLocaleLowerCase('tr-TR'))
  )

  const CardHeader = ({
    title,
    icon: Icon,
    colorClass
  }: {
    title: string
    icon: any
    colorClass: string
  }) => (
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-gray-800 dark:text-gray-100">{title}</h3>
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col bg-gray-50/50 dark:bg-gray-900 overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <LayoutTemplate size={24} className="text-blue-600 dark:text-blue-400" />
            Planlama Kontrol Paneli
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Otomatik ders programı oluşturmak için aşağıdaki parametreleri yapılandırın.
          </p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-all font-medium text-sm"
        >
          <RefreshCw size={16} />
          Verileri Yenile
        </button>
      </div>

      {/* DASHBOARD GRID */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {/* CARD 1: GENEL BİLGİLER */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
            <CardHeader
              title="Genel Bilgiler"
              icon={Users}
              colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Başlangıç Tarihi
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all"
                    value={tarih}
                    onChange={(e) => setTarih(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Eğitici Personel
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all"
                  value={seciliEgitici}
                  onChange={(e) => setSeciliEgitici(e.target.value)}
                >
                  <option value="">Personel Seçiniz...</option>
                  {personelListesi.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.ad_soyad} {p.unvan ? `(${p.unvan})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Düzenleyen
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-100 outline-none"
                  value={seciliDuzenleyen}
                  onChange={(e) => setSeciliDuzenleyen(e.target.value)}
                >
                  <option value="">Seçiniz...</option>
                  {duzenleyenler?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.ad_soyad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Onaylayan
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-100 outline-none"
                  value={seciliOnaylayan}
                  onChange={(e) => setSeciliOnaylayan(e.target.value)}
                >
                  <option value="">Seçiniz...</option>
                  {personelListesi?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.ad_soyad}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2: ZAMANLAMA VE HEDEFLER */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
            <CardHeader
              title="Hedefler & Zaman"
              icon={Target}
              colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            />

            <div className="space-y-6">
              {/* Target Section - Gradient Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white shadow-lg shadow-purple-200 dark:shadow-none">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Target size={100} />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-baseline gap-1">
                    <input
                      className="w-32 bg-transparent text-center text-5xl font-bold text-white placeholder-purple-200 outline-none border-b-2 border-purple-400/50 focus:border-white transition-all"
                      value={saatHedefi}
                      onChange={(e) => setSaatHedefi(e.target.value)}
                    />
                    <span className="text-sm font-medium text-purple-200">Saat</span>
                  </div>
                </div>
              </div>

              {/* Session Times Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-gray-400" />
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                    Oturum Saatleri
                  </label>
                </div>

                {/* Sabah */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      SABAH
                    </span>
                  </div>
                  <input
                    className="w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-400 transition-all outline-none"
                    value={sabahOturum}
                    onChange={(e) => setSabahOturum(e.target.value)}
                    placeholder="09:00 - 12:00"
                  />
                </div>

                {/* Öğle */}
                <div className="group relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      ÖĞLE
                    </span>
                  </div>
                  <input
                    className="w-full pl-16 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-400 transition-all outline-none"
                    value={ogleOturum}
                    onChange={(e) => setOgleOturum(e.target.value)}
                    placeholder="13:30 - 16:30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: MÜFREDAT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader
              title="Müfredat Seçimi"
              icon={BookOpen}
              colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            />

            <div className="space-y-4 h-[calc(100%-60px)] flex flex-col">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Otomatik planlama sırasında programa{' '}
                <span className="font-bold text-orange-600">kesinlikle</span> dahil edilecek
                dersleri seçin.
              </p>

              <div className="relative flex-1" ref={menuRef}>
                <div
                  onClick={() => {
                    setZorunluDersMenuAcik(!zorunluDersMenuAcik)
                    if (!zorunluDersMenuAcik) setZorunluArama('')
                  }}
                  className="w-full h-12 bg-gray-50 dark:bg-gray-700/30 border-2 border-dashed border-orange-200 dark:border-orange-800/50 rounded-xl flex items-center justify-between px-4 cursor-pointer hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <CheckSquare
                      size={18}
                      className="text-orange-500 group-hover:scale-110 transition-transform"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {zorunluDersler.length > 0
                        ? `${zorunluDersler.length} ders seçildi`
                        : 'Zorunlu ders seçimi yapın...'}
                    </span>
                  </div>
                  <ChevronDown size={18} className="text-gray-400" />
                </div>

                {/* Seçili Dersler Listesi (Preview) */}
                {!zorunluDersMenuAcik && zorunluDersler.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                    {zorunluDersler.map((ders) => (
                      <span
                        key={ders}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs rounded-lg shadow-sm"
                      >
                        {ders.length > 30 ? ders.slice(0, 30) + '...' : ders}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            zorunluDersToggle(ders)
                          }}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Dropdown Menu */}
                {zorunluDersMenuAcik && (
                  <div className="absolute top-14 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-30 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 h-[300px] flex flex-col">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Derslerde ara..."
                          value={zorunluArama}
                          onChange={(e) => setZorunluArama(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-100 outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {filtrelenmisKonular.length} BULUNDU
                        </span>
                        <div className="flex gap-3">
                          <button
                            onClick={zorunluTumunuSec}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            TÜMÜ
                          </button>
                          <button
                            onClick={zorunluTumunuTemizle}
                            className="text-xs font-bold text-red-600 hover:text-red-700"
                          >
                            TEMİZLE
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                      {filtrelenmisKonular.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                          <Search size={24} className="mb-2 opacity-50" />
                          <span className="text-xs">Sonuç bulunamadı</span>
                        </div>
                      ) : (
                        filtrelenmisKonular.map((k) => {
                          const secili = zorunluDersler.includes(k.baslik)
                          return (
                            <div
                              key={k.id}
                              onClick={() => zorunluDersToggle(k.baslik)}
                              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-all mb-1 ${
                                secili
                                  ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                                  secili
                                    ? 'bg-orange-500 border-orange-500 text-white'
                                    : 'border-gray-300 dark:border-gray-500'
                                }`}
                              >
                                {secili && <CheckCheck size={12} />}
                              </div>
                              <span className="text-xs font-medium leading-tight">{k.baslik}</span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 4: İŞLEMLER VE MANUEL EKLEME */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex flex-col">
            <CardHeader
              title="İşlemler & Robot"
              icon={Play}
              colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            />

            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border border-green-100 dark:border-green-800/30">
                <p className="text-xs text-green-800 dark:text-green-400 font-medium mb-3">
                  Tüm ayarları tamamladıktan sonra robotu çalıştırın.
                </p>
                <button
                  onClick={robotCalistir}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play size={18} className="fill-current" />
                  </div>
                  ROBOTU ÇALIŞTIR
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex-1 flex flex-col">
                <span className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-2">
                  <Plus size={14} /> MANUEL EKLEME
                </span>

                <div className="space-y-3 flex-1">
                  <select
                    className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-xs bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-gray-200 outline-none"
                    value={manKonu}
                    onChange={(e) => setManKonu(e.target.value)}
                  >
                    <option value="">Eklenilecek Konuyu Seç...</option>
                    {konular.map((k) => (
                      <option key={k.id} value={k.baslik}>
                        {k.baslik}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
                      {/* Oturum Seçimi Butonları */}
                      {['sabah', 'ogle', 'ikisi'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setManOturumSecimi(opt as any)}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase ${
                            manOturumSecimi === opt
                              ? 'bg-white dark:bg-gray-600 shadow text-gray-800 dark:text-white'
                              : 'text-gray-500'
                          }`}
                        >
                          {opt === 'sabah' ? 'Sabah' : opt === 'ogle' ? 'Öğle' : 'Tümü'}
                        </button>
                      ))}
                    </div>
                    <input
                      className="w-full border border-gray-200 dark:border-gray-600 p-2 rounded-xl text-center text-xs bg-white dark:bg-gray-700 dark:text-white font-bold"
                      value={manSaat}
                      onChange={(e) => setManSaat(e.target.value)}
                      placeholder="Saat (örn: 09:00)"
                    />
                  </div>

                  <button
                    onClick={manuelEkle}
                    className="w-full bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 mt-auto"
                  >
                    <Plus size={16} /> LİSTEYE EKLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
