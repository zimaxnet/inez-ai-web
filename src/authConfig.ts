// Custom Authentication Configuration
// This application uses a custom authentication system with Azure Functions backend
// instead of MSAL (Microsoft Authentication Library)

// API Base URL for the Azure Functions backend
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://inez-ai-function.azurewebsites.net/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  register: `${API_BASE_URL}/register`,
  login: `${API_BASE_URL}/login`,
  verify: `${API_BASE_URL}/verify`,
  resendCode: `${API_BASE_URL}/resend-code`
};

// Cookie configuration
export const AUTH_COOKIE_NAME = 'isAuthenticated';
export const AUTH_COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}; 