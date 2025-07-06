# Server App Architecture Overview

## Tech Stack
- **NestJS** - Scalable Node.js framework
- **TypeScript** - Type safety
- **Bull/Queue** - Job processing
- **Schedule Module** - Cron jobs and task scheduling
- **Vitest** - Testing framework

## Core Structure

### App Module (`src/app.module.ts`)
**Root module** importing:
- `TasksModule` - Task management API
- `QueueModule` - Job queue processing
- `JobsModule` - Job processors
- `ScheduleModule` - Scheduled tasks
- `ConfigModule` - Environment configuration

### Modules (`src/modules/`)

#### Tasks Module
- **Controller**: `tasks.controller.ts` - REST API endpoints
- **Service**: `tasks.service.ts` - Business logic orchestration
- **DTOs**: Data transfer objects for API validation

#### Queue Module  
- **Service**: `queue.service.ts` - Queue management
- **Integration**: Job distribution and monitoring

#### Jobs Module
- **Service**: `jobs.service.ts` - Job processor registry
- **Processors**: Individual job type handlers
  - `content-fetch.processor.ts` - Social media content retrieval
  - `sentiment-analysis.processor.ts` - ML analysis integration
  - `export-*.processor.ts` - Data export pipeline

## Architecture Pattern
**Queue-Based Processing**:
1. **API Endpoints** receive requests
2. **Jobs** are queued for async processing  
3. **Processors** handle specific job types
4. **Services** from `@repo/services` provide business logic
5. **Results** are stored via Prisma

## Primary Responsibilities
- **Task Queue Management** - Async job processing
- **Background Workers** - Long-running analysis tasks
- **Export Generation** - Data export pipeline
- **API Gateway** - REST endpoints for web app

## Service Layer Integration

### Provider Decoupling Architecture (July 2025)

**Purpose**: Enhanced server to support dual authentication modes - OAuth integrations and direct API key access for public content analysis.

**Core Components**:
- Task queue processors updated for provider-based content fetching
- Job data structures include both `providerId` and optional `integrationId`  
- Background workers handle API key authentication flows

**Key Interactions**:
- Queue jobs resolve provider information before content fetching
- Processors use appropriate authentication method based on integration presence
- Error handling distinguishes between OAuth failures and API key issues

## Architecture Evolution
The server maintains its queue-based processing pattern while adding flexibility for different authentication modes. This enables analysis of public content without requiring user platform connections.
