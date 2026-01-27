import { X, Paperclip, Edit2, Trash2 } from 'lucide-react'
import { TakvimEtkinlik } from '../models/takvim-types'

interface TakvimDetailModalProps {
  isOpen: boolean
  onClose: () => void
  seciliTarih: string
  aktifGunEtkinlikleri: TakvimEtkinlik[]
  onFileOpen: (path: string) => void
  onEdit: (item: TakvimEtkinlik) => void
  onDelete: (id: number) => void
  duzenlemeModu: number | null
  yeniEtkinlik: { baslik: string; dosya_yolu: string; tarih: string }
  setYeniEtkinlik: (val: { baslik: string; dosya_yolu: string; tarih: string }) => void
  onFileSelect: () => void
  onCancelEdit: () => void
  onSave: () => void
}

export const TakvimDetailModal = ({
  isOpen,
  onClose,
  seciliTarih,
  aktifGunEtkinlikleri,
  onFileOpen,
  onEdit,
  onDelete,
  duzenlemeModu,
  yeniEtkinlik,
  setYeniEtkinlik,
  onFileSelect,
  onCancelEdit,
  onSave
}: TakvimDetailModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <div className="flex justify-end p-2 absolute top-0 right-0 z-10">
          <button
            onClick={onClose}
            className="bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-full backdrop-blur-sm transition-all shadow-sm border border-gray-100 dark:border-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              Günün Etkinlikleri
            </h4>
            {aktifGunEtkinlikleri.length === 0 && (
              <div className="text-sm text-gray-400 italic">Etkinlik yok.</div>
            )}

            {aktifGunEtkinlikleri.map((etk, i) => {
              const isResmi = etk.tur === 'RESMI' || etk.tur === 'DINI'
              return (
                <div
                  key={etk.id || i}
                  className={`p-3 border rounded-lg flex justify-between items-center group ${isResmi ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-200' : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{etk.baslik}</div>
                    {etk.dosya_yolu && (
                      <button
                        onClick={() => onFileOpen(etk.dosya_yolu!)}
                        className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline mt-1"
                      >
                        <Paperclip size={12} /> Dosyayı Aç
                      </button>
                    )}
                  </div>
                  {!isResmi && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onEdit(etk)}
                        className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(etk.id as number)}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-3">
              {duzenlemeModu ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}
            </h4>
            <div className="space-y-3">
              <input
                type="date"
                className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                value={yeniEtkinlik.tarih || seciliTarih}
                onChange={(e) => setYeniEtkinlik({ ...yeniEtkinlik, tarih: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                placeholder="Başlık giriniz..."
                value={yeniEtkinlik.baslik}
                onChange={(e) => setYeniEtkinlik({ ...yeniEtkinlik, baslik: e.target.value })}
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={onFileSelect}
                  className="flex-1 border border-dashed border-blue-300 dark:border-blue-700 p-2 rounded text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center gap-2 truncate transition-colors"
                >
                  <Paperclip size={14} />{' '}
                  {yeniEtkinlik.dosya_yolu ? 'Dosya Seçildi (Değiştir)' : 'Dosya Ekle (Opsiyonel)'}
                </button>
                {duzenlemeModu && (
                  <button
                    onClick={onCancelEdit}
                    className="text-xs text-gray-500 dark:text-gray-400 underline hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    İptal
                  </button>
                )}
              </div>

              <button
                onClick={onSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-sm shadow-sm"
              >
                {duzenlemeModu ? 'GÜNCELLE' : 'KAYDET'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
