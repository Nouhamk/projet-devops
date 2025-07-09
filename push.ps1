# Push images to Azure Container Registry
param(
    [string]$AcrName = "acrtrapurcrap",
    [string]$ProjectName = "trapurcrap"
)

Write-Host "Pushing images to Azure Container Registry..."

# Login to ACR
az acr login --name $AcrName
if ($LASTEXITCODE -ne 0) {
    Write-Error "ACR login failed"
    exit 1
}

$acrServer = "$AcrName.azurecr.io"

# Tag and push backend
Write-Host "Pushing backend..."
docker tag "$ProjectName-backend:latest" "$acrServer/$ProjectName-backend:latest"
docker push "$acrServer/$ProjectName-backend:latest"

# Tag and push frontend
Write-Host "Pushing frontend..."
docker tag "$ProjectName-frontend:latest" "$acrServer/$ProjectName-frontend:latest"
docker push "$acrServer/$ProjectName-frontend:latest"

Write-Host "Push completed successfully"
az acr repository list --name $AcrName --output table