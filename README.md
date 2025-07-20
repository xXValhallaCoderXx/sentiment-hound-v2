# Project Title: Sentiment Analysis Platform (Monorepo)

This project is a monorepo containing a suite of applications and services for sentiment analysis. It includes a web interface, a backend API, a sentiment analysis processing service, and shared libraries.

## Project Overview

This monorepo is managed using `pnpm` and `Turborepo`. It consists of the following main components:

- **`apps/web`**: A [Next.js](https://nextjs.org/) frontend application that provides the user interface for interacting with the platform.
- **`apps/server`**: A [NestJS](https://nestjs.com/) backend application that serves as the main API for the platform.
- **`apps/sentiment-analysis-service`**: A Python (FastAPI/Uvicorn) service responsible for performing sentiment analysis on given texts.
- **`packages/database`**: A shared package managing database schemas (using [Prisma](https://www.prisma.io/)) and providing a database client.
- **`packages/services`**: A shared library containing common business logic and services utilized by other applications in the monorepo.

## Quick Start

### 🚀 Automated Setup (Recommended)

For the fastest setup of the entire development environment (JavaScript + Python):

```bash
# 1. Run the full installation script
./scripts/install.sh
# or alternatively:
pnpm run install:full

# 2. Start all services (Turborepo + Python sentiment service)
./scripts/dev.sh
# or alternatively:
pnpm run dev:full
```

**Services will be available at:**

- 📱 Web App: http://localhost:3000
- 🔧 API Server: http://localhost:4000
- 🧠 Sentiment Analysis: http://localhost:8000
- 📚 Sentiment Analysis Docs: http://localhost:8000/docs

### 🔧 Individual Service Management

```bash
# Start only JavaScript services (Turborepo)
pnpm run dev

# Start only Python sentiment analysis service
cd apps/sentiment-analysis-service
./dev.sh
```

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher (as specified in `package.json`). You can use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.
- **pnpm**: Version 9.0.0 or higher (as specified in `package.json`). Install via `npm install -g pnpm`.
- **Docker**: Required for running the PostgreSQL database. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine.

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
    - For the `apps/server` to connect to the PostgreSQL database, you'll typically need a `.env` file in `apps/server/` with at least:
      ```env
      DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sentiment-hound?schema=public"
      ```
    - For Reddit integration support, add the following to your environment files:

      ```env
      # Reddit OAuth Configuration
      REDDIT_CLIENT_ID=your_reddit_client_id
      REDDIT_CLIENT_SECRET=your_reddit_client_secret
      REDDIT_USER_AGENT=your_app_name:version (by /u/yourusername)

      # NextAuth Configuration (required for OAuth callbacks)
      NEXTAUTH_URL=http://localhost:3000
      ```

    - For analysis service API access (fallback when users don't have connected accounts), add the following to your environment files:

      ```env
      # API Keys for Analysis Fallback (Recommended)
      YOUTUBE_API_KEY=your_youtube_api_key
      REDDIT_MASTER_ACCESS_TOKEN=your_reddit_master_token

      # YouTube Master API Key for unauthenticated requests
      YOUTUBE_MASTER_API_KEY=your_youtube_master_api_key
      ```

      To obtain Reddit OAuth credentials:

      1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
      2. Click "Create App" or "Create Another App"
      3. Choose "web app" as the app type
      4. Set redirect URI to `http://localhost:3000/api/auth/reddit/callback` (or your deployed domain)
      5. Copy the client ID and secret to your environment variables

## Running the Application

1.  **Start the Database:**
    The project uses a PostgreSQL database run via Docker. Start the database service using Docker Compose:
    ```bash
    docker-compose up -d
    ```
    This will start a PostgreSQL server on port `5432` with the database named `sentiment-hound` and credentials `postgres/postgres`.

## Development Workflow

### Two-Terminal Development Setup

- For optimal development experience with hot-reloading of shared packages, use this **two-terminal workflow**:

#### Terminal 1: Package Watcher (The Builder)

Start the package watcher to automatically rebuild shared packages when their source files change:

```bash
# Primary approach (uses Turborepo's watch mode)
pnpm run watch

# Alternative approach (uses TypeScript's native watch mode)
pnpm run watch:packages
```

**What this does:**

- Continuously watches `packages/services/src/` and `packages/database/src/` for changes
- Automatically rebuilds packages when you save files
- Updates the `dist/` folders that your applications consume
- Shows compilation status and any TypeScript errors

#### Terminal 2: Development Servers (The Dev Servers)

Start all your application development servers:

```bash
pnpm run dev
```

**What this does:**

- Starts Next.js frontend on `http://localhost:3000`
- Starts NestJS backend on `http://localhost:3001`
- Starts other services as configured
- Monitors the built package outputs for changes and hot-reloads accordingly

### How It Works Together

1. **You make changes** to shared package source files (e.g., `packages/services/src/plans/plans.service.ts`)
2. **Terminal 1** detects the change and rebuilds the package (~100ms)
3. **Terminal 2** sees the updated build output and triggers application hot-reload
4. **Your browser/app** automatically refreshes with the new changes

## Testing

The project uses [Vitest](https://vitest.dev/) as the unified testing framework across all applications and packages. This provides fast, modern testing with excellent TypeScript support.

### Quick Testing Commands

#### **Recommended: Individual Package Testing**

```bash
# Test core business logic (most important)
cd packages/services && pnpm test

# Test web frontend
cd apps/web && pnpm test

# Use root scripts for convenience
pnpm run test:services  # Core services only
pnpm run test:web      # Web frontend only
pnpm run test:packages # Both services and web
```

#### **Turbo Testing (Has Known Limitations)**

```bash
# This may fail due to build dependencies and edge cases
pnpm turbo test
```

### 📖 **Detailed Testing Documentation**

For comprehensive testing guidance, see our detailed documentation:

- **[Testing Guide](docs/TESTING_GUIDE.md)** - Complete testing strategies and best practices
- **[Test Commands Summary](docs/TEST_COMMANDS_SUMMARY.md)** - Quick reference for recommended commands

### Current Test Status

✅ **Fully Working**: URL Parser (comprehensive), Web Frontend (stable), Core Integration (main flows)  
⚠️ **Known Issues**: Some edge-case integration tests, server test setup

### Testing Framework

- **Frontend**: Uses Vitest with jsdom environment for React component testing with @testing-library/react
- **Backend**: Uses Vitest with node environment for NestJS service and module testing
- **Shared Configuration**: All applications extend a shared Vitest configuration from `@repo/vitest-config`

### Test File Organization

- Test files are co-located with source files using `.test.ts` or `.test.tsx` extensions
- Example: `page.tsx` → `page.test.tsx`, `service.ts` → `service.test.ts`

### Key Testing Features

- Fast test execution with Vitest's native ES modules support
- Path alias resolution (e.g., `@/components` in frontend tests)
- Proper mocking capabilities for dependencies and modules
- Integration with Turbo's caching system for optimal performance

## Development

### Common Scripts

- The following scripts are available at the root of the monorepo:

  - **`pnpm run lint`**: Lints the codebase across all packages.
  - **`pnpm run format`**: Formats the code using Prettier.

### Database Management

- The `turbo.json` file defines several scripts for database management, which are typically run via `pnpm turbo db:<command>`. Examples:

  - `pnpm turbo db:generate`: Generates Prisma client based on schema changes.
  - `pnpm turbo db:migrate`: Runs database migrations.
  - `pnpm turbo db:seed`: Seeds the database with initial data.

For **production deployments**, see the comprehensive [Database Deployment Guide](./packages/database/DEPLOYMENT.md) which covers:

- Automated migration and seeding process
- Integration with CI/CD pipelines
- Production deployment best practices
- Troubleshooting and recovery procedures

## Shared Packages

- **`packages/database`**:
  - Manages the database schema using Prisma.
  - Provides a Prisma client for database interactions.
  - Contains seed scripts for populating the database.
- **`packages/services`**:
  - A collection of shared services and business logic used across different parts of the application (e.g., by `apps/server`).

## Individual Application/Service Details

For more detailed information on each specific application or service, including its specific setup, environment variables, and how to run it independently, please refer to its respective README file:

- [apps/web/README.md](./apps/web/README.md)
- [apps/server/README.md](./apps/server/README.md)
- [apps/sentiment-analysis-service/README.md](./apps/sentiment-analysis-service/README.md)

## Agent Files

- `.agent.md`: Rovodev

## API Reference

### Analysis Server Action

The platform provides a robust server action for starting sentiment analysis tasks with intelligent token fallback logic.

#### `startAnalysis(postUrl: string)`

**Purpose**: Initiates sentiment analysis for social media content from supported platforms.

**Parameters**:

- `postUrl` (string): The URL of the content to analyze (YouTube videos or Reddit posts)

**Returns**: `Promise<ActionResponse<{ taskId: number; status: string }>>`

**Features**:

- ✅ **Provider Detection**: Automatically detects and validates URLs from YouTube and Reddit
- ✅ **Intelligent Token Selection**: Uses user's connected integrations first, falls back to master tokens
- ✅ **Comprehensive Error Handling**: Provides detailed error codes and user-friendly messages
- ✅ **Authentication Required**: Ensures only authenticated users can start analyses
- ✅ **Database Integration**: Creates tasks and subtasks for background processing

**Usage Example**:

```typescript
import { startAnalysis } from "@/actions/analysis.actions";

// In a React component or server action
const handleAnalyze = async (url: string) => {
  const result = await startAnalysis(url);

  if (result.error) {
    console.error("Analysis failed:", result.error.error);
    // Handle different error types
    switch (result.error.code) {
      case "UNAUTHORIZED":
        // Redirect to login
        break;
      case "URL_INVALID":
        // Show URL validation message
        break;
      case "AUTH_UNAVAILABLE":
        // Show service unavailable message
        break;
    }
  } else {
    console.log("Analysis started:", result.data);
    // result.data = { taskId: 123, status: 'PENDING' }
  }
};
```

**Error Codes**:

- `UNAUTHORIZED` (401): User not authenticated
- `URL_INVALID` (400): Invalid or unsupported URL format
- `AUTH_UNAVAILABLE` (403): No valid tokens available for the provider
- `INTEGRATION_INACTIVE` (403): User's integration is inactive
- `DATABASE_ERROR` (500): Database operation failed

**Frontend Component Example**:

```typescript
import AnalyzeButton from '@/components/atoms/AnalyzeButton';

// Use the pre-built component
<AnalyzeButton
  onAnalysisStarted={(taskId) => console.log('Started:', taskId)}
  placeholder="Enter YouTube or Reddit URL..."
  compact={false}
/>

// Or use in compact mode
<AnalyzeButton compact />
```

**Required Environment Variables**:
For API access fallback when users don't have connected accounts:

```env
YOUTUBE_API_KEY=your_youtube_api_key
REDDIT_MASTER_ACCESS_TOKEN=your_reddit_oauth_token

# YouTube Master API Key for unauthenticated requests
YOUTUBE_MASTER_API_KEY=your_youtube_master_api_key
```

**Supported URL Formats**:

- **YouTube**: `youtube.com/watch?v=`, `youtu.be/`, `m.youtube.com/watch?v=`, `youtube.com/embed/`
- **Reddit**: `reddit.com/r/subreddit/comments/`, `old.reddit.com/r/subreddit/comments/`
