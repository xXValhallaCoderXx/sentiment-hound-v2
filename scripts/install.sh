#!/bin/bash

# Sentiment Hound Installation Script
# This script sets up both the JavaScript monorepo and Python sentiment analysis service

set -e  # Exit on any error

echo "🚀 Setting up Sentiment Hound development environment..."

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

# Check for required tools
print_status "Checking for required tools..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check for pnpm
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first:"
    echo "  npm install -g pnpm"
    exit 1
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.9"
if ! python3 -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)"; then
    print_error "Python 3.9+ is required. Found Python $PYTHON_VERSION"
    exit 1
fi

print_success "All required tools are installed"

# Install JavaScript dependencies
print_status "Installing JavaScript dependencies..."
pnpm install
print_success "JavaScript dependencies installed"

# Set up Python virtual environment
VENV_PATH="apps/sentiment-analysis-service/venv"
print_status "Setting up Python virtual environment at $VENV_PATH..."

if [ -d "$VENV_PATH" ]; then
    print_warning "Virtual environment already exists. Removing and recreating..."
    rm -rf "$VENV_PATH"
fi

cd apps/sentiment-analysis-service
python3 -m venv venv

# Activate virtual environment and install dependencies
print_status "Installing Python dependencies..."
source venv/bin/activate

# Upgrade pip to latest version
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

print_success "Python dependencies installed in virtual environment"

# Return to project root
cd ../..

# Generate Prisma client
print_status "Generating Prisma client..."
pnpm turbo db:generate
print_success "Prisma client generated"

# Create convenience scripts
print_status "Creating convenience scripts..."

# Make scripts executable
chmod +x scripts/install.sh
if [ -f "scripts/dev.sh" ]; then
    chmod +x scripts/dev.sh
fi

print_success "Installation completed successfully!"
echo ""
echo "🎉 Setup complete! You can now:"
echo "   • Run 'pnpm run dev' to start the JavaScript services"
echo "   • Run './scripts/dev.sh' to start all services (JS + Python)"
echo "   • Or manually start the Python service:"
echo "     cd apps/sentiment-analysis-service"
echo "     source venv/bin/activate"
echo "     uvicorn main:app --reload --host 0.0.0.0 --port 8000"
