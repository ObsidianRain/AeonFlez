# AeonFlez Next.js + Supabase Setup Guide

## Overview

This is the modern dynamic version of AeonFlez built with:
- **React** (via Vite)
- **TypeScript**
- **Supabase** (PostgreSQL database + Authentication)
- **React Router** (navigation)
- **Tailwind CSS** (styling - needs to be added)
- **Recharts** (data visualization)
- **Lucide React** (icons)

## Quick Start

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to finish setting up
4. Go to **Project Settings** → **API**
5. Copy your **Project URL** and **anon/public key**

### 2. Configure Environment Variables

```bash
cd aeonflez-next
cp .env.example .env
```

Edit `.env` and paste your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Transactions table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric not null,
  category text not null,
  description text not null,
  date date not null,
  account text,
  created_at timestamptz default now()
);

-- Budgets table
create table budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category text not null,
  limit_amount numeric not null,
  spent numeric default 0,
  period text check (period in ('monthly', 'weekly')) not null,
  created_at timestamptz default now()
);

-- Journal entries table
create table journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  tags text[],
  mood text,
  audio_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  due_date date,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  project_id uuid,
  created_at timestamptz default now()
);

-- Projects table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  status text check (status in ('active', 'completed', 'archived')) default 'active',
  created_at timestamptz default now()
);

-- Habits table
create table habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  streak integer default 0,
  completed_dates date[] default '{}',
  goal integer default 1,
  unit text default 'times',
  created_at timestamptz default now()
);

-- Events table
create table events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text,
  notes text,
  created_at timestamptz default now()
);

-- Files table
create table files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  url text not null,
  size integer not null,
  type text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table journal_entries enable row level security;
alter table tasks enable row level security;
alter table projects enable row level security;
alter table habits enable row level security;
alter table events enable row level security;
alter table files enable row level security;

-- Create policies (users can only access their own data)
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- Repeat similar policies for other tables...
create policy "Users can view own journal_entries"
  on journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal_entries"
  on journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal_entries"
  on journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own journal_entries"
  on journal_entries for delete
  using (auth.uid() = user_id);

create policy "Users can view own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

create policy "Users can view own habits"
  on habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on habits for delete
  using (auth.uid() = user_id);

create policy "Users can view own events"
  on events for select
  using (auth.uid() = user_id);

create policy "Users can insert own events"
  on events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on events for update
  using (auth.uid() = user_id);

create policy "Users can delete own events"
  on events for delete
  using (auth.uid() = user_id);

create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can view own budgets"
  on budgets for select
  using (auth.uid() = user_id);

create policy "Users can insert own budgets"
  on budgets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own budgets"
  on budgets for update
  using (auth.uid() = user_id);

create policy "Users can view own files"
  on files for select
  using (auth.uid() = user_id);

create policy "Users can insert own files"
  on files for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own files"
  on files for delete
  using (auth.uid() = user_id);
```

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Test Authentication

1. Navigate to `/signup` to create an account
2. Check your email for the confirmation link (if email confirmations are enabled)
3. Log in at `/login`
4. You'll be redirected to the dashboard

## Project Structure

```
aeonflez-next/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── DashboardLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/          # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useTransactions.ts
│   │   ├── useJournalEntries.ts
│   │   ├── useTasks.ts
│   │   ├── useHabits.ts
│   │   └── useEvents.ts
│   ├── lib/
│   │   ├── api.ts        # Supabase API functions
│   │   └── supabase/
│   │       └── client.ts # Supabase client configuration
│   ├── pages/            # Page components
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   └── DashboardPage.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── App.tsx           # Main app component with routing
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Example environment variables
└── SETUP.md              # This file
```

## Next Steps

### Add More Pages
Create additional page components for:
- `/financial` - Full financial tracking page
- `/journals` - Journal entries list and editor
- `/tasks` - Task management
- `/calendar` - Calendar view
- `/habits` - Habit tracker
- `/files` - File management

### Add Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Add File Storage
Enable Supabase Storage buckets for file uploads.

### Add Real-time Subscriptions
Use Supabase's real-time features for live updates.

## Troubleshooting

- **"Invalid API key"**: Check your `.env` file has correct Supabase credentials
- **"Row Level Security policy violation"**: Ensure RLS policies are set up correctly
- **Email not received**: Check Supabase email settings or disable email confirmation in development

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Recharts Documentation](https://recharts.org)
