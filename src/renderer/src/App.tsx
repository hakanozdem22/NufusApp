import { HashRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './shared/layouts/MainLayout'

// Modüller
import { Dashboard } from './modules/dashboard/views/Dashboard'
import { HarcamaListesi } from './modules/personel_harcama/views/HarcamaListesi'
import { RehberListesi } from './modules/rehber/views/RehberListesi'
import { PostaZimmet } from './modules/posta_zimmet/views/PostaZimmet'
import { PostaArsiv } from './modules/posta_zimmet/views/PostaArsiv'
// PersonelAyarlari removed as it is now used inside Settings
import { PersonelTerfi } from './modules/personel_terfi/views/PersonelTerfi'
import { ResmiYazi } from './modules/resmi_yazi/views/ResmiYazi'
import { EgitimRobotu } from './modules/egitim/views/EgitimRobotu'
import { Takvim } from './modules/takvim/views/Takvim'
import { Arsiv } from './modules/arsiv/views/Arsiv'
import { PersonelIsleriDashboard } from './modules/personel_isleri/views/PersonelIsleriDashboard'
import { Settings } from './modules/settings/views/Settings'
// Envanter
import { EnvanterDashboard } from './modules/envanter/views/EnvanterDashboard'
import { EnvanterSettings } from './modules/envanter/views/EnvanterSettings'
// Yabancı Temsilcilikler
import { YabanciTemsilciliklerView } from './modules/yabanci_temsilcilikler/views/YabanciTemsilcilikler'
// Türk Yurtdışı Temsilcilikleri
import { TurkYurtdisiTemsilcilikleriView } from './modules/turk_yurtdisi_temsilcilikleri/views/TurkYurtdisiTemsilcilikleri'
// Apostil
import { ApostilView } from './modules/apostil/views/ApostilView'
// Dış İlişkiler / Posta Dashboard
import { DisIliskilerDashboard } from './modules/dis_iliskiler/views/DisIliskilerDashboard'
// Notlar
import { Notlar } from './modules/notlar/views/Notlar'
// Gönderilen Belgeler
import { GonderilenBelgeler } from './modules/gonderilen_belgeler/views/GonderilenBelgeler'
// Personel Görevlendirmeleri
import { PersonelGorevlendirme } from './modules/personel_gorevlendirme/views/PersonelGorevlendirme'
// Belgeler Arşivi
import { BelgelerView } from './modules/belgeler/views/BelgelerView'
// Belge Doğrulama Siteleri
import { BelgeDogrulamaView } from './modules/belge_dogrulama/views/BelgeDogrulamaView'
// Kurum Harcama
import { KurumHarcamaView } from './modules/kurum_harcama/views/KurumHarcamaView'

import { ThemeProvider } from './shared/context/ThemeContext'
import { HeaderProvider } from './shared/context/HeaderContext'
import { useState } from 'react'
import { Login } from './modules/auth/Login'

function App(): React.ReactElement {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const handleLogin = (): void => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <ThemeProvider>
      <HeaderProvider>
        <HashRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/harcama" element={<HarcamaListesi />} />
              <Route path="/posta-zimmet" element={<PostaZimmet />} />
              <Route path="/posta-arsiv" element={<PostaArsiv />} />
              <Route path="/resmi-yazi" element={<ResmiYazi />} />
              <Route path="/personel-terfi" element={<PersonelTerfi />} />
              <Route path="/egitim" element={<EgitimRobotu />} />
              <Route path="/rehber" element={<RehberListesi />} />
              <Route path="/takvim" element={<Takvim />} />
              <Route path="/arsiv" element={<Arsiv />} />
              <Route path="/posta" element={<DisIliskilerDashboard />} />
              <Route path="/personel-isleri" element={<PersonelIsleriDashboard />} />
              <Route path="/yabanci-temsilcilikler" element={<YabanciTemsilciliklerView />} />
              <Route
                path="/turk-yurtdisi-temsilcilikleri"
                element={<TurkYurtdisiTemsilcilikleriView />}
              />
              <Route path="/apostil" element={<ApostilView />} />

              <Route path="/envanter" element={<EnvanterDashboard />} />
              <Route path="/envanter-tanimlar" element={<EnvanterSettings />} />

              <Route path="/personel-gorevlendirme" element={<PersonelGorevlendirme />} />
              <Route path="/gonderilen-belgeler" element={<GonderilenBelgeler />} />
              <Route path="/notlar" element={<Notlar />} />
              <Route path="/belgeler" element={<BelgelerView />} />
              <Route path="/belge-dogrulama" element={<BelgeDogrulamaView />} />
              <Route path="/kurum-harcama" element={<KurumHarcamaView />} />

              <Route path="/ayarlar" element={<Settings />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </MainLayout>
        </HashRouter>
      </HeaderProvider>
    </ThemeProvider>
  )
}

export default App
