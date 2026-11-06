import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Load credentials from .env
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "helpdesk_db")

# 2. Use SQLAlchemy URL.create to safely handle special characters (like '@') in passwords
connection_url = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME,
)

# 3. Create the SQLAlchemy engine that connects to MySQL
engine = create_engine(connection_url, pool_pre_ping=True)

# 4. SessionLocal factory for creating independent database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Base class for defining our database models
Base = declarative_base()

# 6. Dependency function to give each API request its own database session and close it automatically
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
