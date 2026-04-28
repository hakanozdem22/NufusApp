import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { ZimmetKayit } from '../models/zimmet-types'

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
})

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto', fontSize: 9 },
  header: { alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 11, marginBottom: 4 },
  meta: { fontSize: 9, color: '#555' },
  table: { width: '100%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000', marginBottom: 16 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', alignItems: 'center', minHeight: 22 },
  headerRow: { backgroundColor: '#2c3e50' },
  evenRow: { backgroundColor: '#f8f9fa' },
  headerText: { color: '#fff', fontWeight: 'bold', fontSize: 8 },
  colNo:     { width: '4%',  borderRightWidth: 1, borderRightColor: '#000', padding: 3, textAlign: 'center' },
  colTarih:  { width: '12%', borderRightWidth: 1, borderRightColor: '#000', padding: 3 },
  colBarkod: { width: '13%', borderRightWidth: 1, borderRightColor: '#000', padding: 3 },
  colEvrak:  { width: '12%', borderRightWidth: 1, borderRightColor: '#000', padding: 3 },
  colYer:    { width: '38%', borderRightWidth: 1, borderRightColor: '#000', padding: 3 },
  colUcret:  { width: '11%', borderRightWidth: 1, borderRightColor: '#000', padding: 3, textAlign: 'right' },
  colDurum:  { width: '10%', padding: 3, textAlign: 'center' },
  totalRow:  { backgroundColor: '#eaf0fb' },
  footer: { marginTop: 14 },
  note: { fontSize: 9, marginBottom: 24 },
  signatures: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  signatureBlock: { alignItems: 'center', width: 150 },
  signatureLine: { marginTop: 18, fontSize: 9 }
})

interface Props {
  liste: ZimmetKayit[]
}

export const ZimmetArsivPdfDocument = ({ liste }: Props) => {
  const toplamTutar = liste.reduce((acc, curr) => acc + (Number(curr.ucret) || 0), 0)
  const tarihStr = new Date().toLocaleDateString('tr-TR')

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>T.C. KAPAKLI KAYMAKAMLIĞI</Text>
          <Text style={styles.subtitle}>İlçe Nüfus Müdürlüğü — POSTA ZİMMET ARŞİV LİSTESİ</Text>
          <Text style={styles.meta}>Çıktı Tarihi: {tarihStr}   |   Toplam Kayıt: {liste.length}</Text>
        </View>

        <View style={styles.table}>
          {/* Başlık */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.colNo,    styles.headerText]}>#</Text>
            <Text style={[styles.colTarih, styles.headerText]}>Tarih</Text>
            <Text style={[styles.colBarkod,styles.headerText]}>Barkod</Text>
            <Text style={[styles.colEvrak, styles.headerText]}>Evrak No</Text>
            <Text style={[styles.colYer,   styles.headerText]}>Gideceği Yer / Kurum</Text>
            <Text style={[styles.colUcret, styles.headerText]}>Ücret</Text>
            <Text style={[styles.colDurum, styles.headerText]}>Durum</Text>
          </View>

          {/* Satırlar */}
          {liste.map((item, i) => (
            <View key={i} style={[styles.row, i % 2 === 1 ? styles.evenRow : {}]}>
              <Text style={styles.colNo}>{i + 1}</Text>
              <Text style={styles.colTarih}>{item.tarih ? String(item.tarih).split(' ')[0] : '-'}</Text>
              <Text style={styles.colBarkod}>{item.barkod || '-'}</Text>
              <Text style={styles.colEvrak}>{item.evrak_no || '-'}</Text>
              <Text style={styles.colYer}>{item.yer}</Text>
              <Text style={styles.colUcret}>{(Number(item.ucret) || 0).toFixed(2)} ₺</Text>
              <Text style={styles.colDurum}>{item.durum || '-'}</Text>
            </View>
          ))}

          {/* Toplam satırı */}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.colNo, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colTarih, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colBarkod, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colEvrak, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colYer, { textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }]}>GENEL TOPLAM</Text>
            <Text style={[styles.colUcret, { fontWeight: 'bold' }]}>{toplamTutar.toFixed(2)} ₺</Text>
            <Text style={styles.colDurum}></Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.note}>Yukarıdaki {liste.length} adet gönderiye ait arşiv kaydıdır.</Text>
          <View style={styles.signatures}>
            <View style={styles.signatureBlock}>
              <Text>Görevli Memur</Text>
              <Text style={styles.signatureLine}>(İmza)</Text>
            </View>
            <View style={styles.signatureBlock}>
              <Text>Müdür</Text>
              <Text style={styles.signatureLine}>(İmza / Mühür)</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
