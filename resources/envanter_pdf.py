
import sys
import json
import os
import datetime
from reportlab.lib.pagesizes import A4, landscape, portrait
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
        title = data.get('title', "ENVANTER LİSTESİ")
        summary = data.get('summary', False)
        
        # Use desktop_path from Electron, fallback to USERPROFILE/Desktop
        desktop = data.get('desktop_path') or os.path.join(os.environ['USERPROFILE'], 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d-%m-%Y_%H-%M-%S')
        prefix = "Ozet" if summary else "Detay"
        dosya_adi = f"Envanter_{prefix}_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)

        # Page setup
        is_portrait = data.get('is_portrait', False)
        page_size = portrait(A4) if is_portrait else landscape(A4)
        
        doc = SimpleDocTemplate(dosya_yolu, pagesize=page_size, rightMargin=10*mm, leftMargin=10*mm, topMargin=10*mm, bottomMargin=10*mm)
        elements = []
        
        # Font Setup
        font_name = "Helvetica"
        try:
            font_folder = os.path.join(os.environ['WINDIR'], 'Fonts')
            arial_path = os.path.join(font_folder, 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path))
                font_name = 'Arial'
        except: pass

        styles = getSampleStyleSheet()
        # Custom Styles
        h_style = ParagraphStyle('Heading1', parent=styles['Heading1'], fontName=font_name, alignment=1, spaceAfter=10)
        cell_style = ParagraphStyle('BodyText', parent=styles['BodyText'], fontName=font_name, fontSize=9)
        head_style = ParagraphStyle('Header', parent=cell_style, textColor=colors.white, alignment=1, fontName=font_name)

        # Title
        elements.append(Paragraph(title, h_style))
        elements.append(Spacer(1, 5*mm))

        # Table Data Construction
        if summary:
            headers = data.get('headers', ["Kriter", "Toplam Adet"])
            col_widths = [100*mm, 50*mm]
            table_data = [[Paragraph(h, head_style) for h in headers]]
            
            for row in liste:
                # row is likely [label, count]
                table_data.append([
                    Paragraph(str(row.get('label', row.get('0', ''))), cell_style),
                    Paragraph(str(row.get('value', row.get('1', ''))), cell_style)
                ])
        else:
            # Detailed List
            # COLS = ("ID", "Malzeme Adı", "Marka", "Kategori", "Adet", "Kullanım Yeri", "Personel", "Durum", "Tarih")
            # We skip ID usually.
            headers = ["Malzeme Adı", "Marka", "Kategori", "Adet", "Konum", "Personel", "Durum", "Tarih"]
            # Adjustable column widths for Landscape A4 (Total ~277mm)
            col_widths = [40*mm, 30*mm, 30*mm, 15*mm, 35*mm, 40*mm, 25*mm, 30*mm]
            
            table_data = [[Paragraph(h, head_style) for h in headers]]
            
            for item in liste:
                row_data = [
                    Paragraph(str(item.get('ad', '')), cell_style),
                    Paragraph(str(item.get('marka', '')), cell_style),
                    Paragraph(str(item.get('kategori', '')), cell_style),
                    Paragraph(str(item.get('adet', '')), cell_style),
                    Paragraph(str(item.get('konum', '')), cell_style),
                    Paragraph(str(item.get('personel', '')), cell_style),
                    Paragraph(str(item.get('durum', '')), cell_style),
                    Paragraph(str(item.get('tarih', '')), cell_style)
                ]
                table_data.append(row_data)

        # Table Styling
        t = Table(table_data, colWidths=col_widths if not summary else None, repeatRows=1)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.Color(0.17, 0.24, 0.31)),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.whitesmoke, colors.lightgrey]),
            ('FONTNAME', (0,0), (-1,-1), font_name),
        ]))
        
        elements.append(t)
        
        # Build
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
