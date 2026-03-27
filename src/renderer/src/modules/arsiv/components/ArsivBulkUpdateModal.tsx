import { DUSUNCELER } from '../models/arsiv-types'

interface ArsivBulkUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  count: number
  klasorTanimlari: any[]
  form: any
  setForm: (val: any) => void
  arsivDusunceler: any[]
}

export const ArsivBulkUpdateModal = ({
  isOpen,
  onClose,
  onConfirm,
  count,
  klasorTanimlari,
  form,
  setForm,
  arsivDusunceler
}: ArsivBulkUpdateModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-600 text-white p-3 font-bold text-center text-sm tracking-wide uppercase">
          TOPLU GÜNCELLEME ({count} Kayıt)
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="text-xs text-gray-500 col-span-2 mb-2 italic">
            * Sadece değiştirmek istediğiniz alanları doldurun. Boş bırakılan alanlar
            değişmeyecektir.
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500">Klasör Adı</label>
            <input
              list="klasorListesi"
              className="w-full border p-2 rounded"
              placeholder="(Aynı Kalsın)"
              value={form.klasor_adi}
              onChange={(e) => setForm({ ...form, klasor_adi: e.target.value })}
            />
            <datalist id="klasorListesi">
              {klasorTanimlari.map((t: any) => (
                <option key={t.id} value={t.ad} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Tipi</label>
            <select
              className="w-full border p-2 rounded"
              value={form.tipi}
              onChange={(e) => setForm({ ...form, tipi: e.target.value })}
            >
              <option value="">(Değiştirme)</option>
              <option>KLASÖR</option>
              <option>DOSYA</option>
              <option>KUTU</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Yılı</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="(Aynı Kalsın)"
              value={form.yili}
              onChange={(e) => setForm({ ...form, yili: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Dosya Kodu</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="(Aynı Kalsın)"
              value={form.dosyalama_kodu}
              onChange={(e) => setForm({ ...form, dosyalama_kodu: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500">Saklama (Yıl)</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="(Aynı Kalsın)"
              value={form.saklama_suresi}
              onChange={(e) => setForm({ ...form, saklama_suresi: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500">Konum / Raf</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="(Aynı Kalsın)"
              value={form.konum}
              onChange={(e) => setForm({ ...form, konum: e.target.value })}
            />
          </div>

          {/* DÜŞÜNCELER (TOPLU) */}
          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500">Düşünceler</label>
            <input
              list="dusunceListesiToplu"
              className="w-full border p-2 rounded"
              placeholder="(Aynı Kalsın) veya Seçin/Yazın"
              value={form.aciklama}
              onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
            />
            <datalist id="dusunceListesiToplu">
              {arsivDusunceler.map((d: any) => (
                <option key={d.id} value={d.aciklama} />
              ))}
              {DUSUNCELER.map((d, i) => (
                <option key={`toplu-def-${i}`} value={d} />
              ))}
            </datalist>
          </div>

          <div className="col-span-2">
            <label className="text-xs font-bold text-gray-500">İmha Durumu</label>
            <select
              className="w-full border p-2 rounded"
              value={form.imha_durumu}
              onChange={(e) => setForm({ ...form, imha_durumu: e.target.value })}
            >
              <option value="">(Değiştirme)</option>
              <option value="NORMAL">NORMAL</option>
              <option value="IMHALIK">İMHALIK</option>
            </select>
          </div>
        </div>
        <div className="bg-gray-50 p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-100 font-bold text-gray-600"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 shadow-md"
          >
            GÜNCELLE
          </button>
        </div>
      </div>
    </div>
  )
}
