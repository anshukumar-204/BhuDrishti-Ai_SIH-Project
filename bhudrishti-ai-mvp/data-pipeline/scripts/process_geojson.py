"""Validate and normalize GeoJSON inputs for the platform pipeline."""
import json
from pathlib import Path

raw = Path(__file__).parents[1] / "raw"
processed = Path(__file__).parents[1] / "processed"
processed.mkdir(exist_ok=True)
for source in raw.glob("*.geojson"):
    payload = json.loads(source.read_text(encoding="utf-8"))
    if payload.get("type") != "FeatureCollection":
        raise ValueError(f"{source.name} must be a FeatureCollection")
    (processed / source.name).write_text(json.dumps(payload, indent=2), encoding="utf-8")
