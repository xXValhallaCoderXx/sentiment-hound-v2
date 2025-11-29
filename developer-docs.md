# Developer Documentation

Welcome to the Sentiment Hound v2 developer documentation. This guide will help you set up your development environment and get the project running.

## Prerequisites

Ensure you have the following installed on your system:

*   **Node.js**: Version 18 or higher
*   **pnpm**: Package manager (`npm install -g pnpm`)
*   **Python**: Version 3.9 or higher
*   **Docker & Docker Compose**: For the PostgreSQL database

## Quick Start

We have convenience scripts to handle most of the setup.

1.  **Install Dependencies & Setup Environment**:
    ```bash
    ./scripts/install.sh
    ```
    This script will:
    *   Install Node.js dependencies via `pnpm`.
    *   Set up the Python virtual environment in `apps/sentiment-analysis-service/venv`.
    *   Install Python dependencies.
    *   Generate the Prisma client.

2.  **Start Development Server**:
    ```bash
    ./scripts/dev.sh
    ```
    This script starts all services:
    *   **Web App**: [http://localhost:3000](http://localhost:3000)
    *   **API Server**: [http://localhost:4000](http://localhost:4000)
    *   **Sentiment Analysis Service**: [http://localhost:8000](http://localhost:8000)

## Detailed Setup & Configuration

### Environment Variables

The project uses multiple `.env` files. Ensure these are configured correctly.

*   **Root**: `.env` (Used by Docker Compose)
*   **Database Package** (`packages/database/.env`):
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sentiment-hound?schema=public"
    ```
*   **Scripts Package** (`packages/scripts/.env`):
    ```env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sentiment-hound?schema=public"
    # Reddit credentials (can be dummy values for development)
    REDDIT_CLIENT_ID=dummy
    REDDIT_CLIENT_SECRET=dummy
    ```
*   **Web App** (`apps/web/.env.local`):
    *   Check `apps/web/.env.local.example` for required variables.

### Database Management

The project uses PostgreSQL and Prisma.

1.  **Start Database**:
    ```bash
    docker-compose up -d
    ```

2.  **Run Migrations**:
    ```bash
    pnpm db:deploy
    # OR
    pnpm turbo db:push
    ```

3.  **Seed Database**:
    Populate the database with initial plans (Trial, Developer, Starter, Pro) and providers (YouTube, Reddit).
    ```bash
    pnpm --filter @repo/scripts db-seed
    ```

### User Management & Authentication

The application uses an invitation-based signup flow. To create a user, you must first generate an invitation token.

1.  **Generate Invitation Token**:
    ```bash
    # Default (Developer plan, 7 days expiry)
    pnpm --filter @repo/scripts gen-token

    # Specific Plan
    pnpm --filter @repo/scripts gen-token --plan=starter

    # Custom Expiry
    pnpm --filter @repo/scripts gen-token --plan=pro --expires-in-days=30
    ```

2.  **Sign Up**:
    Use the generated URL (e.g., `http://localhost:3000/sign-up?token=...`) to create your account.

## Project Structure

*   **`apps/`**: Application services.
    *   `web`: Next.js frontend.
    *   `server`: Node.js API server.
    *   `sentiment-analysis-service`: Python FastAPI service.
*   **`packages/`**: Shared libraries.
    *   `database`: Prisma schema and client.
    *   `scripts`: Utility scripts (seeding, tokens).
*   **`scripts/`**: Root-level shell scripts (`dev.sh`, `install.sh`).

## Troubleshooting

*   **Python Service Fails**: Ensure you have Python 3.9+ and the virtual environment is active. `install.sh` should handle this.
*   **Database Connection Errors**: Check if Docker is running and `DATABASE_URL` matches `docker-compose.yml` credentials.
*   **Missing Modules**: Run `pnpm install` and `pnpm turbo build` to ensure all packages are linked and built.

## Useful Scripts

Here are some commonly used scripts for development:

### Database
*   **Generate Prisma Client**:
    ```bash
    pnpm --filter @repo/db db:generate
    ```
    Run this after changing `schema.prisma` to update the generated client.

### Build
*   **Build Services**:
    ```bash
    pnpm --filter @repo/services build
    ```
    Run this after making changes to `packages/services` to ensure `apps/server` picks up the changes.

### Development
*   **Run Web App Only**:
    ```bash
    pnpm run dev:web
    ```
*   **Run Server Only**:
    ```bash
    pnpm run dev:server
    ```
