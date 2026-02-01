import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Font kaydı
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
})

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Roboto',
        fontSize: 9
    },
    title: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: 'bold'
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        minHeight: 20,
        alignItems: 'stretch'
    },
    header: {
        backgroundColor: '#d1d5db',
        fontWeight: 'bold'
    },
    cell: {
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: '#000',
        justifyContent: 'center'
    },
    lastCell: {
        padding: 4,
        justifyContent: 'center'
    },
    // Widths: 15, 70, 40, 25, 25, 60, 30 -> Total 265mm. A4 Landscape ~297mm. With margins it fits.
    // Percentages approx: 5.6%, 26.4%, 15%, 9.4%, 9.4%, 22.6%, 11.3%
    colNo: { width: '6%' },
    colKonu: { width: '26%' },
    colEgitici: { width: '15%' },
    colTarih: { width: '9%' },
    colSaat: { width: '9%' },
    colKatilimci: { width: '23%' },
    colImza: { width: '12%' },

    signatureBlock: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: 20
    },
    sigItem: {
        width: 150,
        alignItems: 'center'
    },
    sigName: { fontWeight: 'bold' },
    sigTitle: { fontStyle: 'italic', fontSize: 8 },
    sigLine: { marginTop: 30, borderTopWidth: 1, width: '100%' }
})

interface EgitimReportProps {
    program_adi: string
    dersler: any[]
    personeller: any[]
}

export const EgitimReport = ({ program_adi, dersler, personeller }: EgitimReportProps) => {
    // 1. Group by Date
    const dates = Array.from(new Set(dersler.map(d => d.tarih))).sort()

    // Logic to process rows per date
    const renderDatePage = (dateStr: string, idx: number) => {
        let trDate = dateStr
        try { trDate = new Date(dateStr).toLocaleDateString('tr-TR') } catch { }

        const gunlukDersler = dersler.filter(d => d.tarih === dateStr)
        const rows: any[] = []

        // Process lessons
        gunlukDersler.forEach(ders => {
            const konu = ders.konu
            let egitici = ders.egitici
            // Python: " - " split logic for display HTML. Here we just show text.
            // But in grid logic we might want to split or keep as is.
            // Keep as is for now.

            const saat = ders.saat

            let participantsToAdd: any[] = []

            if (!personeller || personeller.length === 0) {
                participantsToAdd = [{ ad_soyad: '-', grup: '' }]
            } else {
                // Filter logic
                personeller.forEach(p => {
                    const grup = p.grup || 'Sabah'
                    // Parse start hour
                    try {
                        const startPart = saat.split(':')[0]
                        const startHour = parseInt(startPart)
                        // Sabah (before 12) & Personel Ogle => Skip
                        if (startHour < 12 && grup === 'Öğle') return
                        // Ogle (after 12) & Personel Sabah => Skip
                        if (startHour >= 12 && grup === 'Sabah') return
                    } catch { }
                    participantsToAdd.push(p)
                })
            }

            if (participantsToAdd.length === 0) {
                participantsToAdd = [{ ad_soyad: '-', grup: '' }] // Fallback if no one matches
            }

            rows.push({
                konu,
                egitici,
                saat,
                participants: participantsToAdd
            })
        })

        // To mimic the python "sequence number" across the document, we might need global state or just pass it?
        // But page breaking makes index tracking hard in React PDF map.
        // However, we can calculate total rows before rendering. 
        // Wait, python script uses `global_s_no` which resets?? No:
        // `elif idx == 0 and i == 0: global_s_no = 1` resets at start of doc.
        // Increments when `curr_subj` changes.
        // So basically usage index of distinct lessons.

        // Let's create flat list for rendering
        const flatRows: any[] = []
        let currentAuthSNo = 0 // Actually we better rely on logic inside render

        // Unique trainers for signature
        const distinctTrainers = Array.from(new Set(gunlukDersler.map(d => d.egitici))).filter(Boolean)

        return (
            <Page key={idx} size="A4" orientation="landscape" style={styles.page}>
                <Text style={styles.title}>{`${program_adi} - ${trDate}`.toUpperCase()}</Text>

                <View style={styles.table}>
                    <View style={[styles.row, styles.header]}>
                        <View style={[styles.cell, styles.colNo]}><Text>S.NO</Text></View>
                        <View style={[styles.cell, styles.colKonu]}><Text>KONU</Text></View>
                        <View style={[styles.cell, styles.colEgitici]}><Text>EĞİTİCİ</Text></View>
                        <View style={[styles.cell, styles.colTarih]}><Text>TARİH</Text></View>
                        <View style={[styles.cell, styles.colSaat]}><Text>SAAT</Text></View>
                        <View style={[styles.cell, styles.colKatilimci]}><Text>KATILIMCI</Text></View>
                        <View style={[styles.lastCell, styles.colImza]}><Text>İMZA</Text></View>
                    </View>

                    {rows.map((r, rIdx) => {
                        // Logic for S.NO: Increments for each new Lesson (Topic)
                        // If rows are just lessons, simply rIdx + 1?
                        // Python logic: `rows_for_day` is flat list of participants.
                        // Here `rows` is grouped by lesson. So `rIdx + 1` is correct for S.NO for this lesson block.
                        // But we render multiple lines for participants. 
                        // To look like merged cells, we render text only on first participant row, or render one big cell.
                        // React-PDF doesn't support rowSpan.
                        // So we will map participants.

                        return r.participants.map((p, pIdx) => {
                            const isFirst = pIdx === 0
                            // Only show S.NO, Konu, Egitici, Tarih, Saat on the first row of this lesson block

                            return (
                                <View key={`${rIdx}-${pIdx}`} style={styles.row}>
                                    <View style={[styles.cell, styles.colNo]}>
                                        <Text>{isFirst ? (rIdx + 1) : ''}</Text>
                                    </View>
                                    <View style={[styles.cell, styles.colKonu]}>
                                        <Text>{isFirst ? r.konu : ''}</Text>
                                    </View>
                                    <View style={[styles.cell, styles.colEgitici]}>
                                        <Text>{isFirst ? r.egitici : ''}</Text>
                                    </View>
                                    <View style={[styles.cell, styles.colTarih]}>
                                        <Text>{isFirst ? trDate : ''}</Text>
                                    </View>
                                    <View style={[styles.cell, styles.colSaat]}>
                                        <Text>{isFirst ? r.saat : ''}</Text>
                                    </View>
                                    <View style={[styles.cell, styles.colKatilimci]}>
                                        <Text>{p.ad_soyad}</Text>
                                    </View>
                                    <View style={[styles.lastCell, styles.colImza]}><Text></Text></View>
                                </View>
                            )
                        })
                    })}
                </View>

                {/* Signature Block */}
                <View style={styles.signatureBlock}>
                    {distinctTrainers.map((t: any, tIdx) => {
                        const parts = t.toString().split(' - ')
                        const name = parts[0]
                        const title = parts[1] || ''
                        return (
                            <View key={tIdx} style={styles.sigItem}>
                                <Text style={styles.sigName}>{name}</Text>
                                <Text style={styles.sigTitle}>{title}</Text>
                                <View style={styles.sigLine} />
                            </View>
                        )
                    })}
                </View>
            </Page>
        )
    }

    return (
        <Document>
            {dates.map((date, idx) => renderDatePage(date, idx))}
        </Document>
    )
}
