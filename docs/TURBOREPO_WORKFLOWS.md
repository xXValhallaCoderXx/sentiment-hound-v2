# Turborepo Optimized Workflows

This document explains the cleaned-up Turborepo configuration and recommended development workflows.

## 🎯 Quick Start

**Best Development Experience:**

```bash
./scripts/dev-full.sh
```

**Manual Two-Terminal Approach:**

```bash
# Terminal 1: Service watchers
pnpm turbo dev:watch --filter="@repo/db" --filter="@repo/services"

# Terminal 2: Apps
pnpm turbo dev --filter="web" --filter="server"
```

## 🚀 Core Development Commands

### 1. Full Development Server

```bash
# Starts web and server apps only (basic)
pnpm turbo dev --filter="web" --filter="server"
```

**What it does:**

- Generates Prisma client (`db:generate`) for web and server
- Starts `web` and `server` apps
- **Note:** For automatic service rebuilding, use the approaches below

### 1b. Full Development with Hot-Reloading Services

```bash
# Run this in separate terminals for optimal development experience:

# Terminal 1: Start service watchers
pnpm turbo dev:watch --filter="@repo/db" --filter="@repo/services"

# Terminal 2: Start apps
pnpm turbo dev --filter="web" --filter="server"
```

**What it does:**

- **Terminal 1:** Watches and rebuilds `packages/database` and `packages/services` on changes
- **Terminal 2:** Runs `web` and `server` apps
- **Key benefit:** When you change `packages/services`, it automatically rebuilds and your apps get the updates without restart

### 1c. One-Command Development (Convenience Script)

```bash
# Using our custom development script
./scripts/dev-full.sh
```

**What it does:**

- Automatically starts service watchers in background
- Starts apps in foreground with proper logging
- Handles cleanup when you stop the process
- **Recommended approach:** Best developer experience

### 1d. One-Command Development (Alternative)

```bash
# Single command alternative using pnpm directly
pnpm --filter="@repo/db" --filter="@repo/services" dev:watch & pnpm turbo dev --filter="web" --filter="server"
```

**What it does:**

- Runs service watchers in background
- Starts apps in foreground
- **Trade-off:** Less visible logging but single command

### 2. Full Production Build

```bash
# Builds all packages and apps for production
pnpm turbo build
```

**What it does:**

- Generates Prisma client
- Builds `packages/database` → `packages/services` → `web` & `server`
- Optimized for deployment

### 3. Web-Only Build

```bash
# Builds only web app and its dependencies
pnpm turbo build:web --filter=web...
```

**What it does:**

- Builds only `packages/database`, `packages/services`, and `web`
- Skips `server` build for faster web-only deployments

### 4. Server-Only Build

```bash
# Builds only server app and its dependencies
pnpm turbo build:server --filter=server...
```

**What it does:**

- Builds only `packages/database`, `packages/services`, and `server`
- Skips `web` build for API-only deployments

## 🗃️ Database Workflows

```bash
# Generate Prisma client after schema changes
pnpm turbo db:generate

# Create and apply new migration
pnpm turbo db:migrate

# Push schema changes without migration (dev only)
pnpm turbo db:push

# Seed database with test data
pnpm turbo db:seed

# Reset database (destructive!)
pnpm turbo db:reset

# Format Prisma schema
pnpm turbo db:format
```

## 🔍 Quality Assurance

```bash
# Run linting across all packages
pnpm turbo lint

# Type checking across all packages
pnpm turbo check-types

# Run tests (with proper build dependencies)
pnpm turbo test
```

## 🎯 Key Optimizations Made

### Removed Redundant Tasks

- ❌ `watch` → Replaced with `dev:watch`
- ❌ `services:build` → Handled by standard `build`
- ❌ `services:watch` → Handled by `dev:watch`
- ❌ `scripts:build` → Not needed for core workflow
- ❌ `db:deploy` → Use `db:migrate` instead
- ❌ `deploy` → Application-specific, not monorepo task

### Improved Dependency Chain

- **Problem:** Turborepo doesn't allow persistent tasks to depend on other persistent tasks
- **Solution:** Use separate commands for service watching and app development
- **Benefit:** Service packages rebuild automatically, apps pick up changes via workspace linking

### Smart Caching Strategy

- **Development tasks:** `cache: false` for real-time updates
- **Build tasks:** Full caching enabled for performance
- **Database tasks:** No caching to ensure consistency

## 🏗️ Architecture Flow

```
Database Schema Changes:
1. Edit `packages/database/prisma/schema.prisma`
2. Run `pnpm turbo db:generate`
3. Services auto-rebuild via `dev:watch`
4. Apps get updates automatically

Service Logic Changes:
1. Edit files in `packages/services/src/`
2. TypeScript watch mode rebuilds automatically
3. Apps get updates without restart

App Development:
1. `pnpm turbo dev` starts everything
2. Change any code in `apps/web` or `apps/server`
3. Hot-reloading works as expected
```

## 🔧 Development vs Production

### Development (Multi-Terminal Approach)

- **Terminal 1:** `pnpm turbo dev:watch --filter="@repo/db" --filter="@repo/services"` for service hot-reloading
- **Terminal 2:** `pnpm turbo dev --filter="web" --filter="server"` for app development
- Services rebuild automatically on changes
- No caching for immediate feedback
- Environment variables loaded properly

### Production (pnpm turbo build)

- Full static builds of all packages
- Aggressive caching for performance
- Optimized outputs for deployment
- Dependency chain ensures correct build order

## 🎁 Bonus: Package-Specific Commands

If you need to work on a specific package:

```bash
# Work only on web app
pnpm --filter web dev

# Work only on server
pnpm --filter server dev

# Test specific package
cd packages/services && pnpm test

# Build specific package
pnpm --filter @repo/services build
```

## 🔧 Troubleshooting

### Filter Syntax Reference

**Correct Turborepo filter patterns:**

```bash
# Multiple specific packages - use multiple --filter flags
pnpm turbo dev:watch --filter="@repo/db" --filter="@repo/services"

# Package with dependencies - use ellipsis
pnpm turbo build:web --filter="web..."

# Multiple apps - use multiple --filter flags
pnpm turbo dev --filter="web" --filter="server"
```

**❌ Common mistakes:**

```bash
# DON'T use brace expansion (bash syntax)
pnpm turbo dev --filter="{web,server}"           # ❌ Invalid
pnpm turbo dev:watch --filter="@repo/{db,services}"  # ❌ Invalid

# DON'T mix filter styles
pnpm turbo dev --filter="web,server"             # ❌ Invalid
```

**✅ Correct syntax:**

```bash
# Multiple --filter flags
pnpm turbo dev --filter="web" --filter="server"  # ✅ Correct
pnpm turbo dev:watch --filter="@repo/db" --filter="@repo/services"  # ✅ Correct
```

This hybrid approach gives you both the power of Turborepo orchestration and the flexibility of direct package manipulation when needed.
