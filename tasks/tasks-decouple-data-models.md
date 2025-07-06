# Developer Task List: Decouple Data Models from User Integrations

## Relevant Files

### Schema and Migration Files

- `packages/database/prisma/schema.prisma` - Update Post, Task, and Mention models to add providerId fields and make integrationId optional
- `packages/database/prisma/migrations/[timestamp]_decouple_posts_and_tasks/migration.sql` - Generated migration file for schema changes
- `packages/database/scripts/data-migration.sql` - Custom data migration script to populate providerId fields

### Service Layer Files

- `packages/services/src/tasks/tasks.service.ts` - Update task creation logic to handle provider resolution and optional integrationId
- `packages/services/src/posts/posts.service.ts` - Update post creation logic to handle new schema structure
- `packages/services/src/mentions/mentions.service.ts` - Update mention creation logic to handle providerId field
- `packages/services/src/providers/providers.service.ts` - Enhance provider lookup methods for name-to-ID mapping

### Action Layer Files

- `apps/web/actions/analysis.actions.ts` - Update analysis action to resolve provider IDs and pass to task creation

### Test Files

- `packages/services/src/tasks/tasks.service.test.ts` - Unit tests for updated task service logic
- `packages/services/src/posts/posts.service.test.ts` - Unit tests for updated post service logic
- `packages/services/src/mentions/mentions.service.test.ts` - Unit tests for updated mention service logic
- `apps/web/actions/analysis.actions.test.ts` - Integration tests for updated analysis action

### Notes

- All model updates must maintain backward compatibility with existing integrations
- Provider ID resolution uses existing `urlParserService.parse()` and `providerService.getProviderByName()` methods
- Migration includes data population to ensure no existing records lose their provider associations
- Run tests with `pnpm test` from the respective package directories
- Generate Prisma client after schema changes with `pnpm turbo db:generate`
- Apply migrations with `pnpm turbo db:migrate --name decouple-posts-and-tasks`

## Tasks

- [x] **1.0 Update Database Schema**

  - [x] 1.1 Update Post model in `packages/database/prisma/schema.prisma` to make `integrationId` optional (`Int?`)
  - [x] 1.2 Add required `providerId Int` field to Post model with foreign key relationship to Provider
  - [x] 1.3 Update Task model in `packages/database/prisma/schema.prisma` to make `integrationId` optional (`Int?`)
  - [x] 1.4 Add required `providerId Int` field to Task model with foreign key relationship to Provider
  - [x] 1.5 Add optional `providerId Int?` field to Mention model with foreign key relationship to Provider
  - [x] 1.6 Generate Prisma client with updated schema using `pnpm turbo db:generate`

- [x] **2.0 Create Database Migration**

  - [x] 2.1 Generate initial migration file using `pnpm turbo db:migrate --name decouple-posts-and-tasks`
  - [x] 2.2 Create custom data migration script `packages/database/scripts/data-migration.sql`
  - [x] 2.3 Write SQL to populate Post.providerId from existing integration.providerId relationships
  - [x] 2.4 Write SQL to populate Task.providerId from existing integration.providerId relationships
  - [x] 2.5 Write SQL to populate Mention.providerId from existing post.integration.providerId relationships
  - [x] 2.6 Add database indexes for `(userId, providerId)` combinations on Post and Task models
  - [x] 2.7 Add database indexes for `(providerId, createdAt)` combinations for efficient querying

- [x] **3.0 Update Task Service Logic**

  - [x] 3.1 Modify `createTask` method in `packages/services/src/tasks/tasks.service.ts` to accept optional `providerId` parameter
  - [x] 3.2 Add provider resolution logic using `urlParserService.parse()` to detect provider from URL
  - [x] 3.3 Add provider ID lookup using `providerService.getProviderByName()` to convert provider string to database ID
  - [x] 3.4 Update task creation to handle null `integrationId` for API key authentication scenarios
  - [x] 3.5 Update task creation to always include `providerId` for both user integration and API key scenarios
  - [x] 3.6 Add error handling to distinguish between provider resolution failures and integration issues
  - [x] 3.7 Update mock integration object creation for API key auth to include resolved provider information

- [x] **4.0 Update Analysis Action Logic**

  - [x] 4.1 Modify `startAnalysis` function in `apps/web/actions/analysis.actions.ts` to resolve provider ID
  - [x] 4.2 Add call to `providerService.getProviderByName()` using provider string from URL parsing
  - [x] 4.3 Update `taskService.createTask()` call to pass both `integrationId` and `providerId` parameters
  - [x] 4.4 Add error handling for provider resolution failures with appropriate user-facing messages
  - [x] 4.5 Ensure API key authentication flow passes null `integrationId` but valid `providerId`

- [x] **5.0 Update Post Service Logic**

  - [x] 5.1 Modify post creation methods in `packages/services/src/posts/posts.service.ts` to handle optional `integrationId`
  - [x] 5.2 Update post creation methods to require `providerId` parameter
  - [x] 5.3 Update post query methods to support filtering by `providerId` directly
  - [x] 5.4 Ensure backward compatibility for existing post queries that use integration relationships

- [x] **6.0 Update Mention Service Logic**

  - [x] 6.1 Modify mention creation methods in `packages/services/src/mentions/mentions.service.ts` to accept optional `providerId`
  - [x] 6.2 Update mention queries to support filtering by `providerId` when available
  - [x] 6.3 Add fallback logic to resolve provider from post relationship when `providerId` is null
  - [x] 6.4 Ensure backward compatibility for existing mention queries

- [x] **7.0 Enhance Provider Service**

  - [x] 7.1 Verify `getProviderByName()` method in `packages/services/src/providers/providers.service.ts` handles case-insensitive lookups
  - [x] 7.2 Add error handling for provider not found scenarios
  - [x] 7.3 Add caching for provider name-to-ID mappings to improve performance
  - [x] 7.4 Ensure provider service integrates properly with URL parser service enum values

- [x] **8.0 Execute Database Migration**

  - [x] 8.1 Apply schema migration in development environment using `pnpm turbo db:migrate`
  - [x] 8.2 Execute data migration script to populate `providerId` fields for existing records
  - [x] 8.3 Verify all existing Post records have valid `providerId` values
  - [x] 8.4 Verify all existing Task records have valid `providerId` values
  - [x] 8.5 Verify all existing Mention records have valid `providerId` values where applicable
  - [x] 8.6 Confirm foreign key constraints are properly enforced
  - [x] 8.7 Test that new records can be created with null `integrationId` but valid `providerId`

- [x] **9.0 Write Comprehensive Tests**

  - [x] 9.1 Create unit tests for updated task service in `packages/services/src/tasks/tasks.service.test.ts`
  - [x] 9.2 Test API key authentication scenario (null `integrationId`, valid `providerId`)
  - [x] 9.3 Test user integration scenario (valid `integrationId` and `providerId`)
  - [x] 9.4 Test provider resolution from URL parsing
  - [x] 9.5 Test error handling for unknown providers
  - [x] 9.6 Create unit tests for updated post service in `packages/services/src/posts/posts.service.test.ts`
  - [x] 9.7 Test post creation with optional `integrationId` and required `providerId`
  - [x] 9.8 Create unit tests for updated mention service in `packages/services/src/mentions/mentions.service.test.ts`
  - [x] 9.9 Test mention creation with optional `providerId`

- [ ] **10.0 Validation and Quality Assurance**
  - [ ] 10.1 Run full test suite to ensure no regressions: `pnpm test`
  - [ ] 10.2 Test existing user integration flows continue working without changes
  - [ ] 10.3 Test new API key authentication creates tasks successfully
  - [ ] 10.4 Verify analysis form UI continues working as before
  - [ ] 10.5 Test provider filtering queries work with new `providerId` fields
  - [ ] 10.6 Verify dashboard queries perform efficiently with new indexes
  - [ ] 10.7 Test edge cases: invalid URLs, unsupported providers, missing providers
  - [ ] 10.8 Confirm success metrics: 100% migration success, >95% API key auth success, 0 regression
  - [ ] 10.9 Document any breaking changes or migration notes for deployment
