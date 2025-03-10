async function fetchAndDisplayUserStats() {
  try {
    // Get the UI elements that need to be updated
    const levelNumber = document.querySelector('.level-number');
    const levelLabel = document.querySelector('.level-label');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const totalEntriesElement = document.getElementById('total-entries');
    const currentStreakElement = document.getElementById('current-streak');
    const bestStreakElement = document.getElementById('best-streak');

    // Show loading states
    if (levelNumber) levelNumber.textContent = '...';
    if (levelLabel) levelLabel.textContent = 'Loading';
    if (totalEntriesElement) totalEntriesElement.textContent = '...';
    if (currentStreakElement) currentStreakElement.textContent = '...';
    if (bestStreakElement) bestStreakElement.textContent = '...';

    // Try to use cached user data first
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');

    // If we need more detailed stats, fetch from the API
    if (!userData.total_entries || !userData.current_streak) {
      const response = await fetch('http://localhost:3000/api/users/profile');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      userData = await response.json();

      // Update cached userData
      localStorage.setItem('userData', JSON.stringify(userData));
    }

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

      // Update streak stats
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
  fetchAndDisplayUserStats();
});

export default fetchAndDisplayUserStats;
