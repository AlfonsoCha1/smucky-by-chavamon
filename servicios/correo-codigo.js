/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/correo-codigo.js  — SMUCKY'S BY CHAVARIN
//
//  Carga la plantilla HTML de Plantilla_Para_Correo/correo-codigo.html,
//  inyecta nombre, codigo, tipo y motivo, y la envia via EmailJS
//  usando la plantilla de cliente (template_4rnpwe4) que ya funciona.
//
//  USO:
//    import { enviarCodigoRegistro, enviarCodigoRecuperacion }
//      from "../servicios/correo-codigo.js";
//
//    await enviarCodigoRegistro("Juan", "juan@correo.com", "123456");
//    await enviarCodigoRecuperacion("Juan", "juan@correo.com", "654321");
// ============================================================

const EMAILJS_PUBLIC_KEY = "FbiFKIiqS9841M71D";
const EMAILJS_SERVICE_ID = "smuckyschavamon_gmail";
const EMAILJS_TEMPLATE   = "template_4rnpwe4";

// Ruta relativa a la plantilla HTML (desde la raiz del sitio)
const TEMPLATE_PATH = "/Plantilla_Para_Correo/correo-codigo.html";

let _ejsListo = false;

function cargarEmailJS() {
    return new Promise((resolve, reject) => {
        if (_ejsListo && window.emailjs) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = () => {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            _ejsListo = true;
            resolve();
        };
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function obtenerHtmlPlantilla(nombre, codigo, tipo, motivo) {
    const res = await fetch(TEMPLATE_PATH);
    if (!res.ok) throw new Error("No se pudo cargar la plantilla de correo.");

    const raw  = await res.text();
    const anio = new Date().getFullYear();

    return raw
        .replace(/\{\{NOMBRE\}\}/g,  nombre)
        .replace(/\{\{CODIGO\}\}/g,  codigo)
        .replace(/\{\{TIPO\}\}/g,    tipo)
        .replace(/\{\{MOTIVO\}\}/g,  motivo)
        .replace(/\{\{AÑO\}\}/g,     String(anio));
}

async function _enviar(nombre, email, codigo, tipo, motivo) {
    await cargarEmailJS();

    const htmlFinal = await obtenerHtmlPlantilla(nombre, codigo, tipo, motivo);

    const ahora  = new Date();
    const fecha  = ahora.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const hora   = ahora.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    const h      = ahora.getHours();
    const saludo = h < 12 ? "Buenos dias" : h < 19 ? "Buenas tardes" : "Buenas noches";

    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE, {
        to_email:        email,
        to_name:         nombre,
        name:            nombre,
        saludo:          `${saludo}, ${nombre}!`,
        orden_id:        `COD-${codigo}`,
        producto:        tipo,
        talla:           "—",
        cantidad:        "1",
        precio_unitario: codigo,
        total:           codigo,
        shipping:        "Codigo vence en 10 minutos",
        fecha,
        hora,
        "cost.total":    codigo,
        "cost.shipping": "—",
        "cost.tax":      "0",
        // Campo "message" por si la plantilla lo usa como fallback de texto plano
        message: `Hola ${nombre}, tu codigo generado es: ${codigo}. Vence en 10 minutos.`,
        orders: [{
            name:  `Tu codigo de ${tipo.toLowerCase()} es: ${codigo}`,
            units: 1,
            price: "Vence en 10 min"
        }],
        // HTML completo de la presentacion (si la plantilla EmailJS tiene un campo free)
        email_html: htmlFinal
    });

    return { ok: true, codigo };
}

export async function enviarCodigoRegistro(nombre, email, codigo) {
    return _enviar(
        nombre,
        email,
        codigo,
        "Registro de cuenta",
        `Gracias por unirte a SMUCKY'S BY CHAVARIN. Para completar tu registro ingresa el codigo que aparece abajo:`
    );
}

export async function enviarCodigoRecuperacion(nombre, email, codigo) {
    return _enviar(
        nombre,
        email,
        codigo,
        "Recuperacion de contrasena",
        `Recibimos una solicitud para restablecer la contrasena de tu cuenta. Usa el codigo de abajo para continuar:`
    );
}

// Exponer globalmente por si se carga sin module
window.CorreoCodigo = { enviarCodigoRegistro, enviarCodigoRecuperacion };


