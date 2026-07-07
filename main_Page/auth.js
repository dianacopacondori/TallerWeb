function mostrarMensaje(formulario, texto, tipo = 'error') {
  let mensaje = formulario.querySelector('.mensaje-auth');

  if (!mensaje) {
    mensaje = document.createElement('p');
    mensaje.className = 'mensaje-auth';
    formulario.appendChild(mensaje);
  }

  mensaje.textContent = texto;
  mensaje.classList.remove('ok', 'error');
  mensaje.classList.add(tipo);
}

const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('user').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('pass').value;

    try {
      const respuesta = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mostrarMensaje(registerForm, data.error || 'No se pudo registrar.', 'error');
        return;
      }

      mostrarMensaje(registerForm, data.mensaje, 'ok');

      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1200);
    } catch (error) {
      mostrarMensaje(registerForm, 'No hay conexión con el servidor.', 'error');
    }
  });
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const correo = document.getElementById('correoLogin').value.trim();
    const password = document.getElementById('pass').value;

    try {
      const respuesta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mostrarMensaje(loginForm, data.error || 'No se pudo iniciar sesión.', 'error');
        return;
      }

      window.location.href = '/index.html';
    } catch (error) {
      mostrarMensaje(loginForm, 'No hay conexión con el servidor.', 'error');
    }
  });
}
