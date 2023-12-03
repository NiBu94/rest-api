document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form'); // Use a specific ID

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
      const formData = new FormData(loginForm);
      const data = {
        username: formData.get('email'),
        password: formData.get('password'),
      };

      const response = await fetch('/api/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      if (result.token) {
        localStorage.setItem('jwt', result.token);
        window.location.href = '/form.html';
      } else {
        // Handle errors or show error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
