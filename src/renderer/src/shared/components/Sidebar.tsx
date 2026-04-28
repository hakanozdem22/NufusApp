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
  GraduationCap,
  Calendar,
  Archive,
  Globe,
  Users,
  ChevronDown,
  Package,
  StickyNote,
  ClipboardList,
  Send,
  BookOpen,
  ShieldCheck,
  Building2
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
  badge?: number
  badgeColor?: 'gray' | 'red'
  subMenus?: SubMenuItem[]
}

export const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps): React.ReactElement => {
  const open = !isCollapsed
  const location = useLocation()
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const [notSayisi, setNotSayisi] = useState<number>(0)
  const [yaklasanEtkinlik, setYaklasanEtkinlik] = useState<number>(0)

  useEffect(() => {
    const yukleNotSayisi = async (): Promise<void> => {
      try {
        if (window.api?.getNotlar) {
          const data = await window.api.getNotlar()
          setNotSayisi((data || []).length)
        }
      } catch {
        // sessiz hata
      }
    }
    yukleNotSayisi()
    const interval = setInterval(yukleNotSayisi, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const yukleEtkinlik = async (): Promise<void> => {
      try {
        if (window.api?.getTakvim) {
          const data = await window.api.getTakvim()
          const bugun = new Date()
          bugun.setHours(0, 0, 0, 0)
          const yarin = new Date(bugun)
          yarin.setDate(yarin.getDate() + 1)
          const yarinStr = yarin.toISOString().split('T')[0]
          const bugunStr = bugun.toISOString().split('T')[0]
          const sayi = (data || []).filter((e: any) => {
            return e.tarih === bugunStr || e.tarih === yarinStr
          }).length
          setYaklasanEtkinlik(sayi)
        }
      } catch {
        // sessiz hata
      }
    }
    yukleEtkinlik()
    const interval = setInterval(yukleEtkinlik, 60000)
    return () => clearInterval(interval)
  }, [])

  const Menus: MenuItem[] = useMemo(
    () => [
      { title: 'Ana Sayfa', src: <LayoutDashboard size={20} />, path: '/' },
      { title: 'Takvim / Ajanda', src: <Calendar size={20} />, path: '/takvim', badge: yaklasanEtkinlik, badgeColor: 'red' },
      { title: 'Arşiv Yönetim', src: <Archive size={20} />, path: '/arsiv' },
      {
        title: 'Personel İşleri',
        src: <Users size={20} />,
        path: '/personel-isleri',
        subMenus: [
          { title: 'Harcama', src: <Wallet size={18} />, path: '/harcama' },
          { title: 'Terfi', src: <UserCheck size={18} />, path: '/personel-terfi' },
          { title: 'Hizmet İçi Eğitim', src: <GraduationCap size={18} />, path: '/egitim' },
          { title: 'Görevlendirmeler', src: <ClipboardList size={18} />, path: '/personel-gorevlendirme' }
        ]
      },
      {
        title: 'Posta',
        src: <Mail size={20} />,
        path: '/posta',
        subMenus: [
          { title: 'Posta Zimmet', src: <Mail size={18} />, path: '/posta-zimmet' },
          { title: 'Posta Arşivi', src: <Archive size={18} />, path: '/posta-arsiv' },
          { title: 'Gönderilen Belgeler', src: <Send size={18} />, path: '/gonderilen-belgeler' },
          {
            title: 'Yabancı Temsilcilikler',
            src: <Globe size={18} />,
            path: '/yabanci-temsilcilikler'
          },
          {
            title: 'Türk Yurtdışı Temsilcilikleri',
            src: <Globe size={18} />,
            path: '/turk-yurtdisi-temsilcilikleri'
          }
        ]
      },
      { title: 'Apostil', src: <FileText size={20} />, path: '/apostil' },
      { title: 'Resmi Yazı', src: <FileText size={20} />, path: '/resmi-yazi' },
      { title: 'Rehber', src: <Phone size={20} />, path: '/rehber' },
      { title: 'Envanter', src: <Package size={20} />, path: '/envanter' },
      { title: 'Notlar', src: <StickyNote size={20} />, path: '/notlar', badge: notSayisi },
      { title: 'Belgeler', src: <BookOpen size={20} />, path: '/belgeler' },
      { title: 'Belge Doğrulama', src: <ShieldCheck size={20} />, path: '/belge-dogrulama' },
      { title: 'Kurum Harcama', src: <Building2 size={20} />, path: '/kurum-harcama' },
      { title: 'Ayarlar', src: <Settings size={20} />, path: '/ayarlar', gap: true }
    ],
    [notSayisi, yaklasanEtkinlik]
  )

  useEffect(() => {
    if (!open) {
      setOpenSubMenu(null)
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
  }, [location.pathname, open, Menus])

  const toggleSubMenu = (menu: MenuItem): void => {
    if (!open) {
      toggleSidebar()
      setOpenSubMenu(menu.title)
      return
    }

    setOpenSubMenu((prev) => (prev === menu.title ? null : menu.title))
  }

  const [profileImage, setProfileImage] = useState<string>('')
  const [nameSurname, setNameSurname] = useState<string>('Yönetici')

  // Profil bilgilerini yükle ve dinle
  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      if (window.api && window.api.getSetting) {
        const img = await window.api.getSetting('profile_image')
        if (img) setProfileImage(img)
        const ns = await window.api.getSetting('name_surname')
        if (ns) setNameSurname(ns)
      }
    }
    loadProfile()

    // Profil güncellendiğinde tetiklenecek
    const handleUpdate = (): void => {
      loadProfile()
    }
    window.addEventListener('profile-updated', handleUpdate)
    return () => window.removeEventListener('profile-updated', handleUpdate)
  }, [])

  return (
    <div
      className={`flex flex-col h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-50 transition-all duration-500 ease-in-out relative border-r border-gray-200/50 dark:border-gray-800/50 shadow-2xl ${open ? 'w-64' : 'w-20'}`}
    >

      <div className={`flex items-center gap-4 p-5 mb-4 ${open ? '' : 'justify-center pl-2'}`}>
        <div className="relative shrink-0">
          <img
            src={logoImg}
            alt="Logo"
            className={`transition-all duration-500 object-contain drop-shadow-md ${open ? 'w-12 h-12' : 'w-9 h-9'}`}
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
        </div>
        
        <div
          className={`flex flex-col ${!open && 'hidden'} transition-all duration-500 overflow-hidden whitespace-nowrap`}
        >
          <h1 className="font-black text-gray-800 dark:text-gray-100 text-[14px] leading-none mb-1 tracking-tight">
            T.C. KAPAKLI
          </h1>
          <h2 className="font-bold text-gray-400 dark:text-gray-500 text-[10px] leading-tight tracking-[0.1em] uppercase">
            Nüfus Müdürlüğü
          </h2>
          <span className="text-[8px] font-black text-blue-500/60 dark:text-blue-400/50 uppercase tracking-[0.2em] mt-1">
            VERSİYON 13.0.0
          </span>
        </div>
      </div>

      <ul className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-hide py-2">
        {Menus.map((menu, index) => {
          const isActive = location.pathname === menu.path || (menu.subMenus?.some(s => s.path === location.pathname))
          const isSubOpen = open && openSubMenu === menu.title

          return (
          <li key={index} className={menu.gap ? 'mt-8 pt-8 border-t border-gray-100 dark:border-gray-800' : 'mt-0.5'}>
            {menu.subMenus ? (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => toggleSubMenu(menu)}
                  className={`flex items-center gap-x-3.5 p-3 text-sm font-semibold rounded-2xl cursor-pointer transition-all duration-300 group relative
                  ${isSubOpen || isActive ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'}
                  `}
                >
                  <span className={`shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {menu.src}
                  </span>
                  <span className={`${!open && 'hidden'} flex-1 text-[13px] tracking-tight text-left`}>{menu.title}</span>
                  {open && (
                    <span className={`shrink-0 transition-transform duration-300 ${isSubOpen ? 'rotate-180 text-blue-500' : 'opacity-40'}`}>
                      <ChevronDown size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
                
                {isSubOpen && (
                  <ul className="pl-4 mt-1 space-y-1 border-l-2 border-blue-100 dark:border-blue-900/30 ml-8 animate-in fade-in slide-in-from-top-2 duration-300">
                    {menu.subMenus.map((subMenu, subIndex) => {
                      const isSubActive = location.pathname === subMenu.path
                      return (
                      <li key={subIndex}>
                        <NavLink
                          to={subMenu.path}
                          className={`flex items-center gap-x-3 p-2.5 text-[12px] font-bold rounded-xl cursor-pointer transition-all duration-300
                             ${isSubActive ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-500/80 dark:text-gray-400/80 hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:text-gray-800 dark:hover:text-gray-200'}
                            `}
                        >
                          <span className={`shrink-0 ${isSubActive ? 'scale-110 opacity-100' : 'opacity-50'}`}>{subMenu.src}</span>
                          <span className="truncate tracking-tight">{subMenu.title}</span>
                        </NavLink>
                      </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to={menu.path!}
                className={({ isActive }) =>
                  `flex items-center gap-x-3.5 p-3 text-sm font-semibold rounded-2xl cursor-pointer transition-all duration-300 group relative
                  ${isActive ? 'bg-blue-600 shadow-lg shadow-blue-500/25 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'}
                  `
                }
              >
                <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                  {menu.src}
                </span>
                <span className={`${!open && 'hidden'} origin-left duration-300 text-[13px] tracking-tight text-left flex-1`}>
                  {menu.title}
                </span>
                {open && menu.badge != null && menu.badge > 0 && (
                  <span className={`shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                    menu.badgeColor === 'red'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    {menu.badge}
                  </span>
                )}
              </NavLink>
            )}
          </li>
          )
        })}
      </ul>

      {/* COLLAPSE BUTTON */}
      <div className={`px-3 pb-2 ${!open && 'flex justify-center'}`}>
        <button
          onClick={toggleSidebar}
          className={`flex items-center gap-2.5 w-full p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group ${!open && 'justify-center w-auto px-3'}`}
        >
          <div className={`flex items-center justify-center w-6 h-6 rounded-lg bg-white dark:bg-gray-700 shadow-sm group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900 transition-all duration-300 shrink-0 ${!open && 'rotate-180'}`}>
            <ChevronLeft size={14} strokeWidth={2.5} />
          </div>
          {open && (
            <span className="text-[11px] font-bold tracking-tight truncate">Daralt</span>
          )}
        </button>
      </div>

      {/* USER PROFILE FOOTER */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 backdrop-blur-sm shadow-inner overflow-hidden">
        <div className={`flex items-center gap-3.5 ${!open && 'justify-center pl-1'}`}>
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 overflow-hidden ring-2 ring-white dark:ring-gray-800 transition-transform hover:scale-105 cursor-pointer shrink-0 ${!profileImage && 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              nameSurname.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className={`${!open && 'hidden'} overflow-hidden`}>
            <h4 className="font-extrabold text-[13px] text-gray-800 dark:text-gray-200 truncate leading-none mb-1 uppercase tracking-tight">
              {nameSurname}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                Sistem Yöneticisi
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
