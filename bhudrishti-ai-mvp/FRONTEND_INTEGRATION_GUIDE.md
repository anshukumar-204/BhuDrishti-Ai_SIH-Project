# BhuDrishti AI - Frontend Integration Guide

## Quick Start for Frontend Team

### API Base URL

```javascript
// Development
const API_BASE = "http://localhost:5000/api";

// Production
const API_BASE = "https://api.yourdomain.com/api";
```

### Authentication Pattern

All protected endpoints require JWT token in Authorization header:

```javascript
// After login, store the token
const token = response.data.token;
localStorage.setItem("token", token);

// Use in all requests
fetch(`${API_BASE}/analytics`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## Frontend Components to Update

### 1. API Client Files (`client/src/api/`)

#### authApi.js

```javascript
// Update to use actual backend
export const register = (name, email, password) => {
  return apiClient.post("/auth/register", {
    name,
    email,
    password,
  });
};

export const login = (email, password) => {
  return apiClient.post("/auth/login", {
    email,
    password,
  });
};

export const getCurrentUser = () => {
  return apiClient.get("/auth/me");
};
```

#### landApi.js

```javascript
export const getAllLands = () => {
  return apiClient.get("/lands");
};

export const getLandById = (id) => {
  return apiClient.get(`/lands/${id}`);
};

export const searchLands = (query) => {
  return apiClient.get(`/lands/search/${query}`);
};

export const getLandsByLocation = (locality) => {
  return apiClient.get(`/lands/location/${locality}`);
};

export const getLandsByType = (landUse) => {
  return apiClient.get(`/lands/type/${landUse}`);
};

export const getLandsByRisk = (riskLevel) => {
  return apiClient.get(`/lands/risk/${riskLevel}`);
};
```

#### landCheckApi.js

```javascript
export const searchWithContext = (query) => {
  return apiClient.get(`/land-check/?query=${query}`);
};

export const getParcelDetails = (parcelId) => {
  return apiClient.get(`/land-check/${parcelId}`);
};
```

#### analyticsApi.js

```javascript
export const getAnalyticsSummary = () => {
  return apiClient.get("/analytics");
};

export const getRegionAnalytics = (region) => {
  return apiClient.get(`/analytics/summary/${region}`);
};

export const getLandUseDistribution = (region) => {
  return apiClient.get(`/analytics/land-use/${region}`);
};

export const getRiskDistribution = (region) => {
  return apiClient.get(`/analytics/risk/${region}`);
};

export const getTrends = (region) => {
  return apiClient.get(`/analytics/trends/${region}`);
};
```

#### simulationApi.js

```javascript
export const runSimulation = (region, scenarioName, areaHectares) => {
  return apiClient.post("/simulation", {
    region,
    scenarioName,
    areaHectares,
  });
};

export const getSimulation = (id) => {
  return apiClient.get(`/simulation/${id}`);
};

export const getUserSimulations = () => {
  return apiClient.get("/simulation");
};
```

#### aiApi.js

```javascript
export const generateInsight = (parcelData) => {
  return apiClient.post("/ai/insight", {
    parcelId: parcelData.parcel_id,
    locality: parcelData.locality,
    landUse: parcelData.land_use,
    riskLevel: parcelData.risk_level,
    area: parcelData.area,
  });
};
```

#### verificationApi.js

```javascript
export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post("/verification/hash", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const verifyDocument = (file, recordId) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post(`/verification/verify?recordId=${recordId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getVerificationRecords = () => {
  return apiClient.get("/verification/records");
};

export const getVerificationRecord = (id) => {
  return apiClient.get(`/verification/record/${id}`);
};
```

### 2. Page Components to Update

#### pages/Home/Home.jsx

- Test GET /api/health for backend connectivity
- Show data from GET /api/lands (recent parcels count)
- Show research count from GET /api/research

#### pages/LandExplorer/LandExplorer.jsx

- Use GET /api/lands for parcel list
- Use GET /api/lands/search/:query for searching
- Use GET /api/lands/location/:locality for location filter
- Use GET /api/lands/type/:landUse for land use filter
- Use GET /api/lands/risk/:riskLevel for risk filter

#### pages/LandCheck/LandCheck.jsx

- Use GET /api/land-check/?query=... for searching
- Use GET /api/land-check/:parcelId for direct lookup
- Display related research from response
- Show disclaimer from response

#### pages/Analytics/Analytics.jsx

- Use GET /api/analytics/ for summary
- Use GET /api/analytics/land-use/:region for pie chart
- Use GET /api/analytics/risk/:region for risk breakdown
- Use GET /api/analytics/trends/:region for trend chart

#### pages/ResearchHub/ResearchHub.jsx

- Use GET /api/research/ with query parameters
- Support filters: ?type=Research&category=...&search=...
- Use GET /api/research/stats/overview for statistics

#### pages/AIInsights/AIInsights.jsx

- Use POST /api/ai/insight with parcel data
- Display insight summary
- Show observed signals
- Display related research and evidence
- Prominent disclaimer about indicative nature

#### pages/PolicySimulation/PolicySimulation.jsx

- Use POST /api/simulation/ to create scenario
- Use GET /api/simulation/:id to fetch results
- Use GET /api/simulation/ to list user's simulations
- Display impact metrics with proper disclaimers
- Show methodology and risk factors

#### pages/Verification/Verification.jsx

- Use POST /api/verification/hash to upload document
- Use POST /api/verification/verify to verify
- Show MATCH/MISMATCH status
- Use GET /api/verification/records to list history

#### pages/Auth/Login.jsx

- Use POST /api/auth/register for signup
- Use POST /api/auth/login for login
- Store returned token in localStorage
- Redirect authenticated users to dashboard

## Data Structure Examples

### Parcel Object (from /api/lands)

```javascript
{
  id: 1,
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
  last_updated: "2024-09-04T..."
}
```

### Research Object (from /api/research)

```javascript
{
  id: 1,
  title: "Urban Land Growth Study in Dehradun Region",
  type: "Research", // or "Policy", "Dataset", "Case Study"
  category: "Urbanization",
  region: "Dehradun",
  authors: "Dr. Sharma, Dr. Singh",
  organization: "Urban Research Institute",
  year: 2023,
  abstract: "A comprehensive study...",
  key_findings: "Urban expansion at 8% annually...",
  source_url: "https://example.com/...",
  license: "CC-BY-4.0",
  published_date: "2023-06-15"
}
```

### Analytics Object (from /api/analytics)

```javascript
{
  region: "Dehradun",
  year: 2024,
  totalParcels: 1250,
  residential: 420,
  agricultural: 310,
  forest: 280,
  builtup: 240,
  lowRisk: 550,
  mediumRisk: 450,
  highRisk: 250,
  totalArea: 125000,
  calculatedAt: "2024-09-04T..."
}
```

### AI Insight Object (from POST /api/ai/insight)

```javascript
{
  parcelId: "UK-DDN-001",
  insight: {
    summary: "...",
    observedSignals: [...],
    potentialConsiderations: [...],
    recommendedNextSteps: [...],
    evidence: {
      parcelDataset: "✓",
      riskLayer: "✓",
      infrastructureContext: "✓",
      researchResources: "✓",
      analyticsContext: "✓"
    },
    limitations: [...]
  },
  relatedResearch: [...],
  disclaimer: "...",
  timestamp: "..."
}
```

### Simulation Result (from POST /api/simulation)

```javascript
{
  simulationId: 1,
  region: "Dehradun",
  scenario: "Urban Development",
  areaHectares: 500,
  results: {
    agriculturalImpact: 42,
    environmentalRisk: 28,
    infrastructurePressure: 36,
    developmentPotential: 69
  },
  disclaimer: "...",
  riskFactors: {...},
  methodology: "...",
  createdAt: "..."
}
```

## Error Handling Pattern

```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const response = await apiFunction();
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    } else if (error.response?.status === 403) {
      // User doesn't have permission
      console.error("Permission denied");
    } else if (error.response?.status === 404) {
      // Resource not found
      console.error("Not found");
    } else {
      // Other error
      console.error("API Error:", error.message);
    }
    throw error;
  }
};
```

## Context Updates Needed

### AuthContext.jsx

```javascript
// Should use /api/auth/register and /api/auth/login
// Store token from response
// Provide getCurrentUser() using /api/auth/me
```

### LandContext.jsx

```javascript
// Should use /api/lands for parcel data
// Support search, filter, location-based queries
// Cache results to avoid repeated calls
```

## Testing Checklist

Before demo on Sept 6:

- [ ] All API calls work from frontend
- [ ] Login/register flow works
- [ ] Land Explorer shows real parcel data
- [ ] LandCheck returns contextual data
- [ ] Analytics displays real data
- [ ] AI generates insights with evidence
- [ ] Simulation runs and stores results
- [ ] Verification works (SHA-256 matching)
- [ ] Protected routes require authentication
- [ ] Rate limiting not triggered during normal use
- [ ] No console errors
- [ ] Responsive on mobile/tablet

## Performance Tips

1. **Cache API calls** - Use Context/Redux to avoid repeated calls
2. **Lazy load** - Load data only when page is opened
3. **Pagination** - Research endpoint supports limit/offset
4. **Debounce search** - Wait for user to stop typing before searching
5. **Error boundaries** - Wrap components to catch API errors gracefully

---

**Integration Target Date**: September 5, 2024
**Testing Deadline**: September 6, 2024
**Demo Date**: September 6, 2024
