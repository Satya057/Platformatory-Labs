@echo off
echo 🚀 Platformatory Labs Interview Task Setup
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install:all

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Google OAuth2
        echo GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
        echo GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
        echo.
        echo # CRUD CRUD API
        echo CRUDCRUD_API_URL=https://crudcrud.com/api
        echo CRUDCRUD_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
    ) > .env
    echo ⚠️  Please update the .env file with your actual credentials
)

REM Create data directory
if not exist backend\data mkdir backend\data

echo ✅ Setup completed!
echo.
echo 📋 Next steps:
echo 1. Update .env file with your Google OAuth2 credentials
echo 2. Get your crudcrud.com API key
echo 3. Run 'npm start' to start the application
echo.
echo 🔗 Useful commands:
echo   npm start          - Start with Docker
echo   npm run dev        - Start in development mode
echo   npm run docker:logs - View logs
echo   npm run docker:down - Stop services
pause 