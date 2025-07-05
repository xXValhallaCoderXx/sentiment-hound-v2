# PRD: Standardize Testing Framework with Vitest

**Feature:** Migrate and standardize the monorepo's testing framework to Vitest  
**Priority:** High  
**Status:** To Do  
**Date:** July 5, 2025

## 1. Overview

The Sentiment Analysis Platform currently lacks a unified testing strategy across its Turborepo monorepo structure. The frontend (`apps/web`) has no test runner configured, while the backend (`apps/server`) has an unused Jest installation with complete configuration but no actual tests. This inconsistency creates confusion for developers and prevents effective quality assurance as new features are developed.

This feature will standardize the entire monorepo on Vitest as the single testing framework, providing a modern, fast, and consistent testing experience across all applications and packages. The migration will include complete removal of Jest dependencies, implementation of shared Vitest configuration, and establishment of working test setups for both the Next.js frontend and NestJS backend applications.

## 2. User Stories

- **As a developer**, I want to run tests consistently across all applications so that I can verify code quality uniformly
- **As a frontend developer**, I want to write React component tests that work with Next.js path aliases so that I can test UI components effectively
- **As a backend developer**, I want to write service tests that work with NestJS dependency injection so that I can test business logic reliably
- **As a team lead**, I want a single test command that runs all tests in the monorepo so that I can verify the entire codebase quickly
- **As a new developer**, I want clear documentation on how to run tests so that I can contribute effectively from day one
- **As a CI/CD engineer**, I want standardized test scripts so that I can integrate testing into automated pipelines

## 3. Functional Requirements

### FR1. Complete Jest Removal from Backend

**Acceptance Criteria:**

- Given the `apps/server` application, when I inspect `package.json`, then no jest, @types/jest, or ts-jest packages should be present in dependencies or devDependencies
- Given the `apps/server` application, when I inspect the configuration, then no Jest configuration block should exist in `package.json`
- Given the backend application, when I run `pnpm list -r jest`, then no Jest packages should be found anywhere in the dependency tree

### FR2. Root-Level Vitest Installation

**Acceptance Criteria:**

- Given the monorepo root, when Vitest is installed, then it should be added as a workspace-level dev dependency using `pnpm add -D -w vitest`
- Given the root installation, when other packages need Vitest functionality, then they should reference the shared installation
- Given the installation, when I check the lock file, then Vitest should be hoisted to the root level

### FR3. Shared Vitest Configuration Package

**Acceptance Criteria:**

- Given the monorepo, when the shared config is created, then it should be located at `packages/vitest-config`
- Given the shared config package, when applications import it, then it should export a base configuration with node environment and globals enabled
- Given the base configuration, when applications extend it, then they should be able to override specific settings like test environment
- Given the configuration, when tests run, then globals should be available without explicit imports

### FR4. Frontend (Next.js) Vitest Setup

**Acceptance Criteria:**

- Given the `apps/web` application, when Vitest dependencies are added, then @vitejs/plugin-react, jsdom, and @testing-library/react should be installed as dev dependencies
- Given the frontend configuration, when `vitest.config.ts` is created, then it should extend the shared config and override the environment to jsdom
- Given the configuration, when React components are tested, then @vitejs/plugin-react should be properly configured
- Given the path aliases, when tests import using `@/components` syntax, then the imports should resolve correctly
- Given the test script, when `pnpm test` is run in `apps/web`, then Vitest should execute successfully
- Given a sample test, when a React component is rendered, then @testing-library/react should work correctly with jsdom

### FR5. Backend (NestJS) Vitest Setup

**Acceptance Criteria:**

- Given the `apps/server` application, when `vitest.config.ts` is created, then it should extend the shared config without environment overrides
- Given the backend configuration, when tests run, then the node environment should be used by default
- Given the test script, when `pnpm test` is run in `apps/server`, then Vitest should execute successfully
- Given NestJS services, when unit tests are written, then dependency mocking should work correctly
- Given the configuration, when TypeScript files are tested, then type checking should work properly

### FR6. Sample Test Implementation

**Acceptance Criteria:**

- Given the frontend application, when a sample test is created for the landing page component, then it should render the component and assert that key text is present in the document
- Given the backend application, when a sample test is created for a service method, then it should mock dependencies and assert expected output
- Given both sample tests, when the test suite runs, then both tests should pass without errors
- Given the sample tests, when they serve as templates, then developers should be able to follow the patterns for future tests

### FR7. Turbo Configuration Integration

**Acceptance Criteria:**

- Given the turbo.json configuration, when a "test" task is added, then it should be configured to run tests across all workspaces
- Given the test task, when dependencies are considered, then it should depend on build tasks for packages that require compilation
- Given the Turbo test task, when `pnpm turbo test` is run from root, then tests should execute for both frontend and backend applications
- Given the task configuration, when tests run, then proper caching should be enabled for performance

### FR8. Documentation Updates

**Acceptance Criteria:**

- Given the main README.md, when testing instructions are added, then they should include clear commands for running tests locally
- Given the documentation, when developers read it, then they should understand how to run tests for individual applications and the entire monorepo
- Given the test setup, when new developers join, then they should be able to run tests successfully by following the README instructions

## 4. Out of Scope (Non-Goals)

- **End-to-End Testing**: Implementation of Playwright, Synpress, or any E2E testing framework
- **Full Test Coverage**: Writing comprehensive tests for existing codebase functionality
- **CI/CD Pipeline Integration**: Configuring GitHub Actions or other CI/CD systems (this will be a separate task)
- **Advanced Testing Features**: Test coverage reporting, performance testing, or visual regression testing
- **Database Testing**: Integration tests that require database setup or transactions
- **API Testing**: Full API endpoint testing beyond simple unit tests
- **Test Data Management**: Fixtures, factories, or seed data for testing
- **Parallel Test Execution**: Advanced Vitest parallel execution configuration
- **Browser Testing**: Real browser testing or cross-browser compatibility testing

## 5. Technical Considerations

Based on the comprehensive codebase analysis and user feedback integration:

### Monorepo Architecture & Dependencies

- **Workspace Dependencies**: The `@repo/database` and `@repo/services` packages are shared across applications and should be properly built before tests run
- **PNPM Workspace Management**: Tests should leverage the existing PNPM workspace configuration for dependency resolution
- **Turbo Build Dependencies**: Test tasks should properly depend on package builds to ensure shared code is available

### TypeScript & Build Configuration

- **TypeScript Configuration**: Each application has its own tsconfig.json with specific path mappings that should be respected by Vitest configurations
- **Path Alias Resolution**: Frontend tests must handle Next.js path aliases (e.g., `@/components`, `@/lib`) through proper Vite configuration
- **ESLint Integration**: Existing ESLint configurations should work with test files without additional setup

### Next.js Frontend Considerations

- **Next.js Integration**: The frontend uses Next.js 15 with specific transpilation settings (`transpilePackages: ["@repo/database", "@repo/services"]`) that must be mirrored in Vitest configuration
- **Server Actions**: Tests should be able to handle Next.js Server Actions located in `apps/web/actions/`
- **Component Structure**: Tests should work with the atomic design structure (`atoms`, `molecules`, `organisms`, `templates`)

### NestJS Backend Considerations

- **NestJS Testing**: The backend uses NestJS testing utilities that should be compatible with Vitest
- **Dependency Injection**: Tests should properly mock NestJS dependency injection patterns
- **Module Testing**: Configuration should support testing NestJS modules and services

### Environment & Configuration Management

- **Environment Variables**: Tests should use the same environment variables as the application being tested, loaded from respective `.env` files (e.g., `apps/web/.env.local`, `apps/server/.env`)
- **NODE_ENV Handling**: Tests should respect standard NODE_ENV patterns for development vs. test environments
- **Watch Mode Configuration**: Watch mode should be optimized for development workflows while being disabled in CI environments

### Development Workflow Integration

- **Test Organization**: Test files should be co-located with source files (e.g., `component.test.tsx` next to `component.tsx`)
- **Shared Test Utilities**: No separate test utilities package is needed initially; utilities can be created within individual applications as needed
- **Mock Strategy**: Mocking patterns for shared packages (`@repo/database`, `@repo/services`) will be established on a case-by-case basis
- **Standard Timeouts**: Default Vitest timeouts are sufficient for current async operations

### Package Resolution & Performance

- **Package Resolution**: Vitest should properly resolve workspace packages and external dependencies through PNPM's hoisting
- **Build Caching**: Tests should integrate with Turbo's caching system for optimal performance
- **Development Scripts**: Test scripts should integrate seamlessly with existing `dev` commands for hot reloading workflows

## 6. Success Metrics

- **Clean Jest Removal**: Running `pnpm list -r jest` returns no results, confirming complete Jest removal
- **Unified Test Execution**: Running `pnpm turbo test` from root executes tests for both applications without errors
- **Frontend Test Validation**: The sample React component test passes and demonstrates proper @testing-library/react integration
- **Backend Test Validation**: The sample NestJS service test passes and demonstrates proper mocking capabilities
- **Developer Experience**: New developers can run tests successfully by following updated README instructions
- **Build Integration**: Tests run successfully as part of the Turbo build pipeline without breaking existing workflows
- **Path Alias Resolution**: Frontend tests can successfully import components using Next.js path aliases
- **Environment Consistency**: Tests use the same environment variable configuration as their respective applications

## 7. Implementation Guidelines

### Configuration Strategy

- Create a shared base configuration that handles common settings (globals, TypeScript, basic timeouts)
- Allow applications to extend and override specific settings (environment, plugins, path resolution)
- Ensure configuration consistency while maintaining flexibility for application-specific needs

### Test File Organization

- Co-locate test files with source files using `.test.ts` or `.test.tsx` extensions
- Follow existing directory structure and naming conventions
- Create one simple example test per application to validate setup

### Mock and Environment Strategy

- Use application-specific environment variables from existing `.env` files
- Implement mocking patterns that work with existing dependency injection and module systems
- Establish watch mode for development environments while ensuring clean CI execution

This PRD provides a complete, actionable plan for standardizing the monorepo's testing framework with Vitest while respecting the existing architecture and development patterns.
