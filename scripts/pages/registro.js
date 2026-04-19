/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/registro.js  — SMUCKY´s By CHAVAMON
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

const PHONE_COUNTRIES = [
    { iso: "MX", code: "+52", name: "Mexico", flag: "🇲🇽" },
    { iso: "US", code: "+1", name: "Estados Unidos", flag: "🇺🇸" },
    { iso: "CA", code: "+1", name: "Canada", flag: "🇨🇦" },
    { iso: "AR", code: "+54", name: "Argentina", flag: "🇦🇷" },
    { iso: "BO", code: "+591", name: "Bolivia", flag: "🇧🇴" },
    { iso: "BR", code: "+55", name: "Brasil", flag: "🇧🇷" },
    { iso: "CL", code: "+56", name: "Chile", flag: "🇨🇱" },
    { iso: "CO", code: "+57", name: "Colombia", flag: "🇨🇴" },
    { iso: "CR", code: "+506", name: "Costa Rica", flag: "🇨🇷" },
    { iso: "EC", code: "+593", name: "Ecuador", flag: "🇪🇨" },
    { iso: "SV", code: "+503", name: "El Salvador", flag: "🇸🇻" },
    { iso: "ES", code: "+34", name: "España", flag: "🇪🇸" },
    { iso: "GT", code: "+502", name: "Guatemala", flag: "🇬🇹" },
    { iso: "HN", code: "+504", name: "Honduras", flag: "🇭🇳" },
    { iso: "NI", code: "+505", name: "Nicaragua", flag: "🇳🇮" },
    { iso: "PA", code: "+507", name: "Panama", flag: "🇵🇦" },
    { iso: "PY", code: "+595", name: "Paraguay", flag: "🇵🇾" },
    { iso: "PE", code: "+51", name: "Peru", flag: "🇵🇪" },
    { iso: "DO", code: "+1", name: "Republica Dominicana", flag: "🇩🇴" },
    { iso: "UY", code: "+598", name: "Uruguay", flag: "🇺🇾" },
    { iso: "VE", code: "+58", name: "Venezuela", flag: "🇻🇪" }
];

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

function getPhoneCountryByIso(iso) {
    return PHONE_COUNTRIES.find((item) => item.iso === String(iso || "").toUpperCase()) || PHONE_COUNTRIES[0];
}

function getFlagUrlByIso(iso) {
    return `https://flagcdn.com/w40/${String(iso || "mx").toLowerCase()}.png`;
}

function syncRegisterPhoneFlag(iso) {
    const select = document.getElementById("phoneCountry");
    if (!select) return;
    const wrap = select.closest(".phone-country-wrap");
    const country = getPhoneCountryByIso(iso);
    const countryName = country.name || country.iso;
    if (wrap) {
        wrap.setAttribute("data-code", country.code);
        wrap.setAttribute("data-flag", country.flag || "🏳️");
        wrap.setAttribute("data-country", countryName);
    }
    select.setAttribute("aria-label", `Pais del telefono: ${countryName}`);
}

function initCustomPhoneCountryPicker() {
    const select = document.getElementById("phoneCountry");
    if (!select || select.dataset.enhancedCountryPicker === "1") return;

    const wrap = select.closest(".phone-country-wrap");
    if (!wrap) return;

    select.dataset.enhancedCountryPicker = "1";
    wrap.classList.add("has-custom-country-picker");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "country-picker-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");

    const menu = document.createElement("ul");
    menu.className = "country-picker-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    PHONE_COUNTRIES.forEach((country) => {
        const item = document.createElement("li");
        item.setAttribute("role", "presentation");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "country-picker-option";
        btn.setAttribute("role", "option");
        btn.dataset.iso = country.iso;

        const flag = document.createElement("span");
        flag.className = "country-picker-flag";
        flag.style.backgroundImage = `url('${getFlagUrlByIso(country.iso)}')`;

        const label = document.createElement("span");
        label.className = "country-picker-label";
        label.textContent = `${country.name} (${country.code})`;

        btn.appendChild(flag);
        btn.appendChild(label);
        item.appendChild(btn);
        menu.appendChild(item);

        btn.addEventListener("click", () => {
            select.value = country.iso;
            syncRegisterPhoneFlag(country.iso);
            updateSelected();
            closeMenu();
            select.dispatchEvent(new Event("change", { bubbles: true }));
        });
    });

    wrap.appendChild(trigger);
    wrap.appendChild(menu);

    function closeMenu() {
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        wrap.classList.remove("is-open");
    }

    function openMenu() {
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        wrap.classList.add("is-open");
    }

    function updateSelected() {
        const country = getPhoneCountryByIso(select.value || "MX");
        trigger.innerHTML = `<span class="country-picker-flag" style="background-image:url('${getFlagUrlByIso(country.iso)}')"></span><span class="country-picker-code">${country.code}</span>`;
        menu.querySelectorAll(".country-picker-option").forEach((option) => {
            const selected = option.dataset.iso === country.iso;
            option.classList.toggle("is-selected", selected);
            option.setAttribute("aria-selected", selected ? "true" : "false");
        });
    }

    trigger.addEventListener("click", () => {
        if (menu.hidden) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!wrap.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    select.addEventListener("change", () => {
        syncRegisterPhoneFlag(select.value);
        updateSelected();
    });

    syncRegisterPhoneFlag(select.value || "MX");
    updateSelected();
}

function formatBirthdateTyping(rawDate) {
    const digits = String(rawDate || "").replace(/\D/g, "").slice(0, 8);
    if (!digits) return "";
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function normalizeBirthdate(rawDate) {
    const value = String(rawDate || "").trim();
    if (!value) return "";
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length !== 8) return value;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

const phoneCountrySelect = document.getElementById("phoneCountry");
initCustomPhoneCountryPicker();
syncRegisterPhoneFlag(phoneCountrySelect?.value || "MX");

const birthdateInput = document.getElementById("birthdate");
birthdateInput?.addEventListener("input", () => {
    birthdateInput.value = formatBirthdateTyping(birthdateInput.value);
});

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
    const phoneCountryIso = document.getElementById("phoneCountry")?.value || "MX";
    const phoneCountry    = getPhoneCountryByIso(phoneCountryIso);
    const phoneNumber     = document.getElementById("phone")?.value?.trim() || "";
    const phone           = phoneNumber ? `${phoneCountry.code} ${phoneNumber}` : "";
    const birthdate       = normalizeBirthdate(document.getElementById("birthdate")?.value || "");
    const street          = document.getElementById("street")?.value.trim() || "";
    const colonia         = document.getElementById("colonia")?.value.trim() || "";
    const state           = document.getElementById("state")?.value.trim() || "";
    const zip             = document.getElementById("zip")?.value.trim() || "";
    const codigoIngresado = document.getElementById("verificationCode")?.value.trim() || "";

    const btn = e.target.querySelector("button[type='submit']");

    // ── PASO 1: Validar y enviar código ──────────────────────
    const esNuevoEnvio = !datosPendientes || datosPendientes.email !== email;
    if (esNuevoEnvio) {

        if (!name || !email || !password || !city || !birthdate || !phoneNumber || !street || !colonia || !state || !zip) {
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
            datosPendientes  = {
                name,
                email,
                password,
                city,
                birthdate,
                phone,
                phoneNumber,
                phoneCode: phoneCountry.code,
                phoneCountry: phoneCountry.iso,
                street,
                colonia,
                state,
                zip
            };

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
            fecha_cumpleanos: datosPendientes.birthdate,
            fecha_nacimiento: datosPendientes.birthdate,
            telefono: datosPendientes.phone,
            telefono_numero: datosPendientes.phoneNumber,
            telefono_codigo: datosPendientes.phoneCode,
            telefono_pais: datosPendientes.phoneCountry,
            calle:    datosPendientes.street,
            colonia:  datosPendientes.colonia,
            estado:   datosPendientes.state,
            cp:       datosPendientes.zip,
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
                fecha_cumpleanos: datosPendientes.birthdate,
                fecha_nacimiento: datosPendientes.birthdate,
                telefono: datosPendientes.phone,
                telefono_numero: datosPendientes.phoneNumber,
                telefono_codigo: datosPendientes.phoneCode,
                telefono_pais: datosPendientes.phoneCountry,
                calle: datosPendientes.street,
                colonia: datosPendientes.colonia,
                estado: datosPendientes.state,
                cp: datosPendientes.zip,
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