import { useState, ReactElement } from 'react'
import {
  Save,
  Clock,
  Trash2,
  Loader2,
  Printer,
  FileText,
  ClipboardList,
  CalendarDays,
  Eye,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User
} from 'lucide-react'
import { EgitimPlan, EgitimDers } from '../models/egitim-types'
import { Ek2Report } from './Ek2Report'
import { Ek3Report } from './Ek3Report'

interface EgitimSavedPanelProps {
  kayitliPlanlar: EgitimPlan[]
  setSilinecekId: (id: number | string) => void
  raporAl: (planId: number | string, tip: 'NORMAL' | 'EK2' | 'EK3') => void
  yukleniyor: boolean
  planSec: (plan: EgitimPlan) => Promise<EgitimPlan>
  activeTab: 'robot' | 'draft' | 'saved_plans'
  setActiveTab: (tab: 'robot' | 'draft' | 'saved_plans') => void
  taslakCount: number
}

export const EgitimSavedPanel = ({
  kayitliPlanlar,
  setSilinecekId,
  raporAl,
  yukleniyor,
  planSec,
  activeTab,
  setActiveTab,
  taslakCount
}: EgitimSavedPanelProps): ReactElement => {
  const [selectedPlan, setSelectedPlan] = useState<EgitimPlan | null>(null)
  const [reportPreview, setReportPreview] = useState<{
    type: 'EK2' | 'EK3'
    plan: EgitimPlan
  } | null>(null)

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden text-left">
      <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

      {/* BAŞLIK */}
      <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-10 bg-white/50 dark:bg-gray-800/20 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Save size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight leading-none mb-1">
              Kayıtlı Planlar
            </h3>
            <div className="flex items-center gap-2">
              <ClipboardList size={12} className="text-purple-500" />
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic leading-none">
                {kayitliPlanlar.length > 0
                  ? `${kayitliPlanlar.length} PLAN ARŞİVLENMİŞ`
                  : 'ARŞİVDE KAYIT BULUNMUYOR'}
              </span>
            </div>
          </div>
        </div>

        {/* ORTA NAVİGASYON */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex bg-slate-100 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-1 gap-1 border border-gray-200 dark:border-gray-700 shadow-inner z-20">
          <button
            onClick={() => setActiveTab('robot')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === 'robot'
                ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            Robot
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest relative ${
              activeTab === 'draft'
                ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            Taslak
            {taslakCount > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                  activeTab === 'draft' ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {taslakCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('saved_plans')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[0.8rem] transition-all text-[10px] font-black uppercase tracking-widest ${
              activeTab === 'saved_plans'
                ? 'bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-white/50'
            }`}
          >
            İmza Çizelgesi
          </button>
        </div>
      </div>

      {/* İÇERİK */}
      <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
        {kayitliPlanlar.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6 opacity-30 py-20">
            <div className="w-32 h-32 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-inner">
              <Save size={64} strokeWidth={1} className="text-gray-400 dark:text-gray-600" />
            </div>
            <div className="text-center max-w-xs px-4">
              <p className="font-black text-xs uppercase tracking-[0.3em] mb-3">Arşiv Boş</p>
              <p className="text-[11px] font-bold italic leading-relaxed">Henüz kaydedilmiş bir eğitim planınız bulunmuyor. Taslak kısmından program oluşturup kaydedebilirsiniz.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
            {kayitliPlanlar.map((plan) => (
              <div
                key={plan.id}
                className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col overflow-hidden"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                {/* Kart Başlığı */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-800/50 bg-slate-50/50 dark:bg-gray-800/30 relative z-10">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner group-hover:rotate-6 transition-transform">
                        <CalendarDays size={24} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <h4
                          className="font-black text-gray-800 dark:text-gray-100 text-sm uppercase tracking-tight line-clamp-1 group-hover:text-purple-600 transition-colors"
                          title={plan.adi}
                        >
                          {plan.adi}
                        </h4>
                        <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 flex items-center gap-2 mt-1 uppercase tracking-widest italic">
                          <Clock size={12} strokeWidth={3} className="text-indigo-500" />
                          {new Date(plan.olusturma_tarihi).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSilinecekId(plan.id)}
                      className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-rose-500 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl transition-all active:scale-95 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300"
                      title="Planı Sil"
                    >
                      <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="p-6 space-y-3 relative z-10 flex-1 flex flex-col justify-end">
                  <button
                    onClick={async () => {
                      const fullPlan = await planSec(plan)
                      setSelectedPlan(fullPlan || plan)
                    }}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-sm active:scale-95 group/view"
                  >
                    <Eye size={16} strokeWidth={3} className="text-blue-500 group-hover/view:scale-110 transition-transform" />
                    DETAYLI İNCELE
                  </button>

                  <button
                    onClick={() => raporAl(plan.id, 'NORMAL')}
                    disabled={yukleniyor}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-3 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 group/print disabled:opacity-50"
                  >
                    {yukleniyor ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Printer
                          size={18}
                          strokeWidth={3}
                          className="group-hover/print:scale-110 transition-transform"
                        />
                        İMZA ÇİZELGESİ AL
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => raporAl(plan.id, 'EK2')}
                      disabled={yukleniyor}
                      className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group/ek2"
                    >
                      <FileText size={14} strokeWidth={3} className="group-hover/ek2:scale-110 transition-transform" /> EK-2
                    </button>
                    <button
                      onClick={() => raporAl(plan.id, 'EK3')}
                      disabled={yukleniyor}
                      className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95 group/ek3"
                    >
                      <ClipboardList size={14} strokeWidth={3} className="group-hover/ek3:scale-110 transition-transform" /> EK-3
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PLAN DETAY MODALI */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 print:hidden">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl w-full max-w-4xl rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-800/30">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/20">
                  <FileText size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight mb-1">{selectedPlan.adi}</h3>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            {new Date(selectedPlan.olusturma_tarihi).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                            })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            {selectedPlan.dersler.length} OTURUM
                        </span>
                      </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-400 hover:text-rose-500 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all active:scale-95"
              >
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 scrollbar-hide">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-indigo-600 text-white">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b border-indigo-700">Tarih</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b border-indigo-700">Saat</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b border-indigo-700">Ders Konusu</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest border-b border-indigo-700">Eğitici Personel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {(selectedPlan.dersler || []).map((ders: EgitimDers, idx: number) => (
                    <tr
                      key={idx}
                      className="group/row hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="text-[11px] font-black text-gray-800 dark:text-gray-200 tracking-tighter uppercase">{ders.tarih.split('-').reverse().join('.')}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-gray-800 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-500/10 shadow-inner">
                            <Clock size={10} strokeWidth={3} />
                            <span className="text-[10px] font-black">{ders.saat}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-normal">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tight group-hover/row:text-indigo-600 transition-colors">{ders.konu}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                                <User size={14} strokeWidth={3} />
                            </div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{ders.egitici}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!selectedPlan.dersler || selectedPlan.dersler.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-black uppercase tracking-widest opacity-30 italic">
                        Bu planda ders kaydı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                    <ShieldCheck size={14} strokeWidth={2.5} className="text-emerald-500" /> Arşivlenmiş Veri Güvenliği Aktif
                </p>
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-12 py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl hover:bg-black dark:hover:bg-indigo-700 active:scale-95 translate-y-0 hover:-translate-y-1"
              >
                MODALI KAPAT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RAPOR ÖNİZLEME MODALI (EK-2 / EK-3) */}
      {reportPreview && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-gray-900/90 backdrop-blur-sm print:bg-white print:p-0 animate-in fade-in duration-500">
          {/* Print Style Fix */}
          <style>
            {`
              @media print {
                body > * { display: none !important; }
                #report-preview-container { display: block !important; position: absolute; left: 0; top: 0; width: 100%; height: 100%; margin: 0; padding: 0; overflow: visible; }
                @page { margin: 10mm; size: A4 portrait; }
              }
            `}
          </style>

          <div
            id="report-preview-container"
            className="bg-white w-full max-w-5xl h-[92vh] print:h-auto print:max-w-none rounded-xl shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in duration-300"
          >
            {/* Toolbar - Hidden on Print */}
            <div className="px-10 py-6 bg-gray-900 text-white flex justify-between items-center print:hidden shadow-xl z-[130]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-xs font-black uppercase tracking-widest">
                    {reportPreview.type === 'EK2' ? 'EK-2 EĞİTİM ANKETİ' : 'EK-3 SONUÇ RAPORU'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">Resmi Belge Önizleme</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                  <Printer size={18} strokeWidth={3} /> YAZDIR
                </button>
                <button
                  onClick={() => setReportPreview(null)}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-rose-600 rounded-xl transition-all active:scale-90"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="flex-1 overflow-auto bg-slate-200/50 p-12 print:p-0 print:bg-white print:overflow-visible custom-scrollbar flex justify-center">
              <div className="shadow-2xl print:shadow-none bg-white p-[10mm] min-w-[210mm] max-w-[210mm] min-h-[297mm]">
                {reportPreview.type === 'EK2' && <Ek2Report plan={reportPreview.plan} />}
                {reportPreview.type === 'EK3' && <Ek3Report plan={reportPreview.plan} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
