/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/mercadopago-pago.js
//  QUÉ HACE: Maneja el cobro con Mercado Pago (Checkout Pro)
//  CÓMO FUNCIONA:
//    1. Tu backend crea una "preferencia" en MP y devuelve init_point
//    2. Este archivo redirige al usuario a esa URL de MP
//    3. MP redirige de vuelta a success_url con ?pago=exitoso&mp=si
//    4. confirmarPedidoTrasMP() guarda el pedido en Firebase
//
//  ⚠️  NECESITAS UN BACKEND PEQUEÑO para crear la preferencia.
//      Opciones: Vercel Serverless Function, Firebase Cloud Function.
//      Ver comentario en crearPreferenciaMP() abajo.
// ============================================================

// ── Configuración ─────────────────────────────────────────────
// Pon aquí la URL de tu función backend que crea la preferencia.
// Ejemplo Vercel: "/api/crear-preferencia-mp"
// Ejemplo Firebase Functions: "https://tu-region-tu-proyecto.cloudfunctions.net/crearPreferenciaMP"
const MP_BACKEND_URL = "/api/crear-preferencia-mp";

const MP_SUCCESS_URL = `${window.location.origin}/cuenta/pedidos.html?pago=exitoso&mp=si`;
const MP_FAILURE_URL = `${window.location.origin}/index.html?pago=cancelado&mp=si`;
const MP_PENDING_URL = `${window.location.origin}/index.html?pago=pendiente&mp=si`;

// ── Helpers ───────────────────────────────────────────────────

// ES: Espera sin límite de tiempo a que Firebase esté listo.
// EN: Waits without a time limit for Firebase to be ready.
function _esperarFirebaseMP() {
    return new Promise((resolve) => {
        if (typeof window.realizarPedido === "function") { resolve(); return; }
        const interval = setInterval(() => {
            if (typeof window.realizarPedido === "function") {
                clearInterval(interval);
                resolve();
            }
        }, 150);
    });
}

// ── API pública ───────────────────────────────────────────────

/**
 * ES: Inicia el pago de UN producto con Mercado Pago.
 *     Llama al backend, obtiene el init_point y redirige al usuario.
 * EN: Starts a single-product payment with Mercado Pago.
 *     Calls the backend, gets the init_point, and redirects the user.
 *
 * @param {string|number} productoId   - ID local del producto
 * @param {number}        cantidad     - Unidades a comprar
 * @param {string}        nombreProducto - Nombre para mostrar en MP
 * @param {number}        precioUnitario - Precio unitario en MXN
 */
async function iniciarPagoMercadoPago(productoId, cantidad, nombreProducto, precioUnitario) {
    try {
        // Guarda los datos del pedido antes de redirigir
        localStorage.setItem("smucky_mp_pending", JSON.stringify({
            productoId: String(productoId),
            cantidad,
            nombreProducto,
            precioUnitario
        }));

        const usuario = window.SmuckyAuth?.getCurrentUser?.();

        // Llama a tu backend para crear la preferencia
        // Tu backend debe llamar a la API de MP con tu ACCESS TOKEN secreto
        // y devolver { init_point: "https://www.mercadopago.com.mx/checkout/..." }
        //
        // Ejemplo del cuerpo que tu backend recibe:
        // {
        //   items: [{ title, quantity, unit_price, currency_id: "MXN" }],
        //   payer: { email },
        //   back_urls: { success, failure, pending },
        //   auto_return: "approved"
        // }
        const response = await fetch(MP_BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: [{
                    title: nombreProducto,
                    quantity: Number(cantidad),
                    unit_price: Number(precioUnitario),
                    currency_id: "MXN"
                }],
                payer: { email: usuario?.email || "" },
                back_urls: {
                    success: MP_SUCCESS_URL + `&producto=${encodeURIComponent(nombreProducto)}&cantidad=${cantidad}`,
                    failure: MP_FAILURE_URL,
                    pending: MP_PENDING_URL
                },
                auto_return: "approved"
            })
        });

        if (!response.ok) {
            throw new Error(`Backend MP respondió ${response.status}`);
        }

        const data = await response.json();

        if (!data.init_point) {
            throw new Error("El backend no devolvió init_point.");
        }

        // Redirige a Mercado Pago
        window.location.href = data.init_point;
        return false;

    } catch (error) {
        console.error("Error al iniciar pago con Mercado Pago:", error);
        localStorage.removeItem("smucky_mp_pending");
        alert("No se pudo iniciar el pago con Mercado Pago. Intenta de nuevo.");
        return false;
    }
}

/**
 * ES: Inicia el pago de TODO EL CARRITO con Mercado Pago.
 * EN: Starts a full cart payment with Mercado Pago.
 *
 * @param {Array} cartItems - Array de { id, firestoreId, name, qty, price }
 */
async function iniciarPagoCarritoMP(cartItems) {
    try {
        localStorage.setItem("smucky_mp_pending_cart", JSON.stringify(cartItems));

        const usuario = window.SmuckyAuth?.getCurrentUser?.();

        const response = await fetch(MP_BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: cartItems.map(item => ({
                    title: item.name,
                    quantity: Number(item.qty || 1),
                    unit_price: Number(item.price),
                    currency_id: "MXN"
                })),
                payer: { email: usuario?.email || "" },
                back_urls: {
                    success: MP_SUCCESS_URL,
                    failure: MP_FAILURE_URL,
                    pending: MP_PENDING_URL
                },
                auto_return: "approved"
            })
        });

        if (!response.ok) throw new Error(`Backend MP respondió ${response.status}`);
        const data = await response.json();
        if (!data.init_point) throw new Error("El backend no devolvió init_point.");

        window.location.href = data.init_point;
        return false;

    } catch (error) {
        console.error("Error al iniciar pago carrito MP:", error);
        localStorage.removeItem("smucky_mp_pending_cart");
        alert("No se pudo iniciar el pago con Mercado Pago. Intenta de nuevo.");
        return false;
    }
}

/**
 * ES: Se ejecuta automáticamente cuando MP redirige de vuelta con ?pago=exitoso&mp=si.
 *     Guarda el pedido en Firebase después de un pago aprobado.
 * EN: Runs automatically when MP redirects back with ?pago=exitoso&mp=si.
 *     Saves the order to Firebase after an approved payment.
 */
async function confirmarPedidoTrasMP() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pago") !== "exitoso" || params.get("mp") !== "si") return;

    // --- Pedido individual ---
    const pendingRaw = localStorage.getItem("smucky_mp_pending");
    if (pendingRaw) {
        let pending;
        try { pending = JSON.parse(pendingRaw); }
        catch { localStorage.removeItem("smucky_mp_pending"); return; }

        localStorage.removeItem("smucky_mp_pending");
        await _esperarFirebaseMP();

        const ok = await window.realizarPedido(
            pending.productoId,
            pending.cantidad,
            pending.nombreProducto,
            pending.precioUnitario,
            "",
            "mercadopago"
        );
        if (ok) console.log("✅ Pedido individual confirmado tras Mercado Pago.");
        else console.error("❌ realizarPedido devolvió false para pedido MP.");
        return;
    }

    // --- Carrito completo ---
    const cartRaw = localStorage.getItem("smucky_mp_pending_cart");
    if (cartRaw) {
        let cartItems;
        try { cartItems = JSON.parse(cartRaw); }
        catch { localStorage.removeItem("smucky_mp_pending_cart"); return; }

        localStorage.removeItem("smucky_mp_pending_cart");
        await _esperarFirebaseMP();

        let todosOk = true;
        for (const item of cartItems) {
            const ok = await window.realizarPedido(
                String(item.firestoreId || item.id),
                Number(item.qty || 1),
                item.name,
                item.price,
                "",
                "mercadopago"
            );
            if (!ok) { todosOk = false; console.error("❌ Falló pedido carrito MP:", item); }
        }
        if (todosOk) console.log("✅ Carrito confirmado tras Mercado Pago.");
    }
}

// Ejecuta automáticamente al cargar la página de confirmación
confirmarPedidoTrasMP();

window.iniciarPagoMercadoPago = iniciarPagoMercadoPago;
window.iniciarPagoCarritoMP   = iniciarPagoCarritoMP;