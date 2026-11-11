@echo off
rem MoviePilot-Lite backend launcher (Windows)
rem CONFIG_DIR + app.env are applied by scripts\start_lite.py
setlocal
cd /d "%~dp0"
if not exist "%~dp0venv\Scripts\python.exe" (
  echo venv python not found: %~dp0venv\Scripts\python.exe
  exit /b 1
)
"%~dp0venv\Scripts\python.exe" "%~dp0scripts\start_lite.py"
