# Profiles Backend

## Architecture

- Next.js provides the UI.
- Express under `backend/` owns API routes, authentication integration, validation, and profile persistence.
- MongoDB is the sole persistence and authentication layer; there is no relational database or SQL migration layer.

## Profile document

Each profile document is keyed by its MongoDB user ID and contains `full_name`, `department`, `year`, `bio`, `skills`, `interests`, `avatar_url`, `github_url`, `linkedin_url`, and `created_at`. Email and a bcrypt password hash are stored in the users collection.

The registration form submits account and profile fields to the backend. The backend creates the MongoDB user and profile documents. Existing users without a profile get one on login or first profile access.

## Authentication

The frontend calls the backend for registration, login, token refresh, logout, and profile operations. Passwords are bcrypt-hashed; access tokens are short-lived JWTs and refresh tokens are rotated and stored as hashes in MongoDB.

## API

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/profiles/me`
- `PATCH /api/v1/profiles/me`

The frontend's project and student-directory screens remain demo state in React context and reset on refresh.
