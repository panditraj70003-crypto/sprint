# SkillBridge Backend

Standalone Express 4 API written in TypeScript. Backend routes, controllers, services, validation, shared middleware, configuration, and MongoDB models live in this folder.

## Setup

```sh
npm install
npm run dev
```

Set `MONGODB_URI` in `.env`; it defaults to `mongodb://127.0.0.1:27017/skillbridge`. `JWT_ACCESS_SECRET` must be a random value of at least 32 characters. The local `.env` has one generated value.

The default MongoDB URI assumes a MongoDB server is running on this machine. For MongoDB Atlas, replace `MONGODB_URI` with your cluster connection string.

The backend connects to MongoDB before listening. It creates user, session, profile, project, application, saved-project, and notification collections as documents are written. Project roles and members are embedded in project documents; no SQL setup or migration is needed.

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
| `GET` | `/api/v1/profiles` | No | List public student profiles |
| `GET` | `/api/v1/projects` | No | Browse published projects |
| `GET` | `/api/v1/projects/:id` | No | Read a project |
| `POST` | `/api/v1/projects` | Bearer access token | Create a project and add its creator as owner |
| `PATCH` | `/api/v1/projects/:id` | Bearer access token | Update a project |
| `PATCH` | `/api/v1/projects/:id/status` | Bearer access token | Close or reopen recruitment |
| `GET` | `/api/v1/my-projects` | Bearer access token | List created and joined projects |
| `POST` | `/api/v1/projects/:id/applications` | Bearer access token | Apply for a role |
| `GET` | `/api/v1/applications/me` | Bearer access token | List submitted applications |
| `GET` | `/api/v1/applications/received` | Bearer access token | List applications for owned projects |
| `GET` | `/api/v1/projects/:id/applications` | Bearer access token | List applications for one owned project |
| `PATCH` | `/api/v1/applications/:id/withdraw` | Bearer access token | Withdraw a pending application |
| `PATCH` | `/api/v1/applications/:id/decision` | Bearer access token | Accept or reject an application |
| `GET` | `/api/v1/saved-projects` | Bearer access token | List saved project IDs |
| `PUT` / `DELETE` | `/api/v1/projects/:id/saved` | Bearer access token | Save or unsave a project |
| `GET` | `/api/v1/notifications` | Bearer access token | List notifications |
| `PATCH` | `/api/v1/notifications/:id/read` | Bearer access token | Mark a notification as read |

Registration, login, refresh, and logout are handled by the auth module using MongoDB accounts/sessions, bcrypt password hashes, short-lived JWT access tokens, and rotated opaque refresh tokens. The frontend talks only to this API and stores the returned session. Passwords are never stored in profile documents.

## Structure

```text
src/
  config/       environment validation
  errors/       operational application error
  middlewares/  async wrapper, auth, validation, not-found, global errors
  modules/
    auth/       registration, login, refresh, logout
    profiles/   student profile routes, controllers, validation, model, and service
    projects/   project routes, controllers, validation, model, and service
    applications/ application routes, controllers, validation, model, and service
    saved-projects/ saved-project routes, controllers, model, and service
    notifications/ notification routes, controllers, model, and service
  utils/        shared authenticated-user helpers
  app.ts        Express middleware and route wiring
  server.ts     process startup and graceful shutdown
```

The global error handler returns a consistent `{ error: { message, code } }` response and hides unexpected internal errors in production. Validation failures include field details with status 400.
