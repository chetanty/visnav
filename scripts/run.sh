# PowerShell script to run the project
Write-Host "Starting Python backend..."
Start-Process "python" -ArgumentList "backend/eye_tracking.py"

Write-Host "Launching web application..."
Start-Process "frontend/index.html"
