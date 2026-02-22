import { Moon, Sun, Bell, RefreshCw, Monitor, Shield, Globe } from 'lucide-react'
import { useState } from 'react'

import { useTheme } from '../../../shared/context/ThemeContext'

export const GeneralSettings = () => {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Görünüm Ayarları */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Monitor className="text-blue-600" size={20} />
            Görünüm
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Uygulama temasını ve görünüm tercihlerini yönetin.
          </p>
        </div>
        <div className="p-6 grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-600'}`}
          >
            <Sun size={24} />
            <span className="font-semibold text-sm">Açık Tema</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-600'}`}
          >
            <Moon size={24} />
            <span className="font-semibold text-sm">Koyu Tema</span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-600'}`}
          >
            <Monitor size={24} />
            <span className="font-semibold text-sm">Sistem</span>
          </button>
        </div>
      </div>

      {/* Uygulama Tercihleri */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Globe className="text-indigo-600" size={20} />
            Uygulama Tercihleri
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Bildirimler ve güncelleme ayarları.
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Bildirimler</h4>
                <p className="text-xs text-gray-500">
                  İşlem tamamlandığında masaüstü bildirimi göster.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Otomatik Güncelleme</h4>
                <p className="text-xs text-gray-500">
                  Yeni sürüm mevcut olduğunda otomatik olarak indir.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoUpdate}
                onChange={() => setAutoUpdate(!autoUpdate)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Veri Güvenliği ve Yedekleme</h4>
                <p className="text-xs text-gray-500">
                  Verilerinizi otomatik olarak yedekleyin (Henüz aktif değil).
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">
              Yakında
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
