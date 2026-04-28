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
        
        # Use desktop_path from Electron, fallback to USERPROFILE/Desktop
        desktop = data.get('desktop_path') or os.path.join(os.environ['USERPROFILE'], 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d-%m-%Y_%H-%M-%S')
        dosya_adi = f"Resmi_Yazi_Listesi_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)

        # Kenar boşlukları
        doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=5*mm, leftMargin=5*mm, topMargin=10*mm, bottomMargin=10*mm)
        elements = []
        
        # Font Ayarı (Türkçe)
        font_name = "Helvetica"
        try:
            font_folder = os.path.join(os.environ['WINDIR'], 'Fonts')
            arial_path = os.path.join(font_folder, 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path))
                font_name = 'Arial'
        except: pass

        styles = getSampleStyleSheet()
        baslik_stil = ParagraphStyle('Baslik', parent=styles['Normal'], fontName=font_name, fontSize=16, leading=20, alignment=1, spaceAfter=15)
        
        elements.append(Paragraph("RESMİ YAZI TAKİP LİSTESİ", baslik_stil))

        # Tablo Başlıkları
        headers = ['Tür', 'Tarih', 'Sayı/No', 'Kurum/Muhatap', 'Konu', 'Durum']
        table_data = [headers]
        
        # Hücre Stili
        cell_style = ParagraphStyle('Cell', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=0)
        center_style = ParagraphStyle('CellCenter', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=1)

        for item in liste:
            row = [
                item.get('tur', ''),
                item.get('tarih', ''),
                item.get('sayi', ''),
                Paragraph(item.get('kurum', ''), cell_style),
                Paragraph(item.get('konu', ''), cell_style),
                item.get('durum', '')
            ]
            table_data.append(row)

        # Sütun Genişlikleri (~287mm)
        col_widths = [
            25*mm, # Tür
            25*mm, # Tarih
            30*mm, # Sayı
            50*mm, # Kurum
            120*mm,# Konu (En geniş)
            37*mm  # Durum
        ]
        
        t = Table(table_data, colWidths=col_widths, repeatRows=1)
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), font_name),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('FONTWEIGHT', (0,0), (-1,0), 'BOLD'),
            ('ALIGN', (3,1), (4,-1), 'LEFT'), # Kurum ve Konu sola dayalı
        ]))
        
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