# StaffSync - HR Management System (MERN)

Roles: HR, Manager, Employee. Features: employee management, leave approval, attendance,
announcements and training programs. Auth uses JWT with role-based access.

## Requirements
Node.js v16+, npm v8+, MongoDB Community Server (running locally), a browser.

## Setup

### 1. Backend
    cd backend
    npm install
    npm run seed      # creates 3 demo users (run once)
    npm run dev       # API on http://localhost:5000

Edit `backend/.env` if your MongoDB URL differs, and change `JWT_SECRET`.

### 2. Frontend (new terminal)
    cd frontend
    npm install
    npm run dev       # app on http://localhost:5173

## Demo logins (created by `npm run seed`)
| Role     | Email                   | Password    |
|----------|-------------------------|-------------|
| HR       | hr@staffsync.com        | hr12345     |
| Manager  | manager@staffsync.com   | manager123  |
| Employee | employee@staffsync.com  | employee123 |

Esha (employee) reports to Manav (manager), so Manav sees her leave and attendance.
Log in as HR to add more people and set who they report to.

## API summary
| Route | Access |
|-------|--------|
| POST /api/auth/login, GET /api/auth/me | public / any |
| GET, POST /api/employees; PUT, DELETE /api/employees/:id | HR |
| PUT /api/employees/profile | any |
| GET /api/employees/team | HR, Manager |
| POST /api/leaves; GET /api/leaves/my | Employee, Manager / any |
| GET /api/leaves; PUT /api/leaves/:id | HR, Manager (team only) |
| POST /api/attendance/checkin, /checkout | Employee, Manager |
| GET /api/attendance/my; GET /api/attendance | any / HR, Manager |
| GET /api/announcements; POST, DELETE | any / HR |
| GET /api/trainings; POST; DELETE /api/trainings/:id | role-filtered / Manager / HR, Manager |

Send `Authorization: Bearer <token>` on every protected request (test in Postman).

## Folder structure
    backend/   config, models, controllers, middleware, routes, seed.js, server.js
    frontend/  src/pages, src/Layout.jsx, src/AuthContext.jsx, src/api.js

## Deployment
MongoDB Atlas (DB), Render/Railway (backend), Netlify/Vercel (frontend).
Set `MONGO_URI`, `JWT_SECRET` on the backend and `VITE_API_URL` on the frontend.
