import { useState, useEffect } from 'react'
import { Code, Heart, CheckCircle } from 'lucide-react'
import logoImg from '../../../assets/nufus-logo.png'

export const AboutSettings = () => {
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    const getVersion = async () => {
      if (window.api && window.api.getAppVersion) {
        const v = await window.api.getAppVersion()
        setVersion(v)
      }
    }
    getVersion()
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Kart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden text-center p-8 transition-colors">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 p-4 border border-red-100 dark:border-red-800/30">
          <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          T.C. Kapaklı İlçe Nüfus Müdürlüğü
        </h2>
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-6">
          Personel ve İş Takip Otomasyonu
        </h3>

        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full border border-green-200 dark:border-green-800/30 mb-8">
          <CheckCircle size={16} />
          <span className="font-bold text-sm">v{version || '...'} (Güncel)</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left border-t border-gray-100 dark:border-gray-700 pt-8">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-2">
              <Code size={14} /> Geliştirici
            </h4>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Bilgi İşlem Birimi</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center gap-2">
              <Heart size={14} /> Lisans
            </h4>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Kurumsal Lisans</p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400">
        &copy; 2026 Tüm Hakları Saklıdır. İzinsiz kopyalanması ve dağıtılması yasaktır.
      </div>
    </div>
  )
}
