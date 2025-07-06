# PRD: Implement YouTube API Access Using API Key - DRAFT

## 1. Overview

This feature implements YouTube Data API Key integration to replace the current reliance on OAuth master tokens for the MVP "Concierge" flow. The primary goal is to resolve the "No master token available" error and enable the "Start Analysis" feature for users without personal YouTube integrations. This change transforms the fallback mechanism from OAuth-based master tokens to simpler API key authentication, making the system more robust and easier to configure while maintaining the existing Pro user OAuth flow.

## 2. Assumptions Made

- The existing `startAnalysis` server action logic structure will remain intact, only modifying the fallback token retrieval mechanism
- The Google Cloud Console project already exists and the user has access to generate API keys
- The current YouTube service architecture (`YoutubeContentService`, `YoutubeAuthService`) can accommodate both OAuth and API key authentication patterns
- Environment variable storage (`YOUTUBE_API_KEY`) is secure and follows existing patterns used for OAuth credentials
- The API key will be restricted to specific domains (localhost:3000 for development, sentimenthound.com for production) for security
- The YouTube Data API quotas and rate limits are sufficient for the expected MVP usage volume
- The existing error handling patterns in the analysis actions can accommodate the new authentication method
- Users with existing personal YouTube OAuth integrations will continue to use their personal tokens (no change to Pro user experience)
- The backend task processing system can handle both OAuth tokens and API keys in the `extraData.token` field

## 3. User Stories

**As an MVP user without YouTube integration**, I want to analyze YouTube content so that I can access sentiment analysis without setting up complex OAuth connections.

**As a Pro user with YouTube integration**, I want my personal OAuth tokens to continue working as before so that my existing workflow remains uninterrupted.

**As a system administrator**, I want to configure API access through environment variables so that I can manage authentication credentials securely.

**As a developer**, I want clear fallback logic between user tokens and API keys so that the system is resilient and predictable.

## 4. Functional Requirements

### FR1. Google Cloud Console API Key Generation

**Description:** Generate and configure a YouTube Data API key in Google Cloud Console.

**Acceptance Criteria:**

- Given access to Google Cloud Console, when navigating to "APIs & Services" > "Credentials", then the API key creation interface is accessible
- Given the API key creation form, when selecting "API key" and generating, then a new API key is created and displayed
- Given the generated API key, when configuring application restrictions, then HTTP referrer restrictions are set for localhost:3000 and sentimenthound.com
- Given the restricted API key, when testing access, then only requests from allowed domains are accepted

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

### FR4. YouTube Service API Key Support

**Description:** Modify YouTube content service to handle API key authentication alongside OAuth.

**Acceptance Criteria:**

- Given an API key token in the service call, when making YouTube API requests, then the key is appended as a URL query parameter (`&key=YOUTUBE_API_KEY`)
- Given an OAuth token in the service call, when making YouTube API requests, then the token is used in the Authorization header as before
- Given both authentication methods, when processing responses, then the same data parsing logic applies regardless of auth method
- Given API key authentication, when quota limits are exceeded, then appropriate error messages are returned

### FR5. Error Handling and Logging

**Description:** Implement comprehensive error handling for the new authentication flow.

**Acceptance Criteria:**

- Given a missing or invalid API key, when fallback logic executes, then an "AUTH_UNAVAILABLE" error is returned with appropriate messaging
- Given API quota exceeded scenarios, when requests fail, then rate limiting errors are properly categorized and logged
- Given successful API key usage, when analysis tasks are created, then debug logs indicate the authentication method used
- Given authentication fallback scenarios, when switching from OAuth to API key, then the transition is logged for debugging

## 5. Out of Scope (Non-Goals)

- Migration of existing OAuth user integrations to API key authentication
- Support for multiple API keys or key rotation
- Advanced quota management or rate limiting implementation
- Changes to the frontend analysis interface or user experience
- Modification of the Pro user OAuth flow or integration setup
- Support for other Google APIs beyond YouTube Data API
- Database schema changes or new API key management interfaces
- Webhook or real-time API key validation

## 6. Technical Considerations

**Integration Points:**

- Modification required in `apps/web/actions/analysis.actions.ts` in the token fallback logic section
- Updates needed in `packages/services/src/youtube/services/content.service.ts` to support API key parameters
- Environment variable handling follows existing patterns in the project

**Security Considerations:**

- API key must be restricted to specific domains in Google Cloud Console
- Environment variable storage should follow the project's existing security patterns
- No API key exposure in client-side code or logs

**Performance Considerations:**

- API key authentication should have minimal performance impact compared to OAuth
- YouTube Data API quota limits need monitoring during MVP usage
- Fallback logic should execute quickly to maintain user experience

**Backward Compatibility:**

- Existing OAuth integrations must continue functioning without modification
- Current error handling patterns should be preserved where possible
- No changes to database schemas or existing user data

## 7. Success Metrics

- **Resolution of "No master token available" errors**: 100% elimination of this error for users without integrations
- **Analysis success rate improvement**: Increase in successful analysis completions for MVP users by at least 90%
- **API quota efficiency**: YouTube Data API usage stays within acceptable limits during normal operations

## 8. Open Questions

1. **What is the expected daily/monthly YouTube API quota usage for the MVP?** This affects whether standard free tier limits are sufficient or if billing setup is required. It will be low, we will look into what kind of load we can support later.

2. **Should API key authentication support all the same YouTube API endpoints as OAuth?** Currently the system fetches channel data, playlists, video details, and comments - are all of these needed for API key fallback? Yes it should fetch the same data - regardless if OAuth or API method.

3. **How should API key rotation be handled in production?** While out of scope for this implementation, understanding the operational requirements helps design the integration. We will have some kind of secret manager in future.

4. **What level of logging is appropriate for API key usage?** Need to balance debugging capabilities with security considerations around key exposure. We can have minimal logs - we will do this separately later.

5. **Should there be fallback behavior if both user OAuth and API key fail?** Currently the system returns AUTH_UNAVAILABLE, but should there be additional fallback strategies. We whould just show a generic error.

6. **What are the specific YouTube Data API scopes required for API key access?** Some endpoints may require different permissions than the current OAuth implementation.

7. **How should the system handle API key quota exceeded scenarios?** Should this trigger immediate user notifications, email alerts, or silent degradation? if the changes requred are too drastic - you can stop the task and I will reasses the implementation.

8. **Are there any compliance or privacy considerations for using API keys vs OAuth for user content access?** The authentication method might affect data handling requirements. If there are any you can think of please note them somewhere
