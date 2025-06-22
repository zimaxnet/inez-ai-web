// Custom Authentication Configuration
// This application uses a custom authentication system with Azure Functions backend

const isProduction = process.env.NODE_ENV === 'production';

// In production, when hosted on Static Web Apps, the API is available at the relative path /api
// In development, we use the full Azure Function URL, which requires CORS to be configured.
const prodApiBaseUrl = '/api';
const devApiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://inez-ai-function.azurewebsites.net/api';

// API Base URL for the Azure Functions backend
export const API_BASE_URL = isProduction ? prodApiBaseUrl : devApiBaseUrl;

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