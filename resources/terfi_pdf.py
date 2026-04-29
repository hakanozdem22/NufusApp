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
        
        # Use desktop_path from Electron, fallback to USERPROFILE/Desktop
        desktop = data.get('desktop_path') or os.path.join(os.environ['USERPROFILE'], 'Desktop')
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
        # SENARYO 0: RESMİ DERECE TERFİ LİSTESİ (PDF'TEKİ FORMAT)
        # =================================================================================
        if rapor_tipi == 'DERECE_TERFI_LISTE':
            dosya_adi = f"Derece_Terfi_Listesi_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)
            doc = SimpleDocTemplate(
                dosya_yolu, pagesize=landscape(A4),
                rightMargin=12*mm, leftMargin=12*mm,
                topMargin=10*mm, bottomMargin=10*mm
            )

            donem_bas  = data.get('donem_bas', '')
            donem_bit  = data.get('donem_bit', '')
            teklif_ad  = data.get('teklif_eden_ad', '')
            teklif_unv = data.get('teklif_eden_unvan', 'İlçe Nüfus Müdürü')
            onay_ad    = data.get('onaylayan_ad', '')
            onay_unv   = data.get('onaylayan_unvan', 'Kaymakam')
            onay_tarih = data.get('onay_tarihi', '')

            def fmt_tarih(iso):
                try: return datetime.datetime.strptime(iso, '%Y-%m-%d').strftime('%d.%m.%Y')
                except: return iso

            donem_str = f"{fmt_tarih(donem_bas)} - {fmt_tarih(donem_bit)}" if donem_bas else ''

            s_title   = ParagraphStyle('T', parent=styles['Normal'], fontName=font_name, fontSize=9,  alignment=1, leading=13)
            s_donem   = ParagraphStyle('D', parent=styles['Normal'], fontName=font_name, fontSize=9,  alignment=1, leading=13)
            s_th      = ParagraphStyle('TH', parent=styles['Normal'], fontName=font_name, fontSize=7, alignment=1, leading=9)
            s_td      = ParagraphStyle('TD', parent=styles['Normal'], fontName=font_name, fontSize=8, alignment=1, leading=10)
            s_td_l    = ParagraphStyle('TDL', parent=styles['Normal'], fontName=font_name, fontSize=8, alignment=0, leading=10)
            s_imza    = ParagraphStyle('IM', parent=styles['Normal'], fontName=font_name, fontSize=8, alignment=1, leading=12)

            # ÜST BAŞLIK BLOĞU (başlık sol, dönem sağ — tablo ile)
            baslik_metni = (
                "KAPAKLI KAYMAKAMLĞI İLÇE NÜFUS MÜDÜRLÜĞÜ PERSONELİNE AİT\n"
                "DERECE TERFİ LİSTESİ"
            )
            usttable = Table(
                [[Paragraph(f"<b>{baslik_metni}</b>", s_title),
                  Paragraph(f"<b>AİT OLDUĞU AY</b><br/>{donem_str}", s_donem)]],
                colWidths=[180*mm, 70*mm]
            )
            usttable.setStyle(TableStyle([
                ('BOX',    (0,0), (-1,-1), 0.7, colors.black),
                ('INNERGRID', (0,0), (-1,-1), 0.7, colors.black),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('TOPPADDING',    (0,0), (-1,-1), 5),
                ('BOTTOMPADDING', (0,0), (-1,-1), 5),
                ('FONTNAME', (0,0), (-1,-1), font_name),
            ]))
            elements.append(usttable)

            # ANA TABLO
            headers = [
                Paragraph('<b>SIRA</b>', s_th),
                Paragraph('<b>ADI SOYADI</b>', s_th),
                Paragraph('<b>SİCİL NO</b>', s_th),
                Paragraph('<b>GÖREV YERİ ÜNVANI</b>', s_th),
                Paragraph('<b>KADRO</b>', s_th),
                Paragraph('<b>ALMAKTA</b>', s_th),
                Paragraph('<b>EMEKLİ MÜKTESEP</b>', s_th),
                Paragraph('<b>KAZANILAN</b>', s_th),
                Paragraph('<b>GEÇERLİLİK</b>', s_th),
                Paragraph('<b>AÇIKLAMALAR</b>', s_th),
            ]
            # Toplam kullanılabilir: ~255mm (landscape A4 297mm - 24mm margin)
            col_w = [10*mm, 35*mm, 18*mm, 55*mm, 14*mm, 18*mm, 22*mm, 18*mm, 24*mm, 41*mm]
            table_data = [headers]

            for idx, p in enumerate(liste, 1):
                gecerlilik_str = fmt_tarih(p.get('gecerlilik', ''))
                table_data.append([
                    Paragraph(str(idx), s_td),
                    Paragraph(str(p.get('ad_soyad', '')).upper(), s_td_l),
                    Paragraph(str(p.get('sicil_no', '')), s_td),
                    Paragraph(str(p.get('gorev_yeri_unvani', '')), s_td_l),
                    Paragraph(str(p.get('kadro', '')), s_td),
                    Paragraph(str(p.get('almakta', '')), s_td),
                    Paragraph(str(p.get('emekli_muktesep', '')), s_td),
                    Paragraph(str(p.get('kazanilan', '')), s_td),
                    Paragraph(gecerlilik_str, s_td),
                    Paragraph(str(p.get('aciklamalar', '')), s_td_l),
                ])

            t = Table(table_data, colWidths=col_w, repeatRows=1)
            t.setStyle(TableStyle([
                ('FONTNAME',  (0,0), (-1,-1), font_name),
                ('GRID',      (0,0), (-1,-1), 0.5, colors.black),
                ('ALIGN',     (0,0), (-1,-1), 'CENTER'),
                ('VALIGN',    (0,0), (-1,-1), 'MIDDLE'),
                ('BACKGROUND',(0,0), (-1,0),  colors.white),
                ('TOPPADDING',    (0,0), (-1,-1), 3),
                ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                ('LEFTPADDING',   (0,0), (-1,-1), 2),
                ('RIGHTPADDING',  (0,0), (-1,-1), 2),
            ]))
            elements.append(t)

            # İMZA BLOĞU
            elements.append(Spacer(1, 8*mm))
            onay_tarih_str = fmt_tarih(onay_tarih) if onay_tarih else '    /    /        '
            imza_data = [[
                Paragraph(f"Teklif Eden:<br/><br/><b>{teklif_ad}</b><br/>{teklif_unv}", s_imza),
                Paragraph('', s_imza),
                Paragraph(f"Onaylayan : {onay_tarih_str}<br/><br/><b>{onay_ad}</b><br/>{onay_unv}", s_imza),
            ]]
            imza_t = Table(imza_data, colWidths=[70*mm, 115*mm, 70*mm])
            imza_t.setStyle(TableStyle([
                ('FONTNAME', (0,0), (-1,-1), font_name),
                ('ALIGN',    (0,0), (-1,-1), 'CENTER'),
                ('VALIGN',   (0,0), (-1,-1), 'TOP'),
            ]))
            elements.append(imza_t)

            doc.build(elements)
            print(json.dumps({"success": True, "path": dosya_yolu}))
            return

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