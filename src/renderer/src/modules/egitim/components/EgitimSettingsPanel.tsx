import { useState, useRef, useEffect, ReactElement } from 'react'
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
  Target,
  Sparkles,
  Zap,
  UserCheck,
  ShieldCheck,
  Briefcase,
  Bot,
  LucideIcon
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
  activeTab: 'robot' | 'draft' | 'saved_plans'
  setActiveTab: (tab: 'robot' | 'draft' | 'saved_plans') => void
  taslakCount: number
}

const CardHeader = ({
  title,
  icon: Icon,
  colorClass
}: {
  title: string
  icon: LucideIcon
  colorClass: string
}): ReactElement => (
  <div className="flex items-center gap-4 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800 relative">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg ${colorClass}`}>
      <Icon size={18} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col">
      <h3 className="font-black text-gray-800 dark:text-white uppercase tracking-tight text-xs">{title}</h3>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Program Yapılandırması</p>
    </div>
  </div>
)

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
  refreshData,
  activeTab,
  setActiveTab,
  taslakCount
}: EgitimSettingsPanelProps): ReactElement => {
  const [zorunluArama, setZorunluArama] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

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

  const siraliKonular = [...konular].sort((a, b) => {
    const siraA = a.sira ?? 9999
    const siraB = b.sira ?? 9999
    if (siraA !== siraB) return siraA - siraB
    return (a.baslik || '').localeCompare(b.baslik || '')
  })

  const filtrelenmisKonular = siraliKonular.filter((k) =>
    k.baslik.toLocaleLowerCase('tr-TR').includes(zorunluArama.toLocaleLowerCase('tr-TR'))
  )

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden">
      {/* HEADER */}
      <div className="px-10 py-6 bg-white/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center relative overflow-hidden group">
         <div className="absolute -left-12 -top-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shadow-inner">
            <LayoutTemplate size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              HİZMET İÇİ EĞİTİM PANELİ
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest">
              <Sparkles size={12} className="text-yellow-500" /> Yapılandırma Paneli
            </p>
          </div>
        </div>

        {/* ORTA NAVİGASYON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-slate-100 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-1 gap-1 border border-gray-200 dark:border-gray-700 shadow-inner z-20">
          <button
            onClick={() => setActiveTab('robot')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === 'robot'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            Robot
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest relative ${
              activeTab === 'draft'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            Taslak
            {taslakCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${activeTab === 'draft' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                {taslakCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('saved_plans')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === 'saved_plans'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            İmza Çizelgesi
          </button>
        </div>

        <button
          onClick={refreshData}
          className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all active:scale-95 font-black text-[9px] uppercase tracking-widest"
        >
          <RefreshCw size={14} strokeWidth={3} className="text-blue-500" />
          VERİLERİ YENİLE
        </button>
      </div>

      {/* DASHBOARD GRID */}
      <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
          
          {/* CARD 1: GENEL BİLGİLER */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-7 hover:scale-[1.02] transition-all duration-300">
            <CardHeader
              title="Genel Bilgiler"
              icon={Users}
              colorClass="bg-blue-600 text-white shadow-blue-500/20"
            />

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-800/80 border-none rounded-xl text-[13px] font-black outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner uppercase tracking-tighter"
                  value={tarih}
                  onChange={(e) => setTarih(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <UserCheck size={14} /> Eğitici Personel
                </label>
                <select
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-800/80 border-none rounded-xl text-[13px] font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner appearance-none cursor-pointer"
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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={14} /> Düzenleyen
                </label>
                <select
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-800/80 border-none rounded-xl text-[13px] font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner appearance-none cursor-pointer"
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

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} /> Onaylayan
                </label>
                <select
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-gray-800/80 border-none rounded-xl text-[13px] font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner appearance-none cursor-pointer"
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
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-7 hover:scale-[1.02] transition-all duration-300">
            <CardHeader
              title="Hedefler & Zaman"
              icon={Target}
              colorClass="bg-indigo-600 text-white shadow-indigo-500/20"
            />

            <div className="space-y-8">
              {/* Target Section - Gradient Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 p-7 text-white shadow-2xl shadow-indigo-500/30">
                <div className="absolute -right-4 -top-4 p-4 opacity-10">
                  <Target size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100/70 mb-3 italic">Eğitim Süresi Hedefi</label>
                  <div className="flex items-baseline gap-3">
                    <input
                      className="w-20 bg-white/10 text-center text-4xl font-black text-white placeholder-white/50 outline-none rounded-2xl py-2.5 shadow-inner"
                      value={saatHedefi}
                      onChange={(e) => setSaatHedefi(e.target.value)}
                    />
                    <span className="text-xl font-black text-indigo-100">SAAT</span>
                  </div>
                </div>
              </div>

              {/* Session Times Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2 text-indigo-500">
                  <Clock size={16} strokeWidth={3} />
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Oturum Saatleri
                  </label>
                </div>

                <div className="space-y-3">
                    <div className="group relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                            <span className="text-[9px] font-black text-gray-400 group-focus-within:text-indigo-500 transition-colors uppercase tracking-widest">SABAH</span>
                        </div>
                        <input
                            className="w-full pl-20 pr-6 py-4 bg-slate-50 dark:bg-gray-800/80 border-none rounded-2xl text-xs font-black text-gray-700 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-inner tracking-tighter"
                            value={sabahOturum}
                            onChange={(e) => setSabahOturum(e.target.value)}
                            placeholder="09:00 - 12:00"
                        />
                    </div>

                    <div className="group relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                            <span className="text-[9px] font-black text-gray-400 group-focus-within:text-indigo-500 transition-colors uppercase tracking-widest">ÖĞLE</span>
                        </div>
                        <input
                            className="w-full pl-20 pr-6 py-4 bg-slate-50 dark:bg-gray-800/80 border-none rounded-2xl text-xs font-black text-gray-700 dark:text-white focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-gray-900 transition-all outline-none shadow-inner tracking-tighter"
                            value={ogleOturum}
                            onChange={(e) => setOgleOturum(e.target.value)}
                            placeholder="13:30 - 16:30"
                        />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: MÜFREDAT */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-7 hover:scale-[1.02] transition-all duration-300 md:col-span-2 lg:col-span-1">
            <CardHeader
              title="Müfredat Seçimi"
              icon={BookOpen}
              colorClass="bg-rose-600 text-white shadow-rose-500/20"
            />

            <div className="space-y-4 h-[calc(100%-80px)] flex flex-col">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 leading-relaxed italic border-l-4 border-rose-500/20 pl-3">
                Programa <span className="text-rose-600 underline underline-offset-4 decoration-rose-500/30">kesinlikle</span> dahil edilecek özel dersleri belirleyin.
              </p>

              <div className="relative flex-1 flex flex-col min-h-0" ref={menuRef}>
                <div
                  onClick={() => {
                    setZorunluDersMenuAcik(!zorunluDersMenuAcik)
                    if (!zorunluDersMenuAcik) setZorunluArama('')
                  }}
                  className="w-full min-h-[60px] bg-slate-50 dark:bg-gray-800/50 border-2 border-dashed border-rose-200 dark:border-rose-900/40 rounded-xl flex items-center justify-between px-6 cursor-pointer hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all group shrink-0"
                >
                  <div className="flex items-center gap-4">
                    <CheckSquare size={20} className="text-rose-500 group-hover:scale-110 transition-transform" strokeWidth={3} />
                    <span className="text-[11px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest">
                      {zorunluDersler.length > 0
                        ? `${zorunluDersler.length} DERS SEÇİLİ`
                        : 'DERS SEÇİMİ YAPIN'}
                    </span>
                  </div>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${zorunluDersMenuAcik ? 'rotate-180' : ''}`} strokeWidth={3} />
                </div>

                {/* Seçili Dersler Listesi (Preview) */}
                {!zorunluDersMenuAcik && zorunluDersler.length > 0 && (
                  <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar-hide space-y-2">
                    {zorunluDersler.map((ders) => (
                      <div
                        key={ders}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl shadow-sm animate-in fade-in slide-in-from-left-4 duration-300"
                      >
                         <span className="text-[10px] font-black uppercase tracking-tight leading-tight flex-1 pr-3">{ders}</span>
                         <button
                           onClick={(e) => {
                             e.stopPropagation()
                             zorunluDersToggle(ders)
                           }}
                           className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-90"
                         >
                           <X size={14} strokeWidth={3} />
                         </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dropdown Menu */}
                {zorunluDersMenuAcik && (
                  <div className="absolute top-[64px] left-0 w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-40 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300 h-[300px] flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
                      <div className="relative group/search">
                        <Search
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-rose-500 transition-colors"
                          strokeWidth={2.5}
                        />
                        <input
                          type="text"
                          placeholder="Müfredatta ara..."
                          value={zorunluArama}
                          onChange={(e) => setZorunluArama(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 text-[10px] font-black uppercase border-none rounded-lg bg-white dark:bg-gray-800 focus:ring-4 focus:ring-rose-500/10 outline-none shadow-inner dark:text-white"
                          autoFocus
                        />
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                            {filtrelenmisKonular.length} KONU LİSTELENDİ
                        </span>
                        <div className="flex gap-4">
                          <button
                            onClick={zorunluTumunuSec}
                            className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-blue-500/30"
                          >
                            TÜMÜ
                          </button>
                          <button
                            onClick={zorunluTumunuTemizle}
                            className="text-[10px] font-black text-rose-600 hover:text-rose-700 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-rose-500/30"
                          >
                            SİL
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-1.5">
                      {filtrelenmisKonular.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10 opacity-30">
                          <BookOpen size={48} strokeWidth={1} className="mb-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Konu Bulunamadı</span>
                        </div>
                      ) : (
                        filtrelenmisKonular.map((k) => {
                          const secili = zorunluDersler.includes(k.baslik)
                          return (
                            <div
                              key={k.id}
                              onClick={() => zorunluDersToggle(k.baslik)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl transition-all ${
                                secili
                                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                  : 'hover:bg-slate-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                  secili
                                    ? 'bg-white border-white text-rose-500'
                                    : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800'
                                }`}
                              >
                                {secili && <CheckCheck size={14} strokeWidth={3} />}
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-tight leading-none">{k.baslik}</span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col min-h-0">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-3 uppercase tracking-widest italic">
                  <Zap size={14} className="text-yellow-500" strokeWidth={3} /> MANUEL DERS EKLE
                </span>

                <div className="space-y-4 flex flex-col">
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800/80 border-none rounded-xl text-[10px] font-black uppercase tracking-tight outline-none ring-4 ring-transparent focus:ring-blue-500/10 transition-all dark:text-white shadow-inner appearance-none cursor-pointer"
                    value={manKonu}
                    onChange={(e) => setManKonu(e.target.value)}
                  >
                    <option value="">KONU SEÇİNİZ...</option>
                    {konular.map((k) => (
                      <option key={k.id} value={k.baslik}>
                        {k.baslik}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex bg-slate-100/50 dark:bg-gray-800/80 rounded-2xl p-1.5 shadow-inner">
                      {['sabah', 'ogle', 'ikisi'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setManOturumSecimi(opt as 'sabah' | 'ogle' | 'ikisi')}
                          className={`flex-1 py-3 text-[9px] font-black rounded-xl transition-all uppercase tracking-tighter ${
                            manOturumSecimi === opt
                              ? 'bg-white dark:bg-indigo-600 shadow-lg text-indigo-700 dark:text-white'
                              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
                          }`}
                        >
                          {opt === 'sabah' ? 'Sabah' : opt === 'ogle' ? 'Öğle' : 'Tümü'}
                        </button>
                      ))}
                    </div>
                    <div className="relative group/time">
                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/time:text-blue-500 transition-colors" />
                        <input
                            className="w-full border-none pl-12 pr-4 py-3.5 rounded-2xl text-center text-xs font-black bg-slate-50 dark:bg-gray-800/80 dark:text-white ring-4 ring-transparent focus:ring-blue-500/10 shadow-inner outline-none transition-all placeholder-gray-400"
                            value={manSaat}
                            onChange={(e) => setManSaat(e.target.value)}
                            placeholder="09:00"
                        />
                    </div>
                  </div>

                  <button
                    onClick={manuelEkle}
                    className="w-full bg-gray-900 border-none hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-4.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-2 active:scale-95 shadow-xl shadow-gray-900/10"
                  >
                    <Plus size={18} strokeWidth={3} /> TASLAĞA EKLE
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 4: İŞLEMLER VE MANUEL EKLEME */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-7 hover:scale-[1.02] transition-all duration-300 flex flex-col relative overflow-hidden group/actions">
             <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover/actions:scale-150 transition-transform duration-1000"></div>

            <CardHeader
              title="İşlemler & Robot"
              icon={Play}
              colorClass="bg-emerald-600 text-white shadow-emerald-500/20"
            />

            <div className="flex-1 flex flex-col gap-8 relative z-10 pt-4">
              <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/10 rounded-2xl p-7 border border-emerald-100 dark:border-emerald-900/40 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 shadow-inner">
                  <Bot size={32} strokeWidth={2} className="animate-pulse" />
                </div>
                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 mb-8 italic border-l-4 border-emerald-500/30 pl-4 leading-relaxed text-center">
                  Tüm yapılandırmaları tamamladıysanız AI tabanlı planlama robotunu başlatabilirsiniz.
                </p>
                <button
                  onClick={robotCalistir}
                  className="w-full bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white py-5 px-8 rounded-2xl font-black text-[11px] tracking-[0.2em] shadow-[0_15px_30px_-10px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group/robot overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-white/0 group-hover/robot:bg-white/5 transition-colors"></div>
                  <Play
                    size={22}
                    className="fill-white relative z-10 group-hover/robot:rotate-[360deg] transition-transform duration-700 ease-in-out"
                  />
                  <span className="relative z-10">ROBOTU ÇALIŞTIR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
