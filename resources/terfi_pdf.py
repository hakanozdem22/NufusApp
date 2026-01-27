import sys
import json
import os
import datetime
from reportlab.lib.pagesizes import A4, landscape, portrait
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
            
        data = json.loads(data_json)
        liste = data.get('liste', [])
        rapor_tipi = data.get('tip', 'DURUM') # 'DURUM' veya 'TERFI'
        
        desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
        tarih_str = datetime.datetime.now().strftime('%d%m%Y_%H%M')
        
        # Font
        font_name = "Helvetica"
        try:
            arial_path = os.path.join(os.environ['WINDIR'], 'Fonts', 'arial.ttf')
            if os.path.exists(arial_path):
                pdfmetrics.registerFont(TTFont('Arial', arial_path)); font_name = 'Arial'
        except: pass

        elements = []
        styles = getSampleStyleSheet()
        s_header = ParagraphStyle('Header', parent=styles['Normal'], fontName=font_name, fontSize=12, alignment=1, leading=16)
        s_cell = ParagraphStyle('Cell', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=1)
        s_cell_left = ParagraphStyle('CellLeft', parent=styles['Normal'], fontName=font_name, fontSize=9, alignment=0)

        # =================================================================================
        # SENARYO 1: TERFİ TEKLİF LİSTESİ (SADECE SEÇİLENLER - YATAY - RESMİ FORMAT)
        # =================================================================================
        if rapor_tipi == 'TERFI':
            dosya_adi = f"Terfi_Teklif_Listesi_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)
            doc = SimpleDocTemplate(dosya_yolu, pagesize=landscape(A4), rightMargin=10*mm, leftMargin=10*mm, topMargin=10*mm, bottomMargin=10*mm)

            # Başlık
            elements.append(Paragraph(f"<b>T.C.<br/>KAPAKLI KAYMAKAMLIĞI<br/>İLÇE NÜFUS MÜDÜRLÜĞÜ PERSONELİNE AİT TERFİ LİSTESİ</b>", s_header))
            elements.append(Spacer(1, 10*mm))

            # Tablo
            # Tablo (Sicil No, Ad Soyad, Ünvanı, Kadro, Ek Gösterge, D/K, Terfi Tarihi, Sonraki Terfi Tarihi)
            # Kaldırılanlar: SIRA, AÇIKLAMALAR, ALMAKTA OLDUĞU D/K (sadece D/K kaldı, muhtemelen Mevcut veya Yeni kastediliyor ama D/K dediği için Mevcut/Yeni birleşik veya sadece Yeni olabilir. Kullanıcı sadece D/K demiş. Genelde mevcut durum listesi gibi. Biz Mevcut D/K basalım veya Yeni?
            # Kullanıcı isteği sıralama: sicil no, ad soyad, ünvanı, kadro, ek gösterge, d/k, terfi tarihi, sonraki terfi tarihi
            
            headers = ["SİCİL NO", "ADI SOYADI", "ÜNVANI", "KADRO", "EK GÖSTERGE", "D / K", "TERFİ\nTARİHİ", "SONRAKİ\nTERFİ"]
            table_data = [headers]

            for idx, p in enumerate(liste, 1):
                mevcut_dk = f"{p.get('derece','-')}/{p.get('kademe','-')}"
                # Yeni D/K mı? Kullanıcı sadece D/K dedi. Genelde terfi listesi ise Eskisi ve Yenisi olur. 
                # Ama istenen listede tek bir D/K sütunu var. Biz MEVCUT olanı basalım, çünkü terfi tarihi var.
                # Veya terfi listesi bu, o zaman YENİ (KAZANILAN) D/K daha mantıklı.
                # Önceki kodda "ALMAKTA OLDUĞU" ve "KAZANILAN" vardı.
                # Şimdi tek sütun. Muhtemelen mevcut durumu gösteren bir liste isteniyor veya yeni hak edileni.
                # Güvenli yol: Mevcut Derece/Kademe yazalım.
                
                tarih = p.get('terfi_tarihi', '')
                try: tarih = datetime.datetime.strptime(tarih, '%Y-%m-%d').strftime('%d.%m.%Y')
                except: pass
                
                sonraki_tarih = p.get('sonraki_terfi', '')
                # Formatlı değilse formatla (genelde YYYY-MM-DD gelir)
                try: sonraki_tarih = datetime.datetime.strptime(sonraki_tarih, '%Y-%m-%d').strftime('%d.%m.%Y')
                except: pass

                row = [
                    p.get('sicil_no',''),
                    Paragraph(p.get('ad_soyad','').upper(), s_cell_left),
                    Paragraph(p.get('unvan',''), s_cell),
                    p.get('kadro',''),
                    p.get('ek_gosterge',''),
                    mevcut_dk,
                    tarih,
                    sonraki_tarih
                ]
                table_data.append(row)

            # Genişlikler (Toplam ~277mm)
            # Sicil(25), Ad(50), Unvan(40), Kadro(30), Ek(25), DK(20), Terfi(30), Sonraki(30) = 250mm
            cw = [25*mm, 60*mm, 45*mm, 30*mm, 25*mm, 20*mm, 30*mm, 35*mm]
            t = Table(table_data, colWidths=cw, repeatRows=1)
            t.setStyle(TableStyle([
                ('FONTNAME', (0,0), (-1,-1), font_name),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('GRID', (0,0), (-1,-1), 0.5, colors.black),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                ('FONTWEIGHT', (0,0), (-1,0), 'BOLD'),
                ('ALIGN', (1,1), (1,-1), 'LEFT'), # Adı Soyadı sola dayalı
            ]))
            elements.append(t)
            
            # İmza bölümü kaldırıldı.

        # =================================================================================
        # SENARYO 2: PERSONEL DURUM LİSTESİ (TÜMÜ - DİKEY - LİSTE FORMATI)
        # =================================================================================
        else: 
            dosya_adi = f"Personel_Durum_Listesi_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)
            doc = SimpleDocTemplate(dosya_yolu, pagesize=portrait(A4), rightMargin=10*mm, leftMargin=10*mm, topMargin=10*mm, bottomMargin=10*mm)

            elements.append(Paragraph(f"<b>PERSONEL DERECE/KADEME DURUM LİSTESİ</b>", s_header))
            elements.append(Spacer(1, 5*mm))

            headers = ["S.NO", "ADI SOYADI", "ÜNVAN", "SİCİL", "MEVCUT D/K", "SONRAKİ D/K", "TERFİ TARİHİ"]
            table_data = [headers]

            for idx, p in enumerate(liste, 1):
                tarih = p.get('terfi_tarihi', '')
                try: tarih = datetime.datetime.strptime(tarih, '%Y-%m-%d').strftime('%d.%m.%Y')
                except: pass
                
                row = [
                    str(idx),
                    p.get('ad_soyad',''),
                    p.get('unvan',''),
                    p.get('sicil_no',''),
                    f"{p.get('derece','')}/{p.get('kademe','')}",
                    p.get('sonraki_terfi','-'),
                    tarih
                ]
                table_data.append(row)

            t = Table(table_data, colWidths=[10*mm, 50*mm, 35*mm, 25*mm, 25*mm, 25*mm, 25*mm], repeatRows=1)
            t.setStyle(TableStyle([
                ('FONTNAME', (0,0), (-1,-1), font_name),
                ('FONTSIZE', (0,0), (-1,-1), 10),
                ('GRID', (0,0), (-1,-1), 0.5, colors.black),
                ('BACKGROUND', (0,0), (-1,0), colors.lightgrey),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('ALIGN', (1,1), (1,-1), 'LEFT'), # İsimler sola dayalı
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('FONTWEIGHT', (0,0), (-1,0), 'BOLD'),
            ]))
            elements.append(t)

        doc.build(elements)
        # os.startfile(dosya_yolu) # Frontend tarafında açılacak
        print(json.dumps({"success": True, "path": dosya_yolu}))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    try: sys.stdin.reconfigure(encoding='utf-8')
    except: pass
    input_data = sys.stdin.read()
    if input_data:
        create_pdf(input_data)