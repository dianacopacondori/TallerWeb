/* =========================================================
   SCRIPT.JS - FUNCIONES GENERALES DE TODAS LAS PÁGINAS
   ---------------------------------------------------------
   COMENTARIOS PARA LA REVISIÓN DEL PROYECTO:
   - Este JavaScript se incorpora en cada página del sitio web.
   - Controla modo oscuro, menú responsive, eventos y cambios de DOM.
   ========================================================= */

console.log('Script general cargado en la página actual');

/* REQUISITO: variables y constantes para elementos del DOM. */
const interruptor = document.getElementById('modoOscuro');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

/* REQUISITO: localStorage para recordar el modo elegido por el usuario. */
const modoGuardado = localStorage.getItem('modo');
if (modoGuardado === 'oscuro') {
  document.body.classList.add('dark-mode');
}

if (interruptor) {
  interruptor.checked = modoGuardado === 'oscuro';

  /* REQUISITO: evento onchange. Cambia estilos de la página con modo oscuro. */
  interruptor.addEventListener('change', () => {
    if (interruptor.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('modo', 'oscuro');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('modo', 'claro');
    }
    crearDestellos();
  });
}

/* REQUISITO: evento onclick para abrir/cerrar menú hamburguesa en pantallas pequeñas. */
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  /* REQUISITO: estructura repetitiva forEach para cerrar menú al hacer clic en un enlace. */
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

/* REQUISITO: función que crea elementos nuevos y modifica estilos/contenido de la página. */
function crearDestellos() {
  const slider = document.querySelector('.theme-slider');
  if (!slider) return;

  const rect = slider.getBoundingClientRect();

  /* REQUISITO: estructura repetitiva for para crear destellos. */
  for (let i = 0; i < 12; i++) {
    const estrella = document.createElement('div');
    estrella.classList.add('sparkle');

    estrella.style.left = rect.left + rect.width / 2 + (Math.random() * 80 - 40) + 'px';
    estrella.style.top = rect.top + rect.height / 2 + (Math.random() * 60 - 30) + 'px';

    document.body.appendChild(estrella);

    setTimeout(() => {
      estrella.remove();
    }, 800);
  }
}
