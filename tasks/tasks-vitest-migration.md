# Tasks: Standardize Testing Framework with Vitest

## Relevant Files

### Root Level Configuration

- `package.json` - Root package.json to add Vitest as workspace dependency
- `pnpm-lock.yaml` - Will be updated when dependencies are installed
- `turbo.json` - Add test task configuration for monorepo-wide testing

### Shared Configuration Package

- `packages/vitest-config/package.json` - Package configuration for shared Vitest config
- `packages/vitest-config/tsconfig.json` - TypeScript configuration for the config package
- `packages/vitest-config/src/index.ts` - Main export file for base Vitest configuration
- `packages/vitest-config/src/base.config.ts` - Base Vitest configuration with common settings

### Frontend (Next.js) Application

- `apps/web/package.json` - Add Vitest dependencies for frontend testing
- `apps/web/vitest.config.ts` - Frontend-specific Vitest configuration extending shared config
- `apps/web/app/(landing-page)/page.test.tsx` - Sample test for landing page component

### Backend (NestJS) Application

- `apps/server/package.json` - Remove Jest dependencies and add Vitest dependencies
- `apps/server/vitest.config.ts` - Backend-specific Vitest configuration extending shared config
- `apps/server/src/app.service.test.ts` - Sample test for NestJS service

### Documentation

- `README.md` - Root README updated with testing instructions
- `apps/web/README.md` - Frontend README updated with testing instructions
- `apps/server/README.md` - Backend README updated with testing instructions

### Notes

- All configurations should extend the shared base configuration to ensure consistency
- Test files should be co-located with source files using `.test.ts` or `.test.tsx` extensions
- Run tests for individual apps with `pnpm test` from within the app directory
- Run tests for entire monorepo with `pnpm turbo test` from root
- Ensure path aliases work correctly in frontend tests

## Tasks

- [x] 1.0 Remove existing Jest configuration from backend

  - [x] 1.1 Open `apps/server/package.json` and remove all Jest-related dependencies (jest, @types/jest, ts-jest)
  - [x] 1.2 Remove any Jest configuration blocks from `apps/server/package.json`
  - [x] 1.3 Run `pnpm install` from `apps/server` to clean up dependencies
  - [x] 1.4 Verify Jest removal by running `pnpm list -r jest` from root (should return no results)

- [x] 2.0 Install Vitest at workspace root level

  - [x] 2.1 Navigate to monorepo root directory
  - [x] 2.2 Run `pnpm add -D -w vitest` to install Vitest as workspace dependency
  - [x] 2.3 Verify installation by checking that Vitest appears in root `package.json` devDependencies
  - [x] 2.4 Confirm Vitest is hoisted by checking `pnpm-lock.yaml`

- [x] 3.0 Create shared Vitest configuration package

  - [x] 3.1 Create directory `packages/vitest-config`
  - [x] 3.2 Create `packages/vitest-config/package.json` with package metadata and TypeScript dependencies
  - [x] 3.3 Create `packages/vitest-config/tsconfig.json` with appropriate TypeScript configuration
  - [x] 3.4 Create `packages/vitest-config/src` directory
  - [x] 3.5 Create `packages/vitest-config/src/base.config.ts` with base Vitest configuration (node environment, globals enabled, TypeScript support)
  - [x] 3.6 Create `packages/vitest-config/src/index.ts` that exports the base configuration
  - [x] 3.7 Add build script to package.json and configure exports field
  - [x] 3.8 Run `pnpm install` from root to register the new package

- [x] 4.0 Configure frontend (Next.js) Vitest setup

  - [x] 4.1 Navigate to `apps/web` directory
  - [x] 4.2 Add Vitest dependencies: run `pnpm add -D @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
  - [x] 4.3 Add workspace dependency: run `pnpm add -D @repo/vitest-config`
  - [x] 4.4 Create `apps/web/vitest.config.ts` that extends shared config and overrides environment to jsdom
  - [x] 4.5 Configure @vitejs/plugin-react in the Vitest config
  - [x] 4.6 Set up path alias resolution for Next.js paths (`@/components`, `@/lib`, etc.)
  - [x] 4.7 Configure transpilePackages for `@repo/database` and `@repo/services`
  - [x] 4.8 Add `"test": "vitest"` script to `apps/web/package.json`

- [x] 5.0 Configure backend (NestJS) Vitest setup

  - [x] 5.1 Navigate to `apps/server` directory
  - [x] 5.2 Add workspace dependency: run `pnpm add -D @repo/vitest-config`
  - [x] 5.3 Create `apps/server/vitest.config.ts` that extends shared config without environment overrides (uses node by default)
  - [x] 5.4 Configure TypeScript support and ensure proper module resolution
  - [x] 5.5 Add `"test": "vitest"` script to `apps/server/package.json`

- [x] 6.0 Implement sample frontend test

  - [x] 6.1 Identify the landing page component file at `apps/web/app/(landing-page)/page.tsx`
  - [x] 6.2 Create `apps/web/app/(landing-page)/page.test.tsx` in the same directory
  - [x] 6.3 Import necessary testing utilities (@testing-library/react, @testing-library/jest-dom)
  - [x] 6.4 Write a test that renders the landing page component
  - [x] 6.5 Add assertions to check that key text elements are present in the document
  - [x] 6.6 Test path alias imports (e.g., import from `@/components` if used)
  - [x] 6.7 Run `pnpm test` from `apps/web` to verify the test passes

- [x] 7.0 Implement sample backend test

  - [x] 7.1 Identify an existing service file in `apps/server/src` (e.g., `app.service.ts`)
  - [x] 7.2 Create corresponding test file `apps/server/src/app.service.test.ts`
  - [x] 7.3 Import Vitest testing utilities (describe, it, expect, vi for mocking)
  - [x] 7.4 Write a unit test that mocks dependencies if needed
  - [x] 7.5 Test a service method and assert expected output
  - [x] 7.6 Ensure the test demonstrates proper NestJS testing patterns
  - [x] 7.7 Run `pnpm test` from `apps/server` to verify the test passes

- [x] 8.0 Configure Turbo test task integration

  - [x] 8.1 Open `turbo.json` in the root directory
  - [x] 8.2 Add a new "test" task to the tasks configuration
  - [x] 8.3 Configure the test task to run across all workspaces
  - [x] 8.4 Set proper dependencies for test task (should depend on build tasks for packages)
  - [x] 8.5 Configure caching for test task outputs and inputs
  - [x] 8.6 Test the configuration by running `pnpm turbo test` from root
  - [x] 8.7 Verify that tests execute for both frontend and backend applications

- [x] 9.0 Update documentation with testing instructions

  - [x] 9.1 Open root `README.md` file
  - [x] 9.2 Add a "Testing" section with clear commands for running tests
  - [x] 9.3 Include instructions for running tests locally (`pnpm turbo test` for all, `pnpm test` for individual apps)
  - [x] 9.4 Document the testing framework choice and basic usage patterns
  - [x] 9.5 Update `apps/web/README.md` with frontend-specific testing instructions
  - [x] 9.6 Update `apps/server/README.md` with backend-specific testing instructions
  - [x] 9.7 Include examples of how to run watch mode for development

- [x] 10.0 Final validation and testing

  - [x] 10.1 Run `pnpm list -r jest` from root to confirm complete Jest removal
  - [x] 10.2 Run `pnpm turbo test` from root to verify unified test execution
  - [x] 10.3 Verify frontend test passes and demonstrates @testing-library/react integration
  - [x] 10.4 Verify backend test passes and demonstrates proper mocking capabilities
  - [x] 10.5 Test path alias resolution in frontend tests
  - [x] 10.6 Confirm environment variable handling works correctly
  - [x] 10.7 Test watch mode functionality in development environment
  - [x] 10.8 Validate that tests integrate properly with Turbo build pipeline

- [x] 11.0 Build shared packages and verify test dependencies
  - [x] 11.1 Run `pnpm turbo build` to ensure all packages build correctly
  - [x] 11.2 Verify that `@repo/vitest-config` package builds and exports correctly
  - [x] 11.3 Test that applications can import and extend the shared configuration
  - [x] 11.4 Ensure workspace dependencies resolve correctly in test environment
  - [x] 11.5 Validate that shared packages (`@repo/database`, `@repo/services`) are available in tests
