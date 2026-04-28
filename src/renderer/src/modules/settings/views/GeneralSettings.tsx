import { Moon, Sun, Monitor } from 'lucide-react'
import React from 'react'

import { useTheme } from '../../../shared/context/ThemeContext'

export const GeneralSettings = (): React.ReactElement => {
  const { theme, setTheme } = useTheme()

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

    </div>
  )
}
