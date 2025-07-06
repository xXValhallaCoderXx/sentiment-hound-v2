#!/bin/bash

# Sentiment Analysis Service Development Script
# This script starts only the Python sentiment analysis service

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the sentiment analysis service directory
if [ ! -f "main.py" ] || [ ! -f "requirements.txt" ]; then
    print_error "This script must be run from the apps/sentiment-analysis-service directory"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_error "Python virtual environment not found"
    print_status "Please run '../../scripts/install.sh' from the project root first"
    exit 1
fi

print_status "🧠 Starting Sentiment Analysis Service..."

# Activate virtual environment and start the service
source venv/bin/activate
print_success "Virtual environment activated"

print_status "Starting FastAPI server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000
