# Frontend Database Interaction Patterns

## Purpose of This Document

This document explains how the frontend web application interacts with the database through Server Actions and the patterns used for data management from the UI perspective.

## Database Access Strategy

### Server Actions as Data Layer

The frontend exclusively accesses the database through **Server Actions**, never directly:

```typescript
// Pattern: Server Action → Service → Prisma → Database
export async function getUserProfile(): Promise<ActionResponse<UserProfile>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: { error: "Authentication required" } };
  }
  
  const userService = new UserService();
  const profile = await userService.getUserProfile(session.user.id);
  return { data: profile };
}
```

### Data Flow Architecture

1. **UI Components** → trigger Server Actions
2. **Server Actions** → validate authentication & call Services
3. **Services** → use Prisma client from `@repo/db`
4. **Database** → PostgreSQL with full type safety

## Frontend-Relevant Entity Patterns

### User-Centric Data Access

**User Profile Management**:
- **Session Integration**: User data accessed via NextAuth.js session
- **Profile Updates**: Form submissions through Server Actions
- **Plan Information**: Subscription status and feature limits
- **Usage Tracking**: Token consumption and billing information

**User Data Queries**:
```typescript
// Common pattern in Server Actions
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  include: {
    plan: true,
    integrations: true,
    trackedKeywords: true
  }
});
```

### Integration Management

**Social Media Connections**:
- **Integration Status**: Connected/disconnected state for UI
- **OAuth Tokens**: Secure token storage with encryption
- **Provider Information**: Platform-specific metadata and configuration
- **Health Monitoring**: Integration health status for dashboard display

**Frontend Integration Patterns**:
- **Connection Cards**: Visual representation of integration status
- **OAuth Flows**: Database persistence of OAuth results
- **Token Refresh**: Background token refresh with UI status updates
- **Disconnection**: Graceful token cleanup and database updates

### Content & Analysis Data

**Posts and Analysis Results**:
- **Content Display**: Fetched posts displayed in dashboard tables
- **Analysis Results**: Sentiment analysis data with visual indicators
- **Progress Tracking**: Real-time job status updates via database polling
- **Historical Data**: Analysis history and trends for user insights

**Data Presentation Patterns**:
```typescript
// Server Action for dashboard data
export async function getDashboardPosts(userId: string) {
  const posts = await prisma.post.findMany({
    where: { 
      mentions: { 
        some: { 
          userId: userId 
        } 
      } 
    },
    include: {
      mentions: {
        include: {
          aspectAnalyses: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  
  return posts;
}
```

## Real-Time Data Patterns

### Background Job Monitoring

**Job Status Updates**:
- **Polling Strategy**: Frontend polls job status via Server Actions
- **Status Display**: Real-time progress indicators in UI
- **Completion Handling**: Automatic result display when jobs complete
- **Error Recovery**: User-friendly error handling with retry options

**Job Management UI Patterns**:
- **Job Queue Display**: List of user's background jobs with status
- **Progress Indicators**: Visual progress bars and status badges
- **Result Navigation**: Links to analysis results when jobs complete
- **History Tracking**: Historical job data for user reference

### Data Synchronization

**Cache Invalidation**:
```typescript
// Server Action pattern with cache invalidation
export async function createAnalysisJob(data: AnalysisData) {
  const result = await analysisService.createJob(data);
  
  // Invalidate relevant cache paths
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/jobs');
  
  return { data: result };
}
```

**Data Freshness**:
- **revalidatePath()**: Cache invalidation after data mutations
- **Optimistic Updates**: UI updates before database confirmation
- **Stale Data Handling**: Graceful handling of stale data scenarios

## Error Handling & User Experience

### Database Error Patterns

**Error Scenarios**:
- Database connection failures
- Constraint violations (unique email, etc.)
- Transaction failures during complex operations
- Foreign key constraint errors

**Frontend Error Handling**:
```typescript
export async function updateUserProfile(data: ProfileData): Promise<ActionResponse<User>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: { error: "Authentication required" } };
    }
    
    const updatedUser = await userService.updateProfile(session.user.id, data);
    revalidatePath('/dashboard/profile');
    
    return { data: updatedUser };
  } catch (error) {
    if (error instanceof PrismaKnownRequestError) {
      return { error: { error: "Profile update failed. Please try again." } };
    }
    return { error: { error: "An unexpected error occurred." } };
  }
}
```

### Data Validation

**Frontend Validation Strategy**:
- **Client-Side**: Mantine form validation for immediate feedback
- **Server-Side**: Validation in Server Actions before database operations
- **Database Level**: Prisma schema constraints as final validation layer

## Performance Optimization

### Efficient Data Fetching

**Selective Includes**:
- Only fetch required related data for specific UI components
- Use Prisma's `select` and `include` strategically
- Avoid N+1 queries through proper relation loading

**Pagination Patterns**:
```typescript
export async function getPaginatedPosts(page: number, limit: number) {
  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: {
      mentions: {
        select: {
          sentiment: true,
          createdAt: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return posts;
}
```

### Data Caching

**Next.js Caching Integration**:
- Server Actions automatically cached by Next.js
- Manual cache invalidation via `revalidatePath()`
- Strategic caching of expensive queries
- Background revalidation for better user experience

## Type Safety & Developer Experience

### End-to-End Type Safety

**Database → Frontend Pipeline**:
1. **Prisma Schema** → generates TypeScript types
2. **Service Layer** → uses generated types for business logic
3. **Server Actions** → return strongly typed `ActionResponse<T>`
4. **UI Components** → consume typed data with full IntelliSense

**Type-Safe Patterns**:
```typescript
// Full type safety from database to UI
interface DashboardData {
  user: User & { plan: Plan };
  recentPosts: (Post & { mentions: Mention[] })[];
  integrationCount: number;
  analysisCount: number;
}

export async function getDashboardData(): Promise<ActionResponse<DashboardData>> {
  // Implementation with full type safety
}
```
