import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { ZimmetKayit } from '../models/zimmet-types'

// Türkçe karakter desteği için font kaydı
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold'
    }
  ]
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5
  },
  date: {
    fontSize: 10,
    marginBottom: 10
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
    minHeight: 24
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold'
  },
  // Sütun genişlikleri (Toplam 100%)
  colNo: {
    width: '5%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'center'
  },
  colBarkod: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'center'
  },
  colEvrak: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'center'
  },
  colYer: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
    textAlign: 'left'
  },
  colUcret: { width: '15%', padding: 4, textAlign: 'right' },

  footer: {
    marginTop: 20
  },
  note: {
    fontSize: 10,
    marginBottom: 30
  },
  signatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  signatureBlock: {
    alignItems: 'center',
    width: 150
  }
})

interface Props {
  liste: ZimmetKayit[]
}

export const ZimmetPdfDocument = ({ liste }: Props) => {
  const toplamTutar = liste.reduce((acc, curr) => acc + curr.ucret, 0)
  const tarih = new Date().toLocaleDateString('tr-TR')

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* BAŞLIK */}
        <View style={styles.header}>
          <Text style={styles.title}>T.C. KAPAKLI KAYMAKAMLIĞI</Text>
          <Text style={styles.subtitle}>İlçe Nüfus Müdürlüğü - POSTA ZİMMET DEFTERİ</Text>
          <Text style={styles.date}>Tarih: {tarih}</Text>
        </View>

        {/* TABLO */}
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colNo}>Sıra</Text>
            <Text style={styles.colBarkod}>Barkod</Text>
            <Text style={styles.colEvrak}>Evrak No</Text>
            <Text style={styles.colYer}>Gideceği Yer / Alıcı</Text>
            <Text style={styles.colUcret}>Tutar</Text>
          </View>

          {/* Body */}
          {liste.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colNo}>{index + 1}</Text>
              <Text style={styles.colBarkod}>{item.barkod || '-'}</Text>
              <Text style={styles.colEvrak}>{item.evrak_no || '-'}</Text>
              <Text style={styles.colYer}>{item.yer}</Text>
              <Text style={styles.colUcret}>{item.ucret.toFixed(2)} TL</Text>
            </View>
          ))}

          {/* Footer Row (Toplam) */}
          <View style={[styles.tableRow, { fontWeight: 'bold' }]}>
            <Text style={[styles.colNo, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colBarkod, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colEvrak, { borderRightWidth: 0 }]}></Text>
            <Text style={[styles.colYer, { textAlign: 'right', paddingRight: 10 }]}>
              GENEL TOPLAM
            </Text>
            <Text style={styles.colUcret}>{toplamTutar.toFixed(2)} TL</Text>
          </View>
        </View>

        {/* İMZA */}
        <View style={styles.footer}>
          <Text style={styles.note}>
            Yukarıdaki {liste.length} adet gönderi karşılığı pul yapıştırılmıştır.
          </Text>
          <View style={styles.signatures}>
            <View style={styles.signatureBlock}>
              <Text>Görevli Memur</Text>
              <Text style={{ marginTop: 20 }}>(İmza)</Text>
            </View>
            <View style={styles.signatureBlock}>
              <Text>PTT Yetkilisi</Text>
              <Text style={{ marginTop: 20 }}>(İmza / Mühür)</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
