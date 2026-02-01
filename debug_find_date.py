
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
    
    # 1. Search for "Tarih"
    print("--- SEARCH 'Tarih' ---")
    all_values = sheet.get_all_values()
    found = False
    for r_idx, row in enumerate(all_values):
        for c_idx, cell in enumerate(row):
            if "tarih" in cell.lower():
                print(f"Found 'Tarih' at Row {r_idx+1}, Col {c_idx+1} ({chr(65+c_idx)}{r_idx+1}): '{cell}'")
                found = True
    
    if not found:
        print("No cell containing 'Tarih' found.")

    # 2. Print Header 1-10
    print("\n--- HEADER (Rows 1-10) ---")
    for i in range(10):
        if i < len(all_values):
            print(f"Row {i+1}: {all_values[i]}")

except Exception as e:
    print(f"Error: {e}")
