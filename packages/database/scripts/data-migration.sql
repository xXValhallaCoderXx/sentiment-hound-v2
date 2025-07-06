-- Data Migration Script for Decoupling Posts and Tasks from User Integrations
-- This script populates providerId fields for existing records

BEGIN;

-- Update Post table: Populate providerId from existing integration.providerId relationships
UPDATE "Post" 
SET "providerId" = (
    SELECT i."providerId" 
    FROM "Integration" i 
    WHERE i."id" = "Post"."integrationId"
)
WHERE "Post"."integrationId" IS NOT NULL;

-- Update Task table: Populate providerId from existing integration.providerId relationships  
UPDATE "Task"
SET "providerId" = (
    SELECT i."providerId"
    FROM "Integration" i 
    WHERE i."id" = "Task"."integrationId"
)
WHERE "Task"."integrationId" IS NOT NULL;

-- Update Mention table: Populate providerId from existing post.integration.providerId relationships
UPDATE "Mention"
SET "providerId" = (
    SELECT i."providerId"
    FROM "Post" p
    JOIN "Integration" i ON p."integrationId" = i."id"
    WHERE p."id" = "Mention"."postId"
)
WHERE "Mention"."postId" IS NOT NULL;

-- For Mentions not linked to posts (e.g., tracked keyword mentions), 
-- populate from trackedKeyword provider relationship
UPDATE "Mention"
SET "providerId" = (
    SELECT tk."providerId"
    FROM "TrackedKeyword" tk
    WHERE tk."id" = "Mention"."trackedKeywordId"
)
WHERE "Mention"."providerId" IS NULL 
  AND "Mention"."trackedKeywordId" IS NOT NULL;

-- Verify data integrity: Check that all Posts have valid providerId
DO $$
DECLARE
    invalid_posts_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_posts_count
    FROM "Post"
    WHERE "providerId" IS NULL;
    
    IF invalid_posts_count > 0 THEN
        RAISE EXCEPTION 'Data migration failed: % Posts have NULL providerId', invalid_posts_count;
    END IF;
    
    RAISE NOTICE 'Posts migration verification passed: All Posts have valid providerId';
END $$;

-- Verify data integrity: Check that all Tasks have valid providerId
DO $$
DECLARE
    invalid_tasks_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_tasks_count
    FROM "Task"
    WHERE "providerId" IS NULL;
    
    IF invalid_tasks_count > 0 THEN
        RAISE EXCEPTION 'Data migration failed: % Tasks have NULL providerId', invalid_tasks_count;
    END IF;
    
    RAISE NOTICE 'Tasks migration verification passed: All Tasks have valid providerId';
END $$;

-- Report migration results
DO $$
DECLARE
    posts_count INTEGER;
    tasks_count INTEGER;
    mentions_count INTEGER;
    mentions_with_provider INTEGER;
BEGIN
    SELECT COUNT(*) INTO posts_count FROM "Post";
    SELECT COUNT(*) INTO tasks_count FROM "Task";
    SELECT COUNT(*) INTO mentions_count FROM "Mention";
    SELECT COUNT(*) INTO mentions_with_provider FROM "Mention" WHERE "providerId" IS NOT NULL;
    
    RAISE NOTICE 'Data migration completed successfully:';
    RAISE NOTICE '  - Posts migrated: %', posts_count;
    RAISE NOTICE '  - Tasks migrated: %', tasks_count;
    RAISE NOTICE '  - Mentions migrated: % (% with providerId)', mentions_count, mentions_with_provider;
END $$;

COMMIT;
