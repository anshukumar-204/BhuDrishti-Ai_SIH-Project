-- BhuDrishti AI Database Schema
-- PostgreSQL with PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
-- Land Parcels
CREATE TABLE land_parcels (
  id SERIAL PRIMARY KEY,
  parcel_id VARCHAR(50) UNIQUE NOT NULL,
  survey_number VARCHAR(100),
  locality VARCHAR(100),
  ward_zone VARCHAR(50),
  land_use VARCHAR(50),
  category VARCHAR(50),
  area DECIMAL(12, 2),
  risk_level VARCHAR(20),
  risk_factors TEXT,
  environmental_risk VARCHAR(50),
  development_risk VARCHAR(50),
  geometry GEOMETRY(MultiPolygon, 4326),
  centroid GEOMETRY(Point, 4326),
  data_source VARCHAR(100),
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_parcels_geometry ON land_parcels USING GIST(geometry);
CREATE INDEX idx_parcels_parcel_id ON land_parcels(parcel_id);
-- Research Resources
CREATE TABLE research_resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  category VARCHAR(100),
  description TEXT,
  abstract TEXT,
  authors VARCHAR(255),
  year INT,
  source VARCHAR(255),
  source_url VARCHAR(500),
  tags TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  published_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
-- Analytics Records
CREATE TABLE analytics_records (
  id SERIAL PRIMARY KEY,
  region VARCHAR(100),
  total_parcels INT,
  residential_parcels INT,
  agricultural_parcels INT,
  forest_parcels INT,
  low_risk INT,
  medium_risk INT,
  high_risk INT,
  total_area DECIMAL(15, 2),
  year INT,
  calculated_at TIMESTAMP DEFAULT NOW()
);