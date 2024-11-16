# PowerShell script to install Python dependencies
Write-Host "Installing Python dependencies..."
pip install -r backend/requirements.txt

Write-Host "Setting up npm packages (if any)..."
npm install

Write-Host "Installation complete!"
