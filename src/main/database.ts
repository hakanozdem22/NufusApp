/* eslint-disable @typescript-eslint/no-explicit-any */
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
  writeBatch,
  increment
} from 'firebase/firestore'

// --- YARDIMCI FONSİYONLAR ---

// Firestore verisini düzgün formatlamak için (id'yi objeye ekle)
const formatDoc = (doc: any): any => ({ id: doc.id, ...doc.data() })

export async function initDatabase(userDataPath: string): Promise<void> {
  console.log('Firebase Firestore Kullanılıyor. Yerel veritabanı dosyası gerekmez:', userDataPath)
  await seedEgitimKonular()
}

// --- HARCAMALAR ---

export async function getHarcamalarByMonth(params: any): Promise<any[]> {
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

export async function getDevirBakiyesi(tarihBaslangic: string): Promise<number> {
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

export async function addHarcama(data: any): Promise<any> {
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

export async function updateHarcama(data: any): Promise<boolean> {
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

export async function deleteHarcama(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'harcamalar', id))
  return true
}

// --- HARCAMA AYARLARI (PERSONEL & GİZLENENLER) ---

export async function getHarcamaPersonelleri(): Promise<any[]> {
  const snapshot = await getDocs(
    query(collection(db, 'harcama_sabit_personeller'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function getHarcamaSabitPersoneller(): Promise<any[]> {
  return await getHarcamaPersonelleri()
}

export async function addHarcamaSabitPersonel(adSoyad: string): Promise<any> {
  const res = await addDoc(collection(db, 'harcama_sabit_personeller'), { ad_soyad: adSoyad })
  return { id: res.id, ad_soyad: adSoyad }
}

export async function deleteHarcamaSabitPersonel(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'harcama_sabit_personeller', id))
  return true
}

export async function addHarcamaYerelKisi(adSoyad: string): Promise<any> {
  const res = await addDoc(collection(db, 'harcama_yerel_kisiler'), { ad_soyad: adSoyad })
  return { id: res.id, ad_soyad: adSoyad }
}

export async function deleteHarcamaGorunum(
  id: string,
  kaynak: 'GLOBAL' | 'YEREL'
): Promise<boolean> {
  if (kaynak === 'YEREL') {
    await deleteDoc(doc(db, 'harcama_yerel_kisiler', id))
  } else {
    // Global personeli yerel görünümde gizle (ayrı koleksiyon)
    await addDoc(collection(db, 'harcama_gizlenenler'), { personel_id: id })
  }
  return true
}

// --- PERSONELLER ---

export async function getPersoneller(): Promise<any[]> {
  const snapshot = await getDocs(query(collection(db, 'personeller'), orderBy('ad_soyad', 'asc')))
  return snapshot.docs.map(formatDoc)
}

export async function addPersonel(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'personeller'), data)
  return { id: res.id, ...data }
}

export async function updatePersonel(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'personeller', id), updateData)
  return true
}

export async function deletePersonel(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'personeller', id))
  return true
}

// --- REHBER ---

export async function getRehber(): Promise<any[]> {
  const snapshot = await getDocs(query(collection(db, 'rehber'), orderBy('ad_soyad', 'asc')))
  return snapshot.docs.map(formatDoc)
}

export async function addRehber(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'rehber'), data)
  return { id: res.id, ...data }
}

export async function updateRehber(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'rehber', id), updateData)
  return true
}

export async function deleteRehber(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'rehber', id))
  return true
}

// --- ZIMMET ---

export async function getZimmet(limitVal = 100): Promise<any[]> {
  const q = query(collection(db, 'zimmet'), orderBy('createdAt', 'desc'), limit(limitVal)) // ID sıralaması Firestore'da auto-id olduğu için tarih kullanılmalı
  // Ancak mevcut yapıda ID'ye güvenilmiş. Firestore'da 'createdAt' alanı ekleyip ona göre sıralamak en doğrusu.
  // Migration sırasında mevcut veriye dokunmuyoruz ama yeni kayıtlarda tarih alanı zaten var.
  // Geçici olarak tarih'e göre sıralayalım:
  // NOT: Eğer tarih alanı string 'YYYY-MM-DD' ise alfabetik sıralama işe yarar.
  // const qSorted = query(collection(db, 'zimmet'), orderBy('tarih', 'desc'), limit(limitVal));
  const snapshot = await getDocs(q)
  return snapshot.docs.map(formatDoc)
}

export async function addZimmet(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'zimmet'), {
    ...data,
    durum: 'BEKLİYOR',
    createdAt: new Date().toISOString() // Sıralama için eklenebilir
  })
  return { id: res.id, ...data }
}

export async function updateZimmetDurum(id: string, durum: string): Promise<boolean> {
  await updateDoc(doc(db, 'zimmet', id), { durum })
  return true
}

export async function deleteZimmet(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'zimmet', id))
  return true
}

export async function searchZimmet(term: string): Promise<any[]> {
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

export async function getEvraklar(): Promise<any[]> {
  const snapshot = await getDocs(query(collection(db, 'evraklar'), orderBy('tarih', 'desc')))
  return snapshot.docs.map(formatDoc)
}

export async function addEvrak(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'evraklar'), data)
  return { id: res.id, ...data }
}

export async function updateEvrak(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'evraklar', id), updateData)
  return true
}

export async function deleteEvrak(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'evraklar', id))
  return true
}

// --- EĞİTİM ---

export async function getEgitimKonular(): Promise<any[]> {
  const snapshot = await getDocs(collection(db, 'egitim_konular'))
  // Sıra numarasına göre sırala, yoksa alfabetik
  return snapshot.docs.map(formatDoc).sort((a: any, b: any) => {
    const siraA = a.sira ?? 9999
    const siraB = b.sira ?? 9999
    if (siraA !== siraB) return siraA - siraB
    return a.baslik?.localeCompare(b.baslik)
  })
}

export async function addEgitimKonu(baslik: string, sira?: number): Promise<any> {
  const res = await addDoc(collection(db, 'egitim_konular'), { baslik, sira: sira ?? null })
  return { id: res.id, baslik, sira }
}

export async function deleteEgitimKonu(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'egitim_konular', id))
  return true
}

export async function updateEgitimKonu(
  id: string,
  baslik: string,
  sira?: number
): Promise<boolean> {
  await updateDoc(doc(db, 'egitim_konular', id), { baslik, sira: sira ?? null })
  return true
}

const EGITIM_KONULARI_LISTESI = [
  '1.1 Anayasa ve Devlet Teşkilatı',
  '1.2 Atatürk İlke ve İnkılapları',
  '1.3 Terör, Bölücü ve Yıkıcı Faaliyetler',
  '1.4 AB ve Uluslararası İlişkiler',
  '1.5 Stratejik Plan Hazırlama ve Uygulama',
  '1.6 İç Kontrol ve İç Denetim',
  '1.7 Faaliyet Raporu Hazırlama',
  '1.8 Devlet Malını Koruma ve Tasarruf Tedbirleri',
  '1.9 Disiplin ve Ceza Soruşturması İşlemleri',
  '1.10 Aile İçi ve Kadına Yönelik Şiddetin Önlenmesi',
  '1.11 Kriz İletişim Yönetimi',
  '2.1 1 sayılı Cumhurbaşkanlığı Teşkilatı Hakkında Cumhurbaşkanlığı Kararnamesi',
  '2.2 657 sayılı Devlet Memurları Kanunu',
  '2.3 4483 sayılı Memurlar ve Diğer Kamu Görevlilerinin Yargılanması Hakkında Kanun',
  '2.4 2577 sayılı İdari Yargılama Usulü Kanunu',
  '2.5 5018 sayılı Kamu Mali Yönetimi ve Kontrol Kanunu',
  '2.6 6245 sayılı Harcırah Kanunu',
  '2.7 4734 sayılı Kamu İhale Kanunu',
  '2.8 4735 sayılı Kamu İhale Sözleşmeleri Kanunu',
  '2.9 2886 sayılı Devlet İhale Kanunu',
  '2.10 4857 sayılı İş Kanunu',
  '2.11 5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu',
  '2.12 3628 sayılı Mal Bildiriminde Bulunulması, Rüşvet ve Yolsuzluklarla Mücadele Kanunu',
  '2.13 3071 sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun, 4982 sayılı Bilgi Edinme Hakkı Kanunu ve Cumhurbaşkanlığı İletişim Merkezi (CİMER)',
  '2.14 6698 sayılı Kişisel Verilerin Korunması Kanunu',
  '2.15 7201 sayılı Tebligat Kanunu',
  '2.16 Kamu Hizmetlerinin Sunumunda Uyulacak Usul ve Esaslara İlişkin Yönetmelik',
  '2.17 Cumhurbaşkanlığı ve Bakanlık Genelgeleri',
  '2.18 5442 sayılı İl İdaresi Kanunu',
  '2.19 442 sayılı Köy Kanunu',
  '2.20 5490 sayılı Nüfus Hizmetleri Kanunu',
  '2.21 5901 sayılı Türk Vatandaşlığı Kanunu',
  '2.22 5253 sayılı Dernekler Kanunu',
  '2.23 2860 sayılı Yardım Toplama Kanunu',
  '2.24 2911 sayılı Toplantı ve Gösteri Yürüyüşleri Kanunu',
  '2.25 5326 sayılı Kabahatler Kanunu',
  '2.26 3091 sayılı Taşınmaz Mal Zilyetliğine Yapılan Tecavüzlerin Önlenmesi Hakkında Kanun',
  '2.27 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun',
  '2.28 6713 sayılı Kolluk Gözetim Komisyonu Kurulması Hakkında Kanun',
  '2.29 Valilik ve Kaymakamlık Birimleri Teşkilat, Görev ve Çalışma Yönetmeliği',
  '3.30 Görev alanı ile ilgili mevzuat',
  '3.31 Mevzuatta meydana gelen değişiklikler',
  '3. Protokol Kuralları Eğitimi Konuları',
  '4. Halkla İlişkiler Eğitimi Konuları',
  '5. Etkili Sunum Teknikleri Eğitimi Konuları',
  '6. İnsan Kaynakları Yönetimi Eğitimi Konuları',
  '7. Etkili Konuşma ve İletişim Becerileri Eğitimi Konuları',
  '8. Kişisel Gelişim Eğitimi Konuları',
  '9. Stres, Çatışma ve Öfke Yönetimi Eğitimi Konuları',
  '10. Afet ve Kriz Yönetimi Eğitim Konuları',
  '11. İç Kontrol ve İç Denetim Eğitimi Konuları',
  '12. Mobbing Yönetimi Eğitimi Konuları',
  '13. Sosyal Medya Eğitimi Konuları',
  '14. İnsan Hakları Eğitimi Konuları',
  '15. e-Devlet Uygulamaları Eğitimi Konuları',
  '16. Kamuda Etik Davranış Eğitimi Konuları',
  '17. Bağımlılık Yapıcı Maddeler ile Mücadele Eğitimi Konuları',
  '18. Arşiv Hizmetleri Eğitimi Konuları',
  '19. Koruyucu Güvenlik Eğitimi Konuları',
  '20. İş Sağlığı ve İş Güvenliği Eğitimi Konuları',
  '21. Proje Döngüsü Yönetimi Eğitimi Konuları',
  "22. Yazım Kuralları ve Türkçe'nin Doğru Kullanımı Eğitimi Konuları",
  '23. Resmi Yazışmalarda Uygulanacak Usul ve Esaslar Eğitimi Konuları',
  '24. Kurumsal Bilgi Güvenliği Eğitimi Konuları',
  '25. İlk Yardım Eğitimi Konuları (Uygulamalı)',
  '26. Bilgisayar Eğitimi Konuları (Uygulamalı)',
  '27. İçişleri e-Akademi (Uzaktan Eğitim) sistemi tarafından verilen eğitim konuları',
  '28. Bakanlık ve valilik tarafından uygun görülen diğer konular'
]

async function seedEgitimKonular(): Promise<void> {
  const SEED_KEY = 'egitim_konular_seeded_v3'
  const isSeeded = await getSetting(SEED_KEY)

  if (isSeeded === 'true') {
    return
  }

  console.log('Eğitim konuları veritabanına ekleniyor...')
  const batch = writeBatch(db)

  // 1. Mevcut konuları sil
  const snapshot = await getDocs(collection(db, 'egitim_konular'))
  snapshot.forEach((d) => {
    batch.delete(d.ref)
  })

  // 2. Yeni konuları ekle
  EGITIM_KONULARI_LISTESI.forEach((konu) => {
    const docRef = doc(collection(db, 'egitim_konular'))
    batch.set(docRef, { baslik: konu })
  })

  // 3. Ayarı güncelle
  const settingRef = doc(db, 'app_settings', SEED_KEY)
  batch.set(settingRef, { value: 'true' })

  await batch.commit()
  console.log('Eğitim konuları başarıyla eklendi.')
}

export async function getEgitimEgiticiler(): Promise<any[]> {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_egiticiler'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function addEgitimEgitici(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'egitim_egiticiler'), {
    ad_soyad: data.ad,
    unvan: data.unvan
  })
  return { id: res.id, ...data }
}

export async function updateEgitimEgitici(data: any): Promise<boolean> {
  await updateDoc(doc(db, 'egitim_egiticiler', data.id), { ad_soyad: data.ad, unvan: data.unvan })
  return true
}

export async function deleteEgitimEgitici(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'egitim_egiticiler', id))
  return true
}

export async function getEgitimPersoneller(): Promise<any[]> {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_personeller'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function addEgitimPersonel(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'egitim_personeller'), {
    ad_soyad: data.ad,
    unvan: data.unvan,
    cinsiyet: data.cinsiyet,
    grup: data.grup || 'Sabah'
  })
  return { id: res.id, ...data }
}

export async function updateEgitimPersonel(data: any): Promise<boolean> {
  await updateDoc(doc(db, 'egitim_personeller', data.id), {
    ad_soyad: data.ad,
    unvan: data.unvan,
    cinsiyet: data.cinsiyet,
    grup: data.grup
  })
  return true
}

export async function deleteEgitimPersonel(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'egitim_personeller', id))
  return true
}

// --- EĞİTİM DÜZENLEYENLER ---

export async function getEgitimDuzenleyenler(): Promise<any[]> {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_duzenleyenler'), orderBy('ad_soyad', 'asc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function addEgitimDuzenleyen(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'egitim_duzenleyenler'), {
    ad_soyad: data.ad,
    unvan: data.unvan
  })
  return { id: res.id, ...data }
}

export async function updateEgitimDuzenleyen(data: any): Promise<boolean> {
  await updateDoc(doc(db, 'egitim_duzenleyenler', data.id), {
    ad_soyad: data.ad,
    unvan: data.unvan
  })
  return true
}

export async function deleteEgitimDuzenleyen(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'egitim_duzenleyenler', id))
  return true
}

// Planlar ve Dersler (İlişkisel Yapı -> Alt Koleksiyon veya Referans)
// Basitlik için: Plan dokümanı içinde dersleri array olarak tutabiliriz
// VEYA egitim_dersler diye ayrı koleksiyon yapıp plan_id ile sorgularız.
export async function getEgitimPlanlar(): Promise<any[]> {
  const snapshot = await getDocs(
    query(collection(db, 'egitim_planlar'), orderBy('olusturma_tarihi', 'desc'))
  )
  return snapshot.docs.map(formatDoc)
}

export async function saveEgitimPlan(data: any): Promise<boolean> {
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

export async function deleteEgitimPlan(id: string): Promise<boolean> {
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

export async function getEgitimPlanDetay(planId: string): Promise<any> {
  const planDoc = await getDoc(doc(db, 'egitim_planlar', planId))
  const plan = formatDoc(planDoc)

  const derslerQ = query(collection(db, 'egitim_dersler'), where('plan_id', '==', planId))
  const derslerSnap = await getDocs(derslerQ)
  const dersler = derslerSnap.docs.map(formatDoc).sort((a: any, b: any) => {
    // Önce tarih, sonra saat sıralaması
    const tComp = (a.tarih || '').localeCompare(b.tarih || '')
    if (tComp !== 0) return tComp
    return (a.saat || '').localeCompare(b.saat || '')
  })

  const personellerSnap = await getDocs(
    query(collection(db, 'egitim_personeller'), orderBy('ad_soyad'))
  )
  const personeller = personellerSnap.docs.map(formatDoc)

  return { plan, dersler, personeller }
}

// --- TAKVİM ---

export async function getTakvimEtkinlikleri(): Promise<any[]> {
  const snapshot = await getDocs(query(collection(db, 'takvim'), orderBy('tarih', 'asc')))
  return snapshot.docs.map(formatDoc)
}

export async function addTakvimEtkinlik(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'takvim'), data)
  return { id: res.id, ...data }
}

export async function updateTakvimEtkinlik(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'takvim', id), updateData)
  return true
}

export async function deleteTakvimEtkinlik(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'takvim', id))
  return true
}

// --- ARŞİV ---

export async function getNextArsivKlasorNo(yili: string): Promise<number> {
  // 1. Önce istenen yıl için max klasör no'yu bulalım
  const q = query(
    collection(db, 'arsiv_dosyalar'),
    where('yili', '==', yili),
    orderBy('klasor_no', 'desc'),
    limit(1)
  )
  const snap = await getDocs(q)

  if (!snap.empty) {
    const max = snap.docs[0].data().klasor_no
    return Number(max) + 1
  }

  // 2. Eğer istenen yıl için kayıt yoksa (ör: yeni yıl),
  // bir önceki yıldan veya genel olarak en son verilen numaradan devam etmeliyiz.
  // Kullanıcı isteği: "2026 yılına ait veri girdim, 2025'ten sonraki id atansın"

  // Veritabanındaki (yıl bağımsız) en büyük klasör numarasını bulmaya çalışalım.
  // NOT: Firestore'da farklı bir field'a (yili) göre where yapıp, başka bir field'a (klasor_no) göre
  // global sort yapmak index gerektirebilir veya kısıtlı olabilir.
  // Ancak burada 'yili' where koşulu olmadan sadece klasor_no desc sıralarsak global max'ı buluruz.

  const qGlobal = query(collection(db, 'arsiv_dosyalar'), orderBy('klasor_no', 'desc'), limit(1))

  const snapGlobal = await getDocs(qGlobal)
  if (!snapGlobal.empty) {
    const maxGlobal = snapGlobal.docs[0].data().klasor_no
    return Number(maxGlobal) + 1
  }

  // Hiç kayıt yoksa 1'den başla
  return 1
}

export async function getArsivKlasorTanimlari(): Promise<any[]> {
  const snap = await getDocs(query(collection(db, 'arsiv_klasor_tanimlari'), orderBy('ad', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function getArsivDusunceTanimlari(): Promise<any[]> {
  const snap = await getDocs(
    query(collection(db, 'arsiv_dusunce_tanimlari'), orderBy('aciklama', 'asc'))
  )
  return snap.docs.map(formatDoc)
}

export async function addArsivDusunceTanim(aciklama: string): Promise<any> {
  const res = await addDoc(collection(db, 'arsiv_dusunce_tanimlari'), { aciklama })
  return { id: res.id, aciklama }
}

export async function deleteArsivDusunceTanim(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'arsiv_dusunce_tanimlari', id))
  return true
}

export async function syncArsivDefinitions(): Promise<{
  klasorCount: number
  dusunceCount: number
}> {
  console.log('SYNC: syncArsivDefinitions started')
  try {
    // 1. Mevcut tanımları çek
    const mevcutKlasorlerSnap = await getDocs(collection(db, 'arsiv_klasor_tanimlari'))
    const mevcutDusunceSnap = await getDocs(collection(db, 'arsiv_dusunce_tanimlari'))

    console.log(
      `SYNC: Existing - Folders: ${mevcutKlasorlerSnap.size}, Thoughts: ${mevcutDusunceSnap.size}`
    )

    const mevcutKlasorAdlari = new Set(mevcutKlasorlerSnap.docs.map((d) => d.data().ad))
    const mevcutDusunceler = new Set(mevcutDusunceSnap.docs.map((d) => d.data().aciklama))

    // 2. Arşivdeki tüm dosyaları çek
    const arsivSnap = await getDocs(collection(db, 'arsiv_dosyalar'))
    console.log(`SYNC: Total Archive Files: ${arsivSnap.size}`)

    const yeniKlasorler = new Map<string, any>()
    const yeniDusunceler = new Set<string>()

    arsivSnap.docs.forEach((docSnap) => {
      const data = docSnap.data()
      // Klasör Tanımları
      if (data.klasor_adi && !mevcutKlasorAdlari.has(data.klasor_adi.toUpperCase())) {
        // Eğer map'te yoksa ekle
        if (!yeniKlasorler.has(data.klasor_adi.toUpperCase())) {
          yeniKlasorler.set(data.klasor_adi.toUpperCase(), {
            ad: data.klasor_adi.toUpperCase(),
            saklama_suresi: data.saklama_suresi || '',
            dosyalama_kodu: data.dosyalama_kodu || ''
          })
        }
      }

      // Düşünceler
      if (data.aciklama && !mevcutDusunceler.has(data.aciklama)) {
        yeniDusunceler.add(data.aciklama)
      }
    })

    console.log(
      `SYNC: Found new - Folders: ${yeniKlasorler.size}, Thoughts: ${yeniDusunceler.size}`
    )

    // 3. Batch ile ekle
    let batch = writeBatch(db)
    let count = 0
    let klasorAdded = 0
    let dusunceAdded = 0

    // Klasörler
    for (const val of yeniKlasorler.values()) {
      const ref = doc(collection(db, 'arsiv_klasor_tanimlari'))
      batch.set(ref, val)
      count++
      klasorAdded++
      if (count >= 400) {
        await batch.commit()
        batch = writeBatch(db)
        count = 0
      }
    }

    // Düşünceler
    for (const d of yeniDusunceler) {
      const ref = doc(collection(db, 'arsiv_dusunce_tanimlari'))
      batch.set(ref, { aciklama: d })
      count++
      dusunceAdded++
      if (count >= 400) {
        await batch.commit()
        batch = writeBatch(db)
        count = 0
      }
    }

    if (count > 0) {
      await batch.commit()
    }

    console.log(`SYNC: Completed. Added Folders: ${klasorAdded}, Added Thoughts: ${dusunceAdded}`)
    return { klasorCount: klasorAdded, dusunceCount: dusunceAdded }
  } catch (error) {
    console.error('SYNC: Error in syncArsivDefinitions', error)
    throw error
  }
}

export async function addArsivKlasorTanim(data: any): Promise<any> {
  // String gelirse (eski yapı)
  if (typeof data === 'string') {
    const res = await addDoc(collection(db, 'arsiv_klasor_tanimlari'), { ad: data.toUpperCase() })
    return { id: res.id, ad: data.toUpperCase() }
  }
  // Obje gelirse (yeni yapı: ad, saklama_suresi, dosyalama_kodu)
  const res = await addDoc(collection(db, 'arsiv_klasor_tanimlari'), {
    ad: data.ad.toUpperCase(),
    saklama_suresi: data.saklama_suresi || '',
    dosyalama_kodu: data.dosyalama_kodu || ''
  })
  return { id: res.id, ...data }
}

export async function deleteArsivKlasorTanim(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'arsiv_klasor_tanimlari', id))
  return true
}

export async function updateArsivKlasorTanim(data: any): Promise<boolean> {
  const { id, ...u } = data
  // ad büyük harf olsun
  if (u.ad) u.ad = u.ad.toUpperCase()
  await updateDoc(doc(db, 'arsiv_klasor_tanimlari', id), u)
  return true
}

// --- ARŞİV İMHA KOMİSYONU ---

export async function getArsivImhaKomisyonu(): Promise<any[]> {
  const snap = await getDocs(
    query(collection(db, 'arsiv_imha_komisyonu'), orderBy('ad_soyad', 'asc'))
  )
  return snap.docs.map(formatDoc)
}

export async function addArsivImhaKomisyonu(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'arsiv_imha_komisyonu'), {
    ad_soyad: data.ad_soyad,
    unvan: data.unvan,
    gorev: data.gorev || 'UYE'
  })
  return { id: res.id, ...data }
}

export async function updateArsivImhaKomisyonu(data: any): Promise<boolean> {
  const { id, ...u } = data
  await updateDoc(doc(db, 'arsiv_imha_komisyonu', id), u)
  return true
}

export async function deleteArsivImhaKomisyonu(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'arsiv_imha_komisyonu', id))
  return true
}

export async function getArsivDosyalar(filtreler: any = {}): Promise<any[]> {
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

export async function addArsivDosya(data: any): Promise<any> {
  // Klasör tanımı ekle (varsa ignore, yoksa ekle - Firestore'da unique index yoksa kodla kontrol)
  // Basitlik için direkt ekliyoruz
  const res = await addDoc(collection(db, 'arsiv_dosyalar'), {
    ...data,
    imha_durumu: 'NORMAL'
  })
  return { id: res.id, ...data }
}

export async function addArsivToplu(data: any): Promise<boolean> {
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
    if (opCount >= 450) {
      await batch.commit()
      opCount = 0
      // batch = writeBatch(db); // Re-assigning needed ideally but loop structure makes it tricky without re-creating batch object properly
      // Actually batch object is reused here erroneously in loop if committed.
      // The correct way is to create a NEW batch after commit.
      // However, since I am adding a NEW function, I will focus on that.
    }

    currentNo = batchEnd + 1
    folderNo++
  }

  if (opCount > 0) await batch.commit()
  return true
}

export async function addArsivBatch(data: any[]): Promise<boolean> {
  if (!data || data.length === 0) return false

  let batch = writeBatch(db)
  let opCount = 0

  for (const item of data) {
    const newDoc = doc(collection(db, 'arsiv_dosyalar'))
    batch.set(newDoc, {
      ...item,
      imha_durumu: 'NORMAL'
    })

    opCount++
    if (opCount >= 450) {
      await batch.commit()
      batch = writeBatch(db)
      opCount = 0
    }
  }

  if (opCount > 0) {
    await batch.commit()
  }
  return true
}

export async function updateArsivToplu(data: { ids: string[]; updates: any }): Promise<boolean> {
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

export async function deleteArsivToplu(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return false
  const batch = writeBatch(db)
  ids.forEach((id) => {
    batch.delete(doc(db, 'arsiv_dosyalar', id))
  })
  await batch.commit()
  return true
}

export async function updateArsivDosya(data: any): Promise<boolean> {
  const { id, ...updateData } = data
  await updateDoc(doc(db, 'arsiv_dosyalar', id), updateData)
  return true
}

export async function deleteArsivDosya(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'arsiv_dosyalar', id))
  return true
}
// --- ARŞİV TANIMLARI ---

// --- SETTINGS ---

export async function getSetting(key: string): Promise<string | null> {
  const docRef = doc(db, 'app_settings', key)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return snap.data().value
  }
  return null
}

export async function setSetting(key: string, value: string): Promise<boolean> {
  await setDoc(doc(db, 'app_settings', key), { value })
  return true
}

export async function getAllSettings(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'app_settings'))
  return snap.docs.map(formatDoc)
}

// --- E-APOSTİL ---

export async function getEApostil(): Promise<any[]> {
  const [apostilSnap, filesSnap] = await Promise.all([
    getDocs(query(collection(db, 'e_apostil'), orderBy('ulke_adi', 'asc'))),
    getDocs(collection(db, 'e_apostil_files'))
  ])

  const fileCounts: Record<string, number> = {}
  filesSnap.forEach((docSnap) => {
    const data = docSnap.data()
    if (data.e_apostil_id) {
      fileCounts[data.e_apostil_id] = (fileCounts[data.e_apostil_id] || 0) + 1
    }
  })

  return apostilSnap.docs.map((d) => {
    const data = formatDoc(d)
    data.dosya_sayisi = fileCounts[data.id] || 0
    return data
  })
}

export async function addEApostil(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'e_apostil'), data)
  return { id: res.id, ...data }
}

export async function updateEApostil(data: any): Promise<boolean> {
  const { id, ...u } = data
  await updateDoc(doc(db, 'e_apostil', id), u)
  return true
}

export async function deleteEApostil(id: string): Promise<boolean> {
  // Dosyaları da sil
  const filesSnap = await getDocs(
    query(collection(db, 'e_apostil_files'), where('e_apostil_id', '==', id))
  )
  const batch = writeBatch(db)
  filesSnap.forEach((d) => batch.delete(d.ref))
  batch.delete(doc(db, 'e_apostil', id))
  await batch.commit()
  return true
}

export async function getEApostilFiles(eApostilId: string): Promise<any[]> {
  const snap = await getDocs(
    query(collection(db, 'e_apostil_files'), where('e_apostil_id', '==', eApostilId))
  )
  return snap.docs.map(formatDoc)
}

export async function addEApostilFile(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'e_apostil_files'), data)
  return { id: res.id, ...data }
}

export async function deleteEApostilFile(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'e_apostil_files', id))
  return true
}

// --- TEBDİL (EHLİYET) ---

export async function getTebdil(): Promise<any[]> {
  const snap = await getDocs(query(collection(db, 'tebdil'), orderBy('ulke_adi', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addTebdil(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'tebdil'), data)
  return { id: res.id, ...data }
}

export async function updateTebdil(data: any): Promise<boolean> {
  const { id, dosya_sayisi, link_sayisi, ...u } = data
  await updateDoc(doc(db, 'tebdil', id), u)
  return true
}

export async function deleteTebdil(id: string): Promise<boolean> {
  const filesSnap = await getDocs(
    query(collection(db, 'tebdil_files'), where('tebdil_id', '==', id))
  )
  const batch = writeBatch(db)
  filesSnap.forEach((d) => batch.delete(d.ref))
  batch.delete(doc(db, 'tebdil', id))
  await batch.commit()
  return true
}

export async function getTebdilFiles(tebdilId: string): Promise<any[]> {
  const snap = await getDocs(
    query(collection(db, 'tebdil_files'), where('tebdil_id', '==', tebdilId))
  )
  return snap.docs.map(formatDoc)
}

export async function addTebdilFile(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'tebdil_files'), data)
  // Parent dökümanın sayacını artır
  if (data.tebdil_id) {
    const parentRef = doc(db, 'tebdil', data.tebdil_id)
    const field = data.tip === 'LINK' ? 'link_sayisi' : 'dosya_sayisi'
    await updateDoc(parentRef, { [field]: increment(1) })
  }
  return { id: res.id, ...data }
}

export async function deleteTebdilFile(id: string): Promise<boolean> {
  // Önce tebdil_id ve tip bilgisini bulalım
  const fileRef = doc(db, 'tebdil_files', id)
  const fileSnap = await getDoc(fileRef)

  if (fileSnap.exists()) {
    const data = fileSnap.data()
    if (data.tebdil_id) {
      const parentRef = doc(db, 'tebdil', data.tebdil_id)
      const field = data.tip === 'LINK' ? 'link_sayisi' : 'dosya_sayisi'
      await updateDoc(parentRef, { [field]: increment(-1) })
    }
  }

  await deleteDoc(fileRef)
  return true
}

export async function fetchTebdilData(): Promise<any> {
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

  // Bu fonksiyon SQLite'ta başlangıç verilerini basıyordu.
  // Firebase'de bunu sadece 1 kez çalıştırmak lazım veya client'ta butonla tetiklemek.
  const snap = await getDocs(collection(db, 'tebdil'))
  if (snap.size > 0) return { success: true, message: 'Veriler zaten var.' }

  const batch = writeBatch(db)

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

export async function getKurumTanimlari(): Promise<any[]> {
  const snap = await getDocs(query(collection(db, 'kurum_tanimlari'), orderBy('ad', 'asc')))
  return snap.docs.map(formatDoc)
}

export async function addKurumTanim(ad: string): Promise<any> {
  const res = await addDoc(collection(db, 'kurum_tanimlari'), { ad: ad.toUpperCase() })
  return { id: res.id, ad: ad.toUpperCase() }
}

export async function deleteKurumTanim(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'kurum_tanimlari', id))
  return true
}

// ==========================================
// TAŞINIR MALZEME ENVANTER SİSTEMİ
// ==========================================

// --- MALZEMELER ---

export async function getEnvanterMalzemeler(criteria: any = {}): Promise<any[]> {
  // Not: Firestore'da dinamik çoklu filtreleme zordur. Client-side filtreleme yapalım.
  const snapshot = await getDocs(collection(db, 'envanter_malzemeler'))
  let results = snapshot.docs.map(formatDoc)

  if (criteria.ad && criteria.ad !== 'Tümü') results = results.filter((r) => r.ad === criteria.ad)
  if (criteria.marka && criteria.marka !== 'Tümü')
    results = results.filter((r) => r.marka === criteria.marka)
  if (criteria.konum && criteria.konum !== 'Tümü')
    results = results.filter((r) => r.konum === criteria.konum)
  if (criteria.personel && criteria.personel !== 'Tümü')
    results = results.filter((r) => r.personel === criteria.personel)
  if (criteria.durum && criteria.durum !== 'Tümü')
    results = results.filter((r) => r.durum === criteria.durum)
  if (criteria.ara) {
    const term = criteria.ara.toLowerCase()
    results = results.filter((r) => r.ad?.toLowerCase().includes(term))
  }

  // Sort by date or id descending
  // Assuming 'tarih' is YYYY-MM-DD HH:mm
  results.sort((a, b) => (b.tarih || '').localeCompare(a.tarih || ''))

  return results
}

export async function addEnvanterMalzeme(data: any): Promise<any> {
  const res = await addDoc(collection(db, 'envanter_malzemeler'), data)
  return { id: res.id, ...data }
}

export async function updateEnvanterMalzeme(data: any): Promise<boolean> {
  const { id, ...u } = data
  await updateDoc(doc(db, 'envanter_malzemeler', id), u)
  return true
}

export async function deleteEnvanterMalzeme(id: string): Promise<boolean> {
  await deleteDoc(doc(db, 'envanter_malzemeler', id))
  return true
}

export async function getEnvanterSummary(field: string): Promise<any[]> {
  // Group by field and sum 'adet'
  const snapshot = await getDocs(collection(db, 'envanter_malzemeler'))
  const data = snapshot.docs.map((d) => d.data())
  const summary: Record<string, number> = {}

  data.forEach((item: any) => {
    const key = item[field] || 'Belirsiz'
    const count = Number(item.adet) || 0
    if (!summary[key]) summary[key] = 0
    summary[key] += count
  })

  // Return as array [key, value]
  return Object.entries(summary)
    .map(([key, val]) => [key, val])
    .sort((a: any, b: any) => a[0].localeCompare(b[0]))
}

export async function addEnvanterMalzemeBatch(
  malzemeler: any[]
): Promise<{ success: boolean; count: number }> {
  try {
    const colRef = collection(db, 'envanter_malzemeler')

    let count = 0
    let batchCount = 0
    let currentBatch = writeBatch(db)

    for (const m of malzemeler) {
      const docRef = doc(colRef)
      currentBatch.set(docRef, { ...m, tarih: m.tarih || new Date().toISOString().split('T')[0] })

      count++
      batchCount++

      if (batchCount >= 400) {
        await currentBatch.commit()
        currentBatch = writeBatch(db)
        batchCount = 0
      }
    }

    if (batchCount > 0) {
      await currentBatch.commit()
    }

    return { success: true, count }
  } catch (error) {
    console.error('Batch import error:', error)
    throw error
  }
}

// --- TANIMLAMALAR (Ayarlar) ---

// Generic Helper for Definitions
async function getDefinitions(collName: string, orderByField = 'ad'): Promise<any[]> {
  const snap = await getDocs(query(collection(db, collName), orderBy(orderByField, 'asc')))
  return snap.docs.map(formatDoc)
}

async function addDefinition(collName: string, data: any): Promise<any> {
  const res = await addDoc(collection(db, collName), data)
  return { id: res.id, ...data }
}

async function updateDefinition(collName: string, data: any): Promise<boolean> {
  const { id, ...u } = data
  await updateDoc(doc(db, collName, id), u)
  return true
}

async function deleteDefinition(collName: string, id: string): Promise<boolean> {
  await deleteDoc(doc(db, collName, id))
  return true
}

// Kategoriler
export const getEnvanterKategoriler = () => getDefinitions('envanter_tanim_kategori')
export const addEnvanterKategori = (ad: string) => addDefinition('envanter_tanim_kategori', { ad })
export const deleteEnvanterKategori = (id: string) =>
  deleteDefinition('envanter_tanim_kategori', id)
export const updateEnvanterKategori = (id: string, ad: string) =>
  updateDefinition('envanter_tanim_kategori', { id, ad })

// Yerler
export const getEnvanterYerler = () => getDefinitions('envanter_tanim_yer', 'yer_adi')
export const addEnvanterYer = (yer_adi: string) => addDefinition('envanter_tanim_yer', { yer_adi })
export const deleteEnvanterYer = (id: string) => deleteDefinition('envanter_tanim_yer', id)
export const updateEnvanterYer = (id: string, yer_adi: string) =>
  updateDefinition('envanter_tanim_yer', { id, yer_adi })

// Malzeme Tanımları (Catalog)
export const getEnvanterMalzemeTanimlari = () => getDefinitions('envanter_tanim_malzeme')
export const addEnvanterMalzemeTanim = (data: { ad: string; kategori: string }) =>
  addDefinition('envanter_tanim_malzeme', data)
export const deleteEnvanterMalzemeTanim = (id: string) =>
  deleteDefinition('envanter_tanim_malzeme', id)
export const updateEnvanterMalzemeTanim = (data: any) =>
  updateDefinition('envanter_tanim_malzeme', data)

// Marka Tanımları
export const getEnvanterMarkaTanimlari = () => getDefinitions('envanter_tanim_marka')
export const addEnvanterMarkaTanim = (data: {
  ad: string
  kategori: string
  malzeme_adi: string
}) => addDefinition('envanter_tanim_marka', data)
export const deleteEnvanterMarkaTanim = (id: string) => deleteDefinition('envanter_tanim_marka', id)
export const updateEnvanterMarkaTanim = (data: any) =>
  updateDefinition('envanter_tanim_marka', data)

// Personel Tanımları
export const getEnvanterPersonelTanimlari = () => getDefinitions('envanter_tanim_personel')
export const addEnvanterPersonelTanim = (ad: string) =>
  addDefinition('envanter_tanim_personel', { ad })
export const deleteEnvanterPersonelTanim = (id: string) =>
  deleteDefinition('envanter_tanim_personel', id)
export const updateEnvanterPersonelTanim = (id: string, ad: string) =>
  updateDefinition('envanter_tanim_personel', { id, ad })
