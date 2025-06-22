import { Configuration, PopupRequest } from "@azure/msal-browser";

// MSAL configuration
export const msalConfig: Configuration = {
  auth: {
    clientId: "45b038f1-1166-415a-8388-6bda5baa851c", // Inez AI Web App
    authority: "https://login.microsoftonline.com/96e7dd96-48b5-4991-a67e-1563013dfbe2", // zimaxai.onmicrosoft.com tenant
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest: PopupRequest = {
  scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
}; 