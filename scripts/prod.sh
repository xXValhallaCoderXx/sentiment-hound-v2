#!/bin/bash

# Production Deployment Script
# This script builds and starts the sentiment analysis platform in production mode

echo "🚀 Starting Sentiment Hound Production Deployment"

# Function to cleanup on exit
cleanup() {
    echo "🧹 Stopping production services..."
    jobs -p | xargs kill 2>/dev/null
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Ensure database is running
echo "🗃️ Starting database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Generate Prisma client and run migrations
echo "📦 Preparing database..."
pnpm turbo db:generate
pnpm turbo db:migrate --auto

# Build all applications
echo "🏗️ Building applications for production..."
pnpm turbo build

# Start applications
echo "🌐 Starting production applications..."
echo "📝 Web will be available on port 3000"
echo "📝 Server will be available on configured port"
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Start web in background
pnpm --filter web start &

# Start server in foreground (so we can see logs)
pnpm --filter server start:prod

# Cleanup will be called automatically on script exit
