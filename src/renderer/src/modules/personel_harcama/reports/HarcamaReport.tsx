import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Türkçe karakter desteği için font kaydı
// Not: Normalde dosyadan okumak daha garantidir ancak CDN de çalışabilir.
// Çevrimdışı çalışması için Roboto fontunu assets içine koyup import etmek en iyisidir.
// Şimdilik standart Helvetica kullanıyoruz, sorun olursa deiştireceğiz.
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
})

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Roboto',
        fontSize: 10
    },
    header: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: 'bold'
    },
    subHeader: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 15,
        color: 'gray'
    },
    summaryTable: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#f0f0f0',
        marginBottom: 20
    },
    summaryCol: {
        flex: 1,
        padding: 8,
        textAlign: 'center',
        borderRightWidth: 1,
        borderRightColor: '#000'
    },
    summaryColLast: {
        flex: 1,
        padding: 8,
        textAlign: 'center'
    },
    summaryLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4
    },
    summaryValue: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderWidth: 1,
        borderColor: '#e5e7eb'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        alignItems: 'center',
        minHeight: 24
    },
    tableHeader: {
        backgroundColor: '#f9fafb',
        fontWeight: 'bold',
        fontSize: 9
    },
    colDate: { width: '15%', padding: 4, textAlign: 'center' },
    colType: { width: '10%', padding: 4, textAlign: 'center' },
    colCat: { width: '20%', padding: 4 },
    colDesc: { width: '40%', padding: 4 },
    colAmount: { width: '15%', padding: 4, textAlign: 'right' },

    textGreen: { color: 'green' },
    textRed: { color: 'red' },
    textBlue: { color: 'blue' }
})

interface HarcamaReportProps {
    liste: any[]
    ozet: { devir: number; gelir: number; gider: number; kasa: number }
    donem: string
    raporTuru: string
}

export const HarcamaReport = ({ liste, ozet, donem, raporTuru }: HarcamaReportProps) => {
    let title = "PERSONEL HARCAMA VE GELİR RAPORU"
    if (raporTuru === "GELIR") title = "PERSONEL GELİR RAPORU"
    if (raporTuru === "GIDER") title = "PERSONEL GİDER RAPORU"

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.subHeader}>DÖNEM: {donem}</Text>

                {/* ÖZET TABLOSU */}
                <View style={styles.summaryTable}>
                    <View style={styles.summaryCol}>
                        <Text style={[styles.summaryLabel, styles.textBlue]}>DEVİR</Text>
                        <Text style={[styles.summaryValue, styles.textBlue]}>{ozet.devir.toFixed(2)} TL</Text>
                    </View>
                    <View style={styles.summaryCol}>
                        <Text style={[styles.summaryLabel, styles.textGreen]}>GELİR</Text>
                        <Text style={[styles.summaryValue, styles.textGreen]}>+{ozet.gelir.toFixed(2)} TL</Text>
                    </View>
                    <View style={styles.summaryCol}>
                        <Text style={[styles.summaryLabel, styles.textRed]}>GİDER</Text>
                        <Text style={[styles.summaryValue, styles.textRed]}>-{ozet.gider.toFixed(2)} TL</Text>
                    </View>
                    <View style={styles.summaryColLast}>
                        <Text style={[styles.summaryLabel, styles.textBlue]}>KASA (DURUM)</Text>
                        <Text style={[styles.summaryValue, styles.textBlue]}>{ozet.kasa.toFixed(2)} TL</Text>
                    </View>
                </View>

                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>Detaylı Hareket Dökümü</Text>

                {/* DETAY TABLOSU */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.colDate}>Tarih</Text>
                        <Text style={styles.colType}>Tür</Text>
                        <Text style={styles.colCat}>Kategori</Text>
                        <Text style={styles.colDesc}>Açıklama</Text>
                        <Text style={styles.colAmount}>Tutar</Text>
                    </View>

                    {liste.map((item, index) => {
                        const tutar = item.tutar
                        const isGelir = item.tur === 'GELIR'
                        const tutarStr = isGelir ? `+${tutar.toFixed(2)} TL` : `-${tutar.toFixed(2)} TL`
                        const rowStyle = index % 2 === 0 ? {} : { backgroundColor: '#f9fafb' }

                        return (
                            <View key={index} style={[styles.tableRow, rowStyle]}>
                                <Text style={styles.colDate}>{new Date(item.tarih).toLocaleDateString('tr-TR')}</Text>
                                <Text style={styles.colType}>{item.tur}</Text>
                                <Text style={styles.colCat}>{item.kategori}</Text>
                                <Text style={styles.colDesc}>{item.baslik}</Text>
                                <Text style={[styles.colAmount, isGelir ? styles.textGreen : styles.textRed]}>{tutarStr}</Text>
                            </View>
                        )
                    })}
                </View>
            </Page>
        </Document>
    )
}
