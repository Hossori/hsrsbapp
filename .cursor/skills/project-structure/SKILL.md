---
name: project-structure
description: This is a stucture of this project.
---

# Overview
hsrsbapp - personal record/management web app (reading-recorder, money-recorder, etc.)
publish for free using free-tier services (github pages, supabase, render).

# frontend structure
defined at "frontend" directory, each screens at "frontend/src/app/features/*"
frontend is composed of a screen by each features.
each screens have an url, managed by a routing feature of angular.
## structure keywords
- Angular
- TypeScript
- PWA
- SPA
- Netlify

# deployment (tentative)
- frontend: github pages
- backend api: render (free web service, spring rest api)
- database (current): supabase
- database (future): neon — do NOT use render free postgresql (30-day expiry)
- supabase pause mitigation: github actions heartbeat until migration

# backend structure
for now backend is defined at "supabase" directory and implemented by "supabase functions".
however it's going to replaced by "spring rest api" in the future, and moved to "backend" directory.
## structure keywords(for now)
- supabase functions
## structure keywords(in the future)
- spring rest api
- iaas deployable a backend system for free(e.g. render)

# database
use uuid v4 (e.g. gen_random_uuid()) as user id.
schema managed via supabase/migrations/ in repository (recommended).
## structure keywords
- supabase

# external api
## structure keywords(in the future)
- google books api