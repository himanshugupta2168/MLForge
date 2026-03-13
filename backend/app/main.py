from fastapi import FastAPI
from app.db.database import Database

app = FastAPI(title="MLForge API")

@app.get("/")
def health():
    Database.get_db()  # Ensure database connection is working
    return {"status": "MLForge backend running"}

