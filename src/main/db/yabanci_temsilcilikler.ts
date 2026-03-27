import { db } from '../firebaseConfig'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore'

// Yardımcı fonksiyon
const formatDoc = (docSnap: any): any => ({ id: docSnap.id, ...docSnap.data() })

// Örnek veriler (Eğer koleksiyon boşsa eklenecek)
const INITIAL_TEMSILCILIKLER = [
  {
    ulke: 'Amerika Birleşik Devletleri',
    tip: 'Büyükelçilik',
    sehir: 'Ankara',
    adres: 'Atatürk Bulvarı No:110 Kavaklıdere / Ankara',
    telefon: '0312 455 55 55',
    eposta: 'ankara@usembassy.gov',
    web_sitesi: 'https://tr.usembassy.gov',
    sira: 1
  },
  {
    ulke: 'Almanya',
    tip: 'Büyükelçilik',
    sehir: 'Ankara',
    adres: 'Atatürk Bulvarı No:114 Kavaklıdere / Ankara',
    telefon: '0312 455 51 00',
    eposta: 'info@ankara.diplo.de',
    web_sitesi: 'https://tuerkei.diplo.de',
    sira: 2
  },
  {
    ulke: 'Fransa',
    tip: 'Büyükelçilik',
    sehir: 'Ankara',
    adres: 'Paris Caddesi No: 70 Kavaklıdere / Ankara',
    telefon: '0312 455 45 45',
    eposta: 'amba.ankara@diplomatie.gouv.fr',
    web_sitesi: 'https://tr.ambafrance.org',
    sira: 3
  }
]

export async function initYabanciTemsilciliklerDB(): Promise<void> {
  console.log('Firebase Firestore: Yabancı Temsilcilikler başlatılıyor...')
  try {
    const snap = await getDocs(
      query(collection(db, 'yabanci_temsilcilikler'), orderBy('sira', 'asc'))
    )
    if (snap.empty) {
      console.log('Yabancı temsilcilik verisi bulunamadı, örnek veriler yükleniyor...')
      const batch = writeBatch(db)
      INITIAL_TEMSILCILIKLER.forEach((item) => {
        const ref = doc(collection(db, 'yabanci_temsilcilikler'))
        batch.set(ref, item)
      })
      await batch.commit()
      console.log('Örnek yabancı temsilcilik verileri yüklendi.')
    }
  } catch (error) {
    console.error('Yabancı temsilcilik veritabanı başlatılırken hata:', error)
  }
}

export async function getTemsilcilikler(): Promise<any[]> {
  const snap = await getDocs(
    query(collection(db, 'yabanci_temsilcilikler'), orderBy('sira', 'asc'))
  )
  return snap.docs.map(formatDoc)
}

export async function addTemsilcilik(data: any): Promise<any> {
  const snap = await getDocs(
    query(collection(db, 'yabanci_temsilcilikler'), orderBy('sira', 'desc'))
  )
  let maxSira = 0
  if (!snap.empty) {
    maxSira = snap.docs[0].data().sira || 0
  }

  const newItem = {
    ulke: data.ulke || '',
    tip: data.tip || '',
    sehir: data.sehir || '',
    adres: data.adres || '',
    telefon: data.telefon || '',
    eposta: data.eposta || '',
    web_sitesi: data.web_sitesi || '',
    bayrak_kodu: data.bayrak_kodu || '',
    sira: maxSira + 1
  }

  const res = await addDoc(collection(db, 'yabanci_temsilcilikler'), newItem)
  return { id: res.id, ...newItem }
}

export async function updateTemsilcilik(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'yabanci_temsilcilikler', id), updateData)
  return true
}

export async function deleteTemsilcilik(id: string): Promise<boolean> {
  // id string oldu (Firestore)
  await deleteDoc(doc(db, 'yabanci_temsilcilikler', id))
  return true
}

// Toplu sıra güncellemesi
export async function reorderTemsilcilikler(
  data: { id: string; sira: number }[]
): Promise<boolean> {
  const batch = writeBatch(db)
  for (const item of data) {
    if (item.id) {
      const ref = doc(db, 'yabanci_temsilcilikler', item.id)
      batch.update(ref, { sira: item.sira })
    }
  }
  await batch.commit()
  return true
}
