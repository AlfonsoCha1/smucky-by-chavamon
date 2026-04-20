/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/login.js
//  QUÃ‰ HACE: Login REAL con Firebase Auth
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

    if (button) {
        button.textContent = "Enviando codigo...";
        button.disabled = true;
    }

    try {
        _recCodigo = generarCodigo6();
        _recEmail  = email;
        _recExpira = Date.now() + 10 * 60 * 1000;

        const nombreGuess = email.split("@")[0];
        await enviarCodigoRecuperacion(nombreGuess, email, _recCodigo);

        // Mostrar campo de código dentro del panel de recuperación
        const wrap = document.getElementById("recoveryVerifyWrap");
        if (wrap) wrap.removeAttribute("hidden");

        mostrarRecovery("Te enviamos un codigo a tu correo. Escribelo abajo para continuar.");
    } catch (error) {
        console.error("Error recuperacion:", error.code || error, error.message);
        mostrarRecovery("No se pudo enviar el enlace de recuperacion. Verifica el correo.", true);
    } finally {
        if (button) {
            button.textContent = "Enviar codigo";
            button.disabled = false;
        }
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
            window.SmuckyAuth.saveUser({
                uid: user.uid,
                email: user.email,
                nombre: userData.nombre || email.split("@")[0],
                ciudad: userData.ciudad || "",
                rol: userData.rol || "cliente",
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

