/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/carrito-favoritos.js
//
//  QUÉ HACE: Servicio compartido de carrito y favoritos.
//    - Todas las páginas (index, checkout, pedidos, perfil) usan
//      las mismas funciones para leer y escribir carrito/favoritos.
//    - Los cambios se sincronizan en tiempo real entre pestañas
//      usando el evento "storage" de localStorage.
//    - Cada usuario tiene su propio carrito y favoritos (por uid).
//
//  CÓMO USARLO EN CUALQUIER PÁGINA:
//    window.SmuckyCart.getCart()           → array de items
//    window.SmuckyCart.addItem(item)       → agrega o suma cantidad
//    window.SmuckyCart.removeItem(id)      → quita un producto
//    window.SmuckyCart.updateQty(id, qty)  → cambia cantidad
//    window.SmuckyCart.clearCart()         → vacía el carrito
//    window.SmuckyCart.getCount()          → total de unidades
//
//    window.SmuckyFavs.getFavs()           → array de favoritos
//    window.SmuckyFavs.toggle(item)        → agrega o quita
//    window.SmuckyFavs.isFav(id)           → true/false
//    window.SmuckyFavs.clearFavs()         → vacía favoritos
//    window.SmuckyFavs.getCount()          → número de favoritos
//
//  EVENTOS (escúchalos con window.addEventListener):
//    "smucky:cart-changed"    → el carrito cambió (detail: { cart })
//    "smucky:favs-changed"    → favoritos cambiaron (detail: { favs })
// ============================================================

(function () {
    // ── Claves por usuario ───────────────────────────────────
    function getUid() {
        return window.SmuckyAuth?.getCurrentUser?.()?.uid || "guest";
    }
    function cartKey() { return `smucky_cart_${getUid()}`; }
    function favKey()  { return `smucky_favorites_${getUid()}`; }

    // ── Lectura / escritura base ─────────────────────────────
    function readCart() {
        try { return JSON.parse(localStorage.getItem(cartKey()) || "[]"); }
        catch { return []; }
    }
    function readFavs() {
        try { return JSON.parse(localStorage.getItem(favKey()) || "[]"); }
        catch { return []; }
    }
    function writeCart(cart) {
        localStorage.setItem(cartKey(), JSON.stringify(cart));
        // ES: Dispara evento para que todas las páginas abiertas se actualicen.
        // EN: Fires event so all open pages update themselves.
        window.dispatchEvent(new CustomEvent("smucky:cart-changed", { detail: { cart } }));
    }
    function writeFavs(favs) {
        localStorage.setItem(favKey(), JSON.stringify(favs));
        window.dispatchEvent(new CustomEvent("smucky:favs-changed", { detail: { favs } }));
    }

    // ── Sincronización entre pestañas ────────────────────────
    // ES: Cuando otra pestaña modifica localStorage, dispara los eventos aquí también.
    // EN: When another tab modifies localStorage, fires the events here too.
    window.addEventListener("storage", (e) => {
        if (e.key === cartKey()) {
            const cart = readCart();
            window.dispatchEvent(new CustomEvent("smucky:cart-changed", { detail: { cart } }));
        }
        if (e.key === favKey()) {
            const favs = readFavs();
            window.dispatchEvent(new CustomEvent("smucky:favs-changed", { detail: { favs } }));
        }
    });

    // ── API del Carrito ──────────────────────────────────────
    window.SmuckyCart = {

        getCart() {
            return readCart();
        },

        getCount() {
            return readCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
        },

        // ES: Agrega un producto al carrito. Si ya existe, suma la cantidad.
        // EN: Adds a product to the cart. If it already exists, adds the quantity.
        addItem(item) {
            const cart = readCart();
            const idx = cart.findIndex(i => String(i.id) === String(item.id));
            if (idx >= 0) {
                const max = Number(item.stock || cart[idx].stock || 99);
                cart[idx].qty = Math.min(max, (Number(cart[idx].qty) || 1) + (Number(item.qty) || 1));
            } else {
                cart.push({
                    id:          String(item.id),
                    firestoreId: item.firestoreId || null,
                    name:        item.name        || "",
                    price:       Number(item.price) || 0,
                    qty:         Number(item.qty)   || 1,
                    image:       item.image        || "",
                    stock:       Number(item.stock) || 99,
                    gallery:     Array.isArray(item.gallery) ? item.gallery : []
                });
            }
            writeCart(cart);
        },

        // ES: Elimina un producto del carrito por su id local.
        // EN: Removes a product from the cart by its local id.
        removeItem(id) {
            const cart = readCart().filter(i => String(i.id) !== String(id));
            writeCart(cart);
        },

        // ES: Actualiza la cantidad de un producto. Si qty <= 0 lo elimina.
        // EN: Updates the quantity of a product. If qty <= 0, removes it.
        updateQty(id, qty) {
            let cart = readCart();
            if (qty <= 0) {
                cart = cart.filter(i => String(i.id) !== String(id));
            } else {
                const idx = cart.findIndex(i => String(i.id) === String(id));
                if (idx >= 0) {
                    const max = Number(cart[idx].stock || 99);
                    cart[idx].qty = Math.min(max, Number(qty));
                }
            }
            writeCart(cart);
        },

        clearCart() {
            writeCart([]);
        }
    };

    // ── API de Favoritos ─────────────────────────────────────
    window.SmuckyFavs = {

        getFavs() {
            return readFavs();
        },

        getCount() {
            return readFavs().length;
        },

        isFav(id) {
            return readFavs().some(f => String(f.id) === String(id));
        },

        // ES: Si el producto ya está en favoritos lo quita, si no lo agrega.
        // EN: If the product is already in favorites it removes it, otherwise adds it.
        toggle(item) {
            let favs = readFavs();
            const idx = favs.findIndex(f => String(f.id) === String(item.id));
            if (idx >= 0) {
                favs.splice(idx, 1);
            } else {
                favs.push({
                    id:          String(item.id),
                    firestoreId: item.firestoreId || null,
                    name:        item.name        || "",
                    price:       Number(item.price) || 0,
                    image:       item.image        || "",
                    gallery:     Array.isArray(item.gallery) ? item.gallery : []
                });
            }
            writeFavs(favs);
            return idx < 0; // true = se agregó, false = se quitó
        },

        clearFavs() {
            writeFavs([]);
        }
    };

    console.log("✅ SmuckyCart y SmuckyFavs listos.");
})();