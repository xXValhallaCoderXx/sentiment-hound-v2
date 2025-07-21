# Frontend Authentication Implementation

## Purpose of This Document

This document provides detailed information about the NextAuth.js authentication implementation and frontend-specific authentication patterns used in the web application.

## NextAuth.js Configuration

### Authentication Strategy

**Hybrid Authentication System** supporting multiple login methods:

- **Google OAuth 2.0**: Primary OAuth provider with `select_account` prompt for account switching
- **Credentials Provider**: Email/password authentication with bcrypt password hashing
- **Session Strategy**: JWT sessions (required for credentials provider compatibility)
- **Database Integration**: Prisma adapter for session and account persistence

### Core Configuration Files

- **`lib/next-auth.lib.ts`**: Main NextAuth configuration, provider setup, and session handling
- **`app/api/auth/[...nextauth]/route.ts`**: NextAuth API route handler for authentication endpoints
- **`actions/auth.actions.ts`**: Server Actions for authentication operations (login, registration)
- **`actions/account.actions.ts`**: Account management operations (profile updates, account deletion)

## Authentication Flow Patterns

### User Registration & Login

**Registration Flow**:
1. User submits form → `auth.actions.ts` Server Action
2. Password hashing with bcrypt + email validation
3. User creation in database via Prisma
4. Automatic login redirect to dashboard

**Login Flow**:
1. NextAuth.js handles OAuth callbacks and credential validation
2. Session creation with JWT token signing
3. Database session persistence via Prisma adapter
4. Redirect to dashboard with session context

### Session Management

**Session Access Patterns**:
```typescript
// Server Components & Server Actions
const session = await auth();
const userId = session?.user?.id;

// Client Components (when needed)
const { data: session } = useSession();
```

**Session Validation**:
- **Server Actions**: Built-in `auth()` helper validates JWT and database session
- **Route Protection**: Layout-level checks with automatic redirect handling
- **Database Sync**: Session persistence ensures consistency across requests

## Frontend Authentication Patterns

### Route Protection Implementation

**Dashboard Layout Protection** (`app/dashboard/layout.tsx`):
```typescript
const session = await auth();
if (!session) {
  redirect("/");
}
```

**Server Action Protection Pattern**:
```typescript
export async function protectedAction(): Promise<ActionResponse<Data>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: { error: "Authentication required" } };
  }
  // Continue with authenticated logic
}
```

### User Experience Enhancements

**Logout Handling**:
- **Confirmation Modal**: `LogoutConfirmationModal` component for user confirmation
- **Graceful Logout**: `logoutUser()` Server Action with proper cleanup
- **State Management**: Loading states during logout process

**Authentication Context**:
- **Global Access**: Session available throughout app via NextAuth.js
- **Type Safety**: Strongly typed session objects with user information
- **Automatic Refresh**: JWT token refresh handled automatically

## OAuth Integration Patterns

### Google OAuth Configuration

**Provider Setup**:
- **Client Configuration**: Environment variables for OAuth credentials
- **Scope Management**: Profile information and YouTube API access when needed
- **Account Linking**: Multiple OAuth accounts can link to single user profile

**OAuth Flow Enhancement**:
- **Account Selection**: `select_account` prompt for multi-account users
- **Error Handling**: Graceful OAuth error recovery with user feedback
- **Integration Context**: OAuth tokens used for both authentication and API access

### Social Media Integration

**Dual-Purpose OAuth**:
- **User Authentication**: Google OAuth for app login
- **API Access**: Same OAuth tokens for YouTube API integration
- **Token Management**: Refresh and revocation handled through service layer

## Security Implementation

### Password Security

**Credentials Provider**:
- **Hashing**: bcrypt with salt for password storage
- **Validation**: Server-side password strength requirements
- **No Plaintext**: Passwords never stored in plaintext format

### JWT Security

**Token Configuration**:
- **Signing Secret**: `NEXTAUTH_SECRET` environment variable for JWT signing
- **Expiration**: Configurable token lifetime with automatic refresh
- **Encryption**: Session data encrypted for client-side storage

### Environment Security

**Required Environment Variables**:
```
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret  
NEXTAUTH_SECRET=your_jwt_signing_secret
NEXTAUTH_URL=your_app_base_url
```

## Error Handling & User Feedback

### Authentication Errors

**Error Scenarios**:
- Invalid credentials during login
- OAuth provider errors or cancellation  
- Session expiration during protected operations
- Network errors during authentication

**User Feedback Patterns**:
- **Toast Notifications**: Mantine notifications for auth feedback
- **Error States**: Form validation errors and network error handling
- **Recovery Actions**: Clear error messages with suggested next steps

### Graceful Degradation

**Unauthenticated Access**:
- **Public Pages**: Full access to marketing and feature pages
- **Protected Redirects**: Smooth redirect to login when authentication required
- **State Preservation**: Return to intended page after successful login
