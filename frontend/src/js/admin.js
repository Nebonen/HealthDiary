import '../css/admin.css';
import {checkAuthentication, validateToken, logout} from './authentication.js';

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if user is authenticated and has admin privileges
    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
      window.location.href = '/src/pages/login.html';
      return;
    }
    await validateToken();

    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    // Check if the user is an admin
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.userLevel !== 'admin') {
      // Redirect non-admin users
      alert('You do not have permission to access this page.');
      window.location.href = '/index.html';
      return;
    }
    setupTabSwitching();
    loadSystemStats();
    loadUsersTable();
    loadAchievementsTable();
    setupUserModal();
    setupAchievementModal();
  } catch (error) {
    console.error('Error initializing admin dashboard:', error);
    alert(`Error loading admin dashboard: ${error.message}`);
  }
});

function setupTabSwitching() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove('active'));

      // Add active class to clicked button
      button.classList.add('active');

      // Get the tab to show
      const tabId = button.getAttribute('data-tab');

      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach((content) => content.classList.remove('active'));

      // Show the selected tab content
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
}

async function loadSystemStats() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/stats');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const stats = await response.json();
    // Update the stats in the UI
    document.getElementById('total-users').textContent = stats.totalUsers || 0;
    document.getElementById('total-entries').textContent =
      stats.totalEntries || 0;
    document.getElementById('new-users').textContent =
      stats.newUsers30Days || 0;
    document.getElementById('new-entries').textContent =
      stats.newEntries30Days || 0;
    document.getElementById('achievements-earned').textContent =
      stats.totalAchievementsEarned || 0;
  } catch (error) {
    console.error('Error loading system stats:', error);

    // Set default values for stats
    const statElements = document.querySelectorAll('.stat-number');
    statElements.forEach((element) => {
      element.textContent = 'Error';
    });
  }
}

async function loadUsersTable() {
  const tableBody = document.getElementById('users-table-body');
  if (!tableBody) return;
  try {
    // Show loading state
    tableBody.innerHTML = '<tr><td colspan="8">Loading users...</td></tr>';

    const response = await fetch('http://localhost:3000/api/admin/users');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();
    // Clear the table
    tableBody.innerHTML = '';
    if (users.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8">No users found</td></tr>';
      return;
    }

    // Add users to the table
    users.forEach((user) => {
      const row = document.createElement('tr');
      // Format the date
      const createdDate = new Date(user.created_at).toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
      );
      row.innerHTML = `
        <td>${user.user_id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.level || 1}</td>
        <td>${user.entry_count || 0}</td>
        <td>${createdDate}</td>
        <td>
          <span class="role-badge role-${user.user_role}">${user.user_level}</span>
        </td>
        <td>
          <button class="view-btn" data-user-id="${user.user_id}">View</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add click handlers for view buttons
    const viewButtons = tableBody.querySelectorAll('.view-btn');
    viewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const userId = button.getAttribute('data-user-id');
        openUserModal(userId);
      });
    });
  } catch (error) {
    console.error('Error loading users:', error);
    tableBody.innerHTML = `<tr><td colspan="8">Error loading users: ${error.message}</td></tr>`;
  }
}

// Function to load achievements table
async function loadAchievementsTable() {
  const tableBody = document.getElementById('achievements-table-body');
  if (!tableBody) return;
  try {
    // Show loading state
    tableBody.innerHTML =
      '<tr><td colspan="6">Loading achievements...</td></tr>';

    const response = await fetch('http://localhost:3000/api/achievements');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const achievements = await response.json();
    // Clear the table
    tableBody.innerHTML = '';
    if (achievements.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="6">No achievements found</td></tr>';
      return;
    }

    // Add achievements to the table
    achievements.forEach((achievement) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${achievement.achievement_id}</td>
        <td>${achievement.name}</td>
        <td>${achievement.description}</td>
        <td>${achievement.experience_points}</td>
        <td>${achievement.requirement}</td>
        <td>
          <button class="edit-btn" data-achievement-id="${achievement.achievement_id}">Edit</button>
          <button class="delete-btn" data-achievement-id="${achievement.achievement_id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add event listeners for edit and delete buttons
    const editButtons = tableBody.querySelectorAll('.edit-btn');
    editButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const achievementId = button.getAttribute('data-achievement-id');
        openAchievementModal(achievementId);
      });
    });

    const deleteButtons = tableBody.querySelectorAll('.delete-btn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const achievementId = button.getAttribute('data-achievement-id');
        await deleteAchievement(achievementId);
      });
    });
  } catch (error) {
    console.error('Error loading achievements:', error);
    tableBody.innerHTML = `<tr><td colspan="6">Error loading achievements: ${error.message}</td></tr>`;
  }
}

function setupUserModal() {
  const modal = document.getElementById('user-modal');
  const closeBtn = document.getElementById('close-user-modal');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  });

  // Close modal when clicking outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Setup admin role change buttons
  const makeAdminBtn = document.getElementById('make-admin-btn');
  const removeAdminBtn = document.getElementById('remove-admin-btn');
  const deleteUserBtn = document.getElementById('delete-user-btn');

  if (makeAdminBtn) {
    makeAdminBtn.addEventListener('click', async () => {
      await changeUserRole('admin');
    });
  }
  if (removeAdminBtn) {
    removeAdminBtn.addEventListener('click', async () => {
      await changeUserRole('regular');
    });
  }
  if (deleteUserBtn) {
    deleteUserBtn.addEventListener('click', async () => {
      await deleteUser();
    });
  }
}

async function openUserModal(userId) {
  const modal = document.getElementById('user-modal');
  const content = document.getElementById('user-details-content');

  if (!modal || !content) return;

  // Store the current user ID for other operations
  modal.dataset.userId = userId;

  // Show modal
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal

  // Show loading state
  content.innerHTML = '<p>Loading user details...</p>';

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/users/${userId}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const user = await response.json();
    // Format the dates
    const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    // Create user details HTML
    let detailsHTML = `
      <div class="detail-section">
        <div class="detail-row">
          <div class="detail-label">Username:</div>
          <div>${user.username}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email:</div>
          <div>${user.email}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Joined:</div>
          <div>${createdDate}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Role:</div>
          <div><span class="role-badge role-${user.user_role}">${user.user_level}</span></div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Level:</div>
          <div>${user.level || 1}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">XP:</div>
          <div>${user.experience || 0} / ${user.experience_to_next_level || 100}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Entries:</div>
          <div>${user.entry_count || 0}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Current Streak:</div>
          <div>${user.current_streak || 0} days</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Best Streak:</div>
          <div>${user.best_streak || 0} days</div>
        </div>
      </div>
    `;

    // Add achievements section if available
    if (user.achievements && user.achievements.length > 0) {
      detailsHTML += `
        <h3>User Achievements</h3>
        <div class="achievements-list">
      `;
      user.achievements.forEach((achievement) => {
        const earnedDate = new Date(achievement.earned_at).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          },
        );
        detailsHTML += `
          <div class="achievement-item">
            <div class="achievement-header">
              <span class="achievement-name">${achievement.name}</span>
              <span class="achievement-date">Earned: ${earnedDate}</span>
            </div>
            <div class="achievement-description">${achievement.description} (+${achievement.experience_points} XP)</div>
          </div>
        `;
      });
      detailsHTML += '</div>';
    } else {
      detailsHTML += '<p>No achievements earned yet.</p>';
    }

    // Update the content
    content.innerHTML = detailsHTML;
  } catch (error) {
    console.error('Error loading user details:', error);
    content.innerHTML = `<p>Error loading user details: ${error.message}</p>`;
  }
}

async function changeUserRole(role) {
  const modal = document.getElementById('user-modal');
  if (!modal) return;

  const userId = modal.dataset.userId;
  if (!userId) {
    alert('User ID not found');
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/users/${userId}/level`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userLevel: role}),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to change role. Status: ${response.status}`,
      );
    }
    alert(`User role successfully changed to ${role}`);

    // Refresh user details and users table
    openUserModal(userId);
    loadUsersTable();
  } catch (error) {
    console.error('Error changing user role:', error);
    alert(`Error: ${error.message}`);
  }
}

async function deleteUser() {
  const modal = document.getElementById('user-modal');
  if (!modal) return;

  const userId = modal.dataset.userId;
  if (!userId) {
    alert('User ID not found');
    return;
  }

  // Confirm deletion
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.',)) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/users/${userId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to delete user. Status: ${response.status}`,
      );
    }
    alert('User deleted successfully');

    // Close modal and refresh users and system statistics
    modal.style.display = 'none';
    document.body.style.overflow = '';
    loadUsersTable();
    loadSystemStats();
  } catch (error) {
    console.error('Error deleting user:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to initialize the achievement management modal
function setupAchievementModal() {
  const modal = document.getElementById('achievement-modal');
  const closeBtn = document.getElementById('close-achievement-modal');
  const addBtn = document.getElementById('add-achievement-btn');
  const form = document.getElementById('achievement-form');
  const cancelBtn = document.getElementById('cancel-achievement');

  if (!modal || !closeBtn || !form) return;

// tarviiiko if-lausetta?
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openAchievementModal();
    });
  }
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  });
  // ??? tarviiko if-lausetta?
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const achievementId = document.getElementById('achievement-id').value;
    const name = document.getElementById('achievement-name').value;
    const description = document.getElementById('achievement-description',).value;
    const experience = document.getElementById('achievement-xp').value;
    const requirement = document.getElementById('achievement-requirement',).value;

    const achievementData = {
      name,
      description,
      experience_points: experience,
      requirement,
    };
    if (achievementId) {
      await updateAchievement(achievementId, achievementData);
    } else {
      await createAchievement(achievementData);
    }
  });
}

// Function to open the achievement management modal
async function openAchievementModal(achievementId = null) {
  const modal = document.getElementById('achievement-modal');
  const form = document.getElementById('achievement-form');
  const title = document.getElementById('achievement-form-title');
  const idInput = document.getElementById('achievement-id');
  const nameInput = document.getElementById('achievement-name');
  const descInput = document.getElementById('achievement-description');
  const xpInput = document.getElementById('achievement-xp');
  const reqInput = document.getElementById('achievement-requirement');

  if (!modal || !form || !title) return;

  form.reset();

  // Set title and prepare form for management
  if (achievementId) {
    title.textContent = 'Edit Achievement';
    try {
      const response = await fetch(
        `http://localhost:3000/api/achievements/${achievementId}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const achievement = await response.json();
      idInput.value = achievement.id;
      nameInput.value = achievement.name;
      descInput.value = achievement.description;
      xpInput.value = achievement.experience_points;
      reqInput.value = achievement.requirement;
    } catch (error) {
      console.error('Error loading achievement details:', error);
      alert(`Error: ${error.message}`);
      return;
    }
  } else {
    title.textContent = 'Add Achievement';
    idInput.value = '';
  }

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

async function createAchievement(achievementData) {
  try {
    const response = await fetch('http://localhost:3000/api/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(achievementData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to create achievement. Status: ${response.status}`,
      );
    }

    alert('Achievement created successfully');

    // Close modal and refresh achievements table
    document.getElementById('achievement-modal').style.display = 'none';
    document.body.style.overflow = '';
    loadAchievementsTable();
  } catch (error) {
    console.error('Error creating achievement:', error);
    alert(`Error: ${error.message}`);
  }
}

async function updateAchievement(achievementId, achievementData) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/achievements/${achievementId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievementData),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to update achievement. Status: ${response.status}`,
      );
    }

    alert('Achievement updated successfully');

    // Close modal and refresh achievements table
    document.getElementById('achievement-modal').style.display = 'none';
    document.body.style.overflow = '';
    loadAchievementsTable();
  } catch (error) {
    console.error('Error updating achievement:', error);
    alert(`Error: ${error.message}`);
  }
}

async function deleteAchievement(achievementId) {
  if (!confirm('Are you sure you want to delete this achievement?')) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/achievements/${achievementId}`,
      {
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to delete achievement. Status: ${response.status}`,
      );
    }

    alert('Achievement deleted successfully');

    // Refresh achievements table and system statistics
    loadAchievementsTable();
    loadSystemStats();
  } catch (error) {
    console.error('Error deleting achievement:', error);
    alert(`Error: ${error.message}`);
  }
}
