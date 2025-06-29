# Sentiment Analysis Platform - Developer Guide

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
Create `.env` files in relevant apps:

**apps/server/.env**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sentiment-hound?schema=public"
```

**apps/web/.env.local**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sentiment-hound?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# OAuth providers
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=your_app_name:version (by /u/yourusername)
```

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

### Database Schema Overview
- **Users**: Authentication, plans, feature flags, token usage
- **Integrations**: OAuth connections to social platforms
- **Posts**: Social media posts being tracked
- **Mentions**: Individual comments/mentions with sentiment analysis
- **Tasks/SubTasks**: Background job processing system
- **Plans**: Subscription tiers with feature limits
- **Competitors**: Competitor tracking functionality
- **InvitationTokens**: Early access invitation system

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

### Testing Guidelines
- Write unit tests for business logic
- Use integration tests for API endpoints
- Test OAuth flows thoroughly
- Validate database constraints

## Deployment

### Production Environment
- Use Railway for hosting
- Set `DATABASE_URL` to production PostgreSQL
- Configure `NEXTAUTH_URL` to production domain
- Set up proper OAuth redirect URLs

### Database Deployment
```bash
# Deploy migrations
pnpm --filter @repo/db deploy

# Seed production data
pnpm --filter @repo/db db:seed:build
```

### Build Process
```bash
# Build all applications
pnpm build

# Build specific app
pnpm --filter web build
```

## Monitoring and Analytics

### Key Metrics to Track
- User signup and activation rates
- Sentiment analysis processing times
- API response times and error rates
- Database query performance
- OAuth integration success rates
- Plan upgrade/downgrade patterns

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
- Use HTTPS in production
- Implement proper session management
- Follow GDPR compliance for user data

### API Security
- Validate all API inputs
- Use proper HTTP status codes
- Implement request rate limiting
- Sanitize database queries (Prisma handles this)

## Common Tasks

### Adding a New Social Media Provider
1. Create provider entry in database
2. Add OAuth configuration
3. Implement provider-specific service in `packages/services/src/`
4. Add API endpoints for authentication
5. Create UI components for integration setup
6. Add background job processors for data fetching

### Adding a New Plan Feature
1. Update Plan model with new feature flag
2. Add feature validation in relevant services
3. Update plan seeding data
4. Add UI components for feature display
5. Implement usage tracking if needed

### Debugging Common Issues
- **Database connection**: Check `DATABASE_URL` and PostgreSQL status
- **OAuth failures**: Verify client IDs, secrets, and redirect URLs
- **Build errors**: Clear `.turbo` cache and `node_modules`
- **Type errors**: Run `pnpm turbo db:generate` to update Prisma types
- **Background jobs**: Check queue status and error logs

## Scripts and Utilities

### Database Scripts
- `scripts/generate-invitation-code.js` - Create invitation codes
- `scripts/view-early-access-signups.js` - View signup data
- `scripts/clear-early-access-signups.js` - Clear test data
- `scripts/manage-feature-flags.js` - Manage user feature flags

### Development Scripts
- `pnpm dev` - Start all services
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all code
- `pnpm format` - Format all code

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