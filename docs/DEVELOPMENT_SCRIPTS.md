# Development Scripts Documentation

This document explains the custom development scripts created for the Sentiment Hound monorepo to handle both JavaScript and Python components.

## Overview

The Sentiment Hound project is a hybrid monorepo containing:

- **JavaScript/TypeScript applications** (Next.js, NestJS) managed by Turborepo
- **Python sentiment analysis service** (FastAPI) with its own virtual environment

These scripts provide a seamless development experience for both ecosystems.

## Scripts

### 🔧 Installation Script (`scripts/install.sh`)

**Purpose**: Complete environment setup for both JavaScript and Python components.

**What it does**:

1. Validates required tools (Node.js, pnpm, Python 3.9+)
2. Installs JavaScript dependencies via `pnpm install`
3. Creates a Python virtual environment at `apps/sentiment-analysis-service/venv`
4. Installs Python dependencies from `requirements.txt`
5. Generates Prisma client
6. Makes scripts executable

**Usage**:

```bash
# From project root
./scripts/install.sh
# or
pnpm run install:full
```

**Prerequisites**:

- Node.js 18+
- pnpm
- Python 3.9+

### 🚀 Development Script (`scripts/dev.sh`)

**Purpose**: Start all services (JavaScript + Python) in development mode.

**What it does**:

1. Validates environment setup
2. Starts Turborepo services in the background (`pnpm run dev`)
3. Activates Python virtual environment
4. Starts FastAPI sentiment analysis service on port 8000
5. Provides graceful shutdown on Ctrl+C

**Usage**:

```bash
# From project root
./scripts/dev.sh
# or
pnpm run dev:full
```

**Services started**:

- 📱 Web App: http://localhost:3000
- 🔧 API Server: http://localhost:4000 (or configured port)
- 🧠 Sentiment Analysis: http://localhost:8000
- 📚 Sentiment Analysis API Docs: http://localhost:8000/docs

### 🧠 Python Service Script (`apps/sentiment-analysis-service/dev.sh`)

**Purpose**: Start only the Python sentiment analysis service.

**What it does**:

1. Validates we're in the correct directory
2. Checks for virtual environment
3. Activates virtual environment
4. Starts FastAPI server with hot-reload

**Usage**:

```bash
# From apps/sentiment-analysis-service directory
./dev.sh
```

## Package.json Integration

The following npm scripts have been added to the root `package.json`:

```json
{
  "scripts": {
    "dev:full": "./scripts/dev.sh",
    "install:full": "./scripts/install.sh"
  }
}
```

This allows you to use familiar npm/pnpm commands:

- `pnpm run install:full` - Full environment setup
- `pnpm run dev:full` - Start all services

## Development Workflows

### First Time Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd sentiment-hound-v2

# 2. Run full installation
./scripts/install.sh

# 3. Start development environment
./scripts/dev.sh
```

### Daily Development

```bash
# Start all services
pnpm run dev:full

# Or start services individually:
pnpm run dev                    # JavaScript services only
cd apps/sentiment-analysis-service && ./dev.sh  # Python service only
```

### Python Virtual Environment Management

The scripts automatically manage the Python virtual environment:

- **Location**: `apps/sentiment-analysis-service/venv/`
- **Created by**: `install.sh` script
- **Activated by**: `dev.sh` and `apps/sentiment-analysis-service/dev.sh`

Manual activation (if needed):

```bash
cd apps/sentiment-analysis-service
source venv/bin/activate
# Windows: venv\Scripts\activate
```

## Architecture Benefits

### 🔄 Unified Development Experience

- Single command to start all services
- Consistent logging and error handling
- Graceful shutdown of all processes

### 🛡️ Environment Isolation

- Python dependencies isolated in virtual environment
- JavaScript dependencies managed by pnpm workspaces
- No conflicts between Python and Node.js ecosystems

### 🔧 Development Efficiency

- Hot-reload for both JavaScript and Python services
- FastAPI automatic docs generation
- Turborepo parallel execution and caching

## Troubleshooting

### Common Issues

**Python virtual environment not found**:

```bash
# Solution: Run the install script
./scripts/install.sh
```

**Port conflicts**:

- Web App (3000): Check if other Next.js apps are running
- API Server (4000): Check if other NestJS apps are running
- Sentiment Service (8000): Check if other FastAPI/Uvicorn processes are running

**Permission denied on scripts**:

```bash
# Make scripts executable
chmod +x scripts/*.sh apps/sentiment-analysis-service/dev.sh
```

**Python version issues**:

```bash
# Check Python version
python3 --version
# Should be 3.9 or higher
```

### Manual Cleanup

If processes don't shut down properly:

```bash
# Kill any remaining processes
pkill -f "turbo dev"
pkill -f "uvicorn"
pkill -f "next"
pkill -f "nest"
```

## Future Enhancements

Potential improvements to consider:

- Docker Compose integration for complete containerization
- Environment-specific configurations (dev/staging/prod)
- Health checks for all services
- Logging aggregation
- Process monitoring and auto-restart
- Integration with CI/CD pipelines
