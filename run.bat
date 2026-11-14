@echo off
setlocal enabledelayedexpansion

title Jain Sarafa Thella - E-Commerce Platform

echo ==============================================================================
echo           Jain Sarafa Thella (JST) E-Commerce Platform Launcher
echo ==============================================================================
echo.

:: Ensure working directory is the script folder
cd /d "%~dp0"

:: 1. Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not found in your PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check npm installation
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not found in your PATH.
    echo Please ensure npm is installed and try again.
    echo.
    pause
    exit /b 1
)

:: 3. Check for .env.local; if missing, initialize from .env.example
if not exist ".env.local" (
    if exist ".env.example" (
        echo [INFO] .env.local not found. Creating from .env.example...
        copy ".env.example" ".env.local" >nul
        echo [OK] Created .env.local with default configuration.
    ) else (
        echo [WARNING] Neither .env.local nor .env.example was found.
    )
    echo.
)

:: 4. Check for node_modules; install dependencies if missing
if not exist "node_modules" (
    echo [INFO] Dependencies not detected. Running 'npm install'...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed. Please check the logs above.
        pause
        exit /b %ERRORLEVEL%
    )
    echo.
)

:: 5. Open browser after server begins starting
echo [INFO] Starting Next.js development server...
echo [INFO] Local URL: http://localhost:3000
echo.
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

:: 6. Launch development server
call npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Application terminated unexpectedly.
    pause
)
