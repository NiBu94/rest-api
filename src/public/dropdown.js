document.addEventListener('DOMContentLoaded', function () {
  const menuButton = document.getElementById('menu-button');
  const dropdownMenu = document.getElementById('menu-dropdown');
  const selectedYear = document.getElementById('selected-year');

  menuButton.addEventListener('click', function () {
    dropdownMenu.classList.toggle('hidden');
  });

  // Set the current and next year dynamically
  const currentYear = new Date().getFullYear();
  document.getElementById('current-year').textContent = currentYear;
  document.getElementById('next-year').textContent = currentYear + 1;

  // Update the selected year on click
  document.getElementById('current-year').addEventListener('click', function () {
    selectedYear.textContent = currentYear;
    dropdownMenu.classList.add('hidden');
  });
  document.getElementById('next-year').addEventListener('click', function () {
    selectedYear.textContent = currentYear + 1;
    dropdownMenu.classList.add('hidden');
  });

  document.getElementById('selectableButton').addEventListener('click', function () {
    this.classList.toggle('bg-blue-500');
    this.classList.toggle('bg-green-500'); // Different color when selected
  });
});
