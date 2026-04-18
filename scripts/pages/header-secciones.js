/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/header-secciones.js
//  ES: Header comÃºn para pÃ¡ginas internas (ayuda, cuenta, info).
//      Mantiene acceso rÃ¡pido al perfil del usuario logueado.
//  EN: Common header for internal pages (help, account, info).
//      Maintains quick access to the logged-in user profile.
// ============================================================

(function () {
    // ES: Espera a que el sistema de autenticaciÃ³n estÃ© listo.
    // EN: Waits for the authentication system to be ready.
    async function waitForAuthReady() {
        if (!window.SmuckyAuth) {
            return;
        }
        try {
            if (window.SmuckyAuth.ready && typeof window.SmuckyAuth.ready.then === "function") {
                await window.SmuckyAuth.ready;
            }
        } catch (error) {
            console.warn("No se pudo sincronizar el estado de sesion en header:", error);
        }
    }

    // ES: Extrae la primera letra del email o nombre para mostrar en el botÃ³n.
    // EN: Extracts the first letter of email or name to display on button.
    function getInitial(emailOrName) {
        const value = String(emailOrName || "").trim();
        return value ? value.charAt(0).toUpperCase() : "P";
    }

    // ES: Inicializa el botÃ³n de perfil del header interno. Si hay usuario logueado,
    //     muestra su inicial o nombre. Si no, muestra "P" (Para Login).
    // EN: Initializes the profile button in the internal header. If user is logged,
    //     shows their initial or name. Otherwise, shows "P" (For Login).
    async function initSectionHeader() {
        const profileBtn = document.getElementById("sectionProfileBtn");
        if (!profileBtn) {
            return;
        }

        const symbolNode = profileBtn.querySelector(".icon-btn-symbol");

        await waitForAuthReady();

        const user = window.SmuckyAuth?.getCurrentUser?.();
        if (user) {
            if (symbolNode) {
                symbolNode.textContent = "\uD83D\uDC64";
            } else {
                profileBtn.textContent = getInitial(user.nombre || user.email);
            }
            profileBtn.title = "Ir a mi perfil";
            profileBtn.setAttribute("aria-label", "Ir a mi perfil");
        } else {
            if (symbolNode) {
                symbolNode.textContent = "\uD83D\uDC64";
            } else {
                profileBtn.textContent = "P";
            }
            profileBtn.title = "Iniciar sesion";
            profileBtn.setAttribute("aria-label", "Iniciar sesion");
        }

        // ES: Redirige al perfil si hay sesiÃ³n, sino al login.
        // EN: Redirects to profile if logged in, otherwise to login.
        profileBtn.addEventListener("click", () => {
            const currentUser = window.SmuckyAuth?.getCurrentUser?.();
            window.location.href = currentUser ? "../cuenta/perfil.html" : "../cuenta/login.html";
        });
    }

    window.addEventListener("DOMContentLoaded", initSectionHeader);
})();

