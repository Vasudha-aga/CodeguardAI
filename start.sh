#!/bin/bash

echo "========================================="
echo "  CodeGuard AI - Starting Application"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR] Python 3 not found${NC}"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js not found${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] Prerequisites check passed${NC}"
echo ""

# Start Backend
echo "========================================="
echo "  Starting Backend on port 8000..."
echo "========================================="
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

if [ ! -f ".installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch .installed
fi

echo "Starting FastAPI..."
python main.py &
BACKEND_PID=$!
sleep 3

# Start Frontend
echo ""
echo "========================================="
echo "  Starting Frontend on port 5173..."
echo "========================================="
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

echo ""
echo "========================================="
echo "  CodeGuard AI is Running!"
echo "========================================="
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

trap cleanup INT

npm run dev
