# Inez AI Web Application

A modern web application with React frontend and Azure Functions backend for user authentication and management.

## 🚀 Features

- **User Authentication**: Email and password-based authentication
- **Email Verification**: 6-digit code verification system
- **Registration Flow**: Complete user registration with email verification
- **Modern UI**: Built with React and Tailwind CSS
- **Cookie-based Sessions**: Secure authentication state management
- **Debug Tools**: Built-in debugging utilities for development

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom authentication with cookies
- **Components**: Login, Register, Dashboard, and debug utilities

### Backend (Azure Functions)
- **Runtime**: Node.js 20 LTS
- **Authentication**: JWT token generation
- **Email**: Nodemailer for verification codes
- **Security**: bcrypt for password hashing
- **Storage**: In-memory storage (development)

## 📁 Project Structure

```
inez-ai-web/
├── src/                    # React frontend source
│   ├── components/         # React components
│   │   ├── Login.tsx      # Login component
│   │   ├── Register.tsx   # Registration component
│   │   └── Dashboard.tsx  # Dashboard component
│   ├── App.tsx            # Main app component
│   └── authConfig.ts      # Authentication configuration
├── inez-ai-api/           # Azure Functions backend
│   ├── src/functions/     # Function endpoints
│   │   ├── login.ts       # Login endpoint
│   │   ├── register.ts    # Registration endpoint
│   │   ├── verify.ts      # Email verification endpoint
│   │   └── resend-code.ts # Resend verification code
│   └── src/shared/        # Shared utilities
├── public/                # Static assets
│   └── debug.html         # Debug utilities
└── package.json           # Frontend dependencies
```

## 🚀 Deployment

### Frontend (Azure App Service)
- **URL**: http://inez-ai-web.azurewebsites.net
- **Plan**: inez-ai (Free tier)
- **Runtime**: Node.js 20 LTS on Linux

### Backend (Azure Functions)
- **Status**: Currently undeployed (source code available)
- **Endpoints**: register, verify, resend-code, login
- **Runtime**: Node.js 20 LTS

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- Azure Functions Core Tools
- Azure CLI

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd inez-ai-api

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start local development
npm start
```

## 🔧 Configuration

### Environment Variables
The application uses the following environment variables:

**Frontend** (in `src/authConfig.ts`):
- `REACT_APP_API_BASE_URL`: Backend API base URL

**Backend** (in Azure Function App Settings):
- `JWT_SECRET`: Secret key for JWT token generation
- `SMTP_HOST`: SMTP server for email sending
- `SMTP_PORT`: SMTP port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

## 🔐 Authentication Flow

1. **Registration**: User enters email and password
2. **Email Verification**: 6-digit code sent to email
3. **Verification**: User enters code to verify account
4. **Login**: User logs in with email and password
5. **Session**: Authentication state stored in cookies

## 🐛 Debug Tools

The application includes debug utilities at `/debug.html` for:
- Clearing authentication cookies
- Checking authentication state
- Manual cookie management

## 📦 Deployment Commands

### Frontend Deployment
```bash
npm run build
az webapp deploy --resource-group inez-ai-rg --name inez-ai-web --src-path build.zip --type zip
```

### Backend Deployment
```bash
cd inez-ai-api
npm run build
func azure functionapp publish inez-ai-function --typescript
```

## 🔄 Recent Changes

- ✅ Complete React frontend with authentication
- ✅ Azure Functions backend with all endpoints
- ✅ Cookie-based authentication state
- ✅ Debug utilities for troubleshooting
- ✅ Deployed to Azure App Service
- ✅ Cleaned up Azure resources
- ✅ Repository updated with all source code

## 📝 Notes

- The backend currently uses in-memory storage for development
- Email verification codes are logged to console for testing
- CORS is configured for the deployed frontend URL
- The application is ready for production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
# Updated Sun Jun 22 12:06:09 MST 2025
