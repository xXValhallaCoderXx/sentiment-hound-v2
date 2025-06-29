# Project Scripts

## Root `package.json`

### Script: `build`
- **Location:** `package.json`
- **Command:** `turbo build`
- **Purpose:** Builds all applications and packages in the monorepo.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `dev`
- **Location:** `package.json`
- **Command:** `turbo dev`
- **Purpose:** Runs all applications and packages in development mode.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `dev:watch`
- **Location:** `package.json`
- **Command:** `turbo dev services:watch`
- **Purpose:** This script is intended to run the development servers for all applications while also watching for changes in the shared `services` package and rebuilding it on the fly.
- **Current Status:** Failing
- **Error Message (if any):**
  ```
  The `services:watch` command does not trigger a rebuild of the `services` package when files are changed, so the applications (e.g., `web`, `server`) do not receive the updated code.
  ```
---
### Script: `lint`
- **Location:** `package.json`
- **Command:** `turbo lint`
- **Purpose:** Lints all code in the monorepo.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `format`
- **Location:** `package.json`
- **Command:** `prettier --write "**/*.{ts,tsx,md}"`
- **Purpose:** Formats all code in the monorepo.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:deploy`
- **Location:** `package.json`
- **Command:** `pnpm --filter @repo/db deploy`
- **Purpose:** Deploys database migrations.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

## `apps/server`

### Script: `dev`
- **Location:** `apps/server/package.json`
- **Command:** `nest start --watch`
- **Purpose:** Starts the NestJS server in development mode with hot-reloading.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `build`
- **Location:** `apps/server/package.json`
- **Command:** `nest build`
- **Purpose:** Builds the NestJS server for production.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `format`
- **Location:** `apps/server/package.json`
- **Command:** `prettier --write "src/**/*.ts" "test/**/*.ts"`
- **Purpose:** Formats the code in the `src` and `test` directories.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `start`
- **Location:** `apps/server/package.json`
- **Command:** `nest start`
- **Purpose:** Starts the NestJS server.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `start:dev`
- **Location:** `apps/server/package.json`
- **Command:** `nest start --watch`
- **Purpose:** Starts the NestJS server in development mode with hot-reloading.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `start:debug`
- **Location:** `apps/server/package.json`
- **Command:** `nest start --debug --watch`
- **Purpose:** Starts the NestJS server in debug mode with hot-reloading.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `start:prod`
- **Location:** `apps/server/package.json`
- **Command:** `node dist/main`
- **Purpose:** Starts the NestJS server in production mode.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `lint`
- **Location:** `apps/server/package.json`
- **Command:** `eslint "{src,apps,libs,test}/**/*.ts" --fix`
- **Purpose:** Lints the code and fixes fixable issues.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `test`
- **Location:** `apps/server/package.json`
- **Command:** `jest`
- **Purpose:** Runs tests.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `test:watch`
- **Location:** `apps/server/package.json`
- **Command:** `jest --watch`
- **Purpose:** Runs tests in watch mode.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `test:cov`
- **Location:** `apps/server/package.json`
- **Command:** `jest --coverage`
- **Purpose:** Runs tests and generates a coverage report.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `test:debug`
- **Location:** `apps/server/package.json`
- **Command:** `node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand`
- **Purpose:** Runs tests in debug mode.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `test:e2e`
- **Location:** `apps/server/package.json`
- **Command:** `jest --config ./test/jest-e2e.json`
- **Purpose:** Runs end-to-end tests.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

## `apps/spam-detection-service`

### Script: `build`
- **Location:** `apps/spam-detection-service/package.json`
- **Command:** `tsc`
- **Purpose:** Compiles the TypeScript code to JavaScript.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `start`
- **Location:** `apps/spam-detection-service/package.json`
- **Command:** `node dist/index.js`
- **Purpose:** Starts the spam detection service.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `dev`
- **Location:** `apps/spam-detection-service/package.json`
- **Command:** `ts-node src/index.ts`
- **Purpose:** Starts the spam detection service in development mode.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `type-check`
- **Location:** `apps/spam-detection-service/package.json`
- **Command:** `tsc --noEmit`
- **Purpose:** Type-checks the code without emitting JavaScript files.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

## `apps/web`

### Script: `dev`
- **Location:** `apps/web/package.json`
- **Command:** `next dev --turbopack --port 3000`
- **Purpose:** Starts the Next.js development server with Turbopack.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `build`
- **Location:** `apps/web/package.json`
- **Command:** `next build`
- **Purpose:** Builds the Next.js application for production.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `start`
- **Location:** `apps/web/package.json`
- **Command:** `next start`
- **Purpose:** Starts the Next.js production server.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `lint`
- **Location:** `apps/web/package.json`
- **Command:** `next lint --max-warnings 0`
- **Purpose:** Lints the Next.js application.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `check-types`
- **Location:** `apps/web/package.json`
- **Command:** `tsc --noEmit`
- **Purpose:** Type-checks the code without emitting JavaScript files.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

## `packages/database`

### Script: `build`
- **Location:** `packages/database/package.json`
- **Command:** `prisma generate && tsc -p tsconfig.build.json`
- **Purpose:** Generates the Prisma client and compiles the TypeScript code.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:push`
- **Location:** `packages/database/package.json`
- **Command:** `prisma db push --accept-data-loss`
- **Purpose:** Pushes the Prisma schema to the database, accepting data loss.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:format`
- **Location:** `packages/database/package.json`
- **Command:** `prisma format`
- **Purpose:** Formats the Prisma schema.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:generate`
- **Location:** `packages/database/package.json`
- **Command:** `prisma generate`
- **Purpose:** Generates the Prisma client.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:migrate`
- **Location:** `packages/database/package.json`
- **Command:** `prisma migrate dev --skip-generate`
- **Purpose:** Creates and applies a new migration.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:deploy`
- **Location:** `packages/database/package.json`
- **Command:** `prisma migrate deploy`
- **Purpose:** Deploys database migrations.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:seed`
- **Location:** `packages/database/package.json`
- **Command:** `ts-node --project tsconfig.seed.json src/seed.ts`
- **Purpose:** Seeds the database.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:seed:build`
- **Location:** `packages/database/package.json`
- **Command:** `node ./dist/seed.js`
- **Purpose:** Seeds the database from the built output.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:seed:dev`
- **Location:** `packages/database/package.json`
- **Command:** `pnpm build && pnpm db:seed:build`
- **Purpose:** Builds the package and seeds the database.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `db:reset`
- **Location:** `packages/database/package.json`
- **Command:** `prisma db push --force-reset --accept-data-loss`
- **Purpose:** Resets the database.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `deploy`
- **Location:** `packages/database/package.json`
- **Command:** `./scripts/deploy.sh`
- **Purpose:** Deploys the database.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `generate-token`
- **Location:** `packages/database/package.json`
- **Command:** `node scripts/generate-token.js`
- **Purpose:** Generates a token.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

## `packages/services`

### Script: `build`
- **Location:** `packages/services/package.json`
- **Command:** `tsc --project tsconfig.build.json`
- **Purpose:** Compiles the TypeScript code.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---
### Script: `services:watch`
- **Location:** `packages/services/package.json`
- **Command:** `tsc --project tsconfig.build.json --watch`
- **Purpose:** Compiles the TypeScript code in watch mode.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

# Root /scripts Folder

- `generate-invitation-token.js`

# Shell Scripts

### Script: `railway-build.sh`
- **Location:** `railway-build.sh`
- **Command:** `bash railway-build.sh`
- **Purpose:** Builds the application for deployment on Railway.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---

### Script: `packages/database/scripts/deploy.sh`
- **Location:** `packages/database/scripts/deploy.sh`
- **Command:** `bash packages/database/scripts/deploy.sh`
- **Purpose:** Deploys the database by running migrations and seeding data.
- **Current Status:** Working
- **Error Message (if any):**
  ```
  (none)
  ```
---