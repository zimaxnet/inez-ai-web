import React from 'react';
import { useMsal, useAccount } from '@azure/msal-react';

// Cookie utility functions
const clearCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const Dashboard: React.FC = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      // Clear authentication cookie
      clearCookie('isAuthenticated');
      // Force a page reload to show the login screen
      window.location.reload();
    }).catch((e: unknown) => {
      console.error(e);
    });
  };

  const handleForceLogout = () => {
    // Force clear cookie and reload without MSAL logout
    clearCookie('isAuthenticated');
    window.location.reload();
  };

  return (
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
                  <span className="text-sm font-medium text-white">
                    {account?.name?.charAt(0) || account?.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700">{account?.name || account?.username}</span>
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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Welcome to Inez AI
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">User Information</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{account?.name || 'Not available'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{account?.username || 'Not available'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Environment</dt>
                    <dd className="text-sm text-gray-900">{account?.environment || 'Not available'}</dd>
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
                        You have successfully authenticated with your CIAM tenant. 
                        This application is now ready to integrate with Azure services.
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
};

export default Dashboard; 