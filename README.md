<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# TaskFlow-x

**A modern, performant project‑management web app** built with Vite, React, TypeScript and an Express + Prisma backend.  It offers Kanban board and list views, rich filtering, drag‑and‑drop, virtualized task lists, lazy‑loaded pages and a responsive UI that feels fast even with thousands of tasks.

## 📋 Features

- **Kanban board** with custom columns, drag‑and‑drop task movement
- **List view** with full‑text search, priority/assignee/status filters
- **Virtualized task rendering** via `react-window` for smooth scrolling of large datasets
- **Code‑splitting** (`React.lazy` + `Suspense`) for reduced initial bundle size
- **Responsive design** – works on desktop and mobile browsers
- **Team management** – assign tasks, view avatars, comment counts
- **Backend** powered by Express, SQLite & Prisma ORM
- **Type‑safe** front‑end with TypeScript and strict linting

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Front‑end | Vite, React 18, TypeScript, lucide-react, react-window |
| Styling | Tailwind CSS (utility‑first) & custom CSS for premium UI |
| State Management | React Context (`src/context/AppContext.tsx`) |
| Back‑end | Node.js, Express, SQLite, Prisma |
| Testing | Vitest / React Testing Library (optional) |
| Deployment | Runs locally; can be containerised with Docker |

## 📁 Project Structure

```
TaskFlow-x/
├─ src/
│  ├─ components/          # Reusable UI components (Navigation, VirtualizedTaskList, …)
│  ├─ context/            # React context for global state
│  ├─ pages/              # Page‑level components (Dashboard, ProjectDetail, …)
│  ├─ types/              # TypeScript type definitions
│  ├─ App.tsx              # Root component with lazy‑loaded routes
│  └─ main.tsx             # Vite entry point
├─ server/
│  ├─ index.ts            # Express server entry
│  └─ prisma/             # Prisma schema & migrations
├─ public/                 # Static assets
├─ .env.example            # Example environment variables
├─ vite.config.ts
├─ tsconfig.json
└─ README.md
```
## 🗄️ Database

### Overview
TaskFlow‑x uses **SQLite** as the default relational database, managed through **Prisma ORM**. The database file lives under `prisma/dev.db` (created automatically on first migration).

### Prisma schema
The schema is defined in `prisma/schema.prisma`. Key models include:

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
```

### Environment variable
Create a `.env` (or `.env.local`) with:

```
DATABASE_URL="file:./prisma/dev.db"
```

Prisma reads this variable at startup.

### Migrations & generation
```bash
# Initialise the database and generate client
npx prisma migrate dev --name init   # creates migration & dev.db
npx prisma generate                 # generates @prisma/client
```

### Seeding (optional)
A simple seed script is available:

```bash
npm run seed   # runs prisma/db/seed.ts to populate demo data
```

### Inspecting data
```bash
npx prisma studio   # opens a web UI to explore tables
```

### Resetting the database
```bash
npx prisma migrate reset   # drops and re‑creates dev.db
```

This section gives developers full control over the database lifecycle.


## 🚀 Getting Started

### Prerequisites

- **Node.js** (>=18) and **npm** (>=9)
- **SQLite** (bundled, no extra install required)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/TaskFlow-x.git
cd TaskFlow-x

# Install dependencies
npm install
```

### Configuration

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API key (if you want AI‑Studio integration) and any other required variables:

```
GEMINI_API_KEY=your_gemini_api_key
# Example: PORT=3001
```

### Running the App

```bash
# Development mode (frontend + backend)
npm run dev
```

Open <http://localhost:3000> in your browser. The Express API runs on port 3001 by default.

### Building for Production

```bash
npm run build          # Front‑end production bundle
npm start             # Serve the built app with the backend
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Starts Vite dev server and Express backend in watch mode |
| `build` | Generates a production‑ready Vite bundle |
| `lint` | Runs ESLint + Prettier checks |
| `test` | Executes unit tests (if present) |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Make your changes and ensure lint & tests pass
4. Open a Pull Request describing your changes

## 📄 License

This project is licensed under the **Apache License 2.0** – see the `LICENSE` file for details.

## 🙋‍♂️ Contact

Feel free to open an issue or reach out to the maintainer at `pitpi@example.com`.

---

Enjoy building fast, reliable task workflows with **TaskFlow-x**! 🚀
