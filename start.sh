#!/bin/bash

# Start script for development (runs both backend and frontend)

echo "🚀 Starting CI/CD Security Dashboard..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Ensure stale listeners do not force Vite to switch from 3000 to 3001.
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
pkill -f "vite" 2>/dev/null
pkill -f "uvicorn main:app" 2>/dev/null

# Give the OS a brief moment to release sockets.
sleep 1

# Start backend
echo "Starting backend on http://localhost:8000..."
cd backend
"$PWD/../.venv/bin/python" -m uvicorn main:app --host 127.0.0.1 --port 8000 --app-dir "$PWD" &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend on http://localhost:3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo ""
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait
