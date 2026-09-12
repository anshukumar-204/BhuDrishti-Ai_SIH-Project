# BhuDrishti AI - API Documentation

## Authentication

### Register New User

**POST** `/api/auth/register`

Request:

```json
{
  "name": "John Researcher",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response (201):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Researcher",
      "email": "john@example.com",
      "role": "researcher",
      "organization": null
    }
  }
}
```

### Login

**POST** `/api/auth/login`

Request:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

Response (200):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

### Get Current User

**GET** `/api/auth/me`

Headers:

```
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Researcher",
      "email": "john@example.com",
      "role": "researcher"
    }
  }
}
```

## Land Parcels API

### Get All Parcels

**GET** `/api/lands/`

Response:

```json
{
  "success": true,
  "data": {
    "total": 5,
    "parcels": [
      {
        "id": 1,
        "parcel_id": "UK-DDN-001",
        "survey_number": "123/456",
        "locality": "Rajpur Road",
        "ward_zone": "Zone A",
        "land_use": "Residential",
        "category": "Private",
        "area": 1200,
        "risk_level": "Low",
        "risk_factors": "Standard residential zone",
        "environmental_risk": "Low",
        "development_risk": "Low",
        "data_source": "Demo Spatial Dataset",
        "last_updated": "2024-09-04T..."
      }
    ]
  }
}
```

### Get Parcel by ID

**GET** `/api/lands/:id`

Response:

```json
{
  "success": true,
  "data": { ... parcel object ... }
}
```

### Search Parcels

**GET** `/api/lands/search/:query`

Query parameters:

- `query`: Search string (parcel_id, survey_number, or locality)

Response:

```json
{
  "success": true,
  "data": {
    "query": "Rajpur",
    "results": [ ... ],
    "count": 1
  }
}
```

## Land Check API

### Search with Context

**GET** `/api/land-check/?query=UK-DDN-001`

Response:

```json
{
  "success": true,
  "data": {
    "parcel": {
      "parcel_id": "UK-DDN-001",
      "survey_number": "123/456",
      "locality": "Rajpur Road",
      "land_use": "Residential",
      "area": 1200,
      "risk_level": "Low",
      "risk_factors": "Standard residential zone",
      "data_source": "Demo/Authorized Spatial Dataset",
      "last_updated": "2024-09-04T..."
    },
    "nearbyFeatures": [{ "name": "Road network", "distance": "Direct access" }],
    "relatedResearch": [
      {
        "id": 1,
        "title": "Urban Land Growth Study",
        "type": "Research",
        "year": 2023
      }
    ],
    "disclaimer": "This is research and decision-support information only...",
    "dataSource": "Demo/Authorized Spatial Dataset",
    "confidence": "Dataset-dependent"
  }
}
```

## Analytics API

### Get Latest Summary

**GET** `/api/analytics/`

Response:

```json
{
  "success": true,
  "data": {
    "region": "Dehradun",
    "year": 2024,
    "totalParcels": 1250,
    "residential": 420,
    "agricultural": 310,
    "forest": 280,
    "builtup": 240,
    "lowRisk": 550,
    "mediumRisk": 450,
    "highRisk": 250,
    "totalArea": 125000,
    "calculatedAt": "2024-09-04T..."
  }
}
```

### Get Land Use Distribution

**GET** `/api/analytics/land-use/:region`

Response:

```json
{
  "success": true,
  "data": {
    "region": "Dehradun",
    "year": 2024,
    "distribution": {
      "residential": 420,
      "agricultural": 310,
      "forest": 280,
      "builtup": 240
    },
    "dataType": "Indicative Demo Data"
  }
}
```

### Get Risk Distribution

**GET** `/api/analytics/risk/:region`

Response:

```json
{
  "success": true,
  "data": {
    "region": "Dehradun",
    "year": 2024,
    "distribution": {
      "low": 550,
      "medium": 450,
      "high": 250
    },
    "riskBasis": "Based on available dataset: proximity to water, slope, infrastructure context"
  }
}
```

### Get Trends

**GET** `/api/analytics/trends/:region`

Response:

```json
{
  "success": true,
  "data": {
    "region": "Dehradun",
    "trends": [
      {
        "year": 2024,
        "totalParcels": 1250,
        "residential": 420,
        "agricultural": 310,
        "lowRisk": 550,
        "mediumRisk": 450,
        "highRisk": 250
      }
    ],
    "note": "Demonstration trend data based on available dataset"
  }
}
```

## Research Hub API

### Get All Research (with Filters)

**GET** `/api/research/?type=Research&region=Dehradun&limit=10&offset=0`

Query parameters:

- `type`: Filter by type (Research, Policy, Dataset, Case Study)
- `category`: Filter by category
- `region`: Filter by region
- `search`: Search in title/abstract
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

Response:

```json
{
  "success": true,
  "data": {
    "total": 3,
    "count": 3,
    "offset": 0,
    "resources": [
      {
        "id": 1,
        "title": "Urban Land Growth Study in Dehradun Region",
        "type": "Research",
        "category": "Urbanization",
        "region": "Dehradun",
        "authors": "Dr. Sharma, Dr. Singh",
        "organization": "Urban Research Institute",
        "year": 2023,
        "abstract": "A comprehensive study...",
        "key_findings": "Urban expansion at 8% annually...",
        "source_url": "https://example.com/urban-study",
        "license": "CC-BY-4.0",
        "published_date": "2023-06-15"
      }
    ]
  }
}
```

### Get Research Statistics

**GET** `/api/research/stats/overview`

Response:

```json
{
  "success": true,
  "data": {
    "total": 6,
    "byType": {
      "Research": 2,
      "Policy": 2,
      "Dataset": 1,
      "Case Study": 1
    },
    "byCategory": {
      "Urbanization": 2,
      "Governance": 1,
      "Climate": 1
    },
    "byRegion": {
      "Dehradun": 5,
      "Uttarakhand": 1
    }
  }
}
```

## AI Insights API (Protected)

### Generate Insight

**POST** `/api/ai/insight`

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "parcelId": "UK-DDN-001",
  "locality": "Rajpur Road",
  "landUse": "Residential",
  "riskLevel": "Low",
  "area": 1200
}
```

Response:

```json
{
  "success": true,
  "data": {
    "parcelId": "UK-DDN-001",
    "insight": {
      "summary": "UK-DDN-001 displays residential development context with low mapped risk...",
      "observedSignals": [
        "Land Use: Residential (Private category)",
        "Risk Level: Low - Standard residential zone",
        "Environmental Context: Low environmental risk",
        "Development Context: Low development pressure"
      ],
      "potentialConsiderations": [
        "Review zoning and land-use policy for Residential in Rajpur Road",
        "Validate with official records..."
      ],
      "recommendedNextSteps": [
        "Review official zoning documentation",
        "Consult with municipal planning authority",
        "Validate boundaries with official cadastral records"
      ],
      "evidence": {
        "parcelDataset": "✓ Land parcel records",
        "riskLayer": "✓ Risk assessment data",
        "infrastructureContext": "✓ Infrastructure mapping",
        "researchResources": "✓ 3 related research items",
        "analyticsContext": "✓ Regional analytics"
      },
      "limitations": [
        "Based on available demonstration dataset",
        "Risk assessment is indicative, not scientifically validated prediction",
        "Should not be used as sole basis for legal or investment decisions"
      ]
    },
    "relatedResearch": [ ... ],
    "disclaimer": "Based on available dataset...",
    "timestamp": "2024-09-04T..."
  }
}
```

## Policy Simulation API (Protected)

### Run Simulation

**POST** `/api/simulation/`

Headers:

```
Authorization: Bearer <token>
```

Request:

```json
{
  "region": "Dehradun",
  "scenarioName": "Urban Development",
  "areaHectares": 500
}
```

Response:

```json
{
  "success": true,
  "data": {
    "simulationId": 1,
    "region": "Dehradun",
    "scenario": "Urban Development",
    "areaHectares": 500,
    "results": {
      "agriculturalImpact": 42,
      "environmentalRisk": 28,
      "infrastructurePressure": 36,
      "developmentPotential": 69
    },
    "disclaimer": "Indicative scenario-based decision-support model. NOT a scientifically validated prediction...",
    "riskFactors": {
      "agriculturalImpact": "Based on land-use conversion and productivity loss estimate",
      "environmentalRisk": "Based on ecosystem sensitivity and protection criteria",
      "infrastructurePressure": "Based on density and service capacity indicators",
      "developmentPotential": "Based on zoning and regulatory framework"
    },
    "methodology": "Indicative scenario simulation for planning discussion",
    "createdAt": "2024-09-04T..."
  }
}
```

## Document Verification API (Protected)

### Upload and Hash Document

**POST** `/api/verification/hash`

Headers:

```
Authorization: Bearer <token>
Content-Type: application/octet-stream
X-File-Name: policy-2024.pdf
```

Body: Binary file content

Response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "fileName": "policy-2024.pdf",
    "hash": "a1b2c3d4...",
    "algorithm": "SHA-256",
    "createdAt": "2024-09-04T...",
    "message": "Document hash generated and stored for verification"
  }
}
```

### Verify Document

**POST** `/api/verification/verify?recordId=1`

Headers:

```
Authorization: Bearer <token>
Content-Type: application/octet-stream
```

Body: Binary file content to verify

Response (MATCH):

```json
{
  "success": true,
  "data": {
    "verified": true,
    "newHash": "a1b2c3d4...",
    "storedHash": "a1b2c3d4...",
    "status": "MATCH ✓",
    "message": "✓ File integrity verified - hash matches exactly",
    "verifiedFile": "policy-2024.pdf",
    "verifiedAt": "2024-09-04T...",
    "algorithm": "SHA-256",
    "disclaimer": "Hash verification confirms file integrity but does not verify content authenticity..."
  }
}
```

Response (MISMATCH):

```json
{
  "success": true,
  "data": {
    "verified": false,
    "newHash": "x1y2z3w4...",
    "storedHash": "a1b2c3d4...",
    "status": "MISMATCH ✗",
    "message": "✗ File integrity check failed - hash does not match. File may have been modified."
  }
}
```

## Health Check

### API Health Status

**GET** `/api/health`

Response:

```json
{
  "status": "ok",
  "service": "BhuDrishti AI",
  "timestamp": "2024-09-04T..."
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Authentication required" or "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Server error description"
}
```

## Rate Limiting

All API endpoints are rate-limited:

- **Default**: 100 requests per 15 minutes per IP
- **Headers**: `RateLimit-*` headers included in responses

## CORS

CORS is enabled for:

- Default: `http://localhost:5173` (development)
- Production: Configure via `CORS_ORIGIN` environment variable

---

**Last Updated**: September 4, 2024
**Version**: 1.0.0
