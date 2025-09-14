#!/bin/bash

echo "Starting ClimateFlow Development Environment..."
echo

echo "Starting Python Backend Server..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting React Frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting up..."
echo "Python Backend: http://localhost:5000"
echo "React Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
