import { Calendar, Play, Plus, CheckSquare, Square, RefreshCw } from 'lucide-react'
import { EgitimKonu, PersonelBasic } from '../models/egitim-types'

interface EgitimSettingsPanelProps {
  tarih: string
  setTarih: (val: string) => void
  seciliEgitici: string
  setSeciliEgitici: (val: string) => void
  duzenleyenler: PersonelBasic[]
  seciliDuzenleyen: string
  setSeciliDuzenleyen: (val: string) => void
  personelListesi: PersonelBasic[]
  saatHedefi: string
  setSaatHedefi: (val: string) => void
  sabahOturum: string
  setSabahOturum: (val: string) => void
  ogleOturum: string
  setOgleOturum: (val: string) => void
  zorunluDersler: string[]
  zorunluDersToggle: (baslik: string) => void
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
  personelListesi,
  saatHedefi,
  setSaatHedefi,
  sabahOturum,
  setSabahOturum,
  ogleOturum,
  setOgleOturum,
  zorunluDersler,
  zorunluDersToggle,
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
        <div className="relative">
          <button
            onClick={() => setZorunluDersMenuAcik(!zorunluDersMenuAcik)}
            className="w-full bg-white dark:bg-gray-700 border border-blue-200 dark:border-gray-600 text-blue-700 dark:text-blue-300 text-xs py-2 rounded flex justify-between items-center px-2"
          >
            <span>
              {zorunluDersler.length > 0 ? `${zorunluDersler.length} Seçildi` : 'Zorunlu Dersler'}
            </span>
            <Plus size={14} />
          </button>
          {zorunluDersMenuAcik && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-xl max-h-48 overflow-y-auto z-20 p-2">
              {konular.map((k) => (
                <div
                  key={k.id}
                  onClick={() => zorunluDersToggle(k.baslik)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-50 cursor-pointer text-xs border-b last:border-0"
                >
                  {zorunluDersler.includes(k.baslik) ? (
                    <CheckSquare size={14} className="text-blue-600" />
                  ) : (
                    <Square size={14} className="text-gray-400" />
                  )}
                  <span
                    className={
                      zorunluDersler.includes(k.baslik)
                        ? 'font-bold text-blue-700 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300'
                    }
                  >
                    {k.baslik}
                  </span>
                </div>
              ))}
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
