# TaskFlow – Real‑time Task Manager

Full‑stack task manager with JWT auth and real‑time updates via Socket.IO. Built with Node.js/Express, PostgreSQL/Prisma and React/Vite using vanilla CSS.

## Features

- User registration/login (JWT) and protected APIs
- Create/edit/delete tasks with categories (Work, Personal, Urgent)
- Mark complete/incomplete
- Real‑time updates across clients (Socket.IO)
- Multi‑user board: everyone sees changes instantly (create/update/delete) without refresh; cards show task owner
- Responsive UI (mobile → desktop)
- Toast notifications (react‑hot‑toast)
- Polished UX: avatar dropdown, edit/delete confirmations, modal editor

## Tech Stack

- Backend: Node.js, Express, Prisma ORM, PostgreSQL, Socket.IO, JWT, Zod, Bcrypt
- Frontend: React (Vite), React Router, Axios, Socket.IO Client, react‑hot‑toast, vanilla CSS

## Data Model (Prisma)

```
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  tasks     Task[]
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  category    String   @default("General")
  completed   Boolean  @default(false)
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Live Demo

- Frontend (Vercel): [task-manager-fullstack-eta.vercel.app](https://task-manager-fullstack-eta.vercel.app/login)

Open the frontend link above, register, and start adding tasks. Open the app in two browser windows to see live updates.

## Environment Variables

Create `backend/.env`:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_manager?schema=public"
PORT=4000
NODE_ENV=development
JWT_SECRET="REPLACE_WITH_STRONG_SECRET"
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN="http://localhost:5173"
SOCKET_CORS_ORIGIN="http://localhost:5173"
```

Create `frontend/.env.local`:

```
VITE_API_URL="http://localhost:4000"
VITE_SOCKET_URL="http://localhost:4000"
```

## Installation & Running Locally

1. Install deps

```
cd backend && npm i
cd ../frontend && npm i
```

2. Prisma migrate & generate

```
cd ../backend
npx prisma migrate dev --name init
npx prisma generate
```

3. Start servers (two terminals)

```
cd backend && npm run dev
cd frontend && npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

- Auth
  - POST `/api/auth/register` → body: `{ email, password, name? }`
  - POST `/api/auth/login` → body: `{ email, password }` → `{ token, user }`
  - GET `/api/auth/me` → header: `Authorization: Bearer <token>`
- Tasks (all require JWT)
  - GET `/api/tasks`
  - POST `/api/tasks` → `{ title, description?, category }`
  - PATCH `/api/tasks/:id` → `{ title?, description?, category?, completed? }`
  - DELETE `/api/tasks/:id`

## Realtime Events (Socket.IO)

- Server emits on task mutations:
  - `taskCreated` → payload: `Task`
  - `taskUpdated` → payload: `Task`
  - `taskDeleted` → payload: `{ id }`
- Client subscribes and updates UI accordingly; also shows toasts on add/edit/delete.

### Multi‑user behavior

- All tasks are visible to every logged‑in user.
- Each task includes its owner (`user { id, name, email }`); cards render an owner chip.
- Edit/Delete controls are only visible to the owner; others can view and mark complete on their own tasks only (if enabled in policies).
- No page refresh required: Socket.IO pushes `taskCreated`, `taskUpdated`, `taskDeleted` to all connected clients.

## Directory Structure

```
backend/
  src/
    config/env.js
    lib/prisma.js
    middleware/auth.js
    controllers/
      auth.controller.js
      task.controller.js
    routes/
      auth.routes.js
      task.routes.js
    app.js
    index.js
  prisma/
    schema.prisma

frontend/
  src/
    api/client.js
    components/
      Navbar.jsx
      TaskBoard.jsx
      TaskCard.jsx
      ConfirmModal.jsx
      EditTaskModal.jsx
    context/AuthContext.jsx
    hooks/useSocketStatus.js
    pages/{Login.jsx, Register.jsx, Tasks.jsx}
    App.jsx
```

## Auth Flow

1. Register or log in → server returns JWT
2. Frontend stores token in `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>`
4. Protected routes verify token in middleware (`requireAuth`)

## Validation & Security

- Zod validates request bodies for auth and tasks
- Bcrypt hashes passwords (`BCRYPT_SALT_ROUNDS`)
- Helmet, CORS, cookie-parser, morgan enabled
- Prisma prevents SQL injection via parameterization

## Deployment Guide

- Backend (Railway/Render/Heroku)
  - Set env vars as above
  - Provision PostgreSQL (Railway/Supabase/Neon)
  - Run `npx prisma migrate deploy`
- Frontend (Vercel/Netlify)
  - Set `VITE_API_URL` and `VITE_SOCKET_URL` to backend URL (HTTPS)
- Database (Supabase/Railway/Neon)
  - Use provided connection string for `DATABASE_URL`

## Troubleshooting

- Prisma connection check:

```
cd backend
npx prisma db execute --script "SELECT now();"
```

- If tasks don’t appear instantly when added: confirm the Socket.IO connection and ensure frontend points to the correct `VITE_SOCKET_URL`.

## Scripts

Backend `package.json`:

```
"dev": "nodemon src/index.js",
"start": "node src/index.js",
"prisma:migrate": "prisma migrate dev",
"prisma:generate": "prisma generate",
"prisma:studio": "prisma studio"
```

## License

Ahmad
