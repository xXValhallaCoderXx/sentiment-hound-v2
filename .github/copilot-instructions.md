# Sentiment Analysis Platform - Developer Guide




## 2. Critical Development Workflows

- **Initial Setup**: Run `pnpm install` to install all dependencies across the monorepo.
- **Running the App**: Use `pnpm run dev` to start all services, including the frontend, backend, and database (via `docker-compose`).
- **Database Migrations & Client Generation**:
    - After changing `packages/database/prisma/schema.prisma`, you **must** run `pnpm turbo db:generate` to update the Prisma client.
    - To create and apply migrations, use `pnpm turbo db:migrate`.

## 3. Key Coding Patterns & Conventions

- **Service Layer (`packages/services`)**: To avoid duplicating logic, most business operations are abstracted into services in this package. For example, instead of `apps/web` accessing the database directly to create a post, it should call a function from a service like `@repo/services/posts`.

- **Next.js Server Actions**: The frontend (`apps/web`) heavily uses **Server Actions** for mutations and data fetching. These are located in `apps/web/actions/`. Prefer using server actions over creating traditional API handlers for form submissions and client-side data mutations.

- **Prisma Client Usage**: Always import the Prisma client from `@repo/database` when you need to interact with the database from within the `packages/services` or `apps/server`.

- **Environment Variables**: Each app (`web`, `server`) has its own `.env` file for configuration (e.g., `apps/web/.env.local`). These are critical for database connections and API keys.

## 4. Common Tasks

- **Adding a Feature**:
    1.  **Schema**: If database changes are needed, modify `packages/database/prisma/schema.prisma` first.
    2.  **Generate**: Run `pnpm turbo db:generate`.
    3.  **Service**: Implement the core business logic in a new or existing file within `packages/services/src/`.
    4.  **Backend**: If an API endpoint is needed, add a controller in `apps/server` that calls the new service.
    5.  **Frontend**: Create UI components in `apps/web/components/` and use Server Actions in `apps/web/actions/` to call the backend or services.

- **Debugging**:
    - **Type Errors**: Often solved by running `pnpm turbo db:generate`.
    - **Build Errors**: Try clearing the cache with `rm -rf .turbo` and `find . -name "node_modules" -type d -prune -exec rm -rf '{}' +`, then run `pnpm install`.


## Project Overview

This is a **Sentiment Analysis Platform** (codenamed "Sentiment Hound") built as a monorepo using **pnpm** and **Turborepo**. The platform analyzes sentiment from social media platforms (YouTube, Reddit) and provides insights through a web dashboard.

### Tech Stack
- **Frontend**: Next.js 15 with React 19, Mantine UI, TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Sentiment Analysis**: Python FastAPI service with transformers and PyABSA
- **Authentication**: NextAuth.js with OAuth (Google, Reddit, YouTube)
- **Monorepo**: pnpm workspaces + Turborepo
- **Deployment**: Railway (with Docker support)

## Architecture

### Applications (`apps/`)
- **`apps/web`**: Next.js frontend (port 3000)
- **`apps/server`**: NestJS backend API (port 3001)
- **`apps/sentiment-analysis-service`**: Python FastAPI service (port 8000)
- **`apps/spam-detection-service`**: TypeScript spam detection service

### Packages (`packages/`)
- **`packages/database`**: Prisma schema, migrations, and database client
- **`packages/services`**: Shared business logic and services
- **`packages/eslint-config`**: Shared ESLint configurations
- **`packages/typescript-config`**: Shared TypeScript configurations
- **`packages/scripts`**: Shared scripts for common tasks (e.g., generating invitation codes, managing early access signups)

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm 8.6.11+
- Docker (for PostgreSQL)
- Python 3.10+ (for sentiment analysis service)

### Quick Start
```bash
# Install dependencies
pnpm install

# Start database
docker-compose up -d

# Run all services in development
pnpm run dev
```

### Environment Variables
The `.env` files in relevant apps:

**apps/server/.env**:
**apps/web/.env.local**:


## Database Management

### Key Commands
```bash
# Generate Prisma client
pnpm turbo db:generate

# Run migrations
pnpm turbo db:migrate

# Deploy to production
pnpm turbo db:deploy

# Seed database
pnpm turbo db:seed

# Reset database (development only)
pnpm turbo db:reset
```


## Code Organization

### Frontend Structure (`apps/web/`)
```
app/
├── (landing-page)/          # Marketing pages
├── dashboard/               # Main application UI
├── api/                     # API routes
└── globals.css             # Global styles

components/
├── atoms/                   # Basic UI components
├── molecules/               # Composite components
├── organisms/               # Complex components
└── templates/               # Page layouts

actions/                     # Server actions
types/                       # TypeScript type definitions
lib/                         # Utility functions
```

### Backend Structure (`apps/server/`)
```
src/
├── api/                     # API controllers
├── modules/
│   ├── jobs/               # Background job processors
│   ├── queue/              # Queue management
│   └── tasks/              # Task management
├── app.module.ts           # Main NestJS module
└── main.ts                 # Application entry point
```

### Services Structure (`packages/services/`)
```
src/
├── aspects/                # Aspect analysis
├── competitors/            # Competitor tracking
├── dashboard/              # Dashboard data aggregation
├── early-access/           # Early access signup system
├── integrations/           # OAuth integrations
├── invitation-tokens/      # Invitation system
├── mentions/               # Mention management
├── plans/                  # Subscription plans
├── posts/                  # Post management
├── providers/              # Social media providers
├── reddit/                 # Reddit-specific services
├── tasks/                  # Task processing
├── users/                  # User management
└── youtube/                # YouTube-specific services
```

## Development Best Practices

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules defined in `packages/eslint-config`
- Use Prettier for code formatting: `pnpm format`
- Prefer functional components with hooks in React

### Database
- Always create migrations for schema changes
- Use Prisma's type-safe client for database operations
- Include proper indexes for performance-critical queries
- Use transactions for multi-table operations

### API Design
- Use server actions for form submissions in Next.js
- Implement proper error handling with typed responses
- Use Zod for runtime validation
- Follow RESTful conventions for NestJS APIs

### Authentication
- Use NextAuth.js for all authentication flows
- Store OAuth tokens securely in the database
- Implement proper session management
- Handle token refresh automatically

### Background Jobs
- Use the task/subtask system for long-running operations
- Implement proper error handling and retry logic
- Monitor job queues for performance issues
- Use appropriate queue priorities

## Feature Systems

### Invitation System
- Generate invitation codes: `node scripts/generate-invitation-code.js`
- Support for plan assignment and usage limits
- URL-based and manual code entry flows
- See `docs/invitation-code-system.md` for details

### Early Access System
- Landing page signup collection
- Duplicate prevention and analytics tracking
- Admin scripts for management
- See `docs/early-access-system.md` for details

### Plan Management
- Tiered subscription system with feature flags
- Token-based usage tracking
- Integration and keyword limits
- Competitor tracking limits

### Sentiment Analysis
- General sentiment using DistilBERT
- Aspect-based sentiment analysis with PyABSA
- Batch processing for performance
- Text chunking for long content

## Testing

### Available Test Scripts
```bash
# Test invitation code system
node test-invitation-codes.js

# Test early access functionality
node scripts/test-early-access.js

# Test spam detection integration
node test-spam-detection-integration.js

# Test feature entitlements
node test-feature-entitlement.js
```




### Build Process
```bash
# Build all applications
pnpm build

# Build specific app
pnpm --filter web build
```


### Error Handling
- Use structured logging throughout the application
- Implement proper error boundaries in React
- Monitor background job failures
- Set up alerts for critical system failures

## Security Considerations

### Authentication & Authorization
- Validate all user inputs with Zod schemas
- Use CSRF protection for forms
- Implement rate limiting on sensitive endpoints
- Secure OAuth token storage and refresh

### Data Protection
- Encrypt sensitive data at rest
- Implement proper session management
- Follow GDPR compliance for user data

### API Security
- Validate all API inputs
- Use proper HTTP status codes
- Implement request rate limiting
- Sanitize database queries (Prisma handles this)

## Common Tasks



## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3000, 3001, 5432, 8000 are available
2. **Database migrations**: Run `pnpm turbo db:generate` after schema changes
3. **OAuth setup**: Verify redirect URLs match exactly
4. **Python dependencies**: Use virtual environment for sentiment service
5. **Memory issues**: Sentiment analysis models require significant RAM


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

### Performance Optimization
- Use database indexes for frequently queried fields
- Implement pagination for large data sets
- Cache frequently accessed data
- Optimize sentiment analysis batch sizes
- Monitor and optimize slow database queries

## Contributing

### Before Making Changes
1. Read this guide thoroughly
2. Set up the development environment
3. Run existing tests to ensure everything works
4. Create feature branches for new work
5. Write tests for new functionality
6. Update documentation as needed

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Database migrations are included if needed
- [ ] Error handling is implemented
- [ ] Documentation is updated in the docs folder, you may append to an existing if relevant or make a new markdown  file.
- [ ] Security considerations are addressed
- [ ] Performance impact is considered