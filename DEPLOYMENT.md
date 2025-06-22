# Inez AI Deployment Guide

This guide provides step-by-step instructions for deploying the Inez AI application to Azure.

## Prerequisites

- Azure CLI installed and logged in
- Node.js 20+ installed
- Azure Functions Core Tools installed
- Git repository cloned

## Azure Resources Setup

### 1. Create Resource Group
```bash
az group create --name inez-ai-rg --location westus2
```

### 2. Create App Service Plan
```bash
az appservice plan create --resource-group inez-ai-rg --name inez-ai --sku F1 --is-linux
```

### 3. Create Storage Account (for Functions)
```bash
az storage account create --name inezaistorage --resource-group inez-ai-rg --location westus2 --sku Standard_LRS
```

### 4. Create Web App (Frontend)
```bash
az webapp create --resource-group inez-ai-rg --name inez-ai-web --plan inez-ai --runtime "NODE|20-lts"
```

### 5. Create Function App (Backend)
```bash
az functionapp create --resource-group inez-ai-rg --name inez-ai-function --plan inez-ai --storage-account inezaistorage --runtime node --runtime-version 20 --functions-version 4 --os-type Linux
```

### 6. Configure CORS for Function App
```bash
az functionapp cors add --resource-group inez-ai-rg --name inez-ai-function --allowed-origins "http://inez-ai-web.azurewebsites.net" "https://inez-ai-web.azurewebsites.net"
```

## Environment Variables

### Function App Settings
Set these in Azure Portal > Function App > Configuration > Application settings:

```bash
# JWT Secret (generate a secure random string)
JWT_SECRET=your-secure-jwt-secret-here

# SMTP Configuration (for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Custom API URL (if different from default)
REACT_APP_API_BASE_URL=https://inez-ai-function.azurewebsites.net/api
```

### Setting via Azure CLI
```bash
az functionapp config appsettings set --resource-group inez-ai-rg --name inez-ai-function --settings JWT_SECRET="your-secure-jwt-secret-here"
az functionapp config appsettings set --resource-group inez-ai-rg --name inez-ai-function --settings SMTP_HOST="smtp.gmail.com"
az functionapp config appsettings set --resource-group inez-ai-rg --name inez-ai-function --settings SMTP_PORT="587"
az functionapp config appsettings set --resource-group inez-ai-rg --name inez-ai-function --settings SMTP_USER="your-email@gmail.com"
az functionapp config appsettings set --resource-group inez-ai-rg --name inez-ai-function --settings SMTP_PASS="your-app-password"
```

## Deployment Steps

### 1. Deploy Frontend
```bash
# Build the React app
npm run build

# Deploy to Azure App Service
az webapp deploy --resource-group inez-ai-rg --name inez-ai-web --src-path build.zip --type zip
```

### 2. Deploy Backend
```bash
# Navigate to backend directory
cd inez-ai-api

# Install dependencies
npm install

# Build TypeScript
npm run build

# Deploy to Azure Functions
func azure functionapp publish inez-ai-function --typescript
```

## Verification

### Test Frontend
- Visit: http://inez-ai-web.azurewebsites.net
- Should load the login page

### Test Backend Endpoints
```bash
# Test register endpoint
curl -X POST https://inez-ai-function.azurewebsites.net/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login endpoint
curl -X POST https://inez-ai-function.azurewebsites.net/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is configured correctly in Azure Function App
2. **Function Not Found**: Check if functions are deployed correctly
3. **Authentication Failures**: Verify JWT_SECRET is set
4. **Email Not Sending**: Check SMTP configuration

### Debug Tools
- Frontend debug page: http://inez-ai-web.azurewebsites.net/debug.html
- Function App logs: Azure Portal > Function App > Monitoring > Log stream

## URLs

- **Frontend**: http://inez-ai-web.azurewebsites.net
- **Backend**: https://inez-ai-function.azurewebsites.net/api
- **Debug Page**: http://inez-ai-web.azurewebsites.net/debug.html

## Security Notes

- Change default JWT_SECRET in production
- Use HTTPS in production
- Configure proper SMTP credentials
- Consider using Azure Key Vault for secrets
- Enable authentication for production use

## Cost Optimization

- Use Free tier (F1) for development
- Consider Basic tier (B1) for production
- Monitor usage in Azure Portal
- Set up billing alerts 