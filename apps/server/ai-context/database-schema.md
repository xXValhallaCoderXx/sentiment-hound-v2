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
