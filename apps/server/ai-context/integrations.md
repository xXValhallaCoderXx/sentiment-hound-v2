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

### ExecutionContext Integration Architecture (July 2025)

**Purpose**: Unified integration architecture providing consistent authentication and service interaction patterns across all job processors and external service integrations.

**Core Components**:
- `ExecutionContext` interface providing immutable authentication context for all integrations
- `buildExecutionContext()` function centralizing authentication resolution across platforms
- Enhanced service integration patterns with explicit authentication method specification
- Standardized error handling for integration authentication failures

**Platform Integration Patterns**:
- **YouTube Data API v3**: OAuth and API key authentication with explicit method specification
- **Reddit API**: User authentication and public content access patterns
- **FastAPI Services**: Internal microservice integration for sentiment analysis
- **Database Services**: Transactional operations with conditional authentication context

**Key Interactions**:
- **Authentication Resolution**: `integrationsService.getIntegrationUserIntegrationByProviderId()` for OAuth lookup
- **Token Management**: `youtubeService.refreshAccessToken()` for automatic token renewal
- **Credential Persistence**: `integrationsService.updateIntegrationAuthCredentials()` for token updates
- **Master Key Fallback**: Environment variable fallback when user OAuth unavailable
- **Service Layer**: Explicit authentication method forwarding throughout integration calls

**Integration Benefits**:
- **Consistent Authentication**: Unified approach across all platform integrations
- **Automatic Token Management**: OAuth token refresh and credential updates
- **Error Handling**: Standardized `IntegrationAuthenticationError` for authentication failures
- **Security**: No authentication tokens in logs, proper error context logging
- **Scalability**: Template pattern for adding new platform integrations

### YouTube Service Authentication Architecture Overhaul (July 2025)

**Purpose**: Complete modernization of YouTube integration authentication to eliminate heuristic detection and implement explicit authentication method specification throughout the integration layer.

**Core Components**:
- YouTube Content Service with explicit authentication method parameters
- Refactored service integration patterns for deterministic authentication behavior
- Environment variable standardization from `YOUTUBE_MASTER_ACCESS_TOKEN` to `YOUTUBE_MASTER_API_KEY`
- Enhanced ExecutionContext with immutable `authMethod` property
- Complete removal of heuristic `detectAuthenticationMethod()` logic

**Integration Flow Changes**:
- **ExecutionContext Creation**: Authentication method explicitly determined during context building based on token source
- **Service Method Calls**: All YouTube service methods now require explicit `authMethod: 'OAUTH' | 'API_KEY'` parameters
- **Request Configuration**: Dynamic authentication handling based on explicit method rather than token format analysis
- **Error Context**: Authentication method included in all error messages and logs for improved debugging

**External Service Integration**:
- **YouTube Data API v3**: Explicit OAuth (Authorization header) vs API key (URL parameter) request configuration
- **Authentication Method Forwarding**: Job processors pass ExecutionContext authentication method to service calls
- **Token Source Mapping**: `TokenSource.USER_OAUTH` → `'OAUTH'`, `TokenSource.MASTER_API_KEY` → `'API_KEY'`
- **Service Layer Consistency**: Authentication method specification maintained throughout entire call chain

**Migration Benefits**:
- **Reliability**: Elimination of authentication failures caused by token format misdetection
- **Debugging**: Clear authentication method context in integration error scenarios
- **Maintainability**: Explicit authentication flows improve code comprehension and maintenance
- **Testing**: Deterministic authentication behavior enables comprehensive test coverage
- **Production Stability**: Consistent authentication method handling reduces integration failures
