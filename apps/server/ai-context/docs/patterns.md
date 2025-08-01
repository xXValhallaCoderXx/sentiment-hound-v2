# Key Development Patterns

## Table of Contents

1. [Core Architecture Patterns](#core-architecture-patterns)
2. [Job Processing Patterns](#job-processing-patterns)
3. [Configuration and Error Handling](#configuration-and-error-handling)

## Core Architecture Patterns

### Service Layer Integration

**Always use services from `@repo/services`**:

```typescript
import { taskService as coreTaskService } from '@repo/services';

// Use core services for business logic
const task = await coreTaskService.createTask({...});
```

### Module Structure

**Standard NestJS module pattern**:

```typescript
@Module({
  imports: [
    /* Dependencies */
  ],
  controllers: [
    /* REST endpoints */
  ],
  providers: [
    /* Services and processors */
  ],
  exports: [
    /* Public services */
  ],
})
export class FeatureModule {}
```

### Dependency Injection

- **Services**: Injected via constructor
- **Repositories**: Through service layer
- **External APIs**: As configurable providers

### Service Injection Pattern

**Consistent dependency injection for testability**:

```typescript
constructor(private prisma: PrismaClient) {
  this.model = this.prisma.task; // Use injected instance
}
```

## Job Processing Patterns

### Basic Job Processor Pattern

**Structured async job handling**:

```typescript
@Injectable()
export class ExampleProcessor {
  async process(job: Job): Promise<void> {
    try {
      // 1. Extract job data
      const { userId, providerId, url } = job.data;

      // 2. Process core logic
      await this.executeBusinessLogic(job.data);

      // 3. Mark job complete
      await subtaskService.markSubTaskAsCompleted(job.id);
    } catch (error) {
      // 4. Handle errors gracefully
      await subtaskService.markSubTaskAsFailed(String(job.id), error.message);
    }
  }
}
```

### Unified ExecutionContext Pattern for Job Processors (July 2025)

**Purpose**: Standardized authentication pattern across all job processors using ExecutionContext for consistent dual-authentication support.

**Core Pattern Implementation**:

```typescript
/**
 * Unified job processor authentication pattern
 */
async process(job: Job): Promise<void> {
  try {
    // Step 1: Build unified execution context
    const context: ExecutionContext = await buildExecutionContext(job.id, job.data);

    // Step 2: Log authentication method
    this.logger.log(`Built context for SubTask ${job.id}: { userId, providerName, authMethod, integrationId }`);

    // Step 3: Conditional logic based on authentication
    const whereClause = context.integrationId
      ? { /* OAuth filtering */ }
      : { /* Master API key filtering */ };

    // Step 4: Database operations with transactions
    await prisma.$transaction(async (tx) => {
      // Atomic operations here
    });

  } catch (error) {
    if (error instanceof IntegrationAuthenticationError) {
      this.logger.error(`Failed to build ExecutionContext for SubTask ${job.id}: ${error.message}`);
      await subtaskService.markSubTaskAsFailed(String(job.id), error.message);
      return;
    }
    // Handle other errors
  }
}
```

**Adopted by Processors**:

- ✅ `PostFetchProcessor` - Original implementation
- ✅ `SentimentAnalysisProcessor` - July 2025 refactor
- 🔄 Additional processors to be migrated

**Key Benefits**:

- **Consistency**: Standardized authentication across all processors
- **Reliability**: Robust error handling with proper job failure marking
- **Flexibility**: Supports both OAuth and master API key scenarios
- **Transparency**: Structured logging for operational visibility
- **Security**: No authentication tokens in logs

**Testing Pattern**:

- Comprehensive Vitest test suites with mocked dependencies
- OAuth and master API key scenario coverage
- Error handling and transaction testing
- Authentication failure boundary validation

## Authentication Patterns

```typescript
@Injectable()
export class MyProcessor {
  async process(job: Job): Promise<void> {
    try {
      // 1. Extract job data
      const { data } = job;

      // 2. Call external services
      const result = await externalService.process(data);

      // 3. Update via core services
      await coreService.updateResult(job.id, result);
    } catch (error) {
      // 4. Error handling and retry logic
      throw new Error(`Job failed: ${error.message}`);
    }
  }
}
```

### Provider-Aware Processing Pattern (July 2025)

**Enhanced job processing with provider context**:

```typescript
@Injectable()
export class ContentFetchProcessor {
  async process(job: Job): Promise<void> {
    const { providerId, integrationId, url } = job.data;

    // Determine authentication strategy
    const authMode = integrationId ? 'oauth' : 'api_key';

    // Provider-specific content fetching
    const content = await this.fetchByProvider(providerId, authMode, job.data);

    // Update task with provider context
    await coreTaskService.updateTask(job.data.taskId, {
      status: 'COMPLETED',
      providerId,
      content,
    });
  }
}
```

### Unified ExecutionContext Pattern (July 2025)

**Template pattern for job processors with centralized authentication and data management**:

```typescript
@Injectable()
export class UnifiedJobProcessor {
  async process(job: Job): Promise<void> {
    try {
      // 1. Build unified execution context with authentication resolution
      const context = await buildExecutionContext(job.id, job.data);

      // 2. Validate required job data
      const requiredData = job.data.url || job.data.content;
      if (!requiredData) {
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          'Missing required data',
        );
        return;
      }

      // 3. Route to provider-specific processing using context
      switch (context.providerName) {
        case 'YouTube':
          await this.processYouTubeContent(job, context);
          break;
        case 'Reddit':
          await this.processRedditContent(job, context);
          break;
        default:
          throw new Error(`Provider ${context.providerName} not supported`);
      }

      // 4. Mark task as completed
      await subtaskService.markSubTaskAsCompleted(job.id);
    } catch (error) {
      if (error instanceof IntegrationAuthenticationError) {
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          `Authentication failed: ${error.message}`,
        );
      } else {
        await subtaskService.markSubTaskAsFailed(
          String(job.id),
          `Processing failed: ${error.message}`,
        );
      }
    }
  }

  private async processYouTubeContent(
    job: Job,
    context: ExecutionContext,
  ): Promise<void> {
    // Use context.authToken for authenticated API calls
    const result = await youtubeService.fetchSingleYoutubeVideo(
      context.authToken,
      job.data.url,
    );

    // Use context IDs for data association
    await postService.createUserPosts([
      {
        userId: context.userId.toString(),
        providerId: context.providerId,
        integrationId: context.integrationId,
        // ...result data
      },
    ]);
  }
}
```

**Key Pattern Benefits**:

- **Single Source of Truth**: All job metadata and authentication in one context object
- **Automatic Token Management**: OAuth refresh and master API key fallback handled transparently
- **Provider Agnostic**: Routing logic based on context.providerName instead of hardcoded checks
- **Comprehensive Error Handling**: Unified authentication error types and graceful fallbacks
- **Reduced Database Queries**: Single call to `buildExecutionContext()` replaces multiple service calls
- **Enhanced Testability**: Immutable context object easy to mock and validate in tests

**ExecutionContext Interface**:

```typescript
interface ExecutionContext {
  readonly userId: string; // CUID string identifier
  readonly providerId: number;
  readonly providerName: string;
  readonly authToken: string;
  readonly jobData: any;
  readonly integrationId: number | null;
  readonly tokenSource: TokenSource; // USER_OAUTH | MASTER_API_KEY
}
```

**Template Implementation**: PostFetchProcessor serves as the reference implementation for this pattern, ready for replication across other job processors (sentiment-analysis, content-fetch, reddit-fetch).

### Unified ExecutionContext Pattern for Job Processors (July 2025)

**Purpose**: Standardized authentication pattern across all job processors using ExecutionContext for consistent dual-authentication support.

**Core Pattern Implementation**:

```typescript
/**
 * Unified job processor authentication pattern
 */
async process(job: Job): Promise<void> {
  try {
    // Step 1: Build unified execution context
    const context: ExecutionContext = await buildExecutionContext(job.id, job.data);

    // Step 2: Log authentication method
    this.logger.log(`Built context for SubTask ${job.id}: { userId, providerName, authMethod, integrationId }`);

    // Step 3: Conditional logic based on authentication
    const whereClause = context.integrationId
      ? { /* OAuth filtering */ }
      : { /* Master API key filtering */ };

    // Step 4: Database operations with transactions
    await prisma.$transaction(async (tx) => {
      // Atomic operations here
    });

  } catch (error) {
    if (error instanceof IntegrationAuthenticationError) {
      this.logger.error(`Failed to build ExecutionContext for SubTask ${job.id}: ${error.message}`);
      await subtaskService.markSubTaskAsFailed(String(job.id), error.message);
      return;
    }
    // Handle other errors
  }
}
```

**Adopted by Processors**:

- ✅ `PostFetchProcessor` - Original implementation
- ✅ `SentimentAnalysisProcessor` - July 2025 refactor
- 🔄 Additional processors to be migrated

**Key Benefits**:

- **Consistency**: Standardized authentication across all processors
- **Reliability**: Robust error handling with proper job failure marking
- **Flexibility**: Supports both OAuth and master API key scenarios
- **Transparency**: Structured logging for operational visibility
- **Security**: No authentication tokens in logs

**Testing Pattern**:

- Comprehensive Vitest test suites with mocked dependencies
- OAuth and master API key scenario coverage
- Error handling and transaction testing
- Authentication failure boundary validation

### Database Transaction Pattern for Job Processors (July 2025)

**Purpose**: Standardized database transaction approach ensuring atomic operations and data consistency across job processors handling multiple related database operations.

**Core Pattern Implementation**:

```typescript
// Atomic transaction pattern for job processors
async process(job: Job): Promise<void> {
  const context = await buildExecutionContext(job.id, job.data);

  // Database transaction ensuring atomicity
  const { processedData } = await prisma.$transaction(async (tx) => {
    const dataToProcess = await tx.mention.findMany({
      where: conditionalWhereClause,
    });

    await tx.subTaskMention.createMany({
      data: dataToProcess.map((item) => ({
        subTaskId: job.id,
        mentionId: item.id,
        status: 'PENDING',
      })),
      skipDuplicates: true,
    });

    return { processedData: dataToProcess };
  });

  // Process data outside transaction
  await processBusinessLogic(processedData);
}
```

**Key Benefits**:

- **Atomicity**: Ensures related database operations succeed or fail together
- **Consistency**: Prevents partial data states during concurrent operations
- **Isolation**: Protects against race conditions in job processing
- **Rollback Safety**: Automatic rollback on transaction failures

**Adopted Processors**:

- ✅ `SentimentAnalysisProcessor` - Atomic mention query and SubTaskMention creation
- 🔄 Future processors requiring multi-table operations

### Batch Processing Pattern for External APIs (July 2025)

**Purpose**: Standardized approach for processing large datasets through external APIs with configurable batch sizes, error handling, and progress tracking.

**Core Pattern Implementation**:

```typescript
class BatchProcessor {
  private readonly BATCH_SIZE = 25;

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  async processBatches(data: any[]): Promise<void> {
    const batches = this.chunkArray(data, this.BATCH_SIZE);

    for (let i = 0; i < batches.length; i++) {
      try {
        await this.processIndividualBatch(batches[i], i + 1, batches.length);
      } catch (error) {
        this.logger.error(`Batch ${i + 1} failed: ${error.message}`);
        // Continue processing remaining batches
      }
    }
  }
}
```

**Key Benefits**:

- **API Rate Limiting**: Prevents overwhelming external services
- **Error Isolation**: Batch failures don't stop entire job processing
- **Progress Tracking**: Clear logging of batch completion status
- **Resource Management**: Controlled memory usage for large datasets

**Adopted Processors**:

- ✅ `SentimentAnalysisProcessor` - 25-comment batches for FastAPI sentiment analysis
- 🔄 Future processors handling large external API operations

### Explicit Authentication Method Pattern (July 2025)

**Deterministic authentication specification pattern eliminating heuristic detection**:

```typescript
@Injectable()
export class ExplicitAuthProcessor {
  async process(job: Job): Promise<void> {
    // 1. Build execution context with explicit auth method
    const context = await buildExecutionContext(job.id, job.data);

    // 2. Extract explicit authentication method from context
    const { authToken, authMethod } = context; // authMethod: 'OAUTH' | 'API_KEY'

    // 3. Pass explicit authentication to service calls
    const result = await youtubeService.fetchSingleYoutubeVideo(
      authToken,
      authMethod, // <- Explicit method specification
      job.data.url,
    );

    // 4. Log authentication method for debugging
    this.logger.log(
      `Processing with ${authMethod} authentication`,
      'ExplicitAuthProcessor',
    );
  }
}
```

**Service Layer Implementation**:

```typescript
// YouTube Content Service with explicit authentication
class YoutubeContentService {
  async fetchSingleYoutubeVideo(
    authToken: string,
    authMethod: 'OAUTH' | 'API_KEY', // <- Explicit parameter
    videoUrl: string,
  ): Promise<VideoData> {
    // Build request configuration based on explicit method
    const requestConfig = this.buildRequestConfig(
      authToken,
      authMethod,
      baseUrl,
    );

    // OAuth: Authorization header | API Key: URL parameter
    return await this.makeRequest(requestConfig);
  }

  private buildRequestConfig(
    token: string,
    authMethod: 'OAUTH' | 'API_KEY',
    baseUrl: string,
  ): RequestConfig {
    if (authMethod === 'OAUTH') {
      return {
        url: baseUrl,
        headers: { Authorization: `Bearer ${token}` },
      };
    } else {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return {
        url: `${baseUrl}${separator}key=${encodeURIComponent(token)}`,
        headers: {},
      };
    }
  }
}
```

**Pattern Benefits**:

- **Deterministic Behavior**: No token format analysis or heuristic detection
- **Explicit Configuration**: Authentication method determined once at ExecutionContext creation
- **Robust Error Context**: Authentication method included in all error messages
- **Test Reliability**: Predictable authentication behavior in test scenarios
- **Production Stability**: Eliminates authentication failures from format misdetection
- **Code Clarity**: Explicit method parameters improve code readability and maintenance

**Token Source Mapping**:

```typescript
// ExecutionContext builder determines authentication method explicitly
const authMethod = tokenSource === TokenSource.USER_OAUTH ? 'OAUTH' : 'API_KEY';

// Method flows explicitly through entire call chain
context.authMethod → processor → service → buildRequestConfig
```

### ExecutionContext Type Safety Pattern (July 2025)

**Runtime validation pattern ensuring userId integrity throughout job processing flow**:

```typescript
// ExecutionContext builder validates userId before returning
function validateExecutionContext(context: ExecutionContext): void {
  if (typeof context.userId !== 'string' || context.userId.trim().length === 0) {
    throw new IntegrationAuthenticationError(
      `Critical Error: ExecutionContext was built with an invalid userId for SubTask`
    );
  }
}

// Applied at all ExecutionContext creation points
const context = { userId: user.id, ... }; // No Number() conversion
validateExecutionContext(context);
return context;
```

**Pattern Benefits**:

- **Type Safety**: Compile-time and runtime protection against userId type conversion
- **Foreign Key Integrity**: Ensures valid CUID strings for database foreign key relationships
- **Error Prevention**: Eliminates NaN values from Number() conversions on CUID strings
- **Test Coverage**: Comprehensive validation test suite prevents regression
- **Database Consistency**: Maintains proper foreign key constraints across all operations

## Configuration and Error Handling

### Error Handling

- **Job Failures**: Caught and logged with retry logic
- **API Errors**: NestJS exception filters
- **Service Errors**: Propagated from `@repo/services`

### Configuration

- **Environment Variables**: Via `ConfigModule.forRoot()`
- **Service URLs**: External microservice endpoints
- **Queue Settings**: Redis/Bull configuration
