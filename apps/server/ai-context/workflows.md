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

### Job Processor ProviderId Pattern (July 2025)

**Purpose**: Standardized pattern for job processors to retrieve and include providerId in post creation operations.

**Core Components**:
- Enhanced SubTask service with provider relationship retrieval
- Updated job processor template requiring providerId handling
- Consistent error handling for missing Task or Provider relationships

**Standard Implementation Pattern**:
```typescript
async process(job: Job): Promise<void> {
  try {
    // 1. Get providerId from parent task
    const task = await subtaskService.getTaskWithProviderForSubTask(job.id);
    const providerId = task.task.providerId;

    // 2. Process content with provider context
    const posts = await processContent(/* parameters */);

    // 3. Include providerId in all post creation
    await postService.createUserPosts(posts.map(post => ({
      ...post,
      providerId: providerId,
    })));

    // 4. Update SubTask status
    await prisma.subTask.update({
      where: { id: job.id },
      data: { status: 'COMPLETED' },
    });
  } catch (error) {
    // Handle error and mark SubTask as failed
    await prisma.subTask.update({
      where: { id: job.id },
      data: { status: 'FAILED' },
    });
    throw error;
  }
}
```

**Key Interactions**:
- All job processors follow this pattern for consistent providerId handling
- Service layer abstracts Task-Provider relationship complexity
- TypeScript enforcement ensures no post creation without providerId
- Comprehensive error handling maintains job processing reliability

## Schema Change Workflow

### Database Schema Updates
1. **Update Schema**: Modify `packages/database/prisma/schema.prisma`
2. **Generate Migration**: `pnpm --filter @repo/db db:migrate --name descriptive-name`
3. **Regenerate Types**: `pnpm turbo db:generate`
4. **Verify Build**: `pnpm turbo build --filter=@repo/db`

### Code Updates After Schema Changes
1. **Update Processors**: Remove/add field assignments in job processors
2. **Update Services**: Verify service methods work with new types (often automatic)
3. **Update Tests**: Fix test mocks and fixtures if needed
4. **Update Documentation**: Add entries to ai-context files

### Migration Validation Checklist
- [ ] Prisma migration file created and reviewed
- [ ] TypeScript compilation succeeds across all packages
- [ ] All tests pass (`pnpm turbo test`)
- [ ] Development environment starts successfully
- [ ] Foreign key relationships verified in database
