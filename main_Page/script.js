console.log("Script cargado");

const interruptor = document.getElementById("modoOscuro");

// Restaurar el modo guardado
if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("dark-mode");
    interruptor.checked = true;
}

// Cambiar de modo al mover el interruptor
interruptor.addEventListener("change", () => {

    if (interruptor.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("modo", "oscuro");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("modo", "claro");
    }

    console.log(document.body.classList);

});