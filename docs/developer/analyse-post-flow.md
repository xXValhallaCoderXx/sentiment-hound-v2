# Analyze Post Flow

This document outlines the end-to-end flow of the "Analyze Post" feature, triggered from the dashboard. It covers the frontend initiation, backend task orchestration, and data processing steps.

## 1. Overview

The Analyze Post flow allows users to submit a URL (e.g., YouTube video) for sentiment analysis. The system fetches the content (post details and comments) and then performs sentiment analysis on the comments.

## 2. Trigger Mechanism

### Frontend
- **Location**: `apps/web/app/dashboard/analyse/page.tsx`
- **Component**: `AnalyseForm.tsx`
- **Action**: User pastes a URL and clicks "Start Analysis".
- **Event**: `handleSubmit` calls the Server Action `startAnalysis`.

### Server Action
- **File**: `apps/web/actions/analysis.actions.ts`
- **Function**: `startAnalysis(postUrl)`
- **Logic**:
    1.  Authenticates the user.
    2.  Parses the URL to detect the provider (e.g., YouTube).
    3.  Resolves the `providerId`.
    4.  Calls `taskService.createTask` with `TaskType.ANALYZE_POST`.

## 3. Task Orchestration

### Task Creation
- **Service**: `CoreTaskService` (`packages/services/src/tasks/tasks.service.ts`)
- **Method**: `createTask`
- **Process**:
    1.  Creates a parent `Task` record in the database.
    2.  Synchronously creates necessary `SubTask` records based on the provider.

### SubTasks (for YouTube/URL)
1.  **`FETCH_INDIVIDUAL_POST_CONTNENT`**: Responsible for fetching video metadata and comments.
2.  **`ANALYZE_CONTENT_SENTIMENT`**: Responsible for analyzing the sentiment of the fetched comments.
3.  **`DETECT_SPAM`** (Optional): Created if the user has the spam detection feature enabled.

## 4. Execution Flow

The system processes SubTasks asynchronously via the `JobsService` and specific processors.

### Step 1: Fetch Content
- **Processor**: `PostFetchProcessor` (`apps/server/src/modules/jobs/processors/post-fetch.processor.ts`)
- **Input**: `FETCH_INDIVIDUAL_POST_CONTNENT` job.
- **Actions**:
    1.  Builds an execution context (resolves tokens/auth).
    2.  Fetches video details and comments from the provider (e.g., YouTube API).
    3.  Creates a `Post` record in the database.
    4.  Creates `Mention` records for each comment (linked to the Post).
    5.  Marks the SubTask as `COMPLETED`.

### Step 2: Analyze Sentiment
- **Processor**: `SentimentAnalysisProcessor` (`apps/server/src/modules/jobs/processors/sentiment-analysis.processor.ts`)
- **Input**: `ANALYZE_CONTENT_SENTIMENT` job.
- **Actions**:
    1.  Queries `Mention` records that are `PENDING` analysis.
    2.  Creates `SubTaskMention` records to track progress.
    3.  Batches comments (default batch size: 25).
    4.  Sends batches to the Sentiment Service (`http://localhost:8000/analyze`).
    5.  Updates `Mention` records with sentiment scores and labels.
    6.  Marks the SubTask as `COMPLETED`.

## 5. Failure Handling

### Sentiment Service Down
If the external Sentiment Service (`http://localhost:8000`) is unreachable or returns errors:

1.  **Behavior**: The `SentimentAnalysisProcessor` attempts to process each batch.
2.  **Error Handling**:
    - If a batch request fails (e.g., connection refused), the error is caught and logged (`Error processing batch...`).
    - The processor **continues** to the next batch.
    - The `Mention` records in the failed batch remain in their previous state (likely `PENDING`).
3.  **Outcome**:
    - The SubTask is marked as **`COMPLETED`** even if all batches failed (unless a fatal error occurs outside the batch loop).
    - Users may see the task as "Completed" in the UI, but comments will lack sentiment data.

### Other Failures
- **Invalid URL**: Caught in the Server Action; returns an error to the frontend immediately.
- **Content Fetch Error**: If the provider API fails (e.g., video not found), the `PostFetchProcessor` marks the SubTask as `FAILED`.
