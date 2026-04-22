/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/correo-codigo.js  — SMUCKY´s By CHAVAMON
//  Envía códigos de verificación y recuperación via EmailJS (Gmail)
//  Cuenta Gmail separada de Hotmail (compras)
// ============================================================

// ── Credenciales EmailJS (cuenta Gmail — verificación) ───────
const EMAILJS_PUBLIC_KEY = "FbiFKIiqS9841M71D"; // ← I mayúscula, no l minúscula
const EMAILJS_SERVICE_ID  = "smuckyschavamon_gmail"; // Servicio Gmail en EmailJS
const EMAILJS_TEMPLATE_VERIFICACION = "template_fey9ch4";  // Template: código de verificación
const EMAILJS_TEMPLATE_RECUPERACION = "template_rkr5dld";  // Template: recuperar contraseña

// ── Carga EmailJS una sola vez ───────────────────────────────
// ── Carga EmailJS una sola vez (cuenta Gmail) ────────────────
let _ejsListoGmail = false; // ← nombre diferente para no chocar con Hotmail
function cargarEmailJS() {
    return new Promise((resolve, reject) => {
        if (_ejsListoGmail && window.emailjs) {
            // Reinicializa siempre con la key de Gmail
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
            resolve();
            return;
        }
        const s    = document.createElement("script");
        s.src      = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload   = () => {
            window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); // key de Gmail
            _ejsListoGmail = true;
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

        await window.emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_VERIFICACION,
            {
                user_name:          nombre,
                email:              email,
                verification_code:  codigo,
                expiration_minutes: "10"
            },
            { publicKey: EMAILJS_PUBLIC_KEY } // ← key de Gmail directo en el send
        );

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

        // ES: Manda el código de 6 dígitos al usuario.
        //     reset_link muestra el código visualmente en la plantilla.
        //     El link real de Firebase lo manda Firebase directamente en un segundo correo.
        // EN: Sends the 6-digit code to the user.
        //     reset_link shows the code visually in the template.
        //     The real Firebase link is sent by Firebase directly in a second email.
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_RECUPERACION, {
            user_name:          nombre,
            email:              email,
            verification_code:  String(codigo),
            reset_link:         `Tu código de recuperación es: <strong style="font-size:28px;letter-spacing:6px;color:#6CCB3D;">${codigo}</strong><br><small>Vence en 10 minutos. No lo compartas.</small>`
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