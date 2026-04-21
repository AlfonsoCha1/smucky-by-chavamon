/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/auth.js
//  ES: Módulo de autenticación de Smucky. Guarda y restaura los
//      datos del usuario en localStorage, sincroniza con Firebase
//      Auth y redirige al login cuando no existe sesión activa.
//  EN: Smucky authentication module. Saves and restores user data
//      in localStorage, syncs with Firebase Auth, and redirects to
//      login when no active session exists.
// ============================================================

(function () {
    const USER_KEY = "smucky_user";
    const firebaseConfig = {
        apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
        authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
        projectId: "smuckys-by-chavamon-loginregis",
        storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
        messagingSenderId: "185108836763",
        appId: "1:185108836763:web:d7b923507c3c32e28e313e"
    };

    let firebaseUserCache = null;

    // ES: Lee y devuelve el usuario almacenado en localStorage.
    // EN: Reads and returns the user stored in localStorage.
    function readStoredUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY) || "null");
        } catch {
            return null;
        }
    }

    // ES: Devuelve el usuario activo (localStorage o caché de Firebase).
    // EN: Returns the active user (localStorage or Firebase cache).
    function getCurrentUser() {
        return readStoredUser() || firebaseUserCache;
    }

    // ES: Indica si hay un usuario con sesión activa.
    // EN: Indicates whether there is a user with an active session.
    function isLoggedIn() {
        return !!getCurrentUser();
    }

    // ES: Guarda o actualiza los datos del usuario en localStorage y en el caché interno.
    // EN: Saves or updates user data in localStorage and in the internal cache.
    function saveUser(user) {
        const current = readStoredUser() || {};
        const nextUser = {
            ...current,
            ...user
        };

        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        firebaseUserCache = nextUser;
        return nextUser;
    }

    // ES: Elimina al usuario de localStorage y limpia el caché; cierra la sesión local.
    // EN: Removes the user from localStorage and clears the cache; closes the local session.
    function clearUser() {
        localStorage.removeItem(USER_KEY);
        firebaseUserCache = null;
    }

    // ES: Devuelve la ruta completa de la página actual (pathname + query + hash).
    // EN: Returns the full path of the current page (pathname + query + hash).
    function getCurrentPath() {
        return `${window.location.pathname}${window.location.search}${window.location.hash}`;
    }

    // ES: Construye la URL del login, detectando si estamos dentro de /cuenta/.
    // EN: Builds the login URL, detecting whether we are inside /cuenta/.
    function buildLoginUrl() {
        const currentUrl = new URL(window.location.href);
        const inAccountFolder = currentUrl.pathname.includes("/cuenta/");
        return new URL(inAccountFolder ? "login.html" : "cuenta/login.html", currentUrl.href);
    }

    // ES: Redirige al usuario al login guardando la URL actual como parámetro "redirect".
    // EN: Redirects the user to login, saving the current URL as the "redirect" parameter.
    function redirectToLogin() {
        const loginUrl = buildLoginUrl();
        loginUrl.searchParams.set("redirect", getCurrentPath());
        window.location.href = loginUrl.toString();
    }

    // ES: Sincroniza el estado de sesión con Firebase Auth. Si hay un usuario de Firebase
    //     activo, actualiza o crea su registro local en SmuckyAuth.
    // EN: Syncs the session state with Firebase Auth. If an active Firebase user exists,
    //     updates or creates their local record in SmuckyAuth.
    async function syncWithFirebaseAuth() {
        try {
            const [{ initializeApp, getApps }, { getAuth, onAuthStateChanged }] = await Promise.all([
                import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
                import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js")
            ]);

            const app = getApps().find((item) => item.name === "auth-app")
                || initializeApp(firebaseConfig, "auth-app");
            const auth = getAuth(app);

            return new Promise((resolve) => {
                onAuthStateChanged(auth, (firebaseUser) => {
                    if (!firebaseUser) {
                        firebaseUserCache = readStoredUser();
                        resolve(firebaseUserCache);
                        return;
                    }

                    // ES: Mantiene todos los campos ya guardados (dirección, teléfono, etc.)
                    //     y solo sobreescribe uid, email, nombre y rol desde Firebase Auth.
                    // EN: Preserves all already-saved fields (address, phone, etc.)
                    //     and only overwrites uid, email, name and role from Firebase Auth.
                    const existente = getCurrentUser() || {};
                    firebaseUserCache = saveUser({
                        ...existente,
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        nombre: existente.nombre || firebaseUser.displayName || (firebaseUser.email || "").split("@")[0],
                        rol: existente.rol || "cliente",
                        lastSeenAt: new Date().toISOString()
                    });
                    resolve(firebaseUserCache);
                });
            });
        } catch (error) {
            console.error("No se pudo sincronizar SmuckyAuth con Firebase:", error);
            firebaseUserCache = readStoredUser();
            return firebaseUserCache;
        }
    }

    window.SmuckyAuth = {
        getCurrentUser,
        isLoggedIn,
        saveUser,
        clearUser,
        redirectToLogin,
        ready: syncWithFirebaseAuth()
    };
})();