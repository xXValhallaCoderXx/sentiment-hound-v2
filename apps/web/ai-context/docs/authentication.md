# Authentication

## Purpose of This Document

This document provides an overview of the authentication system used in the Next.js web application, including login strategies, session management, and user roles.

## Authentication Strategy

The application uses NextAuth.js v5 (beta) with a hybrid approach supporting both OAuth and credentials-based authentication:

- **OAuth Providers**: Google OAuth 2.0 with `select_account` prompt
- **Credentials Provider**: Email/password authentication with bcrypt for password hashing
- **Session Strategy**: JWT sessions (required for credentials provider compatibility)
- **Database Adapter**: Prisma adapter for session and account persistence

## Core Logic Files

- `apps/web/lib/next-auth.lib.ts`: Main NextAuth configuration and providers setup
- `apps/web/actions/auth.actions.ts`: Server actions for authentication operations
- `apps/web/app/api/auth/[...nextauth]/route.ts`: NextAuth API route handler

## Session Management

- **Strategy**: JWT-based sessions stored client-side
- **Database Integration**: User accounts and sessions persisted via Prisma adapter
- **Session Validation**: Available throughout the application via `auth()` function

## User Roles and Permissions

The system defines basic user authentication without complex role-based access control:

- All authenticated users have access to dashboard features
- Plan-based feature restrictions handled through the Plan system
- Feature flags can be manually overridden per user via `featureFlags` JSON field

## Key Authentication Flows

- **Sign Up**: Email/password registration with bcrypt hashing
- **Sign In**: Support for both Google OAuth and email/password
- **Session Persistence**: JWT tokens with database session tracking
- **Password Reset**: Handled through standard NextAuth.js mechanisms

## Environment Variables

- `AUTH_GOOGLE_ID`: Google OAuth client ID
- `AUTH_GOOGLE_SECRET`: Google OAuth client secret
- `NEXTAUTH_SECRET`: Secret for JWT token signing
- `NEXTAUTH_URL`: Application base URL for OAuth callbacks
