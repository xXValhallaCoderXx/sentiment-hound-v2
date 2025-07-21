# Frontend Service Integration

## Purpose of This Document

This document explains how the Next.js web application integrates with the shared business logic from `@repo/services` and handles frontend-specific service patterns.

## Service Layer Integration

### Server Actions as Service Consumers

The frontend primarily consumes services through **Server Actions**, which act as the bridge between UI components and business logic:

```typescript
// Example pattern from actions/dashboard.actions.ts
export async function getDashboardData(): Promise<ActionResponse<DashboardData>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: { error: "Authentication required" } };
  }
  
  const data = await dashboardService.getUserDashboard(session.user.id);
  return { data };
}
```

### Key Service Categories Used by Frontend

#### User & Authentication Services
- **Server Actions Integration**: `auth.actions.ts` consumes user and authentication services
- **Profile Management**: User profile updates and account operations via Server Actions
- **Plan Usage**: Token usage tracking and subscription management

#### Content Analysis Services  
- **Analysis Workflows**: `analysis.actions.ts` orchestrates post analysis via services
- **Provider Resolution**: URL parsing services determine platform context
- **Background Job Creation**: Frontend-initiated jobs include authentication metadata

#### Social Media Integration Services
- **OAuth Management**: Integration connection/disconnection through Server Actions
- **Content Fetching**: Services handle API calls while frontend manages user experience
- **Error Handling**: Service-level errors propagated through Action response patterns

### Frontend-Specific Service Patterns

#### Authentication Context Passing
Server Actions enhance service calls with user authentication context:

```typescript
// Pattern: Frontend determines context, services handle business logic
const providerId = await urlParserService.getProviderFromUrl(url);
const result = await analysisService.createAnalysisTask({
  userId: session.user.id,
  providerId,
  url
});
```

#### Error Boundary Integration
Service errors are transformed into user-friendly frontend responses:

- **Service Exceptions**: Caught and converted to `ActionResponse` error format
- **User Feedback**: Error messages displayed via Mantine notifications
- **Graceful Degradation**: UI handles service unavailability scenarios

#### Background Job Orchestration
Frontend Server Actions initiate background processing via services:

- **Job Creation**: Frontend determines user context, services handle job logic
- **Queue Integration**: Tasks queued through service layer for NestJS processing  
- **Status Monitoring**: Real-time job status updates via dashboard interfaces

## Service Design Principles for Frontend

### Type Safety & Consistency
- **Shared Types**: Service interfaces ensure type safety across frontend/backend
- **Response Patterns**: Consistent `ActionResponse<T>` format for all frontend service calls
- **Error Handling**: Standardized error propagation from services to UI

### Performance Optimization
- **Caching Integration**: Services include caching strategies consumed by frontend
- **Lazy Loading**: Service calls optimized for progressive data loading
- **Background Processing**: CPU-intensive operations delegated to service layer

### User Experience Focus
- **Optimistic Updates**: Frontend patterns for immediate user feedback
- **Progressive Enhancement**: Service calls work with/without JavaScript
- **Error Recovery**: User-friendly error states and retry mechanisms

## Integration with External Services

### OAuth Flow Management
- **Frontend Initiation**: User clicks connect button → Server Action → OAuth service
- **Callback Handling**: NextAuth.js → Service layer → Database persistence
- **Token Management**: Services handle refresh/revocation, frontend shows status

### Analysis Pipeline
- **User Input**: Frontend collects URL/content → Server Action validation
- **Service Orchestration**: Services coordinate between multiple external APIs
- **Result Processing**: Frontend displays service-processed analysis results

### Real-time Updates
- **Background Jobs**: Services process in background, frontend polls for updates
- **Status Indicators**: UI components reflect service-layer job statuses
- **Completion Handling**: Services trigger UI updates via database changes
