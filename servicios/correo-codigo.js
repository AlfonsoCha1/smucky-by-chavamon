/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/correo-codigo.js  — SMUCKY'S BY CHAVAMON
//  Envía códigos de verificación y recuperación via EmailJS (Gmail)
//  Cuenta Gmail separada de Hotmail (compras)
// ============================================================

// ── Credenciales EmailJS (cuenta Gmail — verificación) ───────
const EMAILJS_PUBLIC_KEY  = "FbiFKliqS9841M71D";    // Public Key de la cuenta Gmail
const EMAILJS_SERVICE_ID  = "smuckyschavamon_gmail"; // Servicio Gmail en EmailJS
const EMAILJS_TEMPLATE_VERIFICACION = "template_fey9ch4";  // Template: código de verificación
const EMAILJS_TEMPLATE_RECUPERACION = "template_rkr5dld";  // Template: recuperar contraseña

// ── Carga EmailJS una sola vez ───────────────────────────────
let _ejsListo = false;
function cargarEmailJS() {
    return new Promise((resolve, reject) => {
        if (_ejsListo && window.emailjs) { resolve(); return; }
        const s    = document.createElement("script");
        s.src      = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload   = () => {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); // inicializa con key de Gmail
            _ejsListo = true;
            resolve();
        };
        s.onerror  = reject;
        document.head.appendChild(s);
    });
}

// ── Envía código de verificación al registrarse ──────────────
export async function enviarCodigoRegistro(nombre, email, codigo) {
    try {
        await cargarEmailJS();

        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_VERIFICACION, {
            user_name:          nombre,  // nombre del usuario
            email:              email,   // correo destino
            verification_code:  codigo,  // código de 6 dígitos
            expiration_minutes: "10"     // minutos de validez
        });

        console.log("✅ Código de verificación enviado a:", email);
        return { ok: true };

    } catch (err) {
        console.error("❌ Error al enviar código de verificación:", err);
        throw err;
    }
}

// ── Envía correo de recuperación de contraseña ───────────────
export async function enviarCodigoRecuperacion(nombre, email, codigo) {
    try {
        await cargarEmailJS();

        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_RECUPERACION, {
            user_name:  nombre,  // nombre del usuario
            email:      email,   // correo destino
            reset_link: `Tu código de recuperación es: ${codigo} (vence en 10 minutos)` // código como texto
        });

        console.log("✅ Código de recuperación enviado a:", email);
        return { ok: true };

    } catch (err) {
        console.error("❌ Error al enviar código de recuperación:", err);
        throw err;
    }
}

// ── Exponer globalmente ───────────────────────────────────────
window.CorreoCodigo = { enviarCodigoRegistro, enviarCodigoRecuperacion };