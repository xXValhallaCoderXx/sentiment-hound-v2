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

### generate-invitation-token.ts

Generates invitation tokens for user registration with specific plan assignments.

**Usage:**

```bash
# From root of monorepo
pnpm run script:gen-token --plan=Developer

# With expiration
pnpm run script:gen-token --plan=Developer --expires-in-days=30

# Direct execution (from scripts package)
pnpm --filter @repo/scripts gen-token --plan=Developer
```

**Options:**

- `--plan=<plan_name>`: Plan name (Trial, Developer, Starter, Pro)
- `--expires-in-days=<days>`: Optional expiration in days

**Example Output:**

```
✅ Successfully generated invitation token
   Token: HTpAYNY0mH8xmAPnAoiVhIYlotWcSSSB
   Plan: Developer (Developer plan for testing purposes)

Share this link with the invited user:
https://sentimenthound.com/sign-up?token=HTpAYNY0mH8xmAPnAoiVhIYlotWcSSSB
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
