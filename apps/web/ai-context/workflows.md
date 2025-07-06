# Common Workflows

## Adding a New Feature

1. **Database Changes** (if needed):
   ```bash
   # In packages/database/
   # Edit prisma/schema.prisma
   pnpm turbo db:generate
   pnpm turbo db:migrate
   ```

2. **Business Logic**:
   - Add service in `@repo/services`
   - Export from `packages/services/src/index.ts`

3. **Server Action**:
   - Create in `actions/feature-name.actions.ts`
   - Use `ActionResponse<T>` return type
   - Import services from `@repo/services`

4. **UI Components**:
   - Page component in `app/`
   - Feature components in `components/organisms/`
   - Form handling with Mantine + server actions

5. **Types**:
   - Add to `lib/types.ts` or `types/`
   - Import from `@repo/db` for entities

## Development Commands

```bash
# Start development (all services)
pnpm run dev

# Run web app only
cd apps/web && pnpm dev

# Type checking
pnpm turbo typecheck

# Testing
pnpm turbo test
pnpm turbo test:watch

# Database operations
pnpm turbo db:generate  # After schema changes
pnpm turbo db:migrate   # Apply migrations
pnpm turbo db:studio    # Database GUI
```

## Testing Strategy

- **Unit Tests**: For utilities and pure functions
- **Component Tests**: Using Vitest + Testing Library
- **Server Action Tests**: Mock services, test error handling
- **Smoke Tests**: End-to-end critical paths
- **Integration Tests**: Database operations with test DB

## Debugging

- **Server Actions**: Console logs appear in terminal
- **Client Components**: Browser dev tools
- **Database**: Use Prisma Studio
- **Authentication**: Check NextAuth debug logs
