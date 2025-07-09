#Complete deployment
param(
    [switch]$SkipBuild,
    [switch]$SkipInfra,
    [switch]$SkipPush
)

Write-Host "Starting complete deployment..."

try {
    # Build Docker images
    if (!$SkipBuild) {
        Write-Host "Step 1: Building Docker images..."
        .\build.ps1
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }

    # Push images to Azure
    if (!$SkipPush) {
        Write-Host "Step 2: Pushing images to Azure..."
        .\push.ps1
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }

    # Deploy infrastructure
    if (!$SkipInfra) {
        Write-Host "Step 3: Deploying infrastructure..."
        .\terraform.ps1
        if ($LASTEXITCODE -ne 0) { exit 1 }
    }

    Write-Host "Deployment completed successfully!"
    
} catch {
    Write-Error "Deployment failed: $_"
    exit 1
}