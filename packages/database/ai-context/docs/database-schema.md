# Database Schema

## Purpose of This Document

This document provides a comprehensive overview of the database schema, serving as the single source of truth for all data structures in the sentiment analysis platform.

## Schema Overview

The database schema is defined in Prisma and follows a relational design optimized for sentiment analysis workflows, user management, and social media integration.

## Core Entity Relationships

### User-Centric Design

The schema is built around users as the central entity, with all other entities relating back to user ownership or access control.

**Primary User Flow:**
User → Plan → Features → Integrations → Content → Analysis

### Entity Categories

#### Identity & Access Management

- **User**: Central identity with authentication and plan assignment
- **Account**: OAuth provider accounts (Google, etc.)
- **Session**: Authentication session management
- **VerificationToken**: Email verification and password reset

#### Subscription & Feature Control

- **Plan**: Subscription tiers with feature limits and token allowances
- **PromoCode**: Promotional access and discount management
- **InvitationToken**: Invitation-based user onboarding

#### Social Media Integration

- **Provider**: Social media platforms (Reddit, YouTube, etc.)
- **Integration**: User OAuth connections to platforms
- **TrackedKeyword**: Keywords monitored across platforms
- **Competitor**: Competitor brands for comparative analysis

#### Content & Analysis Pipeline

- **Post**: Social media content from integrated platforms
- **Mention**: Individual mentions from posts or keyword searches
- **AspectAnalysis**: Detailed sentiment analysis with aspect extraction
- **CompetitorSentiment**: Aggregated competitor sentiment data

#### Background Processing

- **Task**: High-level background jobs (sync, analysis, export)
- **SubTask**: Granular processing steps
- **SubTaskMention**: Junction table for mention processing
- **Queue**: Job queue with retry logic and scheduling

## Key Design Patterns

### Soft Deletion

Most entities support soft deletion patterns to maintain data integrity while allowing user-initiated deletions.

### Audit Trails

All entities include `createdAt` and `updatedAt` timestamps for change tracking and debugging.

### Unique Constraints

Strategic unique constraints prevent duplicate tracking (e.g., user + keyword + provider combinations).

### JSON Flexibility

Strategic use of JSON fields for feature flags and dynamic configuration without schema changes.

## Enumeration Types

- **TaskStatus/SubTaskStatus**: Job processing states
- **SentimentStatus**: Analysis pipeline states
- **MentionSource**: Social media platform identifiers
- **QueueStatus**: Queue processing states
- **BillingInterval**: Subscription billing cycles

## Performance Considerations

### Indexing Strategy

- Composite indexes on frequently queried combinations (userId + providerId)
- Time-based indexes for analytics queries (createdAt, publishedAt)
- Foreign key indexes for efficient joins

### Data Partitioning

Schema designed to support future partitioning strategies:

- Time-based partitioning for historical sentiment data
- User-based partitioning for large-scale deployments

## Migration Management

- **Tool**: Prisma Migrate for version-controlled schema changes
- **Strategy**: Incremental migrations with rollback support
- **Deployment**: Automated migration deployment through CI/CD

## Connection & Access

- **Client**: Generated Prisma client with full TypeScript support
- **Location**: Centralized in `@repo/db` package
- **Pool Management**: Connection pooling for optimal performance
- **Environment**: Environment-based connection configuration
