/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/emailjs-notificaciones.js  — SMUCKY´s By CHAVAMON
//
//  PLANTILLAS EMAILJS (Hotmail — solo para compras):
//    template_wpjwmxb  → confirmación de compra al CLIENTE
//    template_z1ddwme  → aviso de venta al VENDEDOR (tú)
//
//  CÓDIGOS de verificación (registro + recuperar contraseña):
//    Manejados en correo-codigo.js con Gmail
// ============================================================

// ── Credenciales EmailJS (Hotmail — compras) ─────────────────
const EMAILJS_PUBLIC_KEY = ["I7Z9IQ", "aIfsl", "pauQQn"].join(""); // ← Hotmail //Public Key dividida por seguridad
const EMAILJS_SERVICE_ID = "SMUCKYs-CHAVAMON_EMAIL";                // Servicio Hotmail en EmailJS
const TPL_CLIENTE        = "template_wpjwmxb";                      // Template: confirmación al cliente
const TPL_VENDEDOR       = "template_z1ddwme";                      // Template: aviso al vendedor
const OWNER_EMAIL        = "soushmuck.chavamon@hotmail.com";         // Correo donde llegan las ventas

// ── Carga EmailJS una sola vez ───────────────────────────────
let _ejsListo = false;
function cargarEmailJS() {
    return new Promise((resolve, reject) => {
        if (_ejsListo && window.emailjs) { resolve(); return; } // ya está cargado, no lo repite
        const s  = document.createElement("script");
        s.src    = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = () => {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); // inicializa con tu key
            _ejsListo = true;
            resolve();
        };
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

// ── Genera ID de orden único tipo SMK-123456 ─────────────────
function generarOrdenId() {
    return "SMK-" + Date.now().toString().slice(-6); // ej: SMK-483920
}

// ── Fecha y hora en español ───────────────────────────────────
function fechaHoraES() {
    const n = new Date();
    return {
        fecha: n.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        hora:  n.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    };
}

// ── Saludo según hora del día ─────────────────────────────────
function saludoPorHora() {
    const h = new Date().getHours();
    if (h >= 6  && h < 12) return "¡Buenos días";
    if (h >= 12 && h < 19) return "¡Buenas tardes";
    return "¡Buenas noches";
}

// ============================================================
//  COMPRA: correo de confirmación al CLIENTE
//  Template: template_wpjwmxb
// ============================================================
async function enviarCorreoCompraCliente({ emailCliente, nombreCliente, producto, talla = "", color = "", cantidad, precioUnitario, total }) {
    try {
        await cargarEmailJS(); // asegura que EmailJS esté listo

        const { fecha, hora } = fechaHoraES();
        const ordenId = generarOrdenId(); // genera número de orden único

        // Valida datos mínimos antes de enviar
        if (!emailCliente || !nombreCliente || !producto) {
            throw new Error("Faltan datos del cliente o producto.");
        }

        await window.emailjs.send(EMAILJS_SERVICE_ID, TPL_CLIENTE, {
            customer_name:  nombreCliente || "Cliente",   // nombre del comprador
            customer_email: emailCliente,                  // correo del comprador
            product_name:   producto,                      // nombre del producto
            size:           talla  || "Única",             // talla seleccionada
            color:          color  || "—",                 // color seleccionado
            quantity:       String(cantidad),              // cantidad comprada
            order_date:     fecha,                         // fecha en español
            order_time:     hora,                          // hora de la compra
            order_id:       ordenId,                       // número de orden
            price:          `$${Number(total).toFixed(2)} MXN` // precio total
        });

        console.log("✅ Confirmación de compra enviada al cliente:", emailCliente);
        return { ok: true, ordenId }; // retorna el ordenId para usarlo en el correo del vendedor

    } catch (err) {
        console.error("❌ Error al enviar correo al cliente:", err);
        return { ok: false, ordenId: null };
    }
}

// ============================================================
//  COMPRA: aviso de nueva venta al VENDEDOR (tú)
//  Template: template_z1ddwme
// ============================================================
async function enviarNotificacionVendedor({ nombreCliente, emailCliente, producto, talla = "", color = "", cantidad, precioUnitario, total, ordenId }) {
    try {
        await cargarEmailJS(); // asegura que EmailJS esté listo

        const { fecha, hora } = fechaHoraES();

        // Arma el mensaje con todos los detalles de la venta
        const mensaje =
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🛍 NUEVA VENTA — SMUCKY´s By CHAVAMON\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `CLIENTE\n` +
            `  Nombre:   ${nombreCliente}\n` +
            `  Correo:   ${emailCliente}\n\n` +
            `PEDIDO\n` +
            `  Producto: ${producto}\n` +
            `  Talla:    ${talla  || "Única"}\n` +
            `  Color:    ${color  || "—"}\n` +
            `  Cantidad: ${cantidad} unidad(es)\n` +
            `  Precio:   $${Number(precioUnitario).toFixed(2)} MXN c/u\n` +
            `  Total:    $${Number(total).toFixed(2)} MXN\n\n` +
            `ORDEN\n` +
            `  # Orden:  ${ordenId}\n` +
            `  Fecha:    ${fecha}\n` +
            `  Hora:     ${hora}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━`;

        await window.emailjs.send(EMAILJS_SERVICE_ID, TPL_VENDEDOR, {
            to_email:       OWNER_EMAIL,                    // tu correo Hotmail
            customer_name:  nombreCliente,                  // nombre del cliente
            customer_email: emailCliente,                   // correo del cliente
            product_name:   producto,                       // producto vendido
            size:           talla  || "Única",              // talla
            color:          color  || "—",                  // color
            quantity:       String(cantidad),               // cantidad
            order_date:     fecha,                          // fecha
            order_time:     hora,                           // hora
            order_id:       ordenId,                        // número de orden
            price:          `$${Number(total).toFixed(2)} MXN` // total
        });

        console.log("✅ Aviso de venta enviado al vendedor:", OWNER_EMAIL);
        return true;

    } catch (err) {
        console.error("❌ Error al enviar notificación al vendedor:", err);
        return false;
    }
}

// ============================================================
//  handlePurchase() — función principal de compra
//  Guarda en Firebase + envía los 2 correos
//  Llámala desde el botón "Comprar"
// ============================================================
async function handlePurchase({ emailCliente, nombreCliente, producto, talla = "", color = "", cantidad, precioUnitario, total }) {

    // ── Validar datos antes de procesar ──────────────────────
    if (!emailCliente || !nombreCliente || !producto || !cantidad || !total) {
        console.error("❌ handlePurchase: Faltan datos requeridos.");
        return { ok: false, ordenId: null };
    }

    const { fecha, hora } = fechaHoraES();
    const ordenId = generarOrdenId(); // ID único para esta compra

    // ── Guardar compra en Firebase Firestore ─────────────────
    try {
        const [{ initializeApp, getApps }, { getFirestore, collection, addDoc, serverTimestamp }] = await Promise.all([
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
        ]);

        const firebaseConfig = {
            apiKey:            "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
            authDomain:        "smuckys-by-chavamon-loginregis.firebaseapp.com",
            projectId:         "smuckys-by-chavamon-loginregis",
            storageBucket:     "smuckys-by-chavamon-loginregis.firebasestorage.app",
            messagingSenderId: "185108836763",
            appId:             "1:185108836763:web:d7b923507c3c32e28e313e"
        };

        const fbApp = getApps().find(a => a.name === "auth-app") || initializeApp(firebaseConfig, "auth-app");
        const db    = getFirestore(fbApp);

        // Guarda todos los datos de la compra en la colección "ventas"
        await addDoc(collection(db, "ventas"), {
            orden_id:        ordenId,          // número de orden único
            nombre_cliente:  nombreCliente,    // nombre del comprador
            email_cliente:   emailCliente,     // correo del comprador
            producto:        producto,          // nombre del producto
            talla:           talla  || "Única", // talla seleccionada
            color:           color  || "—",     // color seleccionado
            cantidad:        Number(cantidad),  // cantidad comprada
            precio_unitario: Number(precioUnitario), // precio por unidad
            total:           Number(total),     // total pagado
            fecha:           fecha,             // fecha en español
            hora:            hora,              // hora de la compra
            fecha_servidor:  serverTimestamp()  // timestamp del servidor Firebase
        });

        console.log("✅ Compra guardada en Firebase:", ordenId);

    } catch (fbError) {
        console.error("❌ Error al guardar en Firebase:", fbError);
        // No detenemos el flujo — los correos se envían igual
    }

    // ── Enviar correo al cliente ──────────────────────────────
    const resultCliente = await enviarCorreoCompraCliente({
        emailCliente, nombreCliente, producto,
        talla, color, cantidad, precioUnitario, total
    });

    // ── Enviar correo al vendedor (tú) ────────────────────────
    await enviarNotificacionVendedor({
        nombreCliente, emailCliente, producto,
        talla, color, cantidad, precioUnitario, total,
        ordenId: resultCliente.ordenId || ordenId // usa el mismo ID en ambos correos
    });

    return { ok: resultCliente.ok, ordenId };
}

// ── Exponer funciones globalmente ────────────────────────────
window.handlePurchase             = handlePurchase;              // función principal — úsala en el botón Comprar
window.enviarCorreoCompraCliente  = enviarCorreoCompraCliente;   // solo correo al cliente
window.enviarNotificacionVendedor = enviarNotificacionVendedor;  // solo correo al vendedor
window.procesarCorreosCompra      = handlePurchase;              // alias para compatibilidad

// ── Compatibilidad con código anterior ───────────────────────
window.enviarCorreosVenta = (email, nombre, prod, cant, precio, tot) =>
    handlePurchase({
        emailCliente:    email,
        nombreCliente:   nombre,
        producto:        prod,
        cantidad:        cant,
        precioUnitario:  precio,
        total:           tot
    });

window.SMUCKY_OWNER_EMAIL = OWNER_EMAIL; // correo del dueño accesible globalmente