# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RedShark** is a mobile productivity app for collaborative issue/idea tracking. It consists of:
- Project root `/` — React Native + Expo mobile app (TypeScript)
- `dataconnect/` — Firebase Data Connect schema + GraphQL connectors (Cloud SQL PostgreSQL)
- **No backend server** — frontend calls Firebase Data Connect SDK directly
- Cloudflare R2 for avatar/media storage

## Commands

### Frontend (project root)

Because the app uses native modules (`@react-native-google-signin`), you need a **dev client** — not plain Expo Go — for Google Sign-In:

```powershell
npm install
npx expo run:android           # first time: builds native (~5 min)
npx expo start --dev-client    # subsequent runs

# Email/password only (no native build needed):
npx expo start                 # Expo Go

npx expo start -c              # clear Metro cache
npm run lint
```

On Android emulator, the FDC emulator is accessed via `10.0.2.2:9399`. This is handled automatically by `services/dataconnect.ts`.

### Firebase Data Connect (local emulator)

```powershell
# From project root — start emulator (PGLite, no Cloud SQL credentials needed)
firebase emulators:start --only dataconnect
# Emulator UI: http://localhost:4000/dataconnect
# FDC endpoint: localhost:9399

# Regenerate TypeScript SDK after editing .gql files
firebase dataconnect:sdk:generate
# Output: src/dataconnect-generated/

# Deploy schema to Cloud SQL (production)
firebase deploy --only dataconnect:schema

# Deploy schema + connectors (production)
firebase deploy --only dataconnect
```

### EAS Build (Android)

```powershell
eas build --profile development --platform android   # dev build
eas build --profile preview --platform android       # preview APK
eas build --profile production --platform android    # production
```

After any build, add the SHA-1 fingerprint to Firebase: Firebase Console → Project Settings → Android app `com.helios.redshark`.

## Architecture

### Auth Flow

1. **Email/password:** `signInWithEmailAndPassword(firebaseAuth, email, password)` → `onAuthStateChanged` observer fires → `GetMe` FDC query → set user state
2. **Google Sign-In:** native popup → `signInWithCredential(firebaseAuth, googleCredential)` → `onAuthStateChanged` → if new user: `UpsertUser` mutation → `GetMe` → set user state
3. **Register:** `createUserWithEmailAndPassword` + `UpsertUser` mutation (observer skipped during this flow via `skipObserver` ref)

Firebase Auth manages credentials. FDC manages user profile data in the `users` table (keyed by `auth.uid`).

### Frontend Layer Structure

```
Firebase Auth (onAuthStateChanged)
  └─ AuthContext (contexts/AuthContext.tsx)
       └─ Firebase Data Connect SDK (@dataconnect/generated)
            └─ Cloud SQL PostgreSQL (asia-southeast1)
```

- **`AuthContext`** — global auth state (`user`, `loading`, `login`, `register`, `logout`, etc.)
- **TanStack React Query** — all data fetching/caching; query keys in `services/queryKeys.ts`
- **`services/dataconnect.ts`** — FDC connector init + emulator connection (imported once at app startup via `AuthContext`)
- **`services/firebase.ts`** — Firebase app + Auth initialization
- **`@dataconnect/generated`** — auto-generated TypeScript SDK at `src/dataconnect-generated/`
- **Expo Router** — file-based routing: `app/(auth)/` for login screens, `app/(tabs)/` for the main bottom-tab app, `app/issue/`, `app/idea/`, `app/profile/`

### Data Authorization

All queries and mutations are in `dataconnect/redshark/queries.gql` and `mutations.gql`.

- `@auth(level: PUBLIC)` — tags, skills (no login required)
- `@auth(level: USER)` — all other operations (Firebase Auth required)
- Ownership enforced server-side: `authorId: { eq_expr: "auth.uid" }` in mutation `where` clauses
- Soft deletes: `deletedAt_expr: "request.time"` instead of actual deletion
- Max-20-issues rule: enforced client-side via `CountMyActiveIssues` query in `issue/create.tsx`

### Data Model

Schema source: [dataconnect/schema/schema.gql](dataconnect/schema/schema.gql). Full reference: [SCHEMA.md](SCHEMA.md).

- **Identity:** `users` (keyed by Firebase `auth.uid`)
- **Core:** `ideas` (projects) → `issues` (bugs/tasks), `comments` on ideas
- **Lookups:** `skills`, `tags` (seeded via emulator UI)
- **Interaction:** `notifications`, `conversations`, `messages`
- **Arrays (PostgreSQL native):** `users.skill_ids`, `ideas.tag_ids`, `ideas.collaborator_ids`

Issues and ideas use soft deletes (`deletedAt`).

## Environment Setup

**`.env.local`** at project root (gitignored):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=<project-id>
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<project>.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...

EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...

EXPO_PUBLIC_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
EXPO_PUBLIC_R2_BUCKET=<bucket-name>
```

`serviceAccountKey.json` at project root (gitignored): Firebase Console → Project Settings → Service accounts → Generate new private key. Used by `firebase` CLI for deployment.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Mobile | React Native + Expo | 0.81 / 54 |
| Navigation | Expo Router | 6 |
| Styling | NativeWind (Tailwind) | 4.2 |
| Server state | TanStack React Query | 5 |
| Auth | Firebase Authentication + Google Sign-In | — |
| Data | Firebase Data Connect (GraphQL → Cloud SQL) | — |
| Storage | Cloudflare R2 | — |
