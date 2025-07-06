# Authentication Architecture

## Table of Contents
1. [Overview](#overview)
2. [Authentication Modes](#authentication-modes)
3. [ExecutionContext Authentication Pattern](#executioncontext-authentication-pattern-july-2025)
4. [Platform-Specific Authentication](#platform-specific-authentication)
5. [Error Handling](#error-handling)
6. [Security Considerations](#security-considerations)

## Overview
The server handles authentication primarily for job processing operations, supporting both user OAuth integrations and master API key access for platform data retrieval.

## Authentication Modes

### User OAuth Integration
**User-connected platform accounts for personalized content access**:
- OAuth tokens stored in `integrations` table with expiration tracking
- Automatic token refresh using stored refresh tokens
- User-specific content access and rate limiting
- Enhanced data access permissions based on user platform connections

### Master API Key Access
**Environment-configured keys for public content analysis**:
- Fallback authentication when user OAuth unavailable or expired
- Public content access without user platform connections
- Shared rate limiting across all master key usage
- Limited to public API endpoints and data

## ExecutionContext Authentication Pattern (July 2025)

### Purpose
Unified authentication resolution for job processors with intelligent token management and seamless fallback strategies.

### Core Components
- `ExecutionContext` interface providing immutable authentication context
- `buildExecutionContext()` function centralizing token resolution logic
- `TokenSource` enum tracking authentication method (USER_OAUTH | MASTER_API_KEY)
- Enhanced error handling with `IntegrationAuthenticationError`

### Authentication Flow
1. **Context Building**: Fetch job data with user, provider, and integration information
2. **OAuth Validation**: Check user integration existence and token expiration
3. **Token Refresh**: Attempt automatic refresh for expired OAuth tokens
4. **Credential Update**: Persist refreshed tokens to database
5. **Master Fallback**: Use environment master key if OAuth unavailable
6. **Error Handling**: Throw authentication errors for complete failures

### Key Interactions
- **Integration Service**: `getIntegrationUserIntegrationByProviderId()` for OAuth lookup
- **YouTube Service**: `refreshAccessToken()` for token renewal
- **Integration Service**: `updateIntegrationAuthCredentials()` for persistence
- **Environment Variables**: `process.env.YOUTUBE_MASTER_API_KEY` for fallback

## Platform-Specific Authentication

### YouTube Data API v3
- **OAuth Scope**: Full access to user's YouTube data and private videos
- **API Key Access**: Public videos, comments, and channel information
- **Explicit Authentication**: Authentication method provided explicitly through ExecutionContext
- **Request Configuration**: Dynamic header vs. parameter authentication based on explicit method

### Explicit Authentication Method Usage
```typescript
// Authentication method provided explicitly from ExecutionContext
const authMethod = context.authMethod; // 'OAUTH' | 'API_KEY'

// Dynamic request configuration based on explicit method
const config = buildRequestConfig(authToken, authMethod, baseUrl);
// OAuth: Authorization header | API Key: URL parameter
```

### Explicit Authentication Method Refactoring (July 2025)

**Purpose**: Elimination of heuristic authentication detection in favor of explicit authentication method specification throughout the YouTube content service layer, ensuring deterministic and robust authentication behavior.

**Core Components**:
- `ExecutionContext` interface extended with `authMethod: 'OAUTH' | 'API_KEY'` property
- `buildExecutionContext()` function enhanced to explicitly determine authentication method based on token source
- `YoutubeContentService.buildRequestConfig()` refactored to accept explicit authentication method parameter
- Complete removal of `detectAuthenticationMethod()` heuristic function
- Environment variable migration from `YOUTUBE_MASTER_ACCESS_TOKEN` to `YOUTUBE_MASTER_API_KEY`

**Key Interactions**:
- `ExecutionContext.authMethod` property provides explicit authentication specification
- `TokenSource.USER_OAUTH` maps deterministically to `authMethod: 'OAUTH'`
- `TokenSource.MASTER_API_KEY` maps deterministically to `authMethod: 'API_KEY'`
- YouTube service methods (`fetchSingleYoutubeVideo`, `fetchVideoDetails`, `fetchVideoComments`) updated to accept explicit `authMethod` parameters
- Job processors pass `context.authMethod` explicitly to YouTube service calls
- Authentication method logged for debugging and monitoring

**Architecture Benefits**:
- **Deterministic Behavior**: No more unreliable token format analysis or heuristic detection
- **Explicit Configuration**: Authentication method determined at ExecutionContext creation and passed throughout call chain
- **Robust Error Handling**: Clear authentication method context in error messages and logs
- **Test Reliability**: Authentication tests no longer depend on token format assumptions
- **Production Stability**: Eliminates authentication failures caused by heuristic misdetection

**Migration Impact**:
- All YouTube API authentication now uses explicit method specification
- Environment variables standardized with consistent naming convention
- Test suites updated to validate explicit authentication flow
- Documentation updated to reflect deterministic authentication approach

## Error Handling

### Authentication Error Types
- **`IntegrationAuthenticationError`**: Comprehensive authentication failures
- **Token Expiration**: Handled automatically with refresh attempts
- **Refresh Failures**: Graceful fallback to master API key
- **Missing Credentials**: Clear error messages for debugging

### Error Propagation
- Authentication errors bubble up from ExecutionContext builder
- Job processors handle authentication errors with appropriate task marking
- Consistent error logging for authentication debugging

## Security Considerations

### Token Storage
- OAuth tokens encrypted at rest in database
- Refresh tokens stored separately with expiration tracking
- Master API keys configured via environment variables only

### Rate Limiting
- User OAuth tokens respect platform-specific rate limits
- Master API keys shared across all public content requests
- Intelligent fallback prevents authentication cascading failures

### Access Control
- User OAuth provides access to user's connected platforms only
- Master API keys limited to public endpoints and content
- No cross-user data access possible through authentication system

### ExecutionContext Type Safety (July 2025)

**Purpose**: Enhanced type safety and validation for ExecutionContext userId field to prevent database constraint violations.

**Core Components**:
- `ExecutionContext.userId` field now strongly typed as string (CUID format)
- `validateExecutionContext()` function with runtime string validation
- Comprehensive test suite preventing regression of type conversion bugs

**Key Interactions**:
- Eliminated Number() conversions that caused CUID-to-NaN conversion issues
- Added IntegrationAuthenticationError for invalid userId validation failures
- All authentication flows now maintain userId as string throughout the process
- Database foreign key constraints properly satisfied with string CUID values

### SentimentAnalysisProcessor Authentication Refactor (July 2025)

**Purpose**: Enhanced sentiment analysis job processor with unified ExecutionContext authentication pattern supporting dual authentication modes and eliminating integration lookup errors.

**Core Components**:
- `SentimentAnalysisProcessor.process()` - Implements ExecutionContext pattern
- Conditional authentication logic based on `context.integrationId` presence
- Enhanced logging for authentication method transparency
- Standardized error handling for authentication failures

**Authentication Flow**:
1. **Context Building**: Use `buildExecutionContext(job.id, job.data)` instead of direct integration lookup
2. **OAuth Scenario**: When `context.integrationId` is present, filter mentions by integration
3. **Master API Key Scenario**: When `context.integrationId` is null, filter by `userId + providerId`
4. **Transparent Logging**: Log authentication method for operational transparency
5. **Error Boundary**: Catch `IntegrationAuthenticationError` and fail job gracefully

**Security Enhancements**:
- Authentication tokens never logged in any log messages
- Proper error message formatting: `Failed to build ExecutionContext for SubTask {job.id}: [reason]`
- Success logging format: `Built context for SubTask {job.id}: { userId, providerName, authMethod, integrationId }`

**Key Interactions**:
- **ExecutionContext Builder**: Central authentication resolution
- **SubTask Service**: Job failure marking with authentication errors
- **Database**: Conditional querying based on authentication context
- **Logging System**: Structured authentication method logging
