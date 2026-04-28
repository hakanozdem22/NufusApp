import React, { useState } from 'react'
import { X, Upload, Database, Check } from 'lucide-react'

interface EnvanterImportModalProps {
  onClose: () => void
  onSuccess: () => void
}

export const EnvanterImportModal: React.FC<EnvanterImportModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1) // 1: File, 2: Table, 3: Mapping, 4: Preview/Import
  const [dbPath, setDbPath] = useState<string | null>(null)
  const [tables, setTables] = useState<string[]>([])
  const [dbColumns, setDbColumns] = useState<string[]>([])
  const [dbData, setDbData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // System columns we want to map to
  const systemColumns = [
    { key: 'ad', label: 'Malzeme Adı (Zorunlu)', required: true },
    { key: 'marka', label: 'Marka', required: false },
    { key: 'kategori', label: 'Kategori', required: false },
    { key: 'adet', label: 'Adet', required: false },
    { key: 'konum', label: 'Konum', required: false },
    { key: 'personel', label: 'Zimmetli Personel', required: false },
    { key: 'durum', label: 'Durum', required: false },
    { key: 'aciklama', label: 'Açıklama', required: false },
    { key: 'seri_no', label: 'Seri No', required: false },
    { key: 'tarih', label: 'Tarih', required: false }
  ]

  const [mapping, setMapping] = useState<Record<string, string>>({})

  const handleSelectFile = async () => {
    try {
      const path = await window.api.selectFile([
        { name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }
      ])
      if (path) {
        setDbPath(path)
        setLoading(true)
        setError(null)

        const res = await window.api.getDbTables(path)
        setLoading(false)

        if (res.success) {
          setTables(res.tables || [])
          setStep(2)
        } else {
          setError(res.error || 'Tablolar okunamadı')
        }
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSelectTable = async (tableName: string) => {
    setLoading(true)
    setError(null)

    const res = await window.api.readDbTable(dbPath!, tableName)
    setLoading(false)

    if (res.success && res.data && res.data.length > 0) {
      setDbData(res.data)
      const cols = Object.keys(res.data[0])
      setDbColumns(cols)

      // Auto-map if names match
      const initialMap: Record<string, string> = {}
      systemColumns.forEach((sysCol) => {
        // Try exact match or loose match
        const match = cols.find(
          (c) =>
            c.toLowerCase() === sysCol.key.toLowerCase() ||
            c.toLowerCase().includes(sysCol.key.toLowerCase())
        )
        if (match) {
          initialMap[sysCol.key] = match
        }
      })
      setMapping(initialMap)

      setStep(3)
    } else {
      setError(res.error || 'Tablo boş veya okunamadı')
    }
  }

  const handleImport = async () => {
    setLoading(true)
    setError(null)

    try {
      // Transform data
      const materialsToImport = dbData.map((row) => {
        const item: any = {}
        Object.keys(mapping).forEach((sysKey) => {
          const dbKey = mapping[sysKey]
          if (dbKey) {
            item[sysKey] = row[dbKey]
          }
        })

        // Defaults/Fixes
        if (!item.ad) item.ad = 'İsimsiz Malzeme'
        if (item.adet) item.adet = Number(item.adet) || 1
        if (!item.durum) item.durum = 'Sağlam'

        return item
      })

      const res = await window.api.addEnvanterBatch(materialsToImport)
      setLoading(false)

      if (res.success) {
        onSuccess()
        onClose()
      } else {
        setError('İçe aktarma başarısız oldu')
      }
    } catch (err: any) {
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Veri Aktar (SQLite .db)
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

          {step === 1 && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Database size={48} className="text-gray-400" />
              <p className="text-gray-600 dark:text-gray-300">
                Veritabanı dosyasını (.db, .sqlite) seçin
              </p>
              <button
                onClick={handleSelectFile}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload size={18} />
                <span>{loading ? 'Dosya Okunuyor...' : 'Dosya Seç'}</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Tablo Seçin:</h4>
              <div className="space-y-2">
                {tables.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSelectTable(t)}
                    className="w-full text-left p-3 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
                  >
                    {t}
                  </button>
                ))}
              </div>
              {tables.length === 0 && <p>Tablo bulunamadı.</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                Sütun Eşleştirme ({dbData.length} kayıt)
              </h4>
              <div className="space-y-3">
                {systemColumns.map((col) => (
                  <div key={col.key} className="flex items-center space-x-4">
                    <div className="w-1/3 text-sm text-gray-600 dark:text-gray-400">
                      {col.label} {col.required && <span className="text-red-500">*</span>}
                    </div>
                    <div className="flex-1">
                      <select
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        value={mapping[col.key] || ''}
                        onChange={(e) =>
                          setMapping((prev) => ({ ...prev, [col.key]: e.target.value }))
                        }
                      >
                        <option value="">-- Seçiniz --</option>
                        {dbColumns.map((dbCol) => (
                          <option key={dbCol} value={dbCol}>
                            {dbCol}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          {step > 1 && (
            <button
              onClick={() => {
                if (step === 2) setStep(1)
                if (step === 3) setStep(2)
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
              disabled={loading}
            >
              Geri
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleImport}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Aktarılıyor...' : importBtnText(dbData.length)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function importBtnText(count: number) {
  return (
    <>
      <Check size={18} />
      <span>{count} Kaydı Aktar</span>
    </>
  )
}
