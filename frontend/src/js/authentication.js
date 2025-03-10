function checkAuthentication() {
  const authToken = localStorage.getItem('authToken');

  // If no token is found, redirect to login page
  if (!authToken) {
    // Only redirect if we're not already on the login page
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = '/src/pages/login.html';
    }
    return false;
  }
  return true;
}

async function validateToken() {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      return false;
    }

    const response = await fetch('http://localhost:3000/api/auth/validate', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      // If token is invalid, clear it and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/src/pages/login.html';
      return false;
    }

    // Token is valid, refresh user data
    const userData = await response.json();
    if (userData && userData.user) {
      localStorage.setItem('userData', JSON.stringify(userData.user));
    }
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');

  // Redirect to login page
  window.location.href = '/src/pages/login.html';
}

// ???
const originalFetch = window.fetch;
window.fetch = function (url, options = {}) {
  // Create a new options object to avoid modifying the original
  const newOptions = {...options};

  // Only add auth header for requests to our API
  if (typeof url === 'string' && url.includes('localhost:3000/api')) {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      // Initialize headers if needed
      newOptions.headers = newOptions.headers || {};

      // Only add Authorization if it's not already present
      if (!newOptions.headers.Authorization && !newOptions.headers.authorization) {
        newOptions.headers.Authorization = `Bearer ${authToken}`;
      }
    }
  }

  // Call the original fetch with the new options
  return originalFetch(url, newOptions);
};

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Skip auth check if we're on the login page
  if (window.location.pathname.includes('login.html')) {
    return;
  }

  // Check if user is logged in
  const isAuthenticated = checkAuthentication();

  if (isAuthenticated) {
    // Validate the token with the backend
    const isValid = await validateToken();

    if (!isValid) {
      return; // The validateToken function will handle redirection
    }

    // Add logout functionality to any logout buttons
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }
});

export {checkAuthentication, validateToken, logout};
