import { NavLink } from 'react-router-dom'
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
  Car
} from 'lucide-react'
import logoImg from '../../assets/nufus-logo.png'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps): React.ReactElement => {
  const open = !isCollapsed

  const Menus = [
    { title: 'Ana Sayfa', src: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Takvim / Ajanda', src: <Calendar size={20} />, path: '/takvim' },
    { title: 'Arşiv Yönetim', src: <Archive size={20} />, path: '/arsiv' },
    { title: 'E-Apostil', src: <Globe size={20} />, path: '/e-apostil' },
    { title: 'Tebdil (Ehliyet)', src: <Car size={20} />, path: '/tebdil' },
    { title: 'Personel Harcama', src: <Wallet size={20} />, path: '/harcama' },
    { title: 'Posta Zimmet', src: <Mail size={20} />, path: '/posta-zimmet' },
    { title: 'Resmi Yazı', src: <FileText size={20} />, path: '/resmi-yazi' },
    { title: 'Eğitim Robotu', src: <GraduationCap size={20} />, path: '/egitim' },
    { title: 'Personel Terfi', src: <UserCheck size={20} />, path: '/personel-terfi' },
    { title: 'Mevzuat', src: <BookOpen size={20} />, path: '/mevzuat' },
    { title: 'Rehber', src: <Phone size={20} />, path: '/rehber' },
    { title: 'Ayarlar', src: <Settings size={20} />, path: '/ayarlar', gap: true }
  ]

  return (
    <div
      className={`flex flex-col h-screen bg-white dark:bg-gray-800 dark:border-gray-700 shadow-xl z-50 transition-all duration-300 ease-in-out relative border-r border-gray-100 ${open ? 'w-64' : 'w-20'}`}
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
          <li key={index}>
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-x-4 p-2.5 text-sm font-medium rounded-lg cursor-pointer transition-all group ${menu.gap ? 'mt-9' : 'mt-1'} ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent'}`
              }
            >
              <span className="shrink-0 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {menu.src}
              </span>
              <span className={`${!open && 'hidden'} origin-left duration-200 truncate`}>
                {menu.title}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="p-3 border-t border-gray-100 dark:border-gray-700 shrink-0">
        <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs shrink-0">
            M
          </div>
          <div className={`${!open && 'hidden'} overflow-hidden`}>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 truncate">
              Memur Paneli
            </h4>
            <p className="text-xs text-gray-400 truncate">v1.0.9</p>
          </div>
        </div>
      </div>
    </div>
  )
}
