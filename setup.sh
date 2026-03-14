#!/bin/bash

# Setup script for CI/CD Security Dashboard
# This script sets up both backend and frontend

echo "🔒 Setting up CI/CD Security Dashboard..."
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or higher."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20 or higher."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop."
    exit 1
fi

echo "✅ All prerequisites are installed"
echo ""

# Install Trivy if not already installed
if ! command -v trivy &> /dev/null; then
    echo "Installing Trivy..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install aquasecurity/trivy/trivy
    else
        echo "Please install Trivy manually: https://aquasecurity.github.io/trivy/latest/getting-started/installation/"
        exit 1
    fi
else
    echo "✅ Trivy is already installed"
fi

echo ""

# Setup backend
echo "Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete"
echo ""

# Setup frontend
cd ../frontend
echo "Setting up frontend..."

echo "Installing npm dependencies..."
npm install

echo "✅ Frontend setup complete"
echo ""

# Create .env files if they don't exist
cd ..
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env from template"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  Option 1 (Docker): docker-compose up --build"
echo "  Option 2 (Manual):"
echo "    Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "    Terminal 2: cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
