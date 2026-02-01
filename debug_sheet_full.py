
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
import sys

# Flush stdout
try:
    sys.stdout.reconfigure(encoding='utf-8')
except:
    pass

try:
    SHEET_ID_EK2 = "1bN_k4rfYyzRk5zE31lv0a19Ph8oE8A4CSl_nMiPwCcg"
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    key_path = os.path.join(os.getcwd(), 'resources', 'anahtar.json')
    creds = ServiceAccountCredentials.from_json_keyfile_name(key_path, scope)
    client = gspread.authorize(creds)
    sheet = client.open_by_key(SHEET_ID_EK2).sheet1
    
    # Get all values
    values = sheet.get_all_values()
    
    print("--- SHEET DUMP ---")
    for r_idx, row in enumerate(values):
        for c_idx, cell in enumerate(row):
            if cell and cell.strip():
                print(f"[{r_idx+1},{c_idx+1}] ({chr(65+c_idx)}{r_idx+1}): {cell}")
                
except Exception as e:
    print(f"Error: {e}")
