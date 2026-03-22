// ====== DATOS DE PRODUCTOS ======
const products = [
    // PLAYERAS PREMIUM HOMBRE
    {
        id: 1,
        name: "Playera Premium Azul Claro",
        category: ["playeras_hombre"],
        price: 150,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Azul_claro.jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 2,
        name: "Playera Premium Rojizo",
        category: ["playeras_hombre"],
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Rojo.jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 3,
        name: "Playera Premium Rosa",
        category: ["playeras_hombre"],
        price: 150,
        rating: 4.7,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Rojo_Vino.jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 4,
        name: "Playera Premium Blanco",
        category: ["playeras_hombre"],
        price: 150,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Blanco.jpg",
        featured: true,
        badge: "new"
    },
    
    // PLAYERAS SIN MANGAS HOMBRE
    {
        id: 9,
        name: "Playera Sin Mangas Gris",
        category: ["playeras_sin_mangas_hombre"],
        price: 70,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Hombre/Playera sin mangas/ropa interior gris.jpeg",
        featured: true,
        badge: "new"
    },
    // CALCETINES (AMBOS)
    {
        id: 6,
        name: "Calcetines Deportivos Multicolores",
        category: ["calcetines"],
        price: 45,
        rating: 4.8,
        image: "Imagenes de ropa/Calcetines deportivo/cacetines_blanco_negro.jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 7,
        name: "Calcetines Deportivos Multicolor",
        category: ["calcetines"],
        price: 45,
        rating: 4.7,
        image: "Imagenes de ropa/Calcetines deportivo/cioc_color_blanco_negro.jpg",
        featured: false,
        badge: "new"
    },
    {
        id: 8,
        name: "Calcetines Premium Pack Completo",
        category: ["calcetines"],
        price: 45,
        rating: 4.9,
        image: "Imagenes de ropa/Calcetines deportivo/Rosa_azul_dama.jpg",
        featured: false,
        badge: "new"
    },
    // BLUSAS MUJER
    {
        id: 10,
        name: "Blusa Premium Roja",
        category: ["blusas_mujer"],
        price: 60,
        rating: 4.9,
        image: "Imagenes de ropa/Ropa de Mujer/Blusa/blusa rojo.jpeg",
        featured: true,
        badge: "new"
    },
    {
        id: 12,
        name: "Blusa Premium Rosa",
        category: ["blusas_mujer"],
        price: 60,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Blusa/blusa rosa.jpeg",
        featured: true,
        badge: "new"
    },
    {
        id: 11,
        name: "Short Deportivo",
        category: ["short_deportivo_mujer"],
        price: 150,
        rating: 4.8,
        image: "Imagenes de ropa/Ropa de Mujer/Short deportivo/2.jpg",
        gallery: [
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/2.jpg",
            "Imagenes de ropa/Ropa de Mujer/Short deportivo/1.jpg"
        ],
        // subtitle: "Costo: $150 (cada uno)",
        featured: true,
        badge: "new"
    }
];

// ====== REFERENCIAS A ELEMENTOS DEL DOM ======
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const sortSelect = document.getElementById("sortSelect");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const newsletterBtn = document.getElementById("newsletterBtn");
const newsletterEmail = document.getElementById("newsletterEmail");

// Hero Slider
const heroSlides = document.querySelectorAll(".hero-slide");
const heroPrev = document.querySelector(".hero-prev");
const heroNext = document.querySelector(".hero-next");
const heroDots = document.querySelectorAll(".dot");
const heroCtas = document.querySelectorAll(".hero-cta");
const heroImages = document.querySelectorAll(".hero-image img");
const heroFallbackImage = "Imagenes de ropa/Ropa de Hombre/Playera Premium/Azul_claro.jpg";

// Navigation
const navLinks = document.querySelectorAll(".nav-link");
const dropdownLinks = document.querySelectorAll(".dropdown-link");

// Manejar clicks en nav-link principales (Hombre/Mujer)
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
let currentCategory = "all";
let filteredProducts = [...products];
let cart = [];
let currentSlide = 0;

heroImages.forEach((img) => {
    img.addEventListener("error", () => {
        if (!img.src.includes("Azul_claro.jpg")) {
            img.src = heroFallbackImage;
        }
    });
});

// ====== HERO SLIDER ======
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

function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(currentSlide);
}

// Auto-slide cada 5 segundos
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

heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        clearInterval(slideInterval);
        currentSlide = index;
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 5000);
    });
});

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

function getProductImageHTML(product) {
    if (Array.isArray(product.gallery) && product.gallery.length >= 2) {
        return `
            <div class="product-image split-image">
                <div class="split-item">
                    <img src="${product.gallery[0]}" alt="${product.name} frente">
                </div>
                <div class="split-item">
                    <img src="${product.gallery[1]}" alt="${product.name} atrás">
                </div>
            </div>
        `;
    }

    return `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
    `;
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
    } else if (sectionId === "calcetines") {
        gridId = "calcetines-grid";
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
    } else if (sectionId === "calcetines") {
        categoriesToShow = ["calcetines"];
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
        grid.appendChild(card);
    });

    // attachAddToCartEvents(); // desactivado temporalmente
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
            sectionId = "calcetines";
            break;
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

// Render Featured Products  
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

// ====== AÑADIR EVENTOS A BOTONES "AGREGAR AL CARRITO" ======
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
function filterByCategory(category) {
    // Función mantenida por compatibilidad pero simplificada
    // El sistema actual usa loadCategoryProducts() en su lugar
}

// ====== BÚSQUEDA ======
function searchProducts() {
    const term = searchInput.value.trim().toLowerCase();

    if (term === "") {
        // Si está vacío, mostrar productos relacionados
        renderFeaturedProducts();
        return;
    }

    // Buscar en todos los productos
    const results = products.filter(p =>
        p.name.toLowerCase().includes(term)
    );

    // Mostrar resultados en featured grid temporalmente
    const featuredGrid = document.getElementById("featuredGrid");
    if (!featuredGrid) return;
    
    featuredGrid.innerHTML = "";
    
    if (results.length === 0) {
        featuredGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: #666;'>No se encontraron productos.</p>";
        return;
    }
    
    results.forEach(product => {
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

// ====== ORDENAMIENTO ======
function applySortAndRender() {
    // Función mantenida por compatibilidad
    // El sistema actual no utiliza ordenamiento dinámico
}

// ====== CARRITO ======
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    if (!cartCount || !cartItemsContainer || !cartTotalSpan) return;

    // contador
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    cartCount.textContent = totalQty;

    // listado
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
        cart.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-item-qty">Cantidad: ${item.qty}</p>
                </div>
                <div>
                    <p class="cart-item-subtotal">$${(item.price * item.qty).toFixed(2)}</p>
                    <button class="remove-item-btn" data-id="${item.id}">
                        Eliminar
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        // eventos de eliminar
        const removeBtns = document.querySelectorAll(".remove-item-btn");
        removeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.dataset.id, 10);
                removeFromCart(id);
            });
        });
    }

    // total
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    cartTotalSpan.textContent = total.toFixed(2);
}

// ====== MODAL DEL CARRITO ======
function openCartModal() {
    if (!cartModal) return;
    cartModal.style.display = "flex";
}

function closeCartModal() {
    if (!cartModal) return;
    cartModal.style.display = "none";
}

// ====== EVENTOS GLOBALES ======
// Toggle search bar
searchToggle.addEventListener("click", () => {
    searchBar.classList.toggle("active");
    if (searchBar.classList.contains("active")) {
        searchInput.focus();
    }
});

// Dropdown links
dropdownLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const subcategory = link.dataset.subcategory;
        if (subcategory) {
            loadCategoryProducts(subcategory);
        }
    });
});

// Search functionality
searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        searchProducts();
    }
});

// Sort
if (sortSelect) {
    sortSelect.addEventListener("change", applySortAndRender);
}

// Cart
if (cartBtn) {
    cartBtn.addEventListener("click", openCartModal);
}

if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCartModal);
}

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

// Checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        alert("¡Gracias por tu compra! 🎉\\n\\nEn una versión real, aquí se procesaría el pago.");
        cart = [];
        updateCartUI();
        closeCartModal();
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

        alert(`¡Gracias por suscribirte! 🎉\\n\\nTe enviaremos las mejores ofertas a ${email}`);
        newsletterEmail.value = "";
    });
}

// ====== INICIO ======
// Renderizar todos los productos en sus respectivas secciones
renderProducts("playeras-hombre");
renderProducts("playeras-sin-mangas-hombre");
renderProducts("calcetines");
renderProducts("blusas-mujer");
renderProducts("short-deportivo-mujer");
renderProducts("calcetines-mujer");

// updateCartUI(); // desactivado temporalmente
showSlide(0);
