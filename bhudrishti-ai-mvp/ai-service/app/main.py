from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="BhuDrishti AI Service")

class InsightRequest(BaseModel):
    parcel_id: str
    land_use: str = "unknown"
    risk_level: str = "unknown"

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}

@app.post("/insights")
def insights(request: InsightRequest):
    return {"summary": f"{request.parcel_id} is a {request.land_use} context with {request.risk_level} mapped risk.", "mode": "decision-support"}
