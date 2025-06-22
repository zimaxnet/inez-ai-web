import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
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
    setIsAuthenticated(false);
    clearCookie(AUTH_COOKIE_NAME);
    // Force page reload to clear any cached state
    window.location.reload();
  };

  // Check if user is authenticated on component mount
  React.useEffect(() => {
    const authCookie = getCookie(AUTH_COOKIE_NAME);
    if (authCookie === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
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
