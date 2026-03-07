@echo off
echo ========================================
echo   CodeGuard AI - Starting Application
echo ========================================
echo.

REM Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found
    pause
    exit /b 1
)

REM Check Node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found
    pause
    exit /b 1
)

echo [OK] Prerequisites check passed
echo.

REM Start Backend
echo ========================================
echo   Starting Backend on port 8000...
echo ========================================
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

if not exist ".installed" (
    echo Installing dependencies...
    pip install -r requirements.txt
    type nul > .installed
)

echo Starting FastAPI...
start /b python main.py
timeout /t 3 /nobreak >nul

REM Start Frontend  
echo.
echo ========================================
echo   Starting Frontend on port 5173...
echo ========================================
cd ..\frontend

if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

if not exist ".env" (
    copy .env.example .env
)

echo.
echo ========================================
echo   CodeGuard AI is Running!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev

pause
