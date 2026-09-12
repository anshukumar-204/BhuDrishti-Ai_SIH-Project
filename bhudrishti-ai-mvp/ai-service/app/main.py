from statistics import mean

import requests
from fastapi import FastAPI, HTTPException, Query
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


WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


def _average(values):
    numbers = [value for value in values if value is not None]
    return round(mean(numbers), 1) if numbers else None


def _soil_status(value):
    if value < 15:
        return "Dry"
    if value < 30:
        return "Moderate moisture"
    if value < 50:
        return "Good moisture"
    return "High moisture"


def _reverse_geocode(latitude, longitude):
    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={
                "lat": latitude,
                "lon": longitude,
                "format": "jsonv2",
                "addressdetails": 1,
            },
            headers={
                "Accept": "application/json",
                "User-Agent": "BhuDrishtiAI/1.0 (land-intelligence-demo)",
            },
            timeout=8,
        )
        response.raise_for_status()
        place = response.json()
        address = place.get("address", {})
        village = address.get("village") or address.get("town") or address.get("city")
        district = address.get("district") or address.get("county")
        state = address.get("state")
        return {
            "display_name": place.get("display_name", "Selected location"),
            "village": village,
            "tehsil": address.get("municipality") or address.get("suburb") or address.get("town"),
            "district": district,
            "state": state,
            "postcode": address.get("postcode"),
            "country": address.get("country"),
        }
    except requests.RequestException:
        return {
            "display_name": f"{latitude:.5f}, {longitude:.5f}",
            "village": None,
            "tehsil": None,
            "district": None,
            "state": None,
            "postcode": None,
            "country": None,
        }


@app.get("/land-analysis")
def land_analysis(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    try:
        response = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": latitude,
                "longitude": longitude,
                "hourly": "temperature_2m,relative_humidity_2m,precipitation,weather_code,soil_moisture_0_to_10cm",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
                "timezone": "Asia/Kolkata",
                "forecast_days": 1,
            },
            timeout=12,
        )
        response.raise_for_status()
        weather = response.json()
        hourly = weather.get("hourly", {})
        daily = weather.get("daily", {})
        humidity_values = hourly.get("relative_humidity_2m", [])
        soil_values = hourly.get("soil_moisture_0_to_10cm", [])
        soil_moisture = round((soil_values[0] or 0) * 100, 1) if soil_values else None
        weather_code = (daily.get("weather_code") or [None])[0]
        location = _reverse_geocode(latitude, longitude)
        return {
            "success": True,
            "coordinates": {"latitude": latitude, "longitude": longitude},
            "location": location,
            "environment": {
                "max_temperature": (daily.get("temperature_2m_max") or [None])[0],
                "min_temperature": (daily.get("temperature_2m_min") or [None])[0],
                "precipitation": (daily.get("precipitation_sum") or [None])[0],
                "humidity": (humidity_values[0] if humidity_values else None),
                "average_humidity": _average(humidity_values),
                "weather_code": weather_code,
                "weather": WEATHER_CODES.get(weather_code, "Condition unavailable"),
                "soil_moisture": soil_moisture,
                "soil_status": _soil_status(soil_moisture) if soil_moisture is not None else "Unavailable",
                "humidity_series": humidity_values,
                "soil_moisture_series": [round(value * 100, 1) if value is not None else None for value in soil_values],
                "time_series": hourly.get("time", []),
            },
            "sources": ["Open-Meteo", "OpenStreetMap Nominatim"],
            "disclaimer": "Indicative environmental data for decision support, not a legal land record.",
        }
    except requests.RequestException as error:
        raise HTTPException(status_code=502, detail=f"Environmental data service unavailable: {error}") from error
