@echo off
echo Setting up Node.js environment...
set PATH=%PATH%;C:\Program Files\nodejs
echo Installing dependencies...
npm install
echo.
echo Installation complete!
echo.
echo To start the development server, run: npm run dev
pause
