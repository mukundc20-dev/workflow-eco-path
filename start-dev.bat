@echo off
echo Starting ClimateFlow Development Environment...
echo.

echo Starting Python Backend Server...
start "Python Backend" cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python app.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting up...
echo Python Backend: http://localhost:5000
echo React Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
