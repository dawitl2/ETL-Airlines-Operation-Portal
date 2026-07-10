# ETL Airlines Operation Portal

ETL Airlines Operation Portal is a full-stack airline operations and security platform prototype. The project is being built as a professional operations portal for airline staff, with a strong focus on authentication, account security, session control, authorization, and auditability.

The current implementation combines role-specific airline operations workspaces with a Next.js authentication foundation. The long-term goal is to support secure operational workflows for administrators, operations managers, crew schedulers, supervisors, flight crew, and maintenance technicians.

## Core Focus

The main focus of this project is the security and identity layer that supports an airline operations system:

- Credential-based employee authentication
- JWT access tokens
- Refresh-token session management
- HttpOnly cookie token transport
- Role and permission based authorization
- Account state handling
- Session revocation
- Audit event recording
- MongoDB-backed identity models
- Protected server APIs

## Technology Stack

- Next.js App Router
- React
- JavaScript
- MongoDB Atlas
- Mongoose
- Zod
- bcrypt password hashing
- JSON Web Tokens
- HttpOnly cookies
- Recharts
- Lucide React
- Custom responsive CSS with light and dark themes

## Application Areas

The portal contains separate workspaces for:

- System Administrator
- Operations Manager
- Crew Scheduler
- Supervisor
- Flight Crew Member
- Maintenance Technician

Each workspace is designed around a different operational responsibility while sharing the same visual identity and secure application shell.

## Authentication Architecture

Authentication is handled directly inside the application through Next.js Route Handlers. The app does not use Firebase Authentication, Auth0, Clerk, Supabase Auth, or a separate Express server.

Implemented authentication routes:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/logout-all`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

The authentication flow validates credentials server-side, checks account status, applies failed-login lockout behavior, creates a session record, issues cookies, and returns only safe user profile data to the client.

## Database Models

The MongoDB layer includes models for:

- User
- EmployeeProfile
- Role
- Permission
- Session
- PasswordResetToken
- EmailVerificationToken
- Invitation
- AuditEvent

These models are the foundation for the security module and future operational workflows.

## Environment Configuration

Create a local `.env.local` file based on `.env.example`.

Required environment values include:

- MongoDB connection string
- JWT access secret
- JWT refresh secret
- Application URL
- Email sender configuration
- Optional email provider API key

Do not commit real secrets or production credentials.

## Local Development

Install dependencies:

```bash
npm install
```

Seed development data after configuring MongoDB:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

Build for production:

```bash
npm run build
```

## Current Status

This project is not finished yet.

The Phase 2 foundation is in place: Next.js migration, MongoDB models, authentication routes, JWT/session utilities, protected role routes, and development seeding support. The security module is still being expanded and hardened, and several flows are still planned or partially implemented.

Not yet complete:

- Production-ready password reset flow
- Invitation acceptance flow
- Email delivery integration
- Full operational API persistence
- Complete automated test coverage
- Production deployment configuration
- Final security review

This repository should be treated as an active development project, not a finished production system.
