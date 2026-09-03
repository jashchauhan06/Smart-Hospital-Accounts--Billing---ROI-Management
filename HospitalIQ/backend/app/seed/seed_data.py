"""
CSV-Driven Seed data generator for HospIntel.
Loads database tables from CSV files in app/seed/data/ instead of hardcoded python lists.
"""
import os
import pandas as pd
from sqlalchemy.orm import Session
from app.models import User
from app.database import engine

def seed_database(db: Session):
    """Main seed function. Only seeds if database is empty."""
    existing = db.query(User).first()
    if existing:
        return  # Already seeded

    print("Seeding HospIntel database from CSV files...")
    
    csv_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    # Order of insertion matters for foreign keys
    tables = [
        'users',
        'departments',
        'services',
        'patients',
        'financial_records',
        'operational_metrics',
        'clinical_quality_metrics',
        'investments',
        'alerts',
        'insights'
    ]
    
    for table in tables:
        csv_path = os.path.join(csv_dir, f"{table}.csv")
        if os.path.exists(csv_path):
            print(f"Loading {table} from CSV...")
            df = pd.read_csv(csv_path)
            
            # Pandas to_sql uses SQLAlchemy engine directly
            try:
                df.to_sql(table, engine, if_exists='append', index=False)
            except Exception as e:
                print(f"Error inserting {table}: {e}")
        else:
            print(f"Warning: {csv_path} not found. Skipping {table}.")
            
    print("Database seeding completed successfully!")
