#!/bin/bash

# Database Deployment Script
# This script handles database migrations and seeding for production deployments

set -e  # Exit on any error

echo "🚀 Starting database deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the packages/database directory"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "📊 DATABASE_URL is set"

# Step 1: Deploy migrations (non-interactive, safe for production)
echo "🔄 Deploying database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration deployment failed!"
    exit 1
fi

echo "✅ Migrations deployed successfully"

# Step 2: Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma client generation failed!"
    exit 1
fi

echo "✅ Prisma client generated successfully"

# Step 3: Build the seed script
echo "🏗️ Building seed script..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Step 4: Run database seeding
echo "🌱 Seeding database with core application data..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Database seeding failed!"
    exit 1
fi

echo "✅ Database seeded successfully"

echo "🎉 Database deployment completed successfully!"
echo ""
echo "Summary:"
echo "- ✅ Migrations deployed"
echo "- ✅ Prisma client generated" 
echo "- ✅ Seed script built"
echo "- ✅ Core data seeded (Plans and Providers)"
echo ""
echo "Your database is now ready for production use!"