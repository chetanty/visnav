#!/bin/bash
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "Setting up npm packages..."
npm install

echo "Installation complete!"
