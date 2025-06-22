#!/bin/bash

# Railway build script for sentiment-hound-v2
# This script ensures proper build order with database dependencies

echo "🚀 Starting Railway build..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm --filter @repo/db run db:generate

# Build all packages in correct order
echo "🏗️ Building packages..."
pnpm --filter @repo/db run build
pnpm --filter @repo/services run build

# Build the web application
echo "🌐 Building web application..."
pnpm --filter web run build

echo "✅ Build completed successfully!"
