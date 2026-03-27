import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { ArsivKayit } from '../models/arsiv-types'
import { X, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react'

interface ArsivExcelImportModalProps {
  onClose: () => void
  onImport: (data: ArsivKayit[]) => void
}

const ORNEK_SABLON = [
  {
    'S.NO': '1',
    KOD: '121-02',
    'MALZEMENİN ADI VE KONUSU': 'Adres Beyan Formu',
    YIL: '2019',
    'KLASÖR ADETİ': '27',
    ADEDİ: '1-10390',
    'Saklama Süresi': '10',
    DÜŞÜNCELER: 'Saklama süresi bitiminde...'
  }
]

export const ArsivExcelImportModal = ({ onClose, onImport }: ArsivExcelImportModalProps) => {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer)
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]

      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
      let headerRowIndex = 0

      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i]
        const rowStr = row.map((cell) => String(cell).trim().toUpperCase())
        if (
          rowStr.includes('S.NO') ||
          rowStr.includes('KOD') ||
          rowStr.includes('MALZEMENİN ADI VE KONUSU')
        ) {
          headerRowIndex = i
          break
        }
      }

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex })

      const parsedData = jsonData.map((row: any, index: number) => {
        let basNo = ''
        let bitisNo = ''
        let evrakSayisi = 0

        const adediStr = String(row['ADEDİ'] || '').trim()
        if (adediStr.includes('-')) {
          const parts = adediStr.split('-')
          basNo = parts[0].trim()
          bitisNo = parts[1].trim()
          const start = parseInt(basNo) || 0
          const end = parseInt(bitisNo) || 0
          evrakSayisi = end >= start ? end - start + 1 : 0
        } else {
          basNo = adediStr
          bitisNo = adediStr
          evrakSayisi = 1
        }

        const klasorAdetiStr = String(row['KLASÖR ADETİ'] || '').trim()
        if (klasorAdetiStr && !isNaN(parseInt(klasorAdetiStr))) {
          evrakSayisi = parseInt(klasorAdetiStr)
        }

        const aciklama = row['DÜŞÜNCELER'] || ''

        return {
          klasor_adi: row['MALZEMENİN ADI VE KONUSU'] || '',
          tipi: 'KLASÖR',
          yili: String(row['YIL'] || new Date().getFullYear()),
          klasor_no: String(row['S.NO'] || '0'),
          bas_no: basNo,
          bitis_no: bitisNo,
          evrak_sayisi: evrakSayisi,
          saklama_suresi: row['Saklama Süresi'] || 10,
          dosyalama_kodu: String(row['KOD'] || ''),
          aciklama: aciklama,
          konum: '',
          imha_durumu: 'NORMAL',
          sira: index
        }
      })

      const validData = parsedData.filter((d: any) => d.klasor_adi && d.yili)

      if (validData.length === 0) {
        setError(
          'Geçerli veri bulunamadı. Lütfen sütun isimlerini kontrol edin (KOD, MALZEMENİN ADI VE KONUSU, YIL, vb.).'
        )
      } else {
        setData(validData)
      }
    } catch (err) {
      console.error(err)
      setError('Dosya okunurken hata oluştu. Lütfen geçerli bir Excel dosyası yükleyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(ORNEK_SABLON)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Şablon')
    XLSX.writeFile(wb, 'Arsiv_Sablon.xlsx')
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-3xl rounded-2xl border border-white/20 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center bg-transparent border-b border-gray-100/50 dark:border-gray-800/50 relative">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <FileSpreadsheet size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-800 dark:text-white tracking-tight leading-none mb-0.5 uppercase">
                Excel&apos;den Veri Aktarımı
              </h2>
              <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">
                Toplu Kayıt İşlemi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 relative scrollbar-hide">
          {!data.length && !loading && (
            <div
              className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50/30 dark:bg-gray-900/30 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all cursor-pointer overflow-hidden shadow-inner"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls"
              />

              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:scale-110 group-hover:text-emerald-500 transition-all duration-500 border border-gray-100 dark:border-gray-700 relative z-10">
                <Upload size={22} strokeWidth={2.5} />
              </div>

              <div className="text-center mt-4 relative z-10">
                <p className="text-sm font-black text-gray-800 dark:text-white tracking-tight mb-0.5 uppercase">
                  Excel dosyasını seçin
                </p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 max-w-[220px] mx-auto leading-tight">
                  Dosyayı sürükleyin veya tıklayın.
                </p>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-700">.xlsx</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[8px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-200 dark:border-gray-700">.xls</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadTemplate()
                }}
                className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-black text-[8px] uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-900/50 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all relative z-10"
              >
                Şablon İndir
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <div className="w-10 h-10 border-3 border-indigo-500/20 rounded-full"></div>
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="mt-4 text-xs font-black text-gray-800 dark:text-white uppercase tracking-widest">İşleniyor...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 dark:border-red-500/30 p-3 rounded-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 shadow-inner">
              <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                <AlertCircle size={16} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-black text-red-600 dark:text-red-400 text-[9px] uppercase tracking-wide">Hata</h4>
                <p className="text-[9px] font-bold text-red-500/80 dark:text-red-400/80 leading-tight">{error}</p>
              </div>
            </div>
          )}

          {data.length > 0 && (
            <div className="space-y-3 animate-in fade-in duration-500">
              <div className="flex justify-between items-center px-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase tracking-wider">{data.length} kayıt</span>
                  </div>
                </div>
                <button
                  onClick={() => setData([])}
                  className="px-2 py-0.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-[8px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  Temizle
                </button>
              </div>

              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg shadow-gray-200/20 dark:shadow-none relative">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-2 py-1.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Klasör Adı</th>
                      <th className="px-2 py-1.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Yıl</th>
                      <th className="px-2 py-1.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Kod</th>
                      <th className="px-2 py-1.5 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Düşünce</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.slice(0, 10).map((row, i) => (
                      <tr key={i} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                        <td className="px-2 py-1.5">
                          <span className="font-bold text-[10px] text-gray-800 dark:text-white uppercase tracking-tight">{row.klasor_adi}</span>
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-black text-[9px] text-gray-600 dark:text-gray-400">{row.yili}</span>
                        </td>
                        <td className="px-2 py-1.5 text-center font-black text-[10px] text-blue-600 dark:text-blue-400 tracking-tighter uppercase whitespace-nowrap">
                          {row.dosyalama_kodu}
                        </td>
                        <td className="px-2 py-1.5">
                          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 italic line-clamp-1">
                            {row.aciklama || '-'}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 10 && (
                  <div className="px-2 py-1.5 text-center bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">+{data.length - 10} kayıt daha</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100/50 dark:border-gray-800/50 flex justify-end gap-2 bg-gray-50/30 dark:bg-gray-950/30 relative">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg font-black text-[9px] uppercase tracking-[0.15em] border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
          >
            Vazgeç
          </button>
          <button
            onClick={() => onImport(data)}
            disabled={data.length === 0 || loading}
            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.15em] shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:grayscale disabled:shadow-none"
          >
            <Check size={14} strokeWidth={3} />
            Aktar
          </button>
        </div>
      </div>
    </div>
  )
}
