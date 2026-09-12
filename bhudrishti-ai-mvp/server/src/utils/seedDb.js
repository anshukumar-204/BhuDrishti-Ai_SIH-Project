import pool from "../config/database.js";

const seedDatabase = async () => {
  try {
    console.log("🌱 Seeding BhuDrishti AI Database...");

    // Seed Land Parcels
    const parcelsData = [
      {
        parcel_id: "UK-DDN-001",
        survey_number: "123/456",
        locality: "Rajpur Road",
        ward_zone: "Zone A",
        land_use: "Residential",
        category: "Private",
        area: 1200,
        risk_level: "Low",
        risk_factors: "Standard residential zone",
        environmental_risk: "Low",
        development_risk: "Low",
        data_source: "Demo Spatial Dataset",
      },
      {
        parcel_id: "UK-DDN-002",
        survey_number: "234/567",
        locality: "Clock Tower",
        ward_zone: "Zone B",
        land_use: "Commercial",
        category: "Private",
        area: 800,
        risk_level: "Medium",
        risk_factors: "High traffic density",
        environmental_risk: "Medium",
        development_risk: "Medium",
        data_source: "Demo Spatial Dataset",
      },
      {
        parcel_id: "UK-DDN-003",
        survey_number: "345/678",
        locality: "Saharanpur Road",
        ward_zone: "Zone C",
        land_use: "Agricultural",
        category: "Private",
        area: 5000,
        risk_level: "Low",
        risk_factors: "Fertile agricultural land",
        environmental_risk: "Low",
        development_risk: "Low",
        data_source: "Demo Spatial Dataset",
      },
      {
        parcel_id: "UK-DDN-004",
        survey_number: "456/789",
        locality: "Clement Town",
        ward_zone: "Zone D",
        land_use: "Residential",
        category: "Government",
        area: 2000,
        risk_level: "High",
        risk_factors: "Near river, flood prone",
        environmental_risk: "High",
        development_risk: "High",
        data_source: "Demo Spatial Dataset",
      },
      {
        parcel_id: "UK-DDN-005",
        survey_number: "567/890",
        locality: "Prem Nagar",
        ward_zone: "Zone E",
        land_use: "Residential",
        category: "Private",
        area: 1500,
        risk_level: "Medium",
        risk_factors: "Slope instability",
        environmental_risk: "Medium",
        development_risk: "Medium",
        data_source: "Demo Spatial Dataset",
      },
    ];

    for (const parcel of parcelsData) {
      await pool.query(
        `INSERT INTO land_parcels 
        (parcel_id, survey_number, locality, ward_zone, land_use, category, area, risk_level, risk_factors, environmental_risk, development_risk, data_source)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (parcel_id) DO NOTHING`,
        [
          parcel.parcel_id,
          parcel.survey_number,
          parcel.locality,
          parcel.ward_zone,
          parcel.land_use,
          parcel.category,
          parcel.area,
          parcel.risk_level,
          parcel.risk_factors,
          parcel.environmental_risk,
          parcel.development_risk,
          parcel.data_source,
        ],
      );
    }
    console.log("✅ Land parcels seeded");

    // Keep the demo identifiers usable with the same PostGIS nearby workflow.
    const demoGeometries = {
      "UK-DDN-001":
        "POLYGON((78.02 30.32,78.025 30.32,78.025 30.325,78.02 30.325,78.02 30.32))",
      "UK-DDN-002":
        "POLYGON((78.03 30.31,78.035 30.31,78.035 30.315,78.03 30.315,78.03 30.31))",
      "UK-DDN-003":
        "POLYGON((78.01 30.33,78.018 30.33,78.018 30.338,78.01 30.338,78.01 30.33))",
      "UK-DDN-004":
        "POLYGON((78.04 30.30,78.048 30.30,78.048 30.308,78.04 30.308,78.04 30.30))",
      "UK-DDN-005":
        "POLYGON((78.05 30.32,78.058 30.32,78.058 30.328,78.05 30.328,78.05 30.32))",
    };
    for (const [parcelId, geometry] of Object.entries(demoGeometries)) {
      await pool.query(
        `UPDATE land_parcels
         SET geometry = ST_GeomFromText($1, 4326),
             centroid = ST_Centroid(ST_GeomFromText($1, 4326))
         WHERE parcel_id = $2 AND geometry IS NULL`,
        [geometry, parcelId],
      );
    }
    console.log("✅ Parcel geometries ready for spatial lookups");

    // Seed Research Resources
    const researchData = [
      {
        title: "Urban Land Growth Study in Dehradun Region",
        type: "Research",
        category: "Urbanization",
        region: "Dehradun",
        authors: "Dr. Sharma, Dr. Singh",
        organization: "Urban Research Institute",
        year: 2023,
        abstract:
          "A comprehensive study on patterns of urban land growth in the Dehradun region over the past decade.",
        key_findings:
          "Urban expansion at 8% annually, primarily in residential zones",
        source_url: "https://example.com/urban-study",
        license: "CC-BY-4.0",
        tags: "urban,growth,dehradun",
      },
      {
        title: "Land Use Policy Framework 2024",
        type: "Policy",
        category: "Governance",
        region: "Uttarakhand",
        authors: "Ministry of Housing",
        organization: "Government of India",
        year: 2024,
        abstract:
          "Official policy document for land use classification and management.",
        key_findings: "Stricter environmental protections for forest areas",
        source_url: "https://example.com/policy",
        license: "Government",
        tags: "policy,regulation,governance",
      },
      {
        title: "Climate Risk Assessment for Himalayan Regions",
        type: "Research",
        category: "Climate",
        region: "Dehradun",
        authors: "Dr. Kumar, Climate Research Team",
        organization: "Climate Institute",
        year: 2024,
        abstract:
          "Analysis of climate-related risks including flooding and landslides.",
        key_findings: "Flood risk zones increased by 12% in last 5 years",
        source_url: "https://example.com/climate",
        license: "CC-BY-4.0",
        tags: "climate,risk,water",
      },
      {
        title: "Infrastructure Development Guidelines",
        type: "Policy",
        category: "Infrastructure",
        region: "Dehradun",
        authors: "Municipal Corporation",
        organization: "Dehradun Municipal Authority",
        year: 2023,
        abstract:
          "Guidelines for sustainable infrastructure development in urban areas.",
        key_findings: "Green building standards mandatory for new projects",
        source_url: "https://example.com/infra",
        license: "Open Data",
        tags: "infrastructure,development,guidelines",
      },
      {
        title: "Forest Conservation and Land Use Dynamics",
        type: "Dataset",
        category: "Forest",
        region: "Uttarakhand",
        authors: "Forest Department",
        organization: "State Forest Department",
        year: 2024,
        abstract:
          "Comprehensive dataset on forest coverage and land use changes.",
        key_findings: "5% forest area lost to urban expansion",
        source_url: "https://example.com/forest-data",
        license: "Attribution",
        tags: "forest,conservation,biodiversity",
      },
      {
        title: "Case Study: Sustainable Urban Development in Dehradun",
        type: "Case Study",
        category: "Urban Planning",
        region: "Dehradun",
        authors: "Planning Commission",
        organization: "Urban Development Authority",
        year: 2023,
        abstract:
          "Real-world example of sustainable urban development practices.",
        key_findings: "Mixed-use zoning increased economic activity by 25%",
        source_url: "https://example.com/case-study",
        license: "CC-BY-4.0",
        tags: "urban,planning,sustainable",
      },
    ];

    for (const research of researchData) {
      await pool.query(
        `INSERT INTO research_resources 
        (title, type, category, region, authors, organization, year, abstract, key_findings, source_url, license, tags)
        SELECT $1::varchar, $2::varchar, $3::varchar, $4::varchar, $5::varchar, $6::varchar, $7::int, $8::text, $9::text, $10::varchar, $11::varchar, $12::text
        WHERE NOT EXISTS (
          SELECT 1 FROM research_resources WHERE title = $1::varchar
        )`,
        [
          research.title,
          research.type,
          research.category,
          research.region,
          research.authors,
          research.organization,
          research.year,
          research.abstract,
          research.key_findings,
          research.source_url,
          research.license,
          research.tags,
        ],
      );
    }
    console.log("✅ Research resources seeded");

    const sourceCatalog = [
      [
        "land-parcels-demo",
        "Land parcel records",
        "land",
        "Database seed",
        "PostgreSQL/PostGIS",
        "Dehradun demo parcels",
        "BhuDrishti demo dataset",
        "Seeded local records for interface and spatial workflow testing.",
        "Not an official cadastral or title record.",
        "land_parcels",
        null,
      ],
      [
        "research-resources-demo",
        "Research and policy resources",
        "research",
        "Database seed",
        "PostgreSQL",
        "India / Uttarakhand / Dehradun",
        "BhuDrishti research corpus",
        "Curated demonstration metadata used for search and literature context.",
        "Demo records and example URLs require source verification.",
        "research_resources",
        null,
      ],
      [
        "analytics-dehradun-demo",
        "Regional analytics",
        "analytics",
        "Database seed",
        "PostgreSQL",
        "Dehradun",
        "BhuDrishti analytics seed",
        "Aggregated values used for dashboard and simulation context.",
        "Indicative demonstration values; not a validated statistical estimate.",
        "analytics_records",
        "2024-01-01",
      ],
      [
        "land-parcels-geojson",
        "Land parcel GeoJSON layer",
        "gis",
        "Local public asset",
        "GeoJSON",
        "Dehradun map extent",
        "BhuDrishti local asset",
        "Displayed by the Leaflet map from the client public data directory.",
        "Coverage and official status depend on the supplied file.",
        "/data/land-parcels.geojson",
        null,
      ],
      [
        "risk-zones-geojson",
        "Risk zones GeoJSON layer",
        "risk",
        "Local public asset",
        "GeoJSON",
        "Dehradun map extent",
        "BhuDrishti local asset",
        "Used for map visualization and contextual risk display.",
        "Not a certified hazard assessment.",
        "/data/risk-zones.geojson",
        null,
      ],
      [
        "forest-areas-geojson",
        "Forest areas GeoJSON layer",
        "environment",
        "Local public asset",
        "GeoJSON",
        "Dehradun map extent",
        "BhuDrishti local asset",
        "Used for forest context on the map.",
        "Source date and official verification must be supplied with the file.",
        "/data/forest-areas.geojson",
        null,
      ],
      [
        "water-bodies-geojson",
        "Water bodies GeoJSON layer",
        "environment",
        "Local public asset",
        "GeoJSON",
        "Dehradun map extent",
        "BhuDrishti local asset",
        "Used for water context and map inspection.",
        "Source date and official verification must be supplied with the file.",
        "/data/water-bodies.geojson",
        null,
      ],
      [
        "infrastructure-geojson",
        "Infrastructure GeoJSON layer",
        "infrastructure",
        "Local public asset",
        "GeoJSON",
        "Dehradun map extent",
        "BhuDrishti local asset",
        "Used for infrastructure visualization.",
        "Coverage and completeness depend on the supplied file.",
        "/data/infrastructure.geojson",
        null,
      ],
    ];
    for (const source of sourceCatalog) {
      await pool.query(
        `INSERT INTO data_sources
         (source_key, name, data_domain, source_type, format, coverage, publisher, provenance, limitations, path_or_endpoint, last_updated)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (source_key) DO UPDATE SET
           name = EXCLUDED.name, data_domain = EXCLUDED.data_domain,
           source_type = EXCLUDED.source_type, format = EXCLUDED.format,
           coverage = EXCLUDED.coverage, publisher = EXCLUDED.publisher,
           provenance = EXCLUDED.provenance, limitations = EXCLUDED.limitations,
           path_or_endpoint = EXCLUDED.path_or_endpoint, last_updated = EXCLUDED.last_updated`,
        source,
      );
    }
    console.log("✅ Data source catalog seeded");

    // Seed Analytics Records
    const analyticsData = {
      region: "Dehradun",
      total_parcels: 1250,
      residential_parcels: 420,
      agricultural_parcels: 310,
      forest_parcels: 280,
      builtup_parcels: 240,
      low_risk: 550,
      medium_risk: 450,
      high_risk: 250,
      total_area: 125000,
      year: 2024,
    };

    await pool.query(
      `INSERT INTO analytics_records 
      (region, total_parcels, residential_parcels, agricultural_parcels, forest_parcels, builtup_parcels, low_risk, medium_risk, high_risk, total_area, year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (region, year) DO NOTHING`,
      [
        analyticsData.region,
        analyticsData.total_parcels,
        analyticsData.residential_parcels,
        analyticsData.agricultural_parcels,
        analyticsData.forest_parcels,
        analyticsData.builtup_parcels,
        analyticsData.low_risk,
        analyticsData.medium_risk,
        analyticsData.high_risk,
        analyticsData.total_area,
        analyticsData.year,
      ],
    );
    console.log("✅ Analytics records seeded");

    console.log("✅ Database seeding complete!");
    return true;
  } catch (err) {
    console.error("❌ Database seeding failed:", err);
    throw err;
  }
};

export default seedDatabase;
