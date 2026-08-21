# Pyramid — Task Management System

A modern full-stack task management application for organizing projects, tasks, subtasks, comments, assignments, labels, and activity updates.

Pyramid is built with **Next.js 16** on the frontend and **NestJS + MongoDB + Prisma** on the backend, with JWT-based authentication and Google Sign-In.

## ✨ Features

- 🔐 Guest authentication and Google Sign-In
- 📁 Project management
- ✅ Task creation, editing, deletion, and status updates
- 📋 Subtask management
- 💬 Task comments
- 👥 Member and assignee management
- 🏷️ Labels and priorities
- 🔎 Task filtering and search
- 📅 Task dates and project organization
- 🎨 Theme and color customization
- 📱 Responsive desktop and mobile UI
- 🔒 JWT-protected API operations
- 📚 Swagger/OpenAPI API documentation
- 🩺 Health-check endpoint

## 🌐 Live Application

**Frontend:** https://pyramid-task-management-1wx8.onrender.com

**Backend API:** https://pyramid-eje3.onrender.com

**API Health Check:** https://pyramid-eje3.onrender.com/health

**Swagger API Docs:** https://pyramid-eje3.onrender.com/api/docs

> Free Render services may take some time to wake up after inactivity.

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│        Next.js Frontend      │
│  Next.js 16 + React + TS     │
│  Tailwind CSS + GIS          │
└──────────────┬───────────────┘
               │ REST API
               │ JWT / Google ID Token
               ▼
┌──────────────────────────────┐
│         NestJS Backend       │
│ Auth / Projects / Tasks      │
│ Users / Health               │
└──────────────┬───────────────┘
               │ Prisma ORM
               ▼
┌──────────────────────────────┐
│       MongoDB / Atlas        │
└──────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React
- Google Identity Services
- Custom typed API client

### Backend

- NestJS 10
- TypeScript
- MongoDB
- Prisma ORM
- JWT / Passport
- Google Auth Library
- class-validator
- class-transformer
- Swagger / OpenAPI

### Development & Deployment

- Docker / Docker Compose
- MongoDB Atlas
- Git & GitHub
- Render

## 📁 Project Structure

```text
pyramid/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # UI and feature components
│   │   ├── hooks/            # Authentication and data hooks
│   │   ├── lib/              # API client and storage utilities
│   │   ├── types/            # TypeScript domain types
│   │   └── data/             # Initial application data
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # MongoDB Prisma schema
│   │   └── seed.ts           # Database seed
│   ├── src/
│   │   ├── auth/             # Authentication
│   │   ├── users/            # User/member management
│   │   ├── projects/         # Project CRUD
│   │   ├── tasks/            # Task CRUD and nested operations
│   │   ├── health/           # Health check
│   │   ├── common/           # Shared backend utilities
│   │   └── prisma/           # Prisma service/module
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- Docker Desktop
- MongoDB 7 or MongoDB Atlas
- Google Cloud project (if Google Sign-In is required)

### 1. Clone the repository

```bash
git clone https://github.com/nithinr8265/pyramid-task-management.git
cd pyramid-task-management
```

### 2. Start the backend

```bash
docker compose up --build
```

Backend:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api/docs
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend normally runs on:

```text
http://localhost:3001
```

## ⚙️ Environment Variables

### Frontend

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

### Backend

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL="YOUR_MONGODB_CONNECTION_STRING"
JWT_SECRET="YOUR_SECURE_JWT_SECRET"
JWT_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
CORS_ORIGIN="http://localhost:3001,http://localhost:3000"
PORT=3000
```

> Never commit `.env`, `.env.local`, database credentials, JWT secrets, or Google credentials to GitHub.

## 🔐 Google Sign-In

Pyramid uses **Google Identity Services (GIS)** for authentication.

### Local Development

Add these authorized JavaScript origins to your Google OAuth Web Client:

```text
http://localhost:3001
http://localhost:3000
```

### Production

Add your deployed frontend origin:

```text
https://pyramid-task-management-1wx8.onrender.com
```

The same Google Client ID should be configured in both the frontend and backend environment variables.

## 📡 API Overview

Protected `POST`, `PATCH`, and `DELETE` requests require:

```http
Authorization: Bearer <access_token>
```

### Health & Documentation

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/api/docs` | Swagger/OpenAPI documentation |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/guest` | Guest authentication |
| POST | `/auth/google` | Google authentication |
| GET | `/auth/me` | Current authenticated user |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List users/members |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | List projects |
| GET | `/projects/:id` | Get project details |
| POST | `/projects` | Create project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | List/filter tasks |
| GET | `/tasks/:id` | Get task details |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/subtasks` | Add subtask |
| PATCH | `/tasks/:id/subtasks/:subtaskId` | Update subtask |
| POST | `/tasks/:id/comments` | Add comment |
| POST | `/tasks/:id/resources` | Add resource |
| DELETE | `/tasks/:id/resources/:resourceId` | Delete resource |

## 🗄️ Database

Pyramid uses **MongoDB with Prisma ORM**.

MongoDB fits the task domain because tasks contain nested data such as:

- Subtasks
- Comments
- Activity updates
- Member assignments
- Labels

For local development, MongoDB runs in replica-set mode so Prisma transactions are supported.

## 🌱 Database Seeding

To populate the database with the initial data:

```bash
cd backend
npm run prisma:seed
```

## 🚢 Deployment

The application is deployed using **Render**, with **MongoDB Atlas** as the database.

### Backend

Build command:

```text
npm run build
```

Start command:

```text
npm run start:prod
```

Production environment variables:

```env
DATABASE_URL=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_SECURE_SECRET
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
CORS_ORIGIN=https://your-frontend-page.com
PORT=3000
```

### Frontend

Root Directory:

```text
frontend
```

Build command:

```text
npm ci && npm run build
```

Start command:

```text
npm start
```

Production environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-page.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## 🧪 Production Verification

After deployment, verify:

- Health endpoint responds successfully
- Guest login works
- Google Sign-In works
- Projects load correctly
- Tasks load correctly
- Task creation, editing, and deletion work
- Subtasks work
- Comments work
- Resources work
- Authentication persists after refresh
- Responsive/mobile layouts work

## 🔒 Security

- Secrets are stored in environment variables.
- JWT authentication protects mutating API operations.
- Google ID tokens are verified by the backend.
- CORS restricts browser access to configured frontend origins.
- Environment files containing credentials must not be committed.

## 📄 License

This project is currently intended as a personal/portfolio project.

## 👨‍💻 Author

**Nithin R**

GitHub: https://github.com/nithinr8265

Repository: https://github.com/nithinr8265/pyramid-task-management

Live: https://pyramid-task-management-1wx8.onrender.com/login
