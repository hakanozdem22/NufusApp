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
        liste = data.get('liste', [])
        
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d-%m-%Y_%H-%M-%S')
        dosya_adi = f"Zimmet_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)

        # Kenar boşlukları
        doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=10*mm, leftMargin=10*mm, topMargin=10*mm, bottomMargin=10*mm)
        elements = []
        
        # Türkçe Font Ayarı (Arial)
        font_name = "Helvetica"
        try:
            font_folder = os.path.join(os.environ['WINDIR'], 'Fonts')
            arial_path = os.path.join(font_folder, 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path))
                font_name = 'Arial'
        except: pass

        styles = getSampleStyleSheet()
        baslik_stil = ParagraphStyle('Baslik', parent=styles['Normal'], fontName=font_name, fontSize=16, leading=20, alignment=1, spaceAfter=5)
        alt_baslik_stil = ParagraphStyle('AltBaslik', parent=styles['Normal'], fontName=font_name, fontSize=12, leading=14, alignment=1)
        tarih_stil = ParagraphStyle('Tarih', parent=styles['Normal'], fontName=font_name, fontSize=10, alignment=1, spaceBefore=5)

        # --- BAŞLIK ---
        elements.append(Paragraph("T.C. KAPAKLI KAYMAKAMLIĞI", baslik_stil))
        elements.append(Paragraph("İlçe Nüfus Müdürlüğü - POSTA ZİMMET DEFTERİ", alt_baslik_stil))
        elements.append(Paragraph(f"Tarih: {datetime.datetime.now().strftime('%d.%m.%Y')}", tarih_stil))
        elements.append(Spacer(1, 10*mm))

        # --- TABLO ---
        cell_style = ParagraphStyle('Cell', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=0)
        
        table_data = [['Sıra', 'Barkod', 'Evrak No', 'Gideceği Yer / Alıcı', 'Tutar']]
        
        toplam_tutar = 0
        for idx, item in enumerate(liste, 1):
            tutar = float(item.get('ucret', 0))
            toplam_tutar += tutar
            
            row = [
                str(idx),
                item.get('barkod', ''),
                item.get('evrak_no', ''),
                Paragraph(item.get('yer', ''), cell_style), # Uzun isimler otomatik kayar
                f"{tutar:.2f} TL"
            ]
            table_data.append(row)

        # Toplam Satırı
        table_data.append(['', '', '', 'GENEL TOPLAM', f"{toplam_tutar:.2f} TL"])

        # Sütun Genişlikleri (Toplam ~277mm)
        col_widths = [15*mm, 45*mm, 35*mm, 147*mm, 35*mm]
        
        t = Table(table_data, colWidths=col_widths, repeatRows=1)
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), font_name), # Türkçe Font
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('ALIGN', (3,1), (3,-2), 'LEFT'),    # Yer sütunu sola hizalı
            ('ALIGN', (3,-1), (3,-1), 'RIGHT'),  # Genel Toplam yazısı sağa
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('FONTWEIGHT', (0,0), (-1,0), 'BOLD'), 
            ('FONTWEIGHT', (3,-1), (-1,-1), 'BOLD'),
        ]))
        
        elements.append(t)
        elements.append(Spacer(1, 15*mm))

        # --- İMZA BÖLÜMÜ ---
        elements.append(Paragraph(f"Yukarıdaki {len(liste)} adet gönderi karşılığı pul yapıştırılmıştır.", ParagraphStyle('Not', fontName=font_name, fontSize=10)))
        elements.append(Spacer(1, 10*mm))

        imza_style = ParagraphStyle('Imza', fontName=font_name, fontSize=10, alignment=1)
        imza_data = [
            [Paragraph("Görevli Memur<br/><br/>(İmza)", imza_style),
             "",
             Paragraph("PTT Yetkilisi<br/><br/>(İmza / Mühür)", imza_style)]
        ]
        
        imza_table = Table(imza_data, colWidths=[60*mm, 100*mm, 60*mm])
        elements.append(imza_table)

        doc.build(elements)
        os.startfile(dosya_yolu)
        print(json.dumps({"success": True, "path": dosya_yolu}))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    sys.stdin.reconfigure(encoding='utf-8')
    input_data = sys.stdin.read()
    if input_data:
        create_pdf(input_data)