import sys
import json
import os
import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, KeepTogether
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

# Reconfigure stdout for utf-8
try:
    if sys.stdout.encoding != 'utf-8':
        sys.stdout.reconfigure(encoding='utf-8')
except:
    pass

# Helper logger
def debug_log(msg):
    try:
        with open('C:\\Users\\hakan\\Desktop\\arsiv_debug.txt', 'a', encoding='utf-8') as f:
            f.write(f"{datetime.datetime.now()}: {msg}\n")
    except:
        pass

def register_fonts():
    font_name = "Helvetica"
    try:
        # Windows Fonts
        arial_path = os.path.join(os.environ['WINDIR'], 'Fonts', 'arial.ttf')
        if os.path.exists(arial_path):
            pdfmetrics.registerFont(TTFont('Arial', arial_path))
            # Bold for Arial
            arial_bd_path = os.path.join(os.environ['WINDIR'], 'Fonts', 'arialbd.ttf')
            if os.path.exists(arial_bd_path):
                pdfmetrics.registerFont(TTFont('Arial-Bold', arial_bd_path))
            font_name = 'Arial'
    except Exception as e:
        debug_log(f"Font hatası: {str(e)}")
        pass
    return font_name

def get_story(data, font_name, rapor_tipi):
    liste = data.get('kayitlar', [])
    komisyon = data.get('komisyon', {})
    debug_log(f"Komisyon Data: {json.dumps(komisyon, ensure_ascii=False)}")
    kaymakam_adi = komisyon.get('kaymakam', '') or ''
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Styles
    s_title = ParagraphStyle('Title', parent=styles['Normal'], fontName=font_name + '-Bold' if font_name == 'Arial' else font_name, fontSize=14, alignment=1, spaceAfter=10, leading=18)
    s_header = ParagraphStyle('Header', parent=styles['Normal'], fontName=font_name + '-Bold' if font_name == 'Arial' else font_name, fontSize=8, alignment=1)
    s_cell = ParagraphStyle('Cell', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=1)
    s_cell_left = ParagraphStyle('CellLeft', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=0)
    s_label = ParagraphStyle('Label', parent=styles['Normal'], fontName=font_name, fontSize=24, alignment=1, leading=28)
    s_label_sm = ParagraphStyle('LabelSm', parent=styles['Normal'], fontName=font_name, fontSize=12, alignment=1)
    
    # --- RAPOR TİPİNE GÖRE İÇERİK ---
    if rapor_tipi == 'LISTE':
        elements.append(Paragraph(f"<b>DİJİTAL ARŞİV YÖNETİM SİSTEMİ - ENVANTER LİSTESİ</b>", s_title))
        elements.append(Spacer(1, 5*mm))

        headers = [Paragraph(x, s_header) for x in ["SIRA", "KLASÖR\nADETİ", "KLASÖR ADI / KONUSU", "DOSYA\nKODU", "TİPİ", "YILI", "ARALIK\n(BAŞ-BİTİŞ)", "SAKLAMA\nSÜRESİ", "AÇIKLAMA"]]
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

        cw = [10*mm, 15*mm, 85*mm, 20*mm, 20*mm, 15*mm, 25*mm, 15*mm, 45*mm]
        t = Table(table_data, colWidths=cw, repeatRows=1)
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), font_name),
            ('FONTSIZE', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        elements.append(t)

    elif rapor_tipi == 'IMHA':
        elements.append(Paragraph(f"<b>İMHA EDİLECEK ARŞİV MALZEMESİ LİSTESİ</b>", s_title))
        elements.append(Spacer(1, 5*mm))
        
        if not liste:
            elements.append(Paragraph("İmhalık kayıt bulunamadı.", s_cell))
        else:
            headers = [Paragraph(x, s_header) for x in ["SIRA", "KLASÖR ADETİ", "KLASÖR ADI", "YILI", "SAKLAMA SÜRESİ", "İMHA GEREKÇESİ"]]
            table_data = [headers]
            
            for idx, item in enumerate(liste, 1):
                yil_ham = str(item.get('yili', ''))
                yil_duzgun = yil_ham.split('.')[0] if yil_ham else '0'
                yil = int(yil_duzgun)
                sure = int(item.get('saklama_suresi') or 0)
                simdiki_yil = datetime.datetime.now().year
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
            t.setStyle(TableStyle([
                ('FONTNAME', (0,0), (-1,-1), font_name),
                ('GRID', (0,0), (-1,-1), 0.5, colors.black),
                ('BACKGROUND', (0,0), (-1,0), colors.red),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
            ]))
            elements.append(t)

    # --- ETİKET İÇİN ÖZEL DURUM (İmza Yok) ---
    if rapor_tipi == 'ETIKET':
        # Etiket mantığı tamamen ayrı, imza bölümü yok
        return elements # Etiket listesi döner, imza eklenmez

    # --- İMZA BÖLÜMÜ (SON SAYFAYA EKLENİR) ---
    if rapor_tipi in ['LISTE', 'IMHA']:
        elements.append(Spacer(1, 20*mm))
        
        # KeepTogether için liste
        sig_elements = []

        # KOMİSYON ÜYELERİ
        # Üst Satır
        baskan = komisyon.get('baskan', '')
        uye1 = komisyon.get('uye1', '')
        uye2 = komisyon.get('uye2', '')
        
        # Split names just once to be safe
        b_parts = baskan.split(' - ')
        b_name = b_parts[0] if len(b_parts) > 0 else ''
        b_title = b_parts[1] if len(b_parts) > 1 else ''

        u1_parts = uye1.split(' - ')
        u1_name = u1_parts[0] if len(u1_parts) > 0 else ''
        u1_title = u1_parts[1] if len(u1_parts) > 1 else ''

        u2_parts = uye2.split(' - ')
        u2_name = u2_parts[0] if len(u2_parts) > 0 else ''
        u2_title = u2_parts[1] if len(u2_parts) > 1 else ''

        sig_data = [
            ["KOMİSYON BAŞKANI", "ÜYE", "ÜYE"],
            [b_name, u1_name, u2_name],
            [b_title, u1_title, u2_title]
        ]
        
        t_sig = Table(sig_data, colWidths=[80*mm, 80*mm, 80*mm])
        t_sig.setStyle(TableStyle([
            ('ALIGN',(0,0),(-1,-1),'CENTER'),
            ('FONTNAME',(0,0),(-1,-1), font_name),
            ('FONTSIZE',(0,0),(-1,-1), 10),
            ('FONTWEIGHT',(0,0),(2,0),'BOLD'), # Row 1 header
            ('TOPPADDING',(1,0),(-1,-1), 25), # İsimler için boşluk arttırıldı
            ('BOTTOMPADDING',(0,0),(-1,-1), 0),
            ('LEFTPADDING',(0,0),(-1,-1), 0),
            ('RIGHTPADDING',(0,0),(-1,-1), 0),
        ]))
        sig_elements.append(t_sig)
        
        # OLUR BÖLÜMÜ (KAYMAKAM)
        if kaymakam_adi:
            sig_elements.append(Spacer(1, 10*mm)) # Boşluk
            today = datetime.datetime.now().strftime("%d.%m.%Y")
            
            olur_data = [
                ["OLUR"],
                [today],
                [kaymakam_adi],
                ["Kaymakam"]
            ]
            t_olur = Table(olur_data, colWidths=[60*mm])
            t_olur.setStyle(TableStyle([
                ('ALIGN',(0,0),(-1,-1),'CENTER'),
                ('FONTNAME',(0,0),(-1,-1), font_name),
                ('FONTSIZE',(0,0),(-1,-1), 11),
                ('FONTWEIGHT',(0,0),(0,0),'BOLD'), # OLUR
                ('BOTTOMPADDING',(0,0),(-1,-1), 2),
                ('TOPPADDING',(2,0),(2,0), 10), # İsim boşluğu
            ]))
            sig_elements.append(t_olur)

        # Tüm imza bloğunu tek parça tut
        elements.append(KeepTogether(sig_elements))

    return elements

def draw_footer_initials(canvas, doc, total_pages, komisyon, font_name):
    # Eğer tek sayfa ise footer'a gerek yok çünkü imza var.
    # Eğer çoklu sayfa ise: Son sayfa hariç diğerlerine paraf atılacak.
    if total_pages <= 1:
        return

    if doc.page < total_pages:
        canvas.saveState()
        canvas.setFont(font_name, 8)
        
        baskan = komisyon.get('baskan', '').split(' - ')[0]
        uye1 = komisyon.get('uye1', '').split(' - ')[0]
        uye2 = komisyon.get('uye2', '').split(' - ')[0]
        
        text = f"Bşk: {baskan}    Üye: {uye1}    Üye: {uye2}"
        
        canvas.drawCentredString(landscape(A4)[0]/2, 10*mm, text)
        canvas.restoreState()

def create_pdf(data_json):
    debug_log("create_pdf basladi")
    try:
        if isinstance(data_json, bytes):
            data_json = data_json.decode('utf-8')
            
        data = json.loads(data_json)
        rapor_tipi = data.get('rapor_tipi', 'LISTE')
        komisyon = data.get('komisyon', {})
        debug_log(f"Rapor Tipi: {rapor_tipi}")
        
        font_name = register_fonts()
        debug_log(f"Font: {font_name}")
        
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d%m%Y_%H%M')
        
        filename_prefix = "Arsiv_Listesi"
        if rapor_tipi == 'IMHA': filename_prefix = "Imhalik_Arsiv"
        elif rapor_tipi == 'ETIKET': filename_prefix = "Arsiv_Etiketleri"
        
        dosya_adi = f"{filename_prefix}_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)
        debug_log(f"Dosya Yolu: {dosya_yolu}")

        story = get_story(data, font_name, rapor_tipi)
        debug_log(f"Story olusturuldu. Eleman sayisi: {len(story)}")
        
        if rapor_tipi == 'ETIKET':
             # Etiket mantığı önceki koddan kopyalanmalı
             doc = SimpleDocTemplate(dosya_yolu, pagesize=A4, rightMargin=5*mm, leftMargin=5*mm, topMargin=5*mm, bottomMargin=5*mm)
             
             elements = []
             liste = data.get('kayitlar', [])
             s_label = ParagraphStyle('Label', parent=getSampleStyleSheet()['Normal'], fontName=font_name, fontSize=24, alignment=1, leading=28)
             s_label_sm = ParagraphStyle('LabelSm', parent=getSampleStyleSheet()['Normal'], fontName=font_name, fontSize=12, alignment=1)
             
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
             if data_rows:
                t = Table(data_rows, colWidths=[95*mm, 95*mm], rowHeights=280*mm)
                t.setStyle(TableStyle([('GRID', (0,0), (-1,-1), 1, colors.black), ('VALIGN', (0,0), (-1,-1), 'TOP'), ('ALIGN', (0,0), (-1,-1), 'CENTER')]))
                elements.append(t)
             
             doc.build(elements)
        
        else:
            # 1. PASS
            debug_log("Pass 1 basliyor")
            dummy = BytesIO()
            doc_pass1 = SimpleDocTemplate(dummy, pagesize=landscape(A4), rightMargin=5*mm, leftMargin=5*mm, topMargin=10*mm, bottomMargin=10*mm)
            doc_pass1.build(story)
            total_pages = doc_pass1.page
            debug_log(f"Pass 1 bitti. Sayfa sayisi: {total_pages}")
            
            # 2. PASS
            debug_log("Pass 2 hazirlik")
            story_final = get_story(data, font_name, rapor_tipi)
            doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=5*mm, leftMargin=5*mm, topMargin=10*mm, bottomMargin=10*mm)
            
            def on_page_cb(canvas, doc):
                draw_footer_initials(canvas, doc, total_pages, komisyon, font_name)
            
            debug_log("Pass 2 basliyor")
            doc.build(story_final, onFirstPage=on_page_cb, onLaterPages=on_page_cb)
            debug_log("Pass 2 bitti")

        print(json.dumps({"success": True, "path": dosya_yolu}))
        debug_log("Islem basarili")

    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        debug_log(f"HATA: {str(e)}\n{tb}")
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    debug_log("Script basladi")
    try:
        if sys.stdin.encoding != 'utf-8':
             sys.stdin.reconfigure(encoding='utf-8')
    except: pass
    
    try:
        input_data = sys.stdin.read()
        if input_data:
            debug_log(f"Input veri uzunlugu: {len(input_data)}")
            create_pdf(input_data)
        else:
             debug_log("Input bos")
    except Exception as e:
        debug_log(f"Stdin hatasi: {str(e)}")
        print(json.dumps({"success": False, "error": "Veri okuma hatası"}))