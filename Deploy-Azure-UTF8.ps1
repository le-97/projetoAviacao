# PowerShell script para deploy no Azure
# Deploy-Azure-Fixed-UTF8.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "rg-aviation-compliance",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "eastus",
    
    [Parameter(Mandatory=$false)]
    [string]$RegistryName = "aviationcomplianceregistry",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "aviation-compliance-api",
    
    [Parameter(Mandatory=$false)]
    [string]$EnvironmentName = "aviation-compliance-env",
    
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest",
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild
)

# Configurations
$ErrorActionPreference = "Stop"
$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8

# Colors for output
function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [ValidateSet("Green", "Yellow", "Red", "Blue", "White")]
        [string]$Color = "White"
    )
    
    $colorMap = @{
        "Green" = "Green"
        "Yellow" = "Yellow" 
        "Red" = "Red"
        "Blue" = "Cyan"
        "White" = "White"
    }
    
    Write-Host $Message -ForegroundColor $colorMap[$Color]
}

function Write-Success { param([string]$Message) Write-ColorOutput -Message "✅ $Message" -Color "Green" }
function Write-Info { param([string]$Message) Write-ColorOutput -Message "ℹ️ $Message" -Color "Blue" }
function Write-Warning { param([string]$Message) Write-ColorOutput -Message "⚠️ $Message" -Color "Yellow" }
function Write-Error { param([string]$Message) Write-ColorOutput -Message "❌ $Message" -Color "Red"; exit 1 }

# Test Azure CLI
function Test-AzureCLI {
    Write-Info "Testing Azure CLI..."
    
    try {
        $null = az --version
        Write-Success "Azure CLI is installed and ready"
    }
    catch {
        Write-Error "Azure CLI not found. Please install from https://docs.microsoft.com/en-us/cli/azure/"
    }
}

# Test Azure Login
function Test-AzureLogin {
    Write-Info "Checking Azure login status..."
    
    try {
        $account = az account show | ConvertFrom-Json
        Write-Success "Logged in as: $($account.user.name)"
        Write-Info "Subscription: $($account.name) ($($account.id))"
    }
    catch {
        Write-Error "Not logged into Azure. Please run 'az login' first"
    }
}

# Create Resource Group
function New-ResourceGroup {
    Write-Info "Creating Resource Group: $ResourceGroup"
    
    $rgExists = az group show --name $ResourceGroup 2>$null
    
    if (-not $rgExists) {
        az group create --name $ResourceGroup --location $Location --output table
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create Resource Group"
        }
        Write-Success "Resource Group created successfully"
    }
    else {
        Write-Warning "Resource Group already exists"
    }
}

# Create Container Registry
function New-ContainerRegistry {
    Write-Info "Creating Container Registry: $RegistryName"
    
    $registryExists = az acr show --name $RegistryName --resource-group $ResourceGroup 2>$null
    
    if (-not $registryExists) {
        az acr create `
            --resource-group $ResourceGroup `
            --name $RegistryName `
            --sku Basic `
            --admin-enabled true `
            --output table
            
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create Container Registry"
        }
        Write-Success "Container Registry created successfully"
    }
    else {
        Write-Warning "Container Registry already exists"
    }
}

# Build and Push Image
function Build-AndPushImage {
    if ($SkipBuild) {
        Write-Warning "Skipping build as requested"
        return
    }
    
    Write-Info "Building and pushing Docker image..."
    
    $imageName = "$RegistryName.azurecr.io/aviation-compliance-api:$ImageTag"
    
    # Build image using optimized Dockerfile
    Write-Info "Building Docker image: $imageName"
    docker build -f Dockerfile.simple -t $imageName .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build Docker image"
    }
    
    # Login to registry
    Write-Info "Logging into Container Registry..."
    az acr login --name $RegistryName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to login to Container Registry"
    }
    
    # Push image
    Write-Info "Pushing image to registry..."
    docker push $imageName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push image to registry"
    }
    
    Write-Success "Image built and pushed successfully"
}

# Create Container Apps Environment
function New-ContainerAppsEnvironment {
    Write-Info "Creating Container Apps Environment: $EnvironmentName"
    
    $envExists = az containerapp env show --name $EnvironmentName --resource-group $ResourceGroup 2>$null
    
    if (-not $envExists) {
        az containerapp env create `
            --name $EnvironmentName `
            --resource-group $ResourceGroup `
            --location $Location `
            --output table
            
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create Container Apps Environment"
        }
        Write-Success "Container Apps Environment created successfully"
    }
    else {
        Write-Warning "Container Apps Environment already exists"
    }
}

# Deploy Container App
function Deploy-ContainerApp {
    Write-Info "Deploying Container App: $AppName"
    
    # Get registry credentials
    $registryCredentials = az acr credential show --name $RegistryName | ConvertFrom-Json
    $registryUsername = $registryCredentials.username
    $registryPassword = $registryCredentials.passwords[0].value
    
    $imageName = "$RegistryName.azurecr.io/aviation-compliance-api:$ImageTag"
    
    $appExists = az containerapp show --name $AppName --resource-group $ResourceGroup 2>$null
    
    if ($appExists) {
        Write-Info "Updating existing Container App..."
        az containerapp update `
            --name $AppName `
            --resource-group $ResourceGroup `
            --image $imageName `
            --output table
    }
    else {
        Write-Info "Creating new Container App..."
        az containerapp create `
            --name $AppName `
            --resource-group $ResourceGroup `
            --environment $EnvironmentName `
            --image $imageName `
            --registry-server "$RegistryName.azurecr.io" `
            --registry-username $registryUsername `
            --registry-password $registryPassword `
            --target-port 8000 `
            --ingress external `
            --min-replicas 1 `
            --max-replicas 10 `
            --cpu 1.0 `
            --memory 2.0Gi `
            --env-vars `
                "ENVIRONMENT=production" `
                "API_HOST=0.0.0.0" `
                "API_PORT=8000" `
                "LOG_LEVEL=INFO" `
                "CORS_ORIGINS=*" `
                "APP_NAME=Aviation Compliance API" `
                "APP_VERSION=3.0.0" `
            --output table
            
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to deploy Container App"
        }
    }
    
    Write-Success "Container App deployed successfully"
}

# Get Deployment Info
function Get-DeploymentInfo {
    Write-Info "Getting deployment information..."
    
    try {
        $app = az containerapp show --name $AppName --resource-group $ResourceGroup | ConvertFrom-Json
        $appUrl = "https://$($app.properties.configuration.ingress.fqdn)"
        
        Write-Success "🌐 Application URLs:"
        Write-Host "   API: $appUrl" -ForegroundColor Cyan
        Write-Host "   Health: $appUrl/health" -ForegroundColor Cyan
        Write-Host "   Docs: $appUrl/docs" -ForegroundColor Cyan
        
        return $appUrl
    }
    catch {
        Write-Error "Failed to get deployment information: $($_.Exception.Message)"
    }
}

# Test Deployment
function Test-Deployment {
    param([string]$AppUrl)
    
    Write-Info "Testing deployment..."
    
    # Wait for application to initialize
    Write-Info "Waiting for application to initialize (30 seconds)..."
    Start-Sleep -Seconds 30
    
    try {
        # Test health check
        Write-Info "Testing health check..."
        $healthResponse = Invoke-RestMethod -Uri "$AppUrl/health" -Method Get -TimeoutSec 30
        
        if ($healthResponse.status -eq "healthy") {
            Write-Success "Health check passed - API is operational"
            Write-Info "Aircraft models loaded: $($healthResponse.aircraft_models_loaded)"
        }
        else {
            Write-Warning "Health check returned non-healthy status: $($healthResponse.status)"
        }
        
        # Test API endpoints
        Write-Info "Testing API endpoints..."
        $modelsResponse = Invoke-RestMethod -Uri "$AppUrl/aircraft/models" -Method Get -TimeoutSec 30
        Write-Success "API endpoints responding correctly"
        Write-Info "Total aircraft models: $($modelsResponse.total_models)"
        
    }
    catch {
        Write-Warning "Deployment test failed: $($_.Exception.Message)"
        Write-Info "The application may still be starting up. Try accessing $AppUrl manually."
    }
}

# Main deployment function
function Deploy-ToAzure {
    Write-Info "🚀 Starting Aviation Compliance API deployment to Azure"
    Write-Info "============================================================"
    
    Test-AzureCLI
    Test-AzureLogin
    New-ResourceGroup
    New-ContainerRegistry
    Build-AndPushImage
    New-ContainerAppsEnvironment
    Deploy-ContainerApp
    
    $appUrl = Get-DeploymentInfo
    Test-Deployment -AppUrl $appUrl
    
    Write-Success "🎉 Deployment completed successfully!"
    Write-Info "============================================================"
    
    Write-Host ""
    Write-Success "📋 Deployment Summary:"
    Write-Host "   Resource Group: $ResourceGroup" -ForegroundColor Gray
    Write-Host "   Container Registry: $RegistryName" -ForegroundColor Gray
    Write-Host "   Container App: $AppName" -ForegroundColor Gray
    Write-Host "   Location: $Location" -ForegroundColor Gray
    Write-Host ""
    
    Write-Success "🎯 Application available at: $appUrl"
}

# Execute deployment
try {
    Deploy-ToAzure
}
catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    Write-Info "Check the logs above for more details"
    exit 1
}