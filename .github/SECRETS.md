# 🔐 GitHub Secrets Configuration Guide

This document describes all the secrets and environment variables required for the CI/CD pipeline to work correctly.

## 📋 Required Secrets

### Azure Credentials
**Secret Name:** `AZURE_CREDENTIALS`
**Description:** Azure Service Principal credentials for deployment
**Format:** JSON object containing Azure credentials

#### How to Create:
```bash
# 1. Create a service principal
az ad sp create-for-rbac \
  --name "github-actions-aviation-compliance" \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/aviation-compliance-rg \
  --sdk-auth

# 2. The output should look like this:
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}

# 3. Copy this entire JSON object and add it as AZURE_CREDENTIALS secret
```

### GitHub Token (Automatic)
**Secret Name:** `GITHUB_TOKEN`
**Description:** Automatically provided by GitHub Actions
**Usage:** Creating releases, updating repository

## 🌍 Environment Configuration

### Production Environment
- **Environment Name:** `production`
- **Required Approvers:** 1 (recommended)
- **Deployment Branch Rule:** `main` only

### Staging Environment  
- **Environment Name:** `staging`
- **Required Approvers:** 0
- **Deployment Branch Rule:** `main` and `develop`

### Development Environment
- **Environment Name:** `development`
- **Required Approvers:** 0
- **Deployment Branch Rule:** Any branch

## ⚙️ Environment Variables (Built into workflows)

The following environment variables are configured in the workflow files:

```yaml
env:
  REGISTRY_NAME: aviationcomplianceacr
  IMAGE_NAME: aviation-compliance-api
  RESOURCE_GROUP: aviation-compliance-rg
  CONTAINER_APP_NAME: aviation-compliance-app
  NODE_VERSION: '18'
  PYTHON_VERSION: '3.9'
```

## 🏗️ Azure Resource Requirements

### Container Registry
- **Name:** aviationcomplianceacr
- **Resource Group:** aviation-compliance-rg
- **SKU:** Basic or Standard

### Container Apps
- **Production:** aviation-compliance-app
- **Staging:** aviation-compliance-app-staging  
- **Development:** aviation-compliance-app-dev

### Service Principal Permissions
The service principal needs the following permissions:
- **Contributor** role on the resource group
- **AcrPush** role on the container registry
- **Container Apps Contributor** role

## 🚀 Setup Instructions

1. **Create Azure Resources:**
   ```bash
   # Create resource group
   az group create --name aviation-compliance-rg --location eastus
   
   # Create container registry
   az acr create --name aviationcomplianceacr \
     --resource-group aviation-compliance-rg \
     --sku Standard
   
   # Create container apps environment
   az containerapp env create \
     --name aviation-compliance-env \
     --resource-group aviation-compliance-rg \
     --location eastus
   ```

2. **Configure GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Add `AZURE_CREDENTIALS` with the JSON from service principal creation

3. **Configure GitHub Environments:**
   - Go to your repository → Settings → Environments
   - Create environments: `production`, `staging`, `development`
   - Configure protection rules for production

4. **Enable GitHub Actions:**
   - Go to your repository → Actions
   - Enable GitHub Actions if not already enabled
   - The workflows will trigger automatically on push to main/develop

## 🔍 Verification

To verify the setup works:

1. **Check Service Principal:**
   ```bash
   az ad sp list --display-name "github-actions-aviation-compliance"
   ```

2. **Test Registry Access:**
   ```bash
   az acr login --name aviationcomplianceacr
   ```

3. **Verify Container Apps:**
   ```bash
   az containerapp list --resource-group aviation-compliance-rg
   ```

## 🚨 Security Best Practices

1. **Principle of Least Privilege:**
   - Service principal has minimal required permissions
   - Scoped to specific resource group only

2. **Secret Rotation:**
   - Rotate service principal secrets regularly (every 90 days)
   - Update AZURE_CREDENTIALS secret when rotated

3. **Environment Protection:**
   - Production environment requires approval
   - Staging can be automatically deployed
   - All deployments are logged and auditable

4. **Monitoring:**
   - All workflows include logging and notifications
   - Failed deployments trigger alerts
   - Rollback procedures are automated

## 📞 Troubleshooting

### Common Issues:

1. **Authentication Failed:**
   - Check AZURE_CREDENTIALS format
   - Verify service principal exists
   - Confirm permissions are correct

2. **Registry Access Denied:**
   - Verify AcrPush role assignment
   - Check registry name and resource group

3. **Container App Not Found:**
   - Verify container app names match workflow
   - Check resource group and subscription

4. **Health Check Failed:**
   - Application might take time to start
   - Check application logs in Azure portal
   - Verify environment variables are correct

### Getting Help:
- Check workflow logs in GitHub Actions
- Review Azure portal for resource status
- Use Azure CLI for debugging: `az containerapp logs show`