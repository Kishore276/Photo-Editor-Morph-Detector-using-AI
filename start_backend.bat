@echo off
echo ========================================
echo  Smart Image Prep - Backend Server
echo ========================================
echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:8001
echo API docs will be available at: http://localhost:8001/docs
echo.

REM Activate virtual environment if it exists
if exist venv\Scripts\activate (
    call venv\Scripts\activate
)

REM Start the backend server
python api_server_simple.py

echo.
echo Backend server stopped.
pause
