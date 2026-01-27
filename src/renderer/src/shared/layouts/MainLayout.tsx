import { useState } from 'react'
import { Sidebar } from '../components/Sidebar' // Az önce oluşturduğumuz dosya

interface MainLayoutProps {
  children: React.ReactNode // İçine değişen sayfalar gelecek
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 overflow-hidden">
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
            <span className="text-sm text-gray-500">Hakan (Admin)</span>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              H
            </div>
          </div>
        </header>

        {/* Değişen İçerik (Sayfalar Buraya Gelecek) */}
        <main className="flex-1 overflow-y-auto p-6 relative">{children}</main>
      </div>
    </div>
  )
}
