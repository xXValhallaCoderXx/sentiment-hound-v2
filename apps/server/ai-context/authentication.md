# Authentication Architecture

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
- **Environment Variables**: `process.env.YOUTUBE_MASTER_ACCESS_TOKEN` for fallback

## Platform-Specific Authentication

### YouTube Data API v3
- **OAuth Scope**: Full access to user's YouTube data and private videos
- **API Key Access**: Public videos, comments, and channel information
- **Token Detection**: Automatic method detection based on token format
- **Request Configuration**: Dynamic header vs. parameter authentication

### Authentication Method Detection
```typescript
// Automatic detection based on token characteristics
const authMethod = detectAuthenticationMethod(token);
// Results in: 'OAUTH' | 'API_KEY'

// Dynamic request configuration
const config = buildRequestConfig(authMethod, token);
// OAuth: Authorization header | API Key: URL parameter
```

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
