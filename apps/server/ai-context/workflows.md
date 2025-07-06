# Common Workflows

## Adding a New Job Processor

1. **Create Processor**:
   ```typescript
   // src/modules/jobs/processors/my-feature.processor.ts
   @Injectable()
   export class MyFeatureProcessor {
     async process(job: Job): Promise<void> {
       // Implementation
     }
   }
   ```

2. **Register in JobsService**:
   ```typescript
   // In jobs.service.ts constructor
   this.processors[SubTaskType.MY_FEATURE] = this.myFeatureProcessor;
   ```

3. **Add to Module**:
   ```typescript
   // In jobs.module.ts
   providers: [...existing, MyFeatureProcessor]
   ```

## Adding a New API Endpoint

1. **Create DTO** (if needed):
   ```typescript
   // DTOs for request validation
   export class CreateMyFeatureDto { ... }
   ```

2. **Add Controller Method**:
   ```typescript
   @Post('my-feature')
   async createMyFeature(@Body() dto: CreateMyFeatureDto) {
     return await this.myService.handleFeature(dto);
   }
   ```

3. **Implement Service Logic**:
   ```typescript
   // Use core services for business logic
   const result = await coreService.processFeature(data);
   ```

## Development Commands

```bash
# Start development server
cd apps/server && pnpm dev

# Start with debugging
pnpm dev:debug

# Run tests
pnpm test
pnpm test:watch
pnpm test:e2e

# Type checking
pnpm build

# Production build
pnpm build:prod
```

## Queue Management

```bash
# Monitor queue status
# Via Redis CLI or Bull dashboard

# Process specific job types
# Jobs are processed automatically by registered processors

# Handle failed jobs
# Implement retry logic in processors
```

## Testing Strategy

- **Unit Tests**: Service methods and processors
- **Integration Tests**: Module interactions
- **E2E Tests**: Full API workflows
- **Job Testing**: Mock external services

## Debugging

- **Queue Issues**: Check Redis connection and job logs
- **Processor Failures**: Review error logs and retry logic
- **API Errors**: NestJS built-in logging
- **Service Integration**: Debug through `@repo/services`
