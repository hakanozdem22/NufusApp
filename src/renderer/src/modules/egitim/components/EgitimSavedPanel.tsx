import { useState } from 'react'
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
  X
} from 'lucide-react'
import { EgitimPlan } from '../models/egitim-types'
import { Ek2Report } from './Ek2Report'
import { Ek3Report } from './Ek3Report'

interface EgitimSavedPanelProps {
  kayitliPlanlar: EgitimPlan[]
  setSilinecekId: (id: number | string) => void
  raporAl: (planId: number | string, tip: 'NORMAL' | 'EK2' | 'EK3') => void
  yukleniyor: boolean
  planSec: (plan: EgitimPlan) => Promise<EgitimPlan>
}

export const EgitimSavedPanel = ({
  kayitliPlanlar,
  setSilinecekId,
  raporAl,
  yukleniyor,
  planSec
}: EgitimSavedPanelProps) => {
  // selectedPlan artık sadece MODAL GÖSTERİMİ için, seciliPlan ise GLOBAL SEÇİM için
  // Ancak kullanıcı deneyimi açısından "İncele" hem seçsin hem açsın diyebiliriz.
  // Şimdilik existing local state'i (selectedPlan) modal için tutuyoruz.
  const [selectedPlan, setSelectedPlan] = useState<EgitimPlan | null>(null)
  const [reportPreview, setReportPreview] = useState<{
    type: 'EK2' | 'EK3'
    plan: EgitimPlan
  } | null>(null)

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 dark:bg-gray-900/50 relative">
      {/* BAŞLIK */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center z-10">
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-none">
              <Save size={18} />
            </div>
            Kayıtlı Planlar
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-1">
            {kayitliPlanlar.length > 0
              ? `${kayitliPlanlar.length} plan kayıtlı`
              : 'Kayıtlı plan bulunmuyor'}
          </p>
        </div>
      </div>

      {/* İÇERİK */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {kayitliPlanlar.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-60">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Save size={48} className="text-gray-300 dark:text-gray-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-lg text-gray-500 dark:text-gray-400">Kayıt Yok</p>
              <p className="text-sm">Henüz kaydedilmiş bir eğitim planınız yok.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
            {kayitliPlanlar.map((plan) => (
              <div
                key={plan.id}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Kart Başlığı */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 bg-gray-50/30 dark:bg-gray-700/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner">
                        <CalendarDays size={20} />
                      </div>
                      <div>
                        <h4
                          className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-1"
                          title={plan.adi}
                        >
                          {plan.adi}
                        </h4>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          {new Date(plan.olusturma_tarihi).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSilinecekId(plan.id)}
                      className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                      title="Planı Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Butonlar */}
                <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 mt-auto grid gap-2">
                  <button
                    onClick={async () => {
                      // Önce yükleniyor gösterelim gerekirse ama burada UI zaten hızlı tepki vermeli
                      // Modal açılışında detayları yükleyelim
                      const fullPlan = await planSec(plan)
                      setSelectedPlan(fullPlan || plan)
                    }}
                    className="w-full bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-all shadow-sm"
                  >
                    <Eye size={14} />
                    İNCELE
                  </button>

                  <button
                    onClick={() => raporAl(plan.id, 'NORMAL')}
                    disabled={yukleniyor}
                    className="w-full bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-2 transition-all shadow-md group/btn"
                  >
                    {yukleniyor ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Printer
                          size={14}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                        İMZA ÇİZELGESİ
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => raporAl(plan.id, 'EK2')}
                      disabled={yukleniyor}
                      className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FileText size={14} /> EK-2
                    </button>
                    <button
                      onClick={() => raporAl(plan.id, 'EK3')}
                      disabled={yukleniyor}
                      className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 py-2 rounded-lg text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ClipboardList size={14} /> EK-3
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{selectedPlan.adi}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(selectedPlan.olusturma_tarihi).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-0 flex-1 custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 box-shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-24">Tarih</th>
                    <th className="px-4 py-3 font-semibold w-24">Saat</th>
                    <th className="px-4 py-3 font-semibold">Konu</th>
                    <th className="px-4 py-3 font-semibold">Eğitici</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {(selectedPlan.dersler || []).map((ders: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap text-xs">
                        {ders.tarih}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs">
                        {ders.saat}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{ders.konu}</td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">
                        {ders.egitici}
                      </td>
                    </tr>
                  ))}
                  {(!selectedPlan.dersler || selectedPlan.dersler.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Bu planda ders kaydı bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-6 py-2 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm hover:shadow"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RAPOR ÖNİZLEME MODALI (EK-2 / EK-3) */}
      {reportPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90 backdrop-blur-sm print:bg-white print:p-0">
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
            className="bg-white w-full max-w-4xl h-[90vh] print:h-auto print:max-w-none rounded-xl shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Toolbar - Hidden on Print */}
            <div className="p-4 bg-gray-800 text-white flex justify-between items-center print:hidden shadow-md z-50">
              <h3 className="font-bold flex items-center gap-2">
                <FileText size={18} />
                {reportPreview.type === 'EK2' ? 'EK-2 ANKET FORMU' : 'EK-3 SONUÇ RAPORU'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Printer size={16} /> YAZDIR
                </button>
                <button
                  onClick={() => setReportPreview(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="flex-1 overflow-auto bg-gray-100 p-8 print:p-0 print:bg-white print:overflow-visible custom-scrollbar flex justify-center">
              <div className="shadow-lg print:shadow-none bg-white">
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
