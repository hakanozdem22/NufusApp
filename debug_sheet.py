
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import os
import json

try:
    SHEET_ID_EK2 = "1bN_k4rfYyzRk5zE31lv0a19Ph8oE8A4CSl_nMiPwCcg"
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    
    # Path to anahtar.json
    key_path = os.path.join(os.getcwd(), 'resources', 'anahtar.json')
    print(f"Key path: {key_path}")
    
    creds = ServiceAccountCredentials.from_json_keyfile_name(key_path, scope)
    client = gspread.authorize(creds)
    sheet = client.open_by_key(SHEET_ID_EK2).sheet1
    
    values = sheet.get('A1:F20')
    for i, row in enumerate(values):
        print(f"Row {i+1}: {row}")
        
except Exception as e:
    print(f"Error: {e}")
