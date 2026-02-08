import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './shared/layouts/MainLayout'

// Modüller
import { Dashboard } from './modules/dashboard/views/Dashboard'
import { HarcamaListesi } from './modules/personel_harcama/views/HarcamaListesi'
import { RehberListesi } from './modules/rehber/views/RehberListesi'
import { PostaZimmet } from './modules/posta_zimmet/views/PostaZimmet'
// PersonelAyarlari removed as it is now used inside Settings
import { PersonelTerfi } from './modules/personel_terfi/views/PersonelTerfi'
import { ResmiYazi } from './modules/resmi_yazi/views/ResmiYazi'
import { Mevzuat } from './modules/mevzuat/views/Mevzuat'
import { EgitimRobotu } from './modules/egitim/views/EgitimRobotu'
import { Takvim } from './modules/takvim/views/Takvim'
import { Arsiv } from './modules/arsiv/views/Arsiv'
import { EApostil } from './modules/e_apostil/views/EApostil'
import { Tebdil } from './modules/tebdil/views/Tebdil'
import { SurucuBelgesiDashboard } from './modules/surucu_belgesi/views/SurucuBelgesiDashboard'
import { PersonelIsleriDashboard } from './modules/personel_isleri/views/PersonelIsleriDashboard'
import { Settings } from './modules/settings/views/Settings'
// Envanter
import { EnvanterDashboard } from './modules/envanter/views/EnvanterDashboard'
import { EnvanterSettings } from './modules/envanter/views/EnvanterSettings'

import { ThemeProvider } from './shared/context/ThemeContext'
import { useState } from 'react'
import { Login } from './modules/auth/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const handleLogin = (): void => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <ThemeProvider>
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/harcama" element={<HarcamaListesi />} />
            <Route path="/posta-zimmet" element={<PostaZimmet />} />
            <Route path="/resmi-yazi" element={<ResmiYazi />} />
            <Route path="/personel-terfi" element={<PersonelTerfi />} />
            <Route path="/egitim" element={<EgitimRobotu />} />
            <Route path="/mevzuat" element={<Mevzuat />} />
            <Route path="/rehber" element={<RehberListesi />} />
            <Route path="/takvim" element={<Takvim />} />
            <Route path="/arsiv" element={<Arsiv />} />
            <Route path="/e-apostil" element={<EApostil />} />
            <Route path="/tebdil" element={<Tebdil />} />
            <Route path="/personel-isleri" element={<PersonelIsleriDashboard />} />
            <Route path="/surucu-belgesi" element={<SurucuBelgesiDashboard />} />

            <Route path="/envanter" element={<EnvanterDashboard />} />
            <Route path="/envanter-tanimlar" element={<EnvanterSettings />} />

            <Route path="/ayarlar" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
