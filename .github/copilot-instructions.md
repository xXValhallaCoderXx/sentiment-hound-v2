## GitHub Copilot Instructions for sentiment-hound-v2

This document provides instructions for GitHub Copilot to better understand and assist with the `sentiment-hound-v2` monorepo.

### Project Overview

`sentiment-hound-v2` is a monorepo managed with pnpm workspaces and Turborepo. It consists of several applications and shared packages designed to analyze sentiment from various sources.

**Key Technologies:**

- **Frontend (Web App):** Next.js, React, TypeScript, Mantine UI
- **Backend API (Server):** NestJS, TypeScript
- **Sentiment Analysis Service:** Python, (likely a machine learning framework like PyTorch/TensorFlow based on checkpoint files)
- **Database:** PostgreSQL (managed with Prisma ORM)
- **Monorepo Management:** pnpm, Turborepo
- **Deployment/Orchestration:** Docker (as indicated by `docker-compose.yml`)

### Monorepo Structure

The repository is organized into two main directories: `apps` and `packages`.

#### `apps/`

This directory contains the deployable applications:

- **`apps/sentiment-analysis-service/`**:
  - A Python-based service responsible for performing sentiment analysis.
  - Key files: `main.py`, `requirements.txt`.
  - Contains model checkpoints in `checkpoints/`.
  - Likely exposes an API for other services to consume.
- **`apps/server/`**:
  - A NestJS application serving as the main backend API.
  - Handles business logic, interacts with the database, and communicates with other services (like the sentiment analysis service).
  - Key files: `main.ts`, `app.module.ts`.
  - API endpoints are likely defined in `src/api/` or within modules in `src/modules/`.
  - Uses services from `packages/services`.
- **`apps/web/`**:
  - A Next.js application for the user interface (dashboard and landing page).
  - Interacts with the `apps/server` backend API.
  - Uses Next.js App Router (indicated by `app/` directory structure).
  - Server Actions are located in `actions/`.
  - UI components are in `components/`.
  - Authentication is handled via NextAuth.js (`lib/next-auth.lib.ts`).

#### `packages/`

This directory contains shared libraries and configurations used across different applications:

- **`packages/database/`**:
  - Manages the Prisma schema (`prisma/schema.prisma`) and generated client (`generated/client/`).
  - Provides a typed Prisma client for database interactions (`src/client.ts`).
  - May contain database seeding scripts (`src/seed.ts`).
- **`packages/eslint-config/`**:
  - Shared ESLint configurations for consistent linting across the monorepo.
- **`packages/services/`**:
  - A TypeScript package containing shared business logic, service layers, and helper functions.
  - Likely used by both `apps/server` and potentially `apps/web` (for server actions or data fetching utilities).
  - Organized by domain/feature (e.g., `users/`, `tasks/`, `integrations/`).
- **`packages/typescript-config/`**:
  - Shared TypeScript configurations (`tsconfig.json` bases) for consistent TypeScript settings.

### Key Root Files

- **`docker-compose.yml`**: Defines how the different services are built and run together using Docker.
- **`package.json`**: Root pnpm workspace configuration.
- **`pnpm-lock.yaml`**: pnpm lockfile.
- **`pnpm-workspace.yaml`**: Defines the pnpm workspace packages.
- **`turbo.json`**: Turborepo configuration for managing build pipelines and caching.

### General Guidance for Copilot

- **Understand the Monorepo Context:** Changes in one package (e.g., `packages/services`) can affect multiple applications. Be mindful of these dependencies.
- **Separation of Concerns:**
  - UI logic resides in `apps/web`.
  - Backend API logic resides in `apps/server`.
  - Core sentiment analysis is in `apps/sentiment-analysis-service`.
  - Shared business logic and database interactions are often in `packages/services` and `packages/database`.
- **Prisma Usage:** When interacting with the database, use the Prisma client from `packages/database`. Schema changes should be made in `packages/database/prisma/schema.prisma`, followed by generating the client.
- **Next.js App Router & Server Actions:** The `apps/web` application uses the Next.js App Router. Prefer Server Actions (in `apps/web/actions/`) for mutations and data fetching where appropriate to maintain SSR/RSC benefits.
- **NestJS Conventions:** Follow NestJS conventions (modules, services, controllers) when working in `apps/server`.
- **Service Layer:** Utilize services from `packages/services` for reusable business logic rather than duplicating code in applications.
- **Environment Variables:** Be aware that applications will likely use environment variables for configuration (e.g., database connections, API keys). These are not committed to the repository.
- **Styling:** The `apps/web` application uses Mantine UI and CSS Modules.
- **Error Handling & Validation:** Implement robust error handling and input validation, especially at API boundaries and in server actions.

### When Making Changes

- **Identify the Right Package/App:** Before making changes, determine which part of the monorepo is most appropriate for the new code or modification.
- **Update Dependencies:** If adding or updating dependencies, do so in the correct `package.json` file (either for a specific app/package or the root if it's a dev dependency for the whole workspace).
- **Run Linters/Formatters:** Ensure code conforms to the project's linting and formatting standards.
- **Consider Turborepo:** Understand that `turbo build` and `turbo dev` are likely used to manage tasks.

By following these instructions, Copilot can provide more relevant and accurate assistance for the `sentiment-hound-v2` project.
