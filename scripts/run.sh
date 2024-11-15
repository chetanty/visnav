#!/bin/bash
echo "Starting Python backend..."
python3 backend/eye_tracking.py &

echo "Launching web application..."
open frontend/index.html
