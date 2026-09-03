import os
import sqlite3
import pandas as pd

DB_PATH = 'hospintel.db'
OUT_DIR = os.path.join('app', 'seed', 'data')

def export_all():
    if not os.path.exists(OUT_DIR):
        os.makedirs(OUT_DIR)
        
    conn = sqlite3.connect(DB_PATH)
    
    # Get all tables
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    for table_name in tables:
        table_name = table_name[0]
        # Skip sqlite internal tables and alembic version
        if table_name.startswith('sqlite_') or table_name == 'alembic_version':
            continue
            
        df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
        out_path = os.path.join(OUT_DIR, f"{table_name}.csv")
        df.to_csv(out_path, index=False)
        print(f"Exported {table_name} -> {out_path} ({len(df)} rows)")
        
    conn.close()
    print("Export complete.")

if __name__ == '__main__':
    export_all()
