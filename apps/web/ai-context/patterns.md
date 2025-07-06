# Key Development Patterns

## Server Actions Pattern
**Preferred over API routes** for all data mutations:

```typescript
"use server";
import { auth } from "@/lib/next-auth.lib";
import { ActionResponse, createErrorResponse } from "@/lib/types";

export async function myAction(): Promise<ActionResponse<T>> {
  const session = await auth();
  if (!session?.user?.id) {
    return { data: null, error: createErrorResponse({...}) };
  }
  // Business logic via services
}
```

## Service Layer Integration
**Always use services from `@repo/services`**:

```typescript
import { taskService, integrationsService } from "@repo/services";

// Call service methods, never direct Prisma
const result = await taskService.createTask(userId, data);
```

## Error Handling
**Consistent error responses**:
- Use `ActionResponse<T>` type for all server actions
- Return `{ data: T, error: null }` on success
- Return `{ data: null, error: ErrorResponse }` on failure
- Use `createErrorResponse()` helper for structured errors

## Authentication Checks
**Standard auth pattern**:
```typescript
const session = await auth();
if (!session?.user?.id) {
  // Return unauthorized error
}
```

## Component Organization
- **Page Components**: In `app/` directory, handle auth & data fetching
- **Feature Components**: In `components/organisms/`, receive props
- **Reusable UI**: In `components/atoms/` and `molecules/`
- **Forms**: Use Mantine form components with server actions

## Type Safety
- Import types from `@repo/db` for database entities
- Use custom types from `lib/types.ts` for API responses
- Leverage TypeScript strict mode for maximum safety
