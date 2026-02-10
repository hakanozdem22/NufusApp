/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, shell, BrowserWindow, ipcMain, dialog, session, protocol, net } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { spawn } from 'child_process'
import fs from 'fs'
import icon from '../../resources/icon.png?asset'

import {
  initDatabase,
  addHarcama,
  getHarcamalarByMonth,
  getDevirBakiyesi,
  deleteHarcama,
  updateHarcama,
  getHarcamaPersonelleri,
  addHarcamaYerelKisi,
  deleteHarcamaGorunum,
  getPersoneller,
  addPersonel,
  deletePersonel,
  updatePersonel,
  getRehber,
  addRehber,
  updateRehber,
  deleteRehber,
  getZimmet,
  addZimmet,
  updateZimmetDurum,
  deleteZimmet,
  searchZimmet,
  getEvraklar,
  addEvrak,
  updateEvrak,
  deleteEvrak,
  getEgitimKonular,
  addEgitimKonu,
  deleteEgitimKonu,
  updateEgitimKonu,
  getEgitimEgiticiler,
  addEgitimEgitici,
  deleteEgitimEgitici,
  updateEgitimEgitici, // YENİ
  getEgitimPlanlar,
  saveEgitimPlan,
  deleteEgitimPlan,
  getEgitimPlanDetay,
  getEgitimPersoneller,
  addEgitimPersonel,
  deleteEgitimPersonel,
  updateEgitimPersonel, // YENİ
  getTakvimEtkinlikleri,
  addTakvimEtkinlik,
  updateTakvimEtkinlik,
  deleteTakvimEtkinlik,
  getArsivDosyalar,
  addArsivDosya,
  updateArsivDosya,
  deleteArsivDosya,
  getArsivKlasorTanimlari,
  addArsivKlasorTanim,
  deleteArsivKlasorTanim,
  addArsivToplu,
  updateArsivToplu,
  deleteArsivToplu,
  getNextArsivKlasorNo,
  getSetting,
  setSetting,
  getAllSettings,
  // E-APOSTİL
  getEApostil,
  addEApostil,
  updateEApostil,
  deleteEApostil,
  getEApostilFiles,
  addEApostilFile,
  deleteEApostilFile, // YENİ
  // TEBDİL (EHLİYET)
  getTebdil,
  addTebdil,
  updateTebdil,
  deleteTebdil,
  getTebdilFiles,
  addTebdilFile,
  deleteTebdilFile,
  fetchTebdilData,
  // Harcama Sabit Personel
  getHarcamaSabitPersoneller,
  addHarcamaSabitPersonel,
  deleteHarcamaSabitPersonel,
  // Kurum Tanımları
  getKurumTanimlari,
  addKurumTanim,
  deleteKurumTanim,
  // Arşiv İmha Komisyonu
  getArsivImhaKomisyonu,
  addArsivImhaKomisyonu,
  deleteArsivImhaKomisyonu,
  // Eğitim Düzenleyenler
  getEgitimDuzenleyenler,
  addEgitimDuzenleyen,
  updateEgitimDuzenleyen,
  deleteEgitimDuzenleyen,
  // ENVANTER
  getEnvanterMalzemeler,
  addEnvanterMalzeme,
  updateEnvanterMalzeme,
  deleteEnvanterMalzeme,
  getEnvanterSummary,
  getEnvanterKategoriler,
  addEnvanterKategori,
  deleteEnvanterKategori,
  updateEnvanterKategori, // Add this if missing in database.ts export, I added it manually
  getEnvanterYerler,
  addEnvanterYer,
  deleteEnvanterYer,
  updateEnvanterYer,
  getEnvanterMalzemeTanimlari,
  addEnvanterMalzemeTanim,
  deleteEnvanterMalzemeTanim,
  updateEnvanterMalzemeTanim,
  getEnvanterMarkaTanimlari,
  addEnvanterMarkaTanim,
  deleteEnvanterMarkaTanim,
  updateEnvanterMarkaTanim,
  getEnvanterPersonelTanimlari,
  addEnvanterPersonelTanim,
  deleteEnvanterPersonelTanim,
  updateEnvanterPersonelTanim
} from './database'

// Güvenli Protokol
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-resource',
    privileges: { secure: true, standard: true, supportFetchAPI: true, corsEnabled: true }
  }
])

app.userAgentFallback =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    frame: false, // Çerçevesiz mod
    titleBarStyle: 'hidden', // Gerekirse mac için
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webviewTag: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  })

  // Pencere Kontrol IPC'leri
  ipcMain.on('window-minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    mainWindow.close()
  })

  // Start maximized but keep taskbar visible (do not force FullScreen)

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL'])
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  else mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  protocol.registerFileProtocol('local-resource', (request, callback) => {
    const url = request.url.replace('local-resource://', '')
    try {
      return callback(decodeURI(url))
    } catch (error) {
      console.error(error)
    }
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // OTOMATİK GÜNCELLEME BAŞLANGIÇ
  // TODO: Buraya kendi GitHub Token'ınızı yapıştırın veya build sırasında Environment Variable olarak verin
  // Güvenlik Uyarısı: Bu token kodun içinde açıkça durursa ve repo sızarsa erişim sağlanabilir.
  // Private repo olduğu için bu token şart.
  // autoUpdater.requestHeaders = { "PRIVATE-TOKEN": "hp_gziHkxN6rBAzkKyYb9EYyYzl3oBV" } // GitLab örneği, GitHub için alta bak

  // GitHub Private Repo için Token Ayarı:
  const GH_TOKEN = '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'
  process.env.GH_TOKEN = GH_TOKEN

  autoUpdater.autoDownload = false // Kullanıcıya sormadan indirmesin (isteğe bağlı true yapabilirsiniz)

  autoUpdater.on('checking-for-update', () => {
    console.log('Güncellemeler kontrol ediliyor...')
  })

  autoUpdater.on('update-available', (info) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Güncelleme Mevcut',
        message: `Yeni versiyon (${info.version}) bulundu. İndirmek ister misiniz?`,
        buttons: ['Evet', 'Hayır']
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate()
        }
      })
  })

  autoUpdater.on('update-not-available', () => {
    console.log('Güncel sürüm kullanıyorsunuz.')
  })

  autoUpdater.on('error', (err) => {
    console.error('Güncelleme hatası:', err)
  })

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Güncelleme Hazır',
        message: 'Güncelleme indirildi. Uygulama kapatılıp yenisi yüklenecek.',
        buttons: ['Tamam']
      })
      .then(() => {
        autoUpdater.quitAndInstall()
      })
  })

  // Uygulama açıldığında 3 saniye sonra kontrol et
  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 3000)
  // OTOMATİK GÜNCELLEME BİTİŞ

  const userDataPath = app.getPath('userData')
  initDatabase(userDataPath)

  ipcMain.handle('read-image', async (_, path) => {
    try {
      if (!path) return null
      if (path.startsWith('http')) return path
      if (!fs.existsSync(path)) return null
      const bitmap = fs.readFileSync(path)
      const base64 = Buffer.from(bitmap).toString('base64')
      let mime = 'image/png'
      if (path.toLowerCase().endsWith('.jpg') || path.toLowerCase().endsWith('.jpeg'))
        mime = 'image/jpeg'
      if (path.toLowerCase().endsWith('.webp')) mime = 'image/webp'
      if (path.toLowerCase().endsWith('.svg')) mime = 'image/svg+xml'
      return `data:${mime};base64,${base64}`
    } catch (_e) {
      return null
    }
  })

  ipcMain.handle('open-external', async (_, url) => {
    await shell.openExternal(url)
  })

  ipcMain.handle('fetch-hcch-data', async () => {
    return new Promise((resolve) => {
      const request = net.request(
        'https://www.hcch.net/en/instruments/conventions/specialised-sections/operational-e-registers'
      )
      let body = ''
      request.on('response', (response) => {
        response.on('data', (chunk) => {
          body += chunk.toString()
        })
        response.on('end', () => {
          resolve(body)
        })
      })
      request.on('error', () => {
        resolve(null)
      })
      request.end()
    })
  })

  // TAKVİM
  ipcMain.handle('get-takvim', async () => getTakvimEtkinlikleri())
  ipcMain.handle('add-takvim', async (_, data) => addTakvimEtkinlik(data))
  ipcMain.handle('update-takvim', async (_, data) => updateTakvimEtkinlik(data))
  ipcMain.handle('delete-takvim', async (_, id) => deleteTakvimEtkinlik(id))

  // E-APOSTİL ANA
  ipcMain.handle('get-eapostil', async () => getEApostil())
  ipcMain.handle('add-eapostil', async (_, data) => addEApostil(data))
  ipcMain.handle('update-eapostil', async (_, data) => updateEApostil(data))
  ipcMain.handle('delete-eapostil', async (_, id) => deleteEApostil(id))

  // YENİ: E-APOSTİL DOSYALARI
  ipcMain.handle('get-eapostil-files', async (_, id) => getEApostilFiles(id))
  ipcMain.handle('add-eapostil-file', async (_, data) => addEApostilFile(data))
  ipcMain.handle('delete-eapostil-file', async (_, id) => deleteEApostilFile(id))

  // TEBDİL (EHLİYET)
  ipcMain.handle('get-tebdil', async () => getTebdil())
  ipcMain.handle('add-tebdil', async (_, data) => addTebdil(data))
  ipcMain.handle('update-tebdil', async (_, data) => updateTebdil(data))
  ipcMain.handle('delete-tebdil', async (_, id) => deleteTebdil(id))
  ipcMain.handle('get-tebdil-files', async (_, id) => getTebdilFiles(id))
  ipcMain.handle('add-tebdil-file', async (_, data) => addTebdilFile(data))
  ipcMain.handle('delete-tebdil-file', async (_, id) => deleteTebdilFile(id))
  ipcMain.handle('fetch-tebdil-data', async () => fetchTebdilData())

  // ARŞİV
  ipcMain.handle('get-next-arsiv-no', async (_, yili) => getNextArsivKlasorNo(yili))
  ipcMain.handle('get-arsiv', async (_, f) => getArsivDosyalar(f))
  ipcMain.handle('add-arsiv', async (_, d) => addArsivDosya(d))
  ipcMain.handle('add-arsiv-toplu', async (_, d) => addArsivToplu(d))
  ipcMain.handle('update-arsiv-toplu', async (_, d) => updateArsivToplu(d))
  ipcMain.handle('delete-arsiv-toplu', async (_, ids) => deleteArsivToplu(ids))
  ipcMain.handle('update-arsiv', async (_, d) => updateArsivDosya(d))
  ipcMain.handle('delete-arsiv', async (_, id) => deleteArsivDosya(id))
  ipcMain.handle('get-arsiv-tanimlar', async () => getArsivKlasorTanimlari())
  ipcMain.handle('add-arsiv-tanim', async (_, ad) => addArsivKlasorTanim(ad))
  ipcMain.handle('delete-arsiv-tanim', async (_, id) => deleteArsivKlasorTanim(id))
  // Arşiv İmha Komisyonu
  ipcMain.handle('get-arsiv-imha-komisyonu', async () => getArsivImhaKomisyonu())
  ipcMain.handle('add-arsiv-imha-komisyonu', async (_, d) => addArsivImhaKomisyonu(d))
  ipcMain.handle('delete-arsiv-imha-komisyonu', async (_, id) => deleteArsivImhaKomisyonu(id))

  // Diğer Modüller (Aynen Kalmalı)
  const handlePdf = async (scriptName, data): Promise<any> => {
    return new Promise((resolve, reject) => {
      const scriptPath = is.dev
        ? join(__dirname, `../../resources/${scriptName}`)
        : join(process.resourcesPath, scriptName)
      const pythonProcess = spawn('python', [scriptPath])
      let dataString = ''
      let errorString = ''

      // Add desktop path to data for Python scripts
      const desktopPath = app.getPath('desktop')
      const dataWithDesktop = { ...data, desktop_path: desktopPath }

      pythonProcess.stdin.write(JSON.stringify(dataWithDesktop))
      pythonProcess.stdin.end()

      pythonProcess.stdout.on('data', (d) => (dataString += d.toString()))
      pythonProcess.stderr.on('data', (d) => {
        errorString += d.toString()
        console.error('Python Stderr:', d.toString())
      })

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`)
          console.error('Error details:', errorString)
          reject(errorString || 'Python script hata kodu ile kapandı')
          return
        }

        try {
          resolve(dataString)
        } catch (_e) {
          reject('Hata')
        }
      })
    })
  }
  ipcMain.handle('create-pdf-python', async (_, data) =>
    handlePdf('zimmet_pdf.py', { liste: data })
  )
  ipcMain.handle('save-zimmet-pdf', async (_, buffer) => {
    try {
      const desktop = app.getPath('desktop')
      // Format: Zimmet_dd-mm-yyyy_HH-MM-SS.pdf
      const now = new Date()
      const format = (n: number) => (n < 10 ? '0' + n : n)
      const dateStr = `${format(now.getDate())}-${format(now.getMonth() + 1)}-${now.getFullYear()}_${format(now.getHours())}-${format(now.getMinutes())}-${format(now.getSeconds())}`
      const fileName = `Zimmet_${dateStr}.pdf`
      const filePath = join(desktop, fileName)
      fs.writeFileSync(filePath, Buffer.from(buffer))
      await shell.openPath(filePath)
      return { success: true, path: filePath }
    } catch (e: any) {
      console.error(e)
      return { success: false, error: e.message }
    }
  })

  // GENERIC PDF SAVER
  ipcMain.handle('save-pdf', async (_, { buffer, prefix }) => {
    try {
      const desktop = app.getPath('desktop')
      const now = new Date()
      const format = (n: number) => (n < 10 ? '0' + n : n)
      const dateStr = `${format(now.getDate())}-${format(now.getMonth() + 1)}-${now.getFullYear()}_${format(now.getHours())}-${format(now.getMinutes())}-${format(now.getSeconds())}`
      const fileName = `${prefix || 'Rapor'}_${dateStr}.pdf`
      const filePath = join(desktop, fileName)
      fs.writeFileSync(filePath, Buffer.from(buffer))
      await shell.openPath(filePath)
      return { success: true, path: filePath }
    } catch (e: any) {
      console.error(e)
      return { success: false, error: e.message }
    }
  })
  ipcMain.handle('create-pdf-terfi', async (_, data) => handlePdf('terfi_pdf.py', data))
  ipcMain.handle('create-pdf-resmi-yazi', async (_, data) =>
    handlePdf('resmi_yazi_pdf.py', { liste: data })
  )
  ipcMain.handle('create-pdf-harcama', async (_, data) => handlePdf('harcama_pdf.py', data))
  ipcMain.handle('create-pdf-egitim', async (_, data) => handlePdf('egitim_pdf.py', data))
  ipcMain.handle('create-pdf-arsiv', async (_, data) => handlePdf('arsiv_pdf.py', data))
  ipcMain.handle('create-pdf-envanter', async (_, data) => handlePdf('envanter_pdf.py', data))
  ipcMain.handle('create-google-report', async (_, data) => {
    return new Promise((resolve) => {
      const scriptPath = is.dev
        ? join(__dirname, '../../resources/google_ops.py')
        : join(process.resourcesPath, 'google_ops.py')
      const resourcePath = is.dev ? join(__dirname, '../../resources') : process.resourcesPath
      const desktopPath = app.getPath('desktop')
      const finalData = { ...data, resource_path: resourcePath, desktop_path: desktopPath }
      const pythonProcess = spawn('python', [scriptPath])
      let dataString = ''
      let errorString = ''
      pythonProcess.stdin.write(JSON.stringify(finalData))
      pythonProcess.stdin.end()
      pythonProcess.stdout.on('data', (d) => (dataString += d.toString()))
      pythonProcess.stderr.on('data', (d) => {
        errorString += d.toString()
        console.error('Google Report Python Stderr:', d.toString())
      })
      pythonProcess.on('close', (code) => {
        if (code !== 0 || !dataString.trim()) {
          resolve(JSON.stringify({ success: false, error: errorString || 'Python script hata ile kapandı' }))
          return
        }
        try {
          resolve(dataString)
        } catch (_e) {
          resolve(JSON.stringify({ success: false, error: 'Yanıt işlenemedi' }))
        }
      })
    })
  })
  ipcMain.handle('google-logout', async () => {
    try {
      const ses = session.fromPartition('persist:google')
      await ses.clearStorageData()
      return true
    } catch (_e) {
      return false
    }
  })
  ipcMain.handle('get-setting', async (_, key) => getSetting(key))
  ipcMain.handle('set-setting', async (_, data) => setSetting(data.key, data.value))
  ipcMain.handle('get-all-settings', async () => getAllSettings())
  ipcMain.handle('get-harcamalar-by-month', async (_, v) => getHarcamalarByMonth(v))
  ipcMain.handle('get-devir', async (_, v) => getDevirBakiyesi(v))
  ipcMain.handle('add-harcama', async (_, v) => addHarcama(v))
  ipcMain.handle('update-harcama', async (_, v) => updateHarcama(v))
  ipcMain.handle('delete-harcama', async (_, id) => deleteHarcama(id))
  ipcMain.handle('get-harcama-personelleri', async () => getHarcamaPersonelleri())

  // Harcama Sabit Personel (Ayarlar)
  ipcMain.handle('get-harcama-sabit-personeller', async () => getHarcamaSabitPersoneller())
  ipcMain.handle('add-harcama-sabit-personel', async (_, ad) => addHarcamaSabitPersonel(ad))
  ipcMain.handle('delete-harcama-sabit-personel', async (_, id) => deleteHarcamaSabitPersonel(id))

  // Kurum Tanımları
  ipcMain.handle('get-kurum-tanimlari', async () => getKurumTanimlari())
  ipcMain.handle('add-kurum-tanim', async (_, ad) => addKurumTanim(ad))
  ipcMain.handle('delete-kurum-tanim', async (_, id) => deleteKurumTanim(id))

  // Eski fonksiyonları koruyalım ama artık aktif kullanılmayabilir
  ipcMain.handle('add-harcama-yerel', async (_, ad) => addHarcamaYerelKisi(ad))
  ipcMain.handle('delete-harcama-gorunum', async (_, data) =>
    deleteHarcamaGorunum(data.id, data.kaynak)
  )
  ipcMain.handle('get-personeller', async () => getPersoneller())
  ipcMain.handle('add-personel', async (_, v) => addPersonel(v))
  ipcMain.handle('update-personel', async (_, v) => updatePersonel(v))
  ipcMain.handle('delete-personel', async (_, id) => deletePersonel(id))
  ipcMain.handle('get-rehber', async () => getRehber())
  ipcMain.handle('add-rehber', async (_, v) => addRehber(v))
  ipcMain.handle('update-rehber', async (_, v) => updateRehber(v))
  ipcMain.handle('delete-rehber', async (_, id) => deleteRehber(id))
  ipcMain.handle('get-zimmet', async (_, limit) => getZimmet(limit))
  ipcMain.handle('add-zimmet', async (_, data) => addZimmet(data))
  ipcMain.handle('update-zimmet-durum', async (_, args) => updateZimmetDurum(args.id, args.durum))
  ipcMain.handle('delete-zimmet', async (_, id) => deleteZimmet(id))
  ipcMain.handle('search-zimmet', async (_, query) => searchZimmet(query))
  ipcMain.handle('get-evraklar', async () => getEvraklar())
  ipcMain.handle('add-evrak', async (_, v) => addEvrak(v))
  ipcMain.handle('update-evrak', async (_, v) => updateEvrak(v))
  ipcMain.handle('delete-evrak', async (_, id) => deleteEvrak(id))
  ipcMain.handle('get-egitim-konular', async () => getEgitimKonular())
  ipcMain.handle('add-egitim-konu', async (_, v) => addEgitimKonu(v))
  ipcMain.handle('delete-egitim-konu', async (_, id) => deleteEgitimKonu(id))
  ipcMain.handle('update-egitim-konu', async (_, v) => updateEgitimKonu(v.id, v.baslik, v.sira))
  ipcMain.handle('get-egitim-egiticiler', async () => getEgitimEgiticiler())
  ipcMain.handle('add-egitim-egitici', async (_, v) => addEgitimEgitici(v))
  ipcMain.handle('delete-egitim-egitici', async (_, id) => deleteEgitimEgitici(id))
  ipcMain.handle('update-egitim-egitici', async (_, v) => updateEgitimEgitici(v))
  ipcMain.handle('get-egitim-personeller', async () => getEgitimPersoneller())
  ipcMain.handle('add-egitim-personel', async (_, v) => addEgitimPersonel(v))
  ipcMain.handle('delete-egitim-personel', async (_, id) => deleteEgitimPersonel(id))
  ipcMain.handle('update-egitim-personel', async (_, v) => updateEgitimPersonel(v))
  ipcMain.handle('get-egitim-duzenleyenler', async () => getEgitimDuzenleyenler())
  ipcMain.handle('add-egitim-duzenleyen', async (_, v) => addEgitimDuzenleyen(v))
  ipcMain.handle('update-egitim-duzenleyen', async (_, v) => updateEgitimDuzenleyen(v))
  ipcMain.handle('delete-egitim-duzenleyen', async (_, id) => deleteEgitimDuzenleyen(id))
  ipcMain.handle('get-egitim-planlar', async () => getEgitimPlanlar())
  ipcMain.handle('save-egitim-plan', async (_, v) => saveEgitimPlan(v))
  ipcMain.handle('delete-egitim-plan', async (_, id) => deleteEgitimPlan(id))
  ipcMain.handle('get-egitim-plan-detay', async (_, id) => getEgitimPlanDetay(id))

  // ENVANTER
  ipcMain.handle('get-envanter-malzemeler', async (_, c) => getEnvanterMalzemeler(c))
  ipcMain.handle('add-envanter-malzeme', async (_, d) => addEnvanterMalzeme(d))
  ipcMain.handle('update-envanter-malzeme', async (_, d) => updateEnvanterMalzeme(d))
  ipcMain.handle('delete-envanter-malzeme', async (_, id) => deleteEnvanterMalzeme(id))
  ipcMain.handle('get-envanter-summary', async (_, f) => getEnvanterSummary(f))
  
  // Envanter Tanımlar
  ipcMain.handle('get-envanter-kategoriler', async () => getEnvanterKategoriler())
  ipcMain.handle('add-envanter-kategori', async (_, v) => addEnvanterKategori(v))
  ipcMain.handle('delete-envanter-kategori', async (_, id) => deleteEnvanterKategori(id))
  ipcMain.handle('update-envanter-kategori', async (_, v) => updateEnvanterKategori(v.id, v.ad))
  
  ipcMain.handle('get-envanter-yerler', async () => getEnvanterYerler())
  ipcMain.handle('add-envanter-yer', async (_, v) => addEnvanterYer(v))
  ipcMain.handle('delete-envanter-yer', async (_, id) => deleteEnvanterYer(id))
  ipcMain.handle('update-envanter-yer', async (_, v) => updateEnvanterYer(v.id, v.yer_adi))
  
  ipcMain.handle('get-envanter-malzeme-tanimlari', async () => getEnvanterMalzemeTanimlari())
  ipcMain.handle('add-envanter-malzeme-tanim', async (_, v) => addEnvanterMalzemeTanim(v))
  ipcMain.handle('delete-envanter-malzeme-tanim', async (_, id) => deleteEnvanterMalzemeTanim(id))
  ipcMain.handle('update-envanter-malzeme-tanim', async (_, v) => updateEnvanterMalzemeTanim(v))
  
  ipcMain.handle('get-envanter-marka-tanimlari', async () => getEnvanterMarkaTanimlari())
  ipcMain.handle('add-envanter-marka-tanim', async (_, v) => addEnvanterMarkaTanim(v))
  ipcMain.handle('delete-envanter-marka-tanim', async (_, id) => deleteEnvanterMarkaTanim(id))
  ipcMain.handle('update-envanter-marka-tanim', async (_, v) => updateEnvanterMarkaTanim(v))
  
  ipcMain.handle('get-envanter-personel-tanimlari', async () => getEnvanterPersonelTanimlari())
  ipcMain.handle('add-envanter-personel-tanim', async (_, v) => addEnvanterPersonelTanim(v))
  ipcMain.handle('delete-envanter-personel-tanim', async (_, id) => deleteEnvanterPersonelTanim(id))
  ipcMain.handle('update-envanter-personel-tanim', async (_, v) => updateEnvanterPersonelTanim(v.id, v.ad))
  
  ipcMain.handle('select-file', async (_, filters) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: filters || []
    })
    return canceled ? null : filePaths[0]
  })
  ipcMain.handle('open-file', async (_, path) => shell.openPath(path))

  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
