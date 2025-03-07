// Function to fetch user statistics and update the UI
async function fetchAndDisplayUserStats() {
  try {
    //console.log('Fetching user stats...');
    // Get the UI elements that need to be updated
    const levelNumber = document.querySelector('.level-number');
    const levelLabel = document.querySelector('.level-label');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    // These selectors work with the updated HTML structure
    const totalEntriesElement = document.getElementById('total-entries');
    const currentStreakElement = document.getElementById('current-streak');
    const bestStreakElement = document.getElementById('best-streak');

    // Show loading states
    if (levelNumber) levelNumber.textContent = '...';
    if (levelLabel) levelLabel.textContent = 'Loading';
    if (totalEntriesElement) totalEntriesElement.textContent = '...';
    if (currentStreakElement) currentStreakElement.textContent = '...';
    if (bestStreakElement) bestStreakElement.textContent = '...';

    // Fetch user data from the backend
    const response = await fetch('http://localhost:3000/api/users');

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response (assuming it returns data for the current user)
    const userData = await response.json();

    // If we have user data, update the UI elements
    if (userData) {
      // Update level information
      const level = userData.level || 1;
      const experience = userData.experience || 0;
      const experienceToNextLevel = userData.experience_to_next_level || 100;
      const progress = (experience / experienceToNextLevel) * 100;

      // Set the level number and label
      if (levelNumber) levelNumber.textContent = level;
      if (levelLabel) levelLabel.textContent = 'Level';

      // Update the progress bar
      if (progressFill) progressFill.style.width = `${progress}%`;

      // Update the progress text
      if (progressText)
        progressText.textContent = `${experience} / ${experienceToNextLevel} XP to next level`;

      // Update activity stats
      if (totalEntriesElement)
        totalEntriesElement.textContent = userData.total_entries || 0;
      if (currentStreakElement)
        currentStreakElement.textContent = userData.current_streak || 0;
      if (bestStreakElement)
        bestStreakElement.textContent = userData.highest_streak || 0;
    } else {
      // Handle case where no user data is returned
      console.error('No user data returned from API');
      if (levelNumber) levelNumber.textContent = '1';
      if (levelLabel) levelLabel.textContent = 'Level';
      if (progressFill) progressFill.style.width = '0%';
      if (progressText) progressText.textContent = '0 / 100 XP to next level';
      if (totalEntriesElement) totalEntriesElement.textContent = '0';
      if (currentStreakElement) currentStreakElement.textContent = '0';
      if (bestStreakElement) bestStreakElement.textContent = '0';
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);

    // Set default values in case of error
    const levelNumber = document.querySelector('.level-number');
    const levelLabel = document.querySelector('.level-label');
    if (levelNumber) levelNumber.textContent = '1';
    if (levelLabel) levelLabel.textContent = 'Level';

    // Show error message somewhere in the UI
    const progressText = document.querySelector('.progress-text');
    if (progressText) progressText.textContent = 'Could not load user data';
  }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Fetch user stats (level, experience, streaks)
  fetchAndDisplayUserStats();
});

export default fetchAndDisplayUserStats;
