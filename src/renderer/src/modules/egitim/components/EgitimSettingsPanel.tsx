import { useState, useRef, useEffect } from 'react'
import {
  Calendar,
  Play,
  Plus,
  CheckSquare,
  Square,
  RefreshCw,
  Search,
  X,
  CheckCheck,
  Trash2
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

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col gap-6 overflow-y-auto shrink-0 shadow-lg z-10">
      <div className="space-y-3">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 border-b dark:border-gray-700 pb-1 justify-between">
          <span className="flex items-center gap-2">
            <Calendar size={18} /> Genel Ayarlar
          </span>
          <button
            onClick={refreshData}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Verileri Yenile"
          >
            <RefreshCw size={14} />
          </button>
        </h3>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Başlangıç</label>
          <input
            type="date"
            className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={tarih}
            onChange={(e) => setTarih(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Eğitici</label>
          <select
            className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={seciliEgitici}
            onChange={(e) => setSeciliEgitici(e.target.value)}
          >
            <option value="">Seçiniz...</option>
            {personelListesi.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ad_soyad} {p.unvan ? `(${p.unvan})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Düzenleyen</label>
          <select
            className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={seciliDuzenleyen}
            onChange={(e) => setSeciliDuzenleyen(e.target.value)}
          >
            <option value="">Seçiniz...</option>
            {duzenleyenler?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ad_soyad} {p.unvan ? `(${p.unvan})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
            Onaylayan (Eğitici)
          </label>
          <select
            className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={seciliOnaylayan}
            onChange={(e) => setSeciliOnaylayan(e.target.value)}
          >
            <option value="">Seçiniz...</option>
            {personelListesi?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ad_soyad} {p.unvan ? `(${p.unvan})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <Play size={18} /> Otomatik Robot
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-bold dark:text-gray-300">Saat</label>
            <input
              className="w-full border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-700 dark:text-white"
              value={saatHedefi}
              onChange={(e) => setSaatHedefi(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold dark:text-gray-300">Sabah</label>
            <input
              className="w-full border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-700 dark:text-white"
              value={sabahOturum}
              onChange={(e) => setSabahOturum(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold dark:text-gray-300">Öğle</label>
            <input
              className="w-full border dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-700 dark:text-white"
              value={ogleOturum}
              onChange={(e) => setOgleOturum(e.target.value)}
            />
          </div>
        </div>

        {/* === ZORUNLU DERS SEÇİMİ === */}
        <div className="relative" ref={menuRef}>
          {/* Açma/Kapama Butonu */}
          <button
            onClick={() => {
              setZorunluDersMenuAcik(!zorunluDersMenuAcik)
              if (!zorunluDersMenuAcik) setZorunluArama('')
            }}
            className="w-full bg-white dark:bg-gray-700 border border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 text-xs py-2 rounded-lg flex justify-between items-center px-3 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CheckSquare size={14} />
              {zorunluDersler.length > 0 ? (
                <span>
                  <span className="font-bold">{zorunluDersler.length}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /{konular.length} Zorunlu Ders
                  </span>
                </span>
              ) : (
                'Zorunlu Ders Seç...'
              )}
            </span>
            <span
              className={`transform transition-transform duration-200 ${zorunluDersMenuAcik ? 'rotate-45' : ''}`}
            >
              <Plus size={14} />
            </span>
          </button>

          {/* Seçili Derslerin Chip Gösterimi */}
          {!zorunluDersMenuAcik && zorunluDersler.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {zorunluDersler.slice(0, 4).map((ders) => (
                <span
                  key={ders}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-medium"
                >
                  {ders.length > 15 ? ders.slice(0, 15) + '...' : ders}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      zorunluDersToggle(ders)
                    }}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {zorunluDersler.length > 4 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] rounded-full font-medium">
                  +{zorunluDersler.length - 4} daha
                </span>
              )}
            </div>
          )}

          {/* Açılan Menü */}
          {zorunluDersMenuAcik && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
              {/* Arama */}
              <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Konu ara..."
                    value={zorunluArama}
                    onChange={(e) => setZorunluArama(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-1 focus:ring-blue-300 focus:border-blue-400 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Toplu İşlem Butonları */}
              <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  {zorunluDersler.length}/{konular.length} seçili
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={zorunluTumunuSec}
                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                    title="Tümünü Seç"
                  >
                    <CheckCheck size={12} /> Tümü
                  </button>
                  <button
                    onClick={zorunluTumunuTemizle}
                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                    title="Temizle"
                  >
                    <Trash2 size={12} /> Temizle
                  </button>
                </div>
              </div>

              {/* Konu Listesi */}
              <div className="max-h-64 overflow-y-auto">
                {filtrelenmisKonular.length === 0 ? (
                  <div className="p-4 text-center text-gray-400 text-xs">
                    {zorunluArama ? 'Sonuç bulunamadı.' : 'Konu listesi boş.'}
                  </div>
                ) : (
                  filtrelenmisKonular.map((k) => {
                    const secili = zorunluDersler.includes(k.baslik)
                    return (
                      <div
                        key={k.id}
                        onClick={() => zorunluDersToggle(k.baslik)}
                        className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors ${secili
                            ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        {secili ? (
                          <CheckSquare size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        ) : (
                          <Square size={14} className="text-gray-300 dark:text-gray-500 shrink-0" />
                        )}
                        {k.sira !== undefined && k.sira !== null && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono min-w-[20px]">
                            {k.sira}.
                          </span>
                        )}
                        <span
                          className={`flex-1 ${secili
                              ? 'font-bold text-blue-700 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-300'
                            }`}
                        >
                          {k.baslik}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={robotCalistir}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold shadow text-sm"
        >
          ROBOTU ÇALIŞTIR
        </button>
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 border-b dark:border-gray-700 pb-1">
          <Plus size={18} /> Manuel Ekle
        </h3>
        <select
          className="w-full border dark:border-gray-600 p-2 rounded text-sm bg-white dark:bg-gray-700 dark:text-white"
          value={manKonu}
          onChange={(e) => setManKonu(e.target.value)}
        >
          <option value="">Konu Seç...</option>
          {konular.map((k) => (
            <option key={k.id} value={k.baslik}>
              {k.baslik}
            </option>
          ))}
        </select>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
            Oturum Seçimi
          </label>
          <div className="flex gap-2 text-xs dark:text-gray-300">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="manOturum"
                checked={manOturumSecimi === 'sabah'}
                onChange={() => setManOturumSecimi('sabah')}
              />{' '}
              Sabah
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="manOturum"
                checked={manOturumSecimi === 'ogle'}
                onChange={() => setManOturumSecimi('ogle')}
              />{' '}
              Öğle
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="manOturum"
                checked={manOturumSecimi === 'ikisi'}
                onChange={() => setManOturumSecimi('ikisi')}
              />{' '}
              İkisi
            </label>
          </div>
        </div>

        <input
          className="w-full border dark:border-gray-600 p-2 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400 bg-white dark:bg-gray-700 dark:text-white"
          value={manSaat}
          onChange={(e) => setManSaat(e.target.value)}
          placeholder="Ders Saati"
        />
        <button
          onClick={manuelEkle}
          className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg font-bold text-sm"
        >
          LİSTEYE EKLE
        </button>
      </div>
    </div>
  )
}
