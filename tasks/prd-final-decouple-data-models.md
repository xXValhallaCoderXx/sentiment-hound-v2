# PRD FINAL: Decouple Data Models from User Integrations

## 1. Overview

This feature refactors the Prisma database schema to decouple core data models (Post, Task, Mention) from the Integration model. Currently, the schema enforces that all Posts and Tasks must be associated with a user's Integration, preventing the system from analyzing public content using API keys or master tokens when users haven't connected their social accounts.

The refactoring separates the data's origin (the Provider) from the authentication method used to retrieve it (either user Integration or global API keys), enabling our "Concierge" MVP flow where we analyze posts on behalf of users without requiring account connections first.

## 2. User Stories

- As a **new user**, I want to analyze social media posts immediately without connecting my accounts first, so that I can evaluate the platform's value before committing to integrations.

- As a **product manager**, I want the system to use our API keys as fallback authentication, so that users get a seamless experience even without connected accounts.

- As a **developer**, I want clear separation between data source (Provider) and authentication method (Integration), so that the codebase is more maintainable and flexible.

- As a **system administrator**, I want to track which authentication method was used for each analysis, so that I can monitor API usage and billing.

- As an **existing user with integrations**, I want my connected accounts to continue working as before, so that my workflow isn't disrupted by the schema changes.

## 3. Functional Requirements

### FR1. Update Post Model Schema

**Acceptance Criteria:**

- Given the Post model in schema.prisma, when the schema is updated, then `integrationId` becomes optional (`Int?`) instead of required
- Given the Post model, when the schema is updated, then a new required `providerId` field is added with a foreign key to Provider
- Given existing Post records, when migration runs, then all posts retain their current `integrationId` values and receive appropriate `providerId` values based on their integration's provider
- Given the updated schema, when creating posts via API key authentication, then posts can be created with `providerId` but null `integrationId`

### FR2. Update Task Model Schema

**Acceptance Criteria:**

- Given the Task model in schema.prisma, when the schema is updated, then `integrationId` becomes optional (`Int?`) instead of required
- Given the Task model, when the schema is updated, then a new required `providerId` field is added with a foreign key to Provider
- Given existing Task records, when migration runs, then all tasks retain their current `integrationId` values and receive appropriate `providerId` values based on their integration's provider
- Given the updated schema, when creating tasks via API key authentication, then tasks can be created with `providerId` but null `integrationId`

### FR3. Update Mention Model Schema

**Acceptance Criteria:**

- Given the Mention model in schema.prisma, when the schema is updated, then a new optional `providerId` field is added for direct provider association
- Given existing Mention records, when migration runs, then mentions receive appropriate `providerId` values based on their post's integration provider
- Given the updated schema, when creating mentions, then they can be associated with providers directly through the `providerId` field

### FR4. Update Task Service Logic

**Acceptance Criteria:**

- Given the task service in `packages/services/src/tasks/tasks.service.ts`, when creating tasks, then it must provide a `providerId` based on the URL parser's provider detection
- Given API key authentication scenarios, when `integrationId` is null, then tasks are created successfully with just `providerId` and provider lookup from the URL parser service
- Given user integration scenarios, when `integrationId` is provided, then tasks are created with both `integrationId` and `providerId` for consistency
- Given the task creation process, when the provider is detected via `urlParserService.parse()`, then the provider string is mapped to a database provider ID using `providerService.getProviderByName()`

### FR5. Update Analysis Action Logic

**Acceptance Criteria:**

- Given the analysis action in `apps/web/actions/analysis.actions.ts`, when calling `createTask`, then it resolves the provider string to a provider ID and passes both `integrationId` and `providerId`
- Given API key authentication, when no user integration exists, then the analysis proceeds using provider-based task creation with null `integrationId`
- Given user integration authentication, when integration exists, then both `integrationId` and `providerId` are used for comprehensive tracking
- Given the task creation call, when errors occur, then appropriate error handling distinguishes between provider resolution and integration issues

### FR6. Create Data Migration Script

**Acceptance Criteria:**

- Given existing Post records, when migration runs, then `providerId` is populated by querying `integration.providerId` for each existing post
- Given existing Task records, when migration runs, then `providerId` is populated by querying `integration.providerId` for each existing task
- Given existing Mention records, when migration runs, then `providerId` is populated by querying `post.integration.providerId` for each existing mention
- Given the migration process, when it completes, then all existing records have valid `providerId` values and no data is lost

### FR7. Database Migration Execution

**Acceptance Criteria:**

- Given the migration files, when `pnpm turbo db:migrate --name decouple-posts-and-tasks` is executed, then the schema changes are applied atomically
- Given foreign key constraints, when migration applies, then all existing relationships remain valid and new constraints are properly enforced
- Given the migration completion, when the database is queried, then all models have the correct schema structure with optional `integrationId` and required `providerId` fields

## 4. Out of Scope (Non-Goals)

- Changing the Provider model structure or relationships beyond adding new foreign keys
- Modifying the Integration model itself - it remains unchanged
- Updating the SubTask model - it will continue to reference tasks through existing relationships
- Changing authentication flows for user account connections
- Modifying the Queue model or processing logic
- Updating the frontend UI - the analysis form should continue working as-is
- Changes to the billing or plan restriction logic
- Modifications to existing API endpoints in the NestJS backend
- Updates to the Python sentiment analysis service
- Changes to the spam detection service

## 5. Technical Considerations

### Database Schema Implementation

This refactoring leverages the existing `urlParserService.parse()` method which returns a `Provider` enum value that maps to database provider names. The provider resolution flow:

1. URL parsing detects provider (e.g., "youtube")
2. `providerService.getProviderByName()` resolves to database provider ID
3. Task/Post creation uses both `providerId` (required) and `integrationId` (optional)

### Code Dependencies and Service Integration

- The task service will use the existing `urlParserService` and `providerService` for provider resolution
- The `providerService.getProviderByName()` method in `packages/services/src/providers/providers.service.ts` provides the mapping from provider string to database ID
- Migration will populate `providerId` using the existing integration → provider relationships in the database
- The analysis action will call both services to resolve provider information before task creation

### Migration Strategy and Data Integrity

- Single-operation migration as specified in user feedback
- Data migration script will use `UPDATE` statements with JOIN clauses to populate `providerId` from existing relationships
- Indexes will be added for `(userId, providerId)` and `(providerId, createdAt)` combinations for efficient querying as specified in user feedback
- Migration will fail gracefully if provider resolution cannot be determined for any record

### Performance and Query Optimization

- Direct provider relationships eliminate the need for JOIN operations when filtering by provider
- The existing service architecture supports efficient provider lookups through `ProviderRepository.findByName()`
- Database indexes on new `providerId` fields will optimize common query patterns used in exports, mentions, and posts services

### Error Handling and Graceful Failure

- When `providerId` cannot be determined from a URL, the system will fail gracefully as specified in user feedback
- The existing error handling in `urlParserService` will propagate appropriate errors for unsupported providers
- Task creation errors will distinguish between provider resolution failures and integration issues

### Backward Compatibility

- All existing functionality with user integrations will continue working unchanged
- The optional `integrationId` fields ensure existing queries remain functional
- Existing service methods in `PostService`, `MentionService`, and `TaskService` will continue to work with both authentication methods

## 6. Success Metrics

1. **Migration Success Rate**: 100% of existing Post and Task records successfully migrated with appropriate `providerId` values
2. **API Key Authentication Success**: >95% success rate for analysis tasks using API key authentication (where `integrationId` is null)
3. **Zero Regression**: 0 broken user integration flows after the schema update

## 7. Implementation Steps

### Step 1: Schema Updates

Update the Prisma schema in `packages/database/prisma/schema.prisma`:

- Make `integrationId` optional in Post and Task models (`Int?`)
- Add required `providerId Int` fields with foreign key relationships to Provider
- Add optional `providerId Int?` field to Mention model

### Step 2: Migration Generation and Data Population

- Generate migration: `pnpm turbo db:migrate --name decouple-posts-and-tasks`
- Create data migration script to populate `providerId` from existing integration relationships
- Add database indexes for `(userId, providerId)` and `(providerId, createdAt)` combinations

### Step 3: Service Layer Updates

- Update `packages/services/src/tasks/tasks.service.ts` to resolve provider IDs using `providerService.getProviderByName()`
- Update `apps/web/actions/analysis.actions.ts` to pass both `integrationId` and `providerId` to task creation
- Ensure error handling distinguishes between provider resolution and integration failures

### Step 4: Migration Execution

- Apply migration using `pnpm turbo db:migrate` in development environment
- Verify all existing data has valid `providerId` values
- Test API key authentication flow creates tasks with null `integrationId` but valid `providerId`

### Step 5: Validation and Testing

- Verify existing user integration flows continue working
- Test new API key authentication creates tasks successfully
- Confirm no data loss and all relationships remain intact
