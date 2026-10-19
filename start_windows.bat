@echo off
cd /d "%~dp0"
node --version >nul 2>&1
if errorlevel 1 (
 echo Install Node.js 24 or newer, then run this file again.
 pause
 exit /b 1
)
echo Open http://127.0.0.1:3210 in your browser.
node --env-file-if-exists=.env server.mjs
pause
