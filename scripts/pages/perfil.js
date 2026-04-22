/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/perfil.js
//  ES: Página de perfil de usuario. Muestra y permite editar
//      datos personales (nombre, email, ciudad). Integra con
//      Firebase para persistencia y actualización de datos.
//  EN: User profile page. Displays and allows editing of
//      personal data (name, email, city). Integrates with
//      Firebase for data persistence and updates.
// ============================================================

// ES: Referencias a elementos del DOM para el formulario y datos de perfil.
// EN: References to DOM elements for form and profile data.
const form = document.getElementById("profileForm");
const nameInput = document.getElementById("profileName");
const emailInput = document.getElementById("profileEmail");
const cityInput = document.getElementById("profileCity");
const birthdateInput = document.getElementById("profileBirthdate");
const phoneCountryInput = document.getElementById("profilePhoneCountry");
const phoneCountryButton = document.getElementById("profilePhoneCountryButton");
const phoneCountryFlag = document.getElementById("profilePhoneFlag");
const phoneCountryCodeLabel = document.getElementById("profilePhoneCodeLabel");
const phoneCountryMenu = document.getElementById("profilePhoneCountryMenu");
const phoneCountryList = document.getElementById("profilePhoneCountryList");
const phoneInput = document.getElementById("profilePhone");
const streetInput = document.getElementById("profileStreet");
const coloniaInput = document.getElementById("profileColonia");
const stateInput = document.getElementById("profileState");
const zipInput = document.getElementById("profileZip");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profilePageTitle = document.getElementById("profilePageTitle");
const profileGreetingTitle = document.getElementById("profileGreetingTitle");
const profileEmailPill = document.getElementById("profileEmailPill");
const profileCityPill = document.getElementById("profileCityPill");
const profileBirthdatePill = document.getElementById("profileBirthdatePill");
const profilePhonePill = document.getElementById("profilePhonePill");
const profileStreetPill = document.getElementById("profileStreetPill");
const profileColoniaPill = document.getElementById("profileColoniaPill");
const profileStatePill = document.getElementById("profileStatePill");
const profileZipPill = document.getElementById("profileZipPill");
const profileStatsPill = document.getElementById("profileStatsPill");
const profileRecommendations = document.getElementById("profileRecommendations");
const profileQuickProducts = document.getElementById("profileQuickProducts");
const profileConfirmModal = document.getElementById("profileConfirmModal");
const profileConfirmKicker = document.getElementById("profileConfirmKicker");
const profileConfirmTitle = document.getElementById("profileConfirmTitle");
const profileConfirmMessage = document.getElementById("profileConfirmMessage");
const profileConfirmInputWrap = document.getElementById("profileConfirmInputWrap");
const profileConfirmInput = document.getElementById("profileConfirmInput");
const profileConfirmInputHint = document.getElementById("profileConfirmInputHint");
const profileConfirmAccept = document.getElementById("profileConfirmAccept");
const profileConfirmCancel = document.getElementById("profileConfirmCancel");
const profileSavedModal = document.getElementById("profileSavedModal");
const profileSavedTitle = document.getElementById("profileSavedTitle");
const profileSavedMessage = document.getElementById("profileSavedMessage");
const profileSavedAccept = document.getElementById("profileSavedAccept");
const profileSavedCancel = document.getElementById("profileSavedCancel");

if (profileConfirmModal) {
    profileConfirmModal.hidden = true;
    profileConfirmModal.setAttribute("aria-hidden", "true");
}

if (profileSavedModal) {
    profileSavedModal.hidden = true;
    profileSavedModal.setAttribute("aria-hidden", "true");
}

const firebaseConfig = {
    apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
    authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
    projectId: "smuckys-by-chavamon-loginregis",
    storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
    messagingSenderId: "185108836763",
    appId: "1:185108836763:web:d7b923507c3c32e28e313e"
};

// ES: URL por defecto si falta imagen de producto.
// EN: Default image URL if product image is missing.
const DEFAULT_PRODUCT_IMAGE = "../LOGO DE LA EMPRESA/La-pura-letra-logo.png";

const PHONE_COUNTRIES = [
    { iso: "MX", code: "+52", name: "Mexico" },
    { iso: "US", code: "+1", name: "Estados Unidos" },
    { iso: "CA", code: "+1", name: "Canada" },
    { iso: "AR", code: "+54", name: "Argentina" },
    { iso: "BO", code: "+591", name: "Bolivia" },
    { iso: "BR", code: "+55", name: "Brasil" },
    { iso: "CL", code: "+56", name: "Chile" },
    { iso: "CO", code: "+57", name: "Colombia" },
    { iso: "CR", code: "+506", name: "Costa Rica" },
    { iso: "EC", code: "+593", name: "Ecuador" },
    { iso: "SV", code: "+503", name: "El Salvador" },
    { iso: "ES", code: "+34", name: "España" },
    { iso: "GT", code: "+502", name: "Guatemala" },
    { iso: "HN", code: "+504", name: "Honduras" },
    { iso: "NI", code: "+505", name: "Nicaragua" },
    { iso: "PA", code: "+507", name: "Panama" },
    { iso: "PY", code: "+595", name: "Paraguay" },
    { iso: "PE", code: "+51", name: "Peru" },
    { iso: "DO", code: "+1", name: "Republica Dominicana" },
    { iso: "UY", code: "+598", name: "Uruguay" },
    { iso: "VE", code: "+58", name: "Venezuela" }
];

// ES: Productos por defecto en caso de que Firestore no responda.
//     Se usan como fallback para garantizar datos en la página.
// EN: Default products in case Firestore doesn't respond.
//     Used as fallback to guarantee data on the page.
const fallbackProducts = [
    { id: 1, nombre_prod: "Playera Premium Azul Claro", precio: 150, stock: 20, url_imagen: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera_azul-claro.png", categoria: "playeras_hombre" },
    { id: 2, nombre_prod: "Playera Premium Roja", precio: 150, stock: 22, url_imagen: "Imagenes de ropa/Ropa de Hombre/Playera Premium/Playera_Rojo.png", categoria: "playeras_hombre" },
    { id: 3, nombre_prod: "Playera Sin Mangas Gris", precio: 70, stock: 18, url_imagen: "Imagenes de ropa/Ropa de Hombre/Playera sin mangas/Playera_sin_mangas.png", categoria: "playeras_sin_mangas_hombre" },
    { id: 4, nombre_prod: "Blusa Premium Rosa", precio: 60, stock: 24, url_imagen: "Imagenes de ropa/Ropa de Mujer/Blusa/Blusa-rosa.png", categoria: "blusas_mujer" },
    { id: 5, nombre_prod: "Short Deportivo Negro", precio: 150, stock: 15, url_imagen: "Imagenes de ropa/Ropa de Mujer/Short deportivo/Short_deportiva_negro_-frente_1_-removebg-preview.png", categoria: "short_deportivo_mujer" },
    { id: 6, nombre_prod: "Calcetines Premium", precio: 45, stock: 40, url_imagen: "Imagenes de ropa/Calcetines deportivo/Calcetines deportivo_Rosa_azul_dama.png", categoria: "calcetines" }
];

// ES: Normaliza y corrige la ruta de imagen, agregando ../ si es necesario
//     para las imágenes locales relativas.
// EN: Normalizes and corrects the image path, adding ../ if necessary
//     for relative local images.
function normalizeImage(src) {
    if (!src) return DEFAULT_PRODUCT_IMAGE;
    if (/^(http|data:|\.\.\/|\/)/.test(src)) return src;
    return `../${src}`;
}

// ES: Normaliza los datos de un producto asegurando que tenga nombre, precio
//     e imagen válidos. Sirve para homogenizar productos de diferentes fuentes.
// EN: Normalizes product data ensuring it has valid name, price,
//     and image. Serves to homogenize products from different sources.
function sanitizeProduct(rawProduct) {
    const nombre = String(rawProduct?.nombre_prod || rawProduct?.name || "").trim();
    const precio = Number(rawProduct?.precio ?? rawProduct?.price ?? rawProduct?.precio_unitario ?? 0);
    return {
        ...rawProduct,
        nombre_prod: nombre,
        precio: Number.isFinite(precio) ? precio : 0,
        url_imagen: normalizeImage(rawProduct?.url_imagen || rawProduct?.image || rawProduct?.imagen || "")
    };
}

// ES: Convierte un producto raw a formato compatible con checkout, normalizando
//     todos los campos de nombre, precio, imagen y ID.
// EN: Converts a raw product to checkout-compatible format, normalizing
//     all fields for name, price, image, and ID.
function toCheckoutProduct(rawProduct) {
    return {
        id: rawProduct.id_local || rawProduct.firestoreId || rawProduct.id,
        firestoreId: rawProduct.firestoreId || rawProduct.id,
        name: rawProduct.nombre_prod || rawProduct.name,
        nombre_prod: rawProduct.nombre_prod || rawProduct.name,
        price: Number(rawProduct.precio || rawProduct.price || 0),
        precio: Number(rawProduct.precio || rawProduct.price || 0),
        stock: Number(rawProduct.stock || 0),
        image: normalizeImage(rawProduct.url_imagen || rawProduct.image || ""),
        qty: 1
    };
}

// ES: Redirige el usuario a la página de checkout con un producto específico.
//     Guarda el producto en sessionStorage para que checkout.js lo recupere.
// EN: Redirects the user to the checkout page with a specific product.
//     Saves the product in sessionStorage for checkout.js to retrieve.
function buyNow(rawProduct) {
    const checkoutProduct = toCheckoutProduct(rawProduct);
    sessionStorage.setItem("smucky_checkout_product", JSON.stringify(checkoutProduct));
    sessionStorage.setItem("smucky_checkout_context", JSON.stringify({ mode: "single", items: [checkoutProduct] }));
    window.location.href = "../paginas/checkout.html";
}

// ES: Normaliza el nombre del usuario, aplicando mayúscula inicial y tratamientos
//     especiales para nombres como José y Chavamon. Retorna "Cliente" si está vacío.
// EN: Normalizes user name, applying initial capitalization and special treatments
//     for names like José and Chavamon. Returns "Cliente" if empty.
function normalizeProfileName(rawName) {
    const cleaned = String(rawName || "").trim().replace(/\s+/g, " ");
    if (!cleaned) return "Cliente";
    return cleaned; // devuelve el nombre tal cual, sin modificar nada
}

function normalizeBirthdate(rawDate) {
    const value = String(rawDate || "").trim();
    if (!value) return "";

    const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
        return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]}`;
    }

    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length < 8) return value;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function formatBirthdateTyping(rawDate) {
    const digits = String(rawDate || "").replace(/\D/g, "").slice(0, 8);
    if (!digits) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function escapeRegExp(text) {
    return String(text || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeColonia(rawColonia) {
    const value = String(rawColonia || "").trim().replace(/\s+/g, " ");
    if (!value) return "";
    return value.replace(/^(colonia|col\.?)+\s*/i, "").trim();
}

function normalizeStreet(rawStreet, colonia) {
    let street = String(rawStreet || "").trim().replace(/\s+/g, " ");
    if (!street) return "";

    const normalizedColonia = normalizeColonia(colonia);
    if (normalizedColonia) {
        const dupColoniaRegex = new RegExp(`(?:,?\\s*)colonia\\s+${escapeRegExp(normalizedColonia)}\\b`, "ig");
        street = street.replace(dupColoniaRegex, "").trim();
    }

    return street.replace(/[\s,.-]+$/, "").trim();
}

function getPhoneCountryByIso(iso) {
    return PHONE_COUNTRIES.find((item) => item.iso === String(iso || "").toUpperCase()) || PHONE_COUNTRIES[0];
}

function getFlagUrlByIso(iso) {
    return `https://flagcdn.com/24x18/${String(iso || "mx").toLowerCase()}.png`;
}

function getFlagImageMarkup(iso, label) {
    return `<img src="${getFlagUrlByIso(iso)}" alt="${escapeHtml(label)}" class="phone-flag-image" loading="lazy">`;
}

function closePhoneCountryMenu() {
    if (!phoneCountryMenu || !phoneCountryButton) return;
    phoneCountryMenu.hidden = true;
    phoneCountryButton.setAttribute("aria-expanded", "false");
}

function openPhoneCountryMenu() {
    if (!phoneCountryMenu || !phoneCountryButton) return;
    phoneCountryMenu.hidden = false;
    phoneCountryButton.setAttribute("aria-expanded", "true");
}

function renderPhoneCountryOptions() {
    if (!phoneCountryList) return;
    phoneCountryList.innerHTML = PHONE_COUNTRIES.map((country) => `
        <button type="button" class="phone-country-option" data-iso="${country.iso}" role="option" aria-selected="false">
            <span class="phone-country-option-flag">${getFlagImageMarkup(country.iso, `Bandera de ${country.name}`)}</span>
            <strong class="phone-country-option-name">${escapeHtml(country.name)}</strong>
            <small class="phone-country-option-code">${escapeHtml(country.code)}</small>
        </button>
    `).join("");
}

function syncPhoneFlag(iso) {
    if (!phoneCountryInput) return;
    const country = getPhoneCountryByIso(iso);
    const countryName = country.name || country.iso;
    phoneCountryInput.value = country.iso;
    if (phoneCountryFlag) {
        phoneCountryFlag.innerHTML = getFlagImageMarkup(country.iso, `Bandera de ${countryName}`);
        phoneCountryFlag.setAttribute("aria-label", `Bandera de ${countryName}`);
        phoneCountryFlag.title = countryName;
    }
    if (phoneCountryCodeLabel) {
        phoneCountryCodeLabel.textContent = country.code;
    }
    if (phoneCountryButton) {
        phoneCountryButton.setAttribute("aria-label", `Pais del telefono: ${countryName} ${country.code}`);
        phoneCountryButton.title = `${countryName} ${country.code}`;
    }
    if (phoneCountryList) {
        phoneCountryList.querySelectorAll("[data-iso]").forEach((item) => {
            const selected = item.getAttribute("data-iso") === country.iso;
            item.setAttribute("aria-selected", selected ? "true" : "false");
            item.classList.toggle("is-selected", selected);
        });
    }
    phoneCountryInput.setAttribute("aria-label", `Pais del telefono: ${countryName}`);
}

function parsePhoneFromUser(user) {
    const countryIso = String(user?.telefono_pais || "MX").toUpperCase();
    const country = getPhoneCountryByIso(countryIso);
    const explicitCode = String(user?.telefono_codigo || "").trim();
    const explicitNumber = String(user?.telefono_numero || "").trim();

    if (explicitNumber) {
        return {
            iso: country.iso,
            code: explicitCode || country.code,
            number: explicitNumber
        };
    }

    const rawPhone = String(user?.telefono || "").trim();
    if (!rawPhone) {
        return {
            iso: country.iso,
            code: explicitCode || country.code,
            number: ""
        };
    }

    const parsed = rawPhone.match(/^(\+\d{1,4})\s*(.*)$/);
    if (!parsed) {
        return {
            iso: country.iso,
            code: explicitCode || country.code,
            number: rawPhone
        };
    }

    const matchedCode = parsed[1];
    const byCode = PHONE_COUNTRIES.find((item) => item.code === matchedCode) || country;
    return {
        iso: byCode.iso,
        code: matchedCode,
        number: String(parsed[2] || "").trim()
    };
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const PROFILE_PILL_ICONS = {
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Zm1.7-.56 5.6 4.2a1.2 1.2 0 0 0 1.4 0l5.6-4.2"/></svg>',
    city: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16M6.5 19V9.5L12 6l5.5 3.5V19M9 19v-4h6v4M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>',
    birthday: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Zm5-5c0 1.2-.8 2-2 2S8 6.2 8 5s.8-2 2-2 2 .8 2 2Zm4 1c-1.2 0-2-.8-2-2s.8-2 2-2 2 .8 2 2-.8 2-2 2ZM12 10V7M9 10V8.5M15 10V8.5"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 4h2l1.2 3.4-1.5 1.3a14.3 14.3 0 0 0 5.1 5.1l1.3-1.5L20 13.5v2a1.8 1.8 0 0 1-2 1.8A15.8 15.8 0 0 1 6.7 6 1.8 1.8 0 0 1 8.5 4Z"/></svg>',
    street: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M6 10.5V20h12v-9.5M10 20v-5h4v5"/></svg>',
    colonia: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-5-4.6-5-9a5 5 0 1 1 10 0c0 4.4-5 9-5 9Zm0-7.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>',
    state: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 20h12M7 20V9l5-3 5 3v11M9.5 11.5h.01M12 11.5h.01M14.5 11.5h.01M9.5 14.5h.01M12 14.5h.01M14.5 14.5h.01"/></svg>',
    zip: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h10M8 5v14M16 5v14M7 19h10M10 9h4M10 12h4M10 15h4"/></svg>',
    stats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18V9M12 18V6M18 18v-4M4 18h16"/></svg>'
};

function renderProfilePill(target, iconMarkup, label, value, tone = "default") {
    if (!target) return;
    target.className = `profile-pill profile-pill-${tone}`;
    const safeLabel = String(label || "").trim();
    const labelMarkup = safeLabel ? `<strong>${escapeHtml(safeLabel)}:</strong> ` : "";
    target.innerHTML = `<span class="pill-icon" aria-hidden="true">${iconMarkup}</span>${labelMarkup}${escapeHtml(value)}`;
}

// ES: Llena los campos del perfil con datos del usuario autenticado. Muestra como
//     tarjetas su info (correo, ciudad) y estadísticas (favoritos, carrito).
// EN: Fills profile fields with authenticated user data. Displays as
//     cards their info (email, city) and statistics (favorites, cart).
function hydrateProfile(user) {
    if (!user) return;

    const nombre = normalizeProfileName(user.nombre || user.name || "Cliente");
    const email = user.email || "--";
    const ciudad = user.ciudad || user.city || "Sin ciudad";
    const cumpleanos = normalizeBirthdate(user.fecha_cumpleanos || user.fecha_nacimiento || user.birthdate || "");
    const calleLimpia = normalizeStreet(user.calle || "", user.colonia || "");
    const coloniaLimpia = normalizeColonia(user.colonia || "");
    const calle = calleLimpia || "--";
    const colonia = coloniaLimpia || "--";
    const estado = user.estado || "--";
    const cp = user.cp || "--";
    const phoneData = parsePhoneFromUser(user);
    const telefonoResumen = phoneData.number ? `${phoneData.code} ${phoneData.number}` : "--";
    const favCount = (JSON.parse(localStorage.getItem("smucky_favorites") || "[]") || []).length;
    const cartCount = (JSON.parse(localStorage.getItem("smucky_cart") || "[]") || []).length;

    if (nameInput) nameInput.value = nombre;
    if (emailInput) emailInput.value = email;
    if (cityInput) cityInput.value = user.ciudad || user.city || "";
    if (birthdateInput) birthdateInput.value = cumpleanos;
    if (phoneCountryInput) phoneCountryInput.value = phoneData.iso;
    syncPhoneFlag(phoneData.iso);
    if (phoneInput) phoneInput.value = phoneData.number;
    if (streetInput) streetInput.value = calleLimpia;
    if (coloniaInput) coloniaInput.value = coloniaLimpia;
    if (stateInput) stateInput.value = user.estado || "";
    if (zipInput) zipInput.value = user.cp || "";

    if (profilePageTitle) profilePageTitle.textContent = "Zona personal";
    if (profileGreetingTitle) profileGreetingTitle.textContent = `${nombre}, este es tu espacio personal`;
    renderProfilePill(profileEmailPill, PROFILE_PILL_ICONS.email, "Correo", email, "email");
    renderProfilePill(profileCityPill, PROFILE_PILL_ICONS.city, "Ciudad", ciudad, "city");
    renderProfilePill(profileBirthdatePill, PROFILE_PILL_ICONS.birthday, "Cumpleaños", cumpleanos || "--", "birthday");
    renderProfilePill(profilePhonePill, PROFILE_PILL_ICONS.phone, "Telefono", telefonoResumen, "phone");
    renderProfilePill(profileStreetPill, PROFILE_PILL_ICONS.street, "Calle", calle, "street");
    renderProfilePill(profileColoniaPill, PROFILE_PILL_ICONS.colonia, "Colonia", colonia, "colonia");
    renderProfilePill(profileStatePill, PROFILE_PILL_ICONS.state, "Estado", estado, "state");
    renderProfilePill(profileZipPill, PROFILE_PILL_ICONS.zip, "CP", cp, "zip");
    renderProfilePill(profileStatsPill, PROFILE_PILL_ICONS.stats, "", `Favoritos ${favCount} | Carrito ${cartCount}`, "stats");
}

// ES: Obtiene productos de Firestore. Si no disponibles, usa fallback local.
//     Elimina duplicados por nombre y filtra productos inválidos.
// EN: Gets products from Firestore. If unavailable, uses local fallback.
//     Removes duplicates by name and filters out invalid products.
async function getSmuckyProducts() {
    const cleanFallback = fallbackProducts
        .map(sanitizeProduct)
        .filter((p) => p.nombre_prod && p.precio > 0);

    try {
        if (typeof window.cargarProductosDesdeFirestore === "function") {
            const cloudProducts = await window.cargarProductosDesdeFirestore();
            if (Array.isArray(cloudProducts) && cloudProducts.length) {
                const cleanCloud = cloudProducts
                    .map(sanitizeProduct)
                    .filter((p) => p.nombre_prod && p.precio > 0);
                if (cleanCloud.length) {
                    const seen = new Set(cleanCloud.map((p) => p.nombre_prod));
                    return [...cleanCloud, ...cleanFallback.filter((p) => !seen.has(p.nombre_prod))];
                }
            }
        }
    } catch (error) {
        console.warn("No se pudieron cargar productos desde Firestore:", error);
    }
    return cleanFallback;
}

// ES: Renderiza tarjetas de productos recomendados y lista rápida de compra.
//     Filtra productos inválidos y agrupa en 2 secciones (6 y 10 productos).
// EN: Renders recommended product cards and quick purchase list.
//     Filters invalid products and groups in 2 sections (6 and 10 products).
function renderRecommendations(products) {
    if (!profileRecommendations || !profileQuickProducts) return;

    const validProducts = products
        .map((product) => ({ raw: product, checkout: toCheckoutProduct(product) }))
        .filter((entry) => entry.checkout.name && entry.checkout.price > 0);

    if (!validProducts.length) {
        profileRecommendations.innerHTML = "<p>No pudimos cargar recomendaciones por ahora.</p>";
        profileQuickProducts.innerHTML = "";
        return;
    }

    const picks = validProducts.slice(0, 6);
    profileRecommendations.innerHTML = picks.map((entry, index) => {
        const p = entry.checkout;
        const product = entry.raw;
        return `
            <article class="profile-product-card">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_PRODUCT_IMAGE}'">
                <div class="profile-product-meta">
                    <h4>${p.name}</h4>
                    <p>${product.categoria || "coleccion Smucky"}</p>
                    <p class="profile-product-price">$${p.price.toFixed(2)} MXN</p>
                    <button class="profile-buy-btn" data-buy-index="${index}">Comprar ahora</button>
                </div>
            </article>
        `;
    }).join("");

    const quick = validProducts.slice(0, 10);
    profileQuickProducts.innerHTML = quick.map((entry, index) => {
        const p = entry.checkout;
        return `
            <article class="quick-item">
                <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_PRODUCT_IMAGE}'">
                <div class="quick-item-body">
                    <p class="quick-item-title">${p.name}</p>
                    <p class="quick-item-price">$${p.price.toFixed(2)}</p>
                    <button data-quick-buy-index="${index}">Comprar</button>
                </div>
            </article>
        `;
    }).join("");

    profileRecommendations.onclick = (event) => {
        const btn = event.target.closest("[data-buy-index]");
        if (!btn) return;
        const idx = Number(btn.dataset.buyIndex);
        if (Number.isInteger(idx) && picks[idx]) buyNow(picks[idx].raw);
    };

    profileQuickProducts.onclick = (event) => {
        const btn = event.target.closest("[data-quick-buy-index]");
        if (!btn) return;
        const idx = Number(btn.dataset.quickBuyIndex);
        if (Number.isInteger(idx) && quick[idx]) buyNow(quick[idx].raw);
    };
}

// ES: Inicializa la página de perfil: sincroniza con  Firebase, carga usuario
//     actual, rellena los campos, obtiene productos y renderiza recomendaciones.
// EN: Initializes the profile page: syncs with Firebase, loads current user,
//     fills fields, gets products, and renders recommendations.
async function initProfile() {
    if (window.SmuckyAuth?.ready) {
        await window.SmuckyAuth.ready;
    }

    const user = window.SmuckyAuth ? window.SmuckyAuth.getCurrentUser() : null;
    if (!user) {
        window.SmuckyAuth?.redirectToLogin();
        return;
    }

    hydrateProfile(user);
    const products = await getSmuckyProducts();
    renderRecommendations(products);
}

const params = new URLSearchParams(window.location.search);
const editMode = params.get("mode") === "edit";

if (editMode && nameInput) {
    nameInput.focus();
}

phoneCountryInput?.addEventListener("change", () => {
    syncPhoneFlag(phoneCountryInput.value);
});

phoneCountryButton?.addEventListener("click", () => {
    if (phoneCountryMenu?.hidden) openPhoneCountryMenu();
    else closePhoneCountryMenu();
});

phoneCountryList?.addEventListener("click", (event) => {
    const option = event.target.closest("[data-iso]");
    if (!option || !phoneCountryInput) return;
    phoneCountryInput.value = option.getAttribute("data-iso") || "MX";
    syncPhoneFlag(phoneCountryInput.value);
    closePhoneCountryMenu();
    phoneInput?.focus();
});

document.addEventListener("click", (event) => {
    if (!phoneCountryMenu || !phoneCountryButton) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (phoneCountryMenu.hidden) return;
    if (phoneCountryMenu.contains(target) || phoneCountryButton.contains(target)) return;
    closePhoneCountryMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closePhoneCountryMenu();
});

birthdateInput?.addEventListener("input", () => {
    birthdateInput.value = formatBirthdateTyping(birthdateInput.value);
});

renderPhoneCountryOptions();
syncPhoneFlag(phoneCountryInput?.value || "MX");

initProfile();

function clearSmuckyData() {
    window.SmuckyAuth?.clearUser?.();

    Object.keys(localStorage)
        .filter((key) => key.startsWith("smucky_"))
        .forEach((key) => localStorage.removeItem(key));

    Object.keys(sessionStorage)
        .filter((key) => key.startsWith("smucky_"))
        .forEach((key) => sessionStorage.removeItem(key));
}

async function getFirebaseAuthContext() {
    const [{ initializeApp, getApps }, { getAuth }] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
    ]);

    const app = getApps().find((item) => item.name === "auth-app")
        || initializeApp(firebaseConfig, "auth-app");
    const auth = getAuth(app);
    return { auth };
}

async function signOutFirebaseSession() {
    if (typeof window.firebase?.auth === "function") {
        try {
            await window.firebase.auth().signOut();
            return;
        } catch (error) {
            console.warn("Error al cerrar sesión con Firebase compat:", error);
        }
    }

    try {
        const [{ auth }, { signOut }] = await Promise.all([
            getFirebaseAuthContext(),
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
        ]);
        await signOut(auth);
    } catch (error) {
        console.warn("Error al cerrar sesión con Firebase modular:", error);
    }
}

async function deleteFirebaseAccount() {
    try {
        const [{ auth }, { deleteUser }] = await Promise.all([
            getFirebaseAuthContext(),
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
        ]);

        if (!auth.currentUser) {
            return { deleted: false, reason: "no-user" };
        }

        await deleteUser(auth.currentUser);
        return { deleted: true };
    } catch (error) {
        return { deleted: false, reason: error?.code || "unknown", error };
    }
}

function showProfileConfirmDialog({
    title,
    message,
    acceptText = "Aceptar",
    cancelText = "Cancelar",
    requiredText = ""
}) {
    if (!profileConfirmModal || !profileConfirmAccept || !profileConfirmCancel) {
        if (!requiredText) return Promise.resolve(confirm(message));
        const typed = prompt(message);
        return Promise.resolve((typed || "").trim().toLowerCase() === String(requiredText).trim().toLowerCase());
    }

    const currentUser = window.SmuckyAuth?.getCurrentUser?.();
    const profileName = normalizeProfileName(currentUser?.nombre || currentUser?.name || "");
    if (profileConfirmKicker) {
        profileConfirmKicker.textContent = profileName && profileName !== "Cliente"
            ? `Confirmación de ${profileName}`
            : "Confirmación de perfil";
    }

    profileConfirmTitle.textContent = title;
    profileConfirmMessage.textContent = message;
    profileConfirmAccept.textContent = acceptText;
    profileConfirmCancel.textContent = cancelText;

    const required = String(requiredText || "").trim();
    const requiredNormalized = required.toLowerCase();
    const needsTypedWord = Boolean(requiredNormalized);

    if (profileConfirmInputWrap && profileConfirmInput && profileConfirmInputHint) {
        profileConfirmInputWrap.hidden = !needsTypedWord;
        if (needsTypedWord) {
            profileConfirmInput.value = "";
            profileConfirmInput.placeholder = required;
            profileConfirmInputHint.textContent = `Debes escribir exactamente ${required}.`;
            profileConfirmAccept.disabled = true;
        } else {
            profileConfirmAccept.disabled = false;
        }
    }

    profileConfirmModal.hidden = false;
    profileConfirmModal.setAttribute("aria-hidden", "false");

    return new Promise((resolve) => {
        const closeWith = (accepted) => {
            cleanup();
            profileConfirmModal.hidden = true;
            profileConfirmModal.setAttribute("aria-hidden", "true");
            if (profileConfirmInput) profileConfirmInput.value = "";
            resolve(accepted);
        };

        const onAccept = () => {
            if (needsTypedWord && profileConfirmInput) {
                const typed = profileConfirmInput.value.trim().toLowerCase();
                if (typed !== requiredNormalized) {
                    profileConfirmInput.focus();
                    return;
                }
            }
            closeWith(true);
        };

        const onCancel = () => closeWith(false);
        const onBackdrop = (event) => {
            if (event.target === profileConfirmModal) closeWith(false);
        };
        const onEscape = (event) => {
            if (event.key === "Escape") closeWith(false);
        };
        const onInput = () => {
            if (!needsTypedWord || !profileConfirmInput) return;
            const typed = profileConfirmInput.value.trim().toLowerCase();
            profileConfirmAccept.disabled = typed !== requiredNormalized;
        };
        const onInputEnter = (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            if (!profileConfirmAccept.disabled) onAccept();
        };

        const cleanup = () => {
            profileConfirmAccept.removeEventListener("click", onAccept);
            profileConfirmCancel.removeEventListener("click", onCancel);
            profileConfirmModal.removeEventListener("click", onBackdrop);
            document.removeEventListener("keydown", onEscape);
            profileConfirmInput?.removeEventListener("input", onInput);
            profileConfirmInput?.removeEventListener("keydown", onInputEnter);
        };

        profileConfirmAccept.addEventListener("click", onAccept);
        profileConfirmCancel.addEventListener("click", onCancel);
        profileConfirmModal.addEventListener("click", onBackdrop);
        document.addEventListener("keydown", onEscape);
        profileConfirmInput?.addEventListener("input", onInput);
        profileConfirmInput?.addEventListener("keydown", onInputEnter);

        if (needsTypedWord && profileConfirmInput) {
            profileConfirmInput.focus();
        } else {
            profileConfirmAccept.focus();
        }
    });
}

function showProfileSavedDialog({
    title,
    message,
    acceptText = "Aceptar",
    cancelText = ""
}) {
    if (!profileSavedModal || !profileSavedAccept || !profileSavedTitle || !profileSavedMessage) {
        if (cancelText) return Promise.resolve(confirm(message || "Deseas continuar?"));
        alert(message || "Perfil actualizado correctamente.");
        return Promise.resolve(true);
    }

    profileSavedTitle.textContent = title || "Perfil actualizado";
    profileSavedMessage.textContent = message || "Perfil actualizado correctamente.";
    profileSavedAccept.textContent = acceptText;
    if (profileSavedCancel) {
        profileSavedCancel.hidden = !cancelText;
        profileSavedCancel.textContent = cancelText || "Cancelar";
    }

    profileSavedModal.hidden = false;
    profileSavedModal.setAttribute("aria-hidden", "false");

    return new Promise((resolve) => {
        const closeModal = (accepted) => {
            profileSavedAccept.removeEventListener("click", onAccept);
            profileSavedCancel?.removeEventListener("click", onCancel);
            profileSavedModal.removeEventListener("click", onBackdrop);
            document.removeEventListener("keydown", onEscape);
            profileSavedModal.hidden = true;
            profileSavedModal.setAttribute("aria-hidden", "true");
            resolve(accepted);
        };

        const onAccept = () => closeModal(true);
        const onCancel = () => closeModal(false);
        const onBackdrop = (event) => {
            if (event.target === profileSavedModal) closeModal(false);
        };
        const onEscape = (event) => {
            if (event.key === "Escape") closeModal(false);
        };

        profileSavedAccept.addEventListener("click", onAccept);
        profileSavedCancel?.addEventListener("click", onCancel);
        profileSavedModal.addEventListener("click", onBackdrop);
        document.addEventListener("keydown", onEscape);
        profileSavedAccept.focus();
    });
}

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const shouldSave = await showProfileSavedDialog({
        title: "Guardar cambios",
        message: "Deseas guardar los cambios del perfil?",
        acceptText: "Aceptar",
        cancelText: "Cancelar"
    });

    if (!shouldSave) {
        return;
    }

    const current = window.SmuckyAuth ? window.SmuckyAuth.getCurrentUser() || {} : {};
    const selectedIso = phoneCountryInput ? phoneCountryInput.value : "MX";
    const selectedCountry = getPhoneCountryByIso(selectedIso);
    const phoneNumber = phoneInput ? phoneInput.value.trim() : "";
    const phoneCode = selectedCountry.code;
    const fullPhone = phoneNumber ? `${phoneCode} ${phoneNumber}` : "";
    const normalizedBirthdate = normalizeBirthdate(birthdateInput ? birthdateInput.value : "");
    const rawColonia = coloniaInput ? coloniaInput.value.trim() : "";
    const coloniaNormalizada = normalizeColonia(rawColonia);
    const calleNormalizada = normalizeStreet(streetInput ? streetInput.value.trim() : "", coloniaNormalizada);

    const updatedProfile = {
        ...current,
        nombre:           normalizeProfileName(nameInput ? nameInput.value : ""),
        email:            emailInput ? emailInput.value.trim() : "",
        ciudad:           cityInput ? cityInput.value.trim() : "",
        fecha_cumpleanos: normalizedBirthdate,
        fecha_nacimiento: normalizedBirthdate,
        telefono:         fullPhone,
        telefono_numero:  phoneNumber,
        telefono_codigo:  phoneCode,
        telefono_pais:    selectedCountry.iso,
        calle:            calleNormalizada,
        colonia:          coloniaNormalizada,
        estado:           stateInput ? stateInput.value.trim() : "",
        cp:               zipInput ? zipInput.value.trim() : "",
        updatedAt:        new Date().toISOString()
    };

    // ES: Guarda en localStorage
    // EN: Save to localStorage
    if (window.SmuckyAuth) {
        window.SmuckyAuth.saveUser(updatedProfile);
    }

    // ES: Guarda en Firestore para que persista entre sesiones y dispositivos.
    // EN: Saves to Firestore so it persists between sessions and devices.
    try {
        const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
        const { getFirestore, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
        const firestoreApp = getApps().find(a => a.name === "auth-app") || initializeApp(firebaseConfig, "auth-app");
        const firestoreDb = getFirestore(firestoreApp);
        const uid = updatedProfile.uid || current.uid;
        if (uid) {
            await setDoc(doc(firestoreDb, "usuarios", uid), updatedProfile, { merge: true });
            console.log("✅ Perfil guardado en Firestore.");
        }
    } catch (firestoreErr) {
        console.warn("No se pudo guardar en Firestore (se guardó en localStorage):", firestoreErr);
    }

    hydrateProfile(window.SmuckyAuth?.getCurrentUser?.() || {});
    showProfileSavedDialog({
        title: "Perfil actualizado",
        message: "Perfil actualizado correctamente.",
        acceptText: "Aceptar"
    });
});

deleteAccountBtn?.addEventListener("click", async () => {
    const confirmed = await showProfileConfirmDialog({
        title: "Eliminar cuenta",
        message: "Seguro que quieres eliminar tu perfil? Se borraran tus datos guardados en este dispositivo.",
        acceptText: "Aceptar",
        cancelText: "Cancelar"
    });

    if (!confirmed) {
        return;
    }

    const confirmedByText = await showProfileConfirmDialog({
        title: "Confirmación final",
        message: "Escriba \"Eliminar\" para eliminar su cuenta.",
        acceptText: "Eliminar",
        cancelText: "Cancelar",
        requiredText: "Eliminar"
    });

    if (!confirmedByText) {
        return;
    }

    const result = await deleteFirebaseAccount();

    if (!result.deleted && result.reason === "auth/requires-recent-login") {
        alert("Para eliminar la cuenta necesitas volver a iniciar sesión y reintentar.");
        await signOutFirebaseSession();
        clearSmuckyData();
        window.location.href = "../cuenta/login.html";
        return;
    }

    clearSmuckyData();

    const finishDelete = () => {
        alert(result.deleted ? "Cuenta eliminada correctamente." : "Perfil local eliminado correctamente.");
        window.location.href = "../index.html";
    };

    if (typeof window.firebase?.auth === "function") {
        window.firebase.auth().signOut().finally(finishDelete);
        return;
    }

    finishDelete();
});

logoutBtn?.addEventListener("click", async () => {
    const shouldLogout = await showProfileSavedDialog({
        title: "Cerrar sesión",
        message: "Deseas cerrar sesión ahora?",
        acceptText: "Aceptar",
        cancelText: "Cancelar"
    });

    if (!shouldLogout) {
        return;
    }

    await signOutFirebaseSession();
    clearSmuckyData();

    await showProfileSavedDialog({
        title: "Sesión cerrada",
        message: "Sesión cerrada correctamente.",
        acceptText: "Aceptar"
    });
    window.location.href = "../index.html";
});