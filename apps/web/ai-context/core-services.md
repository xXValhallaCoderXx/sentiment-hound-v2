# Core Services Overview

## Service Layer Architecture (`@repo/services`)

### Task Management Services

- **`CoreTaskService`** - Task lifecycle and provider resolution
- **`SubTaskService`** - Granular processing units
- **`QueueService`** - Job distribution and monitoring

### Content Services

- **`PostService`** - Social media post management
- **`MentionService`** - Comment and mention handling
- **`ContentFetchService`** - Platform-specific content retrieval

### Platform Services

- **`ProvidersService`** - Social media platform management
- **`IntegrationsService`** - User OAuth connection handling
- **`UrlParserService`** - URL analysis and provider detection

### User & Analytics Services

- **`UserService`** - Account management
- **`DashboardService`** - Analytics aggregation
- **`AnalysisService`** - Sentiment processing coordination

## Service Integration Patterns

### Provider Resolution Pattern

Services use URL parsing to detect content source and resolve to provider ID:

```typescript
const parseResult = urlParserService.parse(url);
const provider = await providerService.getProviderByName(parseResult.provider);
```

### Authentication Flexibility

Services support dual authentication modes:

- **OAuth Integration**: User-connected platform accounts
- **API Key Authentication**: Direct platform API access for public content

### Dependency Injection

All services use constructor injection for testability:

```typescript
constructor(private prisma: PrismaClient) {
  this.model = this.prisma.task;
}
```

## Service Evolution

### Provider Decoupling Refactor (July 2025)

**Purpose**: Refactored core services to support API key authentication alongside existing OAuth flows.

**Core Components**:

- Updated `CoreTaskService.createTask()` for provider resolution
- Enhanced `PostService` and `MentionService` for optional integration handling
- Improved `ProvidersService` with case-insensitive lookups and caching

**Key Interactions**:

- URL parser integration for automatic provider detection
- Fallback logic from integration ID to provider ID resolution
- Comprehensive error handling for unsupported providers

### SubTask Service Enhancement for Provider Relations (July 2025)

**Purpose**: Enhanced SubTask service to support retrieving Task with Provider information for job processors requiring providerId in post creation.

**Core Components**:

- `packages/services/src/sub-tasks/sub-tasks.service.ts` - Enhanced CoreSubTaskService
- Job processors using new service methods for providerId retrieval

**Key Interactions**:

- New `getTaskWithProviderForSubTask(id)` method retrieves SubTask with nested Task and Provider relationships
- Helper `getProviderIdForSubTask(id)` method extracts providerId for post creation
- Comprehensive error handling for missing SubTask or null providerId scenarios
- Ensures type safety with Prisma schema requirements for Post.providerId field

### ExecutionContext Pattern Integration (July 2025)

**Purpose**: Frontend services now leverage the unified ExecutionContext pattern for consistent job creation and authentication handling when communicating with the server.

**Core Components**:

- Server Actions enhanced to pass authentication context to NestJS API
- Job creation flows now include both `providerId` and optional `integrationId`
- Enhanced error handling for authentication failures from ExecutionContext builder

**Key Interactions**:

- **Server Actions**: Pass user authentication context to backend job creation
- **Job Queue Integration**: Frontend-initiated jobs include proper authentication metadata
- **Provider Resolution**: URL parsing services determine provider context for job creation
- **Error Boundaries**: Handle `IntegrationAuthenticationError` in frontend error handling

**Authentication Flow Integration**:

1. **Frontend Job Initiation**: Server Actions determine user context and provider from URL
2. **Authentication Metadata**: Include `userId`, `providerId`, and optional `integrationId` in job data
3. **Backend Context Building**: Server processors use ExecutionContext for authentication resolution
4. **Error Propagation**: Authentication errors bubble up to frontend for user feedback

**Benefits**:

- **Consistency**: Frontend job creation aligns with backend ExecutionContext requirements
- **Type Safety**: Proper typing for job data ensures ExecutionContext builder compatibility
- **Error Handling**: Clear authentication error feedback to users
- **Integration Support**: Seamless OAuth and master API key scenario handling
