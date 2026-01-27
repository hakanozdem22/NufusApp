import { CheckCircle, AlertCircle } from 'lucide-react'
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel'
import { SettingsHeader } from '../components/SettingsHeader'
import { SettingsForm } from '../components/SettingsForm'

interface PersonelAyarlariProps {
  isEmbedded?: boolean
}

export const PersonelAyarlari = ({ isEmbedded = false }: PersonelAyarlariProps) => {
  const vm = useSettingsViewModel()

  return (
    <div
      className={`flex flex-col h-full bg-gray-50 dark:bg-gray-900 relative ${isEmbedded ? '' : 'p-8'} transition-colors`}
    >
      {vm.bildirim && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-[70] px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${vm.bildirim.tur === 'basari' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {vm.bildirim.tur === 'basari' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{vm.bildirim.mesaj}</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto w-full">
        {!isEmbedded && <SettingsHeader />}

        <SettingsForm
          username={vm.username}
          setUsername={vm.setUsername}
          onSave={vm.kaydet}
          yukleniyor={vm.yukleniyor}
        />

        {/* Personel Listesi */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 transition-colors">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Personel Listesi</h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-bold">
              {vm.personeller.length} Kişi
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                <tr>
                  <th className="p-4">Ad Soyad</th>
                  <th className="p-4">Ünvan</th>
                  <th className="p-4">Sicil No</th>
                  <th className="p-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {vm.personeller.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="p-4 font-bold text-gray-700 dark:text-gray-200">{p.ad_soyad}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{p.unvan}</td>
                    <td className="p-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                      {p.sicil_no}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => vm.personelSil(p.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition font-bold text-xs"
                      >
                        SİL
                      </button>
                    </td>
                  </tr>
                ))}
                {vm.personeller.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-gray-400 dark:text-gray-500 italic"
                    >
                      Henüz personel eklenmemiş. Terfi modülünden ekleyebilirsiniz.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
