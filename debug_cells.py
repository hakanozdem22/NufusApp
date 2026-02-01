
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
    
    print(f"A6: {sheet.acell('A6').value}")
    print(f"B6: {sheet.acell('B6').value}")
    print(f"B5: {sheet.acell('B5').value}")
    print(f"D5: {sheet.acell('D5').value}")
    print(f"D6: {sheet.acell('D6').value}")
    print(f"D20: {sheet.acell('D20').value}")
    print(f"E20: {sheet.acell('E20').value}")

except Exception as e:
    print(f"Error: {e}")
