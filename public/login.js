document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password');

  togglePassword.addEventListener('click', function (e) {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.textContent = type === 'password' ? 'Passwort anzeigen' : 'Passwort verstecken';
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };
    //ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      window.location.href = data.redirectURL;
    } catch (err) {
      console.error('Error:', err);
      alert('Login fehlgeschlagen. Bitte überprüfe deine Daten.');
    }
  });
});
