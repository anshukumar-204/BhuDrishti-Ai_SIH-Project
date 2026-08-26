# System architecture

React/Vite serves the public experience and map layers. Express exposes land, analytics, research, LandCheck, AI, simulation, verification, and auth endpoints. PostgreSQL/PostGIS is the target persistence layer; the current MVP uses explicit mock data so the demo remains runnable without external infrastructure.
