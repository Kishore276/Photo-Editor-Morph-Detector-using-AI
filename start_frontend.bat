@echo off
echo ========================================
echo  Smart Image Prep - Frontend Server
echo ========================================
echo.
echo Starting frontend development server...
echo Frontend will be available at: http://localhost:5173
echo.

REM Change to frontend directory
cd frontend

REM Start the frontend development server
npm run dev

echo.
echo Frontend server stopped.
pause
