// PLACE HOLDER ???

// Authentication handling for main app
// Add this to your index.js file

// Function to check if user is authenticated
function checkAuthentication() {
  const authToken = localStorage.getItem('authToken');

  // If no token is found, redirect to login page
  if (!authToken) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

// Function to validate token with backend
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
      // Token is invalid, clear it and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = 'login.html';
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

// Function to handle logout
function logout() {
  // Clear the authentication token
  localStorage.removeItem('authToken');

  // Redirect to login page
  window.location.href = 'login.html';
}

// Add authentication headers to all fetch requests to the API
const originalFetch = window.fetch;
window.fetch = function (url, options = {}) {
  // Only add auth header for requests to our API
  if (url.includes('localhost:3000/api')) {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      options.headers = options.headers || {};
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }
  }

  return originalFetch(url, options);
};

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const isAuthenticated = checkAuthentication();

  if (isAuthenticated) {
    // Validate the token with the backend
    await validateToken();

    // Add logout functionality to any logout buttons
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    // Continue with normal page initialization
    // These function calls should be defined elsewhere in your code
    if (typeof fetchAndDisplayUserStats === 'function') {
      fetchAndDisplayUserStats();
    }

    if (typeof fetchAndDisplayRecentEntries === 'function') {
      fetchAndDisplayRecentEntries();
    }
  }
});
