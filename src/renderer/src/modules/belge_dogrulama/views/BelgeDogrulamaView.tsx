import { useState, useEffect, useMemo, ReactElement } from 'react'
import {
  Plus, Search, ExternalLink, Edit2, Trash2, X, Save,
  Globe, ShieldCheck, AlertCircle, Link
} from 'lucide-react'

// Tüm bayrak görsellerini yükle — views/ → belge_dogrulama/ → modules/ → src/ → assets/flags/
const flagModules = import.meta.glob('../../../assets/flags/*.png', { eager: true }) as Record<string, { default: string }>

const getFlagUrl = (kod: string): string => {
  if (!kod) return ''
  const key = `../../../assets/flags/${kod.toLowerCase()}.png`
  return flagModules[key]?.default || ''
}

// Türkçe ülke adı → ISO 2 harfli kod eşleştirmesi
const ULKE_KODLARI: Record<string, string> = {
  'türkiye': 'tr', 'turkey': 'tr',
  'almanya': 'de', 'germany': 'de',
  'fransa': 'fr', 'france': 'fr',
  'birleşik krallık': 'gb', 'ingiltere': 'gb', 'united kingdom': 'gb', 'uk': 'gb',
  'abd': 'us', 'amerika': 'us', 'amerika birleşik devletleri': 'us', 'united states': 'us', 'usa': 'us',
  'rusya': 'ru', 'russia': 'ru',
  'çin': 'cn', 'china': 'cn',
  'japonya': 'jp', 'japan': 'jp',
  'italya': 'it', 'italy': 'it',
  'ispanya': 'es', 'spain': 'es',
  'hollanda': 'nl', 'netherlands': 'nl',
  'belçika': 'be', 'belgium': 'be',
  'isviçre': 'ch', 'switzerland': 'ch',
  'avusturya': 'at', 'austria': 'at',
  'isveç': 'se', 'sweden': 'se',
  'norveç': 'no', 'norway': 'no',
  'danimarka': 'dk', 'denmark': 'dk',
  'finlandiya': 'fi', 'finland': 'fi',
  'polonya': 'pl', 'poland': 'pl',
  'çek cumhuriyeti': 'cz', 'czechia': 'cz',
  'romanya': 'ro', 'romania': 'ro',
  'yunanistan': 'gr', 'greece': 'gr',
  'bulgaristan': 'bg', 'bulgaria': 'bg',
  'sırbistan': 'rs', 'serbia': 'rs',
  'hırvatistan': 'hr', 'croatia': 'hr',
  'bosna hersek': 'ba', 'bosnia': 'ba',
  'kosova': 'xk', 'kosovo': 'xk',
  'makedonya': 'mk', 'kuzey makedonya': 'mk', 'north macedonia': 'mk',
  'arnavutluk': 'al', 'albania': 'al',
  'karadağ': 'me', 'montenegro': 'me',
  'kıbrıs': 'cy', 'cyprus': 'cy',
  'azerbaycan': 'az', 'azerbaijan': 'az',
  'gürcistan': 'ge', 'georgia': 'ge',
  'ermenistan': 'am', 'armenia': 'am',
  'ukrayna': 'ua', 'ukraine': 'ua',
  'moldova': 'md',
  'belarus': 'by',
  'kazakistan': 'kz', 'kazakhstan': 'kz',
  'özbekistan': 'uz', 'uzbekistan': 'uz',
  'türkmenistan': 'tm', 'turkmenistan': 'tm',
  'tacikistan': 'tj', 'tajikistan': 'tj',
  'kırgızistan': 'kg', 'kyrgyzstan': 'kg',
  'afganistan': 'af', 'afghanistan': 'af',
  'pakistan': 'pk',
  'hindistan': 'in', 'india': 'in',
  'bangladeş': 'bd', 'bangladesh': 'bd',
  'sri lanka': 'lk',
  'nepal': 'np',
  'iran': 'ir',
  'irak': 'iq', 'iraq': 'iq',
  'suriye': 'sy', 'syria': 'sy',
  'lübnan': 'lb', 'lebanon': 'lb',
  'ürdün': 'jo', 'jordan': 'jo',
  'israil': 'il', 'israel': 'il',
  'filistin': 'ps', 'palestine': 'ps',
  'suudi arabistan': 'sa', 'saudi arabia': 'sa',
  'birleşik arap emirlikleri': 'ae', 'bae': 'ae', 'uae': 'ae',
  'katar': 'qa', 'qatar': 'qa',
  'kuveyt': 'kw', 'kuwait': 'kw',
  'bahreyn': 'bh', 'bahrain': 'bh',
  'umman': 'om', 'oman': 'om',
  'yemen': 'ye',
  'mısır': 'eg', 'egypt': 'eg',
  'libya': 'ly',
  'tunus': 'tn', 'tunisia': 'tn',
  'cezayir': 'dz', 'algeria': 'dz',
  'fas': 'ma', 'morocco': 'ma',
  'sudan': 'sd',
  'etiyopya': 'et', 'ethiopia': 'et',
  'kenya': 'ke',
  'nijerya': 'ng', 'nigeria': 'ng',
  'gana': 'gh', 'ghana': 'gh',
  'senegal': 'sn',
  'güney afrika': 'za', 'south africa': 'za',
  'kanada': 'ca', 'canada': 'ca',
  'meksika': 'mx', 'mexico': 'mx',
  'brezilya': 'br', 'brazil': 'br',
  'arjantin': 'ar', 'argentina': 'ar',
  'kolombiya': 'co', 'colombia': 'co',
  'peru': 'pe',
  'şili': 'cl', 'chile': 'cl',
  'avustralya': 'au', 'australia': 'au',
  'yeni zelanda': 'nz', 'new zealand': 'nz',
  'güney kore': 'kr', 'south korea': 'kr', 'kore': 'kr',
  'kuzey kore': 'kp', 'north korea': 'kp',
  'vietnam': 'vn',
  'tayland': 'th', 'thailand': 'th',
  'endonezya': 'id', 'indonesia': 'id',
  'malezya': 'my', 'malaysia': 'my',
  'filipinler': 'ph', 'philippines': 'ph',
  'singapur': 'sg', 'singapore': 'sg',
  'myanmar': 'mm',
  'kamboçya': 'kh', 'cambodia': 'kh',
  'portekiz': 'pt', 'portugal': 'pt',
  'macaristan': 'hu', 'hungary': 'hu',
  'slovakya': 'sk', 'slovakia': 'sk',
  'slovenya': 'si', 'slovenia': 'si',
  'litvanya': 'lt', 'lithuania': 'lt',
  'letonya': 'lv', 'latvia': 'lv',
  'estonya': 'ee', 'estonia': 'ee',
  'lüksemburg': 'lu', 'luxembourg': 'lu',
  'malta': 'mt',
  'İrlanda': 'ie', 'irlanda': 'ie', 'ireland': 'ie',
  'İzlanda': 'is', 'izlanda': 'is', 'iceland': 'is',
}

const getKodFromUlke = (ulke: string): string => {
  const normalized = ulke.trim().toLowerCase()
  if (ULKE_KODLARI[normalized]) return ULKE_KODLARI[normalized]
  // Kısmi eşleşme dene
  for (const [key, kod] of Object.entries(ULKE_KODLARI)) {
    if (normalized.includes(key) || key.includes(normalized)) return kod
  }
  return ''
}

interface Site {
  id: string
  ulke: string
  bayrak: string
  site_adi: string
  url: string
  belge_turleri: string
  aciklama: string
  eklenme_tarihi: string
}

const BELGE_TURLERI = ['Pasaport', 'Kimlik', 'Vize', 'Apostil', 'Doğum Belgesi', 'Evlilik Belgesi', 'Sürücü Belgesi', 'Diğer']

const TAG_COLORS: Record<string, string> = {
  'Pasaport':        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  'Kimlik':          'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  'Vize':            'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  'Apostil':         'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  'Doğum Belgesi':   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  'Evlilik Belgesi': 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  'Sürücü Belgesi':  'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  'Diğer':           'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

const emptyForm = { ulke: '', site_adi: '', url: '', belge_turleri: '', aciklama: '' }


export const BelgeDogrulamaView = (): ReactElement => {
  const [siteler, setSiteler] = useState<Site[]>([])
  const [arama, setArama] = useState('')
  const [turFilter, setTurFilter] = useState('Tümü')
  const [modalAcik, setModalAcik] = useState(false)
  const [duzenle, setDuzenle] = useState<Site | null>(null)
  const [silOnay, setSilOnay] = useState<string | null>(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [secilenTurler, setSecilenTurler] = useState<Set<string>>(new Set())

  const autoKod = useMemo(() => getKodFromUlke(form.ulke), [form.ulke])

  const yukle = async (): Promise<void> => {
    try {
      const data = await window.api.getBelgeDogrulamaSiteleri()
      setSiteler(data || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => { yukle() }, [])

  const filtrelenmis = useMemo(() => {
    let res = siteler
    if (arama) {
      const q = arama.toLowerCase()
      res = res.filter(s =>
        s.ulke.toLowerCase().includes(q) ||
        s.site_adi.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q)
      )
    }
    if (turFilter !== 'Tümü') {
      res = res.filter(s => s.belge_turleri?.split(',').map(t => t.trim()).includes(turFilter))
    }
    return res
  }, [siteler, arama, turFilter])

  const modalAc = (site?: Site): void => {
    setHata(null)
    if (site) {
      setDuzenle(site)
      setForm({ ulke: site.ulke, site_adi: site.site_adi, url: site.url, belge_turleri: site.belge_turleri || '', aciklama: site.aciklama || '' })
      setSecilenTurler(new Set(site.belge_turleri?.split(',').map(t => t.trim()).filter(Boolean) || []))
    } else {
      setDuzenle(null)
      setForm({ ...emptyForm })
      setSecilenTurler(new Set())
    }
    setModalAcik(true)
  }

  const turToggle = (tur: string): void => {
    setSecilenTurler(prev => {
      const next = new Set(prev)
      if (next.has(tur)) next.delete(tur)
      else next.add(tur)
      return next
    })
  }

  const kaydet = async (): Promise<void> => {
    if (!form.ulke.trim()) { setHata('Ülke adı zorunludur.'); return }
    if (!form.url.trim()) { setHata('URL zorunludur.'); return }
    setYukleniyor(true)
    setHata(null)
    try {
      const payload = {
        ...form,
        bayrak: autoKod,
        belge_turleri: [...secilenTurler].join(',')
      }
      if (duzenle) {
        await window.api.updateBelgeDogrulamaSitesi({ id: duzenle.id, ...payload })
      } else {
        await window.api.addBelgeDogrulamaSitesi(payload)
      }
      await yukle()
      setModalAcik(false)
    } catch (e: any) {
      console.error('Kayıt hatası:', e)
      setHata('Hata: ' + (e?.message || String(e)))
    } finally {
      setYukleniyor(false)
    }
  }

  const sil = async (id: string): Promise<void> => {
    try {
      await window.api.deleteBelgeDogrulamaSitesi(id)
      await yukle()
    } finally { setSilOnay(null) }
  }

  const siteAc = (url: string): void => {
    if (url) window.api.openUrl(url)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-gray-950/50">

      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-slate-50/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Belge Doğrulama Siteleri</h1>
            </div>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest ml-13">Ülke Bazlı Resmi Doğrulama Kaynakları</p>
          </div>
          <button
            onClick={() => modalAc()}
            className="flex items-center gap-2.5 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} /> Yeni Site Ekle
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-[1600px] mx-auto w-full px-8 pt-8">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white dark:border-gray-800 shadow-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Ülke, site adı veya URL ile ara..."
              value={arama}
              onChange={e => setArama(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-[1.8rem] bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shrink-0">
            <Globe size={14} className="text-gray-400" />
            <select
              value={turFilter}
              onChange={e => setTurFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none pr-4 py-2 cursor-pointer"
            >
              <option value="Tümü">Tüm Belge Türleri</option>
              {BELGE_TURLERI.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-8 py-8 overflow-auto">
        {filtrelenmis.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 opacity-30">
            <ShieldCheck size={56} strokeWidth={1} />
            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Kayıtlı site bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtrelenmis.map(site => {
              const turler = site.belge_turleri?.split(',').map(t => t.trim()).filter(Boolean) || []
              const kod = site.bayrak || getKodFromUlke(site.ulke)
              const flagUrl = getFlagUrl(kod)
              return (
                <div key={site.id} className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Card Header */}
                  <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                        {flagUrl
                          ? <img src={flagUrl} alt={kod} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          : <Globe size={16} className="text-gray-300 dark:text-gray-600" />
                        }
                      </div>
                      <div>
                        <h3 className="font-black text-gray-800 dark:text-gray-100 text-base tracking-tight leading-tight">{site.ulke}</h3>
                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">{site.site_adi || 'Resmi Site'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button onClick={() => modalAc(site)} className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all" title="Düzenle">
                        <Edit2 size={14} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setSilOnay(site.id)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all" title="Sil">
                        <Trash2 size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="px-6 pb-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                      <Link size={12} className="text-gray-400 shrink-0" />
                      <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 truncate">{site.url}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {turler.length > 0 && (
                    <div className="px-6 pb-4 flex flex-wrap gap-1.5">
                      {turler.map(t => (
                        <span key={t} className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-tighter ${TAG_COLORS[t] || TAG_COLORS['Diğer']}`}>{t}</span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {site.aciklama && (
                    <div className="px-6 pb-4">
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">{site.aciklama}</p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => siteAc(site.url)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      <ExternalLink size={14} strokeWidth={2.5} /> Siteyi Aç
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between px-10 py-7 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
              <div>
                <h3 className="font-black text-xl text-gray-800 dark:text-white tracking-tight">
                  {duzenle ? 'Siteyi Düzenle' : 'Yeni Site Ekle'}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">Belge Doğrulama Kaynağı</p>
              </div>
              <button onClick={() => setModalAcik(false)} className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm border border-gray-100 dark:border-gray-700">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-10 overflow-y-auto max-h-[75vh] scrollbar-hide space-y-6">
              {hata && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
                  <AlertCircle size={16} /> {hata}
                </div>
              )}

              {/* Ülke adı + otomatik bayrak önizleme */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ÜLKE ADI <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-7 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0">
                    {autoKod && getFlagUrl(autoKod)
                      ? <img src={getFlagUrl(autoKod)} alt={autoKod} className="w-full h-full object-cover" />
                      : <Globe size={14} className="text-gray-400" />
                    }
                  </div>
                  <input
                    required
                    placeholder="Örn: Almanya"
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl pl-16 pr-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all dark:text-white shadow-inner"
                    value={form.ulke}
                    onChange={e => setForm({ ...form, ulke: e.target.value })}
                  />
                </div>
                {autoKod && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black ml-2 uppercase tracking-widest">
                    Bayrak tespit edildi: {autoKod.toUpperCase()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SİTE ADI / BAŞLIK</label>
                <input
                  placeholder="Örn: Federal Dışişleri Bakanlığı Belge Doğrulama"
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all dark:text-white shadow-inner"
                  value={form.site_adi}
                  onChange={e => setForm({ ...form, site_adi: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WEB ADRESİ (URL) <span className="text-red-500">*</span></label>
                <input
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all dark:text-white shadow-inner font-mono"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">BELGE TÜRLERİ</label>
                <div className="flex flex-wrap gap-2">
                  {BELGE_TURLERI.map(tur => {
                    const secili = secilenTurler.has(tur)
                    return (
                      <button
                        key={tur}
                        type="button"
                        onClick={() => turToggle(tur)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all border ${
                          secili
                            ? `${TAG_COLORS[tur] || TAG_COLORS['Diğer']} border-current shadow-sm`
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {tur}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">AÇIKLAMA / NOT</label>
                <textarea
                  rows={3}
                  placeholder="Site hakkında notlar..."
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-900 rounded-2xl px-6 py-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-emerald-500/10 transition-all dark:text-white shadow-inner resize-none"
                  value={form.aciklama}
                  onChange={e => setForm({ ...form, aciklama: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setModalAcik(false)} className="flex-1 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                  Vazgeç
                </button>
                <button type="button" onClick={kaydet} disabled={yukleniyor} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                  <Save size={18} strokeWidth={3} /> {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {silOnay && (
        <div className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm p-8 border border-white dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 text-center tracking-tight">Kaydı Sil?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center text-sm font-medium">
              Bu site kaydı <span className="text-red-500 font-black italic">kalıcı olarak</span> silinecek.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => sil(silOnay)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-500/25 transition-all active:scale-95">Sil</button>
              <button onClick={() => setSilOnay(null)} className="w-full py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95">Vazgeç</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
