@echo off
REM FarmDirect Setup Script for Windows

echo 🌾 FarmDirect - Blockchain Farm-to-Consumer Supply Chain
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd backend
call npm install

if not exist .env (
    echo ⚠️  .env file not found. Creating template...
    (
        echo PORT=5000
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=farm_supply_chain
        echo JWT_SECRET=your_super_secret_jwt_key_change_in_production
        echo JWT_EXPIRE=7d
        echo NODE_ENV=development
    ) > .env
    echo ✅ .env template created. Please update with your database credentials.
)

echo ✅ Backend setup complete!
echo.

REM Frontend Setup
echo 📦 Setting up Frontend...
cd ..\frontend
call npm install
echo ✅ Frontend setup complete!
echo.

REM Database Setup Instructions
echo ============================================================
echo 📊 DATABASE SETUP INSTRUCTIONS
echo ============================================================
echo.
echo 1. Make sure MySQL Server is running
echo 2. Open MySQL command line client
echo 3. Run: source database\schema.sql
echo 4. Optional: source database\sample-data.sql
echo.

echo ============================================================
echo 🚀 STARTING THE APPLICATION
echo ============================================================
echo.
echo 1. Open Terminal 1 and run:
echo    cd backend && npm run dev
echo.
echo 2. Open Terminal 2 and run:
echo    cd frontend && npm start
echo.
echo 3. Open browser: http://localhost:3000
echo.

echo ============================================================
echo ✅ Setup Complete! Happy Farming! 🌾
echo ============================================================
echo.
pause
