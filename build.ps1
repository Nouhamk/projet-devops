#Build Docker images
param(
    [string]$ProjectName = "trapurcrap"
)

Write-Host "Building Docker images..."

# Check if we're in the right directory
if (!(Test-Path "backend") -or !(Test-Path "frontend")) {
    Write-Error "Run this script from project root (where backend and frontend folders are)"
    exit 1
}

# Build Backend
Write-Host "Building backend..."
Set-Location "backend"
docker build -t "$ProjectName-backend:latest" .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend build failed"
    exit 1
}
Set-Location ".."

# Build Frontend
Write-Host "Building frontend..."
Set-Location "frontend"
docker build -t "$ProjectName-frontend:latest" .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed"
    exit 1
}
Set-Location ".."

Write-Host "Build completed successfully"
docker images | Select-String $ProjectName