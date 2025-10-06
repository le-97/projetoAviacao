#!/bin/bash

# Azure Deployment Script for Aviation Compliance System
# This script automates the complete deployment to Azure

set -euo pipefail

# Configuration
RESOURCE_GROUP="aviation-compliance-rg"
LOCATION="eastus"
ACR_NAME="aviationcomplianceacr"
APP_SERVICE_PLAN="aviation-compliance-plan"
BACKEND_APP="aviation-compliance-backend"
FRONTEND_APP="aviation-compliance-frontend"
CONTAINER_GROUP="aviation-compliance-group"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
warn() { echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"; }
error() { echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"; exit 1; }
info() { echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"; }

# Check Azure CLI
check_azure_cli() {
    log "Checking Azure CLI..."
    
    if ! command -v az &> /dev/null; then
        error "Azure CLI is not installed. Please install it from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    fi
    
    # Check if logged in
    if ! az account show &> /dev/null; then
        error "Not logged into Azure. Please run 'az login' first."
    fi
    
    log "Azure CLI check passed"
}

# Create Resource Group
create_resource_group() {
    log "Creating resource group '$RESOURCE_GROUP'..."
    
    az group create \
        --name "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --tags project=aviation-compliance environment=production
    
    log "Resource group created successfully"
}

# Create Azure Container Registry
create_acr() {
    log "Creating Azure Container Registry '$ACR_NAME'..."
    
    az acr create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$ACR_NAME" \
        --sku Basic \
        --admin-enabled true
    
    log "Azure Container Registry created successfully"
}

# Build and push Docker images
build_and_push_images() {
    log "Building and pushing Docker images..."
    
    # Login to ACR
    az acr login --name "$ACR_NAME"
    
    # Get ACR login server
    local acr_server=$(az acr show --name "$ACR_NAME" --query loginServer --output tsv)
    
    # Build and push backend image
    log "Building backend image..."
    docker build -t "$acr_server/aviation-backend:latest" -f Dockerfile.prod .
    docker push "$acr_server/aviation-backend:latest"
    
    # Build and push frontend image (if exists)
    if [[ -d "aviation-compliance-frontend" ]]; then
        log "Building frontend image..."
        cd aviation-compliance-frontend
        docker build -t "$acr_server/aviation-frontend:latest" .
        docker push "$acr_server/aviation-frontend:latest"
        cd ..
    fi
    
    log "Docker images built and pushed successfully"
}

# Create App Service Plan
create_app_service_plan() {
    log "Creating App Service Plan '$APP_SERVICE_PLAN'..."
    
    az appservice plan create \
        --name "$APP_SERVICE_PLAN" \
        --resource-group "$RESOURCE_GROUP" \
        --sku B1 \
        --is-linux \
        --location "$LOCATION"
    
    log "App Service Plan created successfully"
}

# Deploy Backend App Service
deploy_backend_app() {
    log "Deploying backend App Service '$BACKEND_APP'..."
    
    local acr_server=$(az acr show --name "$ACR_NAME" --query loginServer --output tsv)
    
    # Create web app
    az webapp create \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$APP_SERVICE_PLAN" \
        --name "$BACKEND_APP" \
        --deployment-container-image-name "$acr_server/aviation-backend:latest"
    
    # Configure container settings
    az webapp config container set \
        --name "$BACKEND_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --docker-custom-image-name "$acr_server/aviation-backend:latest" \
        --docker-registry-server-url "https://$acr_server"
    
    # Configure app settings
    az webapp config appsettings set \
        --resource-group "$RESOURCE_GROUP" \
        --name "$BACKEND_APP" \
        --settings \
            PORT=8000 \
            ENVIRONMENT=production \
            PYTHONPATH=/app \
            WEBSITES_PORT=8000 \
            WEBSITES_CONTAINER_START_TIME_LIMIT=1800 \
            DATABASE_URL="sqlite:///data/aviation_compliance.db" \
            LOG_LEVEL=INFO \
            CORS_ORIGINS="*" \
            APP_NAME="Aviation Compliance API" \
            APP_VERSION="2.0.0"
    
    # Configure ACR authentication
    local acr_username=$(az acr credential show --name "$ACR_NAME" --query username --output tsv)
    local acr_password=$(az acr credential show --name "$ACR_NAME" --query passwords[0].value --output tsv)
    
    az webapp config container set \
        --name "$BACKEND_APP" \
        --resource-group "$RESOURCE_GROUP" \
        --docker-registry-server-user "$acr_username" \
        --docker-registry-server-password "$acr_password"
    
    log "Backend App Service deployed successfully"
}

# Deploy using Container Instances (Alternative approach)
deploy_container_instances() {
    log "Deploying using Azure Container Instances..."
    
    local acr_server=$(az acr show --name "$ACR_NAME" --query loginServer --output tsv)
    local acr_username=$(az acr credential show --name "$ACR_NAME" --query username --output tsv)
    local acr_password=$(az acr credential show --name "$ACR_NAME" --query passwords[0].value --output tsv)
    
    # Deploy container group
    az container create \
        --resource-group "$RESOURCE_GROUP" \
        --name "$CONTAINER_GROUP" \
        --image "$acr_server/aviation-backend:latest" \
        --registry-login-server "$acr_server" \
        --registry-username "$acr_username" \
        --registry-password "$acr_password" \
        --dns-name-label "aviation-compliance-api" \
        --ports 8000 \
        --cpu 1 \
        --memory 2 \
        --environment-variables \
            PORT=8000 \
            ENVIRONMENT=production \
            PYTHONPATH=/app \
        --location "$LOCATION"
    
    log "Container Instances deployed successfully"
}

# Configure Custom Domain and SSL (Optional)
configure_domain_ssl() {
    local domain_name="$1"
    
    if [[ -n "$domain_name" ]]; then
        log "Configuring custom domain and SSL for '$domain_name'..."
        
        # Map custom domain
        az webapp config hostname add \
            --resource-group "$RESOURCE_GROUP" \
            --webapp-name "$BACKEND_APP" \
            --hostname "$domain_name"
        
        # Enable SSL
        az webapp config ssl bind \
            --resource-group "$RESOURCE_GROUP" \
            --name "$BACKEND_APP" \
            --certificate-thumbprint auto \
            --ssl-type SNI
        
        log "Custom domain and SSL configured successfully"
    fi
}

# Get deployment info
get_deployment_info() {
    log "Getting deployment information..."
    
    echo
    info "Deployment URLs:"
    
    # App Service URL
    if az webapp show --name "$BACKEND_APP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        local app_url=$(az webapp show --name "$BACKEND_APP" --resource-group "$RESOURCE_GROUP" --query defaultHostName --output tsv)
        echo "  Backend App Service: https://$app_url"
        echo "  API Documentation: https://$app_url/docs"
        echo "  Health Check: https://$app_url/health"
        echo "  Prometheus Metrics: https://$app_url/metrics"
    fi
    
    # Container Instances URL
    if az container show --name "$CONTAINER_GROUP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        local container_ip=$(az container show --name "$CONTAINER_GROUP" --resource-group "$RESOURCE_GROUP" --query ipAddress.fqdn --output tsv)
        echo "  Container Instance: http://$container_ip:8000"
        echo "  API Documentation: http://$container_ip:8000/docs"
        echo "  Health Check: http://$container_ip:8000/health"
        echo "  Prometheus Metrics: http://$container_ip:8000/metrics"
    fi
    
    echo
    info "Azure Resources:"
    echo "  Resource Group: $RESOURCE_GROUP"
    echo "  Container Registry: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id --output tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/$ACR_NAME"
    echo "  App Service: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id --output tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$BACKEND_APP"
    echo
}

# Health check
health_check() {
    log "Performing health check..."
    
    local app_url=""
    
    # Try App Service first
    if az webapp show --name "$BACKEND_APP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        app_url="https://$(az webapp show --name "$BACKEND_APP" --resource-group "$RESOURCE_GROUP" --query defaultHostName --output tsv)"
    # Then try Container Instances
    elif az container show --name "$CONTAINER_GROUP" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        app_url="http://$(az container show --name "$CONTAINER_GROUP" --resource-group "$RESOURCE_GROUP" --query ipAddress.fqdn --output tsv):8000"
    else
        error "No deployment found to health check"
    fi
    
    info "Checking health at: $app_url/health"
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        info "Health check attempt $attempt/$max_attempts"
        
        if curl -f "$app_url/health" >/dev/null 2>&1; then
            log "✅ Application is healthy and responding!"
            return 0
        fi
        
        sleep 30
        ((attempt++))
    done
    
    warn "Health check failed after $max_attempts attempts. Application might still be starting up."
}

# Cleanup resources
cleanup() {
    warn "Cleaning up Azure resources..."
    
    az group delete \
        --name "$RESOURCE_GROUP" \
        --yes \
        --no-wait
    
    warn "Cleanup initiated. Resources will be deleted in the background."
}

# Main deployment function
deploy_to_azure() {
    log "🚀 Starting Azure deployment for Aviation Compliance System..."
    
    check_azure_cli
    create_resource_group
    create_acr
    build_and_push_images
    
    # Choose deployment method
    case "${DEPLOY_METHOD:-app-service}" in
        "app-service")
            create_app_service_plan
            deploy_backend_app
            ;;
        "container-instances")
            deploy_container_instances
            ;;
        "both")
            create_app_service_plan
            deploy_backend_app
            deploy_container_instances
            ;;
        *)
            error "Unknown deployment method: $DEPLOY_METHOD"
            ;;
    esac
    
    get_deployment_info
    health_check
    
    log "🎉 Azure deployment completed successfully!"
    log "Aviation Compliance API is now running on Azure"
}

# Script usage
usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  deploy      Deploy to Azure (default)"
    echo "  cleanup     Delete all Azure resources"
    echo "  info        Show deployment information"
    echo "  health      Check application health"
    echo "  help        Show this help"
    echo
    echo "Environment Variables:"
    echo "  DEPLOY_METHOD   Deployment method: app-service, container-instances, both (default: app-service)"
    echo "  CUSTOM_DOMAIN   Custom domain name for SSL configuration"
    echo
    echo "Examples:"
    echo "  $0 deploy                                    # Deploy using App Service"
    echo "  DEPLOY_METHOD=container-instances $0 deploy  # Deploy using Container Instances"
    echo "  DEPLOY_METHOD=both $0 deploy                 # Deploy using both methods"
    echo "  CUSTOM_DOMAIN=api.mycompany.com $0 deploy    # Deploy with custom domain"
}

# Handle commands
case "${1:-deploy}" in
    "deploy")
        deploy_to_azure
        if [[ -n "${CUSTOM_DOMAIN:-}" ]]; then
            configure_domain_ssl "$CUSTOM_DOMAIN"
        fi
        ;;
    "cleanup")
        cleanup
        ;;
    "info")
        get_deployment_info
        ;;
    "health")
        health_check
        ;;
    "help"|"-h"|"--help")
        usage
        ;;
    *)
        error "Unknown command: $1"
        usage
        ;;
esac