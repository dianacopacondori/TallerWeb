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

  interruptor.addEventListener("change",()=>{

    if(interruptor.checked){
        document.body.classList.add("dark-mode");
        localStorage.setItem("modo","oscuro");
    }else{
        document.body.classList.remove("dark-mode");
        localStorage.setItem("modo","claro");
    }
    crearDestellos();
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
/*destellos en el slider de temas*/
function crearDestellos() {

    const slider = document.querySelector(".theme-slider");

    const rect = slider.getBoundingClientRect();

    for(let i = 0; i < 12; i++){

        const estrella = document.createElement("div");

        estrella.classList.add("sparkle");

        estrella.style.left =
            rect.left + rect.width/2 + (Math.random()*80-40) + "px";

        estrella.style.top =
            rect.top + rect.height/2 + (Math.random()*60-30) + "px";

        document.body.appendChild(estrella);

        setTimeout(() => {

            estrella.remove();

        },800);

    }

}