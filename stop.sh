#!/bin/bash

# Stop script for CI/CD Security Dashboard

echo "🛑 Stopping CI/CD Security Dashboard..."
echo ""

# Stop backend (uvicorn)
echo "Stopping backend server..."
pkill -f "uvicorn main:app" 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend stopped"
else
    echo "✅ Backend was not running"
fi

# Stop frontend (vite/npm)
echo "Stopping frontend server..."
pkill -f "vite" 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend stopped"
else
    echo "✅ Frontend was not running"
fi

# Clean up any remaining npm processes for this project
pkill -f "npm run dev" 2>/dev/null

echo ""
echo "✅ All services stopped!"
echo ""
echo "To restart, run:"
echo "  ./start.sh"
echo "  or"
echo "  docker-compose up --build"
