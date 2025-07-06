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
