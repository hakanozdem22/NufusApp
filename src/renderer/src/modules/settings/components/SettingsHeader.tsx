import { Settings } from 'lucide-react'

export const SettingsHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
        <Settings size={32} />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
          Uygulama Ayarları
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
          Kişisel tercihlerinizi buradan yönetebilirsiniz.
        </p>
      </div>
    </div>
  )
}
