# SkillBridge Backend

Standalone Express 4 API written in TypeScript. Backend routes, controllers, services, validation, shared middleware, configuration, and database migration live in this folder.

## Setup

```sh
npm install
npm run dev
```

Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `.env`. The API does not use a secret/service-role key: authenticated requests are verified with Supabase Auth and database queries carry the caller's access token, so database access remains constrained by Row Level Security.

Apply `migrations/0001_profiles.sql` in the Supabase SQL editor before profile requests.

## Routes

| Method | Path | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Liveness check |
| `GET` | `/api/v1/profiles/me` | Bearer access token | Read the caller's profile |
| `PATCH` | `/api/v1/profiles/me` | Bearer access token | Validate and update the caller's profile |
| `POST` | `/api/v1/auth/register` | No | Register a student |
| `POST` | `/api/v1/auth/login` | No | Authenticate and return a session |
| `POST` | `/api/v1/auth/callback` | No | Validate the email-confirmation session |
| `POST` | `/api/v1/auth/refresh` | No | Refresh an expired access token |
| `POST` | `/api/v1/auth/logout` | Bearer access token | Revoke the current session |

Registration, email confirmation, login, refresh, and logout are handled by the auth module through Supabase Auth. The frontend talks only to this API and stores the returned session. A database trigger creates a minimal profile on signup. The Express API does not persist passwords.

## Structure

```text
src/
  config/       environment validation
  errors/       operational application error
  middlewares/  async wrapper, auth, validation, not-found, global errors
  modules/
    auth/       registration, login, confirmation, refresh, logout
    profiles/   routes, controllers, schemas, and service
  app.ts        Express middleware and route wiring
  server.ts     process startup and graceful shutdown
migrations/    SQL schema, trigger, and RLS policies
```

The global error handler returns a consistent `{ error: { message, code } }` response and hides unexpected internal errors in production. Validation failures include field details with status 400.
