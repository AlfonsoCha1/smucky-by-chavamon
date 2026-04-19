/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/perfil.js
//  ES: PÃ¡gina de perfil de usuario. Muestra y permite editar
//      datos personales (nombre, email, ciudad). Integra con
//      Firebase para persistencia y actualizaciÃ³n de datos.
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

if (profileConfirmModal) {
    profileConfirmModal.hidden = true;
    profileConfirmModal.setAttribute("aria-hidden", "true");
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

// ES: Productos por defecto en caso de que Firestore no responda.
//     Se usan como fallback para garantizar datos en la pÃ¡gina.
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
//     para las imÃ¡genes locales relativas.
// EN: Normalizes and corrects the image path, adding ../ if necessary
//     for relative local images.
function normalizeImage(src) {
    if (!src) return DEFAULT_PRODUCT_IMAGE;
    if (/^(http|data:|\.\.\/|\/)/.test(src)) return src;
    return `../${src}`;
}

// ES: Normaliza los datos de un producto asegurando que tenga nombre, precio
//     e imagen vÃ¡lidos. Sirve para homogenizar productos de diferentes fuentes.
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

// ES: Redirige el usuario a la pÃ¡gina de checkout con un producto especÃ­fico.
//     Guarda el producto en sessionStorage para que checkout.js lo recupere.
// EN: Redirects the user to the checkout page with a specific product.
//     Saves the product in sessionStorage for checkout.js to retrieve.
function buyNow(rawProduct) {
    const checkoutProduct = toCheckoutProduct(rawProduct);
    sessionStorage.setItem("smucky_checkout_product", JSON.stringify(checkoutProduct));
    sessionStorage.setItem("smucky_checkout_context", JSON.stringify({ mode: "single", items: [checkoutProduct] }));
    window.location.href = "../paginas/checkout.html";
}

// ES: Normaliza el nombre del usuario, aplicando mayÃºscula inicial y tratamientos
//     especiales para nombres como JosÃ© y Chavamon. Retorna "Cliente" si estÃ¡ vacÃ­o.
// EN: Normalizes user name, applying initial capitalization and special treatments
//     for names like JosÃ© and Chavamon. Returns "Cliente" if empty.
function normalizeProfileName(rawName) {
    const cleaned = String(rawName || "").trim().replace(/\s+/g, " ");
    if (!cleaned) return "Cliente";
    return cleaned; // devuelve el nombre tal cual, sin modificar nada
}

// ES: Llena los campos del perfil con datos del usuario autenticado. Muestra como
//     tarjetas su info (correo, ciudad) y estadÃ­sticas (favoritos, carrito).
// EN: Fills profile fields with authenticated user data. Displays as
//     cards their info (email, city) and statistics (favorites, cart).
function hydrateProfile(user) {
    if (!user) return;

    const nombre = normalizeProfileName(user.nombre || user.name || "Cliente");
    const email = user.email || "--";
    const ciudad = user.ciudad || user.city || "Sin ciudad";
    const favCount = (JSON.parse(localStorage.getItem("smucky_favorites") || "[]") || []).length;
    const cartCount = (JSON.parse(localStorage.getItem("smucky_cart") || "[]") || []).length;

    if (nameInput) nameInput.value = nombre;
    if (emailInput) emailInput.value = email;
    if (cityInput) cityInput.value = user.ciudad || user.city || "";
    if (phoneInput) phoneInput.value = user.telefono || "";
    if (streetInput) streetInput.value = user.calle || "";
    if (coloniaInput) coloniaInput.value = user.colonia || "";
    if (stateInput) stateInput.value = user.estado || "";
    if (zipInput) zipInput.value = user.cp || "";

    if (profilePageTitle) profilePageTitle.textContent = `Mi Cuenta ${nombre}`;
    if (profileGreetingTitle) profileGreetingTitle.textContent = `${nombre}, este es tu espacio personal`;
    if (profileEmailPill) profileEmailPill.textContent = `Correo: ${email}`;
    if (profileCityPill) profileCityPill.textContent = `Ciudad: ${ciudad}`;
    if (profileStatsPill) profileStatsPill.textContent = `Favoritos ${favCount} | Carrito ${cartCount}`;
}

// ES: Obtiene productos de Firestore. Si no disponibles, usa fallback local.
//     Elimina duplicados por nombre y filtra productos invÃ¡lidos.
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

// ES: Renderiza tarjetas de productos recomendados y lista rÃ¡pida de compra.
//     Filtra productos invÃ¡lidos y agrupa en 2 secciones (6 y 10 productos).
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

// ES: Inicializa la pÃ¡gina de perfil: sincroniza con  Firebase, carga usuario
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
            console.warn("Error al cerrar sesiÃ³n con Firebase compat:", error);
        }
    }

    try {
        const [{ auth }, { signOut }] = await Promise.all([
            getFirebaseAuthContext(),
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
        ]);
        await signOut(auth);
    } catch (error) {
        console.warn("Error al cerrar sesiÃ³n con Firebase modular:", error);
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
            ? `ConfirmaciÃ³n de ${profileName}`
            : "ConfirmaciÃ³n de perfil";
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

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const current = window.SmuckyAuth ? window.SmuckyAuth.getCurrentUser() || {} : {};

    if (window.SmuckyAuth) {
        window.SmuckyAuth.saveUser({
            ...current,
            nombre: normalizeProfileName(nameInput ? nameInput.value : ""),
            email: emailInput ? emailInput.value.trim() : "",
            ciudad: cityInput ? cityInput.value.trim() : "",
            telefono: phoneInput ? phoneInput.value.trim() : "",
            calle: streetInput ? streetInput.value.trim() : "",
            colonia: coloniaInput ? coloniaInput.value.trim() : "",
            estado: stateInput ? stateInput.value.trim() : "",
            cp: zipInput ? zipInput.value.trim() : "",
            updatedAt: new Date().toISOString()
        });
    }

    alert("Perfil actualizado correctamente.");
    hydrateProfile(window.SmuckyAuth?.getCurrentUser?.() || {});
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
        title: "ConfirmaciÃ³n final",
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
        alert("Para eliminar la cuenta necesitas volver a iniciar sesiÃ³n y reintentar.");
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
    await signOutFirebaseSession();
    clearSmuckyData();

    alert("SesiÃ³n cerrada correctamente.");
    window.location.href = "../index.html";
});

