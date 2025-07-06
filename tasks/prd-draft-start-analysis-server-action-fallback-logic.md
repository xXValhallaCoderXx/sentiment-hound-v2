# PRD: Implement "Start Analysis" Server Action with Fallback Logic

**Document ID**: SH-PRD-019  
**Author**: Architect  
**Status**: Proposed  
**Date**: July 06, 2025

---

## 1. Overview

This feature implements a robust server action that intelligently initiates new post analysis tasks by selecting the appropriate authentication token through a fallback mechanism. The action will prioritize user-specific OAuth tokens from existing integrations, falling back to global master tokens when user credentials are unavailable. This creates a flexible analysis system that can operate in both authenticated user contexts and system-wide scenarios.

The primary objective is to enable seamless analysis initiation while maintaining authentication flexibility and robust error handling. The system will automatically detect the provider from submitted URLs using the existing URL parser infrastructure and intelligently route authentication through the most appropriate token source.

---

## 2. Assumptions Made

- **Authentication Context**: Assumed the server action operates within authenticated user sessions using the existing NextAuth authentication system
- **URL Parser Integration**: Assumed the action leverages the existing `urlParserService` for provider detection and URL normalization
- **Database Schema**: Assumed current `Task`, `SubTask`, and `Integration` schema structures remain unchanged
- **Environment Variables**: Assumed master tokens are stored as environment variables with the pattern `{PROVIDER}_MASTER_ACCESS_TOKEN`
- **Provider Support**: Assumed initial implementation focuses on YouTube provider with extensibility for Reddit and future providers
- **Error Response Format**: Assumed server actions return standardized `ActionResponse<T>` format with data/error structure
- **Task Creation Flow**: Assumed the action creates both Task and SubTask records following existing patterns in `taskService.createTask`
- **Integration Lookup**: Assumed one integration per provider per user constraint from existing plan limitations
- **Token Validation**: Assumed basic token presence validation without complex OAuth refresh logic in the initial implementation
- **Logging Strategy**: Assumed server actions use console logging for debugging with structured error messages

---

## 3. User Stories

**As a frontend developer**, I want to call a single server action to start analysis so that I can initiate post analysis without complex token management logic.

**As a system administrator**, I want automatic token fallback so that analysis can proceed even when users haven't connected their own accounts.

**As a product manager**, I want seamless user experience so that analysis requests don't fail due to authentication complexity.

**As a backend developer**, I want clear error messages so that I can debug token-related issues during development.

**As a QA engineer**, I want deterministic error responses so that I can test both success and failure scenarios reliably.

---

## 4. Functional Requirements

### FR1. Server Action Implementation

**Description**: Create `startAnalysis` server action in the web app actions directory
**Location**: `apps/web/actions/analysis.actions.ts`

**Acceptance Criteria**:

- Given a `postUrl` parameter, when the action is called, then it extracts the current user ID from the session
- Given an authenticated user session, when the action is called, then it uses `auth()` from NextAuth to get user context
- Given an unauthenticated session, when the action is called, then it returns an error response with "User not authenticated" message
- Given successful execution, when the action completes, then it returns `ActionResponse<{ taskId: number; status: string }>` format
- The action follows the existing server action patterns in the codebase (error handling, TypeScript types, etc.)

### FR2. Provider Detection and URL Processing

**Description**: Utilize existing URL parser service for provider identification
**Integration**: Uses `urlParserService.parse()` from `packages/services`

**Acceptance Criteria**:

- Given a valid postUrl, when `identifyProvider(postUrl)` equivalent is called, then it returns the provider name ('YOUTUBE', 'REDDIT', etc.)
- Given an invalid or unsupported URL, when provider detection fails, then the action returns an error with "Unsupported or invalid URL" message
- Given a malformed URL, when provider detection is attempted, then the action catches parsing errors and returns user-friendly messages
- The provider name returned matches exactly with database provider names ('youtube', 'reddit')
- URL normalization occurs automatically through the existing URL parser service

### FR3. Intelligent Token Selection Logic

**Description**: Implement the core fallback mechanism for authentication token selection
**Integration**: Uses `integrationsService.getUserIntegrationByName()` and environment variables

**Acceptance Criteria**:

- Given a detected provider, when checking user integrations, then the system queries for active integrations using `integrationsService.getUserIntegrationByName(userId, providerName)`
- Given an active user integration exists, when selecting tokens, then `tokenToUse = userIntegration.accessToken`
- Given no user integration exists, when falling back, then `tokenToUse = process.env.{PROVIDER}_MASTER_ACCESS_TOKEN` (e.g., `YOUTUBE_MASTER_ACCESS_TOKEN`)
- Given both user integration and master token are unavailable, when token selection fails, then return error "Analysis for this provider is not available at this time"
- The token selection logic is wrapped in try/catch blocks for robust error handling
- Logging occurs for each step: user integration found/not found, fallback to master token, final token selection result

### FR4. Task and SubTask Creation

**Description**: Create database records to initiate the analysis pipeline
**Integration**: Uses existing `taskService.createTask()` method

**Acceptance Criteria**:

- Given a valid token selection, when creating tasks, then a new Task record is created with `type: ANALYZE_POST`, `status: PENDING`, and `userId: currentUser.id`
- Given a created Task, when creating subtasks, then a SubTask record is created with `type: ANALYZE_CONTENT_SENTIMENT`, `status: PENDING`, and `taskId: createdTask.id`
- Given the SubTask creation, when populating data, then the JSON data field contains `{ "url": normalizedUrl, "token": tokenToUse }`
- Given successful database operations, when the action completes, then it returns `{ taskId: createdTask.id, status: "PENDING" }`
- Database operations are wrapped in try/catch blocks to handle write failures gracefully
- The integration follows existing patterns from `taskService.createTask()` method in the services package

### FR5. Error Handling and Response Format

**Description**: Comprehensive error handling with actionable error messages

**Acceptance Criteria**:

- Given any error condition, when returning responses, then use the existing `ActionResponse<T>` format with `{ data: null, error: ErrorObject }`
- Given unsupported URLs, when errors occur, then return `{ error: "Unsupported or invalid URL." }`
- Given authentication failures, when token issues arise, then return `{ error: "Analysis for this provider is not available at this time." }`
- Given database failures, when write operations fail, then return `{ error: "Failed to create analysis task. Please try again." }`
- All error messages are user-friendly and actionable for frontend display
- Detailed error information is logged to console for debugging while user-facing messages remain clean

---

## 5. Out of Scope (Non-Goals)

- OAuth token refresh logic - will use existing token validation from integration service
- Real-time analysis execution - only initiates the task, doesn't wait for completion
- Multi-URL batch analysis - single URL processing only
- Complex authentication flows - leverages existing NextAuth session management
- Token expiration handling - assumes tokens are valid when retrieved
- Analysis result polling - frontend will implement separate status checking
- Provider-specific API rate limiting - handled by downstream job processors
- Custom authentication schemes beyond existing OAuth integration patterns

---

## 6. Technical Considerations (Optional)

### Integration Points

- **NextAuth Session Management**: Uses existing `auth()` function for user context
- **URL Parser Service**: Leverages existing `urlParserService.parse()` for provider detection
- **Task Service**: Integrates with current `taskService.createTask()` patterns
- **Integration Service**: Uses `integrationsService.getUserIntegrationByName()` for user token lookup
- **Database Schema**: Works with existing Task/SubTask schema without modifications

### Dependencies

- **Authentication**: NextAuth session must be properly configured
- **Environment Variables**: Master tokens must be available in environment (e.g., `YOUTUBE_MASTER_ACCESS_TOKEN`)
- **Provider Database Records**: Provider records must exist in database for name matching
- **URL Parser**: Existing URL parser service must be functional for provider detection

### Performance Considerations

- Database queries are optimized through existing service layer patterns
- Token selection logic is synchronous and should complete in <100ms
- Error handling prevents cascade failures in task creation pipeline
- Logging is structured to support debugging without performance impact

---

## 7. Success Metrics

- **Token Selection Accuracy**: 100% correct token selection (user integration when available, master token as fallback)
- **Error Response Quality**: All error conditions return actionable, user-friendly messages
- **Database Integration**: Successfully creates Task and SubTask records following existing schema patterns
- **Performance**: Server action completes within 500ms for 95% of requests
- **Compatibility**: Zero breaking changes to existing authentication or task creation flows
- **Provider Support**: Successfully handles both YouTube and Reddit URL patterns (extensible architecture)

---

## 8. Open Questions

1. **Master Token Naming Convention**: Should master tokens follow `{PROVIDER}_MASTER_ACCESS_TOKEN` pattern or a different naming scheme? This sounds fine

2. **Token Validation Depth**: Should the action perform basic token presence checks or full OAuth validation before proceeding? Lets not do the check there in the action and maybe in the service / nestjs app

3. **Fallback Logging Detail**: What level of detail should be logged when falling back from user tokens to master tokens? (user privacy considerations) Just a simple log of user, time etc.

4. **Provider Extensibility**: Should the action be designed with a provider strategy pattern for future social media platforms? Yes

5. **Error Response Granularity**: Should different error types (auth vs. database vs. parsing) have distinct error codes for frontend handling? We should be able to easily distinguish, do something robust here.

6. **Integration Status Validation**: Should the action check `integration.isActive` status or assume all retrieved integrations are valid? Yes we should do check for this.

7. **SubTask Data Structure**: Are there additional fields beyond URL and token that should be included in the SubTask JSON data? I dont think so - not for current case.

8. **Rate Limiting**: Should the server action implement any rate limiting to prevent abuse of the analysis system? We can skip this for now.

9. **Audit Trail**: Should token selection decisions be logged to a separate audit table for compliance/debugging? Not yet.

10. **Master Token Security**: What security measures should be implemented for master token storage and access logging? Basic level for inital release.
