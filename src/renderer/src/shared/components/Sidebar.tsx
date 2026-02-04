import { useState, useEffect, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  Phone,
  Mail,
  Settings,
  ChevronLeft,
  FileText,
  UserCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  Archive,
  Globe,
  Car,
  Users,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import logoImg from '../../assets/nufus-logo.png'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

interface SubMenuItem {
  title: string
  path: string
  src: React.ReactNode
}

interface MenuItem {
  title: string
  src: React.ReactNode
  path?: string
  gap?: boolean
  subMenus?: SubMenuItem[]
}

export const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps): React.ReactElement => {
  const open = !isCollapsed
  const location = useLocation()
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const Menus: MenuItem[] = useMemo(
    () => [
      { title: 'Ana Sayfa', src: <LayoutDashboard size={20} />, path: '/' },
      { title: 'Takvim / Ajanda', src: <Calendar size={20} />, path: '/takvim' },
      { title: 'Arşiv Yönetim', src: <Archive size={20} />, path: '/arsiv' },
      { title: 'Apostil', src: <Globe size={20} />, path: '/e-apostil' },
      {
        title: 'Sürücü Belgesi',
        src: <Car size={20} />,
        path: '/surucu-belgesi',
        subMenus: [{ title: 'Tebdil', src: <Car size={18} />, path: '/tebdil' }]
      },
      {
        title: 'Personel İşleri',
        src: <Users size={20} />,
        path: '/personel-isleri',
        subMenus: [
          { title: 'Harcama', src: <Wallet size={18} />, path: '/harcama' },
          { title: 'Terfi', src: <UserCheck size={18} />, path: '/personel-terfi' },
          { title: 'Hizmet İçi Eğitim', src: <GraduationCap size={18} />, path: '/egitim' }
        ]
      },
      { title: 'Posta Zimmet', src: <Mail size={20} />, path: '/posta-zimmet' },
      { title: 'Resmi Yazı', src: <FileText size={20} />, path: '/resmi-yazi' },
      { title: 'Mevzuat', src: <BookOpen size={20} />, path: '/mevzuat' },
      { title: 'Rehber', src: <Phone size={20} />, path: '/rehber' },
      { title: 'Ayarlar', src: <Settings size={20} />, path: '/ayarlar', gap: true }
    ],
    []
  )

  useEffect(() => {
    if (!open) {
      setOpenSubMenu((prev) => (prev ? null : prev))
      return
    }

    // Aktif rotaya göre alt menüyü otomatik aç
    const activeMenu = Menus.find(
      (menu) =>
        menu.subMenus?.some((sub) => sub.path === location.pathname) ||
        menu.path === location.pathname
    )

    if (activeMenu && openSubMenu !== activeMenu.title) {
      setOpenSubMenu(activeMenu.title)
    }
  }, [location.pathname, open, Menus]) // openSubMenu removed to prevent loop on toggle

  const toggleSubMenu = (menu: MenuItem): void => {
    if (!open) return // Sidebar kapalıysa açma

    // Auto-navigate if the menu has a path
    // Note: The click handler in the JSX needs to trigger navigation if we want it to behave like a link
    // But since we are using div onClick, we might need to handle navigation manually or wrap in NavLink.
    // However, if we wrap in NavLink, it might conflict with the toggle logic or default browser behavior.

    // The user wants: "personel işlerini tıkladığım zaman ana panelde sadece alt menuleri kalsın"
    // This implies navigation to the dashboard.

    setOpenSubMenu((prev) => (prev === menu.title ? null : menu.title))
  }

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-gray-800 dark:border-gray-700 shadow-xl z-50 transition-all duration-300 ease-in-out relative border-r border-gray-100 ${open ? 'w-64' : 'w-20'}`}
    >
      <button
        className={`absolute -right-3 top-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-blue-600 dark:text-blue-400 p-1 rounded-full shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition z-50 ${!open && 'rotate-180'}`}
        onClick={toggleSidebar}
      >
        <ChevronLeft size={18} />
      </button>

      <div className={`flex items-center gap-3 p-4 mb-2 ${open ? '' : 'justify-center pl-2'}`}>
        <img
          src={logoImg}
          alt="Logo"
          className={`transition-all duration-300 object-contain ${open ? 'w-10 h-10' : 'w-8 h-8'}`}
        />
        <div
          className={`flex flex-col ${!open && 'hidden'} transition-all duration-300 overflow-hidden whitespace-nowrap`}
        >
          <h1 className="font-bold text-gray-800 dark:text-gray-200 text-[13px] leading-tight">
            T.C. KAPAKLI
          </h1>
          <h2 className="font-medium text-gray-600 dark:text-gray-400 text-[11px] leading-tight">
            İLÇE NÜFUS MÜDÜRLÜĞÜ
          </h2>
        </div>
      </div>

      <ul className="flex-1 pt-2 px-4 pb-4 space-y-1 overflow-y-auto">
        {Menus.map((menu, index) => (
          <li key={index} className={menu.gap ? 'mt-9' : 'mt-1'}>
            {menu.subMenus ? (
              <>
                <NavLink
                  to={menu.path || '#'}
                  className={({ isActive }) =>
                    `flex items-center gap-x-4 p-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all group
                  ${openSubMenu === menu.title || isActive ? 'bg-blue-50 dark:bg-gray-700/50 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'}
                  `
                  }
                  onClick={(e) => {
                    if (!menu.path) e.preventDefault()
                    toggleSubMenu(menu)
                  }}
                >
                  <span className="shrink-0 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {menu.src}
                  </span>
                  <span className={`${!open && 'hidden'} flex-1 truncate`}>{menu.title}</span>
                  {open && (
                    <span className="shrink-0">
                      {openSubMenu === menu.title ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </span>
                  )}
                </NavLink>
                {open && openSubMenu === menu.title && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {menu.subMenus.map((subMenu, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={subMenu.path}
                          className={({ isActive }) =>
                            `flex items-center gap-x-3 p-2 text-[13px] font-medium rounded-lg cursor-pointer transition-all
                             ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'}
                            `
                          }
                        >
                          <span className="shrink-0">{subMenu.src}</span>
                          <span className="truncate">{subMenu.title}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={menu.path!}
                className={({ isActive }) =>
                  `flex items-center gap-x-4 p-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all group ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent'}`
                }
              >
                <span className="shrink-0 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {menu.src}
                </span>
                <span className={`${!open && 'hidden'} origin-left duration-200 truncate`}>
                  {menu.title}
                </span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
          <img src={logoImg} alt="Mevzuat Logo" className="w-8 h-8 object-contain shrink-0" />
          <div className={`${!open && 'hidden'} overflow-hidden`}>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 truncate">
              Mevzuat
            </h4>
            <p className="text-xs text-gray-400 truncate">v3.6.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
