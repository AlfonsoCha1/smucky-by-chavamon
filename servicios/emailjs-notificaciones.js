/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/emailjs-notificaciones.js  — SMUCKY'S BY CHAVARIN
//
//  PLANTILLAS EMAILJS (solo 2, solo para compras):
//    template_4rnpwe4  → confirmación de compra al CLIENTE
//    template_afr597h  → aviso de venta al VENDEDOR (tú)
//
//  CÓDIGOS de verificación (registro + recuperar contraseña):
//    Se generan en JS y se muestran con prompt() por ahora.
//    Cuando tengas más plantillas disponibles en EmailJS,
//    solo descomentas las líneas de envío de correo.
// ============================================================


const EMAILJS_PUBLIC_KEY = ["I7Z9IQ", "aIfsl", "pauQQn"].join("");  // Clave pública dividida para mayor seguridad
const EMAILJS_SERVICE_ID = "SMUCKYs-CHAVAMON_EMAIL";                // Servicio de Outlook conectado en EmailJS
const TPL_CLIENTE        = "template_wpjwmxb";                      // Template: confirmación de compra al cliente
const TPL_VENDEDOR       = "template_z1ddwme";                      // Template: notificación de nueva venta al vendedor
const OWNER_EMAIL        = "soushmuck.chavamon@hotmail.com";        // Correo donde llegan las notificaciones de ventas                   // ← el correo donde recibes notificaciones

// ── Cargar EmailJS ───────────────────────────────────────────
let _ejsListo = false;
function cargarEmailJS() {
    return new Promise((resolve, reject) => {
        if (_ejsListo && window.emailjs) { resolve(); return; }
        const s  = document.createElement("script");
        s.src    = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = () => {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            _ejsListo = true;
            resolve();
        };
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

// ── Helpers ──────────────────────────────────────────────────
function generarCodigo6() {
    return String(Math.floor(100000 + Math.random() * 900000));
}
function fechaHoraES() {
    const n = new Date();
    return {
        fecha: n.toLocaleDateString("es-MX", { weekday:"long", year:"numeric", month:"long", day:"numeric" }),
        hora:  n.toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" })
    };
}
function saludoPorHora() {
    const h = new Date().getHours();
    if (h >= 6  && h < 12) return "¡Buenos días";
    if (h >= 12 && h < 19) return "¡Buenas tardes";
    return "¡Buenas noches";
}

// ============================================================
//  CÓDIGOS DE VERIFICACIÓN
//  Por ahora se generan en JS y se piden con prompt().
//  El usuario ve el código en pantalla para ingresarlo.
//  (Cuando tengas más plantillas EmailJS, aquí mandamos el correo)
// ============================================================

// Registro: envia código real por correo usando la plantilla existente
async function enviarBienvenidaRegistro(emailCliente, nombreCliente, codigoExterno = "") {
    try {
        await cargarEmailJS();

        const codigo = String(codigoExterno || generarCodigo6());
        const { fecha, hora } = fechaHoraES();
        const mensaje =
            `Tu codigo de verificacion para crear tu cuenta es: ${codigo}\n\n` +
            `Este codigo vence en 10 minutos.\n` +
            `Fecha: ${fecha}\nHora: ${hora}\n\n` +
            `Si tu no solicitaste este registro, ignora este correo.`;

        await window.emailjs.send(EMAILJS_SERVICE_ID, TPL_VENDEDOR, {
            to_email: emailCliente,
            title: "Codigo de verificacion de registro",
            name: nombreCliente || "Cliente",
            message: mensaje
        });

        return { ok: true, codigo };
    } catch (err) {
        console.error("❌ Error envio codigo registro:", err);
        return { ok: false, codigo: null };
    }
}

// Recuperar contraseña: genera código y lo retorna para el modal
async function enviarCodigoRecuperacion(contacto, metodo = "email", via = "sms") {
    const codigo = generarCodigo6();

    // TODO: cuando tengas plantilla extra en EmailJS, descomentar:
    // await window.emailjs.send(EMAILJS_SERVICE_ID, "template_recuperar", {
    //     to_email: contacto, codigo: codigo,
    //     via: metodo === "phone" ? (via === "call" ? "llamada" : "SMS") : "correo",
    //     ...fechaHoraES()
    // });

    alert(
        `Se generó tu código de recuperación.\n\n` +
        `Código: ${codigo}\n\n` +
        `(Próximamente este código llegará a tu ${metodo === "phone" ? "teléfono" : "correo"})`
    );

    return { ok: true, codigo };
}

// ============================================================
//  COMPRA: correo al cliente  →  template_4rnpwe4
// ============================================================
async function enviarCorreoCompraCliente({ emailCliente, nombreCliente, producto, talla = "", cantidad, precioUnitario, total, shipping = 0 }) {
    try {
        await cargarEmailJS();
        const { fecha, hora } = fechaHoraES();
        const ordenId = "SMK-" + Date.now().toString().slice(-6);

        await window.emailjs.send(EMAILJS_SERVICE_ID, TPL_CLIENTE, {
            to_email:        emailCliente,
            to_name:         nombreCliente || "Cliente",
            orden_id:        ordenId,
            producto:        producto,
            talla:           talla || "Única",
            cantidad:        String(cantidad),
            precio_unitario: `$${Number(precioUnitario).toFixed(2)} MXN`,
            total:           `$${Number(total).toFixed(2)} MXN`,
            shipping:        shipping > 0 ? `$${Number(shipping).toFixed(2)} MXN` : "Gratis",
            fecha:           fecha,
            hora:            hora,
            saludo:          saludoPorHora(),
            // Compatibilidad con la plantilla actual
            name:            nombreCliente || "Cliente",
            "cost.total":    `$${Number(total).toFixed(2)} MXN`,
            "cost.shipping": shipping > 0 ? `$${Number(shipping).toFixed(2)} MXN` : "$0.00",
            "cost.tax":      "$0.00",
            orders: [{ name: producto, units: cantidad, price: `$${Number(precioUnitario).toFixed(2)} MXN` }]
        });

        console.log("✅ Confirmación de compra enviada al cliente:", emailCliente);
        return { ok: true, ordenId };
    } catch (err) {
        console.error("❌ Error compra cliente:", err);
        return { ok: false, ordenId: null };
    }
}

// ============================================================
//  COMPRA: aviso al vendedor  →  template_afr597h
// ============================================================
async function enviarNotificacionVendedor({ nombreCliente, emailCliente, telefono = "", direccion = "", ciudad = "", producto, talla = "", cantidad, precioUnitario, total, ordenId }) {
    try {
        await cargarEmailJS();
        const { fecha, hora } = fechaHoraES();

        const mensaje =
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🛍 NUEVA VENTA — SMUCKY'S\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `CLIENTE\n` +
            `  Nombre:    ${nombreCliente}\n` +
            `  Correo:    ${emailCliente}\n` +
            `  Teléfono:  ${telefono  || "No proporcionado"}\n` +
            `  Dirección: ${direccion || "No proporcionada"}\n` +
            `  Ciudad:    ${ciudad    || "No proporcionada"}\n\n` +
            `PEDIDO\n` +
            `  Producto:  ${producto}\n` +
            `  Talla:     ${talla || "Única"}\n` +
            `  Cantidad:  ${cantidad} unidad(es)\n` +
            `  Precio:    $${Number(precioUnitario).toFixed(2)} MXN c/u\n` +
            `  Total:     $${Number(total).toFixed(2)} MXN\n\n` +
            `ORDEN\n` +
            `  # Orden:   ${ordenId}\n` +
            `  Fecha:     ${fecha}\n` +
            `  Hora:      ${hora}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━`;

        await window.emailjs.send(EMAILJS_SERVICE_ID, TPL_VENDEDOR, {
            to_email: OWNER_EMAIL,
            title:    `Nueva venta — ${producto} · ${ordenId}`,
            name:     `${nombreCliente} (${emailCliente})`,
            message:  mensaje
        });

        console.log("✅ Aviso de venta enviado al vendedor:", OWNER_EMAIL);
        return true;
    } catch (err) {
        console.error("❌ Error notificación vendedor:", err);
        return false;
    }
}

// ── Función combinada: llama a las 2 juntas ──────────────────
async function procesarCorreosCompra(datos) {
    const r       = await enviarCorreoCompraCliente(datos);
    const ordenId = r.ordenId || ("SMK-" + Date.now().toString().slice(-6));
    await enviarNotificacionVendedor({ ...datos, ordenId });
    return { ok: r.ok, ordenId };
}

// ── Exponer globalmente ──────────────────────────────────────
window.enviarBienvenidaRegistro  = enviarBienvenidaRegistro;
window.enviarCodigoRecuperacion  = enviarCodigoRecuperacion;
window.enviarCorreoCompraCliente = enviarCorreoCompraCliente;
window.enviarNotificacionVendedor = enviarNotificacionVendedor;
window.procesarCorreosCompra     = procesarCorreosCompra;

// Compatibilidad con código anterior
window.enviarCodigoRegistro = (email, nombre, codigo) => enviarBienvenidaRegistro(email, nombre, codigo);
window.enviarCorreosVenta   = (email, nombre, prod, cant, precio, tot) =>
    procesarCorreosCompra({ emailCliente: email, nombreCliente: nombre, producto: prod,
                            cantidad: cant, precioUnitario: precio, total: tot });
window.SMUCKY_OWNER_EMAIL = OWNER_EMAIL;

