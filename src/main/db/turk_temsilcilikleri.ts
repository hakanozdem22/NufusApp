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

const formatDoc = (docSnap: any): any => ({ id: docSnap.id, ...docSnap.data() })

const INITIAL_TURK_TEMSILCILIKLERI = [
  {
    ulke: 'Amerika Birleşik Devletleri',
    tip: 'Büyükelçilik',
    sehir: 'Washington',
    adres: '2525 Massachusetts Avenue, N.W. Washington, D.C. 20008',
    telefon: '+1 202 612 67 00',
    eposta: 'embassy.washington@mfa.gov.tr',
    web_sitesi: 'http://washington.emb.mfa.gov.tr',
    sira: 1,
    bayrak_kodu: 'US'
  },
  {
    ulke: 'Almanya',
    tip: 'Büyükelçilik',
    sehir: 'Berlin',
    adres: 'Tiergartenstr. 19-21 10785 Berlin',
    telefon: '+49 30 275850',
    eposta: 'botschaft.berlin@mfa.gov.tr',
    web_sitesi: 'http://berlin.emb.mfa.gov.tr',
    sira: 2,
    bayrak_kodu: 'DE'
  },
  {
    ulke: 'Fransa',
    tip: 'Büyükelçilik',
    sehir: 'Paris',
    adres: '16 Avenue de Lamballe 75016 Paris',
    telefon: '+33 1 53 92 71 11',
    eposta: 'ambassade.paris@mfa.gov.tr',
    web_sitesi: 'http://paris.emb.mfa.gov.tr',
    sira: 3,
    bayrak_kodu: 'FR'
  },
  {
    ulke: 'İngiltere',
    tip: 'Büyükelçilik',
    sehir: 'Londra',
    adres: '43 Belgrave Square, London SW1X 8PA',
    telefon: '+44 20 7393 0202',
    eposta: 'embassy.london@mfa.gov.tr',
    web_sitesi: 'http://london.emb.mfa.gov.tr',
    sira: 4,
    bayrak_kodu: 'GB'
  }
]

export async function initTurkTemsilcilikleriDB(): Promise<void> {
  console.log('Firebase Firestore: Türk Temsilcilikleri başlatılıyor...')
  try {
    const snap = await getDocs(
      query(collection(db, 'turk_temsilcilikleri'), orderBy('sira', 'asc'))
    )
    if (snap.empty) {
      console.log('Türk temsilcilik verisi bulunamadı, örnek veriler yükleniyor...')
      const batch = writeBatch(db)
      INITIAL_TURK_TEMSILCILIKLERI.forEach((item) => {
        const ref = doc(collection(db, 'turk_temsilcilikleri'))
        batch.set(ref, item)
      })
      await batch.commit()
      console.log('Örnek Türk temsilcilik verileri yüklendi.')
    }
  } catch (error) {
    console.error('Türk temsilcilik veritabanı başlatılırken hata:', error)
  }
}

export async function getTurkTemsilcilikler(): Promise<any[]> {
  const snap = await getDocs(query(collection(db, 'turk_temsilcilikleri'), orderBy('sira', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addTurkTemsilcilik(data: any): Promise<any> {
  const snap = await getDocs(query(collection(db, 'turk_temsilcilikleri'), orderBy('sira', 'desc')))
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

  const res = await addDoc(collection(db, 'turk_temsilcilikleri'), newItem)
  return { id: res.id, ...newItem }
}

export async function updateTurkTemsilcilik(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'turk_temsilcilikleri', id), updateData)
  return true
}

export async function deleteTurkTemsilcilik(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'turk_temsilcilikleri', id))
  return true
}

export async function reorderTurkTemsilcilikler(
  data: { id: string; sira: number }[]
): Promise<boolean> {
  const batch = writeBatch(db)
  for (const item of data) {
    if (item.id) {
      const ref = doc(db, 'turk_temsilcilikleri', item.id)
      batch.update(ref, { sira: item.sira })
    }
  }
  await batch.commit()
  return true
}
