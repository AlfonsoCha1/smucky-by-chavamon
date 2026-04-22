/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  ARCHIVO 2 DE 3: servicios/stripe-pago.js
//  QUÉ HACE: Maneja el cobro real con tarjeta usando Stripe
// ============================================================

const STRIPE_PUBLISHABLE_KEY = "pk_live_51TKmQjBzNG0S5esGgFTxl0a44Rm1c1mMLoxRe6dnqXGC3ZBE6rIp4LCurEsqmDv9EOYSx7fxOXEpI5rKqInFT2KL00yyYloMjr";

const STRIPE_PRICE_IDS = {
    // ── Playeras Premium ──────────────────────────────────────
    "1":  "price_1TL8b2BzNG0S5esGCJzOv7k3",  // Playera Premium Azul Claro    $158
    "2":  "price_1TL8ayBzNG0S5esGQCco4l0U",  // Playera Premium Rojo          $158
    "3":  "price_1TL8b3BzNG0S5esGCpLWL1Lv",  // Playera Premium Rojizo        $158
    "4":  "price_1TL8azBzNG0S5esGC5msoIK6",  // Playera Premium Blanco        $158
    "5":  "price_1TOqqmBzNG0S5esG1RwGj6PC",  // Playera Premium Negro         $158
    // ── Playeras Sin Mangas ───────────────────────────────────
    "9":  "price_1TL8b4BzNG0S5esGTRYuJvEt",  // Playera Sin Mangas Negro      $78
    // ── Calcetines ────────────────────────────────────────────
    "8":  "price_1TL8azBzNG0S5esGyp6Uor4U",  // Calcetines Premium Pack       $53
    // ── Blusas ────────────────────────────────────────────────
    "10": "price_1TL8ayBzNG0S5esGCQPts5UQ",  // Blusa Premium Roja            $68
    "12": "price_1TL8b2BzNG0S5esGvWg45Tvs",  // Blusa Premium Rosa            $68
    // ── Shorts Deportivos ─────────────────────────────────────
    "11": "price_1TL8b0BzNG0S5esG515DtOEf",  // Short Deportivo Azul Claro    $158
    "13": "price_1TL8ayBzNG0S5esGjVIWkxdG",  // Short Deportivo Azul Fuerte   $158
    "14": "price_1TLEAPBzNG0S5esGI72SBG1K",  // Short Deportivo Beige         $158
    "15": "price_1TLEIvBzNG0S5esGj1pAsMWQ",  // Short Deportivo Negro         $158
    "16": "price_1TLESNBzNG0S5esGZrgLoPH8",  // Short Deportivo Rosa Fuerte   $158
    "17": "price_1TLEJNBzNG0S5esGBgH8ZB8s",  // Short Deportivo Rojo          $158
    "18": "price_1TLESwBzNG0S5esGJzlA0hrF",  // Short Deportivo Rosa Claro    $158
};

const SUCCESS_URL = `${window.location.origin}/cuenta/pedidos.html?pago=exitoso`;
const CANCEL_URL = `${window.location.origin}/index.html?pago=cancelado`;

async function iniciarPagoStripe(productoId, cantidad, nombreProducto, precioUnitario, moneda = "MXN") {
    const priceId = STRIPE_PRICE_IDS[String(productoId)];

    if (!priceId || priceId.includes("XXXXXXXX")) {
        console.warn(`Producto ${productoId} no tiene Price ID de Stripe configurado. Usando flujo normal.`);
        return window.realizarPedido(String(productoId), cantidad, nombreProducto, precioUnitario);
    }

    localStorage.setItem("smucky_stripe_pending", JSON.stringify({
        productoId: String(productoId),
        cantidad,
        nombreProducto,
        precioUnitario,
        moneda
    }));

    if (!window.Stripe) {
        await cargarStripeJS();
    }

    const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: cantidad }],
        mode: "payment",
        successUrl: SUCCESS_URL + `&producto=${encodeURIComponent(nombreProducto)}&cantidad=${cantidad}`,
        cancelUrl: CANCEL_URL,
        customerEmail: window.SmuckyAuth?.getCurrentUser?.()?.email || undefined,
        locale: "es-419"
    });

    if (error) {
        console.error("Error de Stripe:", error);
        alert("No se pudo iniciar el pago. Intenta de nuevo.");
        localStorage.removeItem("smucky_stripe_pending");
    }

    return false;
}

// ES: Espera sin límite de tiempo a que Firebase esté listo.
//     Usa MutationObserver + polling para no perder el pedido si Firebase tarda.
// EN: Waits without a time limit for Firebase to be ready.
//     Uses MutationObserver + polling so the order isn't lost if Firebase is slow.
function esperarFirebase() {
    return new Promise((resolve) => {
        if (typeof window.realizarPedido === "function") {
            resolve();
            return;
        }
        const interval = setInterval(() => {
            if (typeof window.realizarPedido === "function") {
                clearInterval(interval);
                resolve();
            }
        }, 150);
    });
}

async function confirmarPedidoTrasStripe() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pago") !== "exitoso") return;

    // --- Pedido individual ---
    const pendingRaw = localStorage.getItem("smucky_stripe_pending");
    if (pendingRaw) {
        let pending;
        try { pending = JSON.parse(pendingRaw); }
        catch { localStorage.removeItem("smucky_stripe_pending"); return; }

        localStorage.removeItem("smucky_stripe_pending");
        await esperarFirebase();

        const ok = await window.realizarPedido(
            pending.productoId,
            pending.cantidad,
            pending.nombreProducto,
            pending.precioUnitario,
            "",
            "stripe"
        );
        if (ok) console.log("✅ Pedido individual confirmado tras Stripe.");
        else console.error("❌ realizarPedido devolvió false para pedido individual.");
        return;
    }

    // --- Carrito completo ---
    const cartRaw = localStorage.getItem("smucky_stripe_pending_cart");
    if (cartRaw) {
        let cartItems;
        try { cartItems = JSON.parse(cartRaw); }
        catch { localStorage.removeItem("smucky_stripe_pending_cart"); return; }

        localStorage.removeItem("smucky_stripe_pending_cart");
        await esperarFirebase();

        let todosOk = true;
        for (const item of cartItems) {
            const ok = await window.realizarPedido(
                String(item.firestoreId || item.id),
                Number(item.qty || 1),
                item.name,
                item.price,
                "",
                "stripe"
            );
            if (!ok) { todosOk = false; console.error("❌ Falló pedido carrito:", item); }
        }
        if (todosOk) console.log("✅ Carrito confirmado tras Stripe.");
    }
}

function cargarStripeJS() {
    return new Promise((resolve, reject) => {
        if (window.Stripe) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

confirmarPedidoTrasStripe();
window.iniciarPagoStripe = iniciarPagoStripe;

// ES: Inicia el pago de Stripe Checkout con todos los productos del carrito.
// EN: Starts a Stripe Checkout session with all products from the cart.
async function iniciarPagoCarrito(cartItems) {
    const lineItems = [];

    for (const item of cartItems) {
        const priceId = STRIPE_PRICE_IDS[String(item.id)];
        if (!priceId) {
            alert(`El producto "${item.name}" no está listo para pago en línea.\nContacta a soporte.`);
            return false;
        }
        lineItems.push({ price: priceId, quantity: item.qty });
    }

    // ES: Guarda el carrito en localStorage para confirmar el pedido al volver de Stripe.
    // EN: Saves the cart to localStorage to confirm the order when returning from Stripe.
    localStorage.setItem("smucky_stripe_pending_cart", JSON.stringify(cartItems));

    if (!window.Stripe) {
        await cargarStripeJS();
    }

    const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
    const { error } = await stripe.redirectToCheckout({
        lineItems,
        mode: "payment",
        successUrl: `${window.location.origin}/cuenta/pedidos.html?pago=exitoso`,
        cancelUrl: `${window.location.origin}/index.html?pago=cancelado`,
        customerEmail: window.SmuckyAuth?.getCurrentUser?.()?.email || undefined,
        locale: "es-419"
    });

    if (error) {
        console.error("Error de Stripe (carrito):", error);
        throw new Error(error.message);
    }

    return false;
}

window.iniciarPagoCarrito = iniciarPagoCarrito;