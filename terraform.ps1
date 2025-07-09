# Deploy infrastructure with Terraform
param(
    [switch]$Destroy,
    [switch]$PlanOnly
)

Write-Host "Terraform deployment..."
$originalLocation = Get-Location

try {
    # Go to terraform directory if needed
    if (!(Test-Path "main.tf")) {
        if (Test-Path "terraform/main.tf") {
            Set-Location "terraform"
        } else {
            Write-Error "main.tf not found"
            exit 1
        }
    }
    # Initialize
    terraform init
    if ($LASTEXITCODE -ne 0) { exit 1 }

    # Validate
    terraform validate
    if ($LASTEXITCODE -ne 0) { exit 1 }

    if ($Destroy) {
        Write-Host "Destroying infrastructure..."
        terraform destroy -auto-approve
    } elseif ($PlanOnly) {
        terraform plan
    } else {
        # Plan and apply
        terraform plan -out="tfplan"
        if ($LASTEXITCODE -ne 0) { exit 1 }
        
        terraform apply -auto-approve "tfplan"
        if ($LASTEXITCODE -ne 0) { exit 1 }
        
        Write-Host "Infrastructure deployed successfully"
    }
} finally {
    # Always return to original directory
    Set-Location $originalLocation
}