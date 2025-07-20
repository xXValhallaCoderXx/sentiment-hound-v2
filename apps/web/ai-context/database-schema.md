# Database Schema Overview

## Core Models

### User Management

- **`User`** - Core user accounts with OAuth integration
- **`Integration`** - User's connected social media platform accounts
- **`Provider`** - Available social media platforms (YouTube, Reddit, etc.)

### Content Models

- **`Post`** - Social media posts/videos with sentiment analysis results
  - Foreign keys: `userId`, `providerId`, `integrationId?` (optional)
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

### User Context

- **User** → **Integration**: OAuth platform connections
- **User** → **Task**: Analysis requests
- **User** → **Post**: Analyzed content ownership

## Schema Evolution

### Data Model Decoupling Refactor (July 2025)

**Purpose**: Enable analysis of public content using API keys without requiring user OAuth integrations.

**Core Components**:

- Updated Prisma schema with optional `integrationId` fields
- Added required `providerId` fields to Post and Task models
- Added optional `providerId` field to Mention model
- Migration scripts for backward compatibility

**Key Interactions**:

- Provider resolution from URL parsing or integration lookup
- Dual authentication support: OAuth tokens vs API keys
- Backward compatible queries for existing user integrations

### Mention Model Schema Cleanup (July 2025)

**Purpose**: Removed redundant `mentionId` field to simplify schema and eliminate technical debt in mention creation flows.

**Core Components**:

- Removed `mentionId Int` field from Mention model in Prisma schema
- Applied `remove-mention-id-field` migration with zero downtime
- Verified foreign key integrity in AspectAnalysis and SubTaskMention models
- Updated all mention creation logic across frontend and backend processors

**Key Interactions**:

- Mention identification now relies solely on auto-generated `id` primary key
- `remoteId` field maintains platform-specific unique identifiers (comment IDs, etc.)
- AspectAnalysis and SubTaskMention foreign key relationships preserved
- Simplified data objects in mention creation Server Actions and API endpoints
