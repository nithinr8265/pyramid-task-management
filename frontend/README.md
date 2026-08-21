# Pyramid — Task Management System

A modern and responsive task management web application built with **Next.js, React, TypeScript, and Tailwind CSS**.

Pyramid provides a clean productivity-focused interface for managing tasks and projects through Kanban and List views, with task filtering, subtasks, comments, project management, and customizable themes.

## ✨ Features

### 🔐 Authentication

- Continue as Guest
- Mock Google Sign-In
- Persistent login session using `localStorage`
- Protected application routes
- Logout functionality

### ✅ Task Management

- Kanban board view
- List view
- Create and delete tasks
- Search tasks
- Filter by:
  - Status
  - Priority
  - Members
  - Due date
  - Labels
- Show/hide task fields
- Task detail pages
- Edit task title and description
- Assign members
- Set task priority
- Set due dates
- Add labels
- Create and manage subtasks
- Add comments
- View task activity and updates

### 📁 Project Management

- Projects overview
- Search and filtering
- Create projects
- Project detail pages
- View project-related tasks
- Kanban and List views for project tasks

### ⚙️ Settings & Customization

- Profile settings
- Light and dark themes
- Accent color customization
- Persistent theme preferences
- Responsive settings navigation

### 📱 Responsive Design

The application is designed for desktop, tablet, and mobile devices.

- Responsive sidebar with mobile drawer
- Horizontal scrolling Kanban board on smaller screens
- Responsive task and project layouts
- Mobile-friendly task details
- Responsive settings navigation

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework and application routing |
| React 19 | UI development |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Styling and responsive design |
| Lucide React | UI icons |
| localStorage | Client-side data persistence |

## 📂 Project Structure

```text
src/
├── app/
│   ├── login/                 # Authentication page
│   ├── (app)/
│   │   ├── tasks/             # Task pages
│   │   └── projects/          # Project pages
│   └── settings/              # Application settings
│
├── components/
│   ├── layout/                # Application layout components
│   ├── navigation/            # Sidebar and navigation
│   ├── tasks/                 # Task-related components
│   ├── projects/              # Project-related components
│   └── ui/                    # Reusable UI components
│
├── hooks/                     # Application state and custom hooks
├── data/                      # Initial mock data
├── types/                     # TypeScript interfaces and types
└── lib/                       # Utility and storage functions
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20 or later
- npm

### 1. Clone the repository

```bash
git clone https://github.com/nithinr8265/pyramid-task-management.git
cd pyramid-task-management/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

### 4. Create a production build

```bash
npm run build
```

### 5. Start the production server

```bash
npm run start
```

### 6. Run ESLint

```bash
npm run lint
```

## 💾 Data Storage

The frontend version uses browser-based `localStorage` for client-side persistence.

The following application data can be stored locally:

- Authentication state
- Tasks
- Projects
- Theme preferences
- Accent color
- User preferences

The application uses reusable hooks to keep state and storage logic separate from UI components:

```text
useAuth
useTasks
useProjects
useTheme
useLocalStorage
```

This structure keeps the application modular and makes the frontend easier to integrate with a backend API.

## 🎨 Design & UI

The interface was developed using the provided design screens as the primary visual reference.

The implementation focuses on:

- Clean dashboard layouts
- Consistent spacing and typography
- Reusable UI components
- Responsive behavior
- Kanban and List task views
- Mobile-friendly interactions
- Theme customization

Some functionality has intentionally been simplified for the frontend implementation.

### Current Frontend Limitations

- Google Sign-In currently uses a mock authentication flow.
- Task and project data use local mock data.
- Data is stored in browser `localStorage`.
- Resources are currently UI-only and do not upload files.
- Task due dates use a single date.
- Board and List views use the same underlying task data.

## 🧩 Architecture

The application follows a component-based architecture:

```text
Pages
  │
  ├── Components
  │      │
  │      ├── Tasks
  │      ├── Projects
  │      ├── Navigation
  │      └── UI
  │
  └── Custom Hooks
         │
         ├── useAuth
         ├── useTasks
         ├── useProjects
         ├── useTheme
         └── useLocalStorage
```

This separation helps keep:

- UI components focused on presentation
- Hooks responsible for application logic
- Types centralized
- Storage logic reusable
- Feature-specific components organized

## 🔌 Backend Integration

The frontend is structured so that the local storage layer can be replaced with a real backend API.

A backend can provide:

- User authentication
- Google OAuth
- Task CRUD operations
- Project CRUD operations
- Task assignments
- Comments
- Subtasks
- Resources
- Persistent database storage

The existing component and hook structure minimizes the amount of UI code that needs to change when connecting the application to a backend.

## 📱 Responsive Support

Pyramid supports:

```text
Desktop
   ↓
Tablet
   ↓
Mobile
```

Responsive behavior includes:

- Collapsible navigation
- Mobile drawer
- Horizontal Kanban scrolling
- Responsive task layouts
- Mobile task detail pages
- Responsive project views
- Adaptive settings navigation

## 🌐 Live Demo

**Frontend:**  
https://pyramid-task-management-1wx8.onrender.com

> The live application is deployed as a frontend service. Free hosting services may take a short time to wake up after inactivity.

## 👨‍💻 Author

**Nithin R**

GitHub:  
https://github.com/nithinr8265

Repository:  
https://github.com/nithinr8265/pyramid-task-management

Live : 
https://pyramid-task-management-1wx8.onrender.com
