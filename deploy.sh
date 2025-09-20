#!/bin/bash

# Aviation Compliance API Production Deployment Script
# This script handles deployment to production environment

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed"
    fi
    
    log "Dependencies check passed"
}

# Validate environment
validate_environment() {
    log "Validating environment..."
    
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file $ENV_FILE not found. Copy .env.production.example and configure it."
    fi
    
    # Check required environment variables
    source "$ENV_FILE"
    
    required_vars=(
        "JWT_SECRET_KEY"
        "ENCRYPTION_KEY"
        "POSTGRES_PASSWORD"
        "REDIS_PASSWORD"
        "GRAFANA_PASSWORD"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            error "Required environment variable $var is not set in $ENV_FILE"
        fi
    done
    
    log "Environment validation passed"
}

# Backup data
backup_data() {
    log "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    local backup_file="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    # Backup database and logs
    tar -czf "$backup_file" \
        --exclude='*.pyc' \
        --exclude='__pycache__' \
        data/ logs/ 2>/dev/null || true
    
    log "Backup created: $backup_file"
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    docker-compose -f "$COMPOSE_FILE" pull
    
    log "Images pulled successfully"
}

# Build application image
build_image() {
    log "Building application image..."
    
    docker-compose -f "$COMPOSE_FILE" build \
        --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
        --build-arg VERSION="${VERSION:-1.0.0}" \
        --build-arg VCS_REF="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    
    log "Application image built successfully"
}

# Deploy services
deploy() {
    log "Deploying services..."
    
    # Start services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    log "Services deployed successfully"
}

# Wait for services to be healthy
wait_for_health() {
    log "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        info "Health check attempt $attempt/$max_attempts"
        
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            log "Application is healthy"
            return 0
        fi
        
        sleep 10
        ((attempt++))
    done
    
    error "Application failed to become healthy after $max_attempts attempts"
}

# Run smoke tests
smoke_tests() {
    log "Running smoke tests..."
    
    # Test API endpoints
    local api_url="http://localhost:8000"
    
    # Health check
    if ! curl -f "$api_url/health" >/dev/null 2>&1; then
        error "Health check failed"
    fi
    
    # API documentation
    if ! curl -f "$api_url/api/docs" >/dev/null 2>&1; then
        error "API docs not accessible"
    fi
    
    # Test compliance endpoint
    local test_response=$(curl -s "$api_url/api/v1/compliance/check?model=E175&country=BRA" | jq -r '.compliant')
    if [[ "$test_response" != "true" && "$test_response" != "false" ]]; then
        error "Compliance check endpoint not working"
    fi
    
    log "Smoke tests passed"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    echo
    
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo
    info "Services URLs:"
    echo "  API Documentation: https://localhost/api/docs"
    echo "  Health Check: https://localhost/health"
    echo "  Monitoring: http://localhost:8080/grafana"
    echo "  Metrics: http://localhost:8080/prometheus"
    echo
}

# Rollback deployment
rollback() {
    warn "Rolling back deployment..."
    
    # Stop current services
    docker-compose -f "$COMPOSE_FILE" down
    
    # Restore from backup
    local latest_backup=$(ls -t "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | head -1)
    
    if [[ -n "$latest_backup" ]]; then
        log "Restoring from backup: $latest_backup"
        tar -xzf "$latest_backup"
    fi
    
    warn "Rollback completed. Please investigate the issues and redeploy."
}

# Cleanup old resources
cleanup() {
    log "Cleaning up old resources..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove old backups (keep last 5)
    ls -t "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
    
    log "Cleanup completed"
}

# Main deployment function
deploy_main() {
    log "Starting Aviation Compliance API deployment..."
    
    check_dependencies
    validate_environment
    backup_data
    pull_images
    build_image
    deploy
    wait_for_health
    smoke_tests
    show_status
    cleanup
    
    log "🚀 Deployment completed successfully!"
    log "Aviation Compliance API is now running in production"
}

# Script usage
usage() {
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  deploy      Full deployment (default)"
    echo "  rollback    Rollback to previous version"
    echo "  status      Show current status"
    echo "  logs        Show application logs"
    echo "  stop        Stop all services"
    echo "  start       Start all services"
    echo "  restart     Restart all services"
    echo "  update      Update and restart services"
    echo "  backup      Create backup only"
    echo "  cleanup     Cleanup old resources"
    echo "  help        Show this help"
}

# Handle commands
case "${1:-deploy}" in
    "deploy")
        deploy_main
        ;;
    "rollback")
        rollback
        ;;
    "status")
        show_status
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f aviation-compliance-api
        ;;
    "stop")
        log "Stopping services..."
        docker-compose -f "$COMPOSE_FILE" down
        ;;
    "start")
        log "Starting services..."
        docker-compose -f "$COMPOSE_FILE" up -d
        wait_for_health
        ;;
    "restart")
        log "Restarting services..."
        docker-compose -f "$COMPOSE_FILE" restart
        wait_for_health
        ;;
    "update")
        log "Updating services..."
        backup_data
        pull_images
        build_image
        docker-compose -f "$COMPOSE_FILE" up -d
        wait_for_health
        smoke_tests
        ;;
    "backup")
        backup_data
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        error "Unknown command: $1"
        usage
        ;;
esac