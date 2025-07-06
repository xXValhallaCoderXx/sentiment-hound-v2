# PRD: Implement YouTube API Access Using API Key

## 1. Overview

This feature implements YouTube Data API Key integration to replace the current reliance on OAuth master tokens for the MVP "Concierge" flow. The primary goal is to resolve the "No master token available" error and enable the "Start Analysis" feature for users without personal YouTube integrations. This change transforms the fallback mechanism from OAuth-based master tokens to simpler API key authentication, making the system more robust and easier to configure while maintaining the existing Pro user OAuth flow.

## 2. User Stories

**As an MVP user without YouTube integration**, I want to analyze YouTube content so that I can access sentiment analysis without setting up complex OAuth connections.

**As a Pro user with YouTube integration**, I want my personal OAuth tokens to continue working as before so that my existing workflow remains uninterrupted.

**As a system administrator**, I want to configure API access through environment variables so that I can manage authentication credentials securely.

**As a developer**, I want clear fallback logic between user tokens and API keys so that the system is resilient and predictable.

## 3. Functional Requirements

### FR1. Google Cloud Console API Key Generation

**Description:** Generate and configure a YouTube Data API key in Google Cloud Console.

**Acceptance Criteria:**

- Given access to Google Cloud Console, when navigating to "APIs & Services" > "Credentials", then the API key creation interface is accessible
- Given the API key creation form, when selecting "API key" and generating, then a new API key is created and displayed
- Given the generated API key, when configuring application restrictions, then HTTP referrer restrictions are set for localhost:3000 and sentimenthound.com
- Given the restricted API key, when testing access, then only requests from allowed domains are accepted
- Given the API key configuration, when enabling YouTube Data API v3, then the key has access to required endpoints

### FR2. Environment Variable Configuration

**Description:** Store the API key securely in environment variables.

**Acceptance Criteria:**

- Given the generated API key, when added to `.env.local` as `YOUTUBE_API_KEY`, then the application can access the key at runtime
- Given the environment configuration, when the application starts, then the API key is loaded and available to the backend services
- Given invalid or missing API key configuration, when the fallback logic executes, then appropriate error handling prevents application crashes

### FR3. Analysis Action Fallback Logic Modification

**Description:** Update the `startAnalysis` server action to use API key fallback instead of OAuth master tokens.

**Acceptance Criteria:**

- Given a user without YouTube integration, when initiating analysis, then the system reads `process.env.YOUTUBE_API_KEY` for fallback authentication
- Given a user with active YouTube integration, when initiating analysis, then their personal OAuth token continues to be used (no change)
- Given an inactive user integration, when initiating analysis, then the system falls back to the API key
- Given a successful API key fallback, when creating the analysis task, then `integrationId: 0` is used and the API key is stored in `extraData.token`
- Given both user OAuth and API key fail, when initiating analysis, then an "AUTH_UNAVAILABLE" error is returned with generic messaging

### FR4. YouTube Service API Key Support

**Description:** Modify YouTube content service to handle API key authentication alongside OAuth.

**Acceptance Criteria:**

- Given an API key token in the service call, when making YouTube API requests, then the key is appended as a URL query parameter (`&key=YOUTUBE_API_KEY`)
- Given an OAuth token in the service call, when making YouTube API requests, then the token is used in the Authorization header as before
- Given both authentication methods, when processing responses, then the same data parsing logic applies regardless of auth method
- Given API key authentication, when accessing single video data, then the same video details and comments are fetched as OAuth flow
- Given API key authentication, when quota limits are exceeded, then appropriate error messages are returned without exposing the key

### FR5. Error Handling and Logging

**Description:** Implement comprehensive error handling for the new authentication flow.

**Acceptance Criteria:**

- Given a missing or invalid API key, when fallback logic executes, then an "AUTH_UNAVAILABLE" error is returned with appropriate messaging
- Given API quota exceeded scenarios, when requests fail, then rate limiting errors are properly categorized and logged
- Given successful API key usage, when analysis tasks are created, then minimal debug logs indicate the authentication method used
- Given authentication fallback scenarios, when switching from OAuth to API key, then the transition is logged for debugging without exposing credentials

## 4. Out of Scope (Non-Goals)

- Migration of existing OAuth user integrations to API key authentication
- Support for multiple API keys or key rotation mechanisms
- Advanced quota management or rate limiting implementation beyond basic error handling
- Changes to the frontend analysis interface or user experience
- Modification of the Pro user OAuth flow or integration setup
- Support for user-specific content access (channel playlists, private videos)
- Database schema changes or new API key management interfaces
- Webhook or real-time API key validation
- Comprehensive quota monitoring or alerting systems

## 5. Technical Considerations

**Integration Points:**

- Modification required in `apps/web/actions/analysis.actions.ts` to change the fallback token environment variable from `YOUTUBE_MASTER_ACCESS_TOKEN` to `YOUTUBE_API_KEY`
- Updates needed in `packages/services/src/youtube/services/content.service.ts` to support API key URL parameters alongside existing OAuth Authorization headers
- Environment variable handling follows existing patterns (`process.env.AUTH_GOOGLE_ID`, `process.env.AUTH_GOOGLE_SECRET`)

**API Compatibility Analysis:**

Based on codebase analysis, the current system uses these YouTube Data API endpoints:

- `/youtube/v3/videos` (statistics, snippet) - **Compatible with API key**
- `/youtube/v3/commentThreads` - **Compatible with API key**
- `/youtube/v3/channels?mine=true` - **Requires OAuth, incompatible with API key**
- `/youtube/v3/playlistItems` - **Compatible with API key for public playlists**

**Implementation Strategy:**

Since the analysis action uses `fetchSingleYoutubeVideo()` method which only accesses public video data and comments, API key authentication will work for the primary use case. The `fetchAllYoutubePosts()` method that requires OAuth will remain unchanged for Pro users.

**Authentication Detection Logic:**

The system will differentiate between OAuth tokens and API keys by implementing token type detection in the content service:

- OAuth tokens: Use existing `Authorization: Bearer {token}` header pattern
- API keys: Append `&key={api_key}` to request URLs

**Security Considerations:**

- API key must be restricted to specific domains in Google Cloud Console (localhost:3000, sentimenthound.com)
- Environment variable storage follows the project's existing security patterns (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)
- No API key exposure in client-side code or debug logs
- API key provides access only to public YouTube content, maintaining privacy compliance

**Performance Considerations:**

- API key authentication has minimal performance impact compared to OAuth
- YouTube Data API quota monitoring will be implemented through existing error handling patterns
- Fallback logic executes quickly by checking environment variables synchronously

**Backward Compatibility:**

- Existing OAuth integrations continue functioning without modification
- Current error handling patterns preserved with enhanced quota error detection
- No changes to database schemas or existing user data
- Existing `YoutubeAuthService` and OAuth flows remain untouched

**Privacy and Compliance Considerations:**

- API key access is limited to public content only (videos, comments, statistics)
- No access to user-specific data, private content, or personal information
- Maintains compliance with existing privacy standards as API keys provide less access than OAuth
- Data processing patterns remain identical regardless of authentication method

## 6. Success Metrics

- **Resolution of "No master token available" errors**: 100% elimination of this error for users without integrations
- **Analysis success rate improvement**: Increase in successful analysis completions for MVP users by at least 90%
- **API quota efficiency**: YouTube Data API usage stays within acceptable limits during normal operations
- **Error handling effectiveness**: Quota exceeded scenarios handled gracefully with appropriate user messaging
