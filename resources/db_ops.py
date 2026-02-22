import sys
import json
import sqlite3
import os

def get_tables(db_path):
    try:
        if not os.path.exists(db_path):
            return {"success": False, "error": "Veritabanı dosyası bulunamadı."}
            
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        
        conn.close()
        return {"success": True, "tables": tables}
    except Exception as e:
        return {"success": False, "error": str(e)}

def read_table(db_path, table_name):
    try:
        if not os.path.exists(db_path):
            return {"success": False, "error": "Veritabanı dosyası bulunamadı."}
            
        conn = sqlite3.connect(db_path)
        # Return rows as dictionaries
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Safe table name usage (avoid injection if possible, though mostly internal)
        # SQLite doesn't support parameterized table names, so we just quote it
        safe_table = f'"{table_name}"'
        cursor.execute(f"SELECT * FROM {safe_table}")
        
        rows = cursor.fetchall()
        data = [dict(row) for row in rows]
        
        # Get column names (already in dict keys, but maybe useful separately? No need for now)
        
        conn.close()
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}

def process_command(json_input):
    try:
        payload = json.loads(json_input)
        command = payload.get("command")
        db_path = payload.get("db_path")
        
        if command == "get_tables":
            return get_tables(db_path)
        elif command == "read_table":
            table_name = payload.get("table_name")
            return read_table(db_path, table_name)
        else:
            return {"success": False, "error": f"Unknown command: {command}"}
    except Exception as e:
        return {"success": False, "error": f"Input processing error: {str(e)}"}

if __name__ == "__main__":
    try:
        # Set stdin/stdout encoding to utf-8
        sys.stdin.reconfigure(encoding='utf-8')
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass
        
    try:
        # Read all input from stdin
        input_data = sys.stdin.read()
        if input_data:
            result = process_command(input_data)
            print(json.dumps(result, ensure_ascii=False))
        else:
            print(json.dumps({"success": False, "error": "No input received"}, ensure_ascii=False))
            
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Script error: {str(e)}"}, ensure_ascii=False))
