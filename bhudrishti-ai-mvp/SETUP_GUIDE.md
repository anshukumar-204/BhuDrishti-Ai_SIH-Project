# BhuDrishti AI - Backend Setup & Deployment Guide

## 🚀 Quick Start (Windows)

### Prerequisites

- PostgreSQL 14+ with PostGIS extension
- Node.js 18+
- Python 3.10+ (for data pipeline)

### Step 1: Install Dependencies

```bash
# Navigate to server directory
cd server
npm install

# Navigate to client directory
cd ../client
npm install

# Navigate to AI service directory
cd ../ai-service
pip install -r requirements.txt
```

### Step 2: Setup PostgreSQL Database

```bash
# Create database (Windows PowerShell or Command Prompt)
psql -U postgres -c "CREATE DATABASE bhudrishti;"
psql -U postgres -d bhudrishti -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### Step 3: Configure Environment

Create `.env` file in `server/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/bhudrishti
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=bhudrishti

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_very_long_random_secret_key_min_32_chars_recommended
JWT_EXPIRE=7d

# AI Service Configuration
AI_SERVICE_URL=http://localhost:8000
AI_API_KEY=your_ai_service_key

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Start Services

**Terminal 1 - Backend Server:**

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend Client:**

```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

**Terminal 3 - AI Service:**

```bash
cd ai-service
python -m uvicorn app.main:app --reload --host localhost --port 8000
# AI service runs on http://localhost:8000
```

## 📊 Database Architecture

### Core Tables

1. **users** - User accounts and authentication
2. **land_parcels** - GIS parcel data with PostGIS geometry
3. **research_resources** - Research papers, policies, datasets
4. **analytics_records** - Regional statistics and trends
5. **verification_records** - SHA-256 document integrity
6. **simulations** - Policy simulation results
7. **audit_logs** - Action logging and compliance

### Database Auto-Initialization

When the server starts, it will:

1. ✅ Create all tables with proper schema
2. ✅ Seed demonstration data (5 parcels, 6 research items, analytics)
3. ✅ Create necessary indexes for performance

**No manual SQL migration needed!**

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (returns JWT)
- `GET /api/auth/me` - Get current user (requires auth)

### Land Parcels (Public)

- `GET /api/lands/` - Get all parcels
- `GET /api/lands/:id` - Get parcel by ID or parcel_id
- `GET /api/lands/search/:query` - Search parcels
- `GET /api/lands/location/:locality` - Get parcels by location
- `GET /api/lands/type/:landUse` - Get parcels by land use type
- `GET /api/lands/risk/:riskLevel` - Get parcels by risk level

### Land Check (Protected)

- `GET /api/land-check/?query=...` - Search parcel with context
- `GET /api/land-check/:parcelId` - Get parcel details

### Analytics (Protected)

- `GET /api/analytics/` - Get latest analytics summary
- `GET /api/analytics/summary/:region` - Get region analytics
- `GET /api/analytics/land-use/:region` - Get land use distribution
- `GET /api/analytics/risk/:region` - Get risk distribution
- `GET /api/analytics/trends/:region` - Get multi-year trends

### Research Hub (Public)

- `GET /api/research/` - Get all research (with filters)
- `GET /api/research/:id` - Get research by ID
- `GET /api/research/type/:type` - Get research by type
- `GET /api/research/region/:region` - Get research by region
- `GET /api/research/stats/overview` - Get research statistics

### AI Insights (Protected)

- `POST /api/ai/insight` - Generate AI insight for parcel

### Policy Simulation (Protected)

- `POST /api/simulation/` - Run scenario simulation
- `GET /api/simulation/:id` - Get simulation results
- `GET /api/simulation/` - List user's simulations

### Document Verification (Protected)

- `POST /api/verification/hash` - Upload and hash document
- `POST /api/verification/verify` - Verify document integrity
- `GET /api/verification/records` - Get user's verification records
- `GET /api/verification/record/:id` - Get verification details

### Health Check

- `GET /api/health` - Health status

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- `public` - Default public access
- `researcher` - Regular authenticated users
- `admin` - Administrative access

## 📈 Database Metrics

After seeding, the database contains:

- **5 land parcels** (Dehradun sample data)
- **6 research resources** (Mix of papers, policies, datasets, case studies)
- **1 analytics record** (Dehradun 2024 data)
  - Total parcels: 1,250
  - Residential: 420
  - Agricultural: 310
  - Forest: 280
  - Built-up: 240
  - Risk distribution: Low (550), Medium (450), High (250)

## 🐛 Troubleshooting

### Connection Error to Database

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Make sure PostgreSQL is running:

```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Or restart PostgreSQL service in Services
```

### PostGIS Extension Not Found

```bash
# Connect to database and install
psql -U postgres -d bhudrishti
# Inside psql:
CREATE EXTENSION IF NOT EXISTS postgis;
\dx  -- verify extension is installed
```

### Port Already in Use

```bash
# Change port in .env
PORT=5001

# Or kill process using port 5000 (Windows):
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## 📚 Important Notes for SIH Demo

### Data Labels

- All numeric claims are labeled as "Demo/Indicative"
- "Real-time GIS" → "Interactive GIS"
- Research count shows actual database count
- Analytics show sample 2024 Dehradun data

### Security Features

- SHA-256 document verification ✓
- JWT authentication ✓
- RBAC (role-based access control) ✓
- Rate limiting (100 requests/15 min) ✓
- Audit logging ✓
- Helmet security headers ✓

### AI Features

- Structured insight generation ✓
- Context-aware recommendations ✓
- Evidence-based explanations ✓
- Proper disclaimers on all predictions ✓

### GIS Features

- PostGIS geometry storage ✓
- Spatial indexing ✓
- Ready for distance/intersection queries ✓

## 🚀 Production Deployment

### Before Deploying:

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET (64+ random chars)
3. Configure proper DATABASE_URL with SSL
4. Set up CORS_ORIGIN to production domain
5. Enable rate limiting appropriately
6. Set up monitoring and logging

### Example Production .env:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@prod-db.internal:5432/bhudrishti?sslmode=require
JWT_SECRET=<64_char_random_secret>
CORS_ORIGIN=https://yourdomain.com
```

## 📞 Support

For issues or questions:

1. Check server logs: `npm run dev`
2. Verify database connection: `psql -d bhudrishti -c "SELECT version();"`
3. Check API health: `curl http://localhost:5000/api/health`

---

**BhuDrishti AI - Making Land Intelligence Accessible** 🌍
