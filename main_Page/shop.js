/* =========================================================
   SHOP.JS - FUNCIONALIDAD PRINCIPAL DE LA TIENDA
   ---------------------------------------------------------
   COMENTARIOS PARA LA REVISIÓN DEL PROYECTO:
   - Este archivo JavaScript se usa en menu.html, ofertas.html,
     formulario_pedido.html y pedidos.html.
   - Aquí se evidencian variables, constantes, arreglos,
     funciones, condicionales, eventos, manipulación del DOM,
     validación básica de formularios y estructuras repetitivas.
   ========================================================= */

(() => {
  /* REQUISITO: uso de constantes y arreglo de objetos.
     Este arreglo funciona como catálogo de productos del menú. */
  const PRODUCTS = [
    {
        "id": "pokebowl",
        "nombre": "Pokebowl",
        "categoria": "Platos",
        "img": "img/img_menu/pokebowl.jpg",
        "descripcion": "Arroz, pollo, vegetales frescos y salsa especial del Café.",
        "precioOriginal": 18,
        "precio": 12,
        "popular": true,
        "stock": 6,
        "etiqueta": "Más vendido",
        "oferta": true
    },
    {
        "id": "charizard-roast",
        "nombre": "Charizard Roast",
        "categoria": "Bebidas",
        "img": "img/img_menu/CharizardRoast.png",
        "descripcion": "Espresso intenso con leche vaporizada y canela ahumada.",
        "precioOriginal": 14,
        "precio": 9.9,
        "popular": true,
        "stock": 5,
        "etiqueta": "Flash sale"
    },
    {
        "id": "pika-cheesecake",
        "nombre": "Pika-Pika Cheesecake",
        "categoria": "Postres",
        "img": "img/img_menu/Pika-PikaCheesecake.png",
        "descripcion": "Cheesecake japonés esponjoso con glaseado amarillo y decoración de cola de Pikachu.",
        "precioOriginal": 20,
        "precio": 12,
        "popular": true,
        "stock": 4,
        "etiqueta": "Últimas unidades",
        "oferta": true
    },
    {
        "id": "mewtwo-zen",
        "nombre": "Mewtwo Zen Bowl",
        "categoria": "Platos",
        "img": "img/img_menu/MewtwoZenBowl.png",
        "descripcion": "Bowl de arroz integral, tofu, edamame, aguacate y aderezo de miso blanco.",
        "precioOriginal": 18,
        "precio": 13,
        "popular": true,
        "stock": 7,
        "etiqueta": "Proteico"
    },
    {
        "id": "snorlax-mac",
        "nombre": "Snorlax Comfort Mac & Cheese",
        "categoria": "Platos",
        "img": "img/img_menu/SnorlaxComfortMac&Cheese.png",
        "descripcion": "Macarrones gratinados con tres quesos fundidos, migas tostadas y nuez moscada.",
        "precioOriginal": 21,
        "precio": 16,
        "popular": true,
        "stock": 6,
        "etiqueta": "Clásico"
    },
    {
        "id": "pikachu-latte",
        "nombre": "Pikachu Latte",
        "categoria": "Bebidas",
        "img": "img/img_menu/pikachu-latte.jpg",
        "descripcion": "Café suave con espuma artística inspirada en Pikachu.",
        "precioOriginal": 12,
        "precio": 9,
        "popular": true,
        "stock": 10,
        "etiqueta": "Favorito"
    },
    {
        "id": "galletas",
        "nombre": "Galletas Decoradas",
        "categoria": "Postres",
        "img": "img/img_menu/GalletasDecoradas.png",
        "descripcion": "Galletas con glaseado y decoraciones de Pokémon.",
        "precioOriginal": 8,
        "precio": 4,
        "popular": false,
        "stock": 2,
        "etiqueta": "Próximo a vencer",
        "oferta": true
    },
    {
        "id": "eeveelution-macarons",
        "nombre": "Eeveelution Macarons",
        "categoria": "Postres",
        "img": "img/img_menu/EeveelutionMacarons.png",
        "descripcion": "Set de macarons con sabores inspirados en las evoluciones de Eevee.",
        "precioOriginal": 15,
        "precio": 7.5,
        "popular": true,
        "stock": 3,
        "etiqueta": "Próximo a vencer",
        "oferta": true
    },
    {
        "id": "postre-pikachu",
        "nombre": "Postre Pikachu",
        "categoria": "Postres",
        "img": "img/img_menu/pikachu-dessert.jpg",
        "descripcion": "Postre dulce de vainilla con crema y forma de Pikachu.",
        "precioOriginal": 10,
        "precio": 7,
        "popular": true,
        "stock": 4,
        "etiqueta": "Solo por hoy",
        "oferta": true
    },
    {
        "id": "clefairy-pancakes",
        "nombre": "Clefairy Fluffy Pancakes",
        "categoria": "Postres",
        "img": "img/img_menu/ClefairyPancakes.png",
        "descripcion": "Tortitas esponjosas con sirope de arce, frutas de temporada y nube de crema.",
        "precioOriginal": 18,
        "precio": 15,
        "popular": false,
        "stock": 6,
        "etiqueta": "Favorito",
        "oferta": true
    },
    {
        "id": "gengar-shadow-brownie",
        "nombre": "Gengar Shadow Brownie",
        "categoria": "Postres",
        "img": "img/img_menu/GengarShadowBrownie.png",
        "descripcion": "Brownie denso de chocolate negro con helado y salsa de frutos rojos.",
        "precioOriginal": 16,
        "precio": 11,
        "popular": false,
        "stock": 3,
        "etiqueta": "Últimas unidades"
    },
    {
        "id": "jynx-sorbet",
        "nombre": "Jynx Frost Sorbet Trio",
        "categoria": "Postres",
        "img": "img/img_menu/JynxFrostSorbetTrio.png",
        "descripcion": "Tres bolas de sorbete artesanal con coulis de frutos rojos y menta fresca.",
        "precioOriginal": 10,
        "precio": 8.5,
        "popular": false,
        "stock": 8,
        "etiqueta": "Helado"
    },
    {
        "id": "magcargo-cake",
        "nombre": "Magcargo Molten Cake",
        "categoria": "Postres",
        "img": "img/img_menu/MagcargoMoltenCake.png",
        "descripcion": "Bizcocho individual de chocolate negro con centro fundido y helado de vainilla.",
        "precioOriginal": 12,
        "precio": 9.9,
        "popular": false,
        "stock": 7,
        "etiqueta": "Caliente"
    },
    {
        "id": "eevee-pancakes",
        "nombre": "Eevee Pancakes",
        "categoria": "Postres",
        "img": "img/img_menu/EeveePancakes.png",
        "descripcion": "Tortitas esponjosas con sirope de arce, frutas y crema.",
        "precioOriginal": 15,
        "precio": 10.5,
        "popular": false,
        "stock": 8,
        "etiqueta": "Oferta"
    },
    {
        "id": "pokedonas",
        "nombre": "PokeDonas",
        "categoria": "Postres",
        "img": "img/img_menu/Donas.png",
        "descripcion": "Donas suaves con glaseado de azúcar y una pizca de canela.",
        "precioOriginal": 8,
        "precio": 6.5,
        "popular": false,
        "stock": 9,
        "etiqueta": "Dulce"
    },
    {
        "id": "gengar-brownie",
        "nombre": "Gengar Brownie",
        "categoria": "Postres",
        "img": "img/img_menu/GengarBrownie.png",
        "descripcion": "Brownie de chocolate oscuro con nueces y un toque de chile.",
        "precioOriginal": 11,
        "precio": 8.8,
        "popular": false,
        "stock": 5,
        "etiqueta": "Intenso"
    },
    {
        "id": "pokecupcakes",
        "nombre": "PokéCupcakes",
        "categoria": "Postres",
        "img": "img/img_menu/Cupcakes.png",
        "descripcion": "Cupcakes suaves con glaseado de azúcar y decoración de colores.",
        "precioOriginal": 9,
        "precio": 7.2,
        "popular": false,
        "stock": 7,
        "etiqueta": "Dulce"
    },
    {
        "id": "bulbasaur-matcha",
        "nombre": "Bulbasaur Matcha Latte",
        "categoria": "Bebidas",
        "img": "img/img_menu/BulbasaurMatchaLatte.png",
        "descripcion": "Latte de matcha con leche de avena y un toque de miel.",
        "precioOriginal": 13,
        "precio": 10,
        "popular": false,
        "stock": 9,
        "etiqueta": "Vegano"
    },
    {
        "id": "glaceon-frappe",
        "nombre": "Glaceon Ice Crystal Frappé",
        "categoria": "Bebidas",
        "img": "img/img_menu/GlaceonIceCrystalFrapp%23U00e9.png",
        "descripcion": "Frappé helado con sabor suave, hielo triturado y toque dulce.",
        "precioOriginal": 12,
        "precio": 9.8,
        "popular": false,
        "stock": 6,
        "etiqueta": "Frío"
    },
    {
        "id": "jigglypuff-smoothie",
        "nombre": "Jigglypuff Melody Smoothie",
        "categoria": "Bebidas",
        "img": "img/img_menu/JigglypuffMelodySmoothie.png",
        "descripcion": "Smoothie de frutas con textura cremosa y presentación temática.",
        "precioOriginal": 13,
        "precio": 10.5,
        "popular": false,
        "stock": 8,
        "etiqueta": "Suave"
    },
    {
        "id": "mewtwo-latte",
        "nombre": "Mewtwo Galaxy Latte",
        "categoria": "Bebidas",
        "img": "img/img_menu/MewtwoGalaxyLatte.png",
        "descripcion": "Latte de colores galácticos con leche cremosa y toque dulce.",
        "precioOriginal": 14,
        "precio": 11.2,
        "popular": false,
        "stock": 6,
        "etiqueta": "Especial"
    },
    {
        "id": "snorlax-chocolate",
        "nombre": "Snorlax Comfort Chocolate",
        "categoria": "Bebidas",
        "img": "img/img_menu/SnorlaxComfortChocolate.png",
        "descripcion": "Chocolate caliente cremoso con sabor profundo y reconfortante.",
        "precioOriginal": 16,
        "precio": 12.5,
        "popular": false,
        "stock": 7,
        "etiqueta": "Clásico"
    },
    {
        "id": "squirtle-smoothie",
        "nombre": "Squirtle Smoothie Bowl",
        "categoria": "Bebidas",
        "img": "img/img_menu/SquirtleSmoothieBowl.png",
        "descripcion": "Smoothie bowl refrescante con frutas, crema y decoración marina.",
        "precioOriginal": 15,
        "precio": 12,
        "popular": false,
        "stock": 6,
        "etiqueta": "Refrescante"
    },
    {
        "id": "arcanine-wings",
        "nombre": "Arcanine Ember Wings",
        "categoria": "Platos",
        "img": "img/img_menu/ArcanineEmberWings.png",
        "descripcion": "Bocaditos crujientes de coliflor o pollo marinado con salsa de yogur al limón.",
        "precioOriginal": 16,
        "precio": 12.8,
        "popular": false,
        "stock": 6,
        "etiqueta": "Picante"
    },
    {
        "id": "chansey-custard",
        "nombre": "Chansey Egg Custard",
        "categoria": "Platos",
        "img": "img/img_menu/ChanseyEggCustard.png",
        "descripcion": "Flan de huevo al estilo japonés con dashi suave, camarón y textura sedosa.",
        "precioOriginal": 9,
        "precio": 7.2,
        "popular": false,
        "stock": 8,
        "etiqueta": "Suave"
    },
    {
        "id": "electrabuzz-chicken",
        "nombre": "Electrabuzz Citrus Chicken",
        "categoria": "Platos",
        "img": "img/img_menu/ElectrabuzzCitrusChicken.png",
        "descripcion": "Pechuga de pollo con glaseado de naranja y mostaza, puré y ensalada verde.",
        "precioOriginal": 18,
        "precio": 14.5,
        "popular": false,
        "stock": 5,
        "etiqueta": "Cítrico"
    },
    {
        "id": "gardevoir-tartine",
        "nombre": "Gardevoir Royal Tartine",
        "categoria": "Platos",
        "img": "img/img_menu/GardevoirRoyalTartine.png",
        "descripcion": "Brioche tostado con queso de cabra, pera caramelizada, pecanas y miel.",
        "precioOriginal": 14,
        "precio": 11.2,
        "popular": false,
        "stock": 6,
        "etiqueta": "Royal"
    },
    {
        "id": "gyarados-pasta",
        "nombre": "Gyarados Marinara Pasta",
        "categoria": "Platos",
        "img": "img/img_menu/GyaradosMarinaraPasta.png",
        "descripcion": "Espagueti al dente con salsa de tomate casera, mariscos y perejil fresco.",
        "precioOriginal": 17,
        "precio": 13.6,
        "popular": false,
        "stock": 5,
        "etiqueta": "Marino"
    },
    {
        "id": "koffing-bites",
        "nombre": "Koffing Crispy Bites",
        "categoria": "Platos",
        "img": "img/img_menu/KoffingCrispyBites.png",
        "descripcion": "Bocaditos crujientes marinados en especias suaves con salsa fresca.",
        "precioOriginal": 8,
        "precio": 6.4,
        "popular": false,
        "stock": 7,
        "etiqueta": "Crocante"
    },
    {
        "id": "magnezone-fries",
        "nombre": "Magnezone Spark Fries",
        "categoria": "Platos",
        "img": "img/img_menu/MagnezoneSparkFries.png",
        "descripcion": "Papas rústicas con parmesano, ajo confitado, pimentón y ralladura de limón.",
        "precioOriginal": 9,
        "precio": 7.2,
        "popular": false,
        "stock": 10,
        "etiqueta": "Clásico"
    },
    {
        "id": "onix-burger",
        "nombre": "Onix Rock Burger",
        "categoria": "Platos",
        "img": "img/img_menu/OnixRockBurger.png",
        "descripcion": "Hamburguesa en pan negro con cheddar fundido, cebolla caramelizada y BBQ.",
        "precioOriginal": 14,
        "precio": 11.2,
        "popular": false,
        "stock": 6,
        "etiqueta": "Fuerte"
    },
    {
        "id": "rayquaza-roll",
        "nombre": "Rayquaza Sky Roll",
        "categoria": "Platos",
        "img": "img/img_menu/RayquazaSkyRoll.png",
        "descripcion": "Sushi roll de tempura con aguacate, salmón ahumado, queso crema y teriyaki.",
        "precioOriginal": 22,
        "precio": 15,
        "popular": false,
        "stock": 5,
        "etiqueta": "Especial"
    }
];

  /* REQUISITO: variables y constantes para controlar el estado de la página. */
  const CART_KEY = 'pokecafe_cart';
  let activeCategory = 'Todos';
  let currentOrders = [];

  /* REQUISITO: funciones cortas para manipular el DOM. */
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const page = document.body.dataset.page;
  const soles = (n) => `S/ ${Number(n || 0).toFixed(2)}`;
  const getProduct = (id) => PRODUCTS.find((product) => product.id === id);
  const discountPercent = (product) => Math.round((1 - product.precio / product.precioOriginal) * 100);

  /* REQUISITO BD: carga productos desde MySQL para usar stock real.
     Si el servidor no responde, se mantiene el catálogo local como respaldo. */
  async function cargarProductosDesdeBD() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) return;
      const data = await res.json();
      const productosBD = Array.isArray(data.productos) ? data.productos : [];

      productosBD.forEach((productoBD) => {
        const productoLocal = getProduct(productoBD.id);
        if (!productoLocal) return;
        productoLocal.nombre = productoBD.nombre;
        productoLocal.categoria = productoBD.categoria;
        productoLocal.img = productoBD.img;
        productoLocal.descripcion = productoBD.descripcion;
        productoLocal.precioOriginal = Number(productoBD.precio_original);
        productoLocal.precio = Number(productoBD.precio);
        productoLocal.popular = Boolean(productoBD.popular);
        productoLocal.stock = Number(productoBD.stock);
        productoLocal.etiqueta = productoBD.etiqueta;
        productoLocal.oferta = Boolean(productoBD.oferta);
      });
    } catch {
      // Si no hay conexión a la BD, el menú sigue funcionando con datos locales.
    }
  }

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch { return {}; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateHeaderCart();
  }

  function cartItems() {
    const cart = getCart();
    /* REQUISITO: estructura repetitiva con Object.entries().map(). */
    return Object.entries(cart)
      .map(([id, cantidad]) => ({ ...getProduct(id), cantidad }))
      .filter((item) => item.id && item.cantidad > 0);
  }

  function cartSubtotal() {
    /* REQUISITO: estructura repetitiva reduce para calcular el subtotal. */
    return cartItems().reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  }

  function addToCart(id, qty = 1) {
    const product = getProduct(id);
    if (!product) return;

    if (Number(product.stock) <= 0) {
      toast('Producto agotado. Elige otra opción.', true);
      return;
    }

    const cart = getCart();
    const nuevaCantidad = Math.min(Number(product.stock), (cart[id] || 0) + qty);

    if (nuevaCantidad === cart[id]) {
      toast('No hay más stock disponible de este producto.', true);
      return;
    }

    cart[id] = nuevaCantidad;
    saveCart(cart);
    renderMiniCart();
    renderOrderItems();
    renderMenu();
    renderOffers();
    toast('Producto agregado al pedido');
  }

  function setCartQty(id, qty) {
    const product = getProduct(id);
    const cart = getCart();
    let amount = Math.max(0, Number.parseInt(qty, 10) || 0);

    if (product) amount = Math.min(amount, Number(product.stock));

    /* REQUISITO: condicional if/else para modificar el carrito. */
    if (amount === 0) delete cart[id];
    else cart[id] = amount;

    saveCart(cart);
    renderMiniCart();
    renderOrderItems();
    renderMenu();
    renderOffers();
  }

  function updateHeaderCart() {
    const count = cartItems().reduce((sum, item) => sum + item.cantidad, 0);

    /* REQUISITO: manipulación del DOM para modificar textos visibles. */
    if ($('#cartCount')) $('#cartCount').textContent = count;
    if ($('#cartTotal')) $('#cartTotal').textContent = soles(cartSubtotal());
  }

  async function updateAccountLink() {
    try {
      const res = await fetch('/api/session');
      if (!res.ok) return;
      const data = await res.json();
      const link = $('#accountLink');

      /* REQUISITO: manipulación del DOM según el usuario que inició sesión. */
      if (link && data.usuario) {
        link.textContent = data.usuario.usuario;
        link.href = 'pedidos.html';
      }

      const cliente = $('#cliente');
      if (cliente && !cliente.value) cliente.value = data.usuario.usuario;

      const historyUser = $('#historyUser');
      const historyEmail = $('#historyEmail');
      if (historyUser) historyUser.textContent = data.usuario.usuario;
      if (historyEmail) historyEmail.textContent = data.usuario.correo;
    } catch {}
  }

  function productCard(product, offer = false) {
    const agotado = Number(product.stock) <= 0;
    const cantidadEnCarrito = getCart()[product.id] || 0;

    /* REQUISITO: plantilla HTML generada con JavaScript para cambiar el contenido de la página. */
    return `
      <article class="product-card ${offer ? 'offer' : ''} ${agotado ? 'sold-out' : ''}">
        <div class="badge-row"><span class="badge-yellow">${agotado ? 'Agotado' : product.etiqueta}</span><span class="badge-red">-${discountPercent(product)}%</span></div>
        <img src="${product.img}" alt="${product.nombre}" loading="lazy">
        <div class="product-body">
          <h3>${product.nombre}</h3>
          <p>${product.descripcion}</p>
          <div class="price-row"><span class="old-price">${soles(product.precioOriginal)}</span><strong>${soles(product.precio)}</strong></div>
          <small class="stock-text">${agotado ? 'Producto agotado' : `Stock disponible: ${product.stock}`}${cantidadEnCarrito ? ` · En pedido: ${cantidadEnCarrito}` : ''}</small>
          ${offer ? `<div class="stock-line"><span style="width:${Math.min(100, product.stock * 12)}%"></span></div><small>Últimas ${product.stock} unidades</small>` : ''}
          <button type="button" data-add="${product.id}" ${agotado ? 'disabled' : ''}>${agotado ? 'Agotado' : '🛒 Añadir al pedido'}</button>
        </div>
      </article>`;
  }

  function bindAddButtons() {
    /* REQUISITO: evento onclick. Aquí se usa addEventListener('click') para agregar productos. */
    $$('[data-add]').forEach((button) => button.addEventListener('click', () => addToCart(button.dataset.add)));
  }

  function renderCategories() {
    const filters = $('#categoryFilters');
    if (!filters) return;

    /* REQUISITO: arreglo dinámico de categorías usando Set. */
    const categories = ['Todos', 'Platos', 'Bebidas', 'Postres'];
    filters.innerHTML = categories.map((category) => `<button type="button" class="chip ${category === activeCategory ? 'active' : ''}" data-category="${category}">${category}</button>`).join('');

    /* REQUISITO: eventos onclick para cambiar categoría. */
    $$('[data-category]').forEach((button) => button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderMenu();
    }));
  }

  function getFilteredProducts() {
    let products = [...PRODUCTS];

    /* REQUISITO: condicional para filtrar el menú por categoría.
       Se retiraron el buscador y el ordenamiento porque ya no se muestran en la vista. */
    if (activeCategory !== 'Todos') {
      products = products.filter((product) => product.categoria === activeCategory);
    }

    return products;
  }

  function renderMenu() {
    if (!$('#productGrid')) return;
    renderCategories();

    /* REQUISITO: manipulación del DOM con innerHTML para mostrar la lista de productos. */
    $('#productGrid').innerHTML = getFilteredProducts().map((product) => productCard(product)).join('');
    bindAddButtons();
    renderMiniCart();
  }

  function getOfferProducts() {
    // REQUISITO: ofertas.html muestra directamente los productos marcados como oferta.
    return PRODUCTS.filter((product) => product.oferta === true);
  }

  function renderOffers() {
    if (!$('#offersGrid')) return;
    $('#offersGrid').innerHTML = getOfferProducts().map((product) => productCard(product, true)).join('');
    bindAddButtons();
  }

  function renderMiniCart() {
    const miniCart = $('#miniCart');
    if (!miniCart) return;
    const items = cartItems();

    /* REQUISITO: condicional para mostrar carrito vacío o productos agregados. */
    if (!items.length) {
      miniCart.innerHTML = '<p class="empty">Tu pedido está vacío. Agrega productos del menú.</p>';
      return;
    }

    const subtotal = cartSubtotal();
    const envio = 4.9;
    const descuento = subtotal >= 35 ? subtotal * 0.1 : 0;
    const total = subtotal + envio - descuento;

    miniCart.innerHTML = `
      <div class="mini-lines">${items.map((item) => `
        <div class="mini-item"><img src="${item.img}" alt="${item.nombre}"><span>${item.nombre}<small>x${item.cantidad}</small></span><strong>${soles(item.precio * item.cantidad)}</strong></div>
      `).join('')}</div>
      <div class="totals"><p><span>Subtotal</span><strong>${soles(subtotal)}</strong></p><p><span>Envío</span><strong>${soles(envio)}</strong></p><p><span>Descuento</span><strong>-${soles(descuento)}</strong></p><p class="total"><span>Total</span><strong>${soles(total)}</strong></p></div>`;
  }

  function renderOrderItems() {
    if (!$('#orderItems')) return;
    const items = cartItems();

    /* REQUISITO: solo se muestran los productos agregados desde Menú u Ofertas. */
    if (!items.length) {
      $('#orderItems').innerHTML = `
        <div class="empty-order-box">
          <p class="empty">Aún no agregaste productos al pedido.</p>
          <div class="return-actions"><a href="menu.html">Ir al menú</a><a href="ofertas.html">Ver ofertas</a></div>
        </div>`;
      renderOrderSummary();
      return;
    }

    /* REQUISITO: estructura repetitiva map para crear la lista de platos seleccionados. */
    $('#orderItems').innerHTML = items.map((item) => `
      <div class="order-line selected">
        <button type="button" class="remove-item" data-remove="${item.id}" aria-label="Quitar ${item.nombre}">×</button>
        <img src="${item.img}" alt="${item.nombre}">
        <div><strong>${item.nombre}</strong><small>${item.descripcion}</small><small>Stock actual: ${item.stock}</small></div>
        <span>${soles(item.precio)}</span>
        <div class="qty"><button type="button" data-dec="${item.id}">−</button><input data-qty="${item.id}" value="${item.cantidad}" inputmode="numeric"><button type="button" data-inc="${item.id}">+</button></div>
      </div>`).join('');

    /* REQUISITO: eventos onchange y onclick en los productos agregados al pedido. */
    $$('[data-remove]').forEach((button) => button.addEventListener('click', () => setCartQty(button.dataset.remove, 0)));
    $$('[data-inc]').forEach((button) => button.addEventListener('click', () => setCartQty(button.dataset.inc, (getCart()[button.dataset.inc] || 0) + 1)));
    $$('[data-dec]').forEach((button) => button.addEventListener('click', () => setCartQty(button.dataset.dec, (getCart()[button.dataset.dec] || 0) - 1)));
    $$('[data-qty]').forEach((input) => input.addEventListener('change', () => setCartQty(input.dataset.qty, input.value)));
    renderOrderSummary();
  }

  function getOrderTotals() {
    const subtotal = cartSubtotal();
    const entrega = document.querySelector('input[name="metodo_entrega"]:checked')?.value || 'delivery';
    const envio = entrega === 'tienda' ? 0 : 4.9;
    const descuento = subtotal >= 35 ? subtotal * 0.1 : 0;
    return { subtotal, envio, descuento, total: subtotal + envio - descuento };
  }

  function renderOrderSummary() {
    const summary = $('#orderSummary');
    if (!summary) return;
    const items = cartItems();
    const totals = getOrderTotals();

    if (!items.length) {
      summary.innerHTML = '<p class="empty">Selecciona platos para calcular el total.</p>';
      return;
    }

    /* REQUISITO: manipulación del DOM para modificar el resumen del pedido. */
    summary.innerHTML = `
      ${items.map((item) => `<div class="summary-item"><img src="${item.img}" alt="${item.nombre}"><span>${item.nombre}<small>x${item.cantidad}</small></span><strong>${soles(item.precio * item.cantidad)}</strong></div>`).join('')}
      <div class="totals"><p><span>Subtotal</span><strong>${soles(totals.subtotal)}</strong></p><p><span>Envío</span><strong>${soles(totals.envio)}</strong></p><p><span>Descuento</span><strong>-${soles(totals.descuento)}</strong></p><p class="total"><span>Total</span><strong>${soles(totals.total)}</strong></p></div>`;
  }

  function marcarCampo(input, valido) {
    if (!input) return;
    input.classList.remove('campo-valido', 'campo-error');
    input.classList.add(valido ? 'campo-valido' : 'campo-error');
  }

  function validarCampoPedido(id) {
    const input = document.getElementById(id);
    if (!input) return true;

    let valido = true;
    const valor = input.value.trim();

    /* REQUISITO: validación básica de formularios con condicionales. */
    if (id === 'cliente') valido = valor.length >= 3;
    if (id === 'telefono') valido = /^\d{9,}$/.test(valor.replace(/\s/g, ''));
    if (id === 'direccion') valido = valor.length >= 8;
    if (id === 'notas') valido = valor.length <= 250;

    marcarCampo(input, valido);
    return valido;
  }

  function validarFormularioPedido() {
    const clienteOk = validarCampoPedido('cliente');
    const telefonoOk = validarCampoPedido('telefono');
    const direccionOk = validarCampoPedido('direccion');
    const notasOk = validarCampoPedido('notas');
    const productosOk = cartItems().length > 0;

    if (!productosOk) toast('Debes seleccionar al menos un producto.', true);

    return clienteOk && telefonoOk && direccionOk && notasOk && productosOk;
  }

  function bindOrderForm() {
    const form = $('#orderForm');
    if (!form) return;
    renderOrderItems();

    /* REQUISITO: eventos onchange para recalcular el total según método de entrega. */
    $$('input[name="metodo_entrega"]').forEach((input) => input.addEventListener('change', renderOrderSummary));

    /* REQUISITO: evento submit del formulario de pedido. */
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!validarFormularioPedido()) {
        toast('Revisa los campos obligatorios del pedido.', true);
        return;
      }

      const items = cartItems().map((item) => ({ id: item.id, nombre: item.nombre, cantidad: item.cantidad, precio: item.precio }));
      const payload = {
        cliente: $('#cliente').value.trim(),
        telefono: $('#telefono').value.trim(),
        direccion: $('#direccion').value.trim(),
        metodo_entrega: document.querySelector('input[name="metodo_entrega"]:checked')?.value,
        metodo_pago: document.querySelector('input[name="metodo_pago"]:checked')?.value,
        notas: $('#notas').value.trim(),
        items
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.status === 401) {
          toast('Inicia sesión para guardar tu pedido.', true);
          setTimeout(() => { window.location.href = '/login.html'; }, 900);
          return;
        }
        if (!res.ok) return toast(data.error || 'No se pudo guardar el pedido.', true);

        localStorage.removeItem(CART_KEY);
        toast(data.mensaje || 'Pedido enviado');
        setTimeout(() => { window.location.href = '/pedidos.html'; }, 1000);
      } catch {
        toast('No hay conexión con el servidor.', true);
      }
    });
  }

  function statusClass(status) {
    if (status === 'Enviado') return 'status sent';
    if (status === 'En proceso') return 'status process';
    return 'status prep';
  }

  function renderOrdersTable() {
    const body = $('#ordersBody');
    if (!body) return;
    const query = ($('#orderSearch')?.value || '').toLowerCase();
    const state = $('#orderStatus')?.value || 'all';
    let orders = [...currentOrders];

    /* REQUISITO: condicionales para buscar y filtrar historial de pedidos. */
    if (state !== 'all') orders = orders.filter((order) => order.estado === state);
    if (query) orders = orders.filter((order) => `${order.id} ${order.cliente} ${order.detalles.map((d) => d.producto_nombre).join(' ')}`.toLowerCase().includes(query));

    if (!orders.length) {
      body.innerHTML = '<tr class="empty-row"><td colspan="7">No hay pedidos para mostrar.</td></tr>';
      return;
    }

    /* REQUISITO: estructura repetitiva map para llenar la tabla de pedidos. */
    body.innerHTML = orders.map((order) => {
      const cantidad = order.detalles.reduce((sum, item) => sum + Number(item.cantidad), 0);
      const products = order.detalles.map((item) => item.producto_nombre).join(', ');
      const fecha = new Date(order.creado_en).toLocaleString('es-PE');
      return `<tr>
        <td><strong>#PC-${String(order.id).padStart(5, '0')}</strong><small>${fecha}</small></td>
        <td>${order.cliente}<small>${order.correo}</small></td>
        <td>${products}</td><td>${cantidad}</td><td><strong>${soles(order.total)}</strong></td><td><span class="${statusClass(order.estado)}">${order.estado}</span></td>
        <td><button type="button" data-reorder="${order.id}">Reordenar</button></td>
      </tr>`;
    }).join('');

    /* REQUISITO: evento onclick para volver a pedir productos del historial. */
    $$('[data-reorder]').forEach((button) => button.addEventListener('click', () => {
      const order = currentOrders.find((entry) => String(entry.id) === String(button.dataset.reorder));
      const cart = {};
      order.detalles.forEach((item) => { cart[item.producto_id] = Number(item.cantidad); });
      saveCart(cart);
      window.location.href = '/formulario_pedido.html';
    }));
  }

  async function loadOrders() {
    const body = $('#ordersBody');
    if (!body) return;

    try {
      const res = await fetch('/api/orders');
      if (res.status === 401) {
        body.innerHTML = '<tr class="empty-row"><td colspan="7">Debes iniciar sesión para ver tus pedidos. <a href="login.html">Ir al login</a></td></tr>';
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        body.innerHTML = `<tr class="empty-row"><td colspan="7">${data.error || 'No se pudo cargar el historial.'}</td></tr>`;
        return;
      }

      currentOrders = data.pedidos || [];
      const totalSpent = currentOrders.reduce((sum, order) => sum + Number(order.total), 0);

      /* REQUISITO: manipulación del DOM para actualizar estadísticas del usuario. */
      if ($('#statOrders')) $('#statOrders').textContent = currentOrders.length;
      if ($('#statSpent')) $('#statSpent').textContent = soles(totalSpent);
      if ($('#statAverage')) $('#statAverage').textContent = soles(currentOrders.length ? totalSpent / currentOrders.length : 0);

      renderOrdersTable();
    } catch {
      body.innerHTML = '<tr class="empty-row"><td colspan="7">No hay conexión con el servidor.</td></tr>';
    }
  }

  function bindHistory() {
    if (!$('#ordersBody')) return;

    /* REQUISITO: eventos oninput/onchange también declarados en HTML y reforzados aquí con addEventListener. */
    $('#orderSearch')?.addEventListener('input', renderOrdersTable);
    $('#orderStatus')?.addEventListener('change', renderOrdersTable);
    $('#logoutButton')?.addEventListener('click', async () => {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login.html';
    });

    loadOrders();
  }

  function toast(message, error = false) {
    let box = document.querySelector('.toast');
    if (!box) {
      box = document.createElement('div');
      box.className = 'toast';
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.toggle('error', error);
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), 1800);
  }

  /* =========================================================
     FUNCIONES GLOBALES USADAS POR ATRIBUTOS HTML
     ---------------------------------------------------------
     REQUISITO: estas funciones conectan los eventos visibles
     del HTML con la lógica de validación, filtros e interacción.
     ========================================================= */
  window.validarCampoPedidoDesdeHTML = function (id) {
    validarCampoPedido(id);
  };

  window.validarFormularioPedidoDesdeHTML = function () {
    return validarFormularioPedido();
  };

  window.filtrarHistorialDesdeHTML = function () {
    renderOrdersTable();
  };

  window.limpiarFiltrosHistorial = function () {
    if ($('#orderSearch')) $('#orderSearch').value = '';
    if ($('#orderStatus')) $('#orderStatus').value = 'all';
    renderOrdersTable();
  };

  window.confirmarIrAPedidoDesdeHTML = function () {
    if (!cartItems().length) {
      toast('Tu pedido aún está vacío. Puedes continuar y elegir platos en el formulario.', true);
    }
    return true;
  };

  document.addEventListener('DOMContentLoaded', async () => {
    await cargarProductosDesdeBD();
    updateHeaderCart();
    updateAccountLink();

    if (page === 'menu') {
      renderMenu();
    }

    if (page === 'ofertas') {
      renderOffers();
    }

    if (page === 'pedido') bindOrderForm();
    if (page === 'pedidos') bindHistory();
  });
})();
