/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ====== DATOS DE PRODUCTOS ======
const products = [
    // PLAYERAS PREMIUM HOMBRE
    {
        id: 1,
        name: "Playera Premium Azul Claro",
        category: ["playeras_hombre"],
        subtitle: "Tipo de talla: Grande",
        price: 150,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera_azul-claro.png",
        featured: true,
        badge: "new"
    },
    {
        id: 2,
        name: "Playera Premium Rojizo",
        category: ["playeras_hombre"],
        subtitle: "Tipo de talla: Mediana",
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera_Rojo.png",
        featured: true,
        badge: "new"
    },
    {
        id: 3,
        name: "Playera Premium Rosa",
        category: ["playeras_hombre"],
        subtitle: "Tipo de talla: Chica",
        price: 150,
        rating: 4.7,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera_Rojizo.png",
        featured: true,
        badge: "new"
    },
    {
        id: 4,
        name: "Playera Premium Blanco",
        category: ["playeras_hombre"],
        subtitle: "Tipo de talla: Grande",
        price: 150,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera_blanco.png",
        featured: true,
        badge: "new"
    },
    {
        id: 5,
        name: "Playera Premium Negra",
        category: ["playeras_hombre"],
        subtitle: "Tipo de talla: Mediana",
        price: 150,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera-Premium-Negra_1_-removebg-preview.png",
        featured: true,
        badge: "new"
    },
    
    // PLAYERAS SIN MANGAS HOMBRE
    {
        id: 9,
        name: "Playera Sin Mangas Gris",
        category: ["playeras_sin_mangas_hombre"],
        subtitle: "Tipo de talla: Multitalla",
        price: 70,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Hombre/Playera sin mangas/Playera_sin_mangas.png",
        featured: true,
        badge: "new"
    },
    // CALCETINES (AMBOS)
    {
        id: 8,
        name: "Calcetines Premium Pack Completo",
        category: ["calcetines"],
        price: 45,
        rating: 4.9,
        image: "Imagenes de ropa/Calcetines deportivo/Calcetines deportivo_Rosa_azul_dama.png",
        featured: false,
        badge: "new"
    },
    // BLUSAS MUJER
    {
        id: 10,
        name: "Blusa Premium Roja",
        category: ["blusas_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 60,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Mujer/Blusa/Blusa-rojo.png",
        featured: true,
        badge: "new"
    },
    {
        id: 12,
        name: "Blusa Premium Rosa",
        category: ["blusas_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 60,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Blusa/Blusa-rosa.png",
        featured: true,
        badge: "new"
    },
    {
        id: 11,
        name: "Short Deportivo Azul Claro",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_azul_claro_frente_1_-removebg-preview.png",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_azul_claro_frente_1_-removebg-preview.png",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_azul_claro_trasero_1_-removebg-preview.png"
        ],
        featured: true,
        badge: "new"
    },
    {
        id: 13,
        name: "Short Deportivo Azul Fuerte",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_azul_fuerte-frente_1_-removebg-preview.png",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_azul_fuerte-frente_1_-removebg-preview.png",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_azul_fuerte-trasero_1_-removebg-preview.png"
        ],
        featured: true,
        badge: "new"
    },
    {
        id: 14,
        name: "Short Deportivo Beige",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.7,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_beigch-frente_1_-removebg-preview.png",
        featured: true,
        badge: "new"
    },
    {
        id: 15,
        name: "Short Deportivo Negro",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_negro_-frente_1_-removebg-preview.png",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_negro_-frente_1_-removebg-preview.png",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_negro-trasero_1_-removebg-preview.png"
        ],
        featured: true,
        badge: "new"
    },
    {
        id: 16,
        name: "Short Deportivo Rosa Fuerte",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_rosa-fuerte_frente_1_-removebg-preview.png",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_rosa-fuerte_frente_1_-removebg-preview.png",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_rosa-fuerte_trasero_1_-removebg-preview.png"
        ],
        featured: true,
        badge: "new"
    },
    {
        id: 18,
        name: "Short Deportivo Rosa Claro",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_rosa-claro_deportiva-frente_1_-removebg-preview.png",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_rosa-claro_deportiva-frente_1_-removebg-preview.png",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_rosa-claro_deportiva-trasero_1_-removebg-preview.png"
        ],
        featured: true,
        badge: "new"
    },
    {
        id: 17,
        name: "Short Deportivo Rojo",
        category: ["short_deportivo_mujer"],
        subtitle: "Tipo de talla: Multitalla",
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_rojo_frente__3__1_-removebg-preview.png",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_rojo_frente__3__1_-removebg-preview.png",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_rojo_trasero__2__1_-removebg-preview.png"
        ],
        featured: true,
        badge: "new"
    }
];

// ====== REFERENCIAS A ELEMENTOS DEL DOM ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const searchSuggestions = document.getElementById("searchSuggestions");
const sortSelect = document.getElementById("sortSelect");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const favoritesBtn = document.getElementById("favoritesBtn");
const favoritesCount = document.getElementById("favoritesCount");
const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const profileMenuWrap = document.getElementById("profileMenuWrap");
const profileMenuTitle = document.getElementById("profileMenuTitle");
const profileLoginLink = document.getElementById("profileLoginLink");
const profileRegisterLink = document.getElementById("profileRegisterLink");
const profileViewLink = document.getElementById("profileViewLink");
const profileEditBtn = document.getElementById("profileEditBtn");
const profileDeleteBtn = document.getElementById("profileDeleteBtn");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");
const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const favoritesModal = document.getElementById("favoritesModal");
const closeFavoritesBtn = document.getElementById("closeFavoritesBtn");
const favoritesItemsContainer = document.getElementById("favoritesItems");
const buyModal = document.getElementById("buyModal");
const buyCloseBtn = document.getElementById("buyCloseBtn");
const buyCancelBtn = document.getElementById("buyCancelBtn");
const buyConfirmBtn = document.getElementById("buyConfirmBtn");
const buyQtyMinus = document.getElementById("buyQtyMinus");
const buyQtyPlus = document.getElementById("buyQtyPlus");
const buyQtyValue = document.getElementById("buyQtyValue");
const buyTotal = document.getElementById("buyTotal");
const buyProductName = document.getElementById("buyProductName");
const buyProductImage = document.getElementById("buyProductImage");
const buyProductStock = document.getElementById("buyProductStock");
const buyProductPrice = document.getElementById("buyProductPrice");
const productDetailModal = document.getElementById("productDetailModal");
const detailCloseBtn = document.getElementById("detailCloseBtn");
const detailProductName = document.getElementById("detailProductName");
const detailMainImage = document.getElementById("detailMainImage");
const detailThumbs = document.getElementById("detailThumbs");
const detailPrice = document.getElementById("detailPrice");
const detailStock = document.getElementById("detailStock");
const detailSizeText = document.getElementById("detailSizeText");
const detailFavoriteBtn = document.getElementById("detailFavoriteBtn");
const detailAddCartBtn = document.getElementById("detailAddCartBtn");
const detailBuyBtn = document.getElementById("detailBuyBtn");
const newsletterBtn = document.getElementById("newsletterBtn");
const newsletterEmail = document.getElementById("newsletterEmail");

// Hero Slider
const heroSlides = document.querySelectorAll(".hero-slide");
const heroPrev = document.querySelector(".hero-prev");
const heroNext = document.querySelector(".hero-next");
const heroDots = document.querySelectorAll(".dot");
const heroCtas = document.querySelectorAll(".hero-cta");
const heroImages = document.querySelectorAll(".hero-image img");
const heroFallbackImage = "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playeras_de_colores.png";

// Navigation
const navLinks = document.querySelectorAll(".nav-link");
const dropdownLinks = document.querySelectorAll(".dropdown-link");

// ====== NAVEGACIÓN PRINCIPAL ======
// ES: Maneja clicks en nav-links principales (Hombre/Mujer) para hacer scroll
//     suave a sus secciones correspondientes en la página.
// EN: Handles clicks on main nav-links (Men/Women) to smoothly scroll
//     to their corresponding sections on the page.
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const category = link.dataset.category;
        
        if (category === "hombre") {
            e.preventDefault();
            const seccion = document.getElementById("seccion-hombre");
            if (seccion) {
                seccion.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else if (category === "mujer") {
            e.preventDefault();
            const seccion = document.getElementById("seccion-mujer");
            if (seccion) {
                seccion.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
});

// ====== ESTADO ======
// ES: Incremento fijo de precio sobre el precio base de cada producto.
// EN: Fixed price increment added on top of each product's base price.
const PRICE_INCREMENT = 8;

// ES: Aplica el ajuste de precio al precio base del producto.
// EN: Applies the price adjustment to a product's base price.
function applyPriceAdjustment(basePrice) {
    const numericPrice = Number(basePrice);
    if (!Number.isFinite(numericPrice)) return PRICE_INCREMENT;
    return numericPrice + PRICE_INCREMENT;
}

// ES: Variables globales de estado de la aplicación.
// EN: Global application state variables.
let currentCategory = "all";
let filteredProducts = [...products];
let cart = JSON.parse(localStorage.getItem("smucky_cart") || "[]");
let favorites = JSON.parse(localStorage.getItem("smucky_favorites") || "[]");
let currentSlide = 0;
let buySelection = { product: null, qty: 1 };
let detailSelection = { product: null, images: [], activeIndex: 0 };

// ====== SISTEMA DE NOTIFICACIONES TOAST ======
// ES: Muestra una notificación flotante animada en la esquina inferior derecha.
//     tipo: "success" (verde), "error" (rojo), "info" (naranja), "fav" (rosa).
//     duracion: tiempo en milisegundos antes de desaparecer (por defecto 3500).
// EN: Shows an animated floating notification in the bottom-right corner.
//     type: "success" (green), "error" (red), "info" (orange), "fav" (pink).
//     duration: milliseconds before auto-dismiss (default 3500).
function showToast({ titulo, mensaje, tipo = "success", duracion = 3500 }) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    // Mapa de iconos según el tipo de toast
    // Icon map based on toast type
    const iconos = {
        success: "✅",
        error:   "❌",
        info:    "♡", // Corazón vacío para quitar de favoritos
        fav:     "❤️"  // Corazón lleno para agregar a favoritos
    };

    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.style.setProperty("--toast-duration", `${duracion}ms`);
    toast.setAttribute("role", "status");

    toast.innerHTML = `
        <span class="toast-icon">${iconos[tipo] || "🔔"}</span>
        <div class="toast-body">
            ${titulo ? `<span class="toast-title">${titulo}</span>` : ""}
            <span class="toast-msg">${mensaje}</span>
        </div>
        <button class="toast-close" aria-label="Cerrar notificación">&times;</button>
    `;

    // ES: Cierra el toast con animación al hacer clic en la X.
    // EN: Closes the toast with animation on X click.
    const cerrar = () => {
        toast.classList.add("toast-out");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    };

    toast.querySelector(".toast-close").addEventListener("click", cerrar);

    // ES: Auto-cierra después del tiempo indicado.
    // EN: Auto-closes after the given duration.
    const timer = setTimeout(cerrar, duracion);

    // ES: Cancela el auto-cierre si el usuario pasa el cursor sobre el toast.
    // EN: Cancels auto-close if the user hovers over the toast.
    toast.addEventListener("mouseenter", () => clearTimeout(timer));
    toast.addEventListener("mouseleave", () => setTimeout(cerrar, 1200));

    container.appendChild(toast);
}

// ES: Inicializa cada producto con su precio base y aplica el ajuste.
//     Si no tiene stock, asigna un valor por defecto de 12 unidades.
// EN: Initializes each product with its base price and applies adjustment.
//     If it has no stock, assigns a default value of 12 units.
products.forEach((product) => {
    product.basePrice = Number(product.price) || 0;
    product.price = applyPriceAdjustment(product.basePrice);

    if (typeof product.stock !== "number") {
        product.stock = 12;
    }
});

// ES: Sincroniza los precios de los artículos en el carrito con los 
//     precios actuales del catálogo. Si hay cambios, los persiste en localStorage.
// EN: Synchronizes the prices of items in the cart with the current 
//     catalog prices. If there are changes, persists them in localStorage.
function syncCartPricesWithCatalog() {
    if (!Array.isArray(cart) || cart.length === 0) return;

    let hasChanges = false;
    cart.forEach((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return;

        if (item.price !== product.price) {
            item.price = product.price;
            hasChanges = true;
        }

        if (item.name !== product.name) {
            item.name = product.name;
            hasChanges = true;
        }

        const productImage = getPrimaryImage(product);
        if (item.image !== productImage) {
            item.image = productImage;
            hasChanges = true;
        }

        if (item.stock !== product.stock) {
            item.stock = product.stock;
            hasChanges = true;
        }

        if (item.firestoreId !== product.firestoreId) {
            item.firestoreId = product.firestoreId;
            hasChanges = true;
        }

        if (JSON.stringify(item.gallery || []) !== JSON.stringify(product.gallery || [])) {
            item.gallery = Array.isArray(product.gallery) ? [...product.gallery] : [];
            hasChanges = true;
        }
    });

    if (hasChanges) {
        saveCart();
    }
}

syncCartPricesWithCatalog();

const PRODUCT_SECTION_IDS = [
    "playeras-hombre",
    "playeras-sin-mangas-hombre",
    "blusas-mujer",
    "short-deportivo-mujer",
    "calcetines-mujer"
];

// ES: Renderiza todos los productos en sus respectivas secciones de la tienda.
// EN: Renders all products in their respective store sections.
function renderAllProductSections() {
    PRODUCT_SECTION_IDS.forEach((sectionId) => renderProducts(sectionId));
}

// ES: Actualiza las vistas de la tienda, el modal de favoritos abierto y el
//     modal de compra activo cuando los datos del producto cambian.
// EN: Updates the store views, the open favorites modal, and the active
//     purchase modal when product data changes.
function renderStoreViews() {
    renderAllProductSections();

    if (favoritesModal && favoritesModal.style.display === "flex") {
        renderFavoritesUI();
    }

    if (buySelection.product) {
        const refreshedProduct = products.find((item) => item.id === buySelection.product.id);
        if (refreshedProduct) {
            buySelection.product = refreshedProduct;
            renderBuyModal();
        }
    }

    if (detailSelection.product && productDetailModal && productDetailModal.style.display === "flex") {
        const refreshedProduct = products.find((item) => item.id === detailSelection.product.id);
        if (refreshedProduct) {
            detailSelection.product = refreshedProduct;
            detailSelection.images = getProductGalleryImages(refreshedProduct);
            detailSelection.activeIndex = Math.min(detailSelection.activeIndex, detailSelection.images.length - 1);
            renderProductDetailModal();
        }
    }
}

// ES: Sincroniza los productos con Firestore: actualiza nombre, precio, stock
//     e imagen de cada producto local con los datos de la nube.
// EN: Syncs products with Firestore: updates each local product's name, price,
//     stock, and image with data from the cloud.
async function syncProductsFromFirestore() {
    if (typeof window.cargarProductosDesdeFirestore !== "function") {
        return;
    }

    try {
        const firestoreProducts = await window.cargarProductosDesdeFirestore();
        const productsById = new Map(products.map((product) => [String(product.id), product]));
        const productsByName = new Map(products.map((product) => [product.name.toLowerCase(), product]));

        firestoreProducts.forEach((firestoreProduct) => {
            const product = productsById.get(String(firestoreProduct.id_local ?? ""))
                || productsByName.get((firestoreProduct.nombre_prod || "").toLowerCase());

            if (!product) {
                return;
            }

            product.firestoreId = firestoreProduct.firestoreId;

            if (typeof firestoreProduct.stock === "number") {
                product.stock = firestoreProduct.stock;
            }
        });

        syncCartPricesWithCatalog();
        renderStoreViews();
        updateCartUI();
    } catch (error) {
        console.error("No se pudo sincronizar el catalogo con Firestore:", error);
    }
}

// ES: Persiste el carrito en localStorage para conservarlo entre sesiones.
// EN: Persists the cart in localStorage to keep it between sessions.
function saveCart() {
    localStorage.setItem("smucky_cart", JSON.stringify(cart));
}

// ES: Persiste la lista de favoritos en localStorage.
// EN: Persists the favorites list in localStorage.
function saveFavorites() {
    localStorage.setItem("smucky_favorites", JSON.stringify(favorites));
}

// ES: Actualiza los contadores de carrito y favoritos visibles en el encabezado.
// EN: Updates the cart and favorites counters visible in the header.
function updateHeaderBadges() {
    if (cartCount) {
        const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCount.textContent = String(totalQty);
    }

    if (favoritesCount) {
        favoritesCount.textContent = String(favorites.length);
    }
}

// ES: Verifica si el usuario está autenticado; si no, lo redirige al login.
//     Devuelve true si la sesión es válida, false si fue redirigido.
// EN: Checks whether the user is authenticated; if not, redirects to login.
//     Returns true if the session is valid, false if redirected.
function ensureAuthenticated() {
    if (window.SmuckyAuth && !window.SmuckyAuth.isLoggedIn()) {
        window.SmuckyAuth.redirectToLogin();
        return false;
    }
    return true;
}

// ES: Muestra el nombre o email del usuario en el menú de perfil del encabezado.
// EN: Displays the user's name or email in the header profile menu.
function syncProfileMenu() {
    if (!profileMenuTitle) return;

    const user = window.SmuckyAuth ? window.SmuckyAuth.getCurrentUser() : null;

    const toggleItem = (element, show) => {
        if (!element) return;
        element.style.display = show ? "block" : "none";
    };

    if (user && user.email) {
        profileMenuTitle.textContent = `Hola, ${user.nombre || user.name || user.email}`;

        toggleItem(profileLoginLink, false);
        toggleItem(profileRegisterLink, false);
        toggleItem(profileViewLink, true);
        toggleItem(profileEditBtn, true);
        toggleItem(profileDeleteBtn, true);
        toggleItem(profileLogoutBtn, true);
    } else {
        profileMenuTitle.textContent = "No has iniciado sesion";

        toggleItem(profileLoginLink, true);
        toggleItem(profileRegisterLink, true);
        toggleItem(profileViewLink, false);
        toggleItem(profileEditBtn, false);
        toggleItem(profileDeleteBtn, false);
        toggleItem(profileLogoutBtn, false);
    }
}

// ES: Devuelve la URL de la imagen principal del producto.
//     Si tiene galería, usa la primera imagen; si no, usa la imagen directa.
// EN: Returns the URL of the product's primary image.
//     If it has a gallery, uses the first image; otherwise uses the direct image.
function getPrimaryImage(product) {
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
        return product.gallery[0];
    }
    return product.image;
}

// ES: Devuelve un arreglo de imagenes unicas del producto para la galeria de detalle.
// EN: Returns a unique list of product images for the detail gallery.
function getProductGalleryImages(product) {
    if (!product) return [];

    const baseImages = Array.isArray(product.gallery) && product.gallery.length > 0
        ? [...product.gallery]
        : [product.image];

    if (product.image && !baseImages.includes(product.image)) {
        baseImages.unshift(product.image);
    }

    return [...new Set(baseImages.filter(Boolean))].slice(0, 6);
}

// ES: Actualiza el botón de favoritos en el modal de detalle reflejando
//     si el producto actual está en la lista de favoritos.
// EN: Updates the favorites button in the detail modal reflecting
//     whether the current product is in the favorites list.
function updateDetailFavoriteButton() {
    if (!detailFavoriteBtn || !detailSelection.product) return;
    const isFavorite = favorites.includes(detailSelection.product.id);
    detailFavoriteBtn.textContent = isFavorite ? "Quitar me gusta â¤" : "Me gusta â¤";
    detailFavoriteBtn.classList.toggle("active", isFavorite);
}

function getDetailSizeLabel(product) {
    if (!product || !Array.isArray(product.category)) return "";

    if (product.category.includes("calcetines")) {
        return "";
    }

    if (product.category.includes("blusas_mujer") || product.category.includes("short_deportivo_mujer")) {
        return "Tipo de talla: Multitalla";
    }

    if (typeof product.subtitle === "string" && /tipo de talla/i.test(product.subtitle)) {
        return product.subtitle;
    }

    return "Tipo de talla: Multitalla";
}

// ES: Renderiza el contenido completo del modal de detalle del producto con
//     galería de imágenes, información y botones de acción.
// EN: Renders the complete content of the product detail modal with
//     image gallery, information, and action buttons.
function renderProductDetailModal() {
    if (!detailSelection.product || !detailMainImage || !detailThumbs) return;

    const product = detailSelection.product;
    const images = detailSelection.images;
    const selectedImage = images[detailSelection.activeIndex] || getPrimaryImage(product);

    if (detailProductName) detailProductName.textContent = product.name;
    detailMainImage.src = selectedImage;
    detailMainImage.alt = product.name;
    if (detailPrice) detailPrice.textContent = product.price.toFixed(2);
    if (detailStock) detailStock.textContent = "";
    if (detailSizeText) {
        const sizeLabel = getDetailSizeLabel(product);
        detailSizeText.textContent = sizeLabel;
        detailSizeText.style.display = sizeLabel ? "block" : "none";
    }

    detailThumbs.innerHTML = images
        .map((image, index) => `
            <button type="button" class="detail-thumb ${index === detailSelection.activeIndex ? "active" : ""}" data-index="${index}">
                <img src="${image}" alt="${product.name} vista ${index + 1}">
            </button>
        `)
        .join("");

    // ES: Permite cambiar la imagen principal al hacer clic en los thumbnails.
    // EN: Allows changing the main image by clicking on the thumbnails.
    const thumbButtons = detailThumbs.querySelectorAll(".detail-thumb");
    thumbButtons.forEach((button) => {
        button.addEventListener("click", () => {
            detailSelection.activeIndex = Number(button.dataset.index || 0);
            renderProductDetailModal();
        });
    });

    updateDetailFavoriteButton();
}

// ES: Abre el modal de detalle del producto con su galería de imágenes.
// EN: Opens the product detail modal with its image gallery.
function openProductDetailModal(product) {
    if (!product || !productDetailModal) return;

    detailSelection = {
        product,
        images: getProductGalleryImages(product),
        activeIndex: 0
    };

    renderProductDetailModal();
    productDetailModal.style.display = "flex";
}

// ES: Cierra el modal de detalle del producto.
// EN: Closes the product detail modal.
function closeProductDetailModal() {
    if (!productDetailModal) return;
    productDetailModal.style.display = "none";
}

// ES: Rellena el modal de compra con los datos del producto seleccionado
//     (nombre, imagen, stock, precio por unidad y total según la cantidad).
// EN: Fills the purchase modal with the selected product's data
//     (name, image, stock, unit price, and total based on quantity).
function renderBuyModal() {
    const product = buySelection.product;
    if (!product) return;

    const qty = buySelection.qty;
    const total = product.price * qty;

    if (buyProductName) buyProductName.textContent = product.name;
    if (buyProductImage) {
        buyProductImage.src = getPrimaryImage(product);
        buyProductImage.alt = product.name;
    }
    if (buyProductStock) buyProductStock.textContent = "";
    if (buyProductPrice) buyProductPrice.textContent = `$${product.price.toFixed(2)} c/u`;
    if (buyQtyValue) buyQtyValue.textContent = String(qty);
    if (buyTotal) buyTotal.textContent = total.toFixed(2);

    if (buyQtyMinus) buyQtyMinus.disabled = qty <= 1;
    if (buyQtyPlus) buyQtyPlus.disabled = qty >= product.stock;
}

// ES: Abre el modal de compra directa para el producto indicado, reseteando
//     la cantidad a 1 y marcando el método de pago predeterminado.
// EN: Redirects to the Amazon-style checkout page, saving the product in
//     sessionStorage so checkout.js can read it.
// ES: Abre la página de checkout guardando el producto en sessionStorage
//     para que checkout.js pueda recuperarlo. Verifica autenticación antes.
// EN: Opens the checkout page saving the product in sessionStorage
//     so checkout.js can retrieve it. Verifies authentication first.
function openBuyModal(product) {
    if (!product) return;

    // Verificar sesión antes de redirigir
    if (window.SmuckyAuth && !window.SmuckyAuth.isLoggedIn()) {
        window.SmuckyAuth.redirectToLogin?.();
        return;
    }

    sessionStorage.setItem("smucky_checkout_context", JSON.stringify({
        mode: "single",
        items: [{ ...product, qty: 1 }]
    }));
    sessionStorage.setItem("smucky_checkout_product", JSON.stringify({ ...product, qty: 1 }));
    window.location.href = "paginas/checkout.html";
}

// ES: Cierra el modal de compra directa.
// EN: Closes the direct purchase modal.
function closeBuyModal() {
    if (!buyModal) return;
    buyModal.style.display = "none";
}

// ES: Confirma la compra: valida el método de pago, llama a Stripe si es con
//     tarjeta o usa realizarPedido para otros métodos. Actualiza el stock tras
//     el pago y muestra mensajes al usuario.
// EN: Confirms the purchase: validates the payment method, calls Stripe for
//     card payments or uses realizarPedido for other methods. Updates stock
//     after payment and shows messages to the user.
async function confirmBuyModal() {
    const product = buySelection.product;
    const qty = buySelection.qty;

    if (!product || qty < 1) return;

    const paymentMethod = document.querySelector("input[name='buyPaymentMethod']:checked")?.value;
    if (!paymentMethod) {
        alert("Selecciona un metodo de pago.");
        return;
    }

    const unsupportedPaymentMethods = [
            "Mercado Pago"
    ];

    if (unsupportedPaymentMethods.includes(paymentMethod)) {
            alert(`${paymentMethod} aun no esta integrado para cobro real.\n\nPor ahora solo puedes cobrar con tarjeta de credito o tarjeta de debito usando Stripe, o primero configurar ese metodo de pago.`);
        return;
    }

    const isCardPayment = paymentMethod.toLowerCase().includes("tarjeta");

    if (isCardPayment && typeof window.iniciarPagoStripe === "function") {
        const stripeResult = await window.iniciarPagoStripe(
            String(product.id),
            qty,
            product.name,
            product.price
        );

        if (stripeResult) {
            await syncProductsFromFirestore();
            closeBuyModal();
            alert(`Compra confirmada con metodo de pago: ${paymentMethod}.`);
        }

        return;
    }

    if (typeof window.realizarPedido !== "function") {
        alert("Estamos conectando la tienda. Intenta en unos segundos.");
        return;
    }

    const saved = await window.realizarPedido(
        String(product.firestoreId || product.id),
        qty,
        product.name,
        product.price
    );

   if (saved) {                          // si el pedido se guardó en Firebase
    await syncProductsFromFirestore(); // actualiza el stock en pantalla
    closeBuyModal();                   // cierra la ventana de compra

    // obtiene los datos del cliente que está logueado
    const usuario = window.SmuckyAuth?.getCurrentUser?.();
    const emailCliente  = usuario?.email  || "";
    const nombreCliente = usuario?.nombre || usuario?.name || "Cliente";

    // manda los 2 correos (al cliente y a ti)
    if (emailCliente && typeof window.enviarCorreosVenta === "function") {
        window.enviarCorreosVenta(
            emailCliente,      // correo del cliente
            nombreCliente,     // nombre del cliente
            product.nombre_prod || product.name,  // nombre del producto
            qty,               // cantidad comprada
            product.precio     || product.price,  // precio unitario
            (product.precio    || product.price) * qty  // total
        );
    }

    // mensaje de confirmación al cliente
    alert(`¡Compra confirmada! Te enviamos un correo de confirmación a ${emailCliente || "tu correo"}.`);
}
}

heroImages.forEach((img) => {
    img.addEventListener("error", () => {
        if (!img.src.includes("Playeras_de_colores.png")) {
            img.src = heroFallbackImage;
        }
    });
});

// ====== HERO SLIDER ======
// ES: Muestra el slide indicado por su índice y actualiza los puntos de navegación.
// EN: Shows the slide at the given index and updates the navigation dots.
function showSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) {
            slide.classList.add("active");
        }
    });

    heroDots.forEach((dot, i) => {
        dot.classList.remove("active");
        if (i === index) {
            dot.classList.add("active");
        }
    });
}

// ES: Avanza al siguiente slide de forma cíclica.
// EN: Advances to the next slide in a cyclic manner.
function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
}

// ES: Retrocede al slide anterior de forma cíclica.
// EN: Goes back to the previous slide in a cyclic manner.
function prevSlide() {
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(currentSlide);
}

// ES: Auto-avance del slider cada 5 segundos. Al interactuar (flechas o puntos),
//     se detiene y reinicia el contador para que el usuario pueda mirar con calma.
// EN: Auto-advance slider every 5 seconds. When interacting (arrows or dots),
//     it stops and restarts the timer so the user can view comfortably.
let slideInterval = setInterval(nextSlide, 5000);

heroPrev.addEventListener("click", () => {
    clearInterval(slideInterval);
    prevSlide();
    slideInterval = setInterval(nextSlide, 5000);
});

heroNext.addEventListener("click", () => {
    clearInterval(slideInterval);
    nextSlide();
    slideInterval = setInterval(nextSlide, 5000);
});

// ES: Cada punto del slider permite ir directamente al slide correspondiente.
// EN: Each slider dot allows you to go directly to the corresponding slide.
heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        clearInterval(slideInterval);
        currentSlide = index;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

// ES: Los botones CTA del hero desplazan suavemente a la sección de productos.
// EN: The hero CTA buttons smoothly scroll to the products section.
heroCtas.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        if (!targetId) return;

        const section = document.getElementById(targetId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// ES: Genera el HTML de imagen del producto. Si tiene galería con al menos
//     2 imágenes, las muestra en vista dividida (frente y atrás).
// EN: Generates the product image HTML. If it has a gallery with at least
//     2 images, displays them in a split view (front and back).
function getProductImageHTML(product) {
    if (Array.isArray(product.gallery) && product.gallery.length >= 2) {
        return `
            <button type="button" class="product-image split-image product-detail-trigger" data-product-id="${product.id}" aria-label="Ver detalle de ${product.name}">
                <div class="split-item">
                    <img src="${product.gallery[0]}" alt="${product.name} frente">
                </div>
                <div class="split-item">
                    <img src="${product.gallery[1]}" alt="${product.name} atrás">
                </div>
            </button>
        `;
    }

    return `
        <button type="button" class="product-image product-detail-trigger" data-product-id="${product.id}" aria-label="Ver detalle de ${product.name}">
            <img src="${product.image}" alt="${product.name}">
        </button>
    `;
}

// ES: Devuelve el ID de la sección HTML correspondiente a la categoría del producto.
// EN: Returns the HTML section ID that corresponds to the product's category.
function getSectionIdForProduct(product) {
    if (!product || !Array.isArray(product.category)) return null;

    if (product.category.includes("playeras_hombre")) return "playeras-hombre";
    if (product.category.includes("playeras_sin_mangas_hombre")) return "playeras-sin-mangas-hombre";
    if (product.category.includes("blusas_mujer")) return "blusas-mujer";
    if (product.category.includes("short_deportivo_mujer")) return "short-deportivo-mujer";
    if (product.category.includes("calcetines")) return "calcetines-mujer";

    return null;
}

// ES: Vacía y oculta el listado de sugerencias del buscador.
// EN: Empties and hides the search suggestions list.
function clearSearchSuggestions() {
    if (!searchSuggestions) return;
    searchSuggestions.innerHTML = "";
    searchSuggestions.classList.remove("active");
}

// ES: Hace scroll suave hasta la sección del producto y luego resalta
//     visualmente la tarjeta del producto con un efecto de destello.
// EN: Smoothly scrolls to the product's section and then visually highlights
//     the product card with a flash effect.
function goToProduct(product) {
    if (!product) return;

    const sectionId = getSectionIdForProduct(product);
    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    section.scrollIntoView({ behavior: "smooth", block: "start" });

    window.setTimeout(() => {
        const card = document.getElementById(`product-${product.id}`);
        if (!card) return;

        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("search-hit");
        window.setTimeout(() => card.classList.remove("search-hit"), 1200);
    }, 360);
}

// ES: Muestra hasta 6 sugerencias de productos que coincidan con el término
//     escrito en el buscador. Al hacer clic en una, navega a ese producto.
// EN: Shows up to 6 product suggestions matching the text typed in the search
//     bar. Clicking one navigates to that product.
function renderSearchSuggestions(term) {
    if (!searchSuggestions) return;

    const cleanTerm = term.trim().toLowerCase();
    if (!cleanTerm) {
        clearSearchSuggestions();
        return;
    }

    const matches = products
        .filter((product) => product.name.toLowerCase().includes(cleanTerm))
        .slice(0, 6);

    if (matches.length === 0) {
        clearSearchSuggestions();
        return;
    }

    searchSuggestions.innerHTML = matches
        .map((product) => {
            const safeName = product.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return `<button type="button" class="search-suggestion-item" data-id="${product.id}"><strong>${safeName}</strong></button>`;
        })
        .join("");

    searchSuggestions.classList.add("active");

    const items = searchSuggestions.querySelectorAll(".search-suggestion-item");
    items.forEach((item) => {
        item.addEventListener("click", () => {
            const productId = Number(item.dataset.id);
            const selected = products.find((p) => p.id === productId);
            if (!selected) return;

            searchInput.value = selected.name;
            clearSearchSuggestions();
            goToProduct(selected);
        });
    });
}

// ====== RENDER DE PRODUCTOS ======
function renderProducts(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Determinar el grid container basado en el ID de la sección
    let gridId = "";
    
    if (sectionId === "playeras-hombre") {
        gridId = "playeras-hombre-grid";
    } else if (sectionId === "playeras-sin-mangas-hombre") {
        gridId = "playeras-sin-mangas-hombre-grid";
    } else if (sectionId === "blusas-mujer") {
        gridId = "blusas-mujer-grid";
    } else if (sectionId === "short-deportivo-mujer") {
        gridId = "short-deportivo-mujer-grid";
    } else if (sectionId === "calcetines-mujer") {
        gridId = "calcetines-mujer-grid";
    }

    const grid = document.getElementById(gridId);
    if (!grid) return;

    // Determinar qué categoría mostrar basado en el ID de la sección
    let categoriesToShow = [];
    
    if (sectionId === "playeras-hombre") {
        categoriesToShow = ["playeras_hombre"];
    } else if (sectionId === "playeras-sin-mangas-hombre") {
        categoriesToShow = ["playeras_sin_mangas_hombre"];
    } else if (sectionId === "blusas-mujer") {
        categoriesToShow = ["blusas_mujer"];
    } else if (sectionId === "short-deportivo-mujer") {
        categoriesToShow = ["short_deportivo_mujer"];
    } else if (sectionId === "calcetines-mujer") {
        categoriesToShow = ["calcetines"];
    }

    const productsToShow = products.filter(product => 
        product.category.some(cat => categoriesToShow.includes(cat))
    );

    grid.innerHTML = "";

    if (productsToShow.length === 0) {
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: #666;'>No se encontraron productos.</p>";
        return;
    }

    productsToShow.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.id = `product-${product.id}`;
        card.dataset.productName = product.name.toLowerCase();
        card.dataset.productId = String(product.id);
        
        let badgeHTML = "";
        if (product.badge === "new") {
            badgeHTML = '<span class="product-badge new">Nuevo</span>';
        } else if (product.badge === "sale") {
            badgeHTML = '<span class="product-badge sale">Oferta</span>';
        }

        card.innerHTML = `
            ${badgeHTML}
            ${getProductImageHTML(product)}
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                ${product.subtitle ? `<p class="product-subtitle">${product.subtitle}</p>` : ""}
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button type="button" class="favorite-btn ${favorites.includes(product.id) ? "active" : ""}" data-product-id="${product.id}" title="Guardar en favoritos">${favorites.includes(product.id) ? "❤️" : "♡"}</button>
                    <button type="button" class="add-cart-btn" data-product-id="${product.id}">Agregar al carrito</button>
                </div>
                <button type="button" class="buy-now-btn buy-product-btn" data-product-id="${product.id}">Comprar Ahora</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function loadCategoryProducts(category) {
    // Hacer scroll a la sección correcta
    let sectionId = "";
    
    switch(category) {
        case "playeras":
            sectionId = "playeras-hombre";
            break;
        case "playeras_sin_mangas":
            sectionId = "playeras-sin-mangas-hombre";
            break;
        case "calcetines_hombre":
        case "calcetines_mujer":
            sectionId = "calcetines-mujer";
            break;
        case "blusas":
            sectionId = "blusas-mujer";
            break;
        case "short_deportivo":
            sectionId = "short-deportivo-mujer";
            break;
        default:
            sectionId = "playeras-hombre";
    }

    const section = document.getElementById(sectionId);
    if (section) {
        // Scroll suave a la sección
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// ES: Renderiza una cuadrícula con los productos destacados (featured = true).
// EN: Renders a grid with featured products (featured = true).
function renderFeaturedProducts() {
    const featured = products.filter(p => p.featured);
    const featuredGrid = document.getElementById("featuredGrid");
    if (!featuredGrid) return;
    
    featuredGrid.innerHTML = "";
    
    featured.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        
        let badgeHTML = "";
        if (product.badge === "new") {
            badgeHTML = '<span class="product-badge new">Nuevo</span>';
        } else if (product.badge === "sale") {
            badgeHTML = '<span class="product-badge sale">Oferta</span>';
        }

        card.innerHTML = `
            ${badgeHTML}
            ${getProductImageHTML(product)}
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                ${product.subtitle ? `<p class="product-subtitle">${product.subtitle}</p>` : ""}
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <!-- Botón de carrito desactivado temporalmente -->
            </div>
        `;
        featuredGrid.appendChild(card);
    });
    
    // attachAddToCartEvents(); // desactivado temporalmente
}

// ====== AÃ‘ADIR EVENTOS A BOTONES "AGREGAR AL CARRITO" ======
function attachAddToCartEvents() {
    const addButtons = document.querySelectorAll(".add-to-cart-btn");
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id, 10);
            addToCart(id);
        });
    });
}

// ====== FILTRAR POR CATEGORÍA ======
// ES: Función mantenida por compatibilidad pero simplificada.
//     El sistema actual usa loadCategoryProducts() en su lugar.
// EN: Function kept for compatibility but simplified.
//     The current system uses loadCategoryProducts() instead.
function filterByCategory(category) {
    // Función mantenida por compatibilidad pero simplificada
    // El sistema actual usa loadCategoryProducts() en su lugar
}

// ====== BÃšSQUEDA ======
function searchProducts() {
    if (!searchInput) return;

    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
        clearSearchSuggestions();
        return;
    }

    const match = products.find((product) => product.name.toLowerCase().includes(term));
    if (match) {
        clearSearchSuggestions();
        goToProduct(match);
    }
}

// ====== ORDENAMIENTO ======
// ES: Función mantenida por compatibilidad histórica.
//     El sistema actual no utiliza ordenamiento dinámico.
// EN: Function kept for historical compatibility.
//     The current system does not use dynamic sorting.
function applySortAndRender() {
    // Función mantenida por compatibilidad
    // El sistema actual no utiliza ordenamiento dinámico
}

// ====== CARRITO ======
// ES: Agrega un producto al carrito. Si ya existe, incrementa su cantidad.
//     Actualiza la UI, guarda en localStorage y actualiza el badge del encabezado.
// EN: Adds a product to the cart. If it already exists, increments its quantity.
//     Updates the UI, saves to localStorage, and updates the header badge.
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.price = product.price;
        existing.name = product.name;
        existing.image = getPrimaryImage(product);
        existing.stock = product.stock;
        existing.firestoreId = product.firestoreId;
        existing.gallery = Array.isArray(product.gallery) ? [...product.gallery] : [];
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            image: getPrimaryImage(product),
            stock: product.stock,
            firestoreId: product.firestoreId,
            gallery: Array.isArray(product.gallery) ? [...product.gallery] : []
        });
    }

    updateCartUI();
    saveCart();
    updateHeaderBadges();
}

// ES: Elimina completamente un producto del carrito por su ID.
// EN: Completely removes a product from the cart by its ID.
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateHeaderBadges();
    updateCartUI();
}

// ES: Cambia la cantidad de un producto en el carrito. Si llega a 0 lo elimina.
// EN: Changes a cart item's quantity. Removes it if it reaches 0.
function changeCartQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    saveCart();
    updateHeaderBadges();
    updateCartUI();
}

// ES: Renderiza el contenido del modal del carrito: listado de productos,
//     subtotales, botón de eliminar por ítem y total general.
// EN: Renders the cart modal content: product list, subtotals,
//     per-item remove button, and grand total.
function updateCartUI() {
    if (!cartCount || !cartItemsContainer || !cartTotalSpan) return;

    // contador
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = totalQty;

    // listado
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <p class="empty-cart-emoji"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></p>
                <p class="empty-cart-title">Tu carrito esta vacio</p>
                <p class="empty-cart-subtitle">Agrega productos para verlos aqui.</p>
            </div>
        `;
    } else {
        // ES: Renderiza cada ítem con imagen, nombre, precio, subtotal y controles de cantidad.
        // EN: Renders each item with image, name, price, subtotal, and quantity controls.
        // ES: Clea cada item del carrito con imagen, nombre, precio y controles.
        // EN: Render each cart item with image, name, price, and controls.
        cart.forEach(item => {
            const fullProduct = products.find((p) => p.id === item.id);
            const imageSrc = fullProduct ? getPrimaryImage(fullProduct) : "";

            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <div class="cart-item-main">
                    <img class="cart-item-thumb" src="${imageSrc}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p class="cart-item-title">${item.name}</p>
                        <p class="cart-item-unit-price">$${item.price.toFixed(2)} c/u</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-subtotal">$${(item.price * item.qty).toFixed(2)}</p>
                    <div class="cart-qty-row">
                        <button class="cart-qty-del" data-id="${item.id}" title="Eliminar producto">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                        <button class="cart-qty-btn cart-qty-minus" data-id="${item.id}">−</button>
                        <span class="cart-qty-num">${item.qty}</span>
                        <button class="cart-qty-btn cart-qty-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        // ES: Eventos para los botones de cantidad y eliminar de cada ítem del carrito.
        // EN: Events for quantity and delete buttons of each cart item.
        cartItemsContainer.querySelectorAll(".cart-qty-del").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(parseInt(btn.dataset.id, 10)));
        });
        cartItemsContainer.querySelectorAll(".cart-qty-minus").forEach(btn => {
            btn.addEventListener("click", () => changeCartQty(parseInt(btn.dataset.id, 10), -1));
        });
        cartItemsContainer.querySelectorAll(".cart-qty-plus").forEach(btn => {
            btn.addEventListener("click", () => changeCartQty(parseInt(btn.dataset.id, 10), +1));
        });
    }

    // total
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    cartTotalSpan.textContent = total.toFixed(2);
}

// ES: Agrega o quita un producto de favoritos por su ID. Guarda el cambio,
//     actualiza el badge y vuelve a renderizar la tienda y el modal de favoritos.
// EN: Adds or removes a product from favorites by its ID. Saves the change,
//     updates the badge, and re-renders the store and favorites modal.
function toggleFavorite(productId) {
    const index = favorites.indexOf(productId);
    const prod = products.find(p => p.id === productId);
    if (index >= 0) {
        favorites.splice(index, 1);
        // ES: Toast al quitar de favoritos.
        // EN: Toast when removing from favorites.
        showToast({
            titulo: "Quitado de favoritos",
            mensaje: prod ? prod.name : "Producto eliminado de tu lista.",
            tipo: "info"
        });
    } else {
        favorites.push(productId);
        // ES: Toast al agregar a favoritos.
        // EN: Toast when adding to favorites.
        showToast({
            titulo: "Guardado en favoritos",
            mensaje: prod ? prod.name : "Producto guardado en tu lista.",
            tipo: "fav"
        });
    }

    saveFavorites();
    updateHeaderBadges();
    renderStoreViews();

    if (favoritesModal && favoritesModal.style.display === "flex") {
        renderFavoritesUI();
    }
}

// ====== MODAL DEL CARRITO ======
// ES: Abre el modal del carrito y actualiza su contenido.
// EN: Opens the cart modal and refreshes its content.
function openCartModal() {
    if (!cartModal) return;
    updateCartUI();
    cartModal.style.display = "flex";
}

// ES: Cierra el modal del carrito.
// EN: Closes the cart modal.
function closeCartModal() {
    if (!cartModal) return;
    cartModal.style.display = "none";
}

// ES: Abre el modal de favoritos y renderiza su contenido actualizado.
// EN: Opens the favorites modal and renders its updated content.
function openFavoritesModal() {
    if (!favoritesModal) return;
    renderFavoritesUI();
    favoritesModal.style.display = "flex";
}

// ES: Cierra el modal de favoritos.
// EN: Closes the favorites modal.
function closeFavoritesModal() {
    if (!favoritesModal) return;
    favoritesModal.style.display = "none";
}

// ES: Renderiza la lista de productos favoritos dentro del modal.
//     Incluye botones para comprar, agregar al carrito o eliminar de favoritos.
// EN: Renders the list of favorite products inside the modal.
//     Includes buttons to buy, add to cart, or remove from favorites.
function renderFavoritesUI() {
    if (!favoritesItemsContainer) return;

    favoritesItemsContainer.innerHTML = "";

    const favoriteProducts = favorites
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean);

    if (favoriteProducts.length === 0) {
        favoritesItemsContainer.innerHTML = `
            <div class="empty-cart-state">
                <p class="empty-cart-emoji"><svg width="40" height="40" viewBox="0 0 24 24" fill="#f87171" stroke="#f87171" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></p>
                <p class="empty-cart-title">No tienes favoritos guardados</p>
                <p class="empty-cart-subtitle">Marca prendas con â¤ para verlas aqui.</p>
            </div>
        `;
        return;
    }

    favoriteProducts.forEach((product) => {
        const isAvailable = product.stock > 0;
        const div = document.createElement("div");
        div.classList.add("cart-item", "favorite-item");
        div.innerHTML = `
            <button type="button" class="cart-item-main favorite-product-link" data-id="${product.id}">
                <img class="cart-item-thumb" src="${getPrimaryImage(product)}" alt="${product.name}">
                <div class="cart-item-info">
                    <p class="cart-item-title">${product.name}</p>
                    <p class="cart-item-qty">Precio: $${product.price.toFixed(2)}</p>
                </div>
            </button>
            <div class="cart-item-actions">
                ${isAvailable
                    ? `<button class="favorite-buy-btn" data-id="${product.id}">Comprar producto</button>
                       <button class="favorite-cart-btn" data-id="${product.id}">Agregar al carrito</button>`
                    : `<p class="favorite-stock-warning">Producto insuficiente</p>`}
                <button class="remove-item-btn remove-favorite-btn" data-id="${product.id}">
                    Eliminar
                </button>
            </div>
        `;
        favoritesItemsContainer.appendChild(div);
    });

    const removeFavBtns = favoritesItemsContainer.querySelectorAll(".remove-favorite-btn");
    removeFavBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            toggleFavorite(id);
        });
    });

    const favoriteLinks = favoritesItemsContainer.querySelectorAll(".favorite-product-link");
    favoriteLinks.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = Number(btn.dataset.id);
            const product = products.find((item) => item.id === productId);
            if (!product) return;

            closeFavoritesModal();
            goToProduct(product);
        });
    });

    const favoriteBuyBtns = favoritesItemsContainer.querySelectorAll(".favorite-buy-btn");
    favoriteBuyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = Number(btn.dataset.id);
            const product = products.find((item) => item.id === productId);
            if (!product) return;

            if (product.stock < 1) {
                // ES: Toast de error si no hay stock suficiente para comprar.
                // EN: Error toast if there is not enough stock to buy.
                showToast({ titulo: "Sin stock", mensaje: `${product.name} no tiene unidades disponibles.`, tipo: "error" });
                return;
            }

            closeFavoritesModal();
            openBuyModal(product);
        });
    });

    const favoriteCartBtns = favoritesItemsContainer.querySelectorAll(".favorite-cart-btn");
    favoriteCartBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = Number(btn.dataset.id);
            const product = products.find((item) => item.id === productId);
            if (!product) return;

            if (product.stock < 1) {
                showToast({ titulo: "Sin stock", mensaje: `${product.name} no tiene unidades disponibles.`, tipo: "error" });
                return;
            }

            addToCart(product.id);
            // ES: Toast al agregar al carrito desde la lista de favoritos.
            // EN: Toast when adding to cart from the favorites list.
            showToast({ titulo: "Agregado al carrito", mensaje: product.name, tipo: "success" });
            closeFavoritesModal();
            openCartModal();
        });
    });
}

// ====== EVENTOS GLOBALES ======
// ES: Alterna la visibilidad de la barra de búsqueda y enfoca el input al abrirse.
// EN: Toggles the search bar visibility and focuses the input when opened.
if (searchToggle && searchBar && searchInput) {
    searchToggle.addEventListener("click", () => {
        searchBar.classList.toggle("active");
        if (searchBar.classList.contains("active")) {
            searchInput.focus();
        }
    });
}

// ES: Filtra los productos por subcategoría al hacer clic en los enlaces del dropdown.
// EN: Filters products by subcategory when dropdown links are clicked.
dropdownLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const subcategory = link.dataset.subcategory;
        if (subcategory) {
            loadCategoryProducts(subcategory);
        }
    });
});

// ES: Activa la búsqueda al hacer clic en el botón de lupa.
// EN: Triggers search when the magnifier button is clicked.
if (searchBtn) {
    searchBtn.addEventListener("click", searchProducts);
}

// ES: Muestra sugerencias mientras el usuario escribe y navega directo si
//     el texto coincide exactamente con un producto.
// EN: Shows suggestions as the user types and navigates directly if the
//     text exactly matches a product name.
if (searchInput) {
    searchInput.addEventListener("input", () => {
        const typed = searchInput.value.trim().toLowerCase();
        renderSearchSuggestions(typed);

        const exactMatch = products.find((product) => product.name.toLowerCase() === typed);
        if (exactMatch) {
            clearSearchSuggestions();
            goToProduct(exactMatch);
        }
    });

    // ES: Dispara la búsqueda al presionar Enter.
    // EN: Fires the search when Enter is pressed.
    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            searchProducts();
        }
    });
}

// ES: Cierra las sugerencias de búsqueda al hacer clic fuera del campo.
// EN: Closes search suggestions when clicking outside the search field.
document.addEventListener("click", (event) => {
    if (!searchSuggestions || !searchInput) return;
    const isInsideSearch = event.target.closest(".search-field");
    if (!isInsideSearch) {
        clearSearchSuggestions();
    }
});

// ES: Delegación de eventos en el documento para tarjetas de productos.
//     Maneja clicks en: abrir detalle, favoritos, agregar al carrito y comprar.
// EN: Document-level event delegation for product cards.
//     Handles clicks on: open detail, favorites, add to cart, and buy.
document.addEventListener("click", async (event) => {
    const detailTrigger = event.target.closest(".product-detail-trigger");
    if (detailTrigger) {
        const productId = Number(detailTrigger.dataset.productId);
        const product = products.find((item) => item.id === productId);
        if (!product) return;

        openProductDetailModal(product);
        return;
    }

    const cardTrigger = event.target.closest(".product-card");
    const clickedActionButton = event.target.closest(".favorite-btn, .add-cart-btn, .buy-product-btn");
    if (cardTrigger && !clickedActionButton) {
        const productId = Number(cardTrigger.dataset.productId);
        const product = products.find((item) => item.id === productId);
        if (!product) return;

        openProductDetailModal(product);
        return;
    }

    const favoriteButton = event.target.closest(".favorite-btn");
    if (favoriteButton) {
        const productId = Number(favoriteButton.dataset.productId);
        if (!ensureAuthenticated()) return;
        toggleFavorite(productId);
        return;
    }

    const addCartButton = event.target.closest(".add-cart-btn");
    if (addCartButton) {
        event.preventDefault();
        event.stopPropagation();
        const productId = Number(addCartButton.dataset.productId);
        if (!ensureAuthenticated()) return;
        const prod = products.find(p => p.id === productId);
        addToCart(productId);
        // ES: Muestra toast de confirmación al agregar al carrito.
        // EN: Shows confirmation toast when adding to cart.
        showToast({
            titulo: "Agregado al carrito",
            mensaje: prod ? prod.name : "Producto agregado correctamente.",
            tipo: "success"
        });
        return;
    }

    const buyButton = event.target.closest(".buy-product-btn");
    if (buyButton) {
        const productId = Number(buyButton.dataset.productId);
        const product = products.find((item) => item.id === productId);
        if (!product) return;
        if (!ensureAuthenticated()) return;

        openBuyModal(product);
    }
});

// ES: Reduce la cantidad del producto en el modal de compra, sin bajar de 1.
// EN: Decreases the product quantity in the buy modal, minimum 1.
if (buyQtyMinus) {
    buyQtyMinus.addEventListener("click", () => {
        if (!buySelection.product) return;
        buySelection.qty = Math.max(1, buySelection.qty - 1);
        renderBuyModal();
    });
}

// ES: Aumenta la cantidad del producto en el modal de compra, sin superar el stock.
// EN: Increases the product quantity in the buy modal, up to available stock.
if (buyQtyPlus) {
    buyQtyPlus.addEventListener("click", () => {
        if (!buySelection.product) return;
        buySelection.qty = Math.min(buySelection.product.stock, buySelection.qty + 1);
        renderBuyModal();
    });
}

// ES: Cierra el modal de compra al hacer clic en Cancelar o en la X.
// EN: Closes the buy modal when Cancel or X is clicked.
if (buyCancelBtn) {
    buyCancelBtn.addEventListener("click", closeBuyModal);
}

if (buyCloseBtn) {
    buyCloseBtn.addEventListener("click", closeBuyModal);
}

// ES: Confirma la compra al hacer clic en el botón de confirmar.
// EN: Confirms the purchase when the confirm button is clicked.
if (buyConfirmBtn) {
    buyConfirmBtn.addEventListener("click", async () => {
        await confirmBuyModal();
    });
}

// ES: Cierra el modal de detalle del producto al hacer clic en la X.
// EN: Closes the product detail modal when X is clicked.
if (detailCloseBtn) {
    detailCloseBtn.addEventListener("click", closeProductDetailModal);
}

// ES: Alterna favoritos desde el botón dentro del modal de detalle del producto.
// EN: Toggles favorites from the button inside the product detail modal.
if (detailFavoriteBtn) {
    detailFavoriteBtn.addEventListener("click", () => {
        if (!detailSelection.product) return;
        if (!ensureAuthenticated()) return;

        toggleFavorite(detailSelection.product.id);
        updateDetailFavoriteButton();
    });
}

if (detailAddCartBtn) {
    detailAddCartBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!detailSelection.product) return;
        if (!ensureAuthenticated()) return;

        if (detailSelection.product.stock < 1) {
            showToast({ titulo: "Sin stock", mensaje: `${detailSelection.product.name} no tiene unidades disponibles.`, tipo: "error" });
            return;
        }

        addToCart(detailSelection.product.id);
        showToast({ titulo: "Agregado al carrito", mensaje: detailSelection.product.name, tipo: "success" });
    });
}

if (detailBuyBtn) {
    detailBuyBtn.addEventListener("click", () => {
        if (!detailSelection.product) return;
        if (!ensureAuthenticated()) return;

        if (detailSelection.product.stock < 1) {
            alert("Producto insuficiente.");
            return;
        }

        closeProductDetailModal();
        openBuyModal(detailSelection.product);
    });
}

if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        profileMenu.classList.toggle("active");
    });
}


// ── Modal de confirmación del menú de perfil ──────────────────────────────
function showIndexConfirmDialog({ title, message, acceptText = "Aceptar", cancelText = "Cancelar", requiredText = "" }) {
    return new Promise((resolve) => {
        const modal   = document.getElementById("indexConfirmModal");
        const titleEl = document.getElementById("indexConfirmTitle");
        const msgEl   = document.getElementById("indexConfirmMessage");
        const acceptBtn = document.getElementById("indexConfirmAccept");
        const cancelBtn = document.getElementById("indexConfirmCancel");
        const inputWrap = document.getElementById("indexConfirmInputWrap");
        const input     = document.getElementById("indexConfirmInput");
        const hint      = document.getElementById("indexConfirmInputHint");
        const kicker    = document.getElementById("indexConfirmKicker");

        if (!modal) { resolve(confirm(message)); return; }

        const user = window.SmuckyAuth?.getCurrentUser?.();
        const nombre = user?.nombre || user?.name || "";
        if (kicker) kicker.textContent = nombre ? `Confirmación de ${nombre}` : "SMUCKY's By CHAVAMON";

        titleEl.textContent  = title;
        msgEl.textContent    = message;
        acceptBtn.textContent = acceptText;
        cancelBtn.textContent = cancelText;

        const required = String(requiredText || "").trim();
        const needsText = Boolean(required);

        if (inputWrap && input && hint) {
            inputWrap.hidden = !needsText;
            if (needsText) {
                input.value = "";
                input.placeholder = required;
                hint.textContent = `Debes escribir exactamente ${required}.`;
                acceptBtn.disabled = true;
            } else {
                acceptBtn.disabled = false;
            }
        }

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");

        const closeModal = (accepted) => {
            modal.hidden = true;
            modal.setAttribute("aria-hidden", "true");
            if (input) input.value = "";
            acceptBtn.removeEventListener("click", onAccept);
            cancelBtn.removeEventListener("click", onCancel);
            modal.removeEventListener("click", onBackdrop);
            document.removeEventListener("keydown", onEscape);
            if (input) { input.removeEventListener("input", onInput); input.removeEventListener("keydown", onInputEnter); }
            resolve(accepted);
        };

        const onAccept = () => {
            if (needsText && input) {
                if (input.value.trim().toLowerCase() !== required.toLowerCase()) { input.focus(); return; }
            }
            closeModal(true);
        };
        const onCancel    = () => closeModal(false);
        const onBackdrop  = (e) => { if (e.target === modal) closeModal(false); };
        const onEscape    = (e) => { if (e.key === "Escape") closeModal(false); };
        const onInput     = () => { if (needsText && input) acceptBtn.disabled = input.value.trim().toLowerCase() !== required.toLowerCase(); };
        const onInputEnter = (e) => { if (e.key === "Enter") { e.preventDefault(); if (!acceptBtn.disabled) onAccept(); } };

        acceptBtn.addEventListener("click", onAccept);
        cancelBtn.addEventListener("click", onCancel);
        modal.addEventListener("click", onBackdrop);
        document.addEventListener("keydown", onEscape);
        if (input) { input.addEventListener("input", onInput); input.addEventListener("keydown", onInputEnter); }

        if (needsText && input) input.focus(); else acceptBtn.focus();
    });
}

if (profileEditBtn) {
    profileEditBtn.addEventListener("click", () => {
        if (!ensureAuthenticated()) return;
        window.location.href = "cuenta/perfil.html?mode=edit";
    });
}

if (profileDeleteBtn) {
    profileDeleteBtn.addEventListener("click", async () => {
        if (!ensureAuthenticated()) return;
        profileMenu.classList.remove("active");

        const confirmed = await showIndexConfirmDialog({
            title: "Eliminar cuenta",
            message: "¿Seguro que quieres eliminar tu perfil? Se borrarán tus datos guardados en este dispositivo.",
            acceptText: "Aceptar",
            cancelText: "Cancelar"
        });
        if (!confirmed) return;

        const typed = await showIndexConfirmDialog({
            title: "Confirmación final",
            message: "Escriba \"Eliminar\" para eliminar su cuenta.",
            acceptText: "Eliminar",
            cancelText: "Cancelar",
            requiredText: "Eliminar"
        });
        if (!typed) return;

        if (window.SmuckyAuth) {
            window.SmuckyAuth.clearUser();
        }
        cart = [];
        favorites = [];
        saveCart();
        saveFavorites();
        updateHeaderBadges();
        syncProfileMenu();
    });
}

if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener("click", async () => {
        if (!window.SmuckyAuth || !window.SmuckyAuth.isLoggedIn()) {
            window.location.href = "cuenta/login.html";
            return;
        }
        profileMenu.classList.remove("active");

        const confirmed = await showIndexConfirmDialog({
            title: "Cerrar sesión",
            message: "¿Deseas cerrar sesión ahora?",
            acceptText: "Aceptar",
            cancelText: "Cancelar"
        });
        if (!confirmed) return;

        window.SmuckyAuth.clearUser();
        syncProfileMenu();
    });
}

document.addEventListener("click", (event) => {
    if (!profileMenu || !profileMenuWrap) return;
    if (!profileMenuWrap.contains(event.target)) {
        profileMenu.classList.remove("active");
    }
});

// Sort
if (sortSelect) {
    sortSelect.addEventListener("change", applySortAndRender);
}

// Cart
if (cartBtn) {
    cartBtn.addEventListener("click", () => {
        if (!ensureAuthenticated()) return;
        openCartModal();
    });
}

if (favoritesBtn) {
    favoritesBtn.addEventListener("click", () => {
        if (!ensureAuthenticated()) return;
        openFavoritesModal();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCartModal);
}

if (closeFavoritesBtn) {
    closeFavoritesBtn.addEventListener("click", closeFavoritesModal);
}

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }

    if (e.target === favoritesModal) {
        closeFavoritesModal();
    }

    if (e.target === buyModal) {
        closeBuyModal();
    }

    if (e.target === productDetailModal) {
        closeProductDetailModal();
    }
});

// ES: Al proceder al pago desde el carrito abre la página de checkout
//     usando el producto principal del carrito y su cantidad actual.
// EN: When proceeding to checkout from the cart, opens the checkout page
//     using the main cart product and its current quantity.
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
        if (cart.length === 0) {
            showToast({ titulo: "Carrito vacío", mensaje: "Agrega productos antes de pagar.", tipo: "error" });
            return;
        }
        if (!ensureAuthenticated()) return;

        const checkoutItems = cart.map((cartItem) => {
            const fullProduct = products.find((product) => product.id === cartItem.id);
            return {
                ...cartItem,
                ...(fullProduct || {}),
                id: fullProduct?.id ?? cartItem.id,
                name: fullProduct?.name ?? cartItem.name,
                price: cartItem.price,
                qty: cartItem.qty,
                image: fullProduct ? getPrimaryImage(fullProduct) : cartItem.image,
                stock: fullProduct?.stock ?? cartItem.stock ?? 99,
                firestoreId: fullProduct?.firestoreId ?? cartItem.firestoreId,
                gallery: fullProduct?.gallery ?? cartItem.gallery ?? []
            };
        });

        if (!checkoutItems.length) {
            showToast({ titulo: "Producto no disponible", mensaje: "No se pudo preparar el checkout para este producto.", tipo: "error" });
            return;
        }

        sessionStorage.setItem("smucky_checkout_context", JSON.stringify({
            mode: "cart",
            items: checkoutItems
        }));
        sessionStorage.setItem("smucky_checkout_product", JSON.stringify(checkoutItems[0]));
        closeCartModal();
        window.location.href = "paginas/checkout.html";
    });
}

// Newsletter
if (newsletterBtn && newsletterEmail) {
    newsletterBtn.addEventListener("click", () => {
        const email = newsletterEmail.value.trim();
        
        if (!email) {
            alert("Por favor ingresa tu correo electrónico.");
            return;
        }

        if (!email.includes("@")) {
            alert("Por favor ingresa un correo electrónico válido.");
            return;
        }

        alert(`¡Gracias por suscribirte! ðŸŽ‰\\n\\nTe enviaremos las mejores ofertas a ${email}`);
        newsletterEmail.value = "";
    });
}

// ====== INICIO ======
// Renderizar todos los productos en sus respectivas secciones
renderAllProductSections();

updateHeaderBadges();
updateCartUI();
syncProfileMenu();
showSlide(0);
syncProductsFromFirestore();

