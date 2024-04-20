async function generateDownload(e) {
  e.preventDefault();
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
    body: JSON.stringify({ weeks: selectedValues }),
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
