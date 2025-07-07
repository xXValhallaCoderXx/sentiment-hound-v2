#!/bin/bash

# Full Development Script with Hot-Reloading
# This script provides the optimal development experience by:
# 1. Starting service watchers for automatic rebuilding
# 2. Starting web and server apps
# 3. Handling cleanup on exit

echo "🚀 Starting Sentiment Hound Development Environment"

# Function to kill background processes on script exit
cleanup() {
    echo "🧹 Cleaning up background processes..."
    jobs -p | xargs kill 2>/dev/null
    exit 0
}

# Set up trap to call cleanup function on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start service watchers in background
echo "📦 Starting service watchers (packages/database, packages/services)..."
pnpm turbo dev:watch --filter="@repo/db" --filter="@repo/services" &
SERVICE_WATCHER_PID=$!

# Give services a moment to start building
sleep 3

# Start apps in foreground
echo "🌐 Starting applications (web, server)..."
echo "📝 Note: Service changes will auto-rebuild and apps will pick up updates"
echo "🛑 Press Ctrl+C to stop all services"
echo ""

pnpm turbo dev --filter="web" --filter="server"

# Script will reach here when dev command exits
cleanup
