# SkillBridge

## Run locally

```sh
cd backend
npm install
npm run dev
```

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. Supabase configuration lives only in `backend/.env`; the frontend calls the API at http://localhost:4000 and does not need its own environment file. Set the project URL, publishable key, and frontend origin in `backend/.env`. See [backend/README.md](../backend/README.md).

Apply `backend/migrations/0001_profiles.sql` to your Supabase project before signing up. It creates the `profiles` table, creates a minimal profile for each new auth user, enables Row Level Security, and allows users to read and update only their own profile.

The profile API is versioned under `/api/v1/profiles`. Other project, application, and student-directory screens remain an in-memory demo in React context and reset on refresh.

Signing in is optional for browsing the demo. A themed **Log in** button appears in the app shell; authentication is required only for the Supabase-backed profile API.
