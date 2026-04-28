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

export async function initTurkTemsilcilikleriDB(): Promise<void> {
  // Varsayılan veri yükleme kaldırıldı — koleksiyon yalnızca kullanıcı eklemeleriyle dolar.
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
