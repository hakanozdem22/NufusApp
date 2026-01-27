import sys
import json
import os
import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def create_pdf(data_json):
    try:
        if isinstance(data_json, bytes):
            data_json = data_json.decode('utf-8')
        
        input_data = json.loads(data_json)
        dersler = input_data.get('dersler', [])
        personeller = input_data.get('personeller', [])
        program_adi = input_data.get('program_adi', 'Eğitim Programı')
        
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d-%m-%Y_%H-%M-%S')
        dosya_adi = f"Egitim_Plani_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)

        # Font
        font_name = "Helvetica"
        try:
            arial_path = os.path.join(os.environ['WINDIR'], 'Fonts', 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path))
                font_name = 'Arial'
        except: pass

        # Sayfa Ayarları
        MARGIN = 15*mm
        doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=MARGIN, leftMargin=MARGIN, topMargin=MARGIN, bottomMargin=MARGIN)
        elements = []
        styles = getSampleStyleSheet()
        
        s_title = ParagraphStyle('Title', parent=styles['Heading1'], fontName=font_name, fontSize=14, alignment=1, spaceAfter=15)
        s_header = ParagraphStyle('Header', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=1, fontName_Bold=True)
        s_body_c = ParagraphStyle('BodyC', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=1, leading=11)
        s_body_l = ParagraphStyle('BodyL', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=0, leading=11)

        tarihler = sorted(list(set([d['tarih'] for d in dersler])))
        global_s_no = 1
        
        for idx, tarih_val in enumerate(tarihler):
            try: tr_date = datetime.datetime.strptime(tarih_val, "%Y-%m-%d").strftime("%d.%m.%Y")
            except: tr_date = tarih_val
            
            elements.append(Paragraph(f"{program_adi} - {tr_date}".upper(), s_title))
            
            gunluk_dersler = [d for d in dersler if d['tarih'] == tarih_val]
            
            table_data = [[
                Paragraph("<b>S.NO</b>", s_header),
                Paragraph("<b>KONU</b>", s_header),
                Paragraph("<b>EĞİTİCİ</b>", s_header),
                Paragraph("<b>TARİH</b>", s_header),
                Paragraph("<b>SAAT</b>", s_header),
                Paragraph("<b>KATILIMCI</b>", s_header),
                Paragraph("<b>İMZA</b>", s_header)
            ]]
            
            rows_for_day = []
            for ders in gunluk_dersler:
                konu = ders.get('konu', '')
                egitici = ders.get('egitici', '')
                saat = ders.get('saat', '')
                
                if " - " in egitici:
                    parts = egitici.split(" - ")
                    egi_fmt = f"<b>{parts[0]}</b><br/>{parts[1]}"
                else: egi_fmt = egitici

                if not personeller:
                    rows_for_day.append(["-", konu, egi_fmt, tr_date, saat, "-", ""])
                else:
                    for p in personeller:
                        ad_soyad = p.get('ad_soyad', '')
                        grup = p.get('grup', 'Sabah') # Varsayılan Sabah
                        
                        # SAAT KONTROLÜ
                        # saat formatı: "09:00 - 12:00" veya "13:30 - 16:00"
                        try:
                            baslangic_saati = int(saat.split(":")[0])
                            
                            # Eğer ders sabahsa (12'den önce) ve kişi Öğle grubundaysa -> EKLEME
                            if baslangic_saati < 12 and grup == 'Öğle':
                                continue
                                
                            # Eğer ders öğlense (12'den sonra) ve kişi Sabah grubundaysa -> EKLEME
                            if baslangic_saati >= 12 and grup == 'Sabah':
                                continue
                                
                        except: pass

                        rows_for_day.append(["-", konu, egi_fmt, tr_date, saat, ad_soyad, ""])

            for i in range(len(rows_for_day)):
                curr_subj = rows_for_day[i][1]
                if i > 0:
                    if curr_subj != rows_for_day[i-1][1]: global_s_no += 1
                elif idx > 0 and i == 0: global_s_no += 1
                elif idx == 0 and i == 0: global_s_no = 1
                    
                rows_for_day[i][0] = str(global_s_no)
                table_data.append([
                    Paragraph(str(rows_for_day[i][0]), s_body_c),
                    Paragraph(str(rows_for_day[i][1]), s_body_l),
                    Paragraph(str(rows_for_day[i][2]), s_body_c),
                    Paragraph(str(rows_for_day[i][3]), s_body_c),
                    Paragraph(str(rows_for_day[i][4]), s_body_c),
                    Paragraph(str(rows_for_day[i][5]), s_body_l),
                    ""
                ])

            col_widths = [15*mm, 70*mm, 40*mm, 25*mm, 25*mm, 60*mm, 30*mm]
            t = Table(table_data, colWidths=col_widths, repeatRows=1)
            
            ts = TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                ('GRID', (0,0), (-1,-1), 0.5, colors.black),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('LEFTPADDING', (0,0), (-1,-1), 4),
                ('RIGHTPADDING', (0,0), (-1,-1), 4)
            ])
            
            for col_idx in [0, 1, 2, 3, 4]:
                span_start = 1
                for r in range(1, len(rows_for_day)):
                    val_curr = rows_for_day[r][col_idx]
                    val_prev = rows_for_day[r-1][col_idx]
                    subj_curr = rows_for_day[r][1]
                    subj_prev = rows_for_day[r-1][1]

                    if val_curr == val_prev and subj_curr == subj_prev:
                        if r == len(rows_for_day) - 1: ts.add('SPAN', (col_idx, span_start), (col_idx, r + 1))
                    else:
                        if r > span_start: ts.add('SPAN', (col_idx, span_start), (col_idx, r))
                        span_start = r + 1
            
            t.setStyle(ts)
            elements.append(t)
            
            # İMZA BÖLÜMÜ (SOL ALT)
            # O günkü benzersiz eğiticileri bul
            unique_egiticiler = []
            seen_egiticiler = set()
            for d in gunluk_dersler:
                e = d.get('egitici', '')
                if e and e not in seen_egiticiler:
                    seen_egiticiler.add(e)
                    unique_egiticiler.append(e)
            
            if unique_egiticiler:
                elements.append(Spacer(1, 10*mm))
                
                # Her eğitici için bir imza bloğu oluştur
                sig_data = []
                # Başlık Satırı
                
                for egitici in unique_egiticiler:
                    parts = egitici.split(" - ") if " - " in egitici else [egitici, ""]
                    ad = parts[0]
                    unvan = parts[1] if len(parts) > 1 else ""
                    
                    # Blok İçeriği: Başlık, Ad, Unvan, İmza Çizgisi
                    # Kullanıcı isteği: "sağ kısımda olsun eğitici yazmasına gerek yok"
                    
                    sub_table_data = [
                        [Paragraph(f"<b>{ad}</b>", s_body_c)],
                        [Paragraph(f"<i>{unvan}</i>", s_body_c)],
                        [Paragraph("<br/><br/>.............................................", s_body_c)]
                    ]
                    
                    t_sig = Table(sub_table_data, colWidths=[60*mm])
                    t_sig.setStyle(TableStyle([
                        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                        ('VALIGN', (0,0), (-1,-1), 'TOP'),
                        ('LEFTPADDING', (0,0), (-1,-1), 0),
                    ]))
                    sig_data.append(t_sig)
                
                # Sağ tarafa yasla
                container_data = [sig_data]
                t_container = Table(container_data, colWidths=[70*mm] * len(sig_data))
                t_container.setStyle(TableStyle([
                    ('ALIGN', (0,0), (-1,-1), 'RIGHT'), # SAĞA YASLA
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ]))
                # Sağa yaslamak için tablonun kendisinin de sağa hizalanması lazım (hAlignment) ama
                # ReportLab Table flowable'da hAlign parametresi kullanılır.
                t_container.hAlign = 'RIGHT'
                
                elements.append(t_container)

            elements.append(Spacer(1, 10*mm))
            if idx < len(tarihler) - 1: elements.append(PageBreak())

        doc.build(elements)
        os.startfile(dosya_yolu)
        print(json.dumps({"success": True, "path": dosya_yolu}))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    try: sys.stdin.reconfigure(encoding='utf-8')
    except: pass
    input_data = sys.stdin.read()
    if input_data:
        create_pdf(input_data)