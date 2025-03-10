import '../css/login.css';

// Function to check if user is already logged in
function checkExistingSession() {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    // Validate token
    fetch('http://localhost:3000/api/auth/validate', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // If token is valid, redirect to home page
          window.location.href = '/index.html';
        } else {
          // If token is invalid, clear it from localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      })
      .catch((error) => {
        console.error('Token validation error:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Check for existing session immediately
  checkExistingSession();

  // Tab switching logic
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const tabName = tab.getAttribute('data-tab');

      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Show the corresponding form
      forms.forEach((form) => {
        form.classList.remove('active');
        if (form.id === `${tabName}-form`) {
          form.classList.add('active');
        }
      });
    });
  });

  // Login form submission
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      // Clear previous error message
      loginError.style.display = 'none';

      // Send login request to the server
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();

      // Store the token and user info in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Redirect to home page
      window.location.href = '/index.html';
    } catch (error) {
      console.error('Login error:', error);
      loginError.textContent =
        error.message || 'Invalid email or password. Please try again.';
      loginError.style.display = 'block';
    }
  });

  // Register form submission
  const registerForm = document.getElementById('register-form');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password',).value;

    // Clear previous messages
    registerError.style.display = 'none';
    registerSuccess.style.display = 'none';

    // Check if passwords match
    if (password !== confirmPassword) {
      registerError.textContent = 'Passwords do not match.';
      registerError.style.display = 'block';
      return;
    }

    try {
      // Send register request to the server
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, email, password}),
      });
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const data = await response.json();

      // Show success message
      registerSuccess.textContent =
        'Account created successfully! You can now login.';
      registerSuccess.style.display = 'block';

      // Clear the form
      registerForm.reset();

      // Switch to login tab after 1 second
      setTimeout(() => {
        document.querySelector('.auth-tab[data-tab="login"]').click();
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      registerError.textContent =
        error.message || 'Could not create account. Please try again.';
      registerError.style.display = 'block';
    }
  });

  // Check if user is already logged in
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    fetch('http://localhost:3000/api/auth/validate', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // If token is valid, redirect to home page
          window.location.href = '/index.html';
        } else {
          // If token is invalid, clear it from localStorage
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      })
      .catch((error) => {
        console.error('Token validation error:', error);
        // Clear invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      });
  }
});
