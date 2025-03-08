import '../css/index.css';
import {
  fetchAndDisplayEntries,
  fetchAndDisplayRecentEntries,
  setupDiaryForm,
} from './entries.js';
import fetchAndDisplayUserStats from './user.js';
import {checkAuthentication, validateToken} from './authentication.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const isAuthenticated = checkAuthentication();

  if (isAuthenticated) {
    // Validate the token with the backend
    const isValid = await validateToken();

    if (isValid) {
      // Set today's date
      dateToToday();

      // Setup the diary form
      setupDiaryForm();

      // Load entries
      fetchAndDisplayRecentEntries();

      // Update user stats
      fetchAndDisplayUserStats();

      // Setup the entries modal dialog
      setupEntriesModal();
    }
  }
});

const dateToToday = () => {
  // Set today's date as the default value for the date input
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = yyyy + '-' + mm + '-' + dd;
  document.getElementById('entry-date').value = formattedToday;
};

const setupEntriesModal = () => {
  const modal = document.getElementById('entries-modal');
  const openModalBtn = document.getElementById('open-entries-modal');
  const closeModalBtn = document.getElementById('close-modal');

  if (!modal || !openModalBtn || !closeModalBtn) return;

  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    fetchAndDisplayEntries(); // Fetch entries when opening the modal
  });

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  });

  // Close modal when clicking outside of it
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
};
