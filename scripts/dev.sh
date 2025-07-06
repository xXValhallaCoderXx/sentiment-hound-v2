#!/bin/bash

# Sentiment Hound Development Script
# This script starts both the JavaScript monorepo and Python sentiment analysis service

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root
if [ ! -f "package.json" ] || [ ! -f "turbo.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check if virtual environment exists
VENV_PATH="apps/sentiment-analysis-service/venv"
if [ ! -d "$VENV_PATH" ]; then
    print_error "Python virtual environment not found at $VENV_PATH"
    print_status "Please run './scripts/install.sh' first to set up the environment"
    exit 1
fi

# --- Insert tmux logic here ---
if command -v tmux >/dev/null 2>&1; then
    print_status "tmux detected. Launching services in a split tmux session ('sentiment-dev')..."

    # If already inside tmux, open a new window; else, create a new session
    if [ -n "$TMUX" ]; then
        tmux new-window -n sentiment-dev
        tmux send-keys -t sentiment-dev "pnpm run dev" C-m
        tmux split-window -h -t sentiment-dev
        tmux send-keys -t sentiment-dev "cd apps/sentiment-analysis-service && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000" C-m
        tmux select-pane -t sentiment-dev.0
    else
        tmux new-session -d -s sentiment-dev -n dev "pnpm run dev"
        tmux split-window -h -t sentiment-dev:dev
        tmux send-keys -t sentiment-dev:dev.1 "cd apps/sentiment-analysis-service && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000" C-m
        tmux select-pane -t sentiment-dev:dev.0
        tmux attach-session -t sentiment-dev
    fi
    exit 0
fi
# --- End tmux logic ---

# Store PIDs for cleanup
TURBO_PID=""
PYTHON_PID=""

# Cleanup function
cleanup() {
    print_status "Shutting down services..."
    
    if [ ! -z "$PYTHON_PID" ]; then
        print_status "Stopping Python sentiment analysis service (PID: $PYTHON_PID)..."
        kill $PYTHON_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$TURBO_PID" ]; then
        print_status "Stopping Turborepo services (PID: $TURBO_PID)..."
        kill $TURBO_PID 2>/dev/null || true
        # Also kill any remaining turbo processes
        pkill -f "turbo dev" 2>/dev/null || true
    fi
    
    print_success "All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

print_status "🚀 Starting Sentiment Hound development environment..."

# Start Turborepo in the background
print_status "Starting Turborepo services..."
pnpm run dev &
TURBO_PID=$!
print_success "Turborepo services started (PID: $TURBO_PID)"

# Give Turborepo a moment to start
sleep 3

# Start Python sentiment analysis service
print_status "Starting Python sentiment analysis service..."
cd apps/sentiment-analysis-service

# Activate virtual environment and start the service in the background
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
PYTHON_PID=$!
cd ../..

print_success "Python sentiment analysis service started (PID: $PYTHON_PID)"

print_success "🎉 All services are running!"
echo ""
echo "Services available at:"
echo "  📱 Web App: http://localhost:3000"
echo "  🔧 API Server: http://localhost:4000"
echo "  🧠 Sentiment Analysis: http://localhost:8000"
echo "  📚 Sentiment Analysis Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
