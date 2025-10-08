# Aviation Compliance API - Production Deployment Script
# Fixed UTF-8 encoding and consolidated deployment for Azure Container Apps

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Enable UTF-8 for PowerShell session
chcp 65001

Write-Host "🚀 Starting Aviation Compliance API Production Deployment" -ForegroundColor Green

# Configuration
$resourceGroup = "aviation-compliance-rg"
$location = "East US"
$containerAppName = "aviation-compliance-app"
$containerAppEnvName = "aviation-compliance-env"
$acrName = "aviationcomplianceacr"
$imageName = "aviation-compliance-api"
$imageTag = "production-v4.0.0"

try {
    Write-Host "📋 Step 1: Verifying Azure CLI and login status..." -ForegroundColor Cyan
    
    # Check Azure CLI installation
    $azVersion = az --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Azure CLI is not installed. Please install Azure CLI first."
    }
    
    # Check login status
    $accountInfo = az account show 2>$null | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Logged in as: $($accountInfo.user.name)" -ForegroundColor Green
    Write-Host "📊 Subscription: $($accountInfo.name) ($($accountInfo.id))" -ForegroundColor Green

    Write-Host "`n📦 Step 2: Installing required extensions..." -ForegroundColor Cyan
    az extension add --name containerapp --only-show-errors
    az extension add --name log-analytics --only-show-errors

    Write-Host "`n🏗️ Step 3: Creating resource group..." -ForegroundColor Cyan
    $rgExists = az group exists --name $resourceGroup
    if ($rgExists -eq "false") {
        az group create --name $resourceGroup --location $location --output table
        if ($LASTEXITCODE -ne 0) { throw "Failed to create resource group" }
        Write-Host "✅ Resource group created successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ Resource group already exists" -ForegroundColor Green
    }

    Write-Host "`n🐳 Step 4: Creating Azure Container Registry..." -ForegroundColor Cyan
    $acrExists = az acr show --name $acrName --resource-group $resourceGroup 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating new ACR: $acrName" -ForegroundColor Yellow
        az acr create --resource-group $resourceGroup --name $acrName --sku Basic --output table
        if ($LASTEXITCODE -ne 0) { throw "Failed to create ACR" }
        Write-Host "✅ ACR created successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ ACR already exists" -ForegroundColor Green
    }

    Write-Host "`n🔐 Step 5: Enabling ACR admin and getting credentials..." -ForegroundColor Cyan
    az acr update -n $acrName --admin-enabled true --output none
    $acrServer = az acr show --name $acrName --query loginServer --output tsv
    $acrUsername = az acr credential show --name $acrName --query username --output tsv
    $acrPassword = az acr credential show --name $acrName --query passwords[0].value --output tsv

    Write-Host "✅ ACR Server: $acrServer" -ForegroundColor Green

    Write-Host "`n🏗️ Step 6: Building and pushing Docker image..." -ForegroundColor Cyan
    Write-Host "Using production Dockerfile: Dockerfile.production" -ForegroundColor Yellow
    
    # Build image with production configuration
    docker build -t "${acrServer}/${imageName}:${imageTag}" -f Dockerfile.production . --build-arg BUILD_DATE=$(Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ") --build-arg VERSION="4.0.0"
    if ($LASTEXITCODE -ne 0) { throw "Failed to build Docker image" }
    
    # Login to ACR
    az acr login --name $acrName
    if ($LASTEXITCODE -ne 0) { throw "Failed to login to ACR" }
    
    # Push image
    docker push "${acrServer}/${imageName}:${imageTag}"
    if ($LASTEXITCODE -ne 0) { throw "Failed to push Docker image" }
    
    Write-Host "✅ Docker image built and pushed successfully" -ForegroundColor Green

    Write-Host "`n🌐 Step 7: Creating Container Apps Environment..." -ForegroundColor Cyan
    $envExists = az containerapp env show --name $containerAppEnvName --resource-group $resourceGroup 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating new Container Apps Environment" -ForegroundColor Yellow
        az containerapp env create --name $containerAppEnvName --resource-group $resourceGroup --location $location --output table
        if ($LASTEXITCODE -ne 0) { throw "Failed to create Container Apps Environment" }
        Write-Host "✅ Container Apps Environment created successfully" -ForegroundColor Green
    } else {
        Write-Host "✅ Container Apps Environment already exists" -ForegroundColor Green
    }

    Write-Host "`n🚀 Step 8: Deploying Container App..." -ForegroundColor Cyan
    
    # Check if container app exists
    $appExists = az containerapp show --name $containerAppName --resource-group $resourceGroup 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Creating new Container App" -ForegroundColor Yellow
        az containerapp create `
            --name $containerAppName `
            --resource-group $resourceGroup `
            --environment $containerAppEnvName `
            --image "${acrServer}/${imageName}:${imageTag}" `
            --registry-server $acrServer `
            --registry-username $acrUsername `
            --registry-password $acrPassword `
            --target-port 8000 `
            --ingress external `
            --min-replicas 1 `
            --max-replicas 3 `
            --cpu 1.0 `
            --memory 2Gi `
            --env-vars "ENVIRONMENT=production" "PORT=8000" "API_HOST=0.0.0.0" `
            --output table
        
        if ($LASTEXITCODE -ne 0) { throw "Failed to create Container App" }
        Write-Host "✅ Container App created successfully" -ForegroundColor Green
    } else {
        Write-Host "Updating existing Container App" -ForegroundColor Yellow
        az containerapp update `
            --name $containerAppName `
            --resource-group $resourceGroup `
            --image "${acrServer}/${imageName}:${imageTag}" `
            --output table
        
        if ($LASTEXITCODE -ne 0) { throw "Failed to update Container App" }
        Write-Host "✅ Container App updated successfully" -ForegroundColor Green
    }

    # Get the application URL
    $appUrl = az containerapp show --name $containerAppName --resource-group $resourceGroup --query properties.configuration.ingress.fqdn --output tsv
    $fullUrl = "https://$appUrl"

    Write-Host "`n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "🌐 Application URL: $fullUrl" -ForegroundColor Cyan
    Write-Host "📚 API Documentation: $fullUrl/docs" -ForegroundColor Cyan  
    Write-Host "❤️ Health Check: $fullUrl/health" -ForegroundColor Cyan
    Write-Host "📊 Analytics: $fullUrl/analytics/fleet-metrics" -ForegroundColor Cyan
    Write-Host "✈️ Aircraft Models: $fullUrl/aircraft/models" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green

    Write-Host "`n🔍 Step 9: Testing deployment..." -ForegroundColor Cyan
    Write-Host "Waiting for container to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30

    try {
        Write-Host "Testing health endpoint..." -ForegroundColor Yellow
        $healthResponse = Invoke-RestMethod -Uri "$fullUrl/health" -Method Get -TimeoutSec 30
        Write-Host "✅ Health check passed: $($healthResponse.status)" -ForegroundColor Green
        
        Write-Host "Testing aircraft models endpoint..." -ForegroundColor Yellow
        $modelsResponse = Invoke-RestMethod -Uri "$fullUrl/aircraft/models" -Method Get -TimeoutSec 30
        Write-Host "✅ Aircraft models loaded: $($modelsResponse.total_models)" -ForegroundColor Green
        
        Write-Host "`n🎯 All tests passed! API is ready for use." -ForegroundColor Green -BackgroundColor Black
        
    } catch {
        Write-Host "⚠️ Warning: API tests failed, but deployment completed. The service may need a few more minutes to start." -ForegroundColor Yellow
        Write-Host "Please check the health endpoint manually: $fullUrl/health" -ForegroundColor Yellow
    }

    Write-Host "`n📝 Resource Information:" -ForegroundColor Magenta
    Write-Host "Resource Group: $resourceGroup" -ForegroundColor White
    Write-Host "Container Registry: $acrName" -ForegroundColor White
    Write-Host "Container App: $containerAppName" -ForegroundColor White
    Write-Host "Environment: $containerAppEnvName" -ForegroundColor White
    Write-Host "Image: ${acrServer}/${imageName}:${imageTag}" -ForegroundColor White

} catch {
    Write-Host "`n❌ DEPLOYMENT FAILED!" -ForegroundColor Red -BackgroundColor Black
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nFor troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Check Azure CLI installation and login status" -ForegroundColor White
    Write-Host "2. Verify resource group and subscription permissions" -ForegroundColor White
    Write-Host "3. Check Docker installation and image build process" -ForegroundColor White
    Write-Host "4. Review Azure Container Apps service limits" -ForegroundColor White
    exit 1
}

Write-Host "`n🚀 Deployment script completed successfully!" -ForegroundColor Green