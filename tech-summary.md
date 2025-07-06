# Sentiment Hound - Technical High-Level Summary

## Overview

**Sentiment Hound** is a comprehensive sentiment analysis platform that monitors and analyzes social media content across multiple platforms (YouTube, Reddit) to provide actionable insights for businesses and content creators. The platform combines real-time content fetching, advanced sentiment analysis, and competitive intelligence in a unified dashboard.

## Core Business Value Proposition

- **Multi-Platform Monitoring**: Aggregate sentiment data from YouTube videos/comments and Reddit posts/discussions
- **Dual Authentication Modes**: Support both user OAuth integrations and API key-based public content analysis
- **Advanced Sentiment Analysis**: General sentiment + aspect-based sentiment analysis (ABSA) for granular insights
- **Competitive Intelligence**: Track and compare sentiment trends against competitors
- **Spam Detection**: AI-powered spam filtering to ensure data quality
- **Export & Analytics**: Comprehensive reporting and data export capabilities

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with React 19, Mantine UI, TypeScript
- **Backend**: NestJS with TypeScript (queue-based processing)
- **Database**: PostgreSQL with Prisma ORM
- **Sentiment Analysis**: Python FastAPI service with DistilBERT and PyABSA
- **Authentication**: NextAuth.js with OAuth (Google, Reddit, YouTube)
- **Infrastructure**: Monorepo (pnpm + Turborepo), Docker, Railway deployment

### Application Structure
```
apps/
├── web/                    # Next.js frontend (port 3000)
├── server/                 # NestJS backend API (port 3001)
├── sentiment-analysis-service/  # Python FastAPI (port 8000)
└── spam-detection-service/     # TypeScript spam detection

packages/
├── database/              # Prisma schema & migrations
├── services/              # Shared business logic
├── scripts/               # Utility scripts
└── config packages/       # ESLint, TypeScript configs
```

## Key Business Logic Areas

### 1. Content Analysis Pipeline

**Core Workflow**:
1. **URL Processing**: Parse social media URLs to detect platform and extract metadata
2. **Provider Resolution**: Map URLs to internal provider system (YouTube, Reddit)
3. **Authentication**: Use either user OAuth tokens or master API keys
4. **Content Fetching**: Retrieve posts, videos, comments via platform APIs
5. **Sentiment Analysis**: Process content through ML models for sentiment scoring
6. **Data Storage**: Store results with provider relationships and user context

**Key Services**:
- `TaskService`: Orchestrates analysis workflows and job creation
- `UrlParserService`: Extracts platform and metadata from social media URLs
- `PostService`: Manages social media posts and sentiment aggregation
- `MentionService`: Handles comments/mentions with sentiment tracking

### 2. Queue-Based Processing System

**Architecture Pattern**: Asynchronous job processing with NestJS + Bull queues

**Job Types**:
- `FETCH_INDIVIDUAL_POST_CONTENT`: Single post/video analysis
- `FETCH_CONTENT`: Bulk content synchronization
- `ANALYZE_CONTENT_SENTIMENT`: ML-powered sentiment analysis
- `DETECT_SPAM`: AI spam detection filtering
- `EXPORT_*`: Data export pipeline (fetch → format → generate)

**Execution Context Pattern**: Unified authentication and metadata resolution for job processors
- Automatic OAuth token refresh with API key fallback
- Provider-specific authentication routing
- Immutable context objects for reliable processing

### 3. Dual Authentication System

**OAuth Integration Mode**:
- Users connect their social media accounts
- Access to private content and user-specific data
- Automatic token refresh and management

**API Key Mode**:
- Analysis of public content without user account connection
- Master API keys for platform access
- Broader content analysis capabilities

**Provider Resolution**:
- URL-driven provider detection
- Fallback from integration ID to provider ID
- Support for both authenticated and public content analysis

### 4. Sentiment Analysis Engine

**Two-Tier Analysis**:

1. **General Sentiment** (DistilBERT):
   - Overall positive/negative/neutral classification
   - Confidence scoring
   - Text chunking for long content

2. **Aspect-Based Sentiment Analysis** (PyABSA):
   - Topic-specific sentiment extraction
   - Granular insights (e.g., "price: negative", "quality: positive")
   - Advanced ML models for nuanced analysis

**Processing Features**:
- Batch processing for performance
- Text chunking for model limitations
- Confidence-based result aggregation

### 5. Competitive Intelligence

**Competitor Tracking**:
- Multi-competitor sentiment monitoring
- Cross-platform sentiment aggregation
- Historical trend analysis
- Comparative sentiment scoring

**Data Collection**:
- Automated daily sentiment updates
- Multiple source aggregation (YouTube, Reddit, etc.)
- Mock data generation for MVP (extensible to real APIs)

### 6. User Management & Plans

**Subscription System**:
- Tiered plans with feature flags
- Token-based usage tracking
- Integration and keyword limits
- Competitor tracking quotas

**Feature Entitlements**:
- Spam detection (premium feature)
- Export capabilities
- Advanced analytics
- Multiple integrations

### 7. Dashboard & Analytics

**Real-Time Insights**:
- Overall sentiment scoring (0-100 scale)
- Sentiment trend charts (7/30/90 day periods)
- Recent mentions feed
- Aspect-based sentiment breakdowns

**Data Aggregation**:
- Efficient database queries with Prisma
- Sentiment percentage calculations
- Time-series data processing
- Cross-platform analytics

## Database Schema Design

### Core Models

**Content Hierarchy**:
```
User → Task → SubTask → Post → Mention → AspectAnalysis
```

**Provider Relationships** (July 2025 Enhancement):
- Direct `providerId` relationships on Post and Task models
- Optional `integrationId` for OAuth vs API key distinction
- Provider-agnostic content processing

**Key Tables**:
- `User`: Account management with plan relationships
- `Provider`: Social media platforms (YouTube, Reddit)
- `Integration`: User OAuth connections to platforms
- `Task`: Analysis job tracking with provider context
- `Post`: Social media content with sentiment results
- `Mention`: Comments/mentions with aspect analysis
- `AspectAnalysis`: Granular sentiment by topic

## Recent Architectural Enhancements (July 2025)

### 1. Provider Decoupling Refactor
- **Purpose**: Enable public content analysis without user OAuth requirements
- **Impact**: Dual authentication modes, URL-driven provider resolution
- **Benefits**: Broader content analysis, improved user onboarding

### 2. ExecutionContext Pattern
- **Purpose**: Unified job processor authentication and metadata handling
- **Impact**: Reduced complexity, automatic token management, enhanced reliability
- **Benefits**: 20-30% code reduction, comprehensive error handling, improved testability

### 3. Schema Optimization
- **Purpose**: Simplified data models and improved type safety
- **Impact**: Removed redundant fields, enforced foreign key relationships
- **Benefits**: Cleaner codebase, better performance, enhanced data integrity

## Development Patterns

### Service Layer Architecture
- **Separation of Concerns**: Business logic in `@repo/services`, UI in `apps/web`, queue processing in `apps/server`
- **Dependency Injection**: Constructor-based injection for testability
- **Repository Pattern**: Database abstraction through Prisma-based repositories

### Server Actions (Next.js)
- **Primary Data Layer**: Server actions replace traditional API routes
- **Type Safety**: `ActionResponse<T>` return types with error handling
- **Service Integration**: Direct imports from `@repo/services`

### Queue Processing
- **Template Pattern**: Standardized job processor structure with ExecutionContext
- **Error Handling**: Comprehensive authentication and processing error management
- **Provider Agnostic**: Unified processing regardless of authentication method

## Deployment & Infrastructure

**Monorepo Benefits**:
- Shared type definitions across applications
- Unified dependency management
- Coordinated deployments
- Code reuse through service packages

**Production Setup**:
- Railway deployment with Docker support
- PostgreSQL database with connection pooling
- Environment-based configuration
- Automated database migrations

## Testing Strategy

**Multi-Layer Testing**:
- **Unit Tests**: Service methods and utilities (Vitest)
- **Integration Tests**: Database operations and API workflows
- **Smoke Tests**: Critical path validation
- **Component Tests**: React components with Testing Library

**Test Coverage Areas**:
- Authentication flows (OAuth + API key)
- Sentiment analysis pipeline
- Queue job processing
- Database schema migrations
- URL parsing and provider resolution

## Security & Compliance

**Authentication Security**:
- OAuth token encryption and secure storage
- Automatic token refresh with fallback mechanisms
- API key management for public content access
- Session management through NextAuth.js

**Data Protection**:
- User data isolation through proper foreign key relationships
- Input validation with Zod schemas
- SQL injection prevention through Prisma ORM
- Rate limiting on sensitive endpoints

## Performance Considerations

**Database Optimization**:
- Efficient aggregation queries for dashboard analytics
- Proper indexing on frequently queried fields
- Connection pooling for high concurrency
- Pagination for large data sets

**Processing Efficiency**:
- Asynchronous job processing for long-running tasks
- Batch sentiment analysis for improved throughput
- Text chunking for ML model limitations
- Caching strategies for provider and integration lookups

## Future Extensibility

**Platform Expansion**:
- Modular provider system for new social media platforms
- Standardized authentication patterns
- Unified content processing pipeline

**Feature Enhancement**:
- Advanced ML model integration
- Real-time sentiment streaming
- Enhanced competitive intelligence
- Custom sentiment model training

This technical architecture provides a robust foundation for scalable sentiment analysis across multiple social media platforms while maintaining flexibility for future enhancements and platform additions.