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
import { Settings } from './modules/settings/views/Settings'

import { ThemeProvider } from './shared/context/ThemeContext'

function App() {
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

            <Route path="/ayarlar" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
