# Integration Points

## Service Layer (`@repo/services`)
**Primary business logic integration**:

```typescript
import { 
  taskService as coreTaskService,
  queueService,
  userService 
} from '@repo/services';
```

Key services used:
- `taskService` - Task lifecycle management
- `queueService` - Job queue operations  
- `subtaskService` - Granular task processing
- `postService` - Social media post handling
- `userService` - User context and permissions

## Database (`@repo/db`)
**Indirect database access via services**:
- Never use Prisma directly
- All database operations through `@repo/services`
- Import types from `@repo/db` for TypeScript

## External Services

### Internal Microservices
- **Sentiment Analysis Service** - Python FastAPI at `:8001`
  - `/analyze` endpoint for ML sentiment processing
- **Spam Detection Service** - TypeScript service
  - Content filtering and validation
- **Web App** - Next.js at `:3000`
  - Initiates tasks via REST API

### External APIs
- **YouTube Data API v3** - Video and comment data
- **Reddit API** - Post and comment scraping  
- **OAuth Providers** - Platform authentication tokens

## Queue System
**Redis/Bull-based job processing**:

```typescript
// Job creation (via core services)
await queueService.addJob(SubTaskType.FETCH_CONTENT, jobData);

// Job processing (automatic via processors)
this.processors[jobType].process(job);
```

## REST API Endpoints
**Communication with web app**:
- `GET /tasks/:id` - Task status checking
- `POST /tasks/export` - Export job creation
- Additional endpoints for queue management

## Environment Configuration
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Queue system connection
- `SENTIMENT_SERVICE_URL` - ML service endpoint
- Platform API keys and tokens

## Inter-App Communication Flow
```
Web App Server Action 
  → NestJS REST API 
    → Queue Job 
      → Job Processor 
        → External Service 
          → Service Layer 
            → Database
```

## Error Propagation
- **Job Failures**: Logged and optionally retried
- **Service Errors**: Bubbled up from `@repo/services`
- **API Errors**: Standard HTTP status codes
- **External API Failures**: Graceful degradation

## Enhanced Service Integration

### Provider-Based Processing (July 2025)

**Purpose**: Updated server processors to handle provider-based content fetching with flexible authentication modes.

**Core Components**:
- Job processors enhanced to resolve provider information from task data
- Authentication strategy selection based on integration presence
- Enhanced error handling for provider resolution failures

**Key Interactions**:
```typescript
// Enhanced processor pattern
const { providerId, integrationId } = job.data;
const authMode = integrationId ? 'oauth' : 'api_key';
const content = await fetchContentWithAuth(providerId, authMode, job.data);
```

### Service Layer Dependencies
- Enhanced dependency on `@repo/services` for provider resolution
- Provider service integration for platform-specific processing
- URL parser service for content source detection

### ExecutionContext Authentication Pattern (July 2025)

**Purpose**: Unified authentication management for job processors with intelligent OAuth token handling and master API key fallback.

**Core Components**:
- `ExecutionContext` interface providing immutable authentication context for job operations
- `buildExecutionContext()` function centralizing authentication resolution logic
- Enhanced YouTube service integration with explicit token parameters
- Automated OAuth token refresh and integration credential updates

**Key Interactions**:
- Integrates with existing `integrationsService.getIntegrationUserIntegrationByProviderId()` for user OAuth lookup
- Uses `youtubeService.refreshAccessToken()` for automatic token renewal when expired
- Updates integration credentials via `integrationsService.updateIntegrationAuthCredentials()`
- Falls back to `process.env.YOUTUBE_MASTER_ACCESS_TOKEN` when user OAuth unavailable
- Maintains compatibility with existing `detectAuthenticationMethod()` and `buildRequestConfig()` helpers

**Authentication Flow**:
1. **Token Resolution**: Fetch user integration and validate OAuth token expiration
2. **Automatic Refresh**: Attempt token refresh for expired OAuth credentials
3. **Credential Persistence**: Update database with refreshed tokens
4. **Master Fallback**: Use environment-configured master API key as last resort
5. **Error Handling**: Throw `IntegrationAuthenticationError` for complete authentication failures

**Token Source Management**:
- `TokenSource.USER_OAUTH` - User-connected integration with valid OAuth token
- `TokenSource.MASTER_API_KEY` - Environment-configured master token for public access
- Explicit token source tracking for proper API request configuration

**External Service Compatibility**:
- YouTube Data API v3 with both OAuth and API key authentication methods
- Automatic detection of authentication method for proper header/parameter configuration
- Seamless integration with existing platform service patterns
