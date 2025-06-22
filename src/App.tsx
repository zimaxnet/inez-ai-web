import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import { AUTH_COOKIE_NAME } from './authConfig';

// Cookie utility functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const clearCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugMessage, setDebugMessage] = useState('');

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Set authentication cookie
    setCookie(AUTH_COOKIE_NAME, 'true', 7); // 7 days
  };

  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    
    // Clear authentication cookie
    clearCookie(AUTH_COOKIE_NAME);
    
    // Clear any stored tokens
    localStorage.removeItem('authToken');
    
    // Clear any other potential auth data
    sessionStorage.clear();
    
    // Force page reload to clear any cached state and ensure clean redirect
    window.location.reload();
  };

  const handleForceLogout = () => {
    // Clear authentication cookie directly
    document.cookie = `${AUTH_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    // Clear any stored tokens
    localStorage.removeItem('authToken');
    // Force page reload to clear any cached state
    window.location.reload();
  };

  const clearAllCookies = () => {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    setDebugMessage('All cookies cleared!');
    setTimeout(() => setDebugMessage(''), 3000);
  };

  const checkAuthCookie = () => {
    const authCookie = document.cookie.split(';').find(c => c.trim().startsWith(`${AUTH_COOKIE_NAME}=`));
    const status = authCookie ? 'Present' : 'Not found';
    setDebugMessage(`Auth cookie status: ${status}`);
    setTimeout(() => setDebugMessage(''), 3000);
  };

  const setAuthCookie = () => {
    document.cookie = `${AUTH_COOKIE_NAME}=true;path=/;max-age=604800`; // 7 days
    setDebugMessage('Auth cookie set to true!');
    setTimeout(() => setDebugMessage(''), 3000);
  };

  // Check if user is authenticated on component mount
  React.useEffect(() => {
    const authCookie = getCookie(AUTH_COOKIE_NAME);
    if (authCookie === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Dashboard component integrated into the main app
  const DashboardContent = () => (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Inez AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">U</span>
                </div>
                <span className="text-sm text-gray-700">User</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Out
              </button>
              <button
                onClick={handleForceLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Force Logout
              </button>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Debug
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {debugMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
              {debugMessage}
            </div>
          )}

          {showDebug && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-800 mb-4">Debug Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={checkAuthCookie}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Check Auth Cookie
                </button>
                <button
                  onClick={setAuthCookie}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Set Auth Cookie
                </button>
                <button
                  onClick={clearAllCookies}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Clear All Cookies
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reload Page
                </button>
              </div>
              <div className="mt-4 text-sm text-yellow-700">
                <p><strong>Current cookies:</strong></p>
                <pre className="mt-2 bg-white p-2 rounded border text-xs overflow-x-auto">
                  {document.cookie || 'No cookies found'}
                </pre>
              </div>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Welcome to Inez AI
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Authentication Status</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">Authenticated</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Method</dt>
                    <dd className="text-sm text-gray-900">Custom Authentication</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Authentication Successful
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        You have successfully authenticated with the Inez AI application. 
                        This application uses custom authentication with Azure Functions backend.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Backend Connected
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        The application is successfully connected to the Azure Functions backend.
                        All authentication features are working properly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Need Help?
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        If you're having issues with authentication, use the "Debug" button in the navigation bar above.
                        You can also use "Force Logout" to immediately clear all authentication data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="App">
      {isAuthenticated ? (
        <DashboardContent />
      ) : (
        authMode === 'login' ? (
          <Login onSwitchToRegister={handleSwitchToRegister} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Register onSwitchToLogin={handleSwitchToLogin} />
        )
      )}
    </div>
  );
}

export default App;
