# <p align="center"><img src="https://img.shields.io/badge/TaskFlow-x-1D4ED8?style=for-the-badge" alt="TaskFlow-x"/></p>

<p align="center">
  <img src="https://img.shields.io/badge/Vite-0.0?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/React-18-0EA5E9?style=for-the-badge&logo=react&logoColor=white" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-SQLite-7C3AED?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma SQLite"/>
</p>

<h1 align="center">🗺️ TaskFlow-x</h1>

<p align="center">
  <strong>A modern, performant project‑management web app built with Vite, React, TypeScript and an Express + Prisma backend.</strong>
  <br/>
  Kanban board, list view, drag‑and‑drop, virtualized task rendering and lazy‑loaded pages for a smooth experience even with thousands of tasks.
</p>

<p align="center">
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-database-schema">Database Schema</a> •
  <a href="#-development">Development</a>
</p>

---

## 🤔 The Problem

Managing projects in small‑to‑medium teams often suffers from:

- **Fragmented UI** – separate tools for kanban, lists and reporting.
- **Performance bottlenecks** – large task lists cause UI lag.
- **Cold starts** – heavy bundles slow down first‑time loads.
- **Manual data handling** – no built‑in persistence for tasks, users and teams.

**TaskFlow‑x** brings those pieces together in a single, fast, and responsive web app.

---

## ✨ What TaskFlow‑x Adds

| Capability | Without TaskFlow‑x | With TaskFlow‑x |
|:---|:---|:---|
| **Kanban board** | No visual workflow, manual status updates | Drag‑and‑drop board with live status changes |
| **List view** | Simple tables, no virtualization | Virtualized scrolling for thousands of tasks |
| **Code‑splitting** | Whole app loads at once | Lazy‑loaded pages, reduced initial bundle |
| **Team management** | Flat JSON, no UI | Dedicated UI, avatars, role display |
| **Persisted storage** | In‑memory only | SQLite database via Prisma |
| **Responsive design** | Desktop‑only | Mobile‑friendly layout |

---

## 📸 Screenshots

<p align="center">
  <img src="docs/screenshots/kanban.png" alt="Kanban board" width="48%"/>
  <img src="docs/screenshots/list.png" alt="List view with virtualization" width="48%"/>
</p>

---

## 🏗️ Architecture

<p align="center">
  <img src="docs/architecture.svg" alt="TaskFlow‑x architecture diagram" width="100%"/>
</p>

### Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | Vite, React 18, TypeScript, Tailwind CSS, lucide‑react, react‑window |
| **Backend** | Express, Prisma, SQLite |
| **Testing** | Vitest + React Testing Library |
| **Runtime** | Node.js (local) or Docker Compose |

---

## 🔄 How It Works

### Seed & Migrate

```bash
# Initialise the database and generate the Prisma client
npx prisma migrate dev --name init   # creates dev.db and migration files
npx prisma generate                 # generates @prisma/client
```

### Development Server

```bash
npm run dev   # Vite dev server (frontend) + nodemon Express (backend) proxy
```

The frontend calls the backend API (`/api/*`) which talks to the SQLite database via Prisma. Task data is loaded through React Context and displayed using either the Kanban board or the virtualized list component.

---

## 🗃️ Database Schema

The Prisma schema lives in `prisma/schema.prisma`.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  avatar    String?
  // …
  projects  Project[]
  tasks     Task[]
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  color       String
  // …
  tasks       Task[]
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id])
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(todo)
  priority    TaskPriority @default(medium)
  dueDate     DateTime?
  assigneeId  Int?
  assignee    User?      @relation(fields: [assigneeId], references: [id])
  projectId   Int
  project     Project    @relation(fields: [projectId], references: [id])
}

enum TaskStatus {
  todo
  in_progress
  review
  done
}

enum TaskPriority {
  low
  medium
  high
}
```

### Environment variable

Create a `.env` (or `.env.local`) with:

```env
DATABASE_URL="file:./prisma/dev.db"
```

Prisma reads this variable at startup.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/yourusername/TaskFlow-x.git
cd TaskFlow-x
npm install
```

### Configure

```bash
cp .env.example .env.local
# Add any required keys (e.g., GEMINI_API_KEY if you use AI features)
```

### Run the app

```bash
npm run dev
```

Open <http://localhost:3000> – the Express API runs on port 3001 by default.

### Build for production

```bash
npm run build   # Vite production bundle
npm start       # Serve with Node/Express
```

---

## 📦 Scripts

| Script | Description |
|---|---|
| `dev` | Starts Vite dev server and Express backend (watch mode) |
| `build` | Generates a production‑ready Vite bundle |
| `lint` | Runs ESLint + Prettier |
| `test` | Executes unit tests |
| `seed` | Runs Prisma seed script (if present) |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Ensure lint and tests pass
4. Open a Pull Request describing your changes

---

## 📄 License

This project is licensed under the **Apache License 2.0** – see the `LICENSE` file for details.

---

## 🙋‍♂️ Contact

Feel free to open an issue or reach out to the maintainer at `pitpi@example.com`.

---

Enjoy building fast, reliable task workflows with **TaskFlow‑x**! 🚀
