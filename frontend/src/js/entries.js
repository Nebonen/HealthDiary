// Function to fetch entries from the backend and display them
async function fetchAndDisplayEntries() {
  try {
    // Get the container where entries will be displayed
    const entriesContainer = document.getElementById('all-entries');

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

      // Assemble the entry item
      entryItem.appendChild(entryHeader);
      entryItem.appendChild(entryStats);
      entryItem.appendChild(entryNotes);

      // Add the entry to the container
      entriesContainer.appendChild(entryItem);
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    const entriesContainer = document.getElementById('all-entries');
    entriesContainer.innerHTML = `<div class="error">Failed to load entries: ${error.message}</div>`;
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayEntries);

// Function to fetch and display only the 2 most recent entries
async function fetchAndDisplayRecentEntries() {
  try {
    // Get the container where recent entries will be displayed
    const recentEntriesContainer = document.getElementById('recent-entries');

    // Clear any existing entries
    recentEntriesContainer.innerHTML = '';

    // Show loading indicator
    recentEntriesContainer.innerHTML =
      '<div class="loading">Loading recent entries...</div>';

    // Fetch entries from the backend
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
    recentEntriesContainer.innerHTML = `<div class="error">Failed to load recent entries: ${error.message}</div>`;
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayRecentEntries();
  // If you're also using the previous function for all entries
  // You can call it here too
  fetchAndDisplayEntries();
});

// Update recent entries whenever a new entry is saved
// This assumes you have a form submission event handler
document
  .getElementById('diary-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();

    // Your existing form submission code here
    // ...

    // After successful submission, refresh the recent entries
    fetchAndDisplayRecentEntries();
  });

export default fetchAndDisplayEntries;
