import fetchAndDisplayUserStats from './user.js';

// Function to fetch all entries from the backend and display them
async function fetchAndDisplayEntries() {
  try {
    const entriesContainer = document.getElementById('all-entries');

    if (!entriesContainer) {
      console.error('Entries container not found');
      return;
    }

    // Clear any existing entries
    entriesContainer.innerHTML = '';

    // Show loading indicator
    entriesContainer.innerHTML =
      '<div class="loading">Loading entries...</div>';

    const response = await fetch('http://localhost:3000/api/entries');

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const entries = await response.json();

    // Clear the loading indicator
    entriesContainer.innerHTML = '';

    // Check if there are any entries
    if (entries.length === 0) {
      entriesContainer.innerHTML =
        '<div class="no-entries">No entries found. Start by adding a new diary entry!</div>';
      return;
    }

    // Toimii ehkä väärin?
    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create a div for each entry
    entries.forEach((entry) => {
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';

      const entryHeader = document.createElement('div');
      entryHeader.className = 'entry-header';

      const entryDate = document.createElement('span');
      entryDate.className = 'entry-date';

      const date = new Date(entry.date);
      entryDate.textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const entryMood = document.createElement('span');
      entryMood.className = 'entry-mood';
      entryMood.textContent = entry.mood;

      entryHeader.appendChild(entryDate);
      entryHeader.appendChild(entryMood);

      const entryStats = document.createElement('p');
      entryStats.className = 'entry-stats';

      let statsText = '';
      if (entry.weight) statsText += `Weight: ${entry.weight} kg`;
      if (entry.weight && entry.sleep) statsText += ' | ';
      if (entry.sleep) statsText += `Sleep: ${entry.sleep} hrs`;
      entryStats.textContent = statsText;

      const entryNotes = document.createElement('p');
      entryNotes.className = 'entry-notes';
      entryNotes.textContent = entry.notes || 'No notes for this entry.';

      const entryActions = document.createElement('div');
      entryActions.className = 'entry-actions';

      const editButton = document.createElement('button');
      editButton.className = 'edit-btn';
      editButton.textContent = 'Edit';
      editButton.dataset.entryId = entry.id;

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.dataset.entryId = entry.id;

      entryActions.appendChild(editButton);
      entryActions.appendChild(deleteButton);

      entryItem.appendChild(entryHeader);
      entryItem.appendChild(entryStats);
      entryItem.appendChild(entryNotes);
      entryItem.appendChild(entryActions);
      entriesContainer.appendChild(entryItem);

      editButton.addEventListener('click', () => editEntry(entry.id));
      deleteButton.addEventListener('click', () => deleteEntry(entry.id));
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    const entriesContainer = document.getElementById('all-entries');
    if (entriesContainer) {
      entriesContainer.innerHTML = `<div class="error">Failed to load entries: ${error.message}</div>`;
    }
  }
}

// Function to fetch and display only the 2 most recent entries
async function fetchAndDisplayRecentEntries() {
  try {
    const recentEntriesContainer = document.getElementById('recent-entries');

    if (!recentEntriesContainer) {
      console.error('Recent entries container not found');
      return;
    }

    // Clear any existing entries
    recentEntriesContainer.innerHTML = '';

    // Show loading indicator
    recentEntriesContainer.innerHTML =
      '<div class="loading">Loading recent entries...</div>';

    // Check if user is authenticated (the fetch override will add the token)
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      recentEntriesContainer.innerHTML =
        '<div class="error">You need to be logged in to view entries</div>';
      return;
    }

    // (The fetch override will add auth header)
    const response = await fetch('http://localhost:3000/api/entries');

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const entries = await response.json();

    // Clear the loading indicator
    recentEntriesContainer.innerHTML = '';

    // Check if there are any entries
    if (entries.length === 0) {
      recentEntriesContainer.innerHTML =
        '<div class="no-entries">No entries yet. Create your first diary entry!</div>';
      return;
    }

    // Ehkä toimii väärin??
    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Take only the 2 most recent entries
    const recentEntries = entries.slice(0, 2);

    // Create a div for each recent entry
    recentEntries.forEach((entry) => {
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';

      const entryHeader = document.createElement('div');
      entryHeader.className = 'entry-header';

      const entryDate = document.createElement('span');
      entryDate.className = 'entry-date';
      const date = new Date(entry.date);
      entryDate.textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const entryMood = document.createElement('span');
      entryMood.className = 'entry-mood';
      entryMood.textContent = entry.mood;

      entryHeader.appendChild(entryDate);
      entryHeader.appendChild(entryMood);

      const entryStats = document.createElement('p');
      entryStats.className = 'entry-stats';

      let statsText = '';
      if (entry.weight) statsText += `Weight: ${entry.weight} kg`;
      if (entry.weight && entry.sleep) statsText += ' | ';
      if (entry.sleep) statsText += `Sleep: ${entry.sleep} hrs`;

      entryStats.textContent = statsText || 'No stats recorded';

      const entryNotes = document.createElement('p');
      entryNotes.className = 'entry-notes';
      entryNotes.textContent = entry.notes || 'No notes for this entry.';

      entryItem.appendChild(entryHeader);
      entryItem.appendChild(entryStats);
      entryItem.appendChild(entryNotes);
      recentEntriesContainer.appendChild(entryItem);
    });
  } catch (error) {
    console.error('Error fetching recent entries:', error);
    const recentEntriesContainer = document.getElementById('recent-entries');
    if (recentEntriesContainer) {
      recentEntriesContainer.innerHTML = `<div class="error">Failed to load recent entries: ${error.message}</div>`;
    }
  }
}

async function editEntry(entryId) {
  try {
    const diaryForm = document.getElementById('diary-form');
    const dateInput = document.getElementById('entry-date');
    const moodInput = document.getElementById('mood');
    const weightInput = document.getElementById('weight');
    const sleepInput = document.getElementById('sleep');
    const notesInput = document.getElementById('notes');
    const submitButton = diaryForm.querySelector('button[type="submit"]');

    // Change the form submission button text
    if (submitButton) submitButton.textContent = 'Update Entry';

    const response = await fetch(
      `http://localhost:3000/api/entries/${entryId}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch entry details: ${response.statusText}`);
    }
    const entry = await response.json();

    dateInput.value = new Date(entry.date).toISOString().split('T')[0];
    moodInput.value = entry.mood || '';
    weightInput.value = entry.weight || '';
    sleepInput.value = entry.sleep || '';
    notesInput.value = entry.notes || '';

    // Store the entry ID in the form for submission handling
    diaryForm.dataset.editEntryId = entryId;

    // Modify form submission handler to handle updates
    diaryForm.onsubmit = async function (event) {
      event.preventDefault();

      // Disable form submission button to prevent double-clicks
      if (submitButton) submitButton.disabled = true;

      try {
        const updateResponse = await fetch(
          `http://localhost:3000/api/entries/${entryId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              date: dateInput.value,
              mood: moodInput.value,
              weight: weightInput.value || null,
              sleep: sleepInput.value || null,
              notes: notesInput.value || null,
            }),
          },
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.message || 'Failed to update entry');
        }

        alert('Entry updated successfully!');

        // Reset the form and event handler
        diaryForm.reset();
        delete diaryForm.dataset.editEntryId;
        diaryForm.onsubmit = null;
        submitButton.textContent = 'Save Entry';

        // Restore default form submission behavior
        setupDiaryForm();

        // Refresh entries
        fetchAndDisplayEntries();
        fetchAndDisplayRecentEntries();
      } catch (error) {
        console.error('Error updating entry:', error);
        alert(`Error: ${error.message}`);
      } finally {
        // Re-enable the submit button
        if (submitButton) submitButton.disabled = false;
      }
    };
  } catch (error) {
    console.error('Error editing entry:', error);
    alert(`Error: ${error.message}`);
  }
}

async function deleteEntry(entryId) {
  if (!confirm('Are you sure you want to delete this entry?')) {
    return;
  }
  try {
    // Get authentication token from localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('You need to be logged in to delete entries');
      return;
    }

    const response = await fetch(
      `http://localhost:3000/api/entries/${entryId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to delete entry: ${response.statusText}`);
    }

    // Refresh the entries list
    fetchAndDisplayEntries();
    if (typeof fetchAndDisplayRecentEntries === 'function') {
      fetchAndDisplayRecentEntries();
    }

    // Refresh user stats
    fetchAndDisplayUserStats();

    alert('Entry deleted successfully');
  } catch (error) {
    console.error('Error deleting entry:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to set up the diary submission form
function setupDiaryForm() {
  const diaryForm = document.getElementById('diary-form');
  if (!diaryForm) return;

  diaryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Disable form submission button to prevent double-clicks
    const submitButton = diaryForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Saving...';
    }

    const date = document.getElementById('entry-date').value;
    const mood = document.getElementById('mood').value;
    const weight = document.getElementById('weight').value;
    const sleep = document.getElementById('sleep').value;
    const notes = document.getElementById('notes').value;

    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('You need to be logged in to create entries');
      window.location.href = '/src/pages/login.html';
      return;
    }

    // Clear any existing status messages
    removeStatusMessage();

    try {
      // The fetch override will add the auth header automatically
      const response = await fetch('http://localhost:3000/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          mood,
          weight: weight || null,
          sleep: sleep || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create entry');
      }

      const data = await response.json();

      const successInfo = createStatusMessage('success');

      let messageContent = '<strong>Entry created successfully!</strong>';

      // Add achievement information if available
      if (
        data.entry &&
        data.entry.achievements &&
        data.entry.achievements.length > 0
      ) {
        messageContent +=
          "<div class='achievements-list'><p>You've unlocked new achievements:</p><ul>";
        data.entry.achievements.forEach((achievement) => {
          messageContent += `<li><strong>${achievement.name}:</strong> ${achievement.description} (+${achievement.experience_points} XP)</li>`;
        });
        messageContent += '</ul></div>';
      }

      successInfo.innerHTML = messageContent;
      diaryForm.appendChild(successInfo);

      // Reset the form
      diaryForm.reset();

      // Set today's date again
      const today = new Date();
      document.getElementById('entry-date').value = today
        .toISOString()
        .split('T')[0];

      // Refresh entries display
      fetchAndDisplayRecentEntries();

      // Update user stats with new data
      if (data.userStats) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = {...userData, ...data.userStats};
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        if (typeof fetchAndDisplayUserStats === 'function') {
          fetchAndDisplayUserStats();
        }
      }

      // Remove success message after 5 seconds
      setTimeout(() => {
        if (successInfo && successInfo.parentNode) {
          successInfo.remove();
        }
      }, 5000);
    } catch (error) {
      console.error('Error creating entry:', error);

      // Show error message with non-blocking UI
      const errorInfo = createStatusMessage('error');
      errorInfo.innerHTML = `<strong>Error:</strong> ${error.message}`;
      diaryForm.appendChild(errorInfo);

      // Remove error message after 5 seconds
      setTimeout(() => {
        if (errorInfo && errorInfo.parentNode) {
          errorInfo.remove();
        }
      }, 5000);
    } finally {
      // Re-enable the submit button regardless of success/failure
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Save Entry';
      }
    }
  });
}

// Helper function to create status messages
function createStatusMessage(type) {
  // Remove any existing status messages first
  removeStatusMessage();

  const statusElement = document.createElement('div');
  statusElement.className = `status-message ${type}-message`;
  return statusElement;
}

// Helper function to remove status messages
function removeStatusMessage() {
  const existingMessages = document.querySelectorAll('.status-message');
  existingMessages.forEach((message) => message.remove());
}

// Call functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupDiaryForm();
  fetchAndDisplayRecentEntries();

  const openEntriesModalBtn = document.getElementById('open-entries-modal');
  if (openEntriesModalBtn) {
    openEntriesModalBtn.addEventListener('click', fetchAndDisplayEntries);
  }
});

export {fetchAndDisplayEntries, fetchAndDisplayRecentEntries, setupDiaryForm};
