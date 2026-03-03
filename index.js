// ====== DATOS DE PRODUCTOS ======
const products = [
    {
        id: 1,
        name: "Playera Premium Smucky Rojo",
        category: "clothing",
        price: 299,
        rating: 4.9,
        image: "Imagenes de ropa/Playera Premium/WhatsApp Image 2026-03-02 at 7.19.14 PM.jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 2,
        name: "Playera Premium Smucky Negro",
        category: "clothing",
        price: 299,
        rating: 4.8,
        image: "Imagenes de ropa/Playera Premium/WhatsApp Image 2026-03-02 at 7.19.13 PM (1).jpg",
        featured: true,
        badge: null
    },
    {
        id: 3,
        name: "Playera Premium Performance Azul",
        category: "clothing",
        price: 289,
        rating: 4.7,
        image: "Imagenes de ropa/Playera Premium/WhatsApp Image 2026-03-02 at 7.19.13 PM (2).jpg",
        featured: true,
        badge: "sale"
    },
    {
        id: 4,
        name: "Playera Premium Edición Limitada",
        category: "clothing",
        price: 349,
        rating: 4.9,
        image: "Imagenes de ropa/Playera Premium/WhatsApp Image 2026-03-02 at 7.19.13 PM (3).jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 5,
        name: "Playera Premium White Collection",
        category: "clothing",
        price: 279,
        rating: 4.6,
        image: "Imagenes de ropa/Playera Premium/WhatsApp Image 2026-03-02 at 7.19.15 PM (2).jpg",
        featured: true,
        badge: null
    },
    {
        id: 6,
        name: "Calcetines Deportivos Premium Negro",
        category: "clothing",
        price: 149,
        rating: 4.8,
        image: "Imagenes de ropa/Calcetines deportivo/WhatsApp Image 2026-03-02 at 7.19.14 PM (3).jpg",
        featured: true,
        badge: "sale"
    },
    {
        id: 7,
        name: "Calcetines Deportivos Multicolor",
        category: "clothing",
        price: 159,
        rating: 4.7,
        image: "Imagenes de ropa/Calcetines deportivo/WhatsApp Image 2026-03-02 at 7.19.15 PM.jpg",
        featured: false,
        badge: null
    },
    {
        id: 8,
        name: "Calcetines Premium Pack Completo",
        category: "clothing",
        price: 169,
        rating: 4.9,
        image: "Imagenes de ropa/Calcetines deportivo/WhatsApp Image 2026-03-02 at 7.19.15 PM (1).jpg",
        featured: false,
        badge: null
    },
    {
        id: 9,
        name: "Playera Sin Mangas Smucky",
        category: "clothing",
        price: 199,
        rating: 4.8,
        image: "Imagenes de ropa/Playera sin mangas/WhatsApp Image 2026-03-02 at 7.19.15 PM (3).jpg",
        featured: true,
        badge: "new"
    },
    {
        id: 10,
        name: "Blusa Premium Smucky Dama",
        category: "clothing",
        price: 329,
        rating: 4.9,
        image: "Imagenes de ropa/Blusa/1.jpg",
        featured: true,
        badge: "sale"
    }
];

// ====== REFERENCIAS A ELEMENTOS DEL DOM ======
const productsGrid = document.getElementById("productsGrid");
const featuredGrid = document.getElementById("featuredGrid");
const navLinks = document.querySelectorAll(".main-nav .nav-link");
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

// ====== ESTADO ======
let currentCategory = "all";
let filteredProducts = [...products];
let cart = [];
let currentSlide = 0;

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

// ====== RENDER DE PRODUCTOS ======
function renderProducts(list, container = productsGrid) {
    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: #666;'>No se encontraron productos.</p>";
        return;
    }

    list.forEach(product => {
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
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-rating">⭐ ${product.rating.toFixed(1)} / 5.0</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Agregar
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    attachAddToCartEvents();
}

// Render Featured Products
function renderFeaturedProducts() {
    const featured = products.filter(p => p.featured);
    renderProducts(featured, featuredGrid);
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
    currentCategory = category;
    searchInput.value = ""; // limpia búsqueda

    if (category === "all") {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(p => p.category === category);
    }

    applySortAndRender();
}

// ====== BÚSQUEDA ======
function searchProducts() {
    const term = searchInput.value.trim().toLowerCase();

    if (term === "") {
        // si está vacío, mostrar según categoría actual
        filterByCategory(currentCategory);
        return;
    }

    filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(term)
    );

    applySortAndRender();
}

// ====== ORDENAMIENTO ======
function applySortAndRender() {
    let list = [...filteredProducts];

    switch (sortSelect.value) {
        case "price-low":
            list.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            list.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            list.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // "Más relevante": sin ordenar especial, solo por id
            list.sort((a, b) => a.id - b.id);
            break;
    }

    renderProducts(list);
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
    cartModal.style.display = "flex";
}

function closeCartModal() {
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

// Nav links
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        const category = link.dataset.category || "all";
        filterByCategory(category);
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
sortSelect.addEventListener("change", applySortAndRender);

// Cart
cartBtn.addEventListener("click", openCartModal);
closeCartBtn.addEventListener("click", closeCartModal);

window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

// Checkout
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

// Newsletter
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

// ====== INICIO ======
renderFeaturedProducts();
filterByCategory("all");
updateCartUI();
showSlide(0);
