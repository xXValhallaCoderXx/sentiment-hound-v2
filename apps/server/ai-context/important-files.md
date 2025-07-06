# Important Files Reference

## Core Configuration
- `nest-cli.json` - NestJS CLI configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Test configuration

## Application Bootstrap
- `src/main.ts` - **Entry point**: App initialization and port binding
- `src/app.module.ts` - **Root module**: Imports all feature modules

## Task Management
- `src/modules/tasks/tasks.controller.ts` - **REST API**: Task CRUD endpoints
- `src/modules/tasks/tasks.service.ts` - Task orchestration logic
- `src/modules/tasks/export.dto.ts` - Export task validation schemas

## Queue Processing
- `src/modules/queue/queue.service.ts` - **Queue management**: Job distribution
- `src/modules/queue/queue.module.ts` - Queue module configuration

## Job Processors
- `src/modules/jobs/jobs.service.ts` - **Processor registry**: Routes jobs to handlers
- `src/modules/jobs/processors/content-fetch.processor.ts` - Social media content retrieval
- `src/modules/jobs/processors/sentiment-analysis.processor.ts` - ML analysis integration
- `src/modules/jobs/processors/post-fetch.processor.ts` - Individual post processing
- `src/modules/jobs/processors/reddit-fetch-processor.ts` - Reddit-specific logic
- `src/modules/jobs/processors/export-*.processor.ts` - Data export pipeline (fetch/format/generate)

## Job Types
Key `SubTaskType` enum values processed:
- `FETCH_CONTENT` - Retrieve social media data
- `ANALYZE_CONTENT_SENTIMENT` - ML sentiment analysis
- `FETCH_INDIVIDUAL_POST_CONTNENT` - Single post details
- `FETCH_REDDIT_KEYWORD_MENTIONS` - Reddit keyword tracking
- `EXPORT_*` - Multi-stage export pipeline

## Testing
- `test/app.e2e-spec.ts` - End-to-end API tests
- `test/jest-e2e.json` - E2E test configuration
- `*.spec.ts` - Unit tests for services and controllers

## Environment Files
- `.env` - Database URLs, API keys, service endpoints
- **Key Variables**: `DATABASE_URL`, `REDIS_URL`, service URLs
