from fastapi import FastAPI

app = FastAPI(title="MLForge API")

@app.get("/")
def health():
    return {"status": "MLForge backend running"}

