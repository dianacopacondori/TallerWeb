console.log("Script cargado");

const interruptor = document.getElementById("modoOscuro");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

// Restaurar el modo guardado aunque la página no tenga interruptor
const modoGuardado = localStorage.getItem("modo");
if (modoGuardado === "oscuro") {
  document.body.classList.add("dark-mode");
}

if (interruptor) {
  interruptor.checked = modoGuardado === "oscuro";

  interruptor.addEventListener("change", () => {
    if (interruptor.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("modo", "oscuro");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("modo", "claro");
    }
  });
}

// Menú hamburguesa seguro para todas las páginas
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburger.classList.remove("active");
    });
  });
}
