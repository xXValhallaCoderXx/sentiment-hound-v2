# Database Schema Overview

## Core Models

### User Management

- **`User`** - Core user accounts with OAuth integration
- **`Integration`** - User's connected social media platform accounts
- **`Provider`** - Available social media platforms (YouTube, Reddit, etc.)

### Content Models

- **`Post`** - Social media posts/videos with sentiment analysis results
  - Foreign keys: `userId`, `providerId` **(required starting July 2025)**, `integrationId?` (optional)
- **`Mention`** - Comments/mentions within posts
  - Foreign keys: `postId`, `providerId?` (optional)
- **`Task`** - Analysis job tracking
  - Foreign keys: `userId`, `providerId`, `integrationId?` (optional)

### Analysis Results

- **`AspectAnalysis`** - Detailed sentiment breakdown by topic
- **`SentimentAnalysis`** - Overall post sentiment scores
- **`KeywordAnalysis`** - Extracted keywords and themes

## Key Relationships

### Provider Decoupling (July 2025)

- **Post** ↔ **Provider**: Direct relationship for content source
- **Task** ↔ **Provider**: Direct relationship for analysis scope
- **Mention** ↔ **Provider**: Optional relationship for cross-platform mentions
- **Integration** ↔ **Provider**: User's OAuth connection to platform

### Queue Processing Context

- **Task** → **Job**: Queue jobs include provider and integration context
- **Job Data**: Contains `providerId`, optional `integrationId`, and authentication details

## Schema Evolution

### Data Model Decoupling Refactor (July 2025)

**Purpose**: Enable analysis of public content using API keys without requiring user OAuth integrations.

**Core Components**:

- Updated Prisma schema with optional `integrationId` fields
- Added required `providerId` fields to Post and Task models
- Added optional `providerId` field to Mention model
- Migration scripts for backward compatibility

**Key Interactions**:

- Queue jobs process both OAuth and API key authentication modes
- Provider resolution from URL parsing or integration lookup
- Background processors use appropriate authentication based on integration presence

### ExecutionContext Foreign Key Type Safety (July 2025)

**Purpose**: Fixed critical bug where userId foreign key values were converted to NaN, causing database constraint violations.

**Core Components**:

- All userId fields maintain CUID string format throughout application flow
- ExecutionContext builder validates userId as non-empty string before database operations
- Comprehensive test coverage prevents regression of type conversion issues

**Key Interactions**:

- Post creation operations properly reference User.id with string CUID values
- Task and subtask creation maintain valid foreign key relationships
- Authentication context preserves userId type integrity across service boundaries
- Database foreign key constraints consistently satisfied with proper CUID values

### Post Model ProviderId Requirement Enforcement (July 2025)

**Purpose**: Database schema refactor enforcing Post.providerId as a required field to ensure proper provider relationship tracking.

**Core Components**:

- Updated Prisma schema making `providerId` non-optional on Post model
- Modified job processors to retrieve and include providerId in all post creation
- Enhanced SubTask service to facilitate providerId retrieval from parent Task relationships

**Key Interactions**:

- TypeScript compilation enforces providerId presence in all PostCreateManyInput objects
- Job processors use `subtaskService.getTaskWithProviderForSubTask()` to obtain providerId
- Repository layer maintains type safety with Prisma-generated types
- All post creation workflows now guarantee provider relationship integrity

### Mention Model Simplification (July 2025)

**Purpose**: Removed redundant `mentionId` field to eliminate technical debt and improve schema clarity.

**Core Components**:

- Removed `mentionId Int` field from Mention model in `packages/database/prisma/schema.prisma`
- Updated job processors: `post-fetch.processor.ts`, `content-fetch.processor.ts`, `reddit-fetch-processor.ts`
- Verified foreign key integrity in `AspectAnalysis` and `SubTaskMention` models
- Applied Prisma migration: `remove-mention-id-field`

**Key Interactions**:

- Mention records now rely solely on auto-generated `id` primary key
- `remoteId` field continues to serve as unique identifier per platform
- Foreign key relationships in analysis models reference `Mention.id` correctly
- All mention creation flows simplified without redundant field assignments

### SentimentAnalysisProcessor Database Transaction Pattern (July 2025)

**Purpose**: Implemented atomic database operations in sentiment analysis processor to ensure data consistency between mention queries and SubTaskMention creation.

**Core Components**:

- Transactional mention querying with conditional where clauses
- Atomic SubTaskMention creation with `skipDuplicates` behavior
- Error handling for transaction failures
- Conditional query logic supporting dual authentication modes

**Transaction Implementation**:

```typescript
const { pendingComments } = await prisma.$transaction(async (tx) => {
  const pendingComments = await tx.mention.findMany({
    where: whereClause, // OAuth: integrationId, Master: userId+providerId
  });

  await tx.subTaskMention.createMany({
    data: pendingComments.map((comment) => ({
      subTaskId: job.id,
      mentionId: comment.id,
      status: 'PENDING',
    })),
    skipDuplicates: true,
  });

  return { pendingComments };
});
```

**Data Consistency Benefits**:

- Ensures mentions and SubTaskMentions are created atomically
- Prevents race conditions in concurrent job processing
- Maintains `skipDuplicates` behavior for idempotent operations
- Provides rollback capability for partial failures

**Key Interactions**:

- **Mention Table**: Conditional querying based on authentication context
- **SubTaskMention Table**: Bulk creation with duplicate prevention
- **Job Processing**: Atomic data preparation for sentiment analysis
- **Error Handling**: Transaction rollback on database failures

## Schema Optimization Summary

### Recent Schema Evolution (July 2025)

The database schema has undergone significant evolution to support modern job processing patterns:

**Key Improvements**:

- **Provider Decoupling**: Direct provider relationships enable flexible authentication modes
- **Type Safety**: CUID string enforcement prevents foreign key constraint violations
- **Schema Simplification**: Removal of redundant fields reduces technical debt
- **Transaction Patterns**: Atomic operations ensure data consistency in concurrent processing

**Processing Benefits**:

- **Dual Authentication**: Schema supports both OAuth and master API key scenarios
- **Provider Flexibility**: Content processing works across multiple social media platforms
- **Job Reliability**: Foreign key relationships ensure referential integrity
- **Performance**: Optimized queries with proper indexing on user and provider fields

**Architecture Alignment**:

- Database schema directly supports ExecutionContext authentication patterns
- Provider relationships enable dynamic platform routing in job processors
- Transaction support ensures reliable batch processing operations
- Type safety improvements prevent runtime errors in production systems
