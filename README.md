# Pyramid — Task Management System

A task management web application built from the provided design screens. The project focuses on the frontend implementation, responsive UI, task/project management, and theme customization.

## Tech Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* Lucide React
* Browser `localStorage`

## Features

### Authentication

* Continue as Guest
* Mock Google login
* Login session stored in `localStorage`
* Protected application routes
* Logout functionality

### Tasks

* Kanban board view
* List view
* Search tasks
* Filter by status, priority, members, due date, and labels
* Show/hide task fields
* Add and delete tasks
* Task detail page
* Edit task title and description
* Assign members
* Set priority and due date
* Add labels
* Add subtasks
* Comments section
* Task activity/updates

### Projects

* Projects list
* Search and filtering
* Add projects
* Project details
* View tasks belonging to a project
* Board and List views for project tasks

### Settings

* Profile settings
* Light and dark themes
* Accent color selection
* Settings are saved between sessions

### Responsive Design

The application is designed to work across desktop, tablet, and mobile screen sizes.

* Responsive sidebar with mobile drawer
* Horizontal scrolling for the Kanban board on smaller screens
* Responsive task and project tables
* Mobile-friendly task details layout
* Responsive settings navigation

## Project Structure

```text
src/
├── app/
│   ├── login/
│   ├── (app)/
│   │   ├── tasks/
│   │   └── projects/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── tasks/
│   ├── projects/
│   └── ui/
│
├── hooks/
├── data/
├── types/
└── lib/
```

## Getting Started

Clone the repository and install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
npm run start
```

To run ESLint:

```bash
npm run lint
```

## Data Storage

This version is frontend-only, so there is no backend or database.

Tasks, projects, authentication state, theme settings, and other user preferences are stored in the browser using `localStorage`.

The application logic is kept inside reusable hooks such as:

* `useAuth`
* `useTasks`
* `useProjects`
* `useTheme`
* `useLocalStorage`

This keeps the components separated from the storage logic and makes it easier to connect a real API later.

## Design Notes

The provided screenshots were used as the main reference for the UI.

A few areas were simplified for the frontend-only implementation:

* Google login uses a mock account instead of real OAuth.
* Tasks and projects use local mock data.
* The task due date uses a single date instead of a date range.
* Resources are currently UI-only and don't upload files.
* Board and List views use the same underlying task data.

## Future Backend Integration

A real backend can be connected later without changing most of the UI components.

The existing hooks can be updated to communicate with a NestJS API for:

* User authentication
* Task CRUD operations
* Project CRUD operations
* Task assignments
* Comments
* Persistent database storage


