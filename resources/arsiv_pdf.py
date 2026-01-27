import sys
import json
import os
import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def create_pdf(data_json):
    try:
        if isinstance(data_json, bytes):
            data_json = data_json.decode('utf-8')
            
        data = json.loads(data_json)
        liste = data.get('kayitlar', [])
        rapor_tipi = data.get('rapor_tipi', 'LISTE')
        komisyon = data.get('komisyon', {})
        
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d%m%Y_%H%M')
        
        font_name = "Helvetica"
        try:
            arial_path = os.path.join(os.environ['WINDIR'], 'Fonts', 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path))
                font_name = 'Arial'
        except: pass

        elements = []
        styles = getSampleStyleSheet()
        s_title = ParagraphStyle('Title', parent=styles['Normal'], fontName=font_name, fontSize=14, alignment=1, spaceAfter=10, leading=18)
        s_cell = ParagraphStyle('Cell', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=1)
        s_cell_left = ParagraphStyle('CellLeft', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=0)
        s_label = ParagraphStyle('Label', parent=styles['Normal'], fontName=font_name, fontSize=24, alignment=1, leading=28)
        s_label_sm = ParagraphStyle('LabelSm', parent=styles['Normal'], fontName=font_name, fontSize=12, alignment=1)

        # STANDART LİSTE
        if rapor_tipi == 'LISTE':
            dosya_adi = f"Arsiv_Envanter_Listesi_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)
            doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=5*mm, leftMargin=5*mm, topMargin=10*mm, bottomMargin=10*mm)

            elements.append(Paragraph(f"<b>DİJİTAL ARŞİV YÖNETİM SİSTEMİ - ENVANTER LİSTESİ</b>", s_title))
            elements.append(Spacer(1, 5*mm))

            headers = ["SIRA", "KLASÖR\nADETİ", "KLASÖR ADI / KONUSU", "DOSYA\nKODU", "TİPİ", "YILI", "ARALIK\n(BAŞ-BİTİŞ)", "SAKLAMA\nSÜRESİ", "AÇIKLAMA"]
            table_data = [headers]

            for idx, item in enumerate(liste, 1):
                yil_ham = str(item.get('yili', ''))
                yil_duzgun = yil_ham.split('.')[0] if yil_ham else '-'

                row = [
                    str(idx),
                    item.get('klasor_no', '-'),
                    Paragraph(item.get('klasor_adi', ''), s_cell_left),
                    item.get('dosyalama_kodu', ''),
                    item.get('tipi', ''),
                    yil_duzgun,
                    f"{item.get('bas_no','')} - {item.get('bitis_no','')}",
                    f"{item.get('saklama_suresi','')} Yıl",
                    Paragraph(item.get('aciklama', '') or item.get('konum', ''), s_cell)
                ]
                table_data.append(row)

            cw = [10*mm, 20*mm, 90*mm, 25*mm, 20*mm, 15*mm, 30*mm, 20*mm, 50*mm]
            t = Table(table_data, colWidths=cw, repeatRows=1)
            t.setStyle(TableStyle([('FONTNAME', (0,0), (-1,-1), font_name), ('FONTSIZE', (0,0), (-1,-1), 8), ('GRID', (0,0), (-1,-1), 0.5, colors.black), ('BACKGROUND', (0,0), (-1,0), colors.lightgrey), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('FONTWEIGHT', (0,0), (-1,0), 'BOLD')]))
            elements.append(t)

        # İMHALIK LİSTESİ (GÜNCELLENDİ: TEKRAR FİLTRELEME YAPMAZ)
        elif rapor_tipi == 'IMHA':
            dosya_adi = f"Imhalik_Arsiv_Listesi_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)
            doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=10*mm, leftMargin=10*mm, topMargin=10*mm, bottomMargin=10*mm)

            elements.append(Paragraph(f"<b>İMHA EDİLECEK ARŞİV MALZEMESİ LİSTESİ</b>", s_title))
            
            # Backend tarafında tekrar filtreleme yapmıyoruz. Frontend ne gönderdiyse onu basıyoruz.
            if not liste:
                elements.append(Paragraph("İmhalık kayıt bulunamadı.", s_cell))
            else:
                headers = ["SIRA", "KLASÖR ADETİ", "KLASÖR ADI", "YILI", "SAKLAMA SÜRESİ", "İMHA GEREKÇESİ"]
                table_data = [headers]
                
                for idx, item in enumerate(liste, 1):
                    yil_ham = str(item.get('yili', ''))
                    yil_duzgun = yil_ham.split('.')[0] if yil_ham else '0'
                    
                    yil = int(yil_duzgun)
                    sure = int(item.get('saklama_suresi') or 0)
                    simdiki_yil = datetime.datetime.now().year
                    
                    # Akıllı Gerekçe: Eğer süresi dolduysa "Süre Doldu", yoksa "Komisyon Kararı"
                    gerekce = "Komisyon Kararı ile"
                    if (yil + sure) < simdiki_yil:
                        gerekce = "Saklama Süresi Doldu"

                    row = [
                        str(idx),
                        item.get('klasor_no', '-'),
                        Paragraph(item.get('klasor_adi', ''), s_cell_left),
                        yil_duzgun,
                        f"{sure} Yıl",
                        gerekce
                    ]
                    table_data.append(row)
                
                t = Table(table_data, colWidths=[15*mm, 25*mm, 100*mm, 20*mm, 30*mm, 60*mm], repeatRows=1)
                t.setStyle(TableStyle([('FONTNAME', (0,0), (-1,-1), font_name), ('GRID', (0,0), (-1,-1), 0.5, colors.black), ('BACKGROUND', (0,0), (-1,0), colors.red), ('TEXTCOLOR', (0,0), (-1,0), colors.white), ('ALIGN', (0,0), (-1,-1), 'CENTER'), ('VALIGN', (0,0), (-1,-1), 'MIDDLE')]))
                elements.append(t)

                elements.append(Spacer(1, 30*mm))
                imza_data = [[komisyon.get('baskan','Komisyon Başkanı'), komisyon.get('uye1','Üye'), komisyon.get('uye2','Üye')], ["(İmza)", "(İmza)", "(İmza)"]]
                t_imza = Table(imza_data, colWidths=[80*mm, 80*mm, 80*mm])
                t_imza.setStyle(TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER'), ('FONTNAME',(0,0),(-1,-1),font_name), ('FONTSIZE',(0,0),(-1,-1),11)]))
                elements.append(t_imza)

        # ETİKET
        elif rapor_tipi == 'ETIKET':
            dosya_adi = f"Klasor_Etiketleri_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)
            doc = SimpleDocTemplate(dosya_yolu, pagesize=A4, rightMargin=5*mm, leftMargin=5*mm, topMargin=5*mm, bottomMargin=5*mm)
            data_rows = []
            for i in range(0, len(liste), 2):
                pair = liste[i:i+2]
                row_cells = []
                for item in pair:
                    yil_ham = str(item.get('yili', ''))
                    yil_duzgun = yil_ham.split('.')[0] if yil_ham else ''
                    cell_content = [Spacer(1, 10*mm), Paragraph(f"<b>T.C.<br/>KAPAKLI KAYMAKAMLIĞI<br/>İLÇE NÜFUS MÜDÜRLÜĞÜ</b>", s_label_sm), Spacer(1, 15*mm), Paragraph(f"<b>{yil_duzgun}</b>", s_label), Spacer(1, 10*mm), Paragraph(f"<b>{item.get('klasor_adi', '').upper()}</b>", s_label), Spacer(1, 15*mm), Paragraph(f"DOSYA NO: {item.get('dosyalama_kodu','-')}", s_label_sm), Spacer(1, 5*mm), Paragraph(f"<b>KLASÖR SAYISI: {item.get('klasor_no', '')}</b>", ParagraphStyle('KNo', parent=s_label, fontSize=36)), Spacer(1, 10*mm), Paragraph(f"EVRAK ARALIĞI:<br/>{item.get('bas_no','')} - {item.get('bitis_no','')}", s_label_sm)]
                    row_cells.append(cell_content)
                if len(row_cells) == 1: row_cells.append([])
                data_rows.append(row_cells)
            t = Table(data_rows, colWidths=[95*mm, 95*mm], rowHeights=280*mm)
            t.setStyle(TableStyle([('GRID', (0,0), (-1,-1), 1, colors.black), ('VALIGN', (0,0), (-1,-1), 'TOP'), ('ALIGN', (0,0), (-1,-1), 'CENTER')]))
            elements.append(t)

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