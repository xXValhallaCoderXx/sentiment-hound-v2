# API Endpoints

## Purpose of This Document

This document provides an overview of the API endpoints available in the web application, including both Next.js API routes and the main API structure.

## Next.js API Routes

### Authentication Routes

- `/api/auth/[...nextauth]`: NextAuth.js authentication endpoints
  - Handles OAuth callbacks, session management, and authentication flow

### Integration Management

- `/api/integrations/[id]/refresh`: Refresh integration access tokens
- `/api/integrations/[id]/revoke`: Revoke integration access

### Provider Information

- `/api/providers`: Get available social media providers
- `/api/providers/[name]`: Get specific provider details

### Invitation System

- `/api/invitation-codes/*`: Invitation code management endpoints

## Resource Groups

### Core Business Logic

Most business operations are handled through Next.js Server Actions rather than traditional API routes:

- **Dashboard Operations**: Analytics data, overview metrics, sentiment summaries
- **User Management**: Profile updates, plan management, feature usage tracking
- **Integration Management**: Social media platform connections (Reddit, YouTube)
- **Content Analysis**: Post fetching, sentiment analysis, keyword tracking
- **Task Management**: Background job monitoring and queue management

### External API Integration Points

- **Reddit API**: Content fetching, OAuth authentication, keyword search
- **YouTube API**: Video content analysis, comment extraction
- **Sentiment Analysis Service**: Python FastAPI service for ML-based sentiment analysis

## Data Flow Architecture

- **Frontend**: Next.js Server Actions for data mutations
- **Backend**: NestJS server for complex background processing
- **Services**: Shared business logic in `@repo/services` package
- **Database**: PostgreSQL with Prisma ORM for data persistence

## Key Patterns

- Server Actions preferred over API routes for form submissions and data mutations
- API routes primarily used for OAuth callbacks and external integrations
- Business logic centralized in the services package for reusability
