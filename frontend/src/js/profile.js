import '../css/profile.css';
import {checkAuthentication, validateToken, logout} from './authentication.js';
import fetchAndDisplayUserStats from './user.js';

// Function to display the user profile information
async function displayUserProfile() {
  try {
    // Get user data from localStorage first
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // If we need more detailed info, fetch it from the API
    const response = await fetch('http://localhost:3000/api/users/profile');

    if (response.ok) {
      const profileData = await response.json();
      // Update localStorage with latest data
      userData = {...userData, ...profileData};
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    // Update the UI with user data
    const usernameElement = document.getElementById('profile-username');
    if (usernameElement)
      usernameElement.textContent = userData.username || 'Unknown';

    const emailElement = document.getElementById('profile-email');
    if (emailElement) emailElement.textContent = userData.email || 'Unknown';

    const createdElement = document.getElementById('profile-created');
    if (createdElement && userData.created_at) {
      const createDate = new Date(userData.created_at);
      createdElement.textContent = createDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (createdElement) {
      createdElement.textContent = 'Unknown';
    }

    // Set avatar initials
    const avatarInitials = document.getElementById('avatar-initials');
    if (avatarInitials && userData.username) {
      // Get initials from username (first letter of each word)
      const initials = userData.username
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2); // Take at most 2 characters

      avatarInitials.textContent = initials;
    }
  } catch (error) {
    console.error('Error displaying profile:', error);
  }
}

// Function to fetch and display user achievements
async function fetchAndDisplayAchievements() {
  try {
    const achievementsContainer = document.getElementById(
      'achievements-container',
    );
    if (!achievementsContainer) return;

    // Show loading state
    achievementsContainer.innerHTML =
      '<p class="loading">Loading achievements...</p>';

    // Fetch both user achievements and all available achievements in parallel
    const [userResponse, allResponse] = await Promise.all([
      fetch('http://localhost:3000/api/users/achievements'),
      fetch('http://localhost:3000/api/achievements'),
    ]);

    if (!userResponse.ok || !allResponse.ok) {
      throw new Error('Failed to fetch achievements');
    }

    const userAchievements = await userResponse.json();
    const allAchievements = await allResponse.json();

    // Clear loading message
    achievementsContainer.innerHTML = '';

    // Display unlocked achievements if there are any
    if (userAchievements.length > 0) {
      const unlockedTitle = document.createElement('h3');
      unlockedTitle.style.marginBottom = '1rem';
      unlockedTitle.textContent = 'Unlocked Achievements';
      achievementsContainer.appendChild(unlockedTitle);

      // Display each achievement
      userAchievements.forEach((achievement) => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';

        // Format the unlocked date
        const unlockedDate = new Date(achievement.unlocked_at);
        const formattedDate = unlockedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        achievementItem.innerHTML = `
          <div class="achievement-header">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-xp">+${achievement.experience_points} XP</div>
          </div>
          <div class="achievement-description">${achievement.description}</div>
          <div class="achievement-date">Unlocked on: ${formattedDate}</div>
        `;

        achievementsContainer.appendChild(achievementItem);
      });

      // Add a separator if there are unlocked achievements
      const separator = document.createElement('hr');
      separator.style.margin = '1.5rem 0';
      achievementsContainer.appendChild(separator);
    } else {
      // Message if no achievements unlocked yet
      const noAchievementsMsg = document.createElement('p');
      noAchievementsMsg.textContent =
        "You haven't unlocked any achievements yet.";
      achievementsContainer.appendChild(noAchievementsMsg);

      // Add some space before locked achievements
      const spacer = document.createElement('div');
      spacer.style.height = '1.5rem';
      achievementsContainer.appendChild(spacer);
    }

    // Filter out the achievements the user already has
    const unlockedIds = userAchievements.map((a) => a.achievement_id);
    const lockedAchievements = allAchievements.filter(
      (a) => !unlockedIds.includes(a.achievement_id),
    );

    // Show locked achievements section
    const lockedTitle = document.createElement('h3');
    lockedTitle.style.marginBottom = '1rem';
    lockedTitle.textContent = 'Locked Achievements';
    achievementsContainer.appendChild(lockedTitle);

    // Display each locked achievement or a message if all are unlocked
    if (lockedAchievements.length > 0) {
      lockedAchievements.forEach((achievement) => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item locked';

        achievementItem.innerHTML = `
          <div class="achievement-header">
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-xp">+${achievement.experience_points} XP</div>
          </div>
          <div class="achievement-description">${achievement.description}</div>
          <div class="achievement-requirement">Requirement: ${achievement.requirement}</div>
        `;

        achievementsContainer.appendChild(achievementItem);
      });
    } else {
      // Message if all achievements are unlocked
      const allUnlockedMsg = document.createElement('p');
      allUnlockedMsg.textContent =
        "Congratulations! You've unlocked all available achievements.";
      achievementsContainer.appendChild(allUnlockedMsg);
    }
  } catch (error) {
    console.error('Error fetching achievements:', error);
    const achievementsContainer = document.getElementById(
      'achievements-container',
    );
    if (achievementsContainer) {
      achievementsContainer.innerHTML = `<p class="error">Failed to load achievements: ${error.message}</p>`;
    }
  }
}

async function setupDeleteAccountButton() {
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  if (!deleteAccountBtn) return;

  deleteAccountBtn.addEventListener('click', () => {
    // Create a modal for confirmation
    const modal = document.createElement('div');
    modal.id = 'delete-account-modal';
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal" id="close-delete-modal">&times;</button>
        <div class="confirmation-modal">
          <h3>Delete Your Account</h3>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <p>All your diary entries and achievements will be permanently deleted.</p>
          
          <div class="confirmation-actions">
            <button class="cancel-btn" id="cancel-delete">Cancel</button>
            <button class="delete-btn" id="confirm-delete">Delete My Account</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Setup close handlers
    const closeBtn = document.getElementById('close-delete-modal');
    const cancelBtn = document.getElementById('cancel-delete');

    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      // Remove the modal from DOM after animation completes
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Handle delete confirmation
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    confirmDeleteBtn.addEventListener('click', async () => {
      try {
        // Disable the button to prevent multiple clicks
        confirmDeleteBtn.disabled = true;
        confirmDeleteBtn.textContent = 'Deleting...';

        // Send delete request to the API
        const response = await fetch(
          'http://localhost:3000/api/users/profile',
          {
            method: 'DELETE',
          },
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to delete account');
        }

        // On success, clear local storage and redirect to login page
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');

        // Show a brief success message before redirecting
        const confirmationDiv = document.querySelector('.confirmation-modal');
        confirmationDiv.innerHTML = `
          <h3 style="color: #27ae60;">Account Deleted</h3>
          <p>Your account has been successfully deleted.</p>
          <p>Redirecting to login page...</p>
        `;

        // Redirect after a brief delay
        setTimeout(() => {
          window.location.href = '/src/pages/login.html';
        }, 2000);
      } catch (error) {
        console.error('Error deleting account:', error);

        // Show error in the modal
        const confirmationActions = document.querySelector(
          '.confirmation-actions',
        );
        confirmationActions.innerHTML = `
          <p style="color: #e74c3c;">Error: ${error.message}</p>
          <button class="cancel-btn" id="error-close">Close</button>
        `;

        // Setup close handler for error message
        document
          .getElementById('error-close')
          .addEventListener('click', closeModal);
      }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
    });
  });
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check authentication
    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
      return; // The checkAuthentication function will handle redirection
    }

    // Validate token
    await validateToken();

    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    // Display user profile info
    await displayUserProfile();

    // Display user stats (reuse function from index.js)
    fetchAndDisplayUserStats();

    // Display achievements
    fetchAndDisplayAchievements();

    setupDeleteAccountButton();

    // Note: For the charts, you would need to add Chart.js to your dependencies
    // This is a placeholder for that functionality
  } catch (error) {
    console.error('Error initializing profile page:', error);
  }
});
