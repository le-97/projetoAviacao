#!/bin/bash
# MVP Quick Start Script

echo "🚁 Aviation Compliance MVP - Quick Start"
echo "========================================"

echo "📦 Building Docker image..."
docker build -f Dockerfile.mvp -t aviation-mvp:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🚀 Starting container..."
    docker run -d --name aviation-mvp -p 8000:8000 aviation-mvp:latest
    
    echo "⏳ Waiting for startup..."
    sleep 5
    
    echo "🧪 Testing health endpoint..."
    curl -f http://localhost:8000/health
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 MVP is running successfully!"
        echo "🌐 Access API at: http://localhost:8000"
        echo "📚 API docs at: http://localhost:8000/docs"
        echo ""
        echo "🧹 To stop and cleanup:"
        echo "docker stop aviation-mvp && docker rm aviation-mvp"
    else
        echo "❌ Health check failed"
        docker logs aviation-mvp
    fi
else
    echo "❌ Build failed"
fi