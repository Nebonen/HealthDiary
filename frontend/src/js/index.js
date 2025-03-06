import '../css/index.css';

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

const dialog = () => {
  const modal = document.getElementById('entries-modal');
  const openModalBtn = document.getElementById('open-entries-modal');
  const closeModalBtn = document.getElementById('close-modal');

  openModalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
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

dialog();
dateToToday();
