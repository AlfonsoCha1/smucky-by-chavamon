/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/header-secciones.js
//  ES: Header común para páginas internas.
//      Conecta los botones de carrito, favoritos y buscador
//      con SmuckyCart y SmuckyFavs para mostrar contadores
//      y modales sincronizados con la pantalla principal.
//  EN: Common header for internal pages.
//      Connects cart, favorites and search buttons
//      with SmuckyCart and SmuckyFavs to show counters
//      and modals synced with the main screen.
// ============================================================

(function () {

    // ── Helpers ───────────────────────────────────────────────
    function waitForSmucky() {
        return new Promise((resolve) => {
            if (window.SmuckyCart && window.SmuckyFavs) { resolve(); return; }
            const t = setInterval(() => {
                if (window.SmuckyCart && window.SmuckyFavs) { clearInterval(t); resolve(); }
            }, 100);
        });
    }

    async function waitForAuthReady() {
        if (!window.SmuckyAuth) return;
        try {
            if (window.SmuckyAuth.ready && typeof window.SmuckyAuth.ready.then === "function") {
                await window.SmuckyAuth.ready;
            }
        } catch (e) {
            console.warn("Header auth sync:", e);
        }
    }

    function getInitial(emailOrName) {
        const value = String(emailOrName || "").trim();
        return value ? value.charAt(0).toUpperCase() : "P";
    }

    // ── Actualiza badges de carrito y favoritos ──────────────
    function updateSectionBadges() {
        if (!window.SmuckyCart || !window.SmuckyFavs) return;

        const cartCount = window.SmuckyCart.getCount();
        const favCount  = window.SmuckyFavs.getCount();

        const cartBadge = document.getElementById("sectionCartCount");
        const favBadge  = document.getElementById("sectionFavCount");

        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = cartCount > 0 ? "flex" : "none";
        }
        if (favBadge) {
            favBadge.textContent = favCount;
            favBadge.style.display = favCount > 0 ? "flex" : "none";
        }
    }

    // ── Renderiza items del carrito en el modal ──────────────
    function renderSectionCart() {
        const container = document.getElementById("sectionCartItems");
        const totalEl   = document.getElementById("sectionCartTotal");
        if (!container || !window.SmuckyCart) return;

        const cart = window.SmuckyCart.getCart();
        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align:center;color:#888;padding:24px 0;">Tu carrito está vacío</p>`;
            if (totalEl) totalEl.textContent = "0.00";
            return;
        }

        cart.forEach(item => {
            const div = document.createElement("div");
            div.style.cssText = "display:flex;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;";
            div.innerHTML = `
                <img src="${item.image || ''}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;background:#f5f5f5;">
                <div style="flex:1;min-width:0;">
                    <p style="margin:0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#666;">$${Number(item.price).toFixed(2)} × ${item.qty}</p>
                </div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                    <p style="margin:0;font-size:13px;font-weight:700;">$${(item.price * item.qty).toFixed(2)}</p>
                    <button data-remove-id="${item.id}" style="background:none;border:none;color:#e53e3e;cursor:pointer;font-size:12px;">Quitar</button>
                </div>
            `;
            container.appendChild(div);
        });

        // Quitar item
        container.querySelectorAll("[data-remove-id]").forEach(btn => {
            btn.addEventListener("click", () => {
                window.SmuckyCart.removeItem(btn.dataset.removeId);
                renderSectionCart();
                updateSectionBadges();
            });
        });

        const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
        if (totalEl) totalEl.textContent = total.toFixed(2);
    }

    // ── Renderiza favoritos en el modal ──────────────────────
    function renderSectionFavs() {
        const container = document.getElementById("sectionFavItems");
        if (!container || !window.SmuckyFavs) return;

        const favs = window.SmuckyFavs.getFavs();
        container.innerHTML = "";

        if (favs.length === 0) {
            container.innerHTML = `<p style="text-align:center;color:#888;padding:24px 0;">No tienes favoritos guardados</p>`;
            return;
        }

        favs.forEach(item => {
            const div = document.createElement("div");
            div.style.cssText = "display:flex;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid #f0f0f0;";
            div.innerHTML = `
                <img src="${item.image || ''}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:6px;background:#f5f5f5;">
                <div style="flex:1;min-width:0;">
                    <p style="margin:0;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#666;">$${Number(item.price).toFixed(2)}</p>
                </div>
                <button data-fav-id="${item.id}" style="background:none;border:none;color:#e53e3e;cursor:pointer;font-size:12px;">Quitar</button>
            `;
            container.appendChild(div);
        });

        container.querySelectorAll("[data-fav-id]").forEach(btn => {
            btn.addEventListener("click", () => {
                window.SmuckyFavs.toggle({ id: btn.dataset.favId });
                renderSectionFavs();
                updateSectionBadges();
            });
        });
    }

    // ── Buscador de pedidos ──────────────────────────────────
    function initSectionSearch() {
        const searchBtn   = document.getElementById("sectionSearchBtn");
        const searchWrap  = document.getElementById("sectionSearchWrap");
        const searchInput = document.getElementById("sectionSearchInput");
        const searchClose = document.getElementById("sectionSearchClose");
        const ordersGrid  = document.getElementById("ordersGrid");

        if (!searchBtn || !searchWrap || !searchInput) return;

        searchBtn.addEventListener("click", () => {
            searchWrap.style.display = "flex";
            searchBtn.style.display  = "none";
            searchInput.focus();
        });

        searchClose.addEventListener("click", () => {
            searchWrap.style.display = "none";
            searchBtn.style.display  = "flex";
            searchInput.value = "";
            // Muestra todos los pedidos
            if (ordersGrid) {
                ordersGrid.querySelectorAll(".order-card").forEach(c => c.style.display = "");
            }
        });

        // ES: Filtra las tarjetas de pedidos por nombre de producto o código de pedido.
        // EN: Filters order cards by product name or order code.
        searchInput.addEventListener("input", () => {
            if (!ordersGrid) return;
            const term = searchInput.value.trim().toLowerCase();
            ordersGrid.querySelectorAll(".order-card").forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = (!term || text.includes(term)) ? "" : "none";
            });
        });
    }

    // ── Modal carrito ────────────────────────────────────────
    function initSectionCartModal() {
        const cartBtn   = document.getElementById("sectionCartBtn");
        const cartModal = document.getElementById("sectionCartModal");
        const cartClose = document.getElementById("sectionCartClose");
        if (!cartBtn || !cartModal) return;

        cartBtn.addEventListener("click", () => {
            renderSectionCart();
            cartModal.style.display = "flex";
        });

        cartClose?.addEventListener("click", () => cartModal.style.display = "none");
        cartModal.addEventListener("click", e => { if (e.target === cartModal) cartModal.style.display = "none"; });
    }

    // ── Modal favoritos ──────────────────────────────────────
    function initSectionFavModal() {
        const favBtn   = document.getElementById("sectionFavBtn");
        const favModal = document.getElementById("sectionFavModal");
        const favClose = document.getElementById("sectionFavClose");
        if (!favBtn || !favModal) return;

        favBtn.addEventListener("click", () => {
            renderSectionFavs();
            favModal.style.display = "flex";
        });

        favClose?.addEventListener("click", () => favModal.style.display = "none");
        favModal.addEventListener("click", e => { if (e.target === favModal) favModal.style.display = "none"; });
    }

    // ── Botón de perfil ──────────────────────────────────────
    async function initSectionHeader() {
        const profileBtn = document.getElementById("sectionProfileBtn");
        if (profileBtn) {
            const symbolNode = profileBtn.querySelector(".icon-btn-symbol");
            await waitForAuthReady();
            const user = window.SmuckyAuth?.getCurrentUser?.();
            if (symbolNode) symbolNode.textContent = "\uD83D\uDC64";
            profileBtn.title = user ? "Ir a mi perfil" : "Iniciar sesión";
            profileBtn.setAttribute("aria-label", user ? "Ir a mi perfil" : "Iniciar sesión");
            profileBtn.addEventListener("click", () => {
                const u = window.SmuckyAuth?.getCurrentUser?.();
                window.location.href = u ? "../cuenta/perfil.html" : "../cuenta/login.html";
            });
        }
    }

    // ── Sincronización en tiempo real ────────────────────────
    function initSyncListeners() {
        window.addEventListener("smucky:cart-changed", () => updateSectionBadges());
        window.addEventListener("smucky:favs-changed", () => updateSectionBadges());
        window.addEventListener("storage", () => updateSectionBadges());
    }

    // ── Init ─────────────────────────────────────────────────
    window.addEventListener("DOMContentLoaded", async () => {
        await waitForSmucky();
        await waitForAuthReady();

        updateSectionBadges();
        initSectionSearch();
        initSectionCartModal();
        initSectionFavModal();
        initSectionHeader();
        initSyncListeners();
    });

})();