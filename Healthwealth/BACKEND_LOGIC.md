# HealthWealth — Backend Logic Documentation

> **Stack:** React 19 + Vite · Supabase (PostgreSQL + Auth) · Row Level Security · Tailwind CSS v4

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Supabase Configuration](#supabase-configuration)
3. [Database Schema](#database-schema)
4. [Authentication System](#authentication-system)
5. [Admin Authentication](#admin-authentication)
6. [API Layer — `src/lib/api.js`](#api-layer)
7. [Row Level Security (RLS) Policies](#row-level-security)
8. [Data Flow Diagrams](#data-flow-diagrams)
9. [Module Breakdown](#module-breakdown)
10. [Environment Variables](#environment-variables)
11. [Admin Data Access](#admin-data-access)
12. [Error Handling Strategy](#error-handling-strategy)
13. [Database Functions (SQL)](#database-functions)
14. [Security Considerations](#security-considerations)
15. [Extending the Backend](#extending-the-backend)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  User App  │  │   Admin    │  │  Auth UI   │            │
│  │ (Dashboard)│  │ Dashboard  │  │  (SignIn)  │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │               │               │                    │
│        └───────────────┼───────────────┘                    │
│                        ▼                                    │
│              src/lib/api.js (API Layer)                     │
│                        │                                    │
│              src/lib/supabase.js (Client)                   │
└────────────────────────┼────────────────────────────────────┘
                         │  HTTPS / WebSocket
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Backend                          │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Auth Service│  │  PostgreSQL  │  │  Realtime        │  │
│  │  (JWT Tokens)│  │  Database    │  │  (Subscriptions) │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                         │                                   │
│              Row Level Security (RLS)                       │
│              ┌──────────┴─────────────┐                    │
│              │  Users only see their  │                    │
│              │  own data by default   │                    │
│              └────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Supabase Configuration

**File:** `src/lib/supabase.js`

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl   = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function requireSupabase() {
  if (!supabase) throw new Error("Supabase not configured.");
  return supabase;
}
```

- `isSupabaseConfigured` — Guards all API calls; app runs in demo mode when Supabase is absent.
- `requireSupabase()` — Throws a clear error rather than failing silently.
- The client is a singleton — instantiated once and reused across the entire app.

---

## Database Schema

### Table: `profiles`

Stores user profile data synced from Supabase Auth.

| Column               | Type        | Description                              |
|----------------------|-------------|------------------------------------------|
| `id`                 | `uuid` (PK) | References `auth.users(id)`              |
| `email`              | `text`      | User email address                       |
| `full_name`          | `text`      | Display name                             |
| `phone_number`       | `text`      | Contact phone                            |
| `age`                | `integer`   | User age                                 |
| `gender`             | `text`      | Gender identity                          |
| `occupation`         | `text`      | Job/occupation                           |
| `push_notifications` | `boolean`   | Notification preference (default: true)  |
| `dark_mode`          | `boolean`   | UI theme preference (default: false)     |
| `email_updates`      | `boolean`   | Marketing emails (default: true)         |
| `created_at`         | `timestamptz` | Record creation timestamp             |
| `updated_at`         | `timestamptz` | Last update timestamp                 |

---

### Table: `finance_entries`

Tracks all financial records entered by users.

| Column         | Type        | Description                                    |
|----------------|-------------|------------------------------------------------|
| `id`           | `uuid` (PK) | Auto-generated primary key                     |
| `user_id`      | `uuid` (FK) | References `auth.users(id)` — cascade delete   |
| `entry_type`   | `text`      | One of: `income`, `expense`, `loan`            |
| `source`       | `text`      | Source/category label                          |
| `frequency`    | `text`      | Payment frequency (monthly, weekly, etc.)      |
| `payment_mode` | `text`      | Cash, bank transfer, UPI, etc.                 |
| `amount`       | `numeric`   | Transaction amount                             |
| `created_at`   | `timestamptz` | Entry creation timestamp                     |

---

### Table: `health_assessments`

Stores user-submitted health form data (one record per user, updated on resubmit).

| Column                    | Type      | Description                            |
|---------------------------|-----------|----------------------------------------|
| `id`                      | `uuid` PK | Auto-generated                         |
| `user_id`                 | `uuid` FK | References auth user                   |
| `name`                    | `text`    | Name at time of assessment             |
| `gender`                  | `text`    | Gender                                 |
| `age`                     | `integer` | Age                                    |
| `height`                  | `text`    | Height (free text)                     |
| `weight`                  | `text`    | Weight (free text)                     |
| `tea_coffee`              | `jsonb`   | Tea/coffee habits (structured object)  |
| `breakfast/lunch/dinner`  | `text`    | Meal description                       |
| `*_quantity`              | `numeric` | Meal portion size                      |
| `snacks`                  | `text`    | Snack habits                           |
| `alcohol`                 | `numeric` | Alcohol units per week                 |
| `water_intake`            | `numeric` | Daily water in litres                  |
| `sleeping_quality_hours`  | `numeric` | Sleep hours per night                  |
| `sleeping_quality_minutes`| `numeric` | Additional sleep minutes               |
| `medication`              | `text`    | Current medications                    |
| `headache` / `tired_morning` / `wake_energy` / `body_pain` | `text` | Symptom indicators |
| `physical_activity`       | `text`    | Exercise routine                       |
| `meditation`              | `text`    | Mindfulness practice                   |
| `others_text`             | `text`    | Free-text notes                        |
| `others_yes_no`           | `text`    | Additional flag                        |
| `created_at` / `updated_at` | `timestamptz` | Timestamps                     |

---

### Table: `mindset_assessments`

Stores responses and scores from the mindset quiz.

| Column       | Type        | Description                        |
|--------------|-------------|------------------------------------|
| `id`         | `uuid` PK   | Auto-generated                     |
| `user_id`    | `uuid` FK   | References auth user               |
| `responses`  | `boolean[]` | Array of true/false quiz answers   |
| `score`      | `integer`   | Computed mindset score (0–100)     |
| `created_at` / `updated_at` | `timestamptz` | Timestamps          |

---

## Authentication System

### Sign In

```js
// src/lib/api.js
export async function signInWithEmail(email, password) {
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data; // { user, session }
}
```

**Flow:**
1. User submits credentials → `signInWithEmail()` called
2. Supabase validates → returns JWT access token + refresh token
3. `App.jsx` listens via `supabase.auth.onAuthStateChange()` → sets session state
4. React re-renders to show authenticated content

---

### Sign Up

```js
export async function signUpWithEmail(email, password, profile) {
  const { data, error } = await requireSupabase().auth.signUp({
    email, password,
    options: { data: { user_name: profile.userName, phone_number: profile.phoneNumber } }
  });
  if (error) throw error;

  // Auto-create profile record if session is immediately active
  if (data.user && data.session) {
    await saveProfile(data.user.id, { email, fullName: profile.userName, ... });
  }

  return data;
}
```

**On new user creation, the SQL trigger fires automatically:**
```sql
-- Trigger: on_auth_user_created
-- Inserts a profile row from auth.users metadata
```

---

### Google OAuth

```js
export async function signInWithGoogle() {
  const { data, error } = await requireSupabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin, queryParams: { prompt: "select_account" } }
  });
  if (error) throw error;
  return data;
}
```

Redirects to Google → returns to app → `onAuthStateChange` picks up session.

---

### Session Management

```js
// App.jsx
useEffect(() => {
  getCurrentSession().then(setSession).finally(() => setIsCheckingSession(false));

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session); // Keeps UI in sync with auth state changes
  });

  return () => subscription.unsubscribe(); // Cleanup on unmount
}, []);
```

- Sessions are persisted in `localStorage` by Supabase by default.
- Tokens are automatically refreshed by the Supabase client.

---

### Password Reset

```js
export async function sendPasswordResetEmail(email) {
  const { data, error } = await requireSupabase().auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
  return data;
}
```

User receives email → clicks link → redirected to app → `updatePassword()` called.

---

### Sign Out

```js
export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
  localStorage.removeItem("admin_session");
}
```

Clears both Supabase JWT and local admin session.

---

## Admin Authentication

Admin auth is **local-only** — no Supabase table involved. It uses `localStorage` to persist a mock session.

```js
export async function loginAdmin(username, password) {
  if (username === "admin" && password === "admin") {
    const session = {
      user: { id: "admin", email: "admin@healthwealth.com", role: "admin" },
      token: "admin-token-" + Date.now(),
    };
    localStorage.setItem("admin_session", JSON.stringify(session));
    return session;
  }
  throw new Error("Invalid admin credentials");
}

export async function getAdminSession() {
  const session = localStorage.getItem("admin_session");
  return session ? JSON.parse(session) : null;
}
```

**Routing:** The admin portal lives at `/admin/`. The `App.jsx` router checks `currentPath` and renders `<AdminLogin>` or `<AdminDashboard>` accordingly.

> ⚠️ **Production Note:** Replace localStorage admin auth with a proper server-side role check using Supabase's `user.role` or a separate `admins` table with RLS.

---

## API Layer

**File:** `src/lib/api.js`

All Supabase interactions are encapsulated here. Components never call `supabase` directly.

### Profile APIs

| Function | Purpose |
|----------|---------|
| `fetchProfile(userId, email, metadata)` | Fetches profile; creates fallback if missing |
| `saveProfile(userId, profile)` | Upserts profile record |

### Finance APIs

| Function | Purpose |
|----------|---------|
| `fetchFinanceEntries(userId)` | Returns all finance entries for a user, sorted by `created_at` |
| `createFinanceEntry(userId, entry)` | Inserts a new finance record |
| `deleteFinanceEntry(entryId)` | Deletes a record by ID |

### Health APIs

| Function | Purpose |
|----------|---------|
| `fetchLatestHealthAssessment(userId)` | Returns the most recent health form submission |
| `saveHealthAssessment(userId, formData)` | Upserts health record (update if exists, else insert) |

### Mindset APIs

| Function | Purpose |
|----------|---------|
| `fetchLatestMindsetAssessment(userId)` | Fetches latest quiz result |
| `saveMindsetAssessment(userId, responses, score)` | Saves quiz answers and computed score |

### Admin APIs

| Function | Purpose |
|----------|---------|
| `fetchAllUsersData()` | Fetches ALL profiles, finance, and health records (admin only) |
| `loginAdmin(username, password)` | Validates admin credentials, stores session |
| `getAdminSession()` | Reads admin session from `localStorage` |

---

## Row Level Security

All four tables have RLS **enabled**. Users can only access their own data.

```sql
-- profiles: users read/write only their own row
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

-- finance_entries: full CRUD on own records
CREATE POLICY "Users can manage own finance entries"
  ON public.finance_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- health_assessments: full CRUD on own records
CREATE POLICY "Users can manage own health assessments"
  ON public.health_assessments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

> **Admin access to all user data** currently works because `fetchAllUsersData()` uses the anon key. In production, use a `service_role` key server-side or an admin-specific RLS policy.

---

## Data Flow Diagrams

### User Sign-In Flow

```
SignIn Component
    │
    ├─ signInWithEmail(email, password)
    │       │
    │       └─► Supabase Auth API
    │               │
    │           JWT Token returned
    │               │
    │       onAuthStateChange fires
    │               │
    │       setSession(session) in App.jsx
    │               │
    └──────────► User Dashboard renders
```

### Health Assessment Save Flow

```
Health.jsx (form submit)
    │
    ├─ saveHealthAssessment(userId, formData)
    │       │
    │       ├─ Check: existing record for userId?
    │       │       │
    │       │   YES → UPDATE existing row
    │       │   NO  → INSERT new row
    │       │
    │       └─► Supabase responds with saved record
    │
    └──────────► UI updates with confirmation
```

### Admin Data Load Flow

```
AdminDashboard mounts
    │
    ├─ fetchAllUsersData()
    │       │
    │       ├─ SELECT * FROM profiles
    │       ├─ SELECT * FROM finance_entries
    │       └─ SELECT * FROM health_assessments
    │               │
    │       All three queries run in parallel
    │               │
    └──────────► setData({ profiles, finance, health })
                    │
                Dashboard renders user-wise data
```

---

## Module Breakdown

```
src/
├── lib/
│   ├── supabase.js       → Supabase client initialization
│   └── api.js            → All API functions (auth, CRUD, admin)
│
├── assets/
│   ├── pages/
│   │   ├── SignIn.jsx          → Auth: sign in / sign up / forgot password
│   │   ├── Dashboard.jsx       → Main user home with summary widgets
│   │   ├── Finance.jsx         → Finance entry management
│   │   ├── Health.jsx          → Health assessment form
│   │   ├── Mindset.jsx         → Mindset quiz & scoring
│   │   ├── Profile.jsx         → Profile edit + settings
│   │   ├── AdminLogin.jsx      → Admin credential gate
│   │   └── AdminDashboard.jsx  → Full admin data view (all users)
│   │
│   └── components/             → Shared reusable UI components
│
├── App.jsx                     → Root router + session management
└── main.jsx                    → React DOM entry point
```

---

## Environment Variables

**File:** `.env` (never commit to Git)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

These are injected at build time by Vite. Only `VITE_` prefixed variables are exposed to the browser.

---

## Admin Data Access

The `fetchAllUsersData()` function bypasses user-level RLS because Supabase's **anon key** is used and the current RLS policies don't explicitly restrict admin reads. In production:

**Option 1 — Service Role (Server-side only):**
```js
const adminClient = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY);
```

**Option 2 — Admin RLS Policy:**
```sql
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins)
  );
```

---

## Error Handling Strategy

All API functions follow the pattern:
```js
const { data, error } = await supabase.from("table").select("*");
if (error) throw error;  // Bubble up to component
return data;
```

Components catch errors at the call site:
```js
try {
  const result = await someApiFunction();
  setState(result);
} catch (err) {
  alert(err.message); // Or show toast/error UI
} finally {
  setIsLoading(false);
}
```

---

## Database Functions

### `handle_new_user()` — Trigger Function

Automatically creates a `profiles` row when a new user signs up via Auth:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name'),
    new.raw_user_meta_data->>'phone_number'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();

  RETURN new;
END;
$$;
```

### `delete_current_user()` — Account Deletion

Allows authenticated users to delete their own Auth account (and cascade to all related data):

```sql
CREATE OR REPLACE FUNCTION public.delete_current_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
```

---

## Security Considerations

| Risk | Mitigation |
|------|-----------|
| Exposed anon key | Anon key is safe for client; RLS enforces data isolation |
| Admin hardcoded password | Replace with Supabase role-based auth in production |
| SQL injection | Supabase JS client uses parameterized queries — safe by default |
| Account deletion cascade | `ON DELETE CASCADE` on all `user_id` FK columns |
| Unauthenticated admin access | Admin route checks `localStorage` session; replace with JWT in production |

---

## Extending the Backend

### Add a New Data Table

1. **Write the SQL migration:**
```sql
CREATE TABLE public.new_feature (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- ... your columns
  created_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.new_feature ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own new_feature"
  ON public.new_feature FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

2. **Add API functions in `api.js`:**
```js
export async function fetchNewFeature(userId) {
  const { data, error } = await requireSupabase()
    .from("new_feature")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}
```

3. **Use in component:**
```js
useEffect(() => {
  fetchNewFeature(user.id).then(setData).catch(console.error);
}, [user.id]);
```

4. **Expose in Admin dashboard** by adding to `fetchAllUsersData()`.

---

*Last updated: May 2026 · HealthWealth v0.0.0*
