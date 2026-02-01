
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
    
    # Get specific cells
    print("--- CELLS ---")
    val_A5 = sheet.acell('A5').value
    print(f"A5: {val_A5}")
    print(f"B5: {sheet.acell('B5').value}")
    
    # Check for Date label at bottom (assuming signature area)
    print("--- BOTTOM ---")
    # EK-3 used D20
    print(f"D20: {sheet.acell('D20').value}")
    
    # Search for "Tarih" string in first 25 rows
    print("--- SEARCH ---")
    cells = sheet.findall("Tarih")
    for cell in cells:
        print(f"Found 'Tarih' at {cell.row}, {cell.col} (Value: {cell.value})")

except Exception as e:
    print(f"Error: {e}")
