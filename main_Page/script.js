console.log("Script cargado");

const interruptor = document.getElementById("modoOscuro");

// Restaurar el modo guardado
if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("dark-mode");
    interruptor.checked = true;
}

// Cambiar de modo al mover el interruptor
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