import { Save, List, Clock, Trash2, Loader2, Printer, FileText, ClipboardList } from 'lucide-react'
import { EgitimPlan } from '../models/egitim-types'

interface EgitimSavedPanelProps {
  kayitliPlanlar: EgitimPlan[]
  setSilinecekId: (id: number) => void
  raporAl: (planId: number, tip: 'NORMAL' | 'EK2' | 'EK3') => void
  yukleniyor: boolean
}

export const EgitimSavedPanel = ({
  kayitliPlanlar,
  setSilinecekId,
  raporAl,
  yukleniyor
}: EgitimSavedPanelProps) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 min-w-[300px]">
      <div className="p-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center shadow-sm z-10">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Save size={18} className="text-purple-600 dark:text-purple-400" /> KAYITLI PLANLAR
        </h3>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
          {kayitliPlanlar.length}
        </span>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {kayitliPlanlar.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-lg">
                  <List size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">{plan.adi}</h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {plan.olusturma_tarihi}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSilinecekId(plan.id)}
                className="text-gray-300 hover:text-red-500 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* BUTON GRUBU */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => raporAl(plan.id, 'NORMAL')}
                disabled={yukleniyor}
                className="w-full bg-gray-800 text-white py-2 rounded-lg text-xs font-bold flex justify-center items-center gap-2 hover:bg-black transition"
              >
                {yukleniyor ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Printer size={14} /> İMZA ÇİZELGESİ (YEREL)
                  </>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => raporAl(plan.id, 'EK2')}
                  disabled={yukleniyor}
                  className="flex-1 bg-blue-50 text-blue-700 border border-blue-200 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition flex justify-center items-center gap-1"
                >
                  <FileText size={14} /> EK-2 (DRIVE)
                </button>
                <button
                  onClick={() => raporAl(plan.id, 'EK3')}
                  disabled={yukleniyor}
                  className="flex-1 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg text-xs font-bold hover:bg-green-100 transition flex justify-center items-center gap-1"
                >
                  <ClipboardList size={14} /> EK-3 (DRIVE)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
