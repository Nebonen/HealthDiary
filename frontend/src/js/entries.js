// Function to fetch entries from the backend and display them
async function fetchAndDisplayEntries() {
  try {
    // Get the container where entries will be displayed
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

    // Fetch entries from the backend
    const response = await fetch('http://localhost:3000/api/entries');

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const entries = await response.json();

    // Clear the loading indicator
    entriesContainer.innerHTML = '';

    // Check if there are any entries
    if (entries.length === 0) {
      entriesContainer.innerHTML =
        '<div class="no-entries">No entries found. Start by adding a new diary entry!</div>';
      return;
    }

    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create a div for each entry
    entries.forEach((entry) => {
      // Create the entry item container
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';

      // Create the entry header
      const entryHeader = document.createElement('div');
      entryHeader.className = 'entry-header';

      // Format the date
      const entryDate = document.createElement('span');
      entryDate.className = 'entry-date';
      // Convert the date to a readable format
      const date = new Date(entry.date);
      entryDate.textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Add the mood
      const entryMood = document.createElement('span');
      entryMood.className = 'entry-mood';
      entryMood.textContent = entry.mood;

      // Add date and mood to the header
      entryHeader.appendChild(entryDate);
      entryHeader.appendChild(entryMood);

      // Create the stats section (weight and sleep)
      const entryStats = document.createElement('p');
      entryStats.className = 'entry-stats';

      // Build the stats text with conditional rendering
      let statsText = '';
      if (entry.weight) statsText += `Weight: ${entry.weight} kg`;
      if (entry.weight && entry.sleep) statsText += ' | ';
      if (entry.sleep) statsText += `Sleep: ${entry.sleep} hrs`;
      entryStats.textContent = statsText;

      // Create the notes section
      const entryNotes = document.createElement('p');
      entryNotes.className = 'entry-notes';
      entryNotes.textContent = entry.notes || 'No notes for this entry.';

      // Create actions section with edit and delete buttons
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

      // Assemble the entry item
      entryItem.appendChild(entryHeader);
      entryItem.appendChild(entryStats);
      entryItem.appendChild(entryNotes);
      entryItem.appendChild(entryActions);

      // Add the entry to the container
      entriesContainer.appendChild(entryItem);

      // Add event listeners for edit and delete buttons
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

// Function to edit an entry
function editEntry(entryId) {
  console.log(`Edit entry ${entryId}`);
  // You would typically fetch the entry details and populate a form
  // For now just log the action
}

// Function to delete an entry
async function deleteEntry(entryId) {
  if (!confirm('Are you sure you want to delete this entry?')) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/entries/${entryId}`,
      {
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to delete entry: ${response.statusText}`);
    }

    // Refresh the entries list
    fetchAndDisplayEntries();
    // Also refresh recent entries if that function exists
    if (typeof fetchAndDisplayRecentEntries === 'function') {
      fetchAndDisplayRecentEntries();
    }

    alert('Entry deleted successfully');
  } catch (error) {
    console.error('Error deleting entry:', error);
    alert(`Error: ${error.message}`);
  }
}

// Function to fetch and display only the 2 most recent entries
async function fetchAndDisplayRecentEntries() {
  try {
    // Get the container where recent entries will be displayed
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

    // Fetch entries from the backend (the fetch override will add auth header)
    const response = await fetch('http://localhost:3000/api/entries');

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const entries = await response.json();

    // Clear the loading indicator
    recentEntriesContainer.innerHTML = '';

    // Check if there are any entries
    if (entries.length === 0) {
      recentEntriesContainer.innerHTML =
        '<div class="no-entries">No entries yet. Create your first diary entry!</div>';
      return;
    }

    // Sort entries by date (newest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Take only the 2 most recent entries
    const recentEntries = entries.slice(0, 2);

    // Create a div for each recent entry
    recentEntries.forEach((entry) => {
      // Create the entry item container
      const entryItem = document.createElement('div');
      entryItem.className = 'entry-item';

      // Create the entry header
      const entryHeader = document.createElement('div');
      entryHeader.className = 'entry-header';

      // Format the date
      const entryDate = document.createElement('span');
      entryDate.className = 'entry-date';
      // Convert the date to a readable format
      const date = new Date(entry.date);
      entryDate.textContent = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Add the mood
      const entryMood = document.createElement('span');
      entryMood.className = 'entry-mood';
      entryMood.textContent = entry.mood;

      // Add date and mood to the header
      entryHeader.appendChild(entryDate);
      entryHeader.appendChild(entryMood);

      // Create the stats section (weight and sleep)
      const entryStats = document.createElement('p');
      entryStats.className = 'entry-stats';

      // Build the stats text with conditional rendering
      let statsText = '';
      if (entry.weight) statsText += `Weight: ${entry.weight} kg`;
      if (entry.weight && entry.sleep) statsText += ' | ';
      if (entry.sleep) statsText += `Sleep: ${entry.sleep} hrs`;

      entryStats.textContent = statsText || 'No stats recorded';

      // Create the notes section
      const entryNotes = document.createElement('p');
      entryNotes.className = 'entry-notes';
      entryNotes.textContent = entry.notes || 'No notes for this entry.';

      // Assemble the entry item
      entryItem.appendChild(entryHeader);
      entryItem.appendChild(entryStats);
      entryItem.appendChild(entryNotes);

      // Add the entry to the container
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

// Update the setupDiaryForm function to prevent double submission
function setupDiaryForm() {
  const diaryForm = document.getElementById('diary-form');
  if (!diaryForm) return;

  diaryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Disable form submission button to prevent double-clicks
    const submitButton = diaryForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

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

      // Build a single message with both entry creation and achievements
      let message = 'Entry created successfully!';

      // Add achievement information if available
      if (
        data.entry &&
        data.entry.achievements &&
        data.entry.achievements.length > 0
      ) {
        message += "\n\nYou've unlocked new achievements:";
        data.entry.achievements.forEach((achievement) => {
          message += `\n- ${achievement.name}: ${achievement.description} (+${achievement.experience_points} XP)`;
        });
      }

      // Show a single alert with all the information
      alert(message);

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
    } catch (error) {
      console.error('Error creating entry:', error);
      alert(`Error: ${error.message}`);
    } finally {
      // Re-enable the submit button regardless of success/failure
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// Call functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupDiaryForm();
  fetchAndDisplayRecentEntries();

  // If you're on a page with the entries modal
  const openEntriesModalBtn = document.getElementById('open-entries-modal');
  if (openEntriesModalBtn) {
    openEntriesModalBtn.addEventListener('click', fetchAndDisplayEntries);
  }
});

export {fetchAndDisplayEntries, fetchAndDisplayRecentEntries, setupDiaryForm};
