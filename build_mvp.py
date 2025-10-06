#!/usr/bin/env python3
"""
Script para build e teste do MVP Docker
"""
import subprocess
import sys
import time

def run_command(command, description):
    """Executa um comando e mostra o resultado"""
    print(f"\n🔧 {description}")
    print(f"Command: {command}")
    print("-" * 40)
    
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            if result.stdout:
                print("Output:", result.stdout[:500])
            return True
        else:
            print(f"❌ {description} - FAILED")
            print("Error:", result.stderr[:500])
            return False
            
    except Exception as e:
        print(f"💥 {description} - EXCEPTION: {e}")
        return False

def main():
    print("🚁 Aviation Compliance MVP - Docker Build & Test")
    print("=" * 60)
    
    # Build Docker image
    if not run_command(
        "docker build -f Dockerfile.mvp -t aviation-mvp:latest .", 
        "Building MVP Docker image"
    ):
        print("❌ Docker build failed")
        return False
    
    # Run container
    if not run_command(
        "docker run -d --name aviation-mvp-test -p 8001:8000 aviation-mvp:latest",
        "Starting MVP container on port 8001"
    ):
        print("❌ Container start failed")
        return False
    
    # Wait for container to start
    print("\n⏳ Waiting for container to start...")
    time.sleep(5)
    
    # Test container health
    if not run_command(
        "curl -f http://localhost:8001/health",
        "Testing container health"
    ):
        print("❌ Health check failed")
        # Cleanup
        run_command("docker stop aviation-mvp-test", "Stopping container")
        run_command("docker rm aviation-mvp-test", "Removing container")
        return False
    
    print("\n🎉 MVP Docker container is running successfully!")
    print("🌐 Access the API at: http://localhost:8001")
    print("📚 API docs at: http://localhost:8001/docs")
    
    print("\n🧹 To cleanup:")
    print("docker stop aviation-mvp-test")
    print("docker rm aviation-mvp-test")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⏹️  Build interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"💥 Build error: {e}")
        sys.exit(1)