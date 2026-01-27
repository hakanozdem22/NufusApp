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

def get_desktop_path():
    return os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')

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
            updates = [
                {'range': 'B5', 'values': [[program_adi]]},
                {'range': 'B6', 'values': [[tarih_araligi]]},
                {'range': 'B13', 'values': data_rows} # B13 başlangıç hücresi (Şablonunuza göre ayarlayın)
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
            
            total_hours = len(dersler) * 3 # Varsayılan 3 saat
            kadin = 0 # Veritabanından cinsiyet gelirse eklenebilir
            erkek = len(personeller)
            toplam_pers = kadin + erkek
            
            tr_dates = [datetime.datetime.strptime(d, '%Y-%m-%d').strftime('%d.%m.%Y') for d in dates]
            tarih_araligi = f"{tr_dates[0]} - {tr_dates[-1]}" if dates else "-"

            updates = [
                {'range': 'B5', 'values': [[str(datetime.datetime.now().year)]]},
                {'range': 'B6', 'values': [[program_adi]]},
                {'range': 'B11', 'values': [[tarih_araligi]]},
                {'range': 'C11', 'values': [[", ".join(codes)]]},
                {'range': 'D11', 'values': [[len(codes)]]},
                {'range': 'E11', 'values': [[total_hours]]},
                {'range': 'H11', 'values': [[toplam_pers]]},
                {'range': 'I11', 'values': [[toplam_pers]]},
                {'range': 'D20', 'values': [[datetime.datetime.now().strftime("%d.%m.%Y")]]}
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
            save_path = os.path.join(get_desktop_path(), dosya_adi)
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