@echo off
title TITAN Autonomous Swarm Studio
cd /d "%~dp0"

echo ======================================================================
echo       TITAN LABS -- AUTONOMOUS SWARM STUDIO (v1.0.0)
echo    Deterministic Product Intelligence & Multi-Agent Orchestrator
echo ======================================================================
echo.
echo Starting Autonomous Swarm Server on http://localhost:8800 ...
echo.

start "" "http://localhost:8800"
py -m titan_orchestrator.server

pause
