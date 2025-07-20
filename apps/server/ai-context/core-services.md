# Core Services Overview

## Service Layer Architecture (`@repo/services`)

### Queue & Task Management Services

- **`QueueService`** - Job distribution and monitoring
- **`CoreTaskService`** - Task lifecycle and provider resolution
- **`SubTaskService`** - Granular processing units

### Content Processing Services

- **`PostService`** - Social media post management
- **`MentionService`** - Comment and mention handling
- **`ContentFetchService`** - Platform-specific content retrieval

### Platform Integration Services

- **`ProvidersService`** - Social media platform management
- **`IntegrationsService`** - User OAuth connection handling
- **`UrlParserService`** - URL analysis and provider detection

### Authentication & Context Services

- **`ExecutionContextBuilder`** - Unified job authentication and metadata resolution
- **`YoutubeContentService`** - Platform-specific content operations with explicit auth
- **`YoutubeService`** - Wrapper service for authentication method forwarding

## Service Integration Patterns

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

### ExecutionContext userId Type Fix (July 2025)

**Purpose**: Fixed critical type bug where userId was incorrectly converted from CUID string to number, causing foreign key constraint violations and job failures.

**Core Components**:

- `packages/services/src/jobs/execution-context.interface.ts` - Updated userId type from number to string
- `packages/services/src/jobs/execution-context.builder.ts` - Removed Number() conversions and added validation
- `packages/services/src/jobs/execution-context.validation.test.ts` - New validation test suite

**Key Interactions**:

- ExecutionContext builder now maintains userId as string CUID throughout authentication flow
- Added validateExecutionContext() function with runtime string validation
- IntegrationAuthenticationError thrown for invalid userId values
- All job processors now receive properly typed ExecutionContext with string userId

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

### Mention Creation Schema Optimization (July 2025)

**Purpose**: Streamlined mention creation across all job processors by removing redundant `mentionId` field and simplifying data flow.

**Core Components**:

- `packages/services/src/mentions/mentions.service.ts` - Automatically compatible with updated Prisma types
- `packages/services/src/mentions/mentions.repository.ts` - No code changes required due to Prisma auto-generation
- `apps/server/src/modules/jobs/processors/post-fetch.processor.ts` - Removed `mentionId` assignment from YouTube comment creation
- `apps/server/src/modules/jobs/processors/content-fetch.processor.ts` - Removed `mentionId` assignment from mention creation
- `apps/server/src/modules/jobs/processors/reddit-fetch-processor.ts` - Removed `mentionId` hash calculation logic

**Service Layer Impact**:

- **MentionService.createMention()**: Simplified data object creation without redundant field mapping
- **Repository Layer**: Automatic compatibility through Prisma type generation eliminates manual updates
- **Job Processors**: Reduced complexity in mention creation flows across YouTube, Reddit, and content fetch processors
- **Foreign Key Relations**: AspectAnalysis and SubTaskMention models continue to reference Mention.id correctly

**Processing Benefits**:

- **Reduced Technical Debt**: Eliminated duplicate identifier fields that served no functional purpose
- **Simplified Data Flow**: Mention creation now relies solely on auto-generated primary key and platform-specific `remoteId`
- **Maintainability**: Fewer fields to manage and validate during comment/mention processing
- **Type Safety**: Prisma client auto-generation ensures compile-time validation of schema changes

### SentimentAnalysisProcessor ExecutionContext Refactor (July 2025)

**Purpose**: Migrated sentiment analysis job processor to use the unified ExecutionContext pattern, eliminating direct integration service calls and implementing robust dual-authentication support.

**Core Components**:

- `SentimentAnalysisProcessor.process()` - Refactored with ExecutionContext pattern
- `sentiment-analysis.processor.test.ts` - Comprehensive Vitest test suite (10 tests)
- Database transaction pattern for mention queries and SubTaskMention creation
- Conditional query logic supporting both OAuth and master API key scenarios

**Key Architectural Improvements**:

- **Unified Authentication**: Replaced `integrationsService.getIntegration()` with `buildExecutionContext()`
- **Conditional Data Querying**: OAuth uses `context.integrationId`, master API key uses `context.userId + context.providerId`
- **Transaction Safety**: Wrapped mention `findMany` and `subTaskMention.createMany` in `prisma.$transaction()`
- **Enhanced Error Handling**: Standardized `IntegrationAuthenticationError` handling with proper logging
- **Preserved Core Logic**: Maintained 25-comment batch processing and FastAPI integration unchanged

**Key Interactions**:

- **ExecutionContext Builder**: `buildExecutionContext()` for unified authentication resolution
- **Mention Service**: `updateMentionSentiment()` for sentiment data persistence
- **SubTask Service**: `markSubTaskAsCompleted()` and `markSubTaskAsFailed()` for job lifecycle
- **Sentiment Analysis API**: External FastAPI service at `http://localhost:8000/analyze`
- **Database Transactions**: Atomic operations for data consistency

### Enhanced Job Processor Pattern Implementation (July 2025)

**Purpose**: Established template pattern for job processors with unified ExecutionContext authentication, comprehensive error handling, and standardized logging approach.

**Core Components**:

- `PostFetchProcessor` - Reference implementation with ExecutionContext pattern
- `SentimentAnalysisProcessor` - Complete refactor following unified pattern
- Enhanced Vitest test suites with comprehensive authentication scenario coverage
- Standardized error handling boundaries with proper job failure marking

**Pattern Implementation**:

- **Step 1**: Build ExecutionContext with automatic authentication resolution
- **Step 2**: Conditional logic based on `context.integrationId` presence (OAuth vs Master API key)
- **Step 3**: Database transactions for atomic operations and data consistency
- **Step 4**: Provider-specific processing using `context.providerName` routing
- **Step 5**: Structured logging with authentication method transparency

**Key Interactions**:

- **ExecutionContext Builder**: Single point of authentication resolution for all processors
- **Provider Service**: Platform-specific routing logic via `context.providerName`
- **Database Transactions**: Atomic operations with `prisma.$transaction()` for data consistency
- **Error Boundaries**: `IntegrationAuthenticationError` handling with graceful job failure marking
- **Logging System**: Structured authentication method logging without token exposure
