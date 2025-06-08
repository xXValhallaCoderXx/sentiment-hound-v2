# Database Deployment Guide

This document describes the database migration and seeding process for deploying the Sentiment Hound v2 application.

## Overview

The database deployment process ensures that:
1. **Migrations are applied** - Database schema changes are deployed safely
2. **Core data is seeded** - Essential application data (Plans and Providers) is populated
3. **Environment consistency** - All environments have identical core data

## Quick Start

### Automated Deployment (Recommended)

For production deployments, use the automated deployment script:

```bash
# From packages/database directory
npm run deploy

# Or run the script directly
./scripts/deploy.sh
```

### Manual Steps

If you need to run individual steps:

```bash
# 1. Deploy migrations (production-safe)
npx prisma migrate deploy

# 2. Generate Prisma client
npx prisma generate

# 3. Build seed script
npm run build

# 4. Seed core data
npm run db:seed
```

## Deployment Process Details

### 1. Migration Deployment

The `prisma migrate deploy` command:
- ✅ **Production-safe**: Non-interactive and safe for production environments
- ✅ **Idempotent**: Can be run multiple times safely
- ✅ **Atomic**: Applies all pending migrations or fails completely
- ✅ **Locked**: Uses migration lock to prevent concurrent deployments

**When to use:**
- Production deployments
- Staging environment updates
- CI/CD pipelines

**NOT for development:**
- Use `npx prisma migrate dev` for local development
- Use `npx prisma db push` for rapid prototyping

### 2. Database Seeding

The seeding process populates core application data that must exist for the application to function properly.

#### Seeded Data

**Plans:**
| Plan | Price | Max Integrations | Max Competitors | Monthly Tokens | Can Export |
|------|-------|-----------------|-----------------|----------------|------------|
| Public | $0 | 0 | 0 | 0 | false |
| Developer | $0 | 1 | 0 | 0 | false |
| Starter | $29.00 | 3 | 1 | 300,000 | false |
| Pro | $99.00 | 10 | 5 | 2,500,000 | true |

**Providers:**
- **YouTube**: Analyze comments from YouTube videos
- **Reddit**: Analyze comments from Reddit posts

#### Seeding Features

- ✅ **Idempotent**: Uses upsert operations to safely run multiple times
- ✅ **Version Controlled**: Seed data is defined in code, not manual SQL
- ✅ **Consistent**: Ensures all environments start with identical core data
- ✅ **Safe**: Won't overwrite existing data, only creates missing records

## Environment Requirements

### Required Environment Variables

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Database Connectivity

Ensure your deployment environment can connect to the database:
- Network access to database host
- Correct credentials and permissions
- Database exists and is accessible

## Integration with Deployment Pipelines

### Docker Deployments

Add to your Dockerfile:

```dockerfile
# Install dependencies
COPY packages/database/package*.json ./packages/database/
RUN npm install

# Copy database files
COPY packages/database/ ./packages/database/

# Run deployment during container startup
RUN cd packages/database && npm run deploy
```

### Kubernetes Deployments

Use an init container or job:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: database-migration
spec:
  template:
    spec:
      containers:
      - name: migrate
        image: your-app-image
        command: ["sh", "-c"]
        args: 
          - "cd packages/database && npm run deploy"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
      restartPolicy: OnFailure
```

### CI/CD Pipelines

#### GitHub Actions Example

```yaml
- name: Deploy Database
  run: |
    cd packages/database
    npm run deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

#### Vercel/Netlify Example

Add to your build command:
```bash
cd packages/database && npm run deploy && cd ../.. && npm run build
```

## Deployment Script Details

The `scripts/deploy.sh` script performs the following steps:

1. **Environment Validation**
   - Verifies script is run from correct directory
   - Checks that DATABASE_URL is set

2. **Migration Deployment**
   - Runs `prisma migrate deploy`
   - Applies all pending migrations atomically

3. **Client Generation**
   - Generates fresh Prisma client
   - Ensures type safety with current schema

4. **Build Process**
   - Compiles TypeScript seed scripts
   - Prepares executable seed files

5. **Data Seeding**
   - Populates core application data
   - Uses idempotent upsert operations

6. **Verification**
   - Reports success/failure for each step
   - Provides deployment summary

## Troubleshooting

### Common Issues

**Migration Lock Error:**
```bash
Error: P3009: migrate found failed migration
```
**Solution:** Check and resolve failed migrations, then retry

**Connection Error:**
```bash
Error: P1001: Can't reach database server
```
**Solution:** Verify DATABASE_URL and network connectivity

**Permission Error:**
```bash
Error: P3006: Migration failed to apply cleanly
```
**Solution:** Ensure database user has required permissions

### Manual Recovery

If the automated deployment fails:

1. **Check migration status:**
   ```bash
   npx prisma migrate status
   ```

2. **Reset if necessary (⚠️ destructive):**
   ```bash
   npx prisma migrate reset
   ```

3. **Re-run deployment:**
   ```bash
   npm run deploy
   ```

## Development vs Production

| Operation | Development | Production |
|-----------|-------------|------------|
| Schema Changes | `prisma migrate dev` | `prisma migrate deploy` |
| Database Reset | `prisma db push --force-reset` | ❌ Never |
| Seeding | `npx prisma db seed` | `npm run deploy` |
| Client Generation | Automatic | `npx prisma generate` |

## Security Considerations

- ✅ Store DATABASE_URL in secure environment variables
- ✅ Use database users with minimal required permissions
- ✅ Enable database connection encryption (SSL)
- ✅ Audit database access logs in production
- ❌ Never commit database credentials to source control
- ❌ Never run destructive commands in production

## Monitoring and Logging

The deployment script provides detailed logging:
- Migration application status
- Seeding success/failure
- Performance timing information
- Error details for troubleshooting

Monitor your deployment logs to ensure successful database operations.