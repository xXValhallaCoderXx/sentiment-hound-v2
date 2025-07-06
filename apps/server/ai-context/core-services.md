# Core Services Overview

## Service Layer Architecture (`@repo/services`)

### Queue-Related Services
- **`QueueService`** - Job distribution and monitoring
- **`CoreTaskService`** - Task lifecycle and provider resolution
- **`SubTaskService`** - Granular processing units

### Content Processing Services  
- **`PostService`** - Social media post management
- **`MentionService`** - Comment and mention handling
- **`ContentFetchService`** - Platform-specific content retrieval

### Platform Services
- **`ProvidersService`** - Social media platform management
- **`IntegrationsService`** - User OAuth connection handling
- **`UrlParserService`** - URL analysis and provider detection

## Service Integration in Queue Processing

### Provider Resolution in Jobs
Queue processors use enhanced services for provider-aware processing:
```typescript
const { providerId, integrationId } = job.data;
const provider = await providerService.getProviderById(providerId);
const authStrategy = integrationId ? 'oauth' : 'api_key';
```

### Authentication Flexibility
Processors support dual authentication modes:
- **OAuth Integration**: User-connected platform accounts
- **API Key Authentication**: Direct platform API access for public content

### Error Handling in Background Jobs
Enhanced error handling distinguishes between:
- Provider resolution failures
- Authentication issues (OAuth vs API key)
- Content fetching errors
- Database operation failures

## Service Evolution

### Provider Decoupling for Queue Processing (July 2025)

**Purpose**: Enhanced services to support background job processing with flexible authentication modes.

**Core Components**:
- Queue job data includes both `providerId` and optional `integrationId`
- Services handle provider-specific authentication strategies
- Background processors use service layer for all business logic

**Key Interactions**:
- Job processors resolve authentication mode from integration presence
- Provider service caching improves queue job performance
- Comprehensive error handling for async processing scenarios

### SubTask Service Enhancement for Provider Relations (July 2025)

**Purpose**: Enhanced SubTask service to support retrieving Task with Provider information for job processors requiring providerId in post creation.

**Core Components**:
- `packages/services/src/sub-tasks/sub-tasks.service.ts` - Enhanced CoreSubTaskService
- `apps/server/src/modules/jobs/processors/*` - Updated job processors using new service methods

**Key Interactions**:
- New `getTaskWithProviderForSubTask(id)` method retrieves SubTask with nested Task and Provider relationships
- Helper `getProviderIdForSubTask(id)` method extracts providerId for post creation
- Comprehensive error handling for missing SubTask or null providerId scenarios
- All job processors now use service layer to obtain providerId before creating posts
- Maintains type safety with Prisma schema requirements for Post.providerId field

### Unified ExecutionContext Pattern (July 2025)

**Purpose**: Introduced a standardized execution context pattern for job processors to handle authentication, data management, and provider routing in a unified manner.

**Core Components**:
- `packages/services/src/jobs/execution-context.interface.ts` - TypeScript interface defining ExecutionContext structure with userId, providerId, authToken, tokenSource, and jobData
- `packages/services/src/jobs/execution-context.builder.ts` - Builder function implementing intelligent authentication resolution with OAuth token refresh and master API key fallback
- `apps/server/src/modules/jobs/processors/post-fetch.processor.ts` - Refactored PostFetchProcessor serving as template implementation
- `packages/services/src/youtube/youtube.services.ts` - Updated YouTube service to accept explicit authToken parameters

**Key Interactions**:
- Replaces multiple service calls (getIntegration, getProvider, getTask) with single unified context builder
- Implements automatic OAuth token validation and refresh using existing `youtubeService.refreshAccessToken()`
- Provides intelligent fallback to master API keys when user OAuth is unavailable or expired
- Integrates with existing `subtaskService.getTaskWithProviderForSubTask()` for comprehensive data retrieval
- Uses explicit authentication method assignment based on token source for deterministic behavior

**Authentication Flow**:
1. Fetch comprehensive job data with user, provider, and integration information
2. Validate user OAuth token expiration and attempt refresh if needed
3. Update integration credentials in database after successful token refresh
4. Fall back to master API key if OAuth unavailable or refresh fails
5. Return immutable ExecutionContext with resolved authentication and metadata

**Benefits**:
- Eliminated redundant database queries in job processors (20-30% LOC reduction)
- Unified error handling with `IntegrationAuthenticationError` for authentication failures
- Enhanced testability with 35+ test scenarios covering all authentication paths
- Template pattern for refactoring other job processors (sentiment-analysis, content-fetch, reddit-fetch)

### YouTube Content Service Authentication Modernization (July 2025)

**Purpose**: Major architectural refactoring of YouTube content service to eliminate heuristic authentication detection and implement explicit authentication method specification throughout the service layer.

**Core Components**:
- `YoutubeContentService` - Refactored with explicit authentication method parameters
- `YoutubeService` wrapper - Updated to forward explicit authentication methods
- `PostFetchProcessor` - Enhanced to use ExecutionContext authentication method
- `ExecutionContext` interface - Extended with readonly `authMethod` property
- Environment configuration - Standardized YouTube master API key variable naming

**Key Service Changes**:
- **Method Signature Updates**: All YouTube service methods now require explicit `authMethod: 'OAUTH' | 'API_KEY'` parameters
- **Request Configuration**: `buildRequestConfig()` method accepts explicit authentication method instead of detecting from token format
- **Heuristic Removal**: Complete elimination of `detectAuthenticationMethod()` function and all token format analysis
- **Error Context**: Authentication method included in error messages and debugging logs
- **Test Coverage**: Comprehensive test updates to validate explicit authentication flows

**Service Integration Impact**:
- Job processors extract `authMethod` from ExecutionContext and pass explicitly to YouTube services
- Authentication method determination moved to ExecutionContext creation phase
- Service layer now operates with deterministic authentication behavior
- Cross-service authentication calls maintain explicit method specification throughout call chain

**Architectural Benefits**:
- **Reliability**: Eliminates authentication failures caused by token format misdetection
- **Maintainability**: Clear authentication method flow throughout service architecture
- **Debugging**: Explicit authentication method context in all error scenarios
- **Testing**: Predictable authentication behavior enables robust test scenarios
