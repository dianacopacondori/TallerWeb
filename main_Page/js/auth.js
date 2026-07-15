/* =========================================================
   AUTH.JS - REGISTRO E INICIO DE SESIÓN
   ---------------------------------------------------------
   COMENTARIOS PARA LA REVISIÓN DEL PROYECTO:
   - Este archivo JavaScript está relacionado con registrar.html
     y login.html.
   - Aquí se evidencia validación básica de formularios, eventos,
     manipulación del DOM, funciones, condicionales y uso de fetch.
   ========================================================= */

/* REQUISITO: función que modifica el DOM para mostrar mensajes. */
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

function marcarCampo(input, valido) {
  if (!input) return;
  input.classList.remove('campo-valido', 'campo-error');
  input.classList.add(valido ? 'campo-valido' : 'campo-error');
}

/* REQUISITO: validación básica de formularios con condicionales. */
function validarRegistro() {
  const usuario = document.getElementById('user');
  const correo = document.getElementById('correo');
  const password = document.getElementById('pass');

  if (!usuario || !correo || !password) return false;

  const usuarioOk = usuario.value.trim().length >= 3 && usuario.value.trim().length <= 15;
  const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  const passwordOk = password.value.length >= 8;

  marcarCampo(usuario, usuarioOk);
  marcarCampo(correo, correoOk);
  marcarCampo(password, passwordOk);

  return usuarioOk && correoOk && passwordOk;
}

function validarLogin() {
  const correo = document.getElementById('correoLogin');
  const password = document.getElementById('pass');

  if (!correo || !password) return false;

  const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  const passwordOk = password.value.length >= 8;

  marcarCampo(correo, correoOk);
  marcarCampo(password, passwordOk);

  return correoOk && passwordOk;
}

/* REQUISITO: estas funciones se llaman desde oninput y onclick en el HTML. */
window.validarRegistroDesdeHTML = function () {
  validarRegistro();
};

window.validarLoginDesdeHTML = function () {
  validarLogin();
};

window.mostrarOAuthPendiente = function (proveedor) {
  alert(`El acceso con ${proveedor} es visual en este avance. El registro real se realiza con correo y contraseña.`);
};

const registerForm = document.getElementById('registerForm');

if (registerForm) {
  /* REQUISITO: evento submit del formulario de registro. */
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validarRegistro()) {
      mostrarMensaje(registerForm, 'Revisa usuario, correo y contraseña. La contraseña debe tener mínimo 8 caracteres.', 'error');
      return;
    }

    const usuario = document.getElementById('user').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('pass').value;

    try {
      /* REQUISITO: JavaScript relacionado con la funcionalidad de registrar usuario. */
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
  /* REQUISITO: evento submit del formulario de inicio de sesión. */
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validarLogin()) {
      mostrarMensaje(loginForm, 'Ingresa un correo válido y una contraseña de mínimo 8 caracteres.', 'error');
      return;
    }

    const correo = document.getElementById('correoLogin').value.trim();
    const password = document.getElementById('pass').value;

    try {
      /* REQUISITO: JavaScript relacionado con la funcionalidad de iniciar sesión. */
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
