# PRD DRAFT: Decouple Data Models from User Integrations

## 1. Overview

This feature refactors the Prisma database schema to decouple core data models (Post, Task, Mention) from the Integration model. Currently, the schema enforces that all Posts and Tasks must be associated with a user's Integration, which prevents the system from analyzing public content using API keys or master tokens when users haven't connected their social accounts.

The refactoring separates the data's origin (the Provider, e.g., YouTube, Reddit) from the authentication method used to retrieve it (either a user's Integration or our global API keys). This enables our "Concierge" MVP flow where we analyze posts on behalf of users without requiring them to connect their accounts first.

## 2. Assumptions Made

- The system needs to support three authentication methods: user integrations, API keys, and master tokens
- Posts and Tasks should always be associated with a Provider to indicate their source platform
- Existing user integrations and their data should remain intact after migration
- The current task creation flow in `packages/services/src/tasks/tasks.service.ts` will be updated to use the new schema
- The analysis action in `apps/web/actions/analysis.actions.ts` will continue to work with improved flexibility
- We want to maintain referential integrity while making integrations optional
- The system should be able to track which authentication method was used for auditing purposes
- Existing subtask and queue processing logic should continue to work with minimal changes

## 3. User Stories

- As a **new user**, I want to analyze social media posts immediately without connecting my accounts first, so that I can evaluate the platform's value before committing to integrations.

- As a **product manager**, I want the system to use our API keys as fallback authentication, so that users get a seamless experience even without connected accounts.

- As a **developer**, I want clear separation between data source (Provider) and authentication method (Integration), so that the codebase is more maintainable and flexible.

- As a **system administrator**, I want to track which authentication method was used for each analysis, so that I can monitor API usage and billing.

- As an **existing user with integrations**, I want my connected accounts to continue working as before, so that my workflow isn't disrupted by the schema changes.

## 4. Functional Requirements

### FR1. Update Post Model Schema

**Acceptance Criteria:**

- Given the Post model in schema.prisma, when the schema is updated, then `integrationId` becomes optional (`Int?`) instead of required
- Given the Post model, when the schema is updated, then a new required `providerId` field is added with a foreign key to Provider
- Given existing Post records, when migration runs, then all posts retain their current `integrationId` values
- Given the updated schema, when creating posts via API key authentication, then posts can be created with `providerId` but null `integrationId`

### FR2. Update Task Model Schema

**Acceptance Criteria:**

- Given the Task model in schema.prisma, when the schema is updated, then `integrationId` remains optional as it currently is
- Given the Task model, when the schema is updated, then a new required `providerId` field is added with a foreign key to Provider
- Given existing Task records, when migration runs, then all tasks retain their current `integrationId` values and get appropriate `providerId` values
- Given the updated schema, when creating tasks via API key authentication, then tasks can be created with `providerId` but null `integrationId`

### FR3. Update Mention Model Schema

**Acceptance Criteria:**

- Given the Mention model in schema.prisma, when the schema is updated, then `trackedKeywordId` remains optional as it currently is
- Given the Mention model, when the schema is updated, then a new optional `providerId` field is added for direct provider association
- Given existing Mention records, when migration runs, then mentions retain their current relationships while gaining provider associations
- Given the updated schema, when creating mentions, then they can be associated with providers directly or through existing relationships

### FR4. Update Task Service Logic

**Acceptance Criteria:**

- Given the task service in `packages/services/src/tasks/tasks.service.ts`, when creating tasks, then it must provide a `providerId` based on the parsed URL provider
- Given API key authentication scenarios, when `integrationId` is 0 or null, then tasks are created successfully with just `providerId`
- Given user integration scenarios, when `integrationId` is provided, then tasks are created with both `integrationId` and `providerId`
- Given the task creation process, when parsing URLs, then the provider is correctly identified and used for `providerId`

### FR5. Update Analysis Action Logic

**Acceptance Criteria:**

- Given the analysis action in `apps/web/actions/analysis.actions.ts`, when calling `createTask`, then it passes the appropriate `providerId` from the URL parsing result
- Given API key authentication, when no user integration exists, then the analysis proceeds using provider-based task creation
- Given user integration authentication, when integration exists, then both `integrationId` and `providerId` are used
- Given the task creation call, when errors occur, then appropriate error handling distinguishes between provider and integration issues

### FR6. Database Migration Safety

**Acceptance Criteria:**

- Given the existing database, when migration runs, then no data is lost
- Given foreign key constraints, when migration applies, then all existing relationships remain valid
- Given the migration process, when it completes, then the database is in a consistent state
- Given rollback scenarios, when migration needs to be reverted, then a safe rollback path exists

## 5. Out of Scope (Non-Goals)

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

## 6. Technical Considerations

### Database Schema Changes

- The migration will need to populate `providerId` for existing records by looking up the provider through existing integration relationships
- Foreign key constraints must be carefully managed during migration to avoid constraint violations
- Indexes may need to be added for the new `providerId` fields for query performance

### Code Dependencies

- The task service will need updates to handle the new provider-based creation flow
- Any existing queries that join Post/Task with Integration may need updates to handle null integrations
- The URL parser service output will need to be mapped to provider IDs in the database

### Performance Implications

- Adding required `providerId` fields will slightly increase storage requirements
- Queries filtering by provider will be more efficient with direct provider relationships
- Migration time will depend on the number of existing Post and Task records

### Backward Compatibility

- All existing functionality with user integrations must continue working
- Existing API contracts should remain unchanged
- Tests will need updates to provide the new required fields

## 7. Success Metrics

1. **Migration Success Rate**: 100% of existing Post and Task records successfully migrated with appropriate `providerId` values
2. **API Key Authentication Success**: >95% success rate for analysis tasks using API key authentication (where `integrationId` is null)
3. **Zero Regression**: 0 broken user integration flows after the schema update

## 8. Open Questions

1. **Provider ID Mapping**: How should we map existing Integration records to Provider IDs during migration? Should we create a data migration script to populate `providerId` based on `integration.providerId`? Sure if that is the best way to retain data lets do it.

2. **Migration Strategy**: Should we perform this migration as a single operation or break it into multiple steps (e.g., add columns first, then update constraints)? Lets just do a single one.

3. **Index Strategy**: Which combinations of fields should be indexed for optimal query performance (e.g., `(userId, providerId)`, `(providerId, createdAt)`)? What ever combination which will allow us to easily pull comments / tasks for a specific provider of a user efficiently, as well as other searches.

4. **Error Handling**: How should the system behave when a `providerId` cannot be determined from a URL? Should it fail gracefully or use a default provider? We will fail gracefully.

5. **Data Cleanup**: Are there any existing records with inconsistent provider relationships that should be addressed during migration? I dont think so - if there is we can afford to loose that.

6. **Testing Strategy**: Should we create a comprehensive test suite specifically for the migration process, or rely on existing tests with schema updates? No need to create test for it.

7. **Rollback Plan**: What is the specific rollback strategy if issues are discovered after migration? Should we maintain a backup of the original schema? We are in early stages - so they will be fine i can afford to restart db if i must.

8. **Provider Management**: Do we need any new tooling or admin interfaces to manage provider relationships after this decoupling? Dont think so.
