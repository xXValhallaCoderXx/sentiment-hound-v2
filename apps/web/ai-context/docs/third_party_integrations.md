# Frontend Third-Party Integration Patterns

## Purpose of This Document

This document focuses on how the frontend web application handles third-party service integrations, user experience patterns, and OAuth flows.

## Social Media Platform Integration UX

### Reddit Integration

**User Flow**:
1. **Connection**: User clicks "Connect Reddit" → OAuth initiation via Server Action
2. **Authentication**: Reddit OAuth flow with PKCE → Callback handling via NextAuth.js
3. **Management**: Integration status displayed in dashboard with connect/disconnect options
4. **Content Access**: Background job initiation for post fetching and analysis

**Frontend Implementation**:
- **Integration Cards**: Visual status indicators for connected/disconnected state
- **OAuth Buttons**: Secure OAuth initiation through Server Actions
- **Error Handling**: User-friendly error messages for OAuth failures
- **Status Monitoring**: Real-time integration health checking

### YouTube Integration  

**User Flow**:
1. **Dual Authentication**: Google OAuth serves both app login and YouTube API access
2. **Seamless Access**: No separate connection required if user logged in with Google
3. **Content Analysis**: Direct video URL analysis through analysis interface
4. **Permission Management**: Clear indication of YouTube access permissions

**Frontend Patterns**:
- **Smart Detection**: Automatic YouTube integration detection for Google users
- **Unified UX**: Single Google login provides both app access and YouTube functionality
- **Content Input**: URL-based analysis input with real-time validation

### Google OAuth Integration

**Multi-Purpose OAuth**:
- **Primary Authentication**: User login to the application
- **API Access**: YouTube Data API access for content analysis
- **Account Management**: Profile information and account linking

**User Experience**:
- **Account Selection**: `select_account` prompt for multi-account users
- **Permission Clarity**: Clear communication about data access and usage
- **Unified Dashboard**: Single integration managing both auth and API access

## Frontend Integration Management

### Integration Dashboard

**Integration Cards** (`/dashboard/integrations`):
- **Visual Status**: Connected/disconnected state with clear indicators
- **Quick Actions**: Connect, disconnect, refresh token actions
- **Usage Information**: API usage stats and rate limiting information
- **Error States**: Clear error messages with suggested resolution steps

**Management Actions**:
- **Connect Flow**: OAuth initiation with proper error handling
- **Disconnect Flow**: Token revocation with confirmation dialogs
- **Refresh Flow**: Token refresh with user feedback
- **Status Monitoring**: Real-time health checking and status updates

### OAuth Flow Enhancement

**Frontend OAuth Patterns**:
```typescript
// Server Action pattern for OAuth initiation
export async function initiateOAuthFlow(provider: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: { error: "Authentication required" } };
  }
  
  // Initiate OAuth flow with proper state management
  return await oauthService.initiateFlow(provider, session.user.id);
}
```

**User Experience Enhancements**:
- **Loading States**: Visual feedback during OAuth flows
- **Error Recovery**: Clear error messages with retry options
- **Success Feedback**: Confirmation messages after successful connection
- **State Preservation**: Return to integration page after OAuth completion

## Content Analysis Integration

### URL-Based Analysis

**Smart URL Processing**:
- **Provider Detection**: Automatic platform detection from submitted URLs
- **Validation**: Real-time URL validation with user feedback
- **Analysis Initiation**: Background job creation through Server Actions

**User Interface Patterns**:
- **URL Input**: Dedicated analysis interface with URL validation
- **Provider Icons**: Visual indicators showing detected platform
- **Progress Tracking**: Real-time analysis progress via job monitoring
- **Result Display**: Formatted analysis results with interactive elements

### Background Job Integration

**Job Management UX**:
- **Job Creation**: Frontend-initiated analysis jobs with proper authentication context
- **Status Monitoring**: Real-time job status updates via polling or websockets
- **Result Handling**: Automatic result display when jobs complete
- **Error Recovery**: Retry mechanisms for failed jobs

**Frontend Job Patterns**:
```typescript
// Analysis initiation pattern
export async function analyzeContent(url: string): Promise<ActionResponse<AnalysisResult>> {
  const session = await auth();
  const providerId = await urlParserService.getProviderFromUrl(url);
  
  const jobResult = await analysisService.createAnalysisJob({
    userId: session.user.id,
    providerId,
    url,
    analysisType: 'SENTIMENT'
  });
  
  return { data: jobResult };
}
```

## Machine Learning Service Integration

### Sentiment Analysis Service

**Frontend Consumption**:
- **Transparent Processing**: ML analysis happens in background without user interaction
- **Result Display**: Formatted sentiment results with visual indicators
- **Batch Processing**: UI support for bulk analysis operations
- **Error Handling**: Graceful handling of ML service unavailability

**Performance Patterns**:
- **Asynchronous Processing**: Non-blocking UI during analysis
- **Progressive Loading**: Skeleton states during analysis processing
- **Cached Results**: Frontend caching of analysis results for performance
- **Optimization**: Batch processing to reduce API calls

## Error Handling & User Experience

### OAuth Error Patterns

**Common Error Scenarios**:
- **User Cancellation**: Graceful handling of OAuth cancellation
- **Permission Denied**: Clear messaging about required permissions
- **Token Expiration**: Automatic refresh attempts with fallback
- **Rate Limiting**: User-friendly rate limit messages with retry timing

### Integration Health Monitoring

**Frontend Health Patterns**:
- **Status Indicators**: Visual health indicators for each integration
- **Health Checks**: Periodic background health verification
- **Degraded Performance**: UI adaptations for degraded service performance
- **Maintenance Modes**: User communication during service maintenance

### User Feedback Systems

**Notification Patterns**:
- **Success Messages**: Clear confirmation of successful operations
- **Error Notifications**: Actionable error messages with next steps
- **Progress Updates**: Real-time progress for long-running operations
- **Help Integration**: Contextual help and documentation links

## Security & Privacy Frontend Patterns

### Token Management UX

**User Control**:
- **Visibility**: Clear indication of connected accounts and permissions
- **Revocation**: Easy token revocation with confirmation dialogs
- **Refresh**: Automatic token refresh with user notification when needed
- **Audit Trail**: Integration history and activity logging

### Privacy Communication

**Transparency Patterns**:
- **Permission Requests**: Clear communication about data access needs
- **Data Usage**: Explanation of how integration data is used
- **Retention Policies**: Information about data storage and deletion
- **User Control**: Easy disconnection and data deletion options
