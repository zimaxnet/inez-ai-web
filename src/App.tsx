import React, { useState } from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfig';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

// Initialize MSAL
const msalInstance = new PublicClientApplication(msalConfig);

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

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSwitchToRegister = () => {
    setAuthMode('register');
  };

  const handleSwitchToLogin = () => {
    setAuthMode('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Set authentication cookie
    setCookie('isAuthenticated', 'true', 7); // 7 days
  };

  // Check if user is authenticated on component mount
  React.useEffect(() => {
    const authCookie = getCookie('isAuthenticated');
    if (authCookie === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          authMode === 'login' ? (
            <Login onSwitchToRegister={handleSwitchToRegister} onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Register onSwitchToLogin={handleSwitchToLogin} />
          )
        )}
      </div>
    </MsalProvider>
  );
}

export default App;
