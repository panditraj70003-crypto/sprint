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

Open http://localhost:3000. Backend configuration lives only in `backend/.env`; the frontend calls the API at http://localhost:4000 and needs no environment file. MongoDB stores accounts, sessions, and profiles. See [backend/README.md](../backend/README.md).

The profile API is versioned under `/api/v1/profiles`. Other project, application, and student-directory screens remain an in-memory demo in React context and reset on refresh.

Signing in is optional for browsing the demo. A themed **Log in** button appears in the app shell; authentication is required only for the profile API.
