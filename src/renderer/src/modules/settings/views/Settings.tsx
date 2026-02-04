import { useState } from 'react'
import { Settings as SettingsIcon, Info, Monitor, Receipt, User, Key } from 'lucide-react'
import { GeneralSettings } from './GeneralSettings'
import { HarcamaSettings } from './HarcamaSettings'
import { AboutSettings } from './AboutSettings'
import { ArsivSettings } from './ArsivSettings'
import { KurumSettings } from './KurumSettings'
import { EgitimSettings } from './EgitimSettings'
import { ProfileSettings } from './ProfileSettings'
import { ApiKeysSettings } from './ApiKeysSettings'
import { Archive, Building2, GraduationCap } from 'lucide-react'

export const Settings = (): React.ReactElement => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'harcama' | 'about' | 'arsiv' | 'kurum' | 'egitim' | 'profile' | 'apikeys'
  >('general')

  const tabs = [
    { id: 'profile', label: 'Profil Ayarları', icon: User },
    { id: 'general', label: 'Genel Ayarlar', icon: Monitor },
    { id: 'apikeys', label: 'API Anahtarları', icon: Key },
    { id: 'harcama', label: 'Personel Harcama', icon: Receipt },
    { id: 'kurum', label: 'Kurum Tanımları', icon: Building2 },
    { id: 'egitim', label: 'Eğitim Ayarları', icon: GraduationCap },
    { id: 'arsiv', label: 'Arşiv Yönetimi', icon: Archive },
    { id: 'about', label: 'Hakkında', icon: Info }
  ]

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors">
      {/* Sidebar - Settings Menu */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <SettingsIcon className="text-gray-400" />
            Ayarlar
          </h2>
        </div>
        <div className="p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 dark:text-blue-300 text-xs mb-1">
              Yardım mı lazım?
            </h4>
            <p className="text-blue-600 dark:text-blue-400 text-xs leading-relaxed">
              Ayarlarla ilgili sorun yaşarsanız Bilgi İşlem ile iletişime geçin.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>

          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'apikeys' && <ApiKeysSettings />}
          {activeTab === 'harcama' && <HarcamaSettings />}
          {activeTab === 'kurum' && <KurumSettings />}
          {activeTab === 'egitim' && <EgitimSettings />}
          {activeTab === 'arsiv' && <ArsivSettings />}
          {activeTab === 'about' && <AboutSettings />}
        </div>
      </div>
    </div>
  )
}
