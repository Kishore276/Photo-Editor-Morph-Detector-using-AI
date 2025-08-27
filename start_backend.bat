@echo off
echo ========================================
echo  Smart Image Prep - Backend Server
echo ========================================
echo.
echo Starting backend server...
echo Backend will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/docs
echo.

REM Activate virtual environment
call venv\Scripts\activate

REM Start the backend server
python api_server_hybrid.py

echo.
echo Backend server stopped.
pause
