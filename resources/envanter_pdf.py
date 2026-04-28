
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
        group_by_marka = data.get('group_by_marka', False)
        
        # Use desktop_path from Electron, fallback to USERPROFILE/Desktop
        desktop = data.get('desktop_path') or os.path.join(os.environ['USERPROFILE'], 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d-%m-%Y_%H-%M-%S')
        prefix = "Zimmet" if summary else ("Marka" if group_by_marka else "Detay")
        dosya_adi = f"Envanter_{prefix}_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)

        # Page setup — summary/marka are portrait, detail is landscape
        is_portrait = summary or group_by_marka or data.get('is_portrait', False)
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

        # Custom Styles for summary
        person_header_style = ParagraphStyle(
            'PersonHeader',
            parent=styles['BodyText'],
            fontName=font_name,
            fontSize=10,
            textColor=colors.white,
            spaceAfter=2,
        )
        sub_head_style = ParagraphStyle(
            'SubHead',
            parent=styles['BodyText'],
            fontName=font_name,
            fontSize=8,
            textColor=colors.white,
            alignment=1,
        )
        sub_cell_style = ParagraphStyle(
            'SubCell',
            parent=styles['BodyText'],
            fontName=font_name,
            fontSize=8,
        )

        section_title_style = ParagraphStyle(
            'SectionTitle',
            parent=styles['Heading2'],
            fontName=font_name,
            fontSize=11,
            spaceAfter=4,
            spaceBefore=8,
            textColor=colors.Color(0.17, 0.24, 0.31),
        )

        def build_group_section(groups, header_color, sub_headers, sub_col_widths, page_w):
            for group_key, g_items in groups.items():
                total_adet = sum(int(i.get('adet', 0) or 0) for i in g_items)
                kalem_sayisi = len(g_items)

                label = Paragraph(
                    f"<b>{group_key}</b>   —   {kalem_sayisi} kalem  /  {total_adet} adet",
                    person_header_style
                )
                header_row = Table([[label]], colWidths=[page_w])
                header_row.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), header_color),
                    ('LEFTPADDING', (0, 0), (-1, -1), 8),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ]))
                elements.append(header_row)

                sub_data = [[Paragraph(h, sub_head_style) for h in sub_headers]]
                for item in g_items:
                    sub_data.append([
                        Paragraph(str(item.get(col_key, '')), sub_cell_style)
                        for col_key in sub_col_keys
                    ])

                sub_t = Table(sub_data, colWidths=sub_col_widths, repeatRows=1)
                sub_t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.Color(0.25, 0.35, 0.45)),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('GRID', (0, 0), (-1, -1), 0.4, colors.Color(0.8, 0.8, 0.8)),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.Color(0.95, 0.95, 0.97)]),
                    ('FONTNAME', (0, 0), (-1, -1), font_name),
                    ('FONTSIZE', (0, 0), (-1, -1), 8),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 4),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ]))
                elements.append(sub_t)
                elements.append(Spacer(1, 4*mm))

        # Table Data Construction
        if summary:
            from collections import OrderedDict
            page_w = page_size[0] - 20*mm

            # ── BÖLÜM 1: Zimmet Sorumlusuna Göre ──
            elements.append(Paragraph("ZİMMET SORUMLULARINA GÖRE LİSTE", section_title_style))
            elements.append(Spacer(1, 2*mm))

            personel_groups = OrderedDict()
            for item in liste:
                key = (item.get('personel') or 'Atanmamış').strip() or 'Atanmamış'
                personel_groups.setdefault(key, []).append(item)

            sub_col_keys = ['ad', 'marka', 'kategori', 'adet', 'konum', 'durum']
            sub_headers   = ["Malzeme Adı", "Marka", "Kategori", "Adet", "Konum", "Durum"]
            sub_col_widths = [60*mm, 30*mm, 30*mm, 15*mm, 35*mm, 20*mm]

            build_group_section(personel_groups, colors.Color(0.17, 0.24, 0.31), sub_headers, sub_col_widths, page_w)

            doc.build(elements)
            os.startfile(dosya_yolu)
            print(json.dumps({"success": True, "path": dosya_yolu}))
            return

        if group_by_marka:
            from collections import OrderedDict
            page_w = page_size[0] - 20*mm

            elements.append(Paragraph("MARKAYA GÖRE LİSTE", section_title_style))
            elements.append(Spacer(1, 2*mm))

            marka_groups = OrderedDict()
            for item in sorted(liste, key=lambda x: (x.get('marka') or '').upper()):
                key = (item.get('marka') or 'Belirtilmemiş').strip() or 'Belirtilmemiş'
                marka_groups.setdefault(key, []).append(item)

            sub_col_keys   = ['ad', 'kategori', 'adet', 'konum', 'personel', 'durum']
            sub_headers    = ["Malzeme Adı", "Kategori", "Adet", "Konum", "Zimmet Sorumlusu", "Durum"]
            sub_col_widths = [60*mm, 30*mm, 15*mm, 35*mm, 30*mm, 20*mm]

            build_group_section(marka_groups, colors.Color(0.20, 0.35, 0.25), sub_headers, sub_col_widths, page_w)

            doc.build(elements)
            os.startfile(dosya_yolu)
            print(json.dumps({"success": True, "path": dosya_yolu}))
            return
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
