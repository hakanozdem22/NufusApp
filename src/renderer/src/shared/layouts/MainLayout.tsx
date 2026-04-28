import { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TitleBar } from '../components/TitleBar'

interface MainLayoutProps {
  children: React.ReactNode // İçine değişen sayfalar gelecek
}

export const MainLayout = ({ children }: MainLayoutProps): React.ReactElement => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* BAŞLIK ÇUBUĞU EN ÜSTTE */}
      <TitleBar />

      {/* ALTTA SIDEBAR VE İÇERİK */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SOL TARAFTA SIDEBAR */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* SAĞ TARAFTA İÇERİK ALANI */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
          {/* Değişen İçerik (Sayfalar Buraya Gelecek) */}
          <main className="flex-1 overflow-y-auto scrollbar-hide relative">{children}</main>
        </div>
      </div>
    </div>
  )
}
