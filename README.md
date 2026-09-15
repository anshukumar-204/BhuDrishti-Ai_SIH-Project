# BhuDrishti AI

BhuDrishti AI ek land-intelligence platform hai jo land parcels, land use, risk zones, climate risk, verification, analytics aur AI-based decision support provide karta hai.

> This is an MVP/demo project. Backend currently mock data use karta hai. Ye official government land-record system nahi hai.

## Features

- Land Explorer with interactive GIS layers
- Parcel and land-use information
- Risk and climate-risk analysis
- Analytics dashboard
- LandCheck workflow
- AI Insights
- Policy Simulation
- Verification workflow
- Research Hub
- User login and protected routes
- GeoJSON-based map layers

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- GeoJSON map data

### Backend

- Node.js
- Express.js
- REST API
- Mock data layer
- Authentication middleware

### AI Service

- Python
- FastAPI
- Uvicorn
- Pydantic

### GIS and Database

- GeoJSON
- Python GIS processing scripts
- PostgreSQL/PostGIS schema planned for future use

## Project Structure

```text
bhudrishti-ai-mvp/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # API clients
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth and shared state
│   │   └── pages/           # Application pages
│   ├── public/data/         # GeoJSON map layers
│   └── package.json
│
├── server/                  # Express backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Request logic
│   │   ├── middleware/      # Authentication middleware
│   │   └── data/            # Mock data
│   └── package.json
│
├── ai-service/              # FastAPI service
│   ├── app/main.py
│   └── requirements.txt
│
├── data-pipeline/           # GIS processing scripts
├── database/                # SQL/PostGIS schemas
├── docs/                    # Project documentation
└── README.md
```

## Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page |
| `/land-explorer` | Public | Land and map exploration |
| `/research` | Public | Research Hub |
| `/login` | Public | Demo login |
| `/analytics` | Protected | Analytics dashboard |
| `/land-check` | Protected | LandCheck analysis |
| `/ai-insights` | Protected | AI decision support |
| `/policy-simulation` | Protected | Policy scenario testing |
| `/verification` | Protected | Verification workflow |
| `/dashboard` | Protected | User dashboard |
| `/profile` | Protected | User profile |

## API Endpoints

### Express API

Base URL:

```text
http://localhost:5000/api
```

| Endpoint | Description |
|---|---|
| `/auth` | Login and authentication |
| `/lands` | Land and parcel data |
| `/analytics` | Analytics data |
| `/research` | Research data |
| `/land-check` | LandCheck operations |
| `/ai` | AI-related operations |
| `/simulation` | Policy simulations |
| `/verification` | Verification operations |
| `/health` | Backend health check |

### FastAPI AI Service

Base URL:

```text
http://localhost:8000
```

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Service health |
| `/insights` | POST | Generate parcel insights |

Example request:

```json
{
  "parcel_id": "P-001",
  "land_use": "agricultural",
  "risk_level": "medium"
}
```

## Requirements

Install the following software:

- Git
- Node.js 18 or later
- npm
- Python 3.10 or later
- pip

Check installation:

```powershell
git --version
node --version
npm --version
python --version
pip --version
```

## Start Project from GitHub

### 1. Clone Repository

```powershell
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd bhudrishti-ai-mvp
```

Replace `YOUR_USERNAME/YOUR_REPOSITORY` with the actual GitHub repository URL.

### 2. Start Backend

Open a new PowerShell terminal:

```powershell
cd server
npm install
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

### 3. Start Frontend

Open another PowerShell terminal from the project root:

```powershell
cd client
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

### 4. Start AI Service

Open another PowerShell terminal:

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

AI service will run at:

```text
http://localhost:8000
```

If PowerShell activation is blocked, run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then activate the environment again:

```powershell
.\.venv\Scripts\Activate.ps1
```

## Environment Configuration

Usually no environment file is required for local development.

If the backend URL is different, create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit passwords, tokens, API keys, `.env` files, or virtual environments to GitHub.

## Run GIS Processing

```powershell
cd data-pipeline
python scripts/process_geojson.py
```

Processed GeoJSON files should be placed in:

```text
client/public/data/
```

## Build Frontend

```powershell
cd client
npm run build
```

Preview the production build:

```powershell
npm run preview
```

## Health Checks

Backend:

```powershell
curl http://localhost:5000/api/health
```

AI service:

```powershell
curl http://localhost:8000/health
```

## GitHub Commands

Check changed files:

```powershell
git status
```

Add changes:

```powershell
git add .
```

Create commit:

```powershell
git commit -m "Update BhuDrishti AI project"
```

Push to GitHub:

```powershell
git push origin main
```

If the branch is named `master`:

```powershell
git push origin master
```

## Important Notes

- Backend currently mock data use karta hai.
- PostgreSQL/PostGIS schema future persistence ke liye prepared hai.
- AI service abhi lightweight decision-support service hai.
- Authentication demo purpose ke liye hai.
- Production deployment se pehle proper database, authentication, validation, authorization, logging aur security add karni hogi.
- `node_modules/`, `.venv/`, `.env` aur build files ko GitHub par commit na karein.

## License

This project is intended for educational, demonstration and MVP development purposes.
