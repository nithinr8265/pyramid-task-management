# Pyramid — Task Management System (Full Stack)

A modern full-stack Task Management System built with a **Next.js 16 App Router** frontend and a **NestJS + MongoDB + Prisma ORM** REST API backend.

---

## 💡 Database Choice: MongoDB Tradeoff

**Why MongoDB instead of PostgreSQL?**
MongoDB was selected alongside Prisma ORM using Prisma's MongoDB provider. Tasks in Pyramid contain rich nested entities (`subtasks`, `comments`, and `updates`). 

- **Benefits**:
  - **Embedded Documents & Arrays**: Subtasks, comments, and activity updates are stored as native embedded document arrays (`type SubtaskEmbedded`, etc.), and member/label assignments are stored as native string arrays (`memberIds String[]`). This matches `src/types/index.ts` 1-to-1 without multi-table SQL joins or junction tables.
  - **Atomic Operations**: Updating subtask status, pushing new comments, or appending activity logs are atomic single-document updates.
  - **Performance**: High performance for task board queries and detail views.
- **Tradeoff**:
  - Requires MongoDB 7 replica set mode (e.g. Atlas or Docker single-node replica set `rs0`) for Prisma transactions.
  - Relational cascade deletes are handled at the application service level rather than database foreign key constraints.

---

## 🔐 Google Sign-In Setup

Pyramid supports real Google Sign-In via official **Google Identity Services (GIS)** with popup account selection and cryptographic ID token verification on the NestJS backend.

### 1. Create Google OAuth Web Client ID
1. Navigate to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
2. Click **Create Credentials** -> **OAuth Client ID**.
3. Set Application Type to **Web application**.
4. Under **Authorized JavaScript origins**, add your local frontend URL:
   - `http://localhost:3001` (and `http://localhost:3000` if running on port 3000).
5. Copy the generated **Client ID** (`...apps.googleusercontent.com`).

### 2. Configure Environment Variables

**Frontend (`frontend/.env.local`)**:
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

**Backend (`backend/.env`)**:
```bash
DATABASE_URL="mongodb://root:examplepassword@localhost:27017/pyramid?authSource=admin&replicaSet=rs0"
JWT_SECRET="super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
CORS_ORIGIN="http://localhost:3001,http://localhost:3000"
PORT=3000
```

### 3. Run MongoDB, Backend, and Frontend

**Start MongoDB**:
```bash
docker compose up -d mongodb
```

**Start NestJS Backend**:
```bash
cd backend
npm run start:dev
```

**Start Next.js Frontend**:
```bash
cd frontend
npm run dev
```

---

## 🚀 Tech Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Authentication**: Google Identity Services (GIS) Web SDK + Guest Login
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **API Integration**: Custom typed fetch client (`src/lib/api.ts`) connected to NestJS API

### Backend (`/backend`)
- **Framework**: NestJS 10 + TypeScript
- **Database & ORM**: MongoDB + Prisma ORM
- **Authentication**: `google-auth-library` ID Token Verification + Passport JWT
- **Validation**: `class-validator` + `class-transformer` (Global `ValidationPipe` with whitelist & transform enabled)
- **API Docs**: OpenAPI / Swagger at `/api/docs`
- **Error Handling**: Global `HttpExceptionFilter` for uniform error JSON responses

---

## ⚡ Quick Start with Docker Compose

Run the entire backend stack (MongoDB 7 Replica Set + NestJS API) with a single command:

```bash
docker compose up --build
```

- **NestJS API**: [http://localhost:3000](http://localhost:3000)
- **Swagger Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **MongoDB**: `localhost:27017` (Replica set `rs0` automatically initialized)

Then start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) or [http://localhost:3000](http://localhost:3000).

---

## 📁 Repository Structure

```text
pyramid/
├── docker-compose.yml
├── README.md
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # UI, Task & Project components
│   │   ├── hooks/          # useAuth, useTasks, useProjects
│   │   ├── lib/            # api.ts client & storage helpers
│   │   ├── types/          # TypeScript domain interfaces
│   │   └── data/           # Initial mock data for seeding
│   ├── .env.example
│   └── package.json
└── backend/
    ├── prisma/
    │   ├── schema.prisma   # MongoDB Prisma schema with embedded types
    │   └── seed.ts         # Seeder for members, labels, projects, tasks
    ├── src/
    │   ├── auth/           # AuthModule (/auth/guest, /auth/google, /auth/me)
    │   ├── users/          # UsersModule (/users)
    │   ├── projects/       # ProjectsModule (/projects CRUD)
    │   ├── tasks/          # TasksModule (/tasks CRUD, subtasks, comments)
    │   ├── health/         # HealthModule (/health)
    │   ├── common/         # Global HttpExceptionFilter
    │   └── prisma/         # PrismaService & PrismaModule
    ├── Dockerfile          # Multi-stage production build
    ├── .env.example
    └── package.json
```

---

## 📡 API Endpoints

All mutating endpoints (`POST`, `PATCH`, `DELETE`) require a Bearer Token in `Authorization` header: `Authorization: Bearer <token>`.

### Health & Docs
- `GET /health` — Deployment health check (returns `{ status: "ok" }`)
- `GET /api/docs` — Interactive OpenAPI / Swagger UI

### Authentication (`/auth`)
- `POST /auth/guest` — Authenticate as a guest user (returns `{ accessToken, user }`)
- `POST /auth/google` — Authenticate with verified Google ID token (`{ credential }`)
- `GET /auth/me` — Get current authenticated user details (JWT-guarded)

### Members & Users (`/users`)
- `GET /users` — List members for task/project assignment pickers

### Projects (`/projects`)
- `GET /projects` — List all projects
- `GET /projects/:id` — Get project details by ID
- `POST /projects` — Create new project (JWT-guarded)
- `PATCH /projects/:id` — Partial update project (JWT-guarded)
- `DELETE /projects/:id` — Delete project (JWT-guarded)

### Tasks (`/tasks`)
- `GET /tasks` — List tasks with query params (`?projectId=`, `?status=`, `?search=`)
- `GET /tasks/:id` — Get task by ID with subtasks, comments, updates
- `POST /tasks` — Create new task (JWT-guarded)
- `PATCH /tasks/:id` — Update task fields (status, priority, assignees, labels, dates) (JWT-guarded)
- `DELETE /tasks/:id` — Delete task (JWT-guarded)
- `POST /tasks/:id/subtasks` — Add subtask to task (JWT-guarded)
- `PATCH /tasks/:id/subtasks/:subtaskId` — Update/toggle subtask (JWT-guarded)
- `POST /tasks/:id/comments` — Add comment to task (JWT-guarded)

---

## 🔌 Backend Integration Details

The Next.js frontend has been connected to the NestJS API **without altering the public interfaces** of `useAuth()`, `useTasks()`, or `useProjects()`.

### Key Changes:
1. **`src/lib/api.ts`**:
   - Created a typed fetch wrapper reading `process.env.NEXT_PUBLIC_API_URL`.
   - Automatically attaches `Authorization: Bearer <token>` from stored session.
   - Throws clear error messages on non-2xx responses.

2. **`useAuth.tsx`**:
   - Replaced mock session generation with real API calls to `/auth/guest` and `/auth/google`.
   - Stores returned `accessToken` alongside `user` and `provider` under `STORAGE_KEYS.session` in `localStorage`.

3. **`useTasks.tsx` & `useProjects.tsx`**:
   - Replaced `useLocalStorage` backing state with `useState` + `useEffect` fetching live data from `/tasks` and `/projects` on mount.
   - All mutation methods (`addTask`, `updateTask`, `deleteTask`, `moveTask`, `addComment`, `addSubtask`, `toggleSubtask`, `addProject`) call the corresponding NestJS endpoint and optimistically update state.

---

## 🗄️ Database Seeding

To load the exact mock data from `src/data/` into your MongoDB database:

```bash
cd backend
npm run prisma:seed
```

---

## 🚢 Deployment Guide

### Deploying Backend (Render or Railway + MongoDB Atlas)
1. Provision a free MongoDB database on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Connect to backend service on Render or Railway.
3. Configure build and start commands:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
4. Environment variables:
   - `DATABASE_URL`: MongoDB Atlas replica set URI (`mongodb+srv://...`)
   - `JWT_SECRET`: Random 32+ char secret string
   - `JWT_EXPIRES_IN`: `7d`
   - `GOOGLE_CLIENT_ID`: Google OAuth Client ID
   - `CORS_ORIGIN`: Deployed Vercel frontend URL
   - `PORT`: `3000`

### Deploying Frontend (Vercel)
1. Import the `/frontend` directory in Vercel.
2. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed NestJS backend (e.g. `https://pyramid-api.onrender.com`).
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth Client ID
3. Deploy!
