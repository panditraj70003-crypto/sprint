# Profiles Backend Analysis

## Scope

The first backend module is **profiles**: student identity, academic details, skills and interests, plus registration and login. Supabase Auth owns credentials and sessions. PostgreSQL stores the matching student profile in `public.profiles`.

This document records the initial analysis and implementation plan. The implementation has since started; see `backend/migrations/0001_profiles.sql` and the Supabase integration in `frontend/`.

## Project findings

- The repository has `frontend/` and an empty `backend/` directory. There is no existing API, schema, migration, Supabase setup, or backend convention to extend.
- The frontend is a Next.js 14 App Router application using TypeScript. Its current dependencies do not include the Supabase JavaScript client.
- Student data is demo data in `frontend/lib/data.ts`; `frontend/lib/store.tsx` keeps edits in React context. It resets on refresh, as the frontend README states.
- The current profile page edits name, department, year, bio, skills, interests, preferred roles, GitHub, LinkedIn, portfolio, and displays past projects. There is no registration, login, session, or avatar-upload flow.
- The demo models `year` as labels such as `"3rd Year"`, while the proposed database uses an integer. Department values are currently display labels such as `"Computer Science"` and `"Electronics"`.

## Proposed data ownership

| Data | Owner | Notes |
| --- | --- | --- |
| Email, password, account identity, session | Supabase Auth (`auth.users`) | Never duplicate or store passwords in `profiles`. |
| Student profile fields | `public.profiles` | One row per auth user, keyed by the same UUID. |
| Preferred roles, portfolio, past projects | Future schema decision | Present in the demo UI, absent from the proposed table. Keep out of this module's first schema unless product scope confirms they are profile data. |
| Avatar image bytes | Supabase Storage | Store only the resulting object URL/path in `avatar_url`. Upload policy needs to restrict ownership. |

## Proposed `profiles` table

| Column | Type | Constraints / behavior |
| --- | --- | --- |
| `id` | `uuid` | Primary key; foreign key to `auth.users(id)` with `ON DELETE CASCADE`. |
| `full_name` | `text` | Required for a complete student profile; decide whether profile creation may begin before it is provided. |
| `department` | `text` | Optional or required per onboarding decision; constrain accepted values in application validation or a reference table if the list must be controlled. |
| `year` | `integer` | Validate against the institution's supported academic years (likely 1–4); confirm whether this means current year of study. |
| `bio` | `text` | Optional short introduction; consider a maximum length. |
| `skills` | `text[]` | Defaults to an empty array; normalize whitespace and avoid duplicate values. |
| `interests` | `text[]` | Defaults to an empty array; normalize whitespace and avoid duplicate values. |
| `avatar_url` | `text` | Nullable; points to an owned Storage object or stable public URL according to bucket policy. |
| `github_url` | `text` | Nullable; validate as a URL if supplied. |
| `linkedin_url` | `text` | Nullable; validate as a URL if supplied. |
| `created_at` | `timestamptz` | Non-null, default `now()`. |

The proposed schema has no `updated_at`. Add it if consumers need reliable profile-change timestamps. It also has no email column; read the authenticated email from Supabase Auth rather than maintaining a second source of truth.

## Registration and login flow

1. **Register:** collect email/password and the agreed minimum profile fields. Create the account with Supabase Auth. Create the profile row tied to the returned auth UUID, or use a database trigger to create a minimal row when an auth user is inserted. Choose one ownership strategy and make profile creation safe to retry.
2. **Confirm email:** decide whether email confirmation is enabled. If enabled, show a confirmation-pending state and rely on Supabase's configured redirect URL.
3. **Login:** authenticate with Supabase Auth; do not query credentials from `profiles`. Redirect based on the returned session and whether required onboarding fields are complete.
4. **Read/update profile:** use the authenticated user ID. Users can read and update their own profile. Public student discovery, if required by the product, should have an explicit read policy and should expose only intended fields.
5. **Logout:** revoke the local Supabase session through the client/server integration and return to the signed-out route.

## Backend/API shape

The implementation uses a standalone Express API in `backend/`, with separate auth and profile modules, Zod validation, Supabase integration, auth middleware, an async middleware wrapper, and a global error handler. The frontend calls the backend for registration, login, confirmation, refresh, logout, and profile operations. The backend verifies bearer access tokens and accesses the database with the caller's token so RLS applies. Only `backend/.env` holds Supabase configuration.

## Security and validation requirements

- Enable Row Level Security on `public.profiles` before exposing it through Supabase APIs.
- Add policies binding `SELECT` and `UPDATE` to `auth.uid() = id`; permit `INSERT` only for the matching authenticated UUID if client-side profile creation is selected. Do not permit users to change `id`.
- If public discovery is needed, define a deliberate public-read policy or a restricted view; do not make every profile field public by default.
- Validate required fields, string lengths, year range, URL format, and array item length/count on the server as well as in the UI.
- Never expose the service-role key to browser code. Configure auth redirect URLs and environment variables for local and deployed environments.
- For avatar uploads, restrict file size/type and storage paths to the current user's UUID; align Storage access policy with profile visibility.

## Decisions to settle before implementation

1. Does `year` mean 1–4, and should the UI display `1st Year` while storing `1`?
2. Are department values a fixed institution list, free text, or normalized IDs? The current demo labels may not match the example abbreviations (CSE/ECE).
3. Which fields are required at signup, and may users finish profile setup later?
4. Is email confirmation required? Which routes should receive auth redirects?
5. Are student profiles public to signed-in users, publicly accessible, or private by default?
6. Should preferred roles, portfolio, and past projects remain in the profile experience? They exist in the demo but are missing from the proposed table.
7. Should profile creation use a database trigger or explicit application logic? A trigger guarantees a row for each auth user; app logic offers clearer onboarding control but must handle partial failures.

## Suggested implementation order

1. Confirm the decisions above and configure the Supabase project/environment.
2. Add a versioned SQL migration for the table, constraints/defaults, indexes if needed, RLS, and policies.
3. Add typed Supabase clients and server-side session integration appropriate to the installed Next.js version.
4. Implement registration, login, logout, and profile read/update with validation and useful error handling.
5. Replace the demo profile in the frontend store/profile page with session-backed data; keep non-profile demo entities separate until their modules are designed.
6. Add avatar upload and public directory behavior only once their access rules are agreed.
