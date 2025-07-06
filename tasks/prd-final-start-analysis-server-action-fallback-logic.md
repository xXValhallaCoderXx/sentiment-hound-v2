# PRD: Implement "Start Analysis" Server Action with Fallback Logic

**Document ID**: SH-PRD-019  
**Author**: Principal Software Engineer  
**Status**: Final  
**Date**: July 6, 2025

---

## 1. Overview

This feature implements a robust server action that intelligently initiates new post analysis tasks by selecting the appropriate authentication token through a fallback mechanism. The action will prioritize user-specific OAuth tokens from existing integrations, falling back to global master tokens when user credentials are unavailable. This creates a flexible analysis system that can operate in both authenticated user contexts and system-wide scenarios.

The primary objective is to enable seamless analysis initiation while maintaining authentication flexibility and robust error handling. The system will automatically detect the provider from submitted URLs using the existing URL parser infrastructure and intelligently route authentication through the most appropriate token source.

---

## 2. User Stories

**As a frontend developer**, I want to call a single server action to start analysis so that I can initiate post analysis without complex token management logic.

**As a system administrator**, I want automatic token fallback so that analysis can proceed even when users haven't connected their own accounts.

**As a product manager**, I want seamless user experience so that analysis requests don't fail due to authentication complexity.

**As a backend developer**, I want clear error messages so that I can debug token-related issues during development.

**As a QA engineer**, I want deterministic error responses so that I can test both success and failure scenarios reliably.

---

## 3. Functional Requirements

### FR1. Server Action Implementation

**Description**: Create `startAnalysis` server action in the web app actions directory
**Location**: `apps/web/actions/analysis.actions.ts`

**Acceptance Criteria**:

- Given a `postUrl` parameter, when the action is called, then it extracts the current user ID from the session using `auth()` from NextAuth
- Given an authenticated user session, when the action is called, then it validates the session and extracts user context
- Given an unauthenticated session, when the action is called, then it returns `ActionResponse<null>` with error "User not authenticated"
- Given successful execution, when the action completes, then it returns `ActionResponse<{ taskId: number; status: string }>` format
- The action follows existing server action patterns with proper TypeScript types and error handling using `createErrorResponse()`

### FR2. Provider Detection and URL Processing

**Description**: Utilize existing URL parser service for provider identification
**Integration**: Uses `urlParserService.parse()` from `packages/services`

**Acceptance Criteria**:

- Given a valid postUrl, when provider detection is performed, then it uses `urlParserService.parse(postUrl)` to return the provider name
- Given an invalid or unsupported URL, when provider detection fails, then the action returns `ActionResponse<null>` with error "Unsupported or invalid URL"
- Given a malformed URL, when provider detection is attempted, then the action catches parsing errors and returns user-friendly messages
- The provider name returned matches exactly with database provider names ('youtube', 'reddit')
- URL normalization occurs automatically through the existing URL parser service

### FR3. Intelligent Token Selection Logic

**Description**: Implement the core fallback mechanism for authentication token selection
**Integration**: Uses `integrationsService.getUserIntegrationByName()` and environment variables

**Acceptance Criteria**:

- Given a detected provider, when checking user integrations, then the system queries for active integrations using `integrationsService.getUserIntegrationByName(userId, providerName)`
- Given an active user integration exists with `isActive: true`, when selecting tokens, then `tokenToUse = userIntegration.accessToken`
- Given no user integration exists or integration is inactive, when falling back, then `tokenToUse = process.env.YOUTUBE_MASTER_ACCESS_TOKEN` (using confirmed master token naming)
- Given both user integration and master token are unavailable, when token selection fails, then return error "Analysis for this provider is not available at this time"
- The token selection logic is wrapped in try/catch blocks for robust error handling
- Logging occurs for each step: "User integration found/not found for user {userId}", "Fallback to master token", "Token selection: {user|master}"

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
- Given integration status validation failures, when checking `isActive`, then return `{ error: "Integration is inactive. Please reconnect your account." }`
- All error messages are user-friendly and actionable for frontend display
- Error codes are distinguishable: URL_INVALID, AUTH_UNAVAILABLE, INTEGRATION_INACTIVE, DATABASE_ERROR for robust frontend handling

---

## 4. Out of Scope (Non-Goals)

- OAuth token refresh logic - will use existing token validation from integration service
- Real-time analysis execution - only initiates the task, doesn't wait for completion
- Multi-URL batch analysis - single URL processing only
- Complex authentication flows - leverages existing NextAuth session management
- Token expiration handling - assumes tokens are valid when retrieved
- Analysis result polling - frontend will implement separate status checking
- Provider-specific API rate limiting - handled by downstream job processors
- Custom authentication schemes beyond existing OAuth integration patterns

---

## 5. Technical Considerations

### Integration Points

- **NextAuth Session Management**: Uses existing `auth()` function for user context validation
- **URL Parser Service**: Leverages existing `urlParserService.parse()` for provider detection and URL normalization
- **Task Service**: Integrates with current `taskService.createTask()` patterns for database operations
- **Integration Service**: Uses `integrationsService.getUserIntegrationByName()` for user token lookup with `isActive` validation
- **Database Schema**: Works with existing Task/SubTask schema without modifications using current Prisma patterns

### Dependencies

- **Authentication**: NextAuth session must be properly configured and functional
- **Environment Variables**: Master tokens must be available using confirmed naming pattern: `YOUTUBE_MASTER_ACCESS_TOKEN`, `REDDIT_MASTER_ACCESS_TOKEN`
- **Provider Database Records**: Provider records must exist in database for name matching ('youtube', 'reddit')
- **URL Parser**: Existing URL parser service must be functional for provider detection
- **Integration Status**: Integration lookup includes `isActive` field validation as confirmed in codebase

### Performance Considerations

- Database queries are optimized through existing service layer patterns using Prisma
- Token selection logic is synchronous and should complete in <100ms
- Error handling prevents cascade failures in task creation pipeline
- Structured logging supports debugging without performance impact

### Provider Extensibility Strategy

- Server action designed with provider strategy pattern for future social media platforms
- Token selection logic uses dynamic environment variable naming: `{PROVIDER}_MASTER_ACCESS_TOKEN`
- Provider detection leverages URL parser service extensibility
- Error handling is provider-agnostic and scales with new integrations

### Error Response Granularity

- **URL_INVALID**: "Unsupported or invalid URL"
- **AUTH_UNAVAILABLE**: "Analysis for this provider is not available at this time"
- **INTEGRATION_INACTIVE**: "Integration is inactive. Please reconnect your account"
- **DATABASE_ERROR**: "Failed to create analysis task. Please try again"
- Each error type enables specific frontend handling and user guidance

### Integration Status Validation

- All integration lookups validate `isActive: true` before token usage
- Inactive integrations trigger fallback to master tokens
- Integration status errors provide actionable guidance for user account management

### Master Token Security

- Basic level security for initial release with environment variable storage
- Access logging through structured console logging with user ID and timestamp
- No additional audit trail or encryption in initial implementation

---

## 6. Success Metrics

- **Token Selection Accuracy**: 100% correct token selection (user integration when available and active, master token as fallback)
- **Error Response Quality**: All error conditions return actionable, user-friendly messages with appropriate error codes
- **Database Integration**: Successfully creates Task and SubTask records following existing schema patterns
- **Performance**: Server action completes within 500ms for 95% of requests
- **Compatibility**: Zero breaking changes to existing authentication or task creation flows
- **Provider Support**: Successfully handles both YouTube and Reddit URL patterns with extensible architecture
- **Integration Validation**: 100% accuracy in validating integration active status before token usage

---
