/* eslint-disable @typescript-eslint/no-explicit-any */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  // TAKVİM
  getTakvim: () => ipcRenderer.invoke('get-takvim'),
  addTakvim: (data: any) => ipcRenderer.invoke('add-takvim', data),
  updateTakvim: (data: any) => ipcRenderer.invoke('update-takvim', data),
  deleteTakvim: (id: number) => ipcRenderer.invoke('delete-takvim', id),

  // ARŞİV
  getArsiv: (filtreler: any) => ipcRenderer.invoke('get-arsiv', filtreler),
  getNextArsivNo: (yili: string) => ipcRenderer.invoke('get-next-arsiv-no', yili),
  getHarcamalarByMonth: (tarih: string) => ipcRenderer.invoke('get-harcamalar-by-month', tarih),
  addHarcama: (data: any) => ipcRenderer.invoke('add-harcama', data),
  updateHarcama: (data: any) => ipcRenderer.invoke('update-harcama', data),
  deleteHarcama: (id: number) => ipcRenderer.invoke('delete-harcama', id),
  getDevirBakiyesi: (yil: number) => ipcRenderer.invoke('get-devir', yil),
  getHarcamaPersonelleri: () => ipcRenderer.invoke('get-harcama-personelleri'),
  addArsiv: (data: any) => ipcRenderer.invoke('add-arsiv', data),
  addArsivToplu: (data: any) => ipcRenderer.invoke('add-arsiv-toplu', data),
  addArsivBatch: (data: any) => ipcRenderer.invoke('add-arsiv-batch', data),
  updateArsivToplu: (data: any) => ipcRenderer.invoke('update-arsiv-toplu', data),
  deleteArsivToplu: (ids: number[]) => ipcRenderer.invoke('delete-arsiv-toplu', ids),
  updateArsiv: (data: any) => ipcRenderer.invoke('update-arsiv', data),
  deleteArsiv: (id: number) => ipcRenderer.invoke('delete-arsiv', id),
  getArsivTanimlar: () => ipcRenderer.invoke('get-arsiv-tanimlar'),
  addArsivTanim: (ad: string) => ipcRenderer.invoke('add-arsiv-tanim', ad),
  deleteArsivTanim: (id: number) => ipcRenderer.invoke('delete-arsiv-tanim', id),
  updateArsivTanim: (data: any) => ipcRenderer.invoke('update-arsiv-tanim', data), // YENİ

  // Arşiv Düşünceler
  getArsivDusunceTanimlari: () => ipcRenderer.invoke('get-arsiv-dusunce-tanimlari'),
  addArsivDusunceTanim: (aciklama: string) =>
    ipcRenderer.invoke('add-arsiv-dusunce-tanim', aciklama),
  deleteArsivDusunceTanim: (id: string) => ipcRenderer.invoke('delete-arsiv-dusunce-tanim', id),

  // Sync
  syncArsivDefinitions: () => ipcRenderer.invoke('sync-arsiv-definitions'),
  // Arşiv İmha Komisyonu
  getArsivImhaKomisyonu: () => ipcRenderer.invoke('get-arsiv-imha-komisyonu'),
  addArsivImhaKomisyonu: (data: any) => ipcRenderer.invoke('add-arsiv-imha-komisyonu', data),
  updateArsivImhaKomisyonu: (data: any) => ipcRenderer.invoke('update-arsiv-imha-komisyonu', data),
  deleteArsivImhaKomisyonu: (id: number) => ipcRenderer.invoke('delete-arsiv-imha-komisyonu', id),

  // E-Apostil
  getEApostil: () => ipcRenderer.invoke('get-eapostil'),
  addEApostil: (data: any) => ipcRenderer.invoke('add-eapostil', data),
  updateEApostil: (data: any) => ipcRenderer.invoke('update-eapostil', data),
  deleteEApostil: (id: number) => ipcRenderer.invoke('delete-eapostil', id),
  fetchHcchData: () => ipcRenderer.invoke('fetch-hcch-data'),
  // YENİ EKLENENLER
  getEApostilFiles: (id: number) => ipcRenderer.invoke('get-eapostil-files', id),
  addEApostilFile: (data: any) => ipcRenderer.invoke('add-eapostil-file', data),
  deleteEApostilFile: (id: number) => ipcRenderer.invoke('delete-eapostil-file', id),

  // TEBDİL (EHLİYET)
  getTebdil: () => ipcRenderer.invoke('get-tebdil'),
  addTebdil: (data: any) => ipcRenderer.invoke('add-tebdil', data),
  updateTebdil: (data: any) => ipcRenderer.invoke('update-tebdil', data),
  deleteTebdil: (id: number) => ipcRenderer.invoke('delete-tebdil', id),
  getTebdilFiles: (id: number) => ipcRenderer.invoke('get-tebdil-files', id),
  addTebdilFile: (data: any) => ipcRenderer.invoke('add-tebdil-file', data),
  deleteTebdilFile: (id: number) => ipcRenderer.invoke('delete-tebdil-file', id),
  fetchTebdilData: () => ipcRenderer.invoke('fetch-tebdil-data'),

  // Diğer
  selectFile: () => ipcRenderer.invoke('select-file'),
  openFile: (path: string) => ipcRenderer.invoke('open-file', path),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),

  // ZIMMET
  getZimmet: (limit: number) => ipcRenderer.invoke('get-zimmet', limit),
  addZimmet: (data: any) => ipcRenderer.invoke('add-zimmet', data),
  updateZimmetDurum: (id: number, durum: string) =>
    ipcRenderer.invoke('update-zimmet-durum', { id, durum }),
  deleteZimmet: (id: number) => ipcRenderer.invoke('delete-zimmet', id),
  searchZimmet: (query: string) => ipcRenderer.invoke('search-zimmet', query),

  // RESMI YAZI
  getEvraklar: () => ipcRenderer.invoke('get-evraklar'),
  addEvrak: (data: any) => ipcRenderer.invoke('add-evrak', data),
  updateEvrak: (data: any) => ipcRenderer.invoke('update-evrak', data),
  deleteEvrak: (id: number) => ipcRenderer.invoke('delete-evrak', id),

  // REHBER
  getRehber: () => ipcRenderer.invoke('get-rehber'),
  addRehber: (data: any) => ipcRenderer.invoke('add-rehber', data),
  updateRehber: (data: any) => ipcRenderer.invoke('update-rehber', data),
  deleteRehber: (id: number) => ipcRenderer.invoke('delete-rehber', id),

  // Ayarlar ve Diğerleri (Mevcut kodlarınızı koruyun)
  getSetting: (key: string) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key: string, value: string) => ipcRenderer.invoke('set-setting', { key, value }),
  createPdfArsiv: (data: any) => ipcRenderer.invoke('create-pdf-arsiv', data),
  // Harcama Sabit Personel (Ayarlar)
  getHarcamaSabitPersoneller: () => ipcRenderer.invoke('get-harcama-sabit-personeller'),
  addHarcamaSabitPersonel: (ad: string) => ipcRenderer.invoke('add-harcama-sabit-personel', ad),

  deleteHarcamaSabitPersonel: (id: number) =>
    ipcRenderer.invoke('delete-harcama-sabit-personel', id),

  // Kurum Tanımları
  getKurumTanimlari: () => ipcRenderer.invoke('get-kurum-tanimlari'),
  addKurumTanim: (ad: string) => ipcRenderer.invoke('add-kurum-tanim', ad),
  deleteKurumTanim: (id: number) => ipcRenderer.invoke('delete-kurum-tanim', id),

  // EĞİTİM AYARLARI
  getEgitimKonular: () => ipcRenderer.invoke('get-egitim-konular'),
  addEgitimKonu: (baslik: string) => ipcRenderer.invoke('add-egitim-konu', baslik),
  deleteEgitimKonu: (id: number) => ipcRenderer.invoke('delete-egitim-konu', id),
  updateEgitimKonu: (data: any) => ipcRenderer.invoke('update-egitim-konu', data),

  getEgitimEgiticiler: () => ipcRenderer.invoke('get-egitim-egiticiler'),
  addEgitimEgitici: (data: any) => ipcRenderer.invoke('add-egitim-egitici', data),
  deleteEgitimEgitici: (id: number) => ipcRenderer.invoke('delete-egitim-egitici', id),
  updateEgitimEgitici: (data: any) => ipcRenderer.invoke('update-egitim-egitici', data),

  getEgitimPersoneller: () => ipcRenderer.invoke('get-egitim-personeller'),
  addEgitimPersonel: (data: any) => ipcRenderer.invoke('add-egitim-personel', data),
  deleteEgitimPersonel: (id: number) => ipcRenderer.invoke('delete-egitim-personel', id),
  updateEgitimPersonel: (data: any) => ipcRenderer.invoke('update-egitim-personel', data),

  getEgitimDuzenleyenler: () => ipcRenderer.invoke('get-egitim-duzenleyenler'),
  addEgitimDuzenleyen: (data: any) => ipcRenderer.invoke('add-egitim-duzenleyen', data),
  updateEgitimDuzenleyen: (data: any) => ipcRenderer.invoke('update-egitim-duzenleyen', data),
  deleteEgitimDuzenleyen: (id: number) => ipcRenderer.invoke('delete-egitim-duzenleyen', id),

  getEgitimPlanlar: () => ipcRenderer.invoke('get-egitim-planlar'),
  saveEgitimPlan: (data: any) => ipcRenderer.invoke('save-egitim-plan', data),
  deleteEgitimPlan: (id: string | number) => ipcRenderer.invoke('delete-egitim-plan', id),
  getEgitimPlanDetay: (id: string | number) => ipcRenderer.invoke('get-egitim-plan-detay', id),

  getPersoneller: () => ipcRenderer.invoke('get-personeller'),
  addPersonel: (data: any) => ipcRenderer.invoke('add-personel', data),
  updatePersonel: (data: any) => ipcRenderer.invoke('update-personel', data),
  deletePersonel: (id: number) => ipcRenderer.invoke('delete-personel', id),
  createPdfTerfi: (data: any) => ipcRenderer.invoke('create-pdf-terfi', data),

  createPdfHarcama: (data: any) => ipcRenderer.invoke('create-pdf-harcama', data),
  saveZimmetPdf: (buffer: ArrayBuffer) => ipcRenderer.invoke('save-zimmet-pdf', buffer),
  createPdfPython: (data: any) => ipcRenderer.invoke('create-pdf-python', data),
  createPdfResmiYazi: (data: any) => ipcRenderer.invoke('create-pdf-resmi-yazi', data),
  createPdfEgitim: (data: any) => ipcRenderer.invoke('create-pdf-egitim', data),
  savePdf: (buffer: ArrayBuffer, prefix?: string) =>
    ipcRenderer.invoke('save-pdf', { buffer, prefix }),
  createEkExcel: (data: any) => ipcRenderer.invoke('create-ek-excel', data),

  // ENVANTER
  getEnvanterMalzemeler: (criteria: any) => ipcRenderer.invoke('get-envanter-malzemeler', criteria),
  addEnvanterMalzeme: (data: any) => ipcRenderer.invoke('add-envanter-malzeme', data),
  updateEnvanterMalzeme: (data: any) => ipcRenderer.invoke('update-envanter-malzeme', data),
  deleteEnvanterMalzeme: (id: string) => ipcRenderer.invoke('delete-envanter-malzeme', id),
  getEnvanterSummary: (field: string) => ipcRenderer.invoke('get-envanter-summary', field),

  // Envanter Tanımlar
  getEnvanterKategoriler: () => ipcRenderer.invoke('get-envanter-kategoriler'),
  addEnvanterKategori: (ad: string) => ipcRenderer.invoke('add-envanter-kategori', ad),
  deleteEnvanterKategori: (id: string) => ipcRenderer.invoke('delete-envanter-kategori', id),
  updateEnvanterKategori: (data: any) => ipcRenderer.invoke('update-envanter-kategori', data),

  getEnvanterYerler: () => ipcRenderer.invoke('get-envanter-yerler'),
  addEnvanterYer: (yer_adi: string) => ipcRenderer.invoke('add-envanter-yer', yer_adi),
  deleteEnvanterYer: (id: string) => ipcRenderer.invoke('delete-envanter-yer', id),
  updateEnvanterYer: (data: any) => ipcRenderer.invoke('update-envanter-yer', data),

  getEnvanterMalzemeTanimlari: () => ipcRenderer.invoke('get-envanter-malzeme-tanimlari'),
  addEnvanterMalzemeTanim: (data: any) => ipcRenderer.invoke('add-envanter-malzeme-tanim', data),
  deleteEnvanterMalzemeTanim: (id: string) =>
    ipcRenderer.invoke('delete-envanter-malzeme-tanim', id),
  updateEnvanterMalzemeTanim: (data: any) =>
    ipcRenderer.invoke('update-envanter-malzeme-tanim', data),

  getEnvanterMarkaTanimlari: () => ipcRenderer.invoke('get-envanter-marka-tanimlari'),
  addEnvanterMarkaTanim: (data: any) => ipcRenderer.invoke('add-envanter-marka-tanim', data),
  deleteEnvanterMarkaTanim: (id: string) => ipcRenderer.invoke('delete-envanter-marka-tanim', id),
  updateEnvanterMarkaTanim: (data: any) => ipcRenderer.invoke('update-envanter-marka-tanim', data),

  getEnvanterPersonelTanimlari: () => ipcRenderer.invoke('get-envanter-personel-tanimlari'),
  addEnvanterPersonelTanim: (ad: string) => ipcRenderer.invoke('add-envanter-personel-tanim', ad),
  deleteEnvanterPersonelTanim: (id: string) =>
    ipcRenderer.invoke('delete-envanter-personel-tanim', id),
  updateEnvanterPersonelTanim: (data: any) =>
    ipcRenderer.invoke('update-envanter-personel-tanim', data),

  createPdfEnvanter: (data: any) => ipcRenderer.invoke('create-pdf-envanter', data),

  // Envanter Import
  getDbTables: (dbPath: string) => ipcRenderer.invoke('get-db-tables', dbPath),
  readDbTable: (dbPath: string, tableName: string) =>
    ipcRenderer.invoke('read-db-table', { dbPath, tableName }),
  addEnvanterBatch: (materials: any[]) => ipcRenderer.invoke('add-envanter-batch', materials),

  // GÖNDERİLEN BELGELER
  getGonderilenBelgeler: () => ipcRenderer.invoke('get-gonderilen-belgeler'),
  addGonderilenBelge: (data: any) => ipcRenderer.invoke('add-gonderilen-belge', data),
  updateGonderilenBelge: (data: any) => ipcRenderer.invoke('update-gonderilen-belge', data),
  deleteGonderilenBelge: (id: string) => ipcRenderer.invoke('delete-gonderilen-belge', id),

  // PERSONEL GÖREVLENDİRMELERİ
  getGorevlendirmeler: () => ipcRenderer.invoke('get-gorevlendirmeler'),
  addGorevlendirme: (data: any) => ipcRenderer.invoke('add-gorevlendirme', data),
  updateGorevlendirme: (data: any) => ipcRenderer.invoke('update-gorevlendirme', data),
  deleteGorevlendirme: (id: string) => ipcRenderer.invoke('delete-gorevlendirme', id),

  // NOTLAR
  getNotlar: () => ipcRenderer.invoke('get-notlar'),
  addNot: (data: any) => ipcRenderer.invoke('add-not', data),
  updateNot: (data: any) => ipcRenderer.invoke('update-not', data),
  deleteNot: (id: string) => ipcRenderer.invoke('delete-not', id),

  // BELGELER ARŞİVİ
  getBelgeler: () => ipcRenderer.invoke('get-belgeler'),
  addBelge: (data: any) => ipcRenderer.invoke('add-belge', data),
  updateBelge: (data: any) => ipcRenderer.invoke('update-belge', data),
  deleteBelge: (id: string) => ipcRenderer.invoke('delete-belge', id),
  getBelgelerKategoriler: () => ipcRenderer.invoke('get-belgeler-kategoriler'),
  addBelgeKategori: (ad: string) => ipcRenderer.invoke('add-belge-kategori', ad),
  updateBelgeKategori: (data: any) => ipcRenderer.invoke('update-belge-kategori', data),
  deleteBelgeKategori: (id: string) => ipcRenderer.invoke('delete-belge-kategori', id),
  selectPdfFile: () => ipcRenderer.invoke('select-pdf-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolderPdfs: (folderPath: string) => ipcRenderer.invoke('scan-folder-pdfs', folderPath),


  // YABANCI TEMSİLCİLİKLER
  getTemsilcilikler: () => ipcRenderer.invoke('get-temsilcilikler'),
  addTemsilcilik: (data: any) => ipcRenderer.invoke('add-temsilcilik', data),
  updateTemsilcilik: (data: any) => ipcRenderer.invoke('update-temsilcilik', data),
  deleteTemsilcilik: (id: string) => ipcRenderer.invoke('delete-temsilcilik', id),
  reorderTemsilcilikler: (data: any) => ipcRenderer.invoke('reorder-temsilcilikler', data),

  // TÜRK YURTDIŞI TEMSİLCİLİKLERİ
  getTurkTemsilcilikler: () => ipcRenderer.invoke('get-turk-temsilcilikler'),
  addTurkTemsilcilik: (data: any) => ipcRenderer.invoke('add-turk-temsilcilik', data),
  updateTurkTemsilcilik: (data: any) => ipcRenderer.invoke('update-turk-temsilcilik', data),
  deleteTurkTemsilcilik: (id: string) => ipcRenderer.invoke('delete-turk-temsilcilik', id),
  reorderTurkTemsilcilikler: (data: any) => ipcRenderer.invoke('reorder-turk-temsilcilikler', data),

  // KURUM HARCAMA
  getKurumHarcamalar: (params?: any) => ipcRenderer.invoke('get-kurum-harcamalar', params),
  addKurumHarcama: (data: any) => ipcRenderer.invoke('add-kurum-harcama', data),
  updateKurumHarcama: (data: any) => ipcRenderer.invoke('update-kurum-harcama', data),
  deleteKurumHarcama: (id: string) => ipcRenderer.invoke('delete-kurum-harcama', id),
  getKurumHarcamaKategoriler: () => ipcRenderer.invoke('get-kurum-harcama-kategoriler'),
  addKurumHarcamaKategori: (data: any) => ipcRenderer.invoke('add-kurum-harcama-kategori', data),
  deleteKurumHarcamaKategori: (id: string) => ipcRenderer.invoke('delete-kurum-harcama-kategori', id),

  // BELGE DOĞRULAMA SİTELERİ
  getBelgeDogrulamaSiteleri: () => ipcRenderer.invoke('get-belge-dogrulama-siteleri'),
  addBelgeDogrulamaSitesi: (data: any) => ipcRenderer.invoke('add-belge-dogrulama-sitesi', data),
  updateBelgeDogrulamaSitesi: (data: any) => ipcRenderer.invoke('update-belge-dogrulama-sitesi', data),
  deleteBelgeDogrulamaSitesi: (id: string) => ipcRenderer.invoke('delete-belge-dogrulama-sitesi', id),
  openUrl: (url: string) => ipcRenderer.invoke('open-url', url),

  // Pencere Kontrolleri
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (electron-toolkit type mismatch)
  window.electron = electronAPI
  // @ts-ignore (custom api type mismatch)
  window.api = api
}
