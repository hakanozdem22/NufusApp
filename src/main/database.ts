import { db } from './firebaseConfig'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  getDoc,
  writeBatch
} from 'firebase/firestore'

// --- YARDIMCI FONSİYONLAR ---

// Firestore verisini düzgün formatlamak için (id'yi objeye ekle)
const formatDoc = (doc: any) => ({ id: doc.id, ...doc.data() })

export function initDatabase(userDataPath: string) {
  console.log('Firebase Firestore Kullanılıyor. Yerel veritabanı dosyası gerekmez:', userDataPath)
}

// --- HARCAMALAR ---

export async function getHarcamalarByMonth(params: any) {
  const colRef = collection(db, 'harcamalar')
  let q

  if (typeof params === 'object' && params.baslangic && params.bitis) {
    q = query(
      colRef,
      where('tarih', '>=', params.baslangic),
      where('tarih', '<=', params.bitis),
      orderBy('tarih', 'desc')
    )
  } else {
    // String gelirse (ör: "2024-01") startAt/endAt yerine string araması Firestore'da tam desteklenmez
    // Bu yüzden basitçe o ayı kapsayan bir aralık oluşturuyoruz
    const startStr = params + '-01'
    const endStr = params + '-31' // Basit yaklaşım
    q = query(
      colRef,
      where('tarih', '>=', startStr),
      where('tarih', '<=', endStr),
      orderBy('tarih', 'desc')
    )
  }

  const snapshot = await getDocs(q)
  // Client tarafında sıralama garanti olsun diye tekrar sort edilebilir ama orderBy halleder
  return snapshot.docs.map(formatDoc)
}

export async function getDevirBakiyesi(tarihBaslangic: string) {
  // Firestore'da SUM işlemi için aggregation query gerekir veya tümünü çekip toplanır.
  // Basitlik ve hız için şimdilik önceki tüm kayıtları çekip topluyoruz.
  // Performans sorunu olursa "Devir" diye ayrı bir koleksiyon tutulmalı.
  const colRef = collection(db, 'harcamalar')
  const q = query(colRef, where('tarih', '<', tarihBaslangic))
  const snapshot = await getDocs(q)

  let gelir = 0
  let gider = 0

  snapshot.forEach((doc) => {
    const data = doc.data()
    if (data.tur === 'GELIR') gelir += Number(data.tutar)
    if (data.tur === 'GIDER') gider += Number(data.tutar)
  })

  return gelir - gider
}

export async function addHarcama(data: any) {
  const colRef = collection(db, 'harcamalar')
  const res = await addDoc(colRef, {
    baslik: data.baslik,
    tutar: Number(data.tutar),
    tarih: data.tarih,
    kategori: data.kategori,
    tur: data.tur
  })
  return { id: res.id, ...data }
}

export async function updateHarcama(data: any) {
  const docRef = doc(db, 'harcamalar', data.id)
  await updateDoc(docRef, {
    baslik: data.baslik,
    tutar: Number(data.tutar),
    tarih: data.tarih,
    kategori: data.kategori,
    tur: data.tur
  })
  return true
}

export async function deleteHarcama(id: string) {
  await deleteDoc(doc(db, 'harcamalar', id))
  return true
}

// --- HARCAMA AYARLARI (PERSONEL & GİZLENENLER) ---

export async function getHarcamaPersonelleri() {
  const snapshot = await getDocs(
    query(collection(db, 'harcama_sabit_personeller'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function getHarcamaSabitPersoneller() {
  return await getHarcamaPersonelleri()
}

export async function addHarcamaSabitPersonel(adSoyad: string) {
  const res = await addDoc(collection(db, 'harcama_sabit_personeller'), { ad_soyad: adSoyad })
  return { id: res.id, ad_soyad: adSoyad }
}

export async function deleteHarcamaSabitPersonel(id: string) {
  await deleteDoc(doc(db, 'harcama_sabit_personeller', id))
  return true
}

export async function addHarcamaYerelKisi(adSoyad: string) {
  const res = await addDoc(collection(db, 'harcama_yerel_kisiler'), { ad_soyad: adSoyad })
  return { id: res.id, ad_soyad: adSoyad }
}

export async function deleteHarcamaGorunum(id: string, kaynak: 'GLOBAL' | 'YEREL') {
  if (kaynak === 'YEREL') {
    await deleteDoc(doc(db, 'harcama_yerel_kisiler', id))
  } else {
    // Global personeli yerel görünümde gizle (ayrı koleksiyon)
    await addDoc(collection(db, 'harcama_gizlenenler'), { personel_id: id })
  }
  return true
}

// --- PERSONELLER ---

export async function getPersoneller() {
  const snapshot = await getDocs(query(collection(db, 'personeller'), orderBy('ad_soyad', 'asc')))
  return snapshot.docs.map(formatDoc)
}

export async function addPersonel(data: any) {
  const res = await addDoc(collection(db, 'personeller'), data)
  return { id: res.id, ...data }
}

export async function updatePersonel(data: any) {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'personeller', id), updateData)
  return true
}

export async function deletePersonel(id: string) {
  await deleteDoc(doc(db, 'personeller', id))
  return true
}

// --- REHBER ---

export async function getRehber() {
  const snapshot = await getDocs(query(collection(db, 'rehber'), orderBy('ad_soyad', 'asc')))
  return snapshot.docs.map(formatDoc)
}

export async function addRehber(data: any) {
  const res = await addDoc(collection(db, 'rehber'), data)
  return { id: res.id, ...data }
}

export async function updateRehber(data: any) {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'rehber', id), updateData)
  return true
}

export async function deleteRehber(id: string) {
  await deleteDoc(doc(db, 'rehber', id))
  return true
}

// --- ZIMMET ---

export async function getZimmet(limitVal = 100) {
  const q = query(collection(db, 'zimmet'), orderBy('id', 'desc'), limit(limitVal)) // ID sıralaması Firestore'da auto-id olduğu için tarih kullanılmalı
  // Ancak mevcut yapıda ID'ye güvenilmiş. Firestore'da 'createdAt' alanı ekleyip ona göre sıralamak en doğrusu.
  // Migration sırasında mevcut veriye dokunmuyoruz ama yeni kayıtlarda tarih alanı zaten var.
  // Geçici olarak tarih'e göre sıralayalım:
  // NOT: Eğer tarih alanı string 'YYYY-MM-DD' ise alfabetik sıralama işe yarar.
  // const qSorted = query(collection(db, 'zimmet'), orderBy('tarih', 'desc'), limit(limitVal));
  const snapshot = await getDocs(q)
  return snapshot.docs.map(formatDoc)
}

export async function addZimmet(data: any) {
  const res = await addDoc(collection(db, 'zimmet'), {
    ...data,
    durum: 'BEKLİYOR',
    createdAt: new Date().toISOString() // Sıralama için eklenebilir
  })
  return { id: res.id, ...data }
}

export async function updateZimmetDurum(id: string, durum: string) {
  await updateDoc(doc(db, 'zimmet', id), { durum })
  return true
}

export async function deleteZimmet(id: string) {
  await deleteDoc(doc(db, 'zimmet', id))
  return true
}

export async function searchZimmet(term: string) {
  // Firestore'da "LIKE %Query%" sorgusu yoktur. Tam metin arama için Algolia vb. önerilir.
  // Basit çözüm: Client-side filtreleme veya "orderBy" ve "startAt" kullanma (sadece prefix araması yapar).
  // Şimdilik tümünü çekip JS ile filtreleyelim (Veri az varsayımıyla)
  if (!term) return []
  const snapshot = await getDocs(collection(db, 'zimmet'))
  const all = snapshot.docs.map(formatDoc)
  const lower = term.toLowerCase()
  return all.filter(
    (z: any) =>
      (z.barkod && z.barkod.toLowerCase().includes(lower)) ||
      (z.evrak_no && z.evrak_no.toLowerCase().includes(lower)) ||
      (z.yer && z.yer.toLowerCase().includes(lower))
  )
}

// --- RESMİ YAZI (EVRAKLAR) ---

export async function getEvraklar() {
  const snapshot = await getDocs(query(collection(db, 'evraklar'), orderBy('tarih', 'desc')))
  return snapshot.docs.map(formatDoc)
}

export async function addEvrak(data: any) {
  const res = await addDoc(collection(db, 'evraklar'), data)
  return { id: res.id, ...data }
}

export async function updateEvrak(data: any) {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'evraklar', id), updateData)
  return true
}

export async function deleteEvrak(id: string) {
  await deleteDoc(doc(db, 'evraklar', id))
  return true
}

// --- EĞİTİM ---

export async function getEgitimKonular() {
  const snapshot = await getDocs(collection(db, 'egitim_konular'))
  // ID sıralaması yerine oluşturma sırası veya alfabetik
  return snapshot.docs.map(formatDoc).sort((a: any, b: any) => a.baslik?.localeCompare(b.baslik))
}

export async function addEgitimKonu(baslik: string) {
  const res = await addDoc(collection(db, 'egitim_konular'), { baslik })
  return { id: res.id, baslik }
}

export async function deleteEgitimKonu(id: string) {
  await deleteDoc(doc(db, 'egitim_konular', id))
  return true
}

export async function updateEgitimKonu(id: string, baslik: string) {
  await updateDoc(doc(db, 'egitim_konular', id), { baslik })
  return true
}

export async function getEgitimEgiticiler() {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_egiticiler'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function addEgitimEgitici(data: any) {
  const res = await addDoc(collection(db, 'egitim_egiticiler'), {
    ad_soyad: data.ad,
    unvan: data.unvan
  })
  return { id: res.id, ...data }
}

export async function updateEgitimEgitici(data: any) {
  await updateDoc(doc(db, 'egitim_egiticiler', data.id), { ad_soyad: data.ad, unvan: data.unvan })
  return true
}

export async function deleteEgitimEgitici(id: string) {
  await deleteDoc(doc(db, 'egitim_egiticiler', id))
  return true
}

export async function getEgitimPersoneller() {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_personeller'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function addEgitimPersonel(data: any) {
  const res = await addDoc(collection(db, 'egitim_personeller'), {
    ad_soyad: data.ad,
    unvan: data.unvan,
    cinsiyet: data.cinsiyet,
    grup: data.grup || 'Sabah'
  })
  return { id: res.id, ...data }
}

export async function updateEgitimPersonel(data: any) {
  await updateDoc(doc(db, 'egitim_personeller', data.id), {
    ad_soyad: data.ad,
    unvan: data.unvan,
    cinsiyet: data.cinsiyet,
    grup: data.grup
  })
  return true
}

export async function deleteEgitimPersonel(id: string) {
  await deleteDoc(doc(db, 'egitim_personeller', id))
  return true
}

// Planlar ve Dersler (İlişkisel Yapı -> Alt Koleksiyon veya Referans)
// Basitlik için: Plan dokümanı içinde dersleri array olarak tutabiliriz
// VEYA egitim_dersler diye ayrı koleksiyon yapıp plan_id ile sorgularız.
export async function getEgitimPlanlar() {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_planlar'), orderBy('olusturma_tarihi', 'desc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function saveEgitimPlan(data: any) {
  const batch = writeBatch(db)

  // Planı oluştur
  const planRef = doc(collection(db, 'egitim_planlar'))
  batch.set(planRef, { adi: data.adi, olusturma_tarihi: data.tarih })

  // Dersleri ayrı koleksiyona ekle (Batch ile)
  data.dersler.forEach((ders: any) => {
    const dersRef = doc(collection(db, 'egitim_dersler'))
    batch.set(dersRef, {
      plan_id: planRef.id,
      konu: ders.konu,
      egitici: ders.egitici,
      tarih: ders.tarih,
      saat: ders.saat
    })
  })

  await batch.commit()
  return true
}

export async function deleteEgitimPlan(id: string) {
  // Önce dersleri sil
  const derslerQ = query(collection(db, 'egitim_dersler'), where('plan_id', '==', id))
  const derslerSnap = await getDocs(derslerQ)

  const batch = writeBatch(db)
  derslerSnap.forEach((d) => batch.delete(d.ref))

  // Planı sil
  batch.delete(doc(db, 'egitim_planlar', id))

  await batch.commit()
  return true
}

export async function getEgitimPlanDetay(planId: string) {
  const planDoc = await getDoc(doc(db, 'egitim_planlar', planId))
  const plan = formatDoc(planDoc)

  const derslerQ = query(
    collection(db, 'egitim_dersler'),
    where('plan_id', '==', planId),
    orderBy('tarih'),
    orderBy('saat')
  )
  const derslerSnap = await getDocs(derslerQ)
  const dersler = derslerSnap.docs.map(formatDoc)

  const personellerSnap = await getDocs(
    query(collection(db, 'egitim_personeller'), orderBy('ad_soyad'))
  )
  const personeller = personellerSnap.docs.map(formatDoc)

  return { plan, dersler, personeller }
}

// --- TAKVİM ---

export async function getTakvimEtkinlikleri() {
  const snapshot = await getDocs(query(collection(db, 'takvim'), orderBy('tarih', 'asc')))
  return snapshot.docs.map(formatDoc)
}

export async function addTakvimEtkinlik(data: any) {
  const res = await addDoc(collection(db, 'takvim'), data)
  return { id: res.id, ...data }
}

export async function updateTakvimEtkinlik(data: any) {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'takvim', id), updateData)
  return true
}

export async function deleteTakvimEtkinlik(id: string) {
  await deleteDoc(doc(db, 'takvim', id))
  return true
}

// --- ARŞİV ---

export async function getNextArsivKlasorNo(yili: string) {
  const q = query(
    collection(db, 'arsiv_dosyalar'),
    where('yili', '==', yili),
    orderBy('klasor_no', 'desc'),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return 1
  const max = snap.docs[0].data().klasor_no
  return Number(max) + 1
}

export async function getArsivKlasorTanimlari() {
  const snap = await getDocs(query(collection(db, 'arsiv_klasor_tanimlari'), orderBy('ad', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addArsivKlasorTanim(ad: string) {
  // Benzersiz kontrolü yapılabilir
  const res = await addDoc(collection(db, 'arsiv_klasor_tanimlari'), { ad: ad.toUpperCase() })
  return { id: res.id, ad: ad.toUpperCase() }
}

export async function deleteArsivKlasorTanim(id: string) {
  await deleteDoc(doc(db, 'arsiv_klasor_tanimlari', id))
  return true
}

// --- ARŞİV İMHA KOMİSYONU ---

export async function getArsivImhaKomisyonu() {
  const snap = await getDocs(
    query(collection(db, 'arsiv_imha_komisyonu'), orderBy('ad_soyad', 'asc'))
  )
  return snap.docs.map(formatDoc)
}

export async function addArsivImhaKomisyonu(data: any) {
  const res = await addDoc(collection(db, 'arsiv_imha_komisyonu'), {
    ad_soyad: data.ad_soyad,
    unvan: data.unvan,
    gorev: data.gorev || 'UYE'
  })
  return { id: res.id, ...data }
}

export async function updateArsivImhaKomisyonu(data: any) {
  const { id, ...u } = data
  await updateDoc(doc(db, 'arsiv_imha_komisyonu', id), u)
  return true
}

export async function deleteArsivImhaKomisyonu(id: string) {
  await deleteDoc(doc(db, 'arsiv_imha_komisyonu', id))
  return true
}

export async function getArsivDosyalar(filtreler: any = {}) {
  const colRef = collection(db, 'arsiv_dosyalar')
  let q = query(colRef)

  // Firestore'da çoklu filtreleme indeks gerektirir.
  // Basitlik için client tarafında filtreleme veya tekli sorgular.
  if (filtreler.yili) {
    q = query(q, where('yili', '==', filtreler.yili))
  }

  const snap = await getDocs(q)
  let results = snap.docs.map(formatDoc)

  // Client-side filtering for LIKE queries
  if (filtreler.ad) {
    results = results.filter((r: any) => r.klasor_adi && r.klasor_adi.includes(filtreler.ad))
  }
  if (filtreler.kodu) {
    results = results.filter(
      (r: any) => r.dosyalama_kodu && r.dosyalama_kodu.includes(filtreler.kodu)
    )
  }

  // Sıralama
  results.sort((a: any, b: any) => {
    if (a.yili !== b.yili) return Number(b.yili) - Number(a.yili)
    return Number(a.klasor_no) - Number(b.klasor_no)
  })

  return results
}

export async function addArsivDosya(data: any) {
  // Klasör tanımı ekle (varsa ignore, yoksa ekle - Firestore'da unique index yoksa kodla kontrol)
  // Basitlik için direkt ekliyoruz
  const res = await addDoc(collection(db, 'arsiv_dosyalar'), {
    ...data,
    imha_durumu: 'NORMAL'
  })
  return { id: res.id, ...data }
}

export async function addArsivToplu(data: any) {
  // Klasör adı ekle
  if (data.klasor_adi) {
    // Check if exists logic could be here
    await addDoc(collection(db, 'arsiv_klasor_tanimlari'), { ad: data.klasor_adi.toUpperCase() })
  }

  let currentNo = parseInt(data.baslangic_no)
  const endNo = parseInt(data.bitis_no)
  const capacity = parseInt(data.kapasite)
  let folderNo = parseInt(data.baslangic_klasor_no || 1)

  const batch = writeBatch(db)
  let opCount = 0

  while (currentNo <= endNo) {
    let batchEnd = currentNo + capacity - 1
    if (batchEnd > endNo) batchEnd = endNo
    const count = batchEnd - currentNo + 1

    const newDoc = doc(collection(db, 'arsiv_dosyalar'))
    batch.set(newDoc, {
      klasor_adi: data.klasor_adi,
      tipi: data.tipi,
      yili: data.yili,
      klasor_no: folderNo.toString(),
      bas_no: currentNo.toString(),
      bitis_no: batchEnd.toString(),
      evrak_sayisi: count,
      saklama_suresi: data.saklama_suresi,
      dosyalama_kodu: data.dosyalama_kodu,
      aciklama: data.aciklama,
      konum: data.konum,
      imha_durumu: 'NORMAL'
    })

    opCount++
    // Firestore batch limiti 500
    if (opCount >= 450) {
      await batch.commit()
      opCount = 0
      // batch = writeBatch(db); // Re-assigning needed if inside loop logic was different
    }

    currentNo = batchEnd + 1
    folderNo++
  }

  if (opCount > 0) await batch.commit()
  return true
}

export async function updateArsivToplu(data: { ids: string[]; updates: any }) {
  const { ids, updates } = data
  if (!ids || ids.length === 0) return false

  const batch = writeBatch(db)
  ids.forEach((id) => {
    const ref = doc(db, 'arsiv_dosyalar', id)
    batch.update(ref, updates)
  })
  await batch.commit()
  return true
}

export async function deleteArsivToplu(ids: string[]) {
  if (!ids || ids.length === 0) return false
  const batch = writeBatch(db)
  ids.forEach((id) => {
    batch.delete(doc(db, 'arsiv_dosyalar', id))
  })
  await batch.commit()
  return true
}

export async function updateArsivDosya(data: any) {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'arsiv_dosyalar', id), updateData)
  return true
}

export async function deleteArsivDosya(id: string) {
  await deleteDoc(doc(db, 'arsiv_dosyalar', id))
  return true
}

// --- SETTINGS ---

export async function getSetting(key: string) {
  const docRef = doc(db, 'app_settings', key)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return snap.data().value
  }
  return null
}

export async function setSetting(key: string, value: string) {
  await setDoc(doc(db, 'app_settings', key), { value })
  return true
}

export async function getAllSettings() {
  const snap = await getDocs(collection(db, 'app_settings'))
  return snap.docs.map(formatDoc)
}

// --- E-APOSTİL ---

export async function getEApostil() {
  const snap = await getDocs(query(collection(db, 'e_apostil'), orderBy('ulke_adi', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addEApostil(data: any) {
  const res = await addDoc(collection(db, 'e_apostil'), data)
  return { id: res.id, ...data }
}

export async function updateEApostil(data: any) {
  const { id, ...u } = data
  await updateDoc(doc(db, 'e_apostil', id), u)
  return true
}

export async function deleteEApostil(id: string) {
  // Dosyaları da sil
  const filesSnap = await getDocs(
    query(collection(db, 'e_apostil_dosyalar'), where('apostil_id', '==', id))
  )
  const batch = writeBatch(db)
  filesSnap.forEach((d) => batch.delete(d.ref))
  batch.delete(doc(db, 'e_apostil', id))
  await batch.commit()
  return true
}

export async function getEApostilFiles(apostilId: string) {
  const snap = await getDocs(
    query(collection(db, 'e_apostil_dosyalar'), where('apostil_id', '==', apostilId))
  )
  return snap.docs.map(formatDoc)
}

export async function addEApostilFile(data: any) {
  const res = await addDoc(collection(db, 'e_apostil_dosyalar'), data)
  return { id: res.id, ...data }
}

export async function deleteEApostilFile(id: string) {
  await deleteDoc(doc(db, 'e_apostil_dosyalar', id))
  return true
}

// --- TEBDİL ---

export async function getTebdil() {
  const snap = await getDocs(query(collection(db, 'tebdil'), orderBy('ulke_adi', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addTebdil(data: any) {
  const res = await addDoc(collection(db, 'tebdil'), {
    ...data,
    konvansiyon: data.konvansiyon || 'VIYANA_1968'
  })
  return { id: res.id, ...data }
}

export async function updateTebdil(data: any) {
  const { id, ...u } = data
  await updateDoc(doc(db, 'tebdil', id), u)
  return true
}

export async function deleteTebdil(id: string) {
  const filesSnap = await getDocs(
    query(collection(db, 'tebdil_dosyalar'), where('tebdil_id', '==', id))
  )
  const batch = writeBatch(db)
  filesSnap.forEach((d) => batch.delete(d.ref))
  batch.delete(doc(db, 'tebdil', id))
  await batch.commit()
  return true
}

export async function getTebdilFiles(tebdilId: string) {
  const snap = await getDocs(
    query(collection(db, 'tebdil_dosyalar'), where('tebdil_id', '==', tebdilId))
  )
  return snap.docs.map(formatDoc)
}

export async function addTebdilFile(data: any) {
  const res = await addDoc(collection(db, 'tebdil_dosyalar'), data)
  return { id: res.id, ...data }
}

export async function deleteTebdilFile(id: string) {
  await deleteDoc(doc(db, 'tebdil_dosyalar', id))
  return true
}

export async function fetchTebdilData() {
  // Bu fonksiyon SQLite'ta başlangıç verilerini basıyordu.
  // Firebase'de bunu sadece 1 kez çalıştırmak lazım veya client'ta butonla tetiklemek.
  // Eğer "tebdil" koleksiyonu boşsa otomatik çalışsın:
  const snap = await getDocs(collection(db, 'tebdil'))
  if (snap.size > 0) return { success: true, message: 'Veriler zaten var.' }

  const batch = writeBatch(db)

  // Karayolu Trafik Konvansiyonu Üye Ülkeleri (Vienna 1968)
  const viennaCountries = [
    'Almanya',
    'Arnavutluk',
    'Avusturya',
    'Azerbaycan',
    'Bahamalar',
    'Bahreyn',
    'Belçika',
    'Beyaz Rusya',
    'Birleşik Arap Emirlikleri',
    'Birleşik Krallık',
    'Bosna Hersek',
    'Brezilya',
    'Bulgaristan',
    'Çek Cumhuriyeti',
    'Danimarka',
    'Estonya',
    'Fas',
    'Fildişi Sahili',
    'Filipinler',
    'Finlandiya',
    'Fransa',
    'Güney Afrika',
    'Gürcistan',
    'Hırvatistan',
    'Hollanda',
    'Irak',
    'İran',
    'İsrail',
    'İsveç',
    'İsviçre',
    'İtalya',
    'Karadağ',
    'Katar',
    'Kazakistan',
    'Kenya',
    'Kırgızistan',
    'Kuveyt',
    'Kuzey Makedonya',
    'Küba',
    'Letonya',
    'Liberya',
    'Litvanya',
    'Lüksemburg',
    'Macaristan',
    'Moğolistan',
    'Moldova',
    'Monako',
    'Myanmar',
    'Nijer',
    'Nijerya',
    'Norveç',
    'Orta Afrika Cumhuriyeti',
    'Özbekistan',
    'Pakistan',
    'Peru',
    'Polonya',
    'Portekiz',
    'Romanya',
    'Rusya',
    'San Marino',
    'Senegal',
    'Seyşeller',
    'Sırbistan',
    'Slovakya',
    'Slovenya',
    'Suudi Arabistan',
    'Tacikistan',
    'Tayland',
    'Tunus',
    'Türkiye',
    'Türkmenistan',
    'Ukrayna',
    'Uruguay',
    'Venezuela',
    'Vietnam',
    'Yunanistan',
    'Zimbabve'
  ]

  // Cenevre Konvansiyonu Tarafları (1949)
  const genevaCountries = [
    'ABD',
    'Avustralya',
    'Bangladeş',
    'Barbados',
    'Benin',
    'Botsvana',
    'Burkina Faso',
    'Cezayir',
    'Dominik Cumhuriyeti',
    'Ekvador',
    'Fiji',
    'Gana',
    'Guatemala',
    'Haiti',
    'Hindistan',
    'İzlanda',
    'Jamaika',
    'Japonya',
    'Kamboçya',
    'Kanada',
    'Kongo Cumhuriyeti',
    'Kongo Demokratik Cumhuriyeti',
    'Kore Cumhuriyeti (Güney Kore)',
    'Laos',
    'Lübnan',
    'Madagaskar',
    'Malezya',
    'Mali',
    'Malta',
    'Mısır',
    'Namibya',
    'Papua Yeni Gine',
    'Paraguay',
    'Ruanda',
    'Sierra Leone',
    'Singapur',
    'Sri Lanka',
    'Suriye',
    'Şili',
    'Togo',
    'Trinidad ve Tobago',
    'Uganda',
    'Ürdün',
    'Yeni Zelanda'
  ]

  viennaCountries.forEach((ulke) => {
    const ref = doc(collection(db, 'tebdil'))
    batch.set(ref, {
      ulke_adi: ulke,
      aciklama: '1968 Viyana Konvansiyonu Tarafı',
      konvansiyon: 'VIYANA_1968'
    })
  })

  genevaCountries.forEach((ulke) => {
    const ref = doc(collection(db, 'tebdil'))
    batch.set(ref, {
      ulke_adi: ulke,
      aciklama: '1949 Cenevre Konvansiyonu Tarafı',
      konvansiyon: 'CENEVRE_1949'
    })
  })

  await batch.commit()
  return { success: true, message: 'Ülkeler eklendi' }
}

// --- KURUM TANIMLARI ---

export async function getKurumTanimlari() {
  const snap = await getDocs(query(collection(db, 'kurum_tanimlari'), orderBy('ad', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addKurumTanim(ad: string) {
  const res = await addDoc(collection(db, 'kurum_tanimlari'), { ad: ad.toUpperCase() })
  return { id: res.id, ad: ad.toUpperCase() }
}

export async function deleteKurumTanim(id: string) {
  await deleteDoc(doc(db, 'kurum_tanimlari', id))
  return true
}
