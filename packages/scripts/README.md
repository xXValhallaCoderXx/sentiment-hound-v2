# @repo/scripts

This package contains administrative and utility scripts for the Sentiment Hound monorepo.

## Overview

The `@repo/scripts` package provides a standardized way to execute administrative scripts with proper TypeScript support, dependency management, and environment variable loading.

## Benefits

- **TypeScript Support**: Full TypeScript compilation and type checking
- **Dependency Management**: Proper access to shared packages (`@repo/db`, `@repo/services`)
- **Environment Isolation**: Each script has its own environment configuration
- **Clean Organization**: All scripts are centralized in one location
- **Easy Execution**: Simple command interface from the root of the monorepo

## Available Scripts

### Generate Invitation Token

Generates invitation tokens for user registration with specific plan assignments.

**Usage:**

```bash
# Generate a token for the developer plan (default)
pnpm --filter @repo/scripts gen-token

# Generate a token for a specific plan (case-insensitive)
pnpm --filter @repo/scripts gen-token --plan=starter

# Generate a token with custom expiration (default is 7 days)
pnpm --filter @repo/scripts gen-token --plan=pro --expires-in-days=30
```

**Options:**

- `--plan=<plan_name>`: Plan name (Trial, Developer, Starter, Pro) - case insensitive
- `--expires-in-days=<days>`: Optional expiration in days (default: 7)

**Example Output:**

```
✅ Successfully generated invitation token
   Token: VIUYYncAkY9mq1asLZ8tyaM8LxojuprL
   Plan: Developer (Developer plan for testing purposes)

Share this link with the invited user:
https://sentimenthound.com/sign-up?token=VIUYYncAkY9mq1asLZ8tyaM8LxojuprL
```

### Test Invitation Token

Validates and inspects an invitation token without consuming it.

**Usage:**

```bash
# Test a specific token
pnpm --filter @repo/scripts test-token --token=YOUR_TOKEN_HERE
```

**Example Output:**

```
📋 Token Details:
   Token: VIUYYncAkY9mq1asLZ8tyaM8LxojuprL
   Status: PENDING
   Plan: Developer (Developer plan for testing purposes)
   Expires: 2025-07-07T20:24:19.505Z
   Created: 2025-06-30T20:24:19.526Z

🧪 Testing token validation (without consuming):
   Is expired: No
   Is valid for signup: Yes

✅ Token is ready for use!
   Sign-up URL: http://localhost:3000/sign-up?token=VIUYYncAkY9mq1asLZ8tyaM8LxojuprL
```

### List Invitation Tokens

Lists all invitation tokens with optional filtering.

**Usage:**

```bash
# List all tokens
pnpm --filter @repo/scripts list-tokens

# List only pending tokens
pnpm --filter @repo/scripts list-tokens --status=pending

# List tokens for a specific plan
pnpm --filter @repo/scripts list-tokens --plan=developer

# Combine filters
pnpm --filter @repo/scripts list-tokens --status=pending --plan=pro
```

**Options:**

- `--status=<status>`: Filter by status (PENDING, USED, EXPIRED)
- `--plan=<plan_name>`: Filter by plan name (case insensitive)

## Available Plans

- **Trial** - Trial plan with basic access (0 integrations, 0 keywords, 0 competitors)
- **Developer** - Developer plan for testing purposes (1 integration, 0 keywords, 0 competitors)
- **Starter** - Starter plan for small businesses ($29/month, 3 integrations, 3 keywords, 1 competitor)
- **Pro** - Pro plan with advanced features ($99/month, 10 integrations, 10 keywords, 5 competitors)

## Environment Setup

Make sure you have a `.env` file in this directory with:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sentiment-hound
# Dummy Reddit credentials to suppress warnings
REDDIT_CLIENT_ID=dummy
REDDIT_CLIENT_SECRET=dummy
```

## Usage Examples

```bash
# Generate a developer token (expires in 7 days)
pnpm --filter @repo/scripts gen-token --plan=developer

# Generate a pro token that expires in 30 days
pnpm --filter @repo/scripts gen-token --plan=pro --expires-in-days=30

# Generate a starter token
pnpm --filter @repo/scripts gen-token --plan=starter

# Test if a token is valid
pnpm --filter @repo/scripts test-token --token=VIUYYncAkY9mq1asLZ8tyaM8LxojuprL

# List all pending tokens
pnpm --filter @repo/scripts list-tokens --status=pending

# List all developer plan tokens
pnpm --filter @repo/scripts list-tokens --plan=developer
```

## Testing the Sign-up Flow

1. **Generate an invitation token:**
   ```bash
   pnpm --filter @repo/scripts gen-token --plan=developer
   ```

2. **Copy the generated sign-up URL and open it in your browser**

3. **Fill out the sign-up form** - the invitation token should be pre-filled and locked

4. **Complete the registration process**

5. **Verify the token status changed to "USED":**
   ```bash
   pnpm --filter @repo/scripts list-tokens --status=used
   ```

## Development

### Adding New Scripts

1. Create a new TypeScript file in `src/`
2. Add dependencies to `package.json` if needed
3. Add a script entry to `package.json`
4. Add a root-level script to the main `package.json`

**Example:**

```typescript
// src/my-new-script.ts
#!/usr/bin/env tsx

import { PrismaClient } from "@repo/db";
import { someService } from "@repo/services";
import process from "node:process";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Your script logic here
}

main().catch(console.error);
```

**Add to `packages/scripts/package.json`:**

```json
{
  "scripts": {
    "my-script": "dotenv -e .env -- tsx src/my-new-script.ts"
  }
}
```

**Add to root `package.json`:**

```json
{
  "scripts": {
    "script:my-script": "pnpm --filter @repo/scripts my-script"
  }
}
```

### Environment Variables

Scripts automatically load environment variables from `.env` in this package directory. The current configuration includes:

- `DATABASE_URL`: PostgreSQL connection string

To add more environment variables, update the `.env` file in this package.

### Dependencies

The package has access to:

- `@repo/db`: Database client and types
- `@repo/services`: Shared business logic
- Standard Node.js modules
- TypeScript utilities (`tsx`, `dotenv-cli`)

## Architecture

```
packages/scripts/
├── src/
│   ├── generate-invitation-token.ts
│   └── ... (other scripts)
├── package.json              # Package configuration and script definitions
├── tsconfig.json             # TypeScript configuration
├── tsconfig.build.json       # Build-specific TypeScript config
├── .env                      # Environment variables
└── README.md                 # This file
```

## Best Practices

1. **Error Handling**: Always include proper error handling and cleanup
2. **TypeScript**: Use proper types and interfaces
3. **Environment**: Load environment variables using dotenv-cli
4. **Documentation**: Add clear usage instructions and examples
5. **Testing**: Test scripts thoroughly before adding to the monorepo

## Troubleshooting

### Common Issues

1. **Module not found**: Ensure the shared packages are built

   ```bash
   pnpm run build
   ```

2. **Database connection**: Verify DATABASE_URL in `.env`
3. **TypeScript errors**: Check imports and type definitions

### Development Workflow

1. Make changes to scripts
2. Test locally using the package commands
3. Update documentation if needed
4. Test from root using the standardized commands
