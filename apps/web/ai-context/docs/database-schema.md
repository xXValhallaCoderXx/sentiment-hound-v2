# Database Schema

## Purpose of This Document
This document provides a high-level overview of the database schema, key entities, and their relationships in the sentiment analysis platform.

## Core Entity Groups

### User Management
- **User**: Central user entity with authentication, plan assignment, and feature flags
- **Account**: OAuth account connections (Google, etc.)
- **Session**: User session tracking for NextAuth.js
- **VerificationToken**: Email verification and password reset tokens

### Subscription & Access Control
- **Plan**: Subscription plans with feature limits and token allowances
- **PromoCode**: Promotional codes for discounts and special access
- **InvitationToken**: Invitation-based user onboarding system

### Social Media Integrations
- **Provider**: Social media platforms (Reddit, YouTube, etc.)
- **Integration**: User connections to social media platforms with OAuth tokens
- **TrackedKeyword**: Keywords users want to monitor across platforms
- **Competitor**: Competitor tracking for comparative sentiment analysis

### Content & Analysis
- **Post**: Social media posts fetched from integrated platforms
- **Mention**: Individual mentions found through keyword tracking or post analysis
- **AspectAnalysis**: Detailed aspect-based sentiment analysis results
- **CompetitorSentiment**: Aggregated sentiment data for tracked competitors

### Task Management & Processing
- **Task**: High-level background jobs (sync, analysis, export operations)
- **SubTask**: Granular job steps with specific processing types
- **SubTaskMention**: Junction table linking mentions to processing tasks
- **Queue**: Job queue management with retry logic and status tracking

## Key Relationships

### User-Centric Design
- Users can have multiple Integrations (social media connections)
- Users can track multiple Keywords and Competitors
- Users are assigned to Plans which control feature limits and token usage

### Content Processing Flow
- Integrations fetch Posts from social media platforms
- Posts contain Mentions which are analyzed for sentiment
- Tasks and SubTasks manage the processing pipeline
- Queue handles retry logic and job scheduling

### Analysis & Insights
- Mentions can have multiple AspectAnalyses for detailed sentiment breakdown
- CompetitorSentiment aggregates daily sentiment scores by source type
- Plan-based token tracking limits analysis operations

## Enums and Status Tracking
- **TaskStatus/SubTaskStatus**: PENDING, IN_PROGRESS, COMPLETED, FAILED
- **SentimentStatus**: Analysis processing states
- **MentionSource**: YOUTUBE, REDDIT, FACEBOOK, INSTAGRAM, TIKTOK, LINKEDIN
- **QueueStatus**: Job queue processing states
- **BillingInterval**: MONTHLY, YEARLY for subscription plans

## Database Technology
- **Primary Database**: PostgreSQL
- **ORM**: Prisma with generated TypeScript client
- **Migrations**: Managed through Prisma migrate
- **Connection**: Centralized through `@repo/db` package
