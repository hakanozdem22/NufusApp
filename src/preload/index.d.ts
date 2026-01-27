import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // Takvim
      getTakvim: () => Promise<any[]>
      addTakvim: (data: any) => Promise<boolean>
      updateTakvim: (data: any) => Promise<boolean> // <-- BU SATIR EKLENDİ
      deleteTakvim: (id: number) => Promise<boolean>

      // Arşiv
      getArsiv: (filtreler?: any) => Promise<any[]>
      getNextArsivNo: (yili: string) => Promise<number>
      addArsiv: (data: any) => Promise<any>
      addArsivToplu: (data: any) => Promise<any>
      updateArsivToplu: (data: any) => Promise<any>
      deleteArsivToplu: (ids: number[]) => Promise<any>
      updateArsiv: (data: any) => Promise<any>
      deleteArsiv: (id: number) => Promise<any>
      getArsivTanimlar: () => Promise<any[]>
      addArsivTanim: (ad: string) => Promise<any>
      deleteArsivTanim: (id: number) => Promise<any>

      // HARCAMA AYARLARI
      getHarcamaSabitPersoneller: () => Promise<any[]>
      addHarcamaSabitPersonel: (ad: string) => Promise<void>
      deleteHarcamaSabitPersonel: (id: number) => Promise<void>

      // E-Apostil & Genel
      getEApostil: () => Promise<any[]>
      addEApostil: (data: any) => Promise<any>
      updateEApostil: (data: any) => Promise<any>
      deleteEApostil: (id: number) => Promise<any>
      fetchHcchData: () => Promise<string | null>

      selectFile: () => Promise<string | null>
      openFile: (path: string) => Promise<void>
      openExternal: (url: string) => Promise<void>

      getSetting: (key: string) => Promise<string>
      setSetting: (key: string, value: string) => Promise<void>

      // Diğer fonksiyon tanımlarınız...
      // EĞİTİM MODÜLÜ
      getEgitimKonular: () => Promise<any[]>
      addEgitimKonu: (baslik: string) => Promise<void>
      deleteEgitimKonu: (id: number) => Promise<void>
      updateEgitimKonu: (data: any) => Promise<void>
      getEgitimEgiticiler: () => Promise<any[]>
      addEgitimEgitici: (data: any) => Promise<void>
      deleteEgitimEgitici: (id: number) => Promise<void>
      updateEgitimEgitici: (data: any) => Promise<void>
      getEgitimPersoneller: () => Promise<any[]>
      addEgitimPersonel: (data: any) => Promise<void>
      deleteEgitimPersonel: (id: number) => Promise<void>
      updateEgitimPersonel: (data: any) => Promise<void>
      getEgitimPlanlar: () => Promise<any[]>
      saveEgitimPlan: (data: any) => Promise<void>
      deleteEgitimPlan: (id: number) => Promise<void>
      getEgitimPlanDetay: (id: number) => Promise<any>

      createPdfTerfi: (data: any) => Promise<any>
      [key: string]: any // Bilinmeyen diğer fonksiyonlar için esneklik
    }
  }
}
