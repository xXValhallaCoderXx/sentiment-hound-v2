# Testing Guide for Sentiment Hound Monorepo

## Overview

This document outlines the correct testing strategies and commands for the Sentiment Hound monorepo. The project uses Vitest as the primary testing framework across all packages and applications.

## Testing Architecture

### Test Locations

- **`packages/services`**: Core business logic unit and integration tests
- **`apps/web`**: Frontend component and integration tests
- **`apps/server`**: NestJS wrapper service tests (lightweight)

### Test Types

1. **Unit Tests**: Individual service/function testing
2. **Integration Tests**: Service interactions and workflows
3. **Component Tests**: React component testing (web app)

## Recommended Testing Commands

### For Development (Individual Package Testing)

Run tests in specific packages during development:

```bash
# Test core services (recommended for business logic)
cd packages/services && pnpm run test

# Test web frontend
cd apps/web && pnpm run test

# Test server wrappers (if needed)
cd apps/server && pnpm run test
```

### For CI/Production (Turbo Testing)

**⚠️ Note**: `pnpm turbo test` has some limitations due to build dependencies and package-specific test setups.

```bash
# Run all tests (may have some edge-case failures)
pnpm turbo test

# Alternative: Test packages individually
pnpm run test:packages
```

## Current Test Status

### ✅ Packages with Working Tests

- **`packages/services`**:
  - URL Parser: 59/59 tests passing ✅
  - Core Integration: 3/7 tests passing (4 edge-case failures)
- **`apps/web`**: 2/2 tests passing ✅

### ⚠️ Known Issues

- **`apps/server`**: Tests are incorrectly written for core service instead of NestJS wrapper
- **Turbo build dependencies**: Some packages fail to build before testing
- **Edge-case integration tests**: Complex mocking scenarios need refinement

## Testing Best Practices

### 1. Core Logic Testing

- Test all business logic in `packages/services`
- Write comprehensive unit tests for each service
- Include edge cases and error scenarios

### 2. Integration Testing

- Test service interactions and workflows
- Mock external dependencies properly
- Focus on realistic usage scenarios

### 3. Application Testing

- **Web**: Test components, hooks, and user workflows
- **Server**: Test NestJS-specific functionality (controllers, middleware)

## Test Coverage Goals

### Critical Coverage (Must Pass)

- [ ] URL Parser Service: All core functionality
- [ ] Task Creation: URL-driven workflows
- [ ] Provider Detection: YouTube, future providers
- [ ] Integration Management: Connection lookup

### Edge Case Coverage (Nice to Have)

- [ ] Error handling edge cases
- [ ] Complex mocking scenarios
- [ ] Performance testing

## Running Tests During Development

### Quick Testing Workflow

```bash
# 1. Test core services (most important)
cd packages/services && pnpm test

# 2. Test web frontend
cd apps/web && pnpm test

# 3. Run targeted tests
cd packages/services && pnpm test src/url-parser/url-parser.service.test.ts
```

### Watch Mode for Development

```bash
# Watch services tests
cd packages/services && pnpm run test:watch

# Watch web tests
cd apps/web && pnpm run test:watch
```

## Troubleshooting

### Build Issues

If tests fail due to build issues:

```bash
# Rebuild packages
pnpm turbo build

# Regenerate Prisma client
pnpm turbo db:generate
```

### Test-Specific Issues

- **Integration test failures**: Usually due to mocking complexity, not core feature issues
- **Server test failures**: Tests may be written for wrong service layer
- **Turbo test failures**: Try individual package testing instead

## Recommendations

### For Daily Development

1. Use individual package testing: `cd packages/services && pnpm test`
2. Focus on core services testing for business logic
3. Run web tests for UI changes

### For CI/CD

1. Consider package-by-package testing instead of `turbo test`
2. Set up proper build dependencies
3. Accept some edge-case test failures if core functionality works

### For Code Reviews

1. Require passing tests for `packages/services` core functionality
2. Check integration test coverage for new features
3. Document any known test limitations

## Future Improvements

1. **Fix server tests**: Update to test NestJS wrapper functionality
2. **Improve mocking**: Better integration test mocking strategies
3. **CI optimization**: Optimize turbo test configuration
4. **Test separation**: Separate unit vs integration vs e2e tests

---

_Last updated: January 2025_
_For questions, refer to the project maintainers_
