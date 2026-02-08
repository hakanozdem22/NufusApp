import sys
import json
import os
import datetime
import requests
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# --- AYARLAR (BURALARI DOLDURUN) ---
# Lütfen kendi oluşturduğunuz Google E-Tablo ID'lerini buraya yapıştırın
SHEET_ID_EK2 = "1bN_k4rfYyzRk5zE31lv0a19Ph8oE8A4CSl_nMiPwCcg"
SHEET_ID_EK3 = "1caObSLbmdYbxnk_lRyOp8Q2b8om_A66w4S37qtPr9Wc"
# -----------------------------------

def get_desktop_path(custom_path=None):
    if custom_path:
        return custom_path
    return os.path.join(os.environ['USERPROFILE'], 'Desktop')

def get_sort_key(text):
    try:
        # "1.1 - Konu" -> "1.1" -> "1.10" -> [1, 10]
        # "10.2 - Konu" -> "10.2" -> "10.20" -> [10, 20]
        code_part = text.split('-')[0].strip()
        parts_str = code_part.split('.')
        parts = []
        for i, p in enumerate(parts_str):
            if i == 1 and len(p) == 1: # Noktadan sonraki ilk eleman tek haneli ise
                 p = p + "0"
            parts.append(int(p))
        return parts
    except:
        return [9999, 9999]

def run_process(data_json):
    try:
        # Gelen veriyi işle
        if isinstance(data_json, bytes):
            data_json = data_json.decode('utf-8')
        
        payload = json.loads(data_json)
        islem_tipi = payload.get('tip') # 'EK2' veya 'EK3'
        veri = payload.get('veri', {})
        resource_path = payload.get('resource_path', '.') # anahtar.json yolu için
        desktop_path = payload.get('desktop_path')  # Electron'dan gelen masaüstü yolu
        
        # 1. Google Bağlantısı
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        
        # Anahtar dosyasını bul
        key_path = os.path.join(resource_path, 'anahtar.json')
        if not os.path.exists(key_path):
            # Geliştirme ortamı için alternatif yol
            key_path = os.path.join(os.path.dirname(__file__), 'anahtar.json')
            
        if not os.path.exists(key_path):
            return {"success": False, "error": f"anahtar.json bulunamadı! Yol: {key_path}"}

        creds = ServiceAccountCredentials.from_json_keyfile_name(key_path, scope)
        client = gspread.authorize(creds)

        # 2. İşlem Tipine Göre Veri Gönderimi
        if islem_tipi == 'EK2':
            sheet = client.open_by_key(SHEET_ID_EK2).sheet1
            program_adi = veri.get('program_adi', '')
            dersler = veri.get('dersler', [])
            
            # Tarihleri ve Dersleri Sırala
            dersler_sorted = sorted(dersler, key=lambda x: (x.get('tarih'), x.get('saat')))
            dates = sorted(list(set([d.get('tarih') for d in dersler])))
            
            if not dates: return {"success": False, "error": "Ders kaydı yok."}
            
            tr_dates = [datetime.datetime.strptime(d, '%Y-%m-%d').strftime('%d.%m.%Y') for d in dates]
            tarih_araligi = f"{tr_dates[0]} - {tr_dates[-1]}"

            # Tabloya Yazılacak Veriler (Ders - Eğitici çiftleri)
            unique_pairs = []
            seen = set()
            for l in dersler_sorted:
                pair = (l.get('konu'), l.get('egitici'))
                if pair not in seen:
                    seen.add(pair)
                    unique_pairs.append(pair)
            
            # Konu Koduna Göre Sırala (1.1, 1.2 ... 1.10)
            unique_pairs.sort(key=lambda x: get_sort_key(x[0]))
            
            data_rows = []
            for subj, trainer_raw in unique_pairs:
                clean_trainer = trainer_raw.split(" - ")[0] if " - " in trainer_raw else trainer_raw
                data_rows.append([subj])
                data_rows.append([clean_trainer])

            # Batch Update
            # ÖNCE TEMİZLE (Eski konular kalmasın)
            sheet.batch_clear(['B13:C150']) 

            updates = [
                {'range': 'A5', 'values': [[f"Eğitimin Adı: {program_adi} "]]},
                {'range': 'A6', 'values': [[f"Tarihi: {datetime.datetime.now().strftime('%d.%m.%Y')} "]]},
                {'range': 'B13', 'values': data_rows} # B13 başlangıç hücresi
            ]
            sheet.batch_update(updates)
            target_sheet_id = SHEET_ID_EK2
            file_prefix = "EK-2"

        elif islem_tipi == 'EK3':
            sheet = client.open_by_key(SHEET_ID_EK3).sheet1
            program_adi = veri.get('program_adi', '')
            dersler = veri.get('dersler', [])
            personeller = veri.get('personeller', [])
            
            # İstatistikler
            dates = sorted(list(set([d.get('tarih') for d in dersler])))
            subjects = list(set([d.get('konu') for d in dersler]))
            
            # Basit kod ayıklama (1.1, 2.3 vb.)
            codes = [s.split(" - ")[0] for s in subjects]
            
            # Saat Hesaplama (Dinamik)
            total_hours = 0.0
            for d in dersler:
                saat_str = d.get('saat', '')
                try:
                    if '-' in saat_str:
                        start_str, end_str = saat_str.split('-')
                        sh, sm = map(int, start_str.strip().split(':'))
                        eh, em = map(int, end_str.strip().split(':'))
                        start_min = sh * 60 + sm
                        end_min = eh * 60 + em
                        diff = end_min - start_min
                        if diff > 0:
                            total_hours += diff / 60.0
                        else:
                            total_hours += 3.0 # Hata/Terslik varsa varsayılan
                    else:
                        total_hours += 3.0 # Format uymazsa varsayılan
                except:
                    total_hours += 3.0 # Parse hatası olursa varsayılan
            # Cinsiyet Sayımı
            kadin = 0
            erkek = 0
            for p in personeller:
                cns = p.get('cinsiyet', '').lower()
                if cns == 'kadın' or cns == 'kadin':
                    kadin += 1
                else:
                    erkek += 1
            
            toplam_pers = kadin + erkek
            
            # Düzenleyen ve Eğitici Bilgisi
            duzenleyen = veri.get('duzenleyen', {})
            duzenleyen_str = ""
            if duzenleyen:
                duzenleyen_str = f"{duzenleyen.get('ad_soyad', '')} \n {duzenleyen.get('unvan', '')}"
            
            # Onaylayan Bilgisi (YENİ)
            onaylayan = veri.get('onaylayan', {})
            onaylayan_str = ""
            if onaylayan:
                onaylayan_str = f"{onaylayan.get('ad_soyad', '')} \n {onaylayan.get('unvan', '')}"

            # Eğitici bilgisini derslerden al (İlk dersin eğiticisi varsayılır)
            egitici_str = ""
            if dersler:
                # Format: "Ad Soyad - Ünvan"
                raw = dersler[0].get('egitici', '')
                parts = raw.split(' - ')
                if len(parts) > 1:
                     egitici_str = f"{parts[0]} \n {parts[1]}"
                else:
                     egitici_str = raw

            tr_dates = [datetime.datetime.strptime(d, '%Y-%m-%d').strftime('%d.%m.%Y') for d in dates]
            tarih_araligi = f"{tr_dates[0]} - {tr_dates[-1]}" if dates else "-"

            updates = [
                {'range': 'B5', 'values': [[str(datetime.datetime.now().year)]]},
                {'range': 'B6', 'values': [[program_adi]]},
                {'range': 'B11', 'values': [[tarih_araligi]]},
                {'range': 'C11', 'values': [[", ".join(codes)]]},
                {'range': 'D11', 'values': [[len(codes)]]},
                {'range': 'E11', 'values': [[total_hours]]},
                {'range': 'F11', 'values': [[kadin]]},          # Kadın Sayısı
                {'range': 'G11', 'values': [[erkek]]},          # Erkek Sayısı
                {'range': 'I11', 'values': [[toplam_pers]]},    # Başarılı Sayısı (Varsayılan hepsi)
                {'range': 'A20', 'values': [[duzenleyen_str]]}, # Düzenleyen
                {'range': 'H20', 'values': [[onaylayan_str]]},  # Onaylayan (YENİ)
                {'range': 'D20', 'values': [[datetime.datetime.now().strftime("%d.%m.%Y")]]}, # Tarih
                {'range': 'E20', 'values': [[egitici_str]]}     # Eğitici
            ]
            sheet.batch_update(updates)
            target_sheet_id = SHEET_ID_EK3
            file_prefix = "EK-3"

        # 3. PDF İndirme
        if creds.access_token_expired:
            client.login()
        
        token = creds.get_access_token().access_token
        # Dikey (Portrait) A4
        url = f"https://docs.google.com/spreadsheets/d/{target_sheet_id}/export?format=pdf&portrait=true&size=A4&gridlines=true&scale=4"
        
        # EK-2 ise Yatay (Landscape) olabilir, şablonunuza göre değiştirin:
        if islem_tipi == 'EK2':
             url = f"https://docs.google.com/spreadsheets/d/{target_sheet_id}/export?format=pdf&portrait=true&size=A4&gridlines=true&scale=4"

        response = requests.get(url, headers={'Authorization': 'Bearer ' + token})
        
        if response.status_code == 200:
            dosya_adi = f"{file_prefix}_{datetime.datetime.now().strftime('%H%M%S')}.pdf"
            save_path = os.path.join(get_desktop_path(desktop_path), dosya_adi)
            with open(save_path, 'wb') as f:
                f.write(response.content)
            
            return {"success": True, "path": save_path}
        else:
            return {"success": False, "error": f"Google İndirme Hatası: {response.status_code}"}

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    try: sys.stdin.reconfigure(encoding='utf-8')
    except: pass
    
    input_data = sys.stdin.read()
    if input_data:
        result = run_process(input_data)
        print(json.dumps(result))