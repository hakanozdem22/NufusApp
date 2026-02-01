import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Font kaydı (HarcamaReport ile aynı)
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
})

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Roboto',
        fontSize: 9
    },
    header: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
        leading: 4
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderWidth: 1,
        borderColor: '#000'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        minHeight: 20,
        alignItems: 'center'
    },
    tableHeader: {
        backgroundColor: '#d1d5db', // Light grey
        fontWeight: 'bold',
        fontSize: 9
    },
    // Columns (Approx matching python script widths: 25, 60, 45, 30, 25, 20, 30, 35)
    // Total relative units = 270
    colSicil: { width: '9%', padding: 2, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
    colAd: { width: '22%', padding: 2, textAlign: 'left', borderRightWidth: 1, borderRightColor: '#000' },
    colUnvan: { width: '16%', padding: 2, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
    colKadro: { width: '11%', padding: 2, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
    colEk: { width: '9%', padding: 2, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
    colDk: { width: '8%', padding: 2, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
    colTerfiTarih: { width: '11%', padding: 2, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#000' },
    colSonrakiTarih: { width: '14%', padding: 2, textAlign: 'center' }
})

interface TerfiReportProps {
    liste: any[]
    tip: 'TERFI' | 'DURUM'
}

export const TerfiReport = ({ liste, tip }: TerfiReportProps) => {
    // Şimdilik sadece TERFI senaryosu (Yatay)
    const isTerfi = tip === 'TERFI'

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.header}>
                    T.C.{'\n'}KAPAKLI KAYMAKAMLIĞI{'\n'}İLÇE NÜFUS MÜDÜRLÜĞÜ PERSONELİNE AİT TERFİ LİSTESİ
                </Text>

                <View style={styles.table}>
                    {/* HEADER */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.colSicil}>SİCİL NO</Text>
                        <Text style={styles.colAd}>ADI SOYADI</Text>
                        <Text style={styles.colUnvan}>ÜNVANI</Text>
                        <Text style={styles.colKadro}>KADRO</Text>
                        <Text style={styles.colEk}>EK GÖSTERGE</Text>
                        <Text style={styles.colDk}>D / K</Text>
                        <Text style={styles.colTerfiTarih}>TERFİ{'\n'}TARİHİ</Text>
                        <Text style={styles.colSonrakiTarih}>SONRAKİ{'\n'}TERFİ</Text>
                    </View>

                    {/* DATA */}
                    {liste.map((p, index) => {
                        const mevcutDk = `${p.derece || '-'}/${p.kademe || '-'}`
                        let tarih = p.terfi_tarihi || ''
                        try { tarih = new Date(tarih).toLocaleDateString('tr-TR') } catch { }

                        let sonraki = p.sonraki_terfi || ''
                        try { sonraki = new Date(sonraki).toLocaleDateString('tr-TR') } catch { }

                        return (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.colSicil}>{p.sicil_no}</Text>
                                <Text style={styles.colAd}>{(p.ad_soyad || '').toLocaleUpperCase('tr-TR')}</Text>
                                <Text style={styles.colUnvan}>{p.unvan}</Text>
                                <Text style={styles.colKadro}>{p.kadro}</Text>
                                <Text style={styles.colEk}>{p.ek_gosterge}</Text>
                                <Text style={styles.colDk}>{mevcutDk}</Text>
                                <Text style={styles.colTerfiTarih}>{tarih}</Text>
                                <Text style={styles.colSonrakiTarih}>{sonraki}</Text>
                            </View>
                        )
                    })}
                </View>
            </Page>
        </Document>
    )
}
