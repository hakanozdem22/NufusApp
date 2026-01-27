import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Türkçe karakter sorunu yaşamamak için standart bir font (Opsiyonel olarak Roboto eklenebilir ama standart font yeterli)
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
})

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
    paddingBottom: 10
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#111' },
  subTitle: { fontSize: 12, color: '#666' },

  // Özet Kutuları (Dashboard tarzı)
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 5
  },
  summaryBox: { width: '23%', padding: 5, alignItems: 'center' },
  summaryLabel: { fontSize: 8, color: '#666', marginBottom: 2, textTransform: 'uppercase' },
  summaryValue: { fontSize: 12, fontWeight: 'bold' },

  // Tablo Tasarımı (1.jpg tarzı)
  table: { width: '100%', borderTop: '1px solid #eee' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #eee',
    padding: 8,
    alignItems: 'center'
  },
  col1: { width: '20%' }, // Tarih
  col2: { width: '45%' }, // Açıklama
  col3: { width: '15%', textAlign: 'center' }, // Tür
  col4: { width: '20%', textAlign: 'right' }, // Tutar

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#aaa'
  }
})

// Para formatı fonksiyonu
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(amount) + ' ₺'
}

interface PDFProps {
  liste: any[]
  ozet: { devir: number; gelir: number; gider: number; kasa: number }
  baslikTarih: string
}

export const HarcamaPDF = ({ liste, ozet, baslikTarih }: PDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* 1. BAŞLIK BÖLÜMÜ */}
      <View style={styles.header}>
        <Text style={styles.title}>FİNANSAL DURUM RAPORU</Text>
        <Text style={styles.subTitle}>{baslikTarih} Dönemi Hesap Dökümü</Text>
      </View>

      {/* 2. ÖZET KUTULARI (Dashboard Görünümü) */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Dönem Başı Devir</Text>
          <Text style={styles.summaryValue}>{formatMoney(ozet.devir)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={{ ...styles.summaryLabel, color: '#16a34a' }}>Toplam Gelir</Text>
          <Text style={{ ...styles.summaryValue, color: '#16a34a' }}>
            +{formatMoney(ozet.gelir)}
          </Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={{ ...styles.summaryLabel, color: '#dc2626' }}>Toplam Gider</Text>
          <Text style={{ ...styles.summaryValue, color: '#dc2626' }}>
            -{formatMoney(ozet.gider)}
          </Text>
        </View>
        <View style={{ ...styles.summaryBox, borderLeft: '1px solid #ddd' }}>
          <Text style={{ ...styles.summaryLabel, color: '#2563eb' }}>MEVCUT KASA</Text>
          <Text style={{ ...styles.summaryValue, color: '#2563eb', fontSize: 14 }}>
            {formatMoney(ozet.kasa)}
          </Text>
        </View>
      </View>

      {/* 3. TABLO (Resmi Tablo Görünümü) */}
      <View style={styles.table}>
        {/* Tablo Başlığı */}
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>TARİH</Text>
          <Text style={styles.col2}>AÇIKLAMA / PERSONEL</Text>
          <Text style={styles.col3}>İŞLEM TÜRÜ</Text>
          <Text style={styles.col4}>TUTAR</Text>
        </View>

        {/* Tablo Satırları */}
        {liste.map((item, index) => (
          <View
            key={index}
            style={{ ...styles.tableRow, backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}
          >
            <Text style={styles.col1}>{new Date(item.tarih).toLocaleDateString('tr-TR')}</Text>
            <Text style={styles.col2}>{item.baslik}</Text>
            <Text
              style={{
                ...styles.col3,
                color: item.tur === 'GELIR' ? '#16a34a' : '#dc2626',
                fontSize: 8
              }}
            >
              {item.tur === 'GELIR' ? 'GELİR' : 'GİDER'}
            </Text>
            <Text
              style={{
                ...styles.col4,
                color: item.tur === 'GELIR' ? '#16a34a' : '#dc2626',
                fontWeight: 'bold'
              }}
            >
              {item.tur === 'GELIR' ? '+' : '-'}
              {formatMoney(item.tutar)}
            </Text>
          </View>
        ))}
      </View>

      {/* 4. ALT BİLGİ */}
      <Text style={styles.footer}>
        Bu rapor {new Date().toLocaleDateString('tr-TR')} tarihinde sistem tarafından otomatik
        oluşturulmuştur.
      </Text>
    </Page>
  </Document>
)
