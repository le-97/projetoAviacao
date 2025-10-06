# Quick Start - Windows PowerShell
# Aviation Compliance MVP

Write-Host "🚁 Aviation Compliance MVP - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -f Dockerfile.mvp -t aviation-mvp:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    Write-Host "🚀 Starting container..." -ForegroundColor Yellow
    docker run -d --name aviation-mvp -p 8000:8000 aviation-mvp:latest
    
    Write-Host "⏳ Waiting for startup..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host "🧪 Testing health endpoint..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host ""
            Write-Host "🎉 MVP is running successfully!" -ForegroundColor Green
            Write-Host "🌐 Access API at: http://localhost:8000" -ForegroundColor Cyan
            Write-Host "📚 API docs at: http://localhost:8000/docs" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "🧹 To stop and cleanup:" -ForegroundColor Yellow
            Write-Host "docker stop aviation-mvp; docker rm aviation-mvp" -ForegroundColor White
        }
    }
    catch {
        Write-Host "❌ Health check failed" -ForegroundColor Red
        docker logs aviation-mvp
    }
}
else {
    Write-Host "❌ Build failed" -ForegroundColor Red
}