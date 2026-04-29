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
        # SENARYO 0: RESMİ DERECE TERFİ LİSTESİ
        # =================================================================================
        if rapor_tipi == 'DERECE_TERFI_LISTE':
            dosya_adi = f"Derece_Terfi_Listesi_{tarih_str}.pdf"
            dosya_yolu = os.path.join(desktop, dosya_adi)

            # Yatay A4: 297x210, kenar boşlukları 15mm
            SAYFA_GEN = landscape(A4)[0]
            KENAR     = 15 * mm
            KULLAN_GEN = SAYFA_GEN - 2 * KENAR   # ~267mm

            doc = SimpleDocTemplate(
                dosya_yolu, pagesize=landscape(A4),
                rightMargin=KENAR, leftMargin=KENAR,
                topMargin=12*mm, bottomMargin=12*mm
            )

            donem_bas  = data.get('donem_bas', '')
            donem_bit  = data.get('donem_bit', '')
            teklif_ad  = data.get('teklif_eden_ad', '')
            teklif_unv = data.get('teklif_eden_unvan', 'İlçe Nüfus Müdürü')
            onay_ad    = data.get('onaylayan_ad', '')
            onay_unv   = data.get('onaylayan_unvan', 'Kaymakam')
            onay_tarih = data.get('onay_tarihi', '')

            def fmt_tarih(iso):
                try:    return datetime.datetime.strptime(iso, '%Y-%m-%d').strftime('%d.%m.%Y')
                except: return iso

            donem_str = f"{fmt_tarih(donem_bas)} - {fmt_tarih(donem_bit)}" if donem_bas else ''

            # ── Stiller ──────────────────────────────────────────
            GRI_ACIK  = colors.Color(0.92, 0.92, 0.92)
            GRI_KOYU  = colors.Color(0.80, 0.80, 0.80)
            SIYAH     = colors.black

            s_baslik_sol = ParagraphStyle('BS', fontName=font_name, fontSize=10,
                                          alignment=1, leading=15, spaceAfter=0)
            s_baslik_sag = ParagraphStyle('BSG', fontName=font_name, fontSize=10,
                                          alignment=1, leading=14, spaceAfter=0)
            s_th = ParagraphStyle('TH', fontName=font_name, fontSize=8,
                                  alignment=1, leading=10, spaceAfter=0)
            s_td = ParagraphStyle('TD', fontName=font_name, fontSize=9,
                                  alignment=1, leading=11, spaceAfter=0)
            s_td_l = ParagraphStyle('TDL', fontName=font_name, fontSize=9,
                                    alignment=0, leading=11, spaceAfter=0)
            s_imza_l = ParagraphStyle('IL', fontName=font_name, fontSize=9,
                                      alignment=0, leading=13)
            s_imza_r = ParagraphStyle('IR', fontName=font_name, fontSize=9,
                                      alignment=2, leading=13)

            # ── ÜST BAŞLIK TABLOSU ────────────────────────────────
            # Sol hücre geniş (başlık), sağ hücre dar (dönem)
            sol_genis  = KULLAN_GEN * 0.70
            sag_genis  = KULLAN_GEN * 0.30

            baslik_ust = Table(
                [[
                    Paragraph(
                        "<b>KAPAKLI KAYMAKAMLĞI İLÇE NÜFUS MÜDÜRLÜĞÜ<br/>"
                        "PERSONELİNE AİT DERECE TERFİ LİSTESİ</b>",
                        s_baslik_sol
                    ),
                    Paragraph(
                        f"<b>AİT OLDUĞU AY</b><br/>{donem_str}",
                        s_baslik_sag
                    )
                ]],
                colWidths=[sol_genis, sag_genis]
            )
            baslik_ust.setStyle(TableStyle([
                ('BOX',           (0,0), (-1,-1), 0.8, SIYAH),
                ('LINEAFTER',     (0,0), (0,0),   0.8, SIYAH),
                ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
                ('TOPPADDING',    (0,0), (-1,-1), 7),
                ('BOTTOMPADDING', (0,0), (-1,-1), 7),
                ('LEFTPADDING',   (0,0), (0,0),   6),
                ('RIGHTPADDING',  (0,0), (0,0),   6),
                ('LEFTPADDING',   (1,0), (1,0),   6),
                ('RIGHTPADDING',  (1,0), (1,0),   6),
            ]))
            elements.append(baslik_ust)

            # ── ANA TABLO ─────────────────────────────────────────
            # Sütun genişlikleri — toplam = KULLAN_GEN
            # SIRA(10) ADI(38) SİCİL(18) GÖREV(58) KADRO(13) ALMAKTA(17)
            # EMEKLİ(20) KAZANILAN(17) GEÇERLİLİK(22) AÇIKLAMALAR(54) = 267
            col_w = [
                10*mm, 38*mm, 18*mm, 58*mm,
                13*mm, 17*mm, 20*mm, 17*mm,
                22*mm, 54*mm
            ]

            headers = [
                Paragraph('<b>SIRA</b>',            s_th),
                Paragraph('<b>ADI SOYADI</b>',       s_th),
                Paragraph('<b>SİCİL NO</b>',         s_th),
                Paragraph('<b>GÖREV YERİ ÜNVANI</b>',s_th),
                Paragraph('<b>KADRO</b>',             s_th),
                Paragraph('<b>ALMAKTA</b>',           s_th),
                Paragraph('<b>EMEKLİ<br/>MÜKTESEP</b>', s_th),
                Paragraph('<b>KAZANILAN</b>',         s_th),
                Paragraph('<b>GEÇERLİLİK</b>',       s_th),
                Paragraph('<b>AÇIKLAMALAR</b>',       s_th),
            ]
            tablo_veri = [headers]

            for idx, p in enumerate(liste, 1):
                tablo_veri.append([
                    Paragraph(str(idx),                                      s_td),
                    Paragraph(str(p.get('ad_soyad','')).upper(),             s_td_l),
                    Paragraph(str(p.get('sicil_no','')),                     s_td),
                    Paragraph(str(p.get('gorev_yeri_unvani','')),            s_td_l),
                    Paragraph(str(p.get('kadro','')),                        s_td),
                    Paragraph(str(p.get('almakta','')),                      s_td),
                    Paragraph(str(p.get('emekli_muktesep','')),              s_td),
                    Paragraph(str(p.get('kazanilan','')),                    s_td),
                    Paragraph(fmt_tarih(p.get('gecerlilik','')),             s_td),
                    Paragraph(str(p.get('aciklamalar','')),                  s_td_l),
                ])

            t = Table(tablo_veri, colWidths=col_w, repeatRows=1)
            t.setStyle(TableStyle([
                ('FONTNAME',      (0,0), (-1,-1), font_name),
                ('FONTSIZE',      (0,0), (-1,-1), 8),
                ('GRID',          (0,0), (-1,-1), 0.5, SIYAH),
                ('BOX',           (0,0), (-1,-1), 0.8, SIYAH),
                ('ALIGN',         (0,0), (-1,-1), 'CENTER'),
                ('VALIGN',        (0,0), (-1,-1), 'MIDDLE'),
                # Başlık satırı arka plan
                ('BACKGROUND',    (0,0), (-1,0),  GRI_ACIK),
                # Çift satır rengi
                ('ROWBACKGROUNDS',(0,1), (-1,-1),  [colors.white, colors.Color(0.97, 0.97, 0.97)]),
                # Adı ve görev yeri sola yasla
                ('ALIGN',         (1,1), (1,-1),  'LEFT'),
                ('ALIGN',         (3,1), (3,-1),  'LEFT'),
                ('ALIGN',         (9,1), (9,-1),  'LEFT'),
                ('TOPPADDING',    (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING',   (0,0), (-1,-1), 3),
                ('RIGHTPADDING',  (0,0), (-1,-1), 3),
            ]))
            elements.append(t)

            # ── İMZA BLOĞU ────────────────────────────────────────
            elements.append(Spacer(1, 10*mm))

            onay_tarih_str = fmt_tarih(onay_tarih) if onay_tarih else '.…/…./………'

            imza_sol = (
                f"Teklif Eden:\n\n"
                f"{teklif_ad}\n"
                f"{teklif_unv}"
            )
            imza_sag = (
                f"Onaylayan : {onay_tarih_str}\n\n"
                f"{onay_ad}\n"
                f"{onay_unv}"
            )

            imza_t = Table(
                [[Paragraph(imza_sol.replace('\n','<br/>'), s_imza_l),
                  Paragraph(imza_sag.replace('\n','<br/>'), s_imza_r)]],
                colWidths=[KULLAN_GEN / 2, KULLAN_GEN / 2]
            )
            imza_t.setStyle(TableStyle([
                ('FONTNAME', (0,0), (-1,-1), font_name),
                ('VALIGN',   (0,0), (-1,-1), 'TOP'),
                ('TOPPADDING',    (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
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