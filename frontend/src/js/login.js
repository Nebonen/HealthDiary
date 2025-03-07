import '../css/login.css';

document.addEventListener('DOMContentLoaded', () => {
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
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);

      // Redirect to home page
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Login error:', error);
      loginError.style.display = 'block';
    }
  });

  // Register form submission
  const registerForm = document.getElementById('register-form');
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById(
      'register-confirm-password',
    ).value;

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
        body: JSON.stringify({name, email, password}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Show success message
      registerSuccess.style.display = 'block';

      // Clear the form
      registerForm.reset();

      // Switch to login tab after 2 seconds
      setTimeout(() => {
        document.querySelector('.auth-tab[data-tab="login"]').click();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      registerError.textContent =
        error.message || 'Could not create account. Please try again.';
      registerError.style.display = 'block';
    }
  });
});
