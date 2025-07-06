# Integration Points

## Service Layer (`@repo/services`)
**Primary integration** - All business logic flows through services:

```typescript
import { 
  taskService, 
  integrationsService, 
  userService,
  dashboardService 
} from "@repo/services";
```

Key services used by web app:
- `taskService` - Analysis task management
- `integrationsService` - OAuth platform connections
- `userService` - User account operations
- `dashboardService` - Analytics aggregation
- `postService` - Social media post handling

## Service Layer Enhancements

### Provider-Aware Service Integration (July 2025)

**Purpose**: Enhanced service layer integration to support direct provider relationships and flexible authentication modes.

**Core Components**:
- Services now accept `providerId` parameters for direct platform targeting
- URL parser service integration for automatic provider detection
- Enhanced provider service with case-insensitive lookups and caching

**Key Interactions**:
- Server actions resolve provider information before service calls
- Services handle both OAuth integration IDs and direct provider IDs
- Backward compatibility maintained for existing integration-based flows

```typescript
// Enhanced service usage pattern
const provider = await urlParserService.parse(url);
const task = await taskService.createTask({
  userId,
  providerId: providerRecord.id,
  integrationId: integration?.id || null, // Optional for API key mode
  extraData: { url, token }
});
```

## Database (`@repo/db`)
**Single Prisma client** for all database operations:

```typescript
import { prisma, User, Task, Post } from "@repo/db";
```

- Never use Prisma directly in web app
- Always go through service layer
- Import types from `@repo/db`

## External APIs

### Social Media Platforms
- **YouTube API** - Video and comment analysis
- **Reddit API** - Post and comment scraping
- **OAuth Providers** - Platform authentication

### Internal Services
- **Sentiment Analysis Service** - Python FastAPI at `:8001`
- **Spam Detection Service** - TypeScript service
- **NestJS Backend** - Task queue management at `:3001`

## Authentication Flow
1. **NextAuth.js** handles OAuth with platforms
2. **Server actions** validate sessions
3. **Services** receive authenticated user IDs
4. **Database** stores user and integration data

## Data Flow Architecture
```
UI Component 
  → Server Action 
    → Service Layer (@repo/services)
      → Database (@repo/db)
        → External APIs
```

## Environment Variables
- `NEXTAUTH_SECRET` - Authentication encryption
- `NEXTAUTH_URL` - App URL for OAuth callbacks
- `DATABASE_URL` - PostgreSQL connection
- Platform API keys (YouTube, Reddit, etc.)
- Service URLs for internal microservices

## Inter-App Communication
- **Web ↔ Server**: HTTP APIs for task management
- **Web ↔ Services**: Direct imports via monorepo
- **All Apps**: Shared database via Prisma
