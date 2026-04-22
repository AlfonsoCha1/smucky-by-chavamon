/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/login.js
//  QUÉ HACE: Login REAL con Firebase Auth
//    - Verifica email + contraseña contra Firebase
//    - Guarda uid, email y nombre en SmuckyAuth (localStorage)
//    - Redirige al usuario a donde iba o al inicio
//    - Muestra mensajes de error claros en español
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { enviarCodigoRecuperacion } from "../../servicios/correo-codigo.js";

const firebaseConfig = {
    apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
    authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
    projectId: "smuckys-by-chavamon-loginregis",
    storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
    messagingSenderId: "185108836763",
    appId: "1:185108836763:web:d7b923507c3c32e28e313e"
};

const app = getApps().find((item) => item.name === "auth-app")
    || initializeApp(firebaseConfig, "auth-app");
const auth = getAuth(app);
const db = getFirestore(app);

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

function mensajeError(code) {
    const errores = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/wrong-password": "Contraseña incorrecta. Inténtalo de nuevo.",
        "auth/invalid-email": "El correo no tiene un formato válido.",
        "auth/user-disabled": "Esta cuenta ha sido desactivada.",
        "auth/too-many-requests": "Demasiados intentos fallidos. Espera unos minutos.",
        "auth/invalid-credential": "Correo o contraseña incorrectos.",
        "auth/network-request-failed": "Sin conexión a internet. Revisa tu red."
    };

    return errores[code] || "Error al iniciar sesión. Intenta de nuevo.";
}

function mostrarError(msg) {
    let element = document.getElementById("loginError");

    if (!element) {
        element = document.createElement("p");
        element.id = "loginError";
        element.className = "login-error-message";
        document.getElementById("loginForm")?.appendChild(element);
    }

    element.textContent = msg;
    element.style.display = msg ? "block" : "none";
}

function mostrarRecovery(msg, isError = false) {
    const element = document.getElementById("recoveryNotice");
    if (!element) return;

    element.textContent = msg;
    element.style.display = msg ? "block" : "none";
    element.style.background = isError ? "#fdecef" : "#eaf9f4";
    element.style.borderColor = isError ? "#f1b6bf" : "#b8e6d7";
    element.style.color = isError ? "#7b1322" : "#0f5f4f";
}

document.querySelector(".note")?.remove();

let _recCodigo = "";
let _recEmail  = "";
let _recExpira = 0;

function generarCodigo6() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

document.getElementById("toggleRecovery")?.addEventListener("click", () => {
    const panel = document.getElementById("recoveryPanel");
    if (!panel) return;
    panel.hidden = !panel.hidden;
});

document.getElementById("sendRecoveryCode")?.addEventListener("click", async () => {
    mostrarRecovery("");

    const email  = document.getElementById("recoveryEmail")?.value.trim() || "";
    const button = document.getElementById("sendRecoveryCode");

    if (!email) {
        mostrarRecovery("Ingresa el correo de tu cuenta.", true);
        return;
    }

    if (button) { button.textContent = "Enviando enlace..."; button.disabled = true; }

    try {
        // ES: Manda el link de recuperación directo de Firebase, sin código intermedio.
        // EN: Sends the Firebase recovery link directly, without an intermediate code.
        await sendPasswordResetEmail(auth, email);
        mostrarRecovery("Te enviamos un enlace a tu correo para restablecer tu contraseña. Revisa tu bandeja de entrada.");
    } catch (err) {
        console.error("Error reset password:", err);
        if (err.code === "auth/user-not-found") {
            mostrarRecovery("No existe una cuenta con ese correo.", true);
        } else {
            mostrarRecovery("No se pudo enviar el enlace. Verifica el correo e intenta de nuevo.", true);
        }
    } finally {
        if (button) { button.textContent = "Enviar enlace"; button.disabled = false; }
    }
});

document.getElementById("verifyRecoveryCode")?.addEventListener("click", async () => {
    mostrarRecovery("");

    const ingresado = document.getElementById("recoveryCode")?.value.trim() || "";
    const btn       = document.getElementById("verifyRecoveryCode");

    if (!ingresado) {
        mostrarRecovery("Escribe el codigo que recibiste.", true);
        return;
    }
    if (Date.now() > _recExpira) {
        mostrarRecovery("El codigo vencio. Solicita uno nuevo.", true);
        _recCodigo = "";
        return;
    }
    if (ingresado !== _recCodigo) {
        mostrarRecovery("Codigo incorrecto. Intenta de nuevo.", true);
        return;
    }

    if (btn) { btn.textContent = "Enviando enlace..."; btn.disabled = true; }

    try {
        await sendPasswordResetEmail(auth, _recEmail);
        mostrarRecovery("Codigo correcto. Te enviamos un enlace a tu correo para restablecer tu contrasena.");
        _recCodigo = "";
        _recEmail  = "";
    } catch (err) {
        console.error("Error reset password:", err);
        mostrarRecovery("No se pudo enviar el enlace. Verifica el correo.", true);
    } finally {
        if (btn) { btn.textContent = "Validar y enviar enlace"; btn.disabled = false; }
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    mostrarError("");

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";
    const button = event.target.querySelector("button[type='submit']");

    if (!email || !password) {
        mostrarError("Completa todos los campos.");
        return;
    }

    if (button) {
        button.textContent = "Entrando...";
        button.disabled = true;
    }

    try {
        const credencial = await signInWithEmailAndPassword(auth, email, password);
        const user = credencial.user;
        const userSnap = await getDoc(doc(db, "usuarios", user.uid));
        const userData = userSnap.exists() ? userSnap.data() : {};

        const verificadoPorCodigo = userData?.email_verificado_por_codigo === true;
        const verificadoPorLink = user.emailVerified === true;
        if (!verificadoPorCodigo && !verificadoPorLink) {
            await signOut(auth);
            mostrarError("Tu cuenta aun no esta verificada. Completa tu verificacion por codigo antes de iniciar sesion.");
            if (button) {
                button.textContent = "Entrar";
                button.disabled = false;
            }
            return;
        }

        if (userSnap.exists()) {
            await updateDoc(doc(db, "usuarios", user.uid), {
                is_online: true,
                ultimo_acceso: serverTimestamp(),
                email_verificado_por_codigo: true,
                fecha_verificacion_codigo: serverTimestamp()
            });
        }

        if (window.SmuckyAuth) {
            // ES: Guarda TODOS los campos del perfil desde Firestore al iniciar sesión.
            //     Así el perfil sobrevive entre sesiones sin perderse.
            // EN: Saves ALL profile fields from Firestore on login.
            //     This way the profile survives between sessions without being lost.
            const existente = window.SmuckyAuth.getCurrentUser() || {};
            window.SmuckyAuth.saveUser({
                ...existente,
                uid:                user.uid,
                email:              user.email,
                nombre:             userData.nombre             || existente.nombre  || email.split("@")[0],
                ciudad:             userData.ciudad             || existente.ciudad  || "",
                rol:                userData.rol                || existente.rol     || "cliente",
                telefono:           userData.telefono           || existente.telefono           || "",
                telefono_numero:    userData.telefono_numero    || existente.telefono_numero    || "",
                telefono_codigo:    userData.telefono_codigo    || existente.telefono_codigo    || "",
                telefono_pais:      userData.telefono_pais      || existente.telefono_pais      || "MX",
                calle:              userData.calle              || existente.calle              || "",
                colonia:            userData.colonia            || existente.colonia            || "",
                estado:             userData.estado             || existente.estado             || "",
                cp:                 userData.cp                 || existente.cp                 || "",
                fecha_cumpleanos:   userData.fecha_cumpleanos   || existente.fecha_cumpleanos   || "",
                fecha_nacimiento:   userData.fecha_nacimiento   || existente.fecha_nacimiento   || "",
                loginAt: new Date().toISOString()
            });
        }

        const redirect = new URLSearchParams(window.location.search).get("redirect");
        window.location.href = redirect ? decodeURIComponent(redirect) : "../index.html";
    } catch (error) {
        console.error("Error login:", error.code, error.message);
        mostrarError(mensajeError(error.code));

        if (button) {
            button.textContent = "Entrar";
            button.disabled = false;
        }
    }
});