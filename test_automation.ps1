# Script de teste PowerShell para sistema de conformidade aeronáutica
# Testa conectividade entre frontend e backend

Write-Host "🚀 Iniciando Testes do Sistema de Conformidade Aeronáutica" -ForegroundColor Green
Write-Host "=" * 60

$BackendUrl = "http://localhost:8000"
$FrontendUrl = "http://localhost:5173"
$TestResults = @()

function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    try {
        Write-Host "🔍 Testando: $TestName" -ForegroundColor Yellow
        
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 10
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body | ConvertTo-Json
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ PASSOU | $TestName" -ForegroundColor Green
            $global:TestResults += @{
                Test = $TestName
                Status = "PASSOU"
                Details = "HTTP $($response.StatusCode)"
            }
            return $true
        } else {
            Write-Host "❌ FALHOU | $TestName - HTTP $($response.StatusCode)" -ForegroundColor Red
            $global:TestResults += @{
                Test = $TestName
                Status = "FALHOU"
                Details = "HTTP $($response.StatusCode)"
            }
            return $false
        }
    }
    catch {
        Write-Host "❌ FALHOU | $TestName - $($_.Exception.Message)" -ForegroundColor Red
        $global:TestResults += @{
            Test = $TestName
            Status = "FALHOU"
            Details = $_.Exception.Message
        }
        return $false
    }
}

# Inicia servidor se não estiver rodando
$ServerProcess = Get-Process | Where-Object { $_.ProcessName -eq "python" -and $_.CommandLine -like "*simple_server.py*" }
if (-not $ServerProcess) {
    Write-Host "🔄 Iniciando servidor backend..." -ForegroundColor Yellow
    Start-Process -FilePath "python" -ArgumentList "simple_server.py" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# Testes individuais
$PassedTests = 0
$TotalTests = 0

Write-Host "`n📋 EXECUTANDO TESTES:" -ForegroundColor Cyan

# 1. Health Check
$TotalTests++
if (Test-Endpoint "Backend Health Check" "$BackendUrl/health") {
    $PassedTests++
}

# 2. Frontend Accessibility
$TotalTests++
if (Test-Endpoint "Frontend Accessibility" $FrontendUrl) {
    $PassedTests++
}

# 3. AI Analysis - E190 para US
$TotalTests++
if (Test-Endpoint "AI Analysis E190->US" "$BackendUrl/compliance/ai-analysis/e190/US") {
    $PassedTests++
}

# 4. AI Analysis - Phenom 300 para EU
$TotalTests++
if (Test-Endpoint "AI Analysis Phenom300->EU" "$BackendUrl/compliance/ai-analysis/phenom300/EU") {
    $PassedTests++
}

# 5. Traditional Compliance Validation
$TotalTests++
$ComplianceBody = @{
    aircraftModel = "e190"
    country = "US"
}
if (Test-Endpoint "Traditional Validation" "$BackendUrl/compliance/validate" "POST" $ComplianceBody) {
    $PassedTests++
}

# Relatório Final
Write-Host "`n" + "=" * 60
Write-Host "📊 RELATÓRIO FINAL" -ForegroundColor Cyan
Write-Host "=" * 60

$SuccessRate = ($PassedTests / $TotalTests) * 100
Write-Host "✅ Testes Aprovados: $PassedTests/$TotalTests ($($SuccessRate.ToString("F1"))%)" -ForegroundColor Green

if ($SuccessRate -eq 100) {
    Write-Host "🎉 TODOS OS TESTES PASSARAM! Sistema pronto para produção." -ForegroundColor Green
    $Status = "PRONTO"
} elseif ($SuccessRate -ge 80) {
    Write-Host "⚠️  Sistema funcional, mas com algumas questões menores." -ForegroundColor Yellow
    $Status = "FUNCIONAL"
} else {
    Write-Host "❌ Sistema requer correções antes da produção." -ForegroundColor Red
    $Status = "REQUER_CORRECAO"
}

# Próximos passos
Write-Host "`n📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
if ($SuccessRate -eq 100) {
    Write-Host "1. ✅ Deploy para Azure Container Apps"
    Write-Host "2. ✅ Configurar monitoramento de produção"
    Write-Host "3. ✅ Implementar testes de carga"
} else {
    Write-Host "1. 🔧 Corrigir testes que falharam"
    Write-Host "2. 🔄 Re-executar suite de testes"
    Write-Host "3. 📈 Validar performance após correções"
}

# Salvar resultados
$ReportData = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    TotalTests = $TotalTests
    PassedTests = $PassedTests
    SuccessRate = $SuccessRate
    Status = $Status
    TestResults = $TestResults
    NextSteps = if ($SuccessRate -eq 100) { 
        @("Deploy Azure", "Monitoramento", "Testes Carga") 
    } else { 
        @("Corrigir falhas", "Re-testar", "Validar performance") 
    }
}

$ReportJson = $ReportData | ConvertTo-Json -Depth 3
$ReportJson | Out-File "test_results.json" -Encoding UTF8

Write-Host "`n💾 Resultados salvos em: test_results.json" -ForegroundColor Gray

# Resumo visual dos testes
Write-Host "`n📈 RESUMO DOS TESTES:" -ForegroundColor Cyan
foreach ($result in $TestResults) {
    $Icon = if ($result.Status -eq "PASSOU") { "✅" } else { "❌" }
    Write-Host "$Icon $($result.Test) - $($result.Details)"
}

Write-Host "`n🏁 Teste completo finalizado!" -ForegroundColor Green