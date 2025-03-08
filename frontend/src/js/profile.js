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

    // Fetch user achievements
    const response = await fetch(
      'http://localhost:3000/api/users/achievements',
    );

    if (!response.ok) {
      throw new Error('Failed to fetch achievements');
    }

    const achievements = await response.json();

    // Clear loading message
    achievementsContainer.innerHTML = '';

    // Check if there are achievements
    if (achievements.length === 0) {
      achievementsContainer.innerHTML =
        "<p>You haven't unlocked any achievements yet.</p>";
      return;
    }

    // Display each achievement
    achievements.forEach((achievement) => {
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

    // Also fetch all available achievements to show locked ones
    const allResponse = await fetch('http://localhost:3000/api/achievements');

    if (allResponse.ok) {
      const allAchievements = await allResponse.json();

      // Filter out the achievements the user already has
      const unlockedIds = achievements.map((a) => a.achievement_id);
      const lockedAchievements = allAchievements.filter(
        (a) => !unlockedIds.includes(a.achievement_id),
      );

      // Show locked achievements if there are any
      if (lockedAchievements.length > 0) {
        // Add a separator
        const separator = document.createElement('hr');
        separator.style.margin = '1.5rem 0';
        achievementsContainer.appendChild(separator);

        const lockedTitle = document.createElement('h3');
        lockedTitle.style.marginBottom = '1rem';
        lockedTitle.textContent = 'Locked Achievements';
        achievementsContainer.appendChild(lockedTitle);

        // Display each locked achievement
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
      }
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

// Function to set up the password change modal
function setupPasswordModal() {
  const modal = document.getElementById('password-modal');
  const openModalBtn = document.getElementById('change-password-btn');
  const closeModalBtn = document.getElementById('close-password-modal');
  const passwordForm = document.getElementById('password-form');
  const passwordError = document.getElementById('password-error');
  const passwordSuccess = document.getElementById('password-success');

  if (!modal || !openModalBtn) return;

  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function () {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      passwordError.style.display = 'none';
      passwordSuccess.style.display = 'none';
      passwordForm.reset();
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      passwordError.style.display = 'none';
      passwordSuccess.style.display = 'none';
      passwordForm.reset();
    }
  });

  // Password form submission handler
  if (passwordForm) {
    passwordForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      // Reset error/success messages
      passwordError.style.display = 'none';
      passwordSuccess.style.display = 'none';

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        passwordError.textContent = 'New passwords do not match.';
        passwordError.style.display = 'block';
        return;
      }

      // Send password update request
      try {
        // This is a placeholder - you'll need to implement this API endpoint
        const response = await fetch(
          'http://localhost:3000/api/users/password',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update password');
        }

        // Show success message
        passwordSuccess.textContent = 'Password updated successfully!';
        passwordSuccess.style.display = 'block';

        // Reset the form
        passwordForm.reset();

        // Close modal after a delay
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }, 2000);
      } catch (error) {
        console.error('Error updating password:', error);
        passwordError.textContent =
          error.message || 'Failed to update password. Please try again.';
        passwordError.style.display = 'block';
      }
    });
  }
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

    // Set up password modal
    setupPasswordModal();

    // Note: For the charts, you would need to add Chart.js to your dependencies
    // This is a placeholder for that functionality
  } catch (error) {
    console.error('Error initializing profile page:', error);
  }
});
