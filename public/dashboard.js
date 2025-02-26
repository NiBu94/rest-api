async function generateDownload(e) {
  e.preventDefault();

  const yearSelect = document.getElementById('yearSelect');
  const selectedYear = yearSelect.value;
  if (!selectedYear) {
    alert('Bitte wählen Sie ein Jahr aus.');
    return;
  }

  const checkboxes = document.querySelectorAll('.weekCheckboxes');
  const selectedValues = [];

  for (const checkbox of checkboxes) {
    if (checkbox.checked) selectedValues.push(checkbox.id);
  }

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      year: selectedYear,
      weeks: selectedValues,
    }),
  };

  try {
    const response = await fetch('/admin/download-excel', fetchOptions);
    if (!response.ok) throw new Error('Es ist ein Fehler aufgetreten. Bitte wenden Sie sich an Ihren Admin.');
    const data = await response.json();

    const container = document.querySelector('.buttonContainer');
    const newButton = document.createElement('a');
    newButton.setAttribute('href', data.downloadURL);
    newButton.setAttribute(
      'class',
      'inline-flex justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    );
    newButton.innerText = 'Download';

    container.appendChild(newButton);
  } catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const yearSelect = document.getElementById('yearSelect');
  const currentYear = new Date().getFullYear();

  try {
    const response = await fetch('/api-dev/week-data/years');
    if (!response.ok) throw new Error('Failed to fetch year data');

    const years = await response.json();

    years.forEach((year) => {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;

      if (year == currentYear) {
        option.selected = true;
      }

      yearSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching years:', error);
    yearSelect.innerHTML = '<option disabled>Fehler beim Laden der Jahre</option>';
  }
});
