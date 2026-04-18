/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/registro.js  — SMUCKY'S BY CHAVARIN
//
//  Incluye:
//    ✅ Validación de contraseña (8 car., 1 mayús., 2 núm., 1 símbolo)
//    ✅ Código de verificación por correo (plantilla de bienvenida)
//    ✅ Guarda hash SHA-256 de la contraseña en Firestore
//    ✅ Impide reutilizar contraseñas usadas en el último mes
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
    authDomain:        "smuckys-by-chavamon-loginregis.firebaseapp.com",
    projectId:         "smuckys-by-chavamon-loginregis",
    storageBucket:     "smuckys-by-chavamon-loginregis.firebasestorage.app",
    messagingSenderId: "185108836763",
    appId:             "1:185108836763:web:d7b923507c3c32e28e313e",
    measurementId:     "G-ZL3DD1KGH8"
};

const app  = getApps().find(a => a.name === "auth-app") || initializeApp(firebaseConfig, "auth-app");
const auth = getAuth(app);
const db   = getFirestore(app);
let datosPendientes = null;

function obtenerAuthApiBase() {
    const globalBase = (window.SMUCKY_AUTH_API_BASE || "").trim();
    if (globalBase) return globalBase.replace(/\/+$/, "");
    if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        return "http://127.0.0.1:8000";
    }
    return "";
}

async function enviarCodigoRegistroBackend(nombre, email) {
    const payload = { nombre, email };
    const base = obtenerAuthApiBase();
    const url = `${base}/auth/registro/enviar-codigo`;

    console.info("[registro][frontend->backend][enviar-codigo]", { url, payload });

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.detail || "No se pudo enviar el codigo desde el backend.");
    }
    return data;
}

async function verificarCodigoRegistroBackend(email, codigo) {
    const payload = { email, codigo };
    const base = obtenerAuthApiBase();
    const url = `${base}/auth/registro/verificar-codigo`;

    console.info("[registro][frontend->backend][verificar-codigo]", { url, payload });

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.detail || "No se pudo verificar el codigo.");
    }
    return data;
}

function inicializarOjoContrasena() {
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.getAttribute("data-target");
            if (!targetId) return;

            const input = document.getElementById(targetId);
            if (!input) return;

            const visible = input.type === "text";
            input.type = visible ? "password" : "text";
            toggle.classList.toggle("is-visible", !visible);
            toggle.setAttribute("aria-label", visible ? "Mostrar contrasena" : "Ocultar contrasena");
        });
    });
}

inicializarOjoContrasena();

// ── Generar hash SHA-256 de la contraseña (nunca se guarda en texto plano) ──
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data    = encoder.encode(password);
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Reglas de contraseña ─────────────────────────────────────
// Devuelve lista de errores. Si está vacía, la contraseña es válida.
function validarContrasena(password) {
    const errores = [];
    if (password.length < 8)                                        errores.push("Mínimo 8 caracteres");
    if (!/[A-ZÁÉÍÓÚÜÑ]/.test(password))                            errores.push("Al menos 1 letra mayúscula");
    if ((password.match(/[0-9]/g) || []).length < 2)               errores.push("Al menos 2 números");
    if (!/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]/.test(password))            errores.push("Al menos 1 símbolo (!@#$%...)");
    if (!/[a-záéíóúüñ]/.test(password))                            errores.push("Al menos 1 letra minúscula");
    return errores;
}

// ── Mensajes de error de Firebase ───────────────────────────
function mensajeError(code) {
    return {
        "auth/email-already-in-use":    "Ese correo ya está registrado. Inicia sesión o usa otro.",
        "auth/invalid-email":           "El correo no tiene un formato válido.",
        "auth/weak-password":           "La contraseña es demasiado débil.",
        "auth/network-request-failed":  "Sin conexión a internet. Revisa tu red."
    }[code] || "No se pudo crear la cuenta. Intenta de nuevo.";
}

function mostrarError(msg) {
    const el = document.getElementById("regError");
    if (!el) return;
    el.textContent    = msg;
    el.style.display  = msg ? "block" : "none";
}

function mostrarAviso(msg) {
    const el = document.getElementById("regNotice");
    if (!el) return;
    el.textContent   = msg;
    el.style.display = msg ? "block" : "none";
}

function mostrarCampoCodigo(mostrar = true) {
    const wrap = document.getElementById("verificationWrap");
    if (!wrap) return;
    wrap.hidden = !mostrar;
}

// ════════════════════════════════════════════════════════════
//  SUBMIT DEL FORMULARIO
// ════════════════════════════════════════════════════════════
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    mostrarError("");
    mostrarAviso("");

    const name     = document.getElementById("name")?.value.trim()     || "";
    const email    = document.getElementById("newEmail")?.value.trim() || "";
    const password = document.getElementById("newPassword")?.value     || "";
    const confirmEl = document.getElementById("confirmPassword");
    const confirm  = confirmEl ? confirmEl.value : password;
    const city     = document.getElementById("city")?.value.trim()     || "";
    const phone    = document.getElementById("phone")?.value?.trim()   || "";
    const codigoIngresado = document.getElementById("verificationCode")?.value.trim() || "";

    // Validar campos vacíos
    if (!name || !email || !password || !city) {
        mostrarError("Por favor completa todos los campos."); return;
    }

    // Validar contraseña
    const erroresPass = validarContrasena(password);
    if (erroresPass.length > 0) {
        mostrarError("Contraseña insegura: " + erroresPass.join(", ")); return;
    }

    // Confirmar que coincide
    if (password !== confirm) {
        mostrarError("Las contraseñas no coinciden."); return;
    }

    const btn = e.target.querySelector("button[type='submit']");
    if (btn) {
        btn.textContent = "Procesando...";
        btn.disabled = true;
    }

    const esNuevoEnvio = !datosPendientes || datosPendientes.email !== email;
    if (esNuevoEnvio) {
        try {
            datosPendientes = { name, email, password, city, phone };
            await enviarCodigoRegistroBackend(name, email);
            mostrarCampoCodigo(true);
            mostrarAviso(`Te enviamos un codigo a ${email}. Escribelo abajo para completar tu registro.`);

            if (btn) {
                btn.textContent = "Verificar codigo y crear cuenta";
                btn.disabled = false;
            }
            return;
        } catch (mailError) {
            console.error("No se pudo enviar el correo de codigo:", mailError);
            mostrarError("No se pudo enviar el codigo. Revisa tu correo e intenta de nuevo. (Error: " + (mailError?.text || mailError?.message || "desconocido") + ")");
            if (btn) {
                btn.textContent = "Crear cuenta";
                btn.disabled = false;
            }
            return;
        }
    }

    if (!codigoIngresado) {
        mostrarError("Escribe el codigo que recibiste en tu correo.");
        if (btn) {
            btn.textContent = "Verificar codigo y crear cuenta";
            btn.disabled = false;
        }
        return;
    }

    try {
        await verificarCodigoRegistroBackend(email, codigoIngresado);
    } catch (verifyError) {
        mostrarError(verifyError?.message || "Codigo incorrecto o expirado.");
        if (btn) {
            btn.textContent = "Verificar codigo y crear cuenta";
            btn.disabled = false;
        }
        return;
    }

    try {
        // Hash de la contraseña para guardar el historial (nunca texto plano)
        const hashPass = await hashPassword(datosPendientes.password);
        const ahora    = new Date().toISOString();

        const userCredential = await createUserWithEmailAndPassword(auth, datosPendientes.email, datosPendientes.password);
        const user           = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            nombre:   datosPendientes.name,
            email:    user.email,
            ciudad:   datosPendientes.city,
            telefono: datosPendientes.phone,
            rol:      "cliente",
            codigo_verificacion_registro: codigoIngresado,
            email_verificado_por_codigo: true,
            fecha_verificacion_codigo: serverTimestamp(),
            fecha_registro: serverTimestamp(),
            // Historial de contraseñas: máx 5 entradas, con fecha
            historial_contrasenas: [{ hash: hashPass, fecha: ahora }]
        });

        if (window.SmuckyAuth) {
            window.SmuckyAuth.saveUser({
                uid: user.uid, nombre: datosPendientes.name, email: user.email,
                ciudad: datosPendientes.city, rol: "cliente", createdAt: ahora
            });
        }

        mostrarAviso("Cuenta creada y verificada por codigo. Redirigiendo a inicio de sesion...");
        datosPendientes = null;
        mostrarCampoCodigo(false);
        await signOut(auth);
        window.location.href = "login.html";

    } catch (error) {
        console.error("Error al registrar:", error.code, error.message);
        mostrarError(mensajeError(error.code));
        if (btn) { btn.textContent = "Crear cuenta"; btn.disabled = false; }
    }
});

