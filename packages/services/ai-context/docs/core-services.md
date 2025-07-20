# Core Services

## Purpose of This Document

This document provides an overview of the shared business logic services that form the core of the sentiment analysis platform. These services are used across all applications in the monorepo.

## Service Architecture

The services package follows a domain-driven design approach, with each service responsible for a specific business domain. Services are framework-agnostic and can be used by both Next.js and NestJS applications.

## Core Business Domains

### User Management

- **Users Service**: User profile management, registration, account operations
- **Plans Service**: Subscription plan management, feature limits, token tracking
- **Invitation Services**: Invitation-based onboarding and access control

### Social Media Integration

- **Integrations Service**: OAuth connection management for social platforms
- **Providers Service**: Platform metadata and configuration management
- **Reddit Service**: Reddit API integration, authentication, content fetching
- **YouTube Service**: YouTube Data API integration, video and comment analysis

### Content Analysis

- **Posts Service**: Social media post lifecycle and metadata management
- **Mentions Service**: Keyword mention detection and content extraction
- **Aspects Service**: Aspect-based sentiment analysis coordination
- **Competitors Service**: Competitor tracking and comparative analysis

### Task Orchestration

- **Tasks Service**: High-level background job management
- **Sub-Tasks Service**: Granular processing step management
- **Queues Service**: Job queue processing with retry logic
- **Jobs Service**: Background worker coordination

### Analytics & Insights

- **Dashboard Service**: Metrics aggregation and analytics data preparation
- **Exports Service**: Data export functionality and report generation
- **Tracked Keywords Service**: Keyword monitoring and search configuration

## Repository Pattern

Each service typically includes:

- **Service Class**: Business logic implementation
- **Repository Class**: Data access layer with Prisma integration
- **Error Classes**: Domain-specific error handling
- **Interface Definitions**: TypeScript interfaces for type safety

## Cross-Cutting Concerns

### Error Handling

- Custom error hierarchies for each domain
- Consistent error propagation across service boundaries
- Validation and business rule enforcement

### Data Access

- Centralized database access through `@repo/db`
- Repository pattern for data layer abstraction
- Transaction support for complex operations

### External Integration

- OAuth token management and refresh handling
- API rate limiting and quota management
- Circuit breaker patterns for external service failures

## Shared Utilities

- **DB Helpers**: Common database query patterns and utilities
- **URL Parser**: Social media URL parsing and validation
- **Common Types**: Shared TypeScript interfaces and utility types

## Service Dependencies

- **Database**: All services depend on `@repo/db` for Prisma client access
- **Framework Agnostic**: Services designed to work with any consuming application
- **Type Safety**: Full TypeScript support with generated database types

## Usage Patterns

- **Dependency Injection**: Services can be composed and injected as needed
- **Async Operations**: Promise-based APIs for all database and external calls
- **Error Propagation**: Consistent error handling across all service methods
- **Testing**: Services designed for easy unit testing and mocking
