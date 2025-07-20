# Third-Party Integrations

## Purpose of This Document

This document provides an overview of external APIs and services integrated into the sentiment analysis platform, including authentication methods and key functionality.

## Social Media Platform Integrations

### Reddit Integration

- **API Version**: Reddit OAuth 2.0 API
- **Authentication**: OAuth 2.0 with refresh token support
- **Core Services**:
  - `packages/services/src/reddit/services/auth.service.ts`: OAuth flow management
  - `packages/services/src/reddit/services/content.service.ts`: Post and comment fetching
- **Key Features**:
  - Subreddit post fetching
  - Keyword-based mention search
  - Comment thread analysis
  - OAuth token refresh and revocation

### YouTube Integration

- **API Version**: YouTube Data API v3
- **Authentication**: Google OAuth 2.0 (same as login provider)
- **Core Services**:
  - `packages/services/src/youtube/services/`: Video content and comment analysis
- **Key Features**:
  - Video content extraction
  - Comment sentiment analysis
  - Channel monitoring
  - Search-based content discovery

### Google OAuth

- **Provider**: Google Identity Platform
- **Usage**: Both user authentication and YouTube API access
- **Implementation**: NextAuth.js Google provider with `select_account` prompt
- **Scopes**: Profile information, YouTube API access

## Machine Learning & AI Services

### Sentiment Analysis Service

- **Technology**: Python FastAPI microservice
- **Location**: `apps/sentiment-analysis-service/`
- **ML Models**:
  - DistilBERT for general sentiment analysis (SST-2 fine-tuned)
  - PyABSA for aspect-based sentiment analysis (ATEPC model)
- **Features**:
  - CPU/GPU optimization (CUDA, Apple Silicon MPS support)
  - Batch processing capabilities
  - Aspect extraction and polarity classification

### Model Management

- **Device Optimization**: Automatic device selection (CUDA > MPS > CPU)
- **Framework**: PyTorch with Transformers library
- **Checkpoints**: ATEPC English checkpoint for aspect analysis

## Database & Infrastructure

### PostgreSQL Database

- **Version**: PostgreSQL 14
- **Deployment**: Docker Compose for development
- **ORM**: Prisma with TypeScript client generation
- **Connection**: Centralized through `@repo/db` package

### Development Infrastructure

- **Container Orchestration**: Docker Compose
- **Database Persistence**: Volume mounting for data persistence
- **Environment**: Consistent development environment across team

## Authentication & Security

### OAuth 2.0 Flows

- **Reddit**: Custom OAuth implementation with PKCE support
- **Google**: NextAuth.js provider integration
- **Token Management**: Automatic refresh and secure storage
- **Revocation**: Graceful token revocation and cleanup

### Security Considerations

- OAuth tokens encrypted in database storage
- Refresh token rotation for enhanced security
- Scope-limited API access for minimal permissions

## External API Dependencies

### API Rate Limiting

- **Reddit API**: Rate limiting handled through service layer
- **YouTube API**: Google API quotas and rate limits
- **Monitoring**: Error handling and retry logic for rate limit exceeded scenarios

### Data Synchronization

- **Background Jobs**: NestJS-based task processing for API calls
- **Queue Management**: Retry logic for failed API requests
- **Incremental Sync**: Efficient data fetching to minimize API usage

## Integration Patterns

- **Service Layer Abstraction**: External APIs accessed through service interfaces
- **Error Handling**: Consistent error propagation and retry mechanisms
- **Configuration**: Environment-based API keys and configuration management
- **Testing**: Mock implementations for development and testing environments
