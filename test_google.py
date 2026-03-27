from google.oauth2.service_account import Credentials
import gspread

# Farklı scope deneyelim
scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

try:
    creds = Credentials.from_service_account_file('resources/anahtar.json', scopes=scopes)
    client = gspread.authorize(creds)
    
    # EK3
    sheet3 = client.open_by_key('1caObSLbmdYbxnk_lRyOp8Q2b8om_A66w4S37qtPr9Wc').sheet1
    print("EK3 OK:", sheet3.title)
    
    # EK2
    sheet2 = client.open_by_key('1bN_k4rfYyzRk5zE31lv0a19Ph8oE8A4CSl_nMiPwCcg').sheet1
    print("EK2 OK:", sheet2.title)
    
    print("TAMAMDIR!")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"\nHATA: {type(e).__name__}: {e}")
