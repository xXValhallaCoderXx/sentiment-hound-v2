# API Endpoints & External Integrations

## Purpose of This Document

This document focuses on the minimal set of traditional API routes and external API integrations used in the web application. Most data operations use Server Actions (see `architecture.md`).

## Next.js API Routes (Minimal Usage)

### Authentication & OAuth Callbacks

- `/api/auth/[...nextauth]`: NextAuth.js authentication endpoints
  - Handles OAuth callbacks, session management, and JWT processing
  - **Implementation**: `app/api/auth/[...nextauth]/route.ts`

### Integration Management

- `/api/integrations/[id]/refresh`: OAuth token refresh for expired integrations
- `/api/integrations/[id]/revoke`: OAuth token revocation and cleanup

### System Information

- `/api/providers`: Available social media providers metadata
- `/api/providers/[name]`: Specific provider configuration details

## External API Integration Points

### Social Media APIs

**Reddit API**
- **OAuth Flow**: Custom implementation with PKCE support
- **Content Access**: Subreddit posts, comments, and search functionality
- **Rate Limiting**: Handled at service layer with retry logic

**YouTube Data API v3**
- **OAuth Flow**: Integrated with Google OAuth (same as user authentication)
- **Content Access**: Video metadata, comments, channel information
- **Quotas**: Google API quotas managed through service layer

### Machine Learning Services

**Sentiment Analysis Service** (Internal)
- **Technology**: Python FastAPI microservice
- **Communication**: HTTP requests from Server Actions
- **Models**: DistilBERT (general sentiment) and PyABSA (aspect-based)

## Data Flow Architecture

### Server Actions vs API Routes

**Primary Pattern**: Server Actions handle 95% of data operations
- Form submissions, data mutations, and business logic
- Direct integration with service layer
- Type-safe with automatic serialization

**API Routes Usage**: Limited to specific scenarios
- OAuth callbacks requiring specific response handling
- External webhook endpoints
- Third-party integrations requiring traditional REST endpoints

### Authentication Strategy

- **Server Actions**: Use `auth()` helper for session validation
- **API Routes**: Manual session handling when needed
- **External APIs**: OAuth 2.0 flows with token refresh patterns

## Integration Patterns

### Error Handling

- **Consistent Response Format**: All endpoints return structured error responses
- **OAuth Errors**: Graceful handling of expired/invalid tokens
- **Rate Limiting**: Exponential backoff for external API calls

### Security Considerations

- **CSRF Protection**: NextAuth.js provides built-in CSRF protection
- **Token Storage**: OAuth tokens encrypted in database
- **Scope Limitation**: Minimal required permissions for external APIs
