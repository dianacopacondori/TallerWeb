POKÉMON CAFÉ - REGISTRO, LOGIN, PEDIDO E HISTORIAL MYSQL

1) Instala dependencias:
   npm.cmd install

2) Crea tu archivo .env:
   Copia .env.example y renómbralo como .env.
   Coloca los datos reales de Aiven: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.

3) Descarga el CA certificate desde Aiven y guárdalo en la raíz del proyecto como:
   ca.pem

4) La tabla usuarios, pedidos y pedido_detalles se crean automáticamente al iniciar el servidor.
   Si quieres hacerlo manualmente, ejecuta database.sql en la consola SQL de Aiven.

5) Ejecuta:
   npm.cmd start

6) Abre:
   http://localhost:3000/registrar.html
   http://localhost:3000/login.html
   http://localhost:3000/menu.html

CAMBIOS AGREGADOS:
- Menú visual tipo tienda online, con categorías, buscador, ordenamiento, precio original y precio con descuento.
- Botones "Añadir al pedido" con carrito en localStorage.
- Formulario de pedido con nombre, dirección, teléfono, selección de platos y cantidad.
- Envío de pedido al backend con sesión activa.
- Historial de compras por usuario conectado a MySQL.
- Tabla de pedidos con número de pedido, cliente, productos, cantidad, total y estado.
- Página de ofertas con urgencia, descuento y stock limitado.

IMPORTANTE:
- Debes iniciar sesión antes de enviar un pedido para que se guarde en tu historial.
- No subas .env ni ca.pem a GitHub.
- Este proyecto mantiene la temática Pokémon como proyecto académico/fan-made.

AJUSTE FINAL SEGÚN INDICACIONES DEL AVANCE:
- Se agregaron comentarios en el código con la palabra "REQUISITO" para que puedas ubicar rápido cada punto solicitado.
- index.html, registrar.html, login.html, menu.html, ofertas.html, formulario_pedido.html y pedidos.html tienen JavaScript incorporado.
- script.js contiene funciones generales: modo oscuro, menú responsive, eventos y manipulación del DOM.
- auth.js contiene validación de registro/login, eventos submit, oninput y mensajes dinámicos.
- shop.js contiene arreglo de productos, funciones, condicionales, estructuras repetitivas, eventos click/change/input, carrito, pedido e historial.
- menu.html evidencia oninput, onchange y onclick.
- ofertas.html evidencia onclick y onchange.
- formulario_pedido.html evidencia oninput, onchange, onclick y validación básica.
- pedidos.html evidencia oninput, onchange, onclick y tabla dinámica.
- db.js y database.sql tienen comentarios para las capturas del código de conexión a BD y consultas SQL.


ACTUALIZACIÓN FINAL SOLICITADA
------------------------------
- Se restauró el navbar original en menu.html, ofertas.html, formulario_pedido.html y pedidos.html.
- Se mantiene el botón de modo oscuro tipo Pokébola en esas páginas.
- menu.html ahora usa todos los productos del menú original: Postres, Bebidas y Platos Estrella.
- ofertas.html ahora muestra solo los productos originales de ofertas: Galletas Decoradas, Pokebowl, Eeveelution Macarons, Postre Pikachu, Pika-Pika Cheesecake y Clefairy Fluffy Pancakes.
- Se conservaron los comentarios REQUISITO para evidenciar JavaScript, eventos, DOM, validaciones, funciones, arreglos y condicionales.

ACTUALIZACIÓN DE CARRITO Y STOCK
---------------------------------
- Se quitó el bloque visual grande tipo hero de menu.html, ofertas.html, formulario_pedido.html y pedidos.html.
- Se quitó el panel lateral "Mi pedido" del menú y se reemplazó por un botón flotante de carrito en la esquina inferior derecha.
- El botón flotante redirige a formulario_pedido.html y muestra la cantidad de productos agregados.
- En formulario_pedido.html, la sección "Selecciona tus platos" ya no muestra todos los productos: solo muestra los productos que el usuario agregó desde Menú u Ofertas.
- Se quitó el texto de "Tiempo estimado" del resumen del pedido.
- Se agregó la tabla productos en MySQL para manejar stock real.
- Al confirmar una compra, server.js valida el stock en MySQL y descuenta las unidades compradas.
- Cuando el stock de un producto llega a 0, shop.js lo muestra como "Agotado" y bloquea el botón de añadir.
- products-data.json contiene el catálogo base usado para inicializar productos en MySQL.


ACTUALIZACIÓN VISUAL:
- Se restauró la cinta Pokémon original en menu.html, ofertas.html, formulario_pedido.html y pedidos.html.
- Se restauró el footer original del proyecto en esas mismas páginas.
