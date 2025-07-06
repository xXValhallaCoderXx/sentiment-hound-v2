# API Endpoints Overview

## Server App Endpoints (`apps/server`)

### Task Management API
**Base URL**: `/api/tasks`

- **POST /api/tasks** - Create new analysis task
  - **Purpose**: Submit new social media content for sentiment analysis
  - **Authentication**: Required (user session)
  - **Services**: `CoreTaskService.createTask()`, `ProviderService.getByName()`
  - **Data Flow**: URL parsing → Provider resolution → Task creation → Job queue

## Web App API Routes (`apps/web`)

### Authentication Endpoints
**NextAuth.js Integration**:

- **GET/POST /api/auth/[...nextauth]** - NextAuth.js handler
  - **Purpose**: OAuth flow management for multiple providers
  - **Providers**: YouTube, Reddit, Google
  - **Services**: Built-in NextAuth.js providers

- **GET /api/auth/youtube** - YouTube OAuth initiation
  - **Purpose**: Start YouTube OAuth flow
  - **Redirect**: YouTube consent screen

- **GET /api/auth/youtube/callback** - YouTube OAuth callback
  - **Purpose**: Handle YouTube OAuth response and token exchange
  - **Services**: NextAuth.js token management

- **POST /api/auth/youtube/revoke** - YouTube token revocation
  - **Purpose**: Revoke user's YouTube OAuth tokens
  - **Services**: YouTube API revocation endpoint

- **GET /api/auth/reddit/callback** - Reddit OAuth callback
  - **Purpose**: Handle Reddit OAuth response
  - **Services**: Reddit API token exchange

### Data API Endpoints

- **GET /api/providers** - Available social media providers
  - **Purpose**: Fetch list of supported platforms for frontend
  - **Services**: `ProvidersService.getAll()`
  - **Response**: Provider metadata and capabilities

- **GET /api/integrations** - User's connected integrations
  - **Purpose**: Fetch user's OAuth-connected platforms
  - **Authentication**: Required (user session)
  - **Services**: `IntegrationsService.getUserIntegrations()`

### Utility Endpoints

- **POST /api/invitation-codes/apply** - Apply invitation code
  - **Purpose**: Validate and apply user invitation codes
  - **Authentication**: Required (user session)
  - **Services**: User invitation validation logic

## Architectural Notes

### Server Actions vs API Routes
**Web App Pattern**: Heavily favors **Server Actions** over traditional API routes for data mutations:
- Most data operations implemented as Server Actions in `actions/` directory
- API routes primarily used for OAuth callbacks and external integrations
- Server Actions provide better type safety and integration with React Server Components

### Authentication Strategy
- **NextAuth.js**: Handles OAuth flows and session management
- **Server Actions**: Use `auth()` helper for session validation
- **NestJS Server**: Receives authenticated requests with user context

### Cross-App Communication
- **Queue System**: Primary integration between web and server apps
- **Database**: Shared via `@repo/db` Prisma client
- **Services**: Shared business logic via `@repo/services` package
