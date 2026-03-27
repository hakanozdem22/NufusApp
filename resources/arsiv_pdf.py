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
    s_header = ParagraphStyle('Header', parent=styles['Normal'], fontName=font_name + '-Bold' if font_name == 'Arial' else font_name, fontSize=7, alignment=1, leading=8, spaceBefore=0, spaceAfter=0)
    s_cell = ParagraphStyle('Cell', parent=styles['Normal'], fontName=font_name, fontSize=7, alignment=1, leading=8, spaceBefore=0, spaceAfter=0)
    s_cell_left = ParagraphStyle('CellLeft', parent=styles['Normal'], fontName=font_name, fontSize=7, alignment=0, leading=8, spaceBefore=0, spaceAfter=0)
    s_label = ParagraphStyle('Label', parent=styles['Normal'], fontName=font_name, fontSize=24, alignment=1, leading=28)
    s_label_sm = ParagraphStyle('LabelSm', parent=styles['Normal'], fontName=font_name, fontSize=12, alignment=1)
    
    # --- RAPOR TİPİNE GÖRE İÇERİK ---
    if rapor_tipi == 'LISTE':
        elements.append(Paragraph(f"<b>EK-1 Malzeme Tespit, Değerlendirme ve Saklama Formu</b>", s_title))
        elements.append(Spacer(1, 5*mm))

        headers = [Paragraph(x, s_header) for x in ["SIRA", "KLASÖR ADI / KONUSU", "KLASÖR\nADETİ", "DOSYA\nKODU", "TİPİ", "YILI", "ARALIK\n(BAŞ-BİTİŞ)", "SAKLAMA\nSÜRESİ", "AÇIKLAMA"]]
        table_data = [headers]

        for idx, item in enumerate(liste, 1):
            yil_ham = str(item.get('yili', ''))
            yil_duzgun = yil_ham.split('.')[0] if yil_ham else '-'

            row = [
                str(idx),
                Paragraph(item.get('klasor_adi', ''), s_cell_left),
                str(item.get('evrak_sayisi', '-')),
                item.get('dosyalama_kodu', ''),
                item.get('tipi', ''),
                yil_duzgun,
                f"{item.get('bas_no','')} - {item.get('bitis_no','')}",
                f"{item.get('saklama_suresi','')} Yıl",
                Paragraph(item.get('aciklama', '') or item.get('konum', ''), s_cell)
            ]
            table_data.append(row)

        cw = [10*mm, 85*mm, 15*mm, 20*mm, 20*mm, 15*mm, 25*mm, 15*mm, 45*mm]
        t = Table(table_data, colWidths=cw, repeatRows=1)
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), font_name),
            ('FONTSIZE', (0,0), (-1,-1), 7),
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        elements.append(t)

    elif rapor_tipi == 'IMHA':
        elements.append(Paragraph(f"<b>İMHALIK OLANLAR LİSTESİ</b>", s_title))
        elements.append(Spacer(1, 5*mm))
        
        if not liste:
            elements.append(Paragraph("İmhalık kayıt bulunamadı.", s_cell))
        else:
            headers = [Paragraph(x, s_header) for x in ["SIRA", "KLASÖR ADETİ", "KLASÖR ADI", "YILI", "SAKLAMA SÜRESİ", "İMHA GEREKÇESİ"]]
            table_data = [headers]
            
            real_idx = 1
            for item in liste:
                yil_ham = str(item.get('yili', ''))
                yil_duzgun = yil_ham.split('.')[0] if yil_ham else ''
                
                try:
                    yil = int(yil_duzgun)
                except ValueError:
                    continue
                
                try:
                    sure = int(item.get('saklama_suresi') or '')
                except ValueError:
                    continue
                
                simdiki_yil = datetime.datetime.now().year
                gerekce = "Komisyon Kararı ile"
                if (yil + sure) < simdiki_yil:
                    gerekce = "Saklama Süresi Doldu"

                row = [
                    str(real_idx),
                    str(item.get('evrak_sayisi', '-')),
                    Paragraph(item.get('klasor_adi', ''), s_cell_left),
                    yil_duzgun,
                    f"{sure} Yıl",
                    gerekce
                ]
                table_data.append(row)
                real_idx += 1
            
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
        elements.append(Spacer(1, 7*mm))
        
        # KeepTogether için liste
        sig_elements = []

        # KOMİSYON ÜYELERİ
        baskan_obj = komisyon.get('baskan', {})
        uye1_obj = komisyon.get('uye1', {})
        uye2_obj = komisyon.get('uye2', {})
        
        # Eğer veri eski formatta (string) gelirse diye fallback (gerçi yeni sistemde hep obje gelecek)
        if isinstance(baskan_obj, str):
            parts = baskan_obj.split(' - ')
            b_name = parts[0] if len(parts) > 0 else ''
            b_title = parts[1] if len(parts) > 1 else ''
        else:
            b_name = baskan_obj.get('ad_soyad', '')
            b_title = baskan_obj.get('unvan', '')

        if isinstance(uye1_obj, str):
            parts = uye1_obj.split(' - ')
            u1_name = parts[0] if len(parts) > 0 else ''
            u1_title = parts[1] if len(parts) > 1 else ''
        else:
            u1_name = uye1_obj.get('ad_soyad', '')
            u1_title = uye1_obj.get('unvan', '')

        if isinstance(uye2_obj, str):
            parts = uye2_obj.split(' - ')
            u2_name = parts[0] if len(parts) > 0 else ''
            u2_title = parts[1] if len(parts) > 1 else ''
        else:
            u2_name = uye2_obj.get('ad_soyad', '')
            u2_title = uye2_obj.get('unvan', '')

        sig_data = [
            ["KOMİSYON BAŞKANI", "ÜYE", "ÜYE"],
            [b_name, u1_name, u2_name],
            [b_title, u1_title, u2_title]
        ]
        
        t_sig = Table(sig_data, colWidths=[80*mm, 80*mm, 80*mm])
        t_sig.setStyle(TableStyle([
            ('ALIGN',(0,0),(-1,-1),'CENTER'),
            ('FONTNAME',(0,0),(-1,-1), font_name),
            ('FONTSIZE',(0,0),(-1,-1), 7),
            ('FONTWEIGHT',(0,0),(2,0),'BOLD'), # Row 1 header
            ('TOPPADDING',(0,1),(-1,1), 1), # İsimler için makul boşluk (Satır 1)
            ('TOPPADDING',(0,2),(-1,2), 1),  # Unvanlar isimlere yakın (Satır 2)
            ('BOTTOMPADDING',(0,0),(-1,-1), 1),
            ('LEFTPADDING',(0,0),(-1,-1), 0),
            ('RIGHTPADDING',(0,0),(-1,-1), 0),
        ]))
        sig_elements.append(t_sig)
        
        # OLUR BÖLÜMÜ (KAYMAKAM)
        if kaymakam_adi:
            sig_elements.append(Spacer(1, 10*mm)) # Boşluk
            today = datetime.datetime.now().strftime("... .%m.%Y")
            
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
                ('FONTSIZE',(0,0),(-1,-1), 7),
                ('FONTWEIGHT',(0,0),(0,0),'BOLD'), # OLUR
                ('BOTTOMPADDING',(0,0),(-1,-1), 2),
                ('TOPPADDING',(2,0),(2,0), 1), # İsim boşluğu
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

    # Footer initials removed as requested
    return

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
        
        # Use desktop_path from Electron, fallback to USERPROFILE/Desktop
        desktop = data.get('desktop_path') or os.path.join(os.environ['USERPROFILE'], 'Desktop')
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