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

      // 1. Tüm veriyi önce array of arrays olarak alalım
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

      // 2. Başlık satırını bulalım (S.NO veya KOD içeren satır)
      let headerRowIndex = 0

      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i]
        // Satırdaki değerlerden herhangi biri beklediğimiz başlıkları içeriyor mu?
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

      // 3. Veriyi başlık satırına göre JSON'a çevirelim
      // headerRowIndex + 1'den başlayarak verileri alacağız
      // sheet_to_json'a range vererek de yapabiliriz ama manuel maplemek daha kontrollü olabilir
      // Veya range seçeneğiyle tekrar okuyabiliriz:
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: headerRowIndex })

      const parsedData = jsonData.map((row: any, index: number) => {
        // ADEDİ parsing (e.g., "1-10390")
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
          // Tek sayı ise veya format farklıysa
          basNo = adediStr
          bitisNo = adediStr
          evrakSayisi = 1
        }

        // Klasör Adeti varsa oradan al, yoksa range hesapla
        const klasorAdetiStr = String(row['KLASÖR ADETİ'] || '').trim()
        if (klasorAdetiStr && !isNaN(parseInt(klasorAdetiStr))) {
          evrakSayisi = parseInt(klasorAdetiStr)
        }

        // Açıklama sadece DÜŞÜNCELER olsun
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
          konum: '', // Excel'de yok, boş bırakıyoruz
          imha_durumu: 'NORMAL',
          sira: index // Sıralamayı korumak için
        }
      })

      // Basit doğrulama
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-green-600" />
            Excel'den İçe Aktar
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Upload Area */}
          {!data.length && (
            <div
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-10 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls"
              />
              <Upload className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                Excel dosyasını seçin veya buraya sürükleyin
              </p>
              <p className="text-sm text-slate-500 mt-2">.xlsx veya .xls formatında</p>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadTemplate()
                }}
                className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
              >
                Örnek Şablon İndir
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Dosya işleniyor...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Preview Table */}
          {data.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {data.length} kayıt bulundu
                </span>
                <button
                  onClick={() => setData([])}
                  className="text-red-600 hover:underline text-sm"
                >
                  Listeyi Temizle
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3">Klasör Adı</th>
                      <th className="p-3">Yılı</th>
                      <th className="p-3">Tip</th>
                      <th className="p-3">Dosyalama Kodu</th>
                      <th className="p-3">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {data.slice(0, 20).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="p-3 font-medium">{row.klasor_adi}</td>
                        <td className="p-3">{row.yili}</td>
                        <td className="p-3">{row.tipi}</td>
                        <td className="p-3">{row.dosyalama_kodu}</td>
                        <td className="p-3 text-slate-500 truncate max-w-[200px]">
                          {row.aciklama}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length > 20 && (
                  <div className="p-2 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    ... ve {data.length - 20} kayıt daha
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={() => onImport(data)}
            disabled={data.length === 0 || loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            İçe Aktar
          </button>
        </div>
      </div>
    </div>
  )
}
