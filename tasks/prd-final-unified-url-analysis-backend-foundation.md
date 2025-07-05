# PRD: Unified URL Analysis Backend Foundation

**Feature: URL-Driven Analysis Task Creation**

**Phase**: 1 - Backend Foundation  
**Priority**: High  
**Status**: In Development  
**Date**: July 6, 2025

---

## 1. Overview

This feature refactors the sentiment analysis platform's task creation system from a frontend-driven provider selection model to an intelligent URL-driven approach. Currently, users must manually select a provider (YouTube, Reddit) before submitting a URL for analysis, creating tight coupling between the UI and backend logic.

The goal is to create a provider-agnostic backend foundation that automatically detects the source provider from the submitted URL and routes the analysis task accordingly. This will enable future frontend improvements like a unified "analyze anything" input field while improving system scalability for new providers.

The primary objective is to shift provider detection logic from the frontend to a dedicated backend service, establishing a scalable pattern for supporting additional social media platforms.

---

## 2. User Stories

**As a backend developer**, I want a centralized URL parsing service so that I can easily add support for new social media providers without modifying multiple files.

**As a system administrator**, I want provider detection to happen automatically based on URLs so that task routing is consistent and reliable across all entry points.

**As a product manager**, I want URL-driven task creation so that we can build flexible frontend experiences without being constrained by provider-specific workflows.

**As a QA engineer**, I want clear error messages when URLs are invalid or unsupported so that I can verify the system handles edge cases gracefully.

**As a DevOps engineer**, I want the URL parsing logic to be fast and reliable so that it doesn't introduce performance bottlenecks in the task creation pipeline.

---

## 3. Functional Requirements

### FR1. URL Parser Service Creation

**Description**: Create a dedicated service to identify providers from URLs
**Location**: `packages/services/src/url-parser/url-parser.service.ts`

**Acceptance Criteria**:

- Given a valid YouTube URL (any supported format), when `parse(url)` is called, then it returns `{ provider: 'YOUTUBE', url: '<normalized_url>' }`
- Given an invalid or unsupported URL, when `parse(url)` is called, then it throws a specific error (`UnsupportedProviderError` or `InvalidUrlError`)
- Given a malformed URL string, when `parse(url)` is called, then it throws an `InvalidUrlError` with descriptive message
- Given a YouTube URL with extra parameters, when `parse(url)` is called, then it returns a normalized URL with tracking parameters extracted and returned in metadata
- The service must support these YouTube URL patterns: `youtu.be/watch?v={id}`, `youtube.com/watch?v={id}`, `m.youtube.com/watch?v={id}`, `youtu.be/{id}`
- URLs must pass basic validation (valid URL format, acceptable length limits)
- Error classes (`UnsupportedProviderError`, `InvalidUrlError`) include human-readable error messages
- Provider names returned exactly match the database provider names ('youtube', 'reddit')

### FR2. Task Service Provider-Agnostic Refactoring

**Description**: Modify task creation logic to use URL parsing instead of frontend-provided integration selection
**Location**: `packages/services/src/tasks/tasks.service.ts`

**Acceptance Criteria**:

- Given a task creation request with extraData containing a URL, when `createTask()` is called, then the UrlParser service is invoked to determine the provider
- Given successful URL parsing returning 'YOUTUBE', when creating subtasks, then `FETCH_INDIVIDUAL_POST_CONTNENT` and `ANALYZE_CONTENT_SENTIMENT` subtasks are created
- Given failed URL parsing but an integrationId is provided, when `createTask()` is called, then the system falls back to the original integration-based approach
- Given failed URL parsing with no integrationId fallback, when `createTask()` is called, then the main Task is marked as FAILED with error message from URL parser
- Given a YouTube URL in extraData, when subtasks are created, then the normalized URL is passed in the subtask data for the fetch processor
- The existing `if (integration?.provider.name === "youtube")` logic is replaced with URL parsing logic while maintaining the same subtask creation patterns

### FR3. Integration Lookup Enhancement

**Description**: Maintain integration authentication while supporting URL-driven workflows
**Location**: `packages/services/src/tasks/tasks.service.ts`

**Acceptance Criteria**:

- Given a parsed provider result, when creating tasks, then the system finds the user's active integration for that provider type using the existing `findByUserIdAndProviderName` method
- Given no valid integration exists for the detected provider, when creating a task, then the task is marked as FAILED with message "No integration found for {provider}"
- Given the user has only one integration per provider (system constraint), when creating a task, then that integration is automatically selected
- The integration lookup occurs after URL parsing but before subtask creation
- All existing plan limit validation for integrations remains functional

### FR4. Error Handling and Logging

**Description**: Implement comprehensive error handling for the new URL-driven workflow

**Acceptance Criteria**:

- Given any URL parsing failure, when logged, then the error includes the original URL (logged in full) and the parsed result for debugging
- Given task creation with URL parsing, when errors occur, then logs include the user ID, attempted URL, and detected provider (if any)
- Given URL parsing success, when creating tasks, then logs include "URL parsed successfully: {provider} detected for user {userId}"
- Given URL parsing failure with integrationId fallback, when logged, then the system logs both the parsing failure and successful fallback
- All existing error handling for task creation remains functional
- Error responses include actionable information for frontend display

---

## 4. Out of Scope (Non-Goals)

- **Reddit URL Support**: Recognition and parsing of Reddit URLs is explicitly deferred to Phase 2
- **Frontend UI Changes**: No modifications to the current frontend forms, components, or user interfaces
- **Database Schema Changes**: No new tables, columns, or modifications to existing database structure
- **Queue Processing Logic**: No changes to the underlying job queue system or polling mechanisms
- **OAuth Integration Flow**: No modifications to the authentication or authorization processes
- **Performance Optimization**: No focus on optimizing existing YouTube API calls or data processing speed
- **URL Content Validation**: The system will not verify if URLs point to existing, accessible content
- **Provider Configuration**: No dynamic provider registration or configuration management
- **Rate Limiting**: No additional rate limiting or throttling for URL parsing operations
- **Caching Strategy**: URL parsing results will not be cached in this phase

---

## 5. Technical Considerations

### Integration Points

- The UrlParser service should be imported and used in `packages/services/src/tasks/tasks.service.ts`
- Error classes (`UnsupportedProviderError`, `InvalidUrlError`) should be defined in the url-parser module
- The service should follow the existing singleton pattern used by other services in the platform
- Provider name mapping uses the existing provider name standards from the database

### Dependencies

- No new external dependencies required - uses built-in JavaScript regex and string manipulation
- Maintains existing dependencies on `@repo/db` for database access
- Continues to use existing `integrationsService` for provider authentication lookups
- Leverages existing provider name mapping via shared types

### Migration Strategy

- Changes are additive and backward-compatible with existing task creation flows
- URL parsing logic supports fallback to current integration-based approach when parsing fails
- Existing tasks and historical data remain unaffected
- The current `integration?.provider.name === "youtube"` pattern can be gradually replaced

### Performance Considerations

- URL parsing operations should complete in <10ms for typical URLs
- Regex patterns should be optimized to avoid catastrophic backtracking
- Service should be stateless to support concurrent usage across multiple task creation requests
- URL length validation prevents performance issues with extremely long URLs

### Duplicate Handling

- The system will allow duplicate URL analyses (no deduplication logic in this phase)
- Future phases may implement time-based duplicate detection

### Error Response Format

Error responses will include:

- Human-readable error messages
- Error codes for programmatic handling
- Original URL (for debugging)
- Suggested actions where applicable

---

## 6. Success Metrics

1. **Functional Validation**: 100% of supported YouTube URL formats are correctly identified and normalized by the UrlParser service
2. **Error Handling**: Invalid and unsupported URLs result in clear, actionable error messages without system crashes
3. **End-to-End Workflow**: YouTube URLs submitted through the existing task creation flow complete successfully from parsing through sentiment analysis
4. **Code Quality**: Unit test coverage of ≥90% for the UrlParser service including edge cases and error scenarios
5. **Performance**: URL parsing operations complete within 10ms for 95% of requests
6. **Integration**: Zero regressions in existing YouTube analysis workflows after implementation
7. **Fallback Functionality**: When URL parsing fails but integrationId is provided, the system successfully falls back to existing logic 100% of the time

---

## 7. Implementation Notes

### URL Normalization

URLs will be normalized by removing tracking parameters while preserving essential video identification parameters. Extracted metadata (like timestamps) will be returned separately for potential future use.

### Provider Name Mapping

The UrlParser service will return provider names that exactly match the database provider names. The existing shared provider types ensure consistency across the platform.

### Integration Selection

Since the system enforces one integration per provider per user through plan limits, integration selection is deterministic and does not require configuration.

### Logging Strategy

All URLs and parsing results will be logged in full for debugging purposes, including both successful parses and failures. Sensitive parameter extraction ensures no sensitive data is accidentally logged.

### Testing Environment Support

The UrlParser service will validate URLs for proper format but will accept any validly formatted URL, including localhost and testing domains, to support development workflows.

### Flexibility and Future Expansion

The URL parsing architecture is designed to easily accommodate additional providers in future phases. The service pattern and error handling can be extended without modifying existing code.
