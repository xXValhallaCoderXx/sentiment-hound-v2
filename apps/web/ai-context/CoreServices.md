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
