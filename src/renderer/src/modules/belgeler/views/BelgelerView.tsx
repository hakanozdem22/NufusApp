import { useState, useEffect, ReactElement } from 'react'
import {
  FileText,
  Plus,
  Trash2,
  Search,
  FolderOpen,
  ExternalLink,
  Tag,
  X,
  Edit2,
  Check,
  ChevronDown,
  BookOpen,
  FolderSync,
  AlertCircle,
  Eraser
} from 'lucide-react'

interface Belge {
  id: string
  ad: string
  aciklama: string
  kategori: string
  dosya_yolu: string
  olusturma_tarihi: string
}

interface Kategori {
  id: string
  ad: string
}

const formatDate = (iso?: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const BelgelerView = (): ReactElement => {
  const [belgeler, setBelgeler] = useState<Belge[]>([])
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])
  const [arama, setArama] = useState('')
  const [secilenKategori, setSecilenKategori] = useState<string>('Tümü')
  const [modalAcik, setModalAcik] = useState(false)
  const [silOnay, setSilOnay] = useState<string | null>(null)
  const [duzenle, setDuzenle] = useState<Belge | null>(null)
  const [kategoriModalAcik, setKategoriModalAcik] = useState(false)
  const [yeniKategoriAdi, setYeniKategoriAdi] = useState('')
  const [duzenleKategori, setDuzenleKategori] = useState<Kategori | null>(null)
  const [silKategoriOnay, setSilKategoriOnay] = useState<string | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)
  const [klasorTaramaAcik, setKlasorTaramaAcik] = useState(false)
  const [taramaSonuclari, setTaramaSonuclari] = useState<{ ad: string; dosya_yolu: string; kategori: string }[]>([])
  const [temizleniyor, setTemizleniyor] = useState(false)
  const [taramaSecili, setTaramaSecili] = useState<Set<string>>(new Set())
  const [taramaKlasoru, setTaramaKlasoru] = useState('')
  const [taramaYukleniyor, setTaramaYukleniyor] = useState(false)
  const [taramaKaydediliyor, setTaramaKaydediliyor] = useState(false)

  const [form, setForm] = useState<{ ad: string; aciklama: string; kategori: string; dosya_yolu: string }>({
    ad: '',
    aciklama: '',
    kategori: 'Genel',
    dosya_yolu: ''
  })

  const yukle = async (): Promise<void> => {
    try {
      const [belgeData, kategoriData] = await Promise.all([
        window.api.getBelgeler(),
        window.api.getBelgelerKategoriler()
      ])
      setBelgeler(belgeData || [])
      setKategoriler(kategoriData || [])
    } catch (e) {
      console.error('Belgeler yüklenemedi:', e)
    }
  }

  useEffect(() => {
    yukle()
  }, [])

  const dosyaSec = async (): Promise<void> => {
    const yol = await window.api.selectPdfFile()
    if (yol) {
      const dosyaAdi = yol.split(/[\\/]/).pop() || ''
      setForm((f) => ({
        ...f,
        dosya_yolu: yol,
        ad: f.ad || dosyaAdi.replace(/\.pdf$/i, '')
      }))
    }
  }

  const modalAc = (belge?: Belge): void => {
    setHata(null)
    if (belge) {
      setDuzenle(belge)
      setForm({ ad: belge.ad, aciklama: belge.aciklama, kategori: belge.kategori, dosya_yolu: belge.dosya_yolu })
    } else {
      setDuzenle(null)
      setForm({ ad: '', aciklama: '', kategori: kategoriler[0]?.ad || 'Genel', dosya_yolu: '' })
    }
    setModalAcik(true)
  }

  const modalKapat = (): void => {
    setModalAcik(false)
    setDuzenle(null)
    setHata(null)
  }

  const kaydet = async (): Promise<void> => {
    if (!form.ad.trim()) { setHata('Belge adı zorunludur.'); return }
    if (!form.dosya_yolu && !duzenle) { setHata('PDF dosyası seçilmedi.'); return }
    setYukleniyor(true)
    setHata(null)
    try {
      if (duzenle) {
        await window.api.updateBelge({ id: duzenle.id, ...form })
      } else {
        await window.api.addBelge(form)
      }
      await yukle()
      modalKapat()
    } catch (e: any) {
      setHata('Kayıt sırasında hata oluştu.')
    } finally {
      setYukleniyor(false)
    }
  }

  const sil = async (id: string): Promise<void> => {
    try {
      await window.api.deleteBelge(id)
      await yukle()
    } catch (e) {
      console.error('Silme hatası:', e)
    } finally {
      setSilOnay(null)
    }
  }

  const belgeyiAc = async (dosya_yolu: string): Promise<void> => {
    if (dosya_yolu) await window.api.openFile(dosya_yolu)
  }

  const klasorSec = async (): Promise<void> => {
    const yol = await window.api.selectFolder()
    if (!yol) return
    setTaramaKlasoru(yol)
    setTaramaYukleniyor(true)
    setTaramaSonuclari([])
    setTaramaSecili(new Set())
    try {
      const sonuclar = await window.api.scanFolderPdfs(yol)
      const mevcutYollar = new Set(belgeler.map((b) => b.dosya_yolu))
      const yeniDosyalar = sonuclar.filter((s: any) => !mevcutYollar.has(s.dosya_yolu))
      setTaramaSonuclari(yeniDosyalar)
      setTaramaSecili(new Set(yeniDosyalar.map((_: any, i: number) => String(i))))
    } catch (e) {
      console.error('Klasör tarama hatası:', e)
    } finally {
      setTaramaYukleniyor(false)
    }
  }

  const taramaKaydet = async (): Promise<void> => {
    const secililer = taramaSonuclari.filter((_, i) => taramaSecili.has(String(i)))
    if (secililer.length === 0) return
    setTaramaKaydediliyor(true)
    try {
      const mevcutKategoriAdlari = new Set(kategoriler.map((k) => k.ad))
      const yeniKategoriler = [...new Set(secililer.map((s) => s.kategori))].filter(
        (ad) => ad !== 'Genel' && !mevcutKategoriAdlari.has(ad)
      )
      for (const ad of yeniKategoriler) {
        await window.api.addBelgeKategori(ad)
      }
      for (const belge of secililer) {
        await window.api.addBelge(belge)
      }
      await yukle()
      setKlasorTaramaAcik(false)
      setTaramaSonuclari([])
      setTaramaSecili(new Set())
      setTaramaKlasoru('')
    } catch (e) {
      console.error('Toplu kayıt hatası:', e)
    } finally {
      setTaramaKaydediliyor(false)
    }
  }

  const ciftleriTemizle = async (): Promise<void> => {
    setTemizleniyor(true)
    try {
      const tumBelgeler = await window.api.getBelgeler()
      const gruplar = new Map<string, string[]>()
      for (const b of tumBelgeler) {
        const yol = b.dosya_yolu || ''
        if (!gruplar.has(yol)) gruplar.set(yol, [])
        gruplar.get(yol)!.push(b.id)
      }
      for (const [, ids] of gruplar) {
        for (const id of ids.slice(1)) {
          await window.api.deleteBelge(id)
        }
      }
      await yukle()
    } catch (e) {
      console.error('Temizleme hatası:', e)
    } finally {
      setTemizleniyor(false)
    }
  }

  // Kategori CRUD
  const kategoriKaydet = async (): Promise<void> => {
    if (!yeniKategoriAdi.trim()) return
    try {
      if (duzenleKategori) {
        await window.api.updateBelgeKategori({ id: duzenleKategori.id, ad: yeniKategoriAdi.trim() })
      } else {
        await window.api.addBelgeKategori(yeniKategoriAdi.trim())
      }
      setYeniKategoriAdi('')
      setDuzenleKategori(null)
      await yukle()
    } catch (e) {
      console.error('Kategori kaydedilemedi:', e)
    }
  }

  const kategoriSil = async (id: string): Promise<void> => {
    try {
      await window.api.deleteBelgeKategori(id)
      if (secilenKategori === kategoriler.find((k) => k.id === id)?.ad) setSecilenKategori('Tümü')
      await yukle()
    } catch (e) {
      console.error('Kategori silinemedi:', e)
    } finally {
      setSilKategoriOnay(null)
    }
  }

  const tumKategoriler = ['Tümü', ...kategoriler.map((k) => k.ad)]

  const filtreliBelgeler = belgeler.filter((b) => {
    const aramaUyumu =
      !arama ||
      b.ad.toLowerCase().includes(arama.toLowerCase()) ||
      b.aciklama?.toLowerCase().includes(arama.toLowerCase()) ||
      b.kategori?.toLowerCase().includes(arama.toLowerCase())
    const kategoriUyumu = secilenKategori === 'Tümü' || b.kategori === secilenKategori
    return aramaUyumu && kategoriUyumu
  })

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-gray-950">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-md shadow-red-200 dark:shadow-red-900">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-black text-gray-800 dark:text-gray-100 tracking-tight">Belgeler Arşivi</h1>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{belgeler.length} belge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKategoriModalAcik(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Tag size={14} />
            Kategoriler
          </button>
          <button
            onClick={ciftleriTemizle}
            disabled={temizleniyor}
            title="Aynı dosya yoluna sahip çift kayıtları sil"
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-xl border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50 transition-colors"
          >
            <Eraser size={14} />
            {temizleniyor ? 'Temizleniyor...' : 'Çiftleri Temizle'}
          </button>
          <button
            onClick={() => { setKlasorTaramaAcik(true); setTaramaSonuclari([]); setTaramaKlasoru('') }}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold rounded-xl border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <FolderSync size={14} />
            Klasörden Ekle
          </button>
          <button
            onClick={() => modalAc()}
            className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200 dark:shadow-red-900 transition-all"
          >
            <Plus size={14} />
            Belge Ekle
          </button>
        </div>
      </div>

      {/* FİLTRE */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
            placeholder="Belge ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {tumKategoriler.map((k) => (
            <button
              key={k}
              onClick={() => setSecilenKategori(k)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                secilenKategori === k
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* BELGE LİSTESİ */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtreliBelgeler.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <FileText size={28} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-[13px] font-bold text-gray-400 dark:text-gray-500">Belge bulunamadı</p>
            <p className="text-[11px] text-gray-300 dark:text-gray-600 mt-1">
              {arama ? 'Arama kriterlerini değiştirin' : '"Belge Ekle" veya "Klasörden Ekle" ile PDF ekleyebilirsiniz'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtreliBelgeler.map((belge) => (
              <div
                key={belge.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer"
                  onClick={() => belgeyiAc(belge.dosya_yolu)}
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-gray-800 dark:text-gray-100 truncate leading-tight">
                      {belge.ad}
                    </h3>
                    {belge.aciklama && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-tight">
                        {belge.aciklama}
                      </p>
                    )}
                  </div>
                  <ExternalLink size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-red-400 transition-colors shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center justify-between px-4 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {belge.kategori}
                    </span>
                    <span className="text-[10px] text-gray-300 dark:text-gray-600">
                      {formatDate(belge.olusturma_tarihi)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); modalAc(belge) }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSilOnay(belge.id) }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BELGE EKLE / DÜZENLE MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-[14px] font-black text-gray-800 dark:text-gray-100">
                {duzenle ? 'Belgeyi Düzenle' : 'Yeni Belge Ekle'}
              </h2>
              <button onClick={modalKapat} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">PDF Dosyası</label>
                <div
                  onClick={dosyaSec}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <FolderOpen size={15} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {form.dosya_yolu ? (
                      <p className="text-[12px] font-bold text-gray-700 dark:text-gray-300 truncate">
                        {form.dosya_yolu.split(/[\\/]/).pop()}
                      </p>
                    ) : (
                      <p className="text-[12px] text-gray-400">Tıklayarak PDF seçin</p>
                    )}
                  </div>
                  {form.dosya_yolu && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, dosya_yolu: '' })) }}
                      className="p-1 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Belge Adı *</label>
                <input
                  className="w-full px-3 py-2 text-[13px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
                  placeholder="Belgenin adı"
                  value={form.ad}
                  onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Açıklama</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 text-[13px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800 resize-none"
                  placeholder="İsteğe bağlı açıklama..."
                  value={form.aciklama}
                  onChange={(e) => setForm((f) => ({ ...f, aciklama: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Kategori</label>
                <div className="relative">
                  <select
                    className="w-full px-3 py-2 text-[13px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800 appearance-none"
                    value={form.kategori}
                    onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
                  >
                    <option value="Genel">Genel</option>
                    {kategoriler.map((k) => (
                      <option key={k.id} value={k.ad}>{k.ad}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {hata && <p className="text-[12px] text-red-500 font-semibold">{hata}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={modalKapat} className="px-4 py-2 text-[12px] font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                İptal
              </button>
              <button
                onClick={kaydet}
                disabled={yukleniyor}
                className="px-5 py-2 text-[12px] font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors shadow-md shadow-red-200 dark:shadow-red-900"
              >
                {yukleniyor ? 'Kaydediliyor...' : duzenle ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SİL ONAY MODAL */}
      {silOnay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-[14px] font-black text-gray-800 dark:text-gray-100">Belgeyi Sil</h3>
                <p className="text-[12px] text-gray-400 dark:text-gray-500">Bu işlem geri alınamaz.</p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setSilOnay(null)} className="px-4 py-2 text-[12px] font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                İptal
              </button>
              <button onClick={() => sil(silOnay)} className="px-4 py-2 text-[12px] font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors">
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KLASÖR TARAMA MODAL */}
      {klasorTaramaAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FolderSync size={15} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-[14px] font-black text-gray-800 dark:text-gray-100">Klasörden Toplu Ekle</h2>
                  {taramaKlasoru && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-xs">{taramaKlasoru}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setKlasorTaramaAcik(false); setTaramaSonuclari([]); setTaramaKlasoru('') }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!taramaKlasoru && (
                <div
                  onClick={klasorSec}
                  className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer transition-colors group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderOpen size={26} className="text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300">Klasör Seç</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Alt klasörler dahil tüm PDF'ler taranır</p>
                  </div>
                </div>
              )}

              {taramaYukleniyor && (
                <div className="flex items-center justify-center gap-3 py-8">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[13px] font-bold text-gray-500 dark:text-gray-400">Taranıyor...</p>
                </div>
              )}

              {!taramaYukleniyor && taramaKlasoru && taramaSonuclari.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <AlertCircle size={28} className="text-gray-300 dark:text-gray-600" />
                  <p className="text-[13px] font-bold text-gray-400 dark:text-gray-500">PDF bulunamadı</p>
                  <button onClick={klasorSec} className="mt-2 px-4 py-2 text-[12px] font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Başka Klasör Seç
                  </button>
                </div>
              )}

              {!taramaYukleniyor && taramaSonuclari.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-bold text-gray-600 dark:text-gray-400">
                      {taramaSecili.size} / {taramaSonuclari.length} belge seçili
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTaramaSecili(new Set(taramaSonuclari.map((_, i) => String(i))))}
                        className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                      >
                        Tümünü Seç
                      </button>
                      <button
                        onClick={() => setTaramaSecili(new Set())}
                        className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 transition-colors"
                      >
                        Seçimi Kaldır
                      </button>
                      <button
                        onClick={klasorSec}
                        className="px-3 py-1.5 text-[11px] font-bold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Farklı Klasör
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {taramaSonuclari.map((sonuc, i) => {
                      const secili = taramaSecili.has(String(i))
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            const yeni = new Set(taramaSecili)
                            if (secili) yeni.delete(String(i))
                            else yeni.add(String(i))
                            setTaramaSecili(yeni)
                          }}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                            secili
                              ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                            secili ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {secili && <Check size={11} className="text-white" strokeWidth={3} />}
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                            <FileText size={14} className="text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-gray-700 dark:text-gray-300 truncate">{sonuc.ad}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{sonuc.dosya_yolu}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
                            {sonuc.kategori}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {taramaSonuclari.length > 0 && !taramaYukleniyor && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <button
                  onClick={() => { setKlasorTaramaAcik(false); setTaramaSonuclari([]); setTaramaKlasoru('') }}
                  className="px-4 py-2 text-[12px] font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={taramaKaydet}
                  disabled={taramaKaydediliyor || taramaSecili.size === 0}
                  className="px-5 py-2 text-[12px] font-bold rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-md shadow-blue-200 dark:shadow-blue-900"
                >
                  {taramaKaydediliyor ? 'Ekleniyor...' : `${taramaSecili.size} Belgeyi Ekle`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KATEGORİ YÖNETİM MODAL */}
      {kategoriModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-[14px] font-black text-gray-800 dark:text-gray-100">Kategoriler</h2>
              <button onClick={() => { setKategoriModalAcik(false); setDuzenleKategori(null); setYeniKategoriAdi('') }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 text-[12px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-800"
                  placeholder={duzenleKategori ? 'Yeni ad girin...' : 'Kategori adı...'}
                  value={yeniKategoriAdi}
                  onChange={(e) => setYeniKategoriAdi(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && kategoriKaydet()}
                />
                <button
                  onClick={kategoriKaydet}
                  className="px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {duzenleKategori ? <Check size={14} /> : <Plus size={14} />}
                </button>
                {duzenleKategori && (
                  <button
                    onClick={() => { setDuzenleKategori(null); setYeniKategoriAdi('') }}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {kategoriler.length === 0 ? (
                <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center py-4">Henüz kategori yok</p>
              ) : (
                kategoriler.map((k) => (
                  <div key={k.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 group">
                    <div className="flex items-center gap-2">
                      <Tag size={13} className="text-gray-400" />
                      <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">{k.ad}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setDuzenleKategori(k); setYeniKategoriAdi(k.ad) }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      {silKategoriOnay === k.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => kategoriSil(k.id)} className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 transition-colors">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setSilKategoriOnay(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSilKategoriOnay(k.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
