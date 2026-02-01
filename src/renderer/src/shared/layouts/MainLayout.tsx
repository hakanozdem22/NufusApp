import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TitleBar } from '../components/TitleBar' // Yeni bileşen

interface MainLayoutProps {
  children: React.ReactNode // İçine değişen sayfalar gelecek
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [profileImage, setProfileImage] = useState<string>('')
  const [nameSurname, setNameSurname] = useState<string>('Yönetici')

  // Profil bilgilerini yükle ve dinle
  useState(() => {
    const loadProfile = async () => {
      if (window.api && window.api.getSetting) {
        const img = await window.api.getSetting('profile_image')
        if (img) setProfileImage(img)
        const ns = await window.api.getSetting('name_surname')
        if (ns) setNameSurname(ns)
      }
    }
    loadProfile()

    // Profil güncellendiğinde tetiklenecek
    const handleUpdate = () => loadProfile()
    window.addEventListener('profile-updated', handleUpdate)
    return () => window.removeEventListener('profile-updated', handleUpdate)
  })

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* BAŞLIK ÇUBUĞU EN ÜSTTE */}
      <TitleBar />

      {/* ALTTA SIDEBAR VE İÇERİK */}
      <div className="flex flex-1 overflow-hidden">
        {/* SOL TARAFTA SIDEBAR */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* SAĞ TARAFTA İÇERİK ALANI */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Navbar */}
          <header className="h-16 bg-white dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Ana Panel</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{nameSurname}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold overflow-hidden ${!profileImage && 'bg-blue-500'}`}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  nameSurname.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </header>

          {/* Değişen İçerik (Sayfalar Buraya Gelecek) */}
          <main className="flex-1 overflow-y-auto p-6 relative">{children}</main>
        </div>
      </div>
    </div>
  )
}
