# BhuDrishti AI — Land Intelligence Platform

BhuDrishti AI ek AI-enabled land intelligence platform hai jo land governance, parcel analysis, policy simulation, risk assessment, aur research insights ko ek hi dashboard mein collect karta hai.

Is project ka primary purpose hai:

- land parcels ko explore karna
- risk aur land-use analysis karna
- policy scenarios simulate karna
- research aur verification support dena
- decision-making ko data-driven banana

---

## 1) Project ka simple understanding

Yeh project 6 major parts mein divide hai:

### Team 1 — Frontend / UX

Folder: `client/`

- React + Vite app
- UI pages, dashboards, map, navigation, forms
- User ka entry point hai
- Normal access URL: http://localhost:5173

### Team 2 — Backend API

Folder: `server/`

- Express.js server
- All APIs serve karta hai
- Frontend ke requests ko handle karta hai
- Base URL: http://localhost:5000

### Team 3 — AI Service

Folder: `ai-service/`

- FastAPI service
- AI-based insights and decision support
- Base URL: http://localhost:8000

### Team 4 — Data Pipeline / GIS Data

Folder: `data-pipeline/`

- GeoJSON processing and spatial dataset handling
- Land maps, risk zones, water bodies, infrastructure, parcels, forest area

### Team 5 — Database / Schema

Folder: `database/`

- SQL schema files
- User, land parcel, audit logs related data model

### Team 6 — Documentation / Architecture

Folder: `docs/`

- Architecture and project explanation
- Demo script and project overview

---

## 2) Project architecture

User UI -> Frontend (`client`) -> Backend API (`server`) -> AI Service (`ai-service`)

Simple flow is:

1. User browser frontend open karta hai
2. Frontend API calls backend server se
3. Backend data analytics, land check, verification, research APIs provide karta hai
4. AI service additional insights generate karta hai
5. GeoJSON / GIS files aur database files project ke datasets supply karte hain

---

## 3) Required tools

Before running project, make sure you have:

- Node.js 18+
- npm
- Python 3.10+
- pip

---

## 4) How to run the project locally

### Step 1: Start Backend

Open terminal in `server/` folder:

```bash
cd server
npm install
npm run dev
```

Backend will run on:

- http://localhost:5000

Check health:

```bash
curl http://localhost:5000/api/health
```

---

### Step 2: Start Frontend

Open another terminal in `client/` folder:

```bash
cd client
npm install
npm run dev
```

Frontend will run on:

- http://localhost:5173

Open browser and go to:

- http://localhost:5173

---

### Step 3: Start AI Service

Open another terminal in `ai-service/` folder:

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

AI service will run on:

- http://localhost:8000

Check health:

```bash
curl http://localhost:8000/health
```

---

### Step 4: Data pipeline (optional but important for GIS data)

Open terminal in project root or `data-pipeline/`:

```bash
cd data-pipeline
python scripts/process_geojson.py
```

This prepares or processes GIS geospatial data used in the app.

---

## 5) Main access points for all teams

### For frontend team

- Work in `client/src/`
- Main app route file: `client/src/App.jsx`
- UI pages under `client/src/pages/`
- Map and layout components under `client/src/components/`

### For backend team

- Work in `server/src/`
- Main server setup: `server/src/app.js`
- Routes under `server/src/routes/`
- Controllers under `server/src/controllers/`

### For AI team

- Work in `ai-service/app/`
- Main app: `ai-service/app/main.py`
- AI endpoints available under FastAPI app

### For GIS/data team

- Work in `data-pipeline/scripts/`
- GeoJSON files are under `client/public/data/`
- These data files drive map layers and land intelligence visualizations

### For database team

- Work in `database/schema/`
- Main SQL files under `database/schema/`
- Table design includes users, land parcels, audit logs

### For documentation/architecture team

- Work in `docs/`
- Use `docs/project/project-overview.md` and `docs/architecture/system-architecture.md`

---

## 6) Important folders and files

```text
bhudrishti-ai-mvp/
├── client/                  # Frontend React app
│   ├── src/
│   ├── public/data/         # GeoJSON datasets
│   └── package.json
├── server/                  # Backend Express API
│   ├── src/
│   └── package.json
├── ai-service/              # AI FastAPI service
│   ├── app/
│   └── requirements.txt
├── data-pipeline/           # GIS processing scripts
│   └── scripts/
├── database/                # SQL schema and database design
│   └── schema/
├── docs/                    # Project docs and architecture
├── README.md                # Project entry point
└── package-lock.json / etc.
```

---

## 7) Project features summary

- Land Explorer for parcel data
- Analytics dashboard for land trends
- AI Insights for decision support
- Policy Simulation for scenario testing
- Verification workflow for validation
- Research Hub with curated data and knowledge

---

## 8) Quick start for judges / teams

If you want to run the whole app quickly:

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- AI service: http://localhost:8000

---

## 9) Note

This project is built as a demo / hackathon MVP and is designed for land intelligence and governance support. It is a decision-support platform, not an official legal land authority system.

---

## 10) Final purpose

Yeh project ek unified platform hai jahan:

- UI user ko experience deta hai
- API backend logic ko support karta hai
- AI service insight generate karta hai
- Data pipeline GIS datasets supply karta hai
- Database project information store karta hai
- Documentation sab ko samajhne ke liye help karta hai

Agar aapko project ko samajhna hai, toh sabse pehle `client` ko open karke frontend dekhna, phir `server` API ko understand karna, aur last mein `ai-service` aur `data-pipeline` ko inspect karna best approach hai.

---

## 11) Useful commands summary

```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npm run dev

# AI service
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Data pipeline
cd data-pipeline
python scripts/process_geojson.py
```

This README is designed to help all 6 teams understand project structure, access points, and how the full app connects together.
