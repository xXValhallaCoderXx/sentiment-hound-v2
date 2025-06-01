# Project Title: Sentiment Analysis Platform (Monorepo)

This project is a monorepo containing a suite of applications and services for sentiment analysis. It includes a web interface, a backend API, a sentiment analysis processing service, and shared libraries.

## Project Overview

This monorepo is managed using `pnpm` and `Turborepo`. It consists of the following main components:

*   **`apps/web`**: A [Next.js](https://nextjs.org/) frontend application that provides the user interface for interacting with the platform.
*   **`apps/server`**: A [NestJS](https://nestjs.com/) backend application that serves as the main API for the platform.
*   **`apps/sentiment-analysis-service`**: A Python (FastAPI/Uvicorn) service responsible for performing sentiment analysis on given texts.
*   **`packages/database`**: A shared package managing database schemas (using [Prisma](https://www.prisma.io/)) and providing a database client.
*   **`packages/services`**: A shared library containing common business logic and services utilized by other applications in the monorepo.

## Getting Started

### Prerequisites

*   **Node.js**: Version 18 or higher (as specified in `package.json`). You can use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.
*   **pnpm**: Version 9.0.0 or higher (as specified in `package.json`). Install via `npm install -g pnpm`.
*   **Docker**: Required for running the PostgreSQL database. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    Install all dependencies for all packages and applications using `pnpm` at the root of the monorepo:
    ```bash
    pnpm install
    ```
3.  **Set up environment variables:**
    Each application (`apps/web`, `apps/server`, `apps/sentiment-analysis-service`) might require its own `.env` file for configuration (e.g., database connection strings, API keys). Refer to the README within each application's directory for specific environment variables needed.
    *   For the `apps/server` to connect to the PostgreSQL database, you'll typically need a `.env` file in `apps/server/` with at least:
        ```env
        DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sentiment-hound?schema=public"
        ```

## Running the Application

1.  **Start the Database:**
    The project uses a PostgreSQL database run via Docker. Start the database service using Docker Compose:
    ```bash
    docker-compose up -d
    ```
    This will start a PostgreSQL server on port `5432` with the database named `sentiment-hound` and credentials `postgres/postgres`.

2.  **Run Development Servers:**
    Once the database is running, you can start all the applications (frontend, backend, and sentiment analysis service if configured) in development mode using Turborepo:
    ```bash
    pnpm run dev
    ```
    This command, defined in the root `package.json`, will typically:
    *   Run database migrations/generations (as per `turbo.json` dependencies like `db:generate`).
    *   Start the Next.js frontend (usually on `http://localhost:3000`).
    *   Start the NestJS backend server (usually on `http://localhost:3001` or similar, check its configuration).
    *   Start the Python sentiment analysis service (port needs to be configured, e.g., `8000`).

    Refer to the individual README files in `apps/web`, `apps/server`, and `apps/sentiment-analysis-service` for specific port numbers and to confirm they are part of the `turbo dev` pipeline.

## Development

### Common Scripts

The following scripts are available at the root of the monorepo:

*   **`pnpm run dev`**: Starts all applications in development mode.
*   **`pnpm run build`**: Builds all applications and packages for production.
*   **`pnpm run lint`**: Lints the codebase across all packages.
*   **`pnpm run format`**: Formats the code using Prettier.

### Database Management

The `turbo.json` file defines several scripts for database management, which are typically run via `pnpm turbo db:<command>`. Examples:
*   `pnpm turbo db:generate`: Generates Prisma client based on schema changes.
*   `pnpm turbo db:migrate`: Runs database migrations.
*   `pnpm turbo db:seed`: Seeds the database with initial data.

Refer to `turbo.json` and `packages/database/package.json` (if it exists and has scripts) for more details on database-related commands.

## Shared Packages

*   **`packages/database`**:
    *   Manages the database schema using Prisma.
    *   Provides a Prisma client for database interactions.
    *   Contains seed scripts for populating the database.
*   **`packages/services`**:
    *   A collection of shared services and business logic used across different parts of the application (e.g., by `apps/server`).

## Individual Application/Service Details

For more detailed information on each specific application or service, including its specific setup, environment variables, and how to run it independently, please refer to its respective README file:

*   [apps/web/README.md](./apps/web/README.md)
*   [apps/server/README.md](./apps/server/README.md)
*   [apps/sentiment-analysis-service/README.md](./apps/sentiment-analysis-service/README.md)