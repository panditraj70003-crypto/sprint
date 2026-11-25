# SkillBridge Backend

Standalone Express 4 API written in TypeScript. Backend routes, controllers, services, validation, shared middleware, configuration, and MongoDB models live in this folder.

## Setup

```sh
npm install
npm run dev
```

Set `MONGODB_URI` in `.env`; it defaults to `mongodb://127.0.0.1:27017/skillbridge`. `JWT_ACCESS_SECRET` must be a random value of at least 32 characters. The local `.env` has one generated value.

The default MongoDB URI assumes a MongoDB server is running on this machine. For MongoDB Atlas, replace `MONGODB_URI` with your cluster connection string.

The backend connects to MongoDB before listening. It creates user, session, and profile collections as documents are written; no SQL setup or migration is needed.

## Routes

| Method | Path | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Liveness check |
| `GET` | `/api/v1/profiles/me` | Bearer access token | Read the caller's profile |
| `PATCH` | `/api/v1/profiles/me` | Bearer access token | Validate and update the caller's profile |
| `POST` | `/api/v1/auth/register` | No | Register a student |
| `POST` | `/api/v1/auth/login` | No | Authenticate and return a session |
| `POST` | `/api/v1/auth/refresh` | No | Refresh an expired access token |
| `POST` | `/api/v1/auth/logout` | Bearer access token | Revoke the current session |

Registration, login, refresh, and logout are handled by the auth module using MongoDB accounts/sessions, bcrypt password hashes, short-lived JWT access tokens, and rotated opaque refresh tokens. The frontend talks only to this API and stores the returned session. Passwords are never stored in profile documents.

## Structure

```text
src/
  config/       environment validation
  errors/       operational application error
  middlewares/  async wrapper, auth, validation, not-found, global errors
  modules/
    auth/       registration, login, refresh, logout
    profiles/   routes, controllers, validation, MongoDB model, and service
  app.ts        Express middleware and route wiring
  server.ts     process startup and graceful shutdown
```

The global error handler returns a consistent `{ error: { message, code } }` response and hides unexpected internal errors in production. Validation failures include field details with status 400.
