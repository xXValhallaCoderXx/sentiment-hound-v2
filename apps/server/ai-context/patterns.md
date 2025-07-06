# Key Development Patterns

## Service Layer Integration
**Always use services from `@repo/services`**:

```typescript
import { taskService as coreTaskService } from '@repo/services';

// Use core services for business logic
const task = await coreTaskService.createTask({...});
```

## Job Processor Pattern
**Structured async job handling**:

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

## Provider-Aware Processing Pattern (July 2025)
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
      content
    });
  }
}
```

## Module Structure
**Standard NestJS module pattern**:

```typescript
@Module({
  imports: [/* Dependencies */],
  controllers: [/* REST endpoints */], 
  providers: [/* Services and processors */],
  exports: [/* Public services */],
})
export class FeatureModule {}
```

## Error Handling
- **Job Failures**: Caught and logged with retry logic
- **API Errors**: NestJS exception filters
- **Service Errors**: Propagated from `@repo/services`

## Configuration
- **Environment Variables**: Via `ConfigModule.forRoot()`
- **Service URLs**: External microservice endpoints
- **Queue Settings**: Redis/Bull configuration

## Dependency Injection
- **Services**: Injected via constructor
- **Repositories**: Through service layer
- **External APIs**: As configurable providers

## Service Injection Pattern
**Consistent dependency injection for testability**:

```typescript
constructor(private prisma: PrismaClient) {
  this.model = this.prisma.task; // Use injected instance
}
```
