# Core Services

## Purpose of This Document
This document provides an overview of the shared business logic and core services that power the sentiment analysis platform across all applications.

## Service Architecture
The core business logic is centralized in the `@repo/services` package, following a domain-driven design approach with separate services for each business area.

## Key Service Domains

### User & Authentication Services
- **Users Service**: User profile management, registration, and account operations
- **Plans Service**: Subscription plan management, feature limits, and billing logic
- **Invitation Services**: Invitation token generation and redemption system

### Social Media Integration Services
- **Integrations Service**: OAuth connection management for social media platforms
- **Providers Service**: Social media platform configuration and metadata management
- **Reddit Service**: Reddit API integration, post fetching, and authentication
- **YouTube Service**: YouTube API integration, video content, and comment analysis

### Content Analysis Services
- **Posts Service**: Social media post management and metadata handling
- **Mentions Service**: Keyword mention detection and content extraction
- **Aspects Service**: Aspect-based sentiment analysis processing
- **Competitors Service**: Competitor tracking and comparative sentiment analysis

### Task Management Services
- **Tasks Service**: High-level background job orchestration
- **Sub-Tasks Service**: Granular job step management and processing
- **Queues Service**: Job queue management with retry logic and scheduling
- **Jobs Service**: Background job execution and monitoring

### Supporting Services
- **Dashboard Service**: Analytics data aggregation and metrics calculation
- **Exports Service**: Data export functionality and file generation
- **Tracked Keywords Service**: Keyword monitoring and search configuration
- **Early Access Service**: Early access signup and user management

## Service Patterns

### Repository Pattern
- Each service typically includes a corresponding repository for data access
- Services handle business logic while repositories manage database operations
- Separation of concerns between data access and business rules

### Error Handling
- Custom error classes for different failure scenarios
- Consistent error propagation across service boundaries
- Validation and business rule enforcement at the service layer

### Integration Points
- Services communicate with external APIs (Reddit, YouTube, Sentiment Analysis)
- OAuth token management and refresh handling
- Rate limiting and API quota management

## Shared Utilities
- **DB Helpers**: Common database query patterns and utilities
- **URL Parser**: Social media URL parsing and validation
- **Common**: Shared types, interfaces, and utility functions

## Service Dependencies
- All services depend on `@repo/db` for database access via Prisma
- Services are designed to be framework-agnostic and reusable
- Used by both Next.js web app and NestJS server applications

## Key Design Principles
- **Single Responsibility**: Each service focuses on one business domain
- **Dependency Injection**: Services can be composed and tested independently
- **Type Safety**: Full TypeScript support with shared type definitions
- **Async Operations**: Promise-based APIs for all database and external service calls
