/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/registro.js  — SMUCKY'S BY CHAVAMON
//
//  ✅ Validación de contraseña (8 car., 1 mayús., 2 núm., 1 símbolo)
//  ✅ Código de verificación enviado por EmailJS (Gmail) — SIN backend
//  ✅ Guarda hash SHA-256 de la contraseña en Firestore
//  ✅ Registro en Firebase Auth + Firestore
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Configuración Firebase ───────────────────────────────────
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

// ── Configuración EmailJS (cuenta Gmail — verificación) ──────
const EMAILJS_PUBLIC_KEY  = "FbiFKIiqS9841M71D";     // ← Public Key de la cuenta Gmail
const EMAILJS_SERVICE_ID  = "smuckyschavamon_gmail";  // ← Servicio Gmail en EmailJS
const EMAILJS_TEMPLATE_ID = "template_fey9ch4";       // ← Template: código de verificación

// ── Estado temporal del registro pendiente ───────────────────
let datosPendientes  = null; // guarda datos del formulario hasta verificar
let codigoPendiente  = null; // guarda el código generado
let codigoExpira     = null; // timestamp de expiración (10 minutos)

// ── Carga EmailJS una sola vez ───────────────────────────────
let _ejsListo = false;
function cargarEmailJS() {
    return new Promise((resolve, reject) => {
        if (_ejsListo && window.emailjs) { resolve(); return; }
        const s    = document.createElement("script");
        s.src      = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload   = () => {
            _ejsListo = true;
            resolve();
        };
        s.onerror  = reject;
        document.head.appendChild(s);
    });
}

// ── Genera un código numérico de 6 dígitos ───────────────────
function generarCodigo6() {
    return String(Math.floor(100000 + Math.random() * 900000)); // ej: "483920"
}

// ── Envía el código de verificación por EmailJS (Gmail) ──────
async function enviarCodigoVerificacion(nombre, email, codigo) {
    await cargarEmailJS(); // asegura que EmailJS esté listo

    await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
            email:              email,   // correo destino del usuario
            user_name:          nombre,  // nombre del usuario
            verification_code:  codigo,  // código de 6 dígitos
            expiration_minutes: "10"     // minutos de validez
        },
        { publicKey: EMAILJS_PUBLIC_KEY } // ← key de Gmail directo aquí
    );
}

// ── Muestra/oculta el campo del código de verificación ───────
function mostrarCampoCodigo(mostrar = true) {
    const wrap = document.getElementById("verificationWrap");
    if (!wrap) return;
    wrap.hidden = !mostrar;
}

// ── Muestra mensaje de error ─────────────────────────────────
function mostrarError(msg) {
    const el = document.getElementById("regError");
    if (!el) return;
    el.textContent   = msg;
    el.style.display = msg ? "block" : "none";
}

// ── Muestra mensaje de aviso/éxito ───────────────────────────
function mostrarAviso(msg) {
    const el = document.getElementById("regNotice");
    if (!el) return;
    el.textContent   = msg;
    el.style.display = msg ? "block" : "none";
}

// ── Botón para mostrar/ocultar contraseña ────────────────────
function inicializarOjoContrasena() {
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const targetId = toggle.getAttribute("data-target");
            if (!targetId) return;
            const input   = document.getElementById(targetId);
            if (!input) return;
            const visible = input.type === "text";
            input.type    = visible ? "password" : "text";
            toggle.classList.toggle("is-visible", !visible);
            toggle.setAttribute("aria-label", visible ? "Mostrar contrasena" : "Ocultar contrasena");
        });
    });
}
inicializarOjoContrasena();

// ── Genera hash SHA-256 de la contraseña (nunca texto plano) ─
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data    = encoder.encode(password);
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Valida reglas de contraseña ──────────────────────────────
function validarContrasena(password) {
    const errores = [];
    if (password.length < 8)                                     errores.push("Mínimo 8 caracteres");
    if (!/[A-ZÁÉÍÓÚÜÑ]/.test(password))                         errores.push("Al menos 1 letra mayúscula");
    if ((password.match(/[0-9]/g) || []).length < 2)             errores.push("Al menos 2 números");
    if (!/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]/.test(password))          errores.push("Al menos 1 símbolo (!@#$%...)");
    if (!/[a-záéíóúüñ]/.test(password))                         errores.push("Al menos 1 letra minúscula");
    return errores;
}

// ── Mensajes de error de Firebase ───────────────────────────
function mensajeError(code) {
    return {
        "auth/email-already-in-use":   "Ese correo ya está registrado. Inicia sesión o usa otro.",
        "auth/invalid-email":          "El correo no tiene un formato válido.",
        "auth/weak-password":          "La contraseña es demasiado débil.",
        "auth/network-request-failed": "Sin conexión a internet. Revisa tu red."
    }[code] || "No se pudo crear la cuenta. Intenta de nuevo.";
}

// ════════════════════════════════════════════════════════════
//  SUBMIT DEL FORMULARIO — dos pasos:
//  Paso 1: validar → enviar código por EmailJS (Gmail)
//  Paso 2: verificar código → registrar en Firebase
// ════════════════════════════════════════════════════════════
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    mostrarError("");
    mostrarAviso("");

    const name            = document.getElementById("name")?.value.trim()     || "";
    const email           = document.getElementById("newEmail")?.value.trim() || "";
    const password        = document.getElementById("newPassword")?.value     || "";
    const confirmEl       = document.getElementById("confirmPassword");
    const confirm         = confirmEl ? confirmEl.value : password;
    const city            = document.getElementById("city")?.value.trim()     || "";
    const phone           = document.getElementById("phone")?.value?.trim()   || "";
    const codigoIngresado = document.getElementById("verificationCode")?.value.trim() || "";

    const btn = e.target.querySelector("button[type='submit']");

    // ── PASO 1: Validar y enviar código ──────────────────────
    const esNuevoEnvio = !datosPendientes || datosPendientes.email !== email;
    if (esNuevoEnvio) {

        if (!name || !email || !password || !city) {
            mostrarError("Por favor completa todos los campos."); return;
        }

        const erroresPass = validarContrasena(password);
        if (erroresPass.length > 0) {
            mostrarError("Contraseña insegura: " + erroresPass.join(", ")); return;
        }

        if (password !== confirm) {
            mostrarError("Las contraseñas no coinciden."); return;
        }

        if (btn) { btn.textContent = "Enviando código..."; btn.disabled = true; }

        try {
            codigoPendiente  = generarCodigo6();
            codigoExpira     = Date.now() + 10 * 60 * 1000; // 10 minutos
            datosPendientes  = { name, email, password, city, phone };

            await enviarCodigoVerificacion(name, email, codigoPendiente);

            mostrarCampoCodigo(true);
            mostrarAviso(`Te enviamos un código a ${email}. Escríbelo abajo para completar tu registro.`);
            if (btn) { btn.textContent = "Verificar código y crear cuenta"; btn.disabled = false; }
            return;

        } catch (mailError) {
            console.error("No se pudo enviar el correo:", mailError);
            mostrarError("No se pudo enviar el código. Verifica tu correo e intenta de nuevo. (Error: " + (mailError?.text || mailError?.message || "desconocido") + ")");
            if (btn) { btn.textContent = "Crear cuenta"; btn.disabled = false; }
            return;
        }
    }

    // ── PASO 2: Verificar código y registrar en Firebase ─────
    if (!codigoIngresado) {
        mostrarError("Escribe el código que recibiste en tu correo.");
        if (btn) { btn.textContent = "Verificar código y crear cuenta"; btn.disabled = false; }
        return;
    }

    if (Date.now() > codigoExpira) {
        mostrarError("El código venció. Intenta registrarte de nuevo.");
        datosPendientes = null;
        codigoPendiente = null;
        mostrarCampoCodigo(false);
        if (btn) { btn.textContent = "Crear cuenta"; btn.disabled = false; }
        return;
    }

    if (codigoIngresado !== codigoPendiente) {
        mostrarError("Código incorrecto. Intenta de nuevo.");
        if (btn) { btn.textContent = "Verificar código y crear cuenta"; btn.disabled = false; }
        return;
    }

    if (btn) { btn.textContent = "Creando cuenta..."; btn.disabled = true; }

    try {
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
            codigo_verificacion_registro:   codigoIngresado,
            email_verificado_por_codigo:    true,
            fecha_verificacion_codigo:      serverTimestamp(),
            fecha_registro:                 serverTimestamp(),
            historial_contrasenas: [{ hash: hashPass, fecha: ahora }]
        });

        if (window.SmuckyAuth) {
            window.SmuckyAuth.saveUser({
                uid:    user.uid,
                nombre: datosPendientes.name,
                email:  user.email,
                ciudad: datosPendientes.city,
                rol:    "cliente",
                createdAt: ahora
            });
        }

        mostrarAviso("¡Cuenta creada y verificada! Redirigiendo a inicio de sesión...");
        datosPendientes = null;
        codigoPendiente = null;
        mostrarCampoCodigo(false);
        await signOut(auth);
        window.location.href = "login.html";

    } catch (error) {
        console.error("Error al registrar:", error.code, error.message);
        mostrarError(mensajeError(error.code));
        if (btn) { btn.textContent = "Crear cuenta"; btn.disabled = false; }
    }
});