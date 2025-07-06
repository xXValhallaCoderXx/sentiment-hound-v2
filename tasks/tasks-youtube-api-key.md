# Developer Task List: Implement YouTube API Access Using API Key

## Relevant Files

- `apps/web/.env.local` - Environment variable configuration for YouTube API key
- `apps/web/actions/analysis.actions.ts` - Server action modification for API key fallback logic
- `packages/services/src/youtube/services/content.service.ts` - YouTube content service modifications for API key support
- `packages/services/src/youtube/services/content.service.test.ts` - Unit tests for content service API key functionality
- `apps/web/actions/analysis.actions.test.ts` - Unit tests for analysis action fallback logic (currently disabled, needs re-enabling)
- `packages/services/src/youtube/youtube.types.ts` - Type definitions for authentication method detection (new file)

### Notes

- All modifications should maintain backward compatibility with existing OAuth flows
- API keys should never be exposed in client-side code or debug logs
- Follow existing error handling patterns in the codebase
- Run tests for a specific file with `pnpm test [path/to/test/file]`
- Use `pnpm turbo db:generate` if any database changes are needed (none expected)

## Tasks

- [x] 1.0 **Environment Variable Configuration Setup**

  - [x] 1.1 Add `YOUTUBE_API_KEY` environment variable to `apps/web/.env.local.example` with placeholder value
  - [x] 1.2 Document the environment variable in the project's README or environment setup documentation
  - [x] 1.3 Verify the environment variable follows the existing pattern used by `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`

- [x] 2.0 **Analysis Action Fallback Logic Modification**

  - [x] 2.1 Open `apps/web/actions/analysis.actions.ts` and locate the fallback token logic (around line 85-100)
  - [x] 2.2 Replace the `YOUTUBE_MASTER_ACCESS_TOKEN` environment variable lookup with `YOUTUBE_API_KEY`
  - [x] 2.3 Update the `masterTokenKey` variable construction to use `YOUTUBE_API_KEY` instead of `${provider.toUpperCase()}_MASTER_ACCESS_TOKEN`
  - [x] 2.4 Ensure the fallback logic maintains the same error handling when no API key is available
  - [x] 2.5 Update console.log statements to indicate "API key" instead of "master token" for clarity
  - [x] 2.6 Verify that `integrationId: 0` is still used when falling back to API key authentication
  - [x] 2.7 Test the modified logic by temporarily removing user integrations and verifying API key fallback

- [x] 3.0 **YouTube Service API Key Support Implementation**

  - [x] 3.1 Create type definitions for authentication method detection
    - [x] 3.1.1 Create new file `packages/services/src/youtube/youtube.types.ts`
    - [x] 3.1.2 Define `AuthenticationMethod` enum with `OAUTH` and `API_KEY` values
    - [x] 3.1.3 Define `YoutubeAuthConfig` interface with `method`, `token`, and optional `headers` properties
  - [x] 3.2 Modify `packages/services/src/youtube/services/content.service.ts` for API key support
    - [x] 3.2.1 Import the new type definitions from `youtube.types.ts`
    - [x] 3.2.2 Create a new private method `detectAuthenticationMethod(token: string): AuthenticationMethod`
    - [x] 3.2.3 Create a new private method `buildRequestConfig(token: string, baseUrl: string): { url: string; headers: any }`
    - [x] 3.2.4 Modify `fetchVideoDetails` method to use the new authentication logic
    - [x] 3.2.5 Modify `fetchVideoComments` method to use the new authentication logic
    - [x] 3.2.6 Modify `fetchSingleYoutubeVideo` method to use the new authentication logic
  - [x] 3.3 Implement authentication method detection logic
    - [x] 3.3.1 In `detectAuthenticationMethod`, identify OAuth tokens by length and format (typically longer, JWT-like)
    - [x] 3.3.2 In `detectAuthenticationMethod`, identify API keys by their typical Google API key format (shorter, alphanumeric)
    - [x] 3.3.3 Add fallback logic to assume API key if token format is ambiguous
  - [x] 3.4 Implement request configuration building
    - [x] 3.4.1 In `buildRequestConfig`, for OAuth tokens, return existing header-based configuration
    - [x] 3.4.2 In `buildRequestConfig`, for API keys, append `&key={api_key}` to URL and use empty headers
    - [x] 3.4.3 Ensure URL parameter appending handles existing query parameters correctly

- [x] 4.0 **Error Handling and Logging Enhancement**

  - [x] 4.1 Enhance quota exceeded error detection in YouTube content service
    - [x] 4.1.1 In `fetchVideoDetails`, check for HTTP 403 responses and parse error messages for quota indicators
    - [x] 4.1.2 In `fetchVideoComments`, add similar quota detection logic
    - [x] 4.1.3 In `fetchSingleYoutubeVideo`, add quota detection and appropriate error throwing
  - [x] 4.2 Add authentication method logging
    - [x] 4.2.1 In analysis actions, log which authentication method is being used (without exposing tokens)
    - [x] 4.2.2 In content service methods, add minimal debug logs for authentication method detection
    - [x] 4.2.3 Ensure no API keys or OAuth tokens are exposed in any log statements
  - [x] 4.3 Improve error messages for quota scenarios
    - [x] 4.3.1 Create specific error messages for quota exceeded scenarios
    - [x] 4.3.2 Update error handling to distinguish between quota issues and authentication failures
    - [x] 4.3.3 Ensure error messages are user-friendly and don't expose internal system details

- [x] 5.0 **Testing and Validation**

  - [x] 5.1 Create unit tests for authentication method detection
    - [x] 5.1.1 Create new test file `packages/services/src/youtube/services/content.service.test.ts`
    - [x] 5.1.2 Write tests for `detectAuthenticationMethod` with various token formats
    - [x] 5.1.3 Write tests for `buildRequestConfig` with both OAuth and API key inputs
    - [x] 5.1.4 Mock external API calls and verify correct URL and header construction

- [x] 6.0 **Documentation and Final Validation**
  - [x] 6.1 Update inline code documentation
    - [x] 6.1.1 Update JSDoc comments in `analysis.actions.ts` to reflect API key fallback
    - [x] 6.1.2 Add JSDoc comments to new methods in `content.service.ts`
    - [x] 6.1.3 Document the authentication method detection logic
  - [x] 6.2 Verify backward compatibility
    - [x] 6.2.1 Test that existing OAuth users experience no changes in functionality
    - [x] 6.2.2 Verify that Pro user workflows remain unaffected
    - [x] 6.2.3 Confirm that `YoutubeAuthService` and OAuth flows are untouched
  - [x] 6.3 Final system validation
    - [x] 6.3.1 Verify that "No master token available" errors are eliminated
    - [x] 6.3.2 Confirm that error messages are user-friendly and don't expose internal details
    - [x] 6.3.3 Run the full test suite to ensure no regressions
