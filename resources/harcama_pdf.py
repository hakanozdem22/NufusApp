import sys
import json
import os
import datetime
from reportlab.lib.pagesizes import A4
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
        ozet = data.get('ozet', {})
        donem_str = data.get('donem', '')
        rapor_turu = data.get('rapor_turu', 'TUMU') # Yeni parametre
        
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d-%m-%Y_%H-%M-%S')
        
        # Dosya ismine rapor türünü ekleyelim
        tur_ek = ""
        if rapor_turu == "GELIR": tur_ek = "_Sadece_Gelir"
        elif rapor_turu == "GIDER": tur_ek = "_Sadece_Gider"
        
        dosya_adi = f"Finansal_Rapor{tur_ek}_{tarih_str}.pdf"
        dosya_yolu = os.path.join(desktop, dosya_adi)

        # Dikey A4 (Genişlik 210mm - 20mm Kenar Boşluğu = 190mm Kullanılabilir Alan)
        doc = SimpleDocTemplate(dosya_yolu, pagesize=A4, rightMargin=10*mm, leftMargin=10*mm, topMargin=10*mm, bottomMargin=10*mm)
        elements = []
        
        # Font
        font_name = "Helvetica"
        try:
            arial_path = os.path.join(os.environ['WINDIR'], 'Fonts', 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path))
                font_name = 'Arial'
        except: pass

        styles = getSampleStyleSheet()
        baslik_stil = ParagraphStyle('Baslik', parent=styles['Normal'], fontName=font_name, fontSize=16, leading=20, alignment=1, spaceAfter=5)
        alt_baslik_stil = ParagraphStyle('Alt', parent=styles['Normal'], fontName=font_name, fontSize=12, alignment=1, spaceAfter=15, textColor=colors.gray)
        
        # --- BAŞLIK ---
        baslik_metni = "PERSONEL HARCAMA VE GELİR RAPORU"
        if rapor_turu == "GELIR": baslik_metni = "PERSONEL GELİR RAPORU"
        if rapor_turu == "GIDER": baslik_metni = "PERSONEL GİDER RAPORU"

        elements.append(Paragraph(baslik_metni, baslik_stil))
        elements.append(Paragraph(f"DÖNEM: {donem_str}", alt_baslik_stil))

        # --- ÖZET TABLOSU (Sayfaya Tam Yayılacak) ---
        # 190mm / 4 = 47.5mm her sütun
        ozet_cols = [47.5*mm, 47.5*mm, 47.5*mm, 47.5*mm]
        
        ozet_data = [
            ['DEVİR', 'GELİR', 'GİDER', 'KASA (DURUM)'],
            [f"{ozet.get('devir',0):.2f} TL", f"+{ozet.get('gelir',0):.2f} TL", f"-{ozet.get('gider',0):.2f} TL", f"{ozet.get('kasa',0):.2f} TL"]
        ]
        
        t_ozet = Table(ozet_data, colWidths=ozet_cols)
        t_ozet.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), font_name),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('FONTWEIGHT', (0,0), (-1,0), 'BOLD'),
            ('TEXTCOLOR', (1,1), (1,1), colors.green),
            ('TEXTCOLOR', (2,1), (2,1), colors.red),
            ('TEXTCOLOR', (3,1), (3,1), colors.blue),
            ('FONTSIZE', (0,1), (-1,1), 11),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(t_ozet)
        elements.append(Spacer(1, 10*mm))

        # --- DETAYLI LİSTE ---
        elements.append(Paragraph("Detaylı Hareket Dökümü", ParagraphStyle('h2', parent=styles['Normal'], fontName=font_name, fontSize=12, spaceAfter=5, fontName_bold=True)))

        headers = ['Tarih', 'Tür', 'Kategori', 'Açıklama', 'Tutar']
        table_data = [headers]
        
        normal_stil = ParagraphStyle('cell', parent=styles['Normal'], fontName=font_name, fontSize=9)
        
        for item in liste:
            tarih = item.get('tarih', '')
            try: tarih = datetime.datetime.strptime(tarih, '%Y-%m-%d').strftime('%d.%m.%Y')
            except: pass
            
            tur = item.get('tur', '')
            tutar = float(item.get('tutar', 0))
            tutar_str = f"{tutar:.2f} TL"
            
            if tur == 'GIDER': tutar_str = f"-{tutar_str}"
            else: tutar_str = f"+{tutar_str}"

            row = [
                tarih,
                tur,
                Paragraph(item.get('kategori', ''), normal_stil),
                Paragraph(item.get('baslik', ''), normal_stil),
                tutar_str
            ]
            table_data.append(row)

        # --- SÜTUN GENİŞLİKLERİ (HİZALAMA AYARI) ---
        # Toplam genişlik: 190mm olmalı
        # Tarih: 25mm, Tür: 20mm, Kategori: 35mm, Açıklama: 80mm, Tutar: 30mm = 190mm
        col_widths = [25*mm, 20*mm, 35*mm, 80*mm, 30*mm]
        
        t = Table(table_data, colWidths=col_widths, repeatRows=1)
        
        ts = TableStyle([
            ('FONTNAME', (0,0), (-1,-1), font_name),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),       # Genel ortala
            ('ALIGN', (3,1), (3,-1), 'LEFT'),         # Açıklama sola dayalı
            ('ALIGN', (4,1), (4,-1), 'RIGHT'),        # Tutar sağa dayalı
            ('GRID', (0,0), (-1,-1), 0.5, colors.black),
            ('FONTWEIGHT', (0,0), (-1,0), 'BOLD'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ])
        
        for i, row in enumerate(liste):
            idx = i + 1
            if row.get('tur') == 'GELIR':
                ts.add('TEXTCOLOR', (4, idx), (4, idx), colors.green)
            else:
                ts.add('TEXTCOLOR', (4, idx), (4, idx), colors.red)
                
        t.setStyle(ts)
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