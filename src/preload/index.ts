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
  updateArsivToplu: (data: any) => ipcRenderer.invoke('update-arsiv-toplu', data),
  deleteArsivToplu: (ids: number[]) => ipcRenderer.invoke('delete-arsiv-toplu', ids),
  updateArsiv: (data: any) => ipcRenderer.invoke('update-arsiv', data),
  deleteArsiv: (id: number) => ipcRenderer.invoke('delete-arsiv', id),
  getArsivTanimlar: () => ipcRenderer.invoke('get-arsiv-tanimlar'),
  addArsivTanim: (ad: string) => ipcRenderer.invoke('add-arsiv-tanim', ad),
  deleteArsivTanim: (id: number) => ipcRenderer.invoke('delete-arsiv-tanim', id),

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

  getEgitimPlanlar: () => ipcRenderer.invoke('get-egitim-planlar'),
  saveEgitimPlan: (data: any) => ipcRenderer.invoke('save-egitim-plan', data),
  deleteEgitimPlan: (id: number) => ipcRenderer.invoke('delete-egitim-plan', id),
  getEgitimPlanDetay: (id: number) => ipcRenderer.invoke('get-egitim-plan-detay', id),

  getPersoneller: () => ipcRenderer.invoke('get-personeller'),
  addPersonel: (data: any) => ipcRenderer.invoke('add-personel', data),
  updatePersonel: (data: any) => ipcRenderer.invoke('update-personel', data),
  deletePersonel: (id: number) => ipcRenderer.invoke('delete-personel', id),
  createPdfTerfi: (data: any) => ipcRenderer.invoke('create-pdf-terfi', data),

  createPdfHarcama: (data: any) => ipcRenderer.invoke('create-pdf-harcama', data),
  createPdfPython: (data: any) => ipcRenderer.invoke('create-pdf-python', data),
  createPdfResmiYazi: (data: any) => ipcRenderer.invoke('create-pdf-resmi-yazi', data),
  createPdfEgitim: (data: any) => ipcRenderer.invoke('create-pdf-egitim', data),
  createGoogleReport: (data: any) => ipcRenderer.invoke('create-google-report', data)
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
