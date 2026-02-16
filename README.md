<p align="center">
  <img src="https://img.icons8.com/fluency/96/dumbbell.png" alt="RepFlow" width="80" />
</p>

<h1 align="center">RepFlow</h1>

<p align="center">
  <strong>Your personal workout companion</strong> — track workouts, monitor progress, follow structured plans, and crush your fitness goals.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>

---

## Features

| | Feature | Description |
|---|---------|-------------|
| **1** | Live Workout Tracking | Log sets, reps, and weights in real-time with a built-in rest timer |
| **2** | Personal Records | Automatic PR detection when you hit new maxes |
| **3** | Workout Templates | Create reusable templates or use pre-built ones (PPL, Full Body, Upper/Lower) |
| **4** | Structured Plans | Follow multi-week training programs with progressive scheduling |
| **5** | Progress Analytics | Charts for volume trends, muscle group distribution, and frequency |
| **6** | Body Metrics | Track weight, measurements, and progress photos over time |
| **7** | Exercise Library | 40+ exercises with detailed instructions, or create your own |
| **8** | Dark / Light Mode | System-aware theming with manual toggle |
| **9** | Onboarding | Personalized setup for goals, equipment, and preferences |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Database | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| ORM | [Prisma](https://www.prisma.io/) (schema management) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Components | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.dev/) |

## Quick Start

### Prerequisites

- **Node.js 18+**
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd workout-tracker
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase — from project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key

# Prisma — from project Settings > Database
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### 3. Set Up Database

```bash
# Create tables from Prisma schema
npm run db:push

# Seed exercises, templates, and training plans
npm run db:seed
```

Then apply **Row Level Security** policies — copy the contents of [`prisma/rls-and-triggers.sql`](prisma/rls-and-triggers.sql) into the [Supabase SQL Editor](https://supabase.com/dashboard) and run it.

### 4. Run

```bash
npm run dev
```

Open **http://localhost:3000** — create an account and start tracking.

## Project Structure

```
src/
├── app/
│   ├── (auth)/             # Login, Signup, Verify Email, Reset Password
│   ├── (app)/              # Authenticated app routes
│   │   ├── dashboard/      # Stats overview + recent workouts
│   │   ├── workouts/       # List, detail, live tracking, new workout
│   │   ├── exercises/      # Library + custom exercise creation
│   │   ├── templates/      # Workout templates (browse + create)
│   │   ├── plans/          # Training plans (browse, active, suggested)
│   │   ├── progress/       # Body metrics, PRs, statistics
│   │   └── profile/        # User profile & settings
│   └── onboarding/         # First-time setup wizard
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── nav/                # Sidebar navigation
│   └── theme-*.tsx         # Dark mode provider & toggle
├── lib/
│   ├── supabase/           # Supabase clients (browser, server, middleware)
│   ├── constants.ts        # App constants
│   ├── utils.ts            # Helpers
│   └── validations.ts      # Zod form schemas
└── types/
    └── database.ts         # TypeScript types

prisma/
├── schema.prisma           # Database schema (tables + relations)
├── seed.ts                 # Seed script
└── rls-and-triggers.sql    # Supabase RLS policies & triggers

supabase/
├── schema.sql              # Legacy SQL schema (reference only)
└── seed.sql                # Exercise & template seed data
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to database |
| `npm run db:seed` | Seed exercises, templates, and plans |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:generate` | Regenerate Prisma client |

## Deployment

Deploy to [Vercel](https://vercel.com) with zero config:

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

Make sure your Supabase database is accessible from Vercel's IP range (enabled by default on Supabase).

## License

MIT
