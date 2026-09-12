import pool from "../config/database.js";

const initializeDatabase = async () => {
  try {
    console.log("🔧 Initializing BhuDrishti AI Database...");

    // Enable PostGIS
    await pool.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    console.log("✅ PostGIS extension enabled");

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'researcher' CHECK (role IN ('researcher', 'government', 'admin', 'public')),
        organization TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    `);
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users ADD CONSTRAINT users_role_check
        CHECK (role IN ('researcher', 'government', 'admin', 'public'));
    `);
    console.log("✅ Users table created");

    // Land Parcels table with PostGIS geometry
    await pool.query(`
      CREATE TABLE IF NOT EXISTS land_parcels (
        id SERIAL PRIMARY KEY,
        parcel_id TEXT UNIQUE NOT NULL,
        survey_number TEXT,
        registration_reference TEXT,
        locality TEXT,
        ward_zone TEXT,
        land_use TEXT,
        category TEXT,
        area DECIMAL(12, 2),
        risk_level TEXT,
        risk_factors TEXT,
        environmental_risk VARCHAR(50),
        development_risk VARCHAR(50),
        geometry GEOMETRY(MultiPolygon, 4326),
        centroid GEOMETRY(Point, 4326),
        data_source VARCHAR(100) DEFAULT 'Demo Spatial Dataset',
        last_updated TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_parcels_geometry ON land_parcels USING GIST(geometry);
      CREATE INDEX IF NOT EXISTS idx_parcels_parcel_id ON land_parcels(parcel_id);
      CREATE INDEX IF NOT EXISTS idx_parcels_locality ON land_parcels(locality);
    `);
    await pool.query(
      `ALTER TABLE land_parcels ADD COLUMN IF NOT EXISTS registration_reference TEXT`,
    );
    console.log("✅ Land Parcels table created with PostGIS support");

    // Research Resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS research_resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        category VARCHAR(100),
        region VARCHAR(100),
        description TEXT,
        abstract TEXT,
        authors VARCHAR(255),
        year INT,
        organization VARCHAR(255),
        source VARCHAR(255),
        source_url VARCHAR(500),
        key_findings TEXT,
        license VARCHAR(100),
        tags TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        published_date DATE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_research_type ON research_resources(type);
      CREATE INDEX IF NOT EXISTS idx_research_region ON research_resources(region);
      CREATE INDEX IF NOT EXISTS idx_research_year ON research_resources(year);
    `);
    console.log("✅ Research Resources table created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS data_sources (
        id SERIAL PRIMARY KEY,
        source_key VARCHAR(120) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        data_domain VARCHAR(80) NOT NULL,
        source_type VARCHAR(80) NOT NULL,
        format VARCHAR(40) NOT NULL,
        coverage VARCHAR(255),
        publisher VARCHAR(255),
        provenance TEXT,
        limitations TEXT,
        path_or_endpoint VARCHAR(500),
        last_updated DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_data_sources_domain ON data_sources(data_domain);
      CREATE INDEX IF NOT EXISTS idx_data_sources_type ON data_sources(source_type);
    `);
    console.log("✅ Data source catalog table created");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS research_projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(40) NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INT NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(40) NOT NULL DEFAULT 'member',
        joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(project_id, user_id)
      );
      CREATE TABLE IF NOT EXISTS saved_resources (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        resource_id INT NOT NULL REFERENCES research_resources(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, resource_id)
      );
      CREATE TABLE IF NOT EXISTS saved_queries (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        query TEXT NOT NULL,
        filters JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS research_notes (
        id SERIAL PRIMARY KEY,
        project_id INT REFERENCES research_projects(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        visibility VARCHAR(20) NOT NULL DEFAULT 'private',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_projects_owner ON research_projects(owner_id);
      CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON saved_resources(user_id);
      CREATE INDEX IF NOT EXISTS idx_notes_project ON research_notes(project_id);
    `);
    console.log("✅ Research projects, saves, and notes tables created");

    // Analytics Records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_records (
        id SERIAL PRIMARY KEY,
        region VARCHAR(100),
        total_parcels INT,
        residential_parcels INT,
        agricultural_parcels INT,
        forest_parcels INT,
        builtup_parcels INT,
        low_risk INT,
        medium_risk INT,
        high_risk INT,
        total_area DECIMAL(15, 2),
        year INT,
        calculated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(region, year)
      );

      CREATE INDEX IF NOT EXISTS idx_analytics_region ON analytics_records(region);
      CREATE INDEX IF NOT EXISTS idx_analytics_year ON analytics_records(year);
    `);
    console.log("✅ Analytics Records table created");

    // Verification Records table for SHA-256
    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_records (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_hash VARCHAR(64) NOT NULL,
        algorithm VARCHAR(50) DEFAULT 'SHA-256',
        uploaded_by INT REFERENCES users(id),
        verified_at TIMESTAMP,
        verification_status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(file_hash)
      );

      CREATE INDEX IF NOT EXISTS idx_verification_hash ON verification_records(file_hash);
      CREATE INDEX IF NOT EXISTS idx_verification_user ON verification_records(uploaded_by);
    `);
    console.log("✅ Verification Records table created");

    // Audit Logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGSERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        status TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
    `);
    console.log("✅ Audit Logs table created");

    // Simulations table for policy simulation
    await pool.query(`
      CREATE TABLE IF NOT EXISTS simulations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        region VARCHAR(100),
        scenario_name VARCHAR(255),
        area_hectares DECIMAL(12, 2),
        agricultural_impact INT,
        environmental_risk INT,
        infrastructure_pressure INT,
        development_potential INT,
        results JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_simulations_user ON simulations(user_id);
      CREATE INDEX IF NOT EXISTS idx_simulations_region ON simulations(region);
    `);
    console.log("✅ Simulations table created");

    console.log("✅ Database initialization complete!");
    return true;
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
    throw err;
  }
};

export default initializeDatabase;
