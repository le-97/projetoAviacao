# PowerShell script para deploy no Azure
# Deploy-Azure.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "rg-aviation-compliance",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "brazilsouth",
    
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

# Configura??es
$ErrorActionPreference = "Stop"

# Cores para output
function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [ValidateSet("Green", "Yellow", "Red", "Blue", "White")]
        [string]$Color = "White"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Success { param([string]$Message) Write-ColorOutput -Message "[OK] $Message" -Color Green }
function Write-Info { param([string]$Message) Write-ColorOutput -Message "[INFO] $Message" -Color Blue }
function Write-Warning { param([string]$Message) Write-ColorOutput -Message "[WARN] $Message" -Color Yellow }
function Write-Error { param([string]$Message) Write-ColorOutput -Message "[ERROR] $Message" -Color Red }

# Verificar se Azure CLI est? instalado
function Test-AzureCLI {
    Write-Info "Verificando Azure CLI..."
    
    try {
        $azVersion = az --version 2>$null
        if (-not $azVersion) {
            throw "Azure CLI n?o encontrado"
        }
        Write-Success "Azure CLI encontrado"
    }
    catch {
        Write-Error "Azure CLI n?o est? instalado. Instale de: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        exit 1
    }
}

# Verificar login no Azure
function Test-AzureLogin {
    Write-Info "Verificando login no Azure..."
    
    try {
        $account = az account show 2>$null | ConvertFrom-Json
        if (-not $account) {
            throw "N?o logado no Azure"
        }
        Write-Success "Logado na subscription: $($account.name)"
    }
    catch {
        Write-Warning "N?o logado no Azure. Fazendo login..."
        az login
        Write-Success "Login realizado com sucesso"
    }
}

# Criar Resource Group
function New-ResourceGroup {
    Write-Info "Criando Resource Group: $ResourceGroup"
    
    az group create `
        --name $ResourceGroup `
        --location $Location `
        --output table
    
    Write-Success "Resource Group criado/atualizado"
}

# Criar Container Registry
function New-ContainerRegistry {
    Write-Info "Criando Azure Container Registry: $RegistryName"
    
    $registryExists = az acr show --name $RegistryName --resource-group $ResourceGroup 2>$null
    
    if (-not $registryExists) {
        az acr create `
            --resource-group $ResourceGroup `
            --name $RegistryName `
            --sku Basic `
            --admin-enabled true `
            --output table
        
        Write-Success "Container Registry criado"
    }
    else {
        Write-Warning "Container Registry j? existe"
    }
}

# Build e Push da imagem
function Build-AndPushImage {
    if ($SkipBuild) {
        Write-Warning "Pulando build da imagem (SkipBuild especificado)"
        return
    }
    
    Write-Info "Fazendo build e push da imagem..."
    
    # Build da imagem
    Write-Info "Building Docker image..."
    $imageName = "$RegistryName.azurecr.io/aviation-compliance-api:$ImageTag"
    
    docker build -f Dockerfile.azure -t $imageName .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no build da imagem Docker"
        exit 1
    }
    
    # Login no registry
    Write-Info "Login no Container Registry..."
    az acr login --name $RegistryName
    
    # Push da imagem
    Write-Info "Pushing image to registry..."
    docker push $imageName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no push da imagem"
        exit 1
    }
    
    Write-Success "Imagem enviada para o registry"
}

# Criar Container Apps Environment
function New-ContainerAppsEnvironment {
    Write-Info "Criando Container Apps Environment: $EnvironmentName"
    
    $envExists = az containerapp env show --name $EnvironmentName --resource-group $ResourceGroup 2>$null
    
    if (-not $envExists) {
        az containerapp env create `
            --name $EnvironmentName `
            --resource-group $ResourceGroup `
            --location $Location `
            --output table
        
        Write-Success "Container Apps Environment criado"
    }
    else {
        Write-Warning "Container Apps Environment j? existe"
    }
}

# Deploy Container App
function Deploy-ContainerApp {
    Write-Info "Fazendo deploy do Container App: $AppName"
    
    # Obter credenciais do registry
    $registryCredentials = az acr credential show --name $RegistryName | ConvertFrom-Json
    $registryUsername = $registryCredentials.username
    $registryPassword = $registryCredentials.passwords[0].value
    
    $imageName = "$RegistryName.azurecr.io/aviation-compliance-api:$ImageTag"
    
    $appExists = az containerapp show --name $AppName --resource-group $ResourceGroup 2>$null
    
    if ($appExists) {
        Write-Info "Atualizando Container App existente..."
        az containerapp update `
            --name $AppName `
            --resource-group $ResourceGroup `
            --image $imageName
    }
    else {
        Write-Info "Criando novo Container App..."
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
                "DATABASE_URL=sqlite:///data/aviation_compliance.db" `
                "LOG_LEVEL=INFO" `
                "CORS_ORIGINS=*" `
                "APP_NAME=Aviation Compliance API" `
                "APP_VERSION=2.0.0" `
            --output table
    }
    
    Write-Success "Container App deployed!"
}

# Obter informa??es do deploy
function Get-DeploymentInfo {
    Write-Info "Obtendo informa??es do deployment..."
    
    $app = az containerapp show --name $AppName --resource-group $ResourceGroup | ConvertFrom-Json
    $appUrl = "https://$($app.properties.configuration.ingress.fqdn)"
    
    Write-Success "?? URLs da aplica??o:"
    Write-Host "   API: $appUrl" -ForegroundColor Cyan
    Write-Host "   Health: $appUrl/health" -ForegroundColor Cyan
    Write-Host "   Metrics: $appUrl/metrics" -ForegroundColor Cyan
    Write-Host "   Docs: $appUrl/docs" -ForegroundColor Cyan
    
    return $appUrl
}

# Testar deployment
function Test-Deployment {
    param([string]$AppUrl)
    
    Write-Info "Testando deployment..."
    
    # Aguardar um pouco para a aplicacao inicializar
    Write-Info "Aguardando inicializacao (30 seg)..."
    Start-Sleep -Seconds 30
    
    try {
        # Testar health check
        Write-Info "Testando health check..."
        $healthResponse = Invoke-RestMethod -Uri "$AppUrl/health" -Method Get -TimeoutSec 30
        Write-Success "Health check OK!"
        
        # Testar m?tricas
        Write-Info "Testando endpoint de m?tricas..."
        $metricsResponse = Invoke-WebRequest -Uri "$AppUrl/metrics" -Method Get -TimeoutSec 30
        if ($metricsResponse.StatusCode -eq 200) {
            Write-Success "Metricas Prometheus OK!"
        }
        
        # Testar documenta??o
        Write-Info "Testando documenta??o..."
        $docsResponse = Invoke-WebRequest -Uri "$AppUrl/docs" -Method Get -TimeoutSec 30
        if ($docsResponse.StatusCode -eq 200) {
            Write-Success "Documentacao OK!"
        }
    }
    catch {
        Write-Warning "Alguns testes falharam: $($_.Exception.Message)"
        Write-Info "A aplicacao pode ainda estar inicializando. Tente novamente em alguns minutos."
    }
}

# Fun??o principal
function Deploy-ToAzure {
    Write-Info "?? Iniciando deploy do Aviation Compliance API no Azure"
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
    
    Write-Success "?? Deploy conclu?do com sucesso!"
    Write-Info "============================================================"
    
    Write-Host ""
    Write-Success "?? Resumo do Deploy:"
    Write-Host "   Resource Group: $ResourceGroup" -ForegroundColor Gray
    Write-Host "   Container Registry: $RegistryName" -ForegroundColor Gray
    Write-Host "   Container App: $AppName" -ForegroundColor Gray
    Write-Host "   Location: $Location" -ForegroundColor Gray
    Write-Host ""
    
    Write-Success "?? Aplica??o dispon?vel em: $appUrl"
}

# Executar deploy
try {
    Deploy-ToAzure
}
catch {
    Write-Error "Falha no deploy: $($_.Exception.Message)"
    Write-Info "Verifique os logs acima para mais detalhes"
    exit 1
}
