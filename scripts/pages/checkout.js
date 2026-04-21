/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/checkout.js
//  Lógica de la página de finalizar compra estilo Amazon.
//  Lee el producto desde sessionStorage (guardado por index.js),
//  carga tarjetas guardadas por perfil y procesa el pedido.
// ============================================================

// ── Espera a que un global de window esté disponible ────────
function waitForGlobal(name, ms = 6000) {
    return new Promise((resolve, reject) => {
        if (window[name]) return resolve(window[name]);
        const start = Date.now();
        const timer = setInterval(() => {
            if (window[name]) { clearInterval(timer); resolve(window[name]); }
            else if (Date.now() - start > ms) { clearInterval(timer); reject(new Error(`${name} no disponible`)); }
        }, 120);
    });
}

// ── Calcula fecha de entrega estimada (+4 días hábiles) ──────
function deliveryEstimate() {
    const d = new Date();
    let added = 0;
    while (added < 4) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) added++;
    }
    return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
}

// ── Estado ───────────────────────────────────────────────────
let checkoutMode = "single";
let checkoutItems = [];
let cards   = [];
let selectedCardId = null;
let mpProfile = null;   // datos de Mercado Pago del usuario
let editingCardId = null;
let verifiedPaymentCode = null;

// ── DOM refs ─────────────────────────────────────────────────
const coItemsSection  = document.getElementById("coItemsSection");
const coDeliveryDate  = document.getElementById("coDeliveryDate");
const coUrgency       = document.getElementById("coUrgency");
const coSubtotal      = document.getElementById("coSubtotal");
const coTotal         = document.getElementById("coTotal");
const coConfirmBtn    = document.getElementById("coConfirmBtn");
const coConfirmBtnSide= document.getElementById("coConfirmBtnSide");

// Mercado Pago form
const coPayMP         = document.getElementById("coPayMP");
const coMpForm        = document.getElementById("coMpForm");
const mpEmail         = document.getElementById("mpEmail");
const mpName          = document.getElementById("mpName");
const mpPhone         = document.getElementById("mpPhone");
const mpAlias         = document.getElementById("mpAlias");
const mpFormError     = document.getElementById("mpFormError");

// Tarjeta
const coSavedCardArea = document.getElementById("coSavedCardArea");
const coSavedCardsList = document.getElementById("coSavedCardsList");
const coAddCardBtn    = document.getElementById("coAddCardBtn");
const coPaymentStatus = document.getElementById("coPaymentStatus");

// Modal tarjeta
const cardModal       = document.getElementById("cardModal");
const cardModalClose  = document.getElementById("cardModalClose");
const cardModalCancel = document.getElementById("cardModalCancel");
const cardModalTitle  = document.getElementById("cardModalTitle");
const cardForm        = document.getElementById("cardForm");
const cfNumber        = document.getElementById("cfNumber");
const cfName          = document.getElementById("cfName");
const cfMonth         = document.getElementById("cfMonth");
const cfYear          = document.getElementById("cfYear");
const cfCvv           = document.getElementById("cfCvv");
const cfDefault       = document.getElementById("cfDefault");
const cfBrandBadge    = document.getElementById("cfBrandBadge");
const cardFormError   = document.getElementById("cardFormError");
const cardFormSubmit  = document.getElementById("cardFormSubmit");
const coNoticeModal   = document.getElementById("coNoticeModal");
const coNoticeClose   = document.getElementById("coNoticeClose");
const coNoticeKicker  = document.getElementById("coNoticeKicker");
const coNoticeTitle   = document.getElementById("coNoticeTitle");
const coNoticeMessage = document.getElementById("coNoticeMessage");
const coNoticeInputWrap = document.getElementById("coNoticeInputWrap");
const coNoticeInput   = document.getElementById("coNoticeInput");
const coNoticeHint    = document.getElementById("coNoticeHint");
const coNoticeError   = document.getElementById("coNoticeError");
const coNoticeAccept  = document.getElementById("coNoticeAccept");
const coNoticeCancel  = document.getElementById("coNoticeCancel");

let activeCheckoutDialog = null;

function getOrderTotal() {
    return checkoutItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0);
}

function normalizeImage(src) {
    if (!src) return "";
    if (!src.startsWith("http") && !src.startsWith("data:") && !src.startsWith("/") && !src.startsWith("../")) {
        return "../" + src;
    }
    return src;
}

function persistCheckoutContext() {
    sessionStorage.setItem("smucky_checkout_context", JSON.stringify({
        mode: checkoutMode,
        items: checkoutItems
    }));

    if (checkoutItems[0]) {
        sessionStorage.setItem("smucky_checkout_product", JSON.stringify(checkoutItems[0]));
    }
}

function loadCheckoutItemsFromCart() {
    try {
        const rawCart = localStorage.getItem("smucky_cart");
        if (!rawCart) return [];

        const parsedCart = JSON.parse(rawCart);
        if (!Array.isArray(parsedCart)) return [];

        return parsedCart
            .filter((item) => item && item.id != null)
            .map((item) => ({
                ...item,
                qty: Math.max(1, Number(item.qty) || 1),
                price: Number(item.price) || 0,
                stock: Number(item.stock) || 99,
                gallery: Array.isArray(item.gallery) ? item.gallery : []
            }));
    } catch {
        return [];
    }
}

function syncCartWithCheckoutItems() {
    try {
        localStorage.setItem("smucky_cart", JSON.stringify(checkoutItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: Number(item.price) || 0,
            qty: Math.max(1, Number(item.qty) || 1),
            image: item.image || "",
            stock: Number(item.stock) || 99,
            firestoreId: item.firestoreId,
            gallery: Array.isArray(item.gallery) ? item.gallery : []
        }))));
    } catch {
        // ignore sync errors to avoid blocking checkout UI
    }
}

// ── Actualiza totales en pantalla ────────────────────────────
function updateTotals() {
    const total = getOrderTotal();
    if (coSubtotal) coSubtotal.textContent = `$${total.toFixed(2)}`;
    if (coTotal) coTotal.textContent = `$${total.toFixed(2)}`;
}

function renderCheckoutItems() {
    if (!coItemsSection) return;

    if (!checkoutItems.length) {
        coItemsSection.innerHTML = `
            <div class="co-empty-order">
                <p>No hay productos en este pedido.</p>
            </div>
        `;
        updateTotals();
        return;
    }

    coItemsSection.innerHTML = checkoutItems.map((item, index) => {
        const imageSrc = normalizeImage((Array.isArray(item.gallery) && item.gallery[0]) || item.image || "");
        return `
            <div class="co-order-item">
                <div class="co-product-card">
                    <img src="${imageSrc}" alt="${item.name}" class="co-product-thumb" onerror="this.src='../Imagenes de ropa/fallback.png'">
                    <div class="co-product-body">
                        <p class="co-prod-name">${item.name}</p>
                        <p class="co-prod-price">$${Number(item.price).toFixed(2)}</p>
                        <p class="co-prod-shipping">Envío: <strong class="co-free">GRATIS</strong></p>
                        <p class="co-prod-seller">Vendido por <strong>SMUCKY´s By CHAVAMON</strong></p>
                    </div>
                </div>
                <div class="co-qty-row">
                    <button class="co-qty-del" data-index="${index}" title="Quitar del pedido" aria-label="Quitar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                    </button>
                    <div class="co-qty-controls">
                        <button class="co-qty-btn co-item-minus" data-index="${index}" ${item.qty <= 1 ? "disabled" : ""} aria-label="Menos">−</button>
                        <span class="co-qty-num">${item.qty}</span>
                        <button class="co-qty-btn co-item-plus" data-index="${index}" ${item.qty >= (item.stock || 99) ? "disabled" : ""} aria-label="Más">+</button>
                    </div>
                    <span class="co-item-line-total">$${(Number(item.price) * Number(item.qty)).toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join("");

    updateTotals();
}

function changeCheckoutQty(itemIndex, delta) {
    const item = checkoutItems[itemIndex];
    if (!item) return;
    item.qty = Math.max(1, Math.min((item.stock || 99), Number(item.qty || 1) + delta));
    persistCheckoutContext();
    syncCartWithCheckoutItems();
    renderCheckoutItems();
}

function removeCheckoutItem(itemIndex) {
    checkoutItems = checkoutItems.filter((_, index) => index !== itemIndex);
    if (!checkoutItems.length) {
        sessionStorage.removeItem("smucky_checkout_context");
        sessionStorage.removeItem("smucky_checkout_product");
        localStorage.removeItem("smucky_cart");
        window.location.href = "../index.html";
        return;
    }
    persistCheckoutContext();
    syncCartWithCheckoutItems();
    renderCheckoutItems();
}

function isCardExpired(card) {
    if (!card) return false;
    const now = new Date();
    const year = Number(card.expiryYear);
    const month = Number(card.expiryMonth);
    return year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
}

function getSelectedCard() {
    return cards.find((card) => card.id === selectedCardId) || null;
}

function showPaymentStatus(message, type = "error") {
    if (!coPaymentStatus) return;
    coPaymentStatus.textContent = message;
    coPaymentStatus.className = `co-payment-status ${type}`;
    coPaymentStatus.style.display = "block";
}

function clearPaymentStatus() {
    if (!coPaymentStatus) return;
    coPaymentStatus.style.display = "none";
    coPaymentStatus.textContent = "";
    coPaymentStatus.className = "co-payment-status";
}

function getCardBankRule(card) {
    if (isCardExpired(card)) {
        return "Tarjeta vencida. Actualízala para seguir pagando; la aprobación final depende de tu banco.";
    }
    if (card.brand === "Visa") {
        return "Pago a meses disponible según tu banco y el tipo de Visa que tengas.";
    }
    return "Las promociones y mensualidades dependen de tu banco y de tu Mastercard.";
}

function getCardBrandSvg(card) {
    if (card.brand === "Visa") {
        return `
            <svg class="co-card-brand-art" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="28" rx="4" fill="#1a1f71"/>
                <rect x="0" y="8" width="40" height="6" fill="#f7a600" opacity=".95"/>
                <text x="4" y="19" font-family="Arial" font-size="12" font-weight="900" font-style="italic" fill="#fff">VISA</text>
            </svg>`;
    }

    return `
        <svg class="co-card-brand-art" viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="28" rx="4" fill="#1b1b1b"/>
            <circle cx="17" cy="14" r="8" fill="#eb001b"/>
            <circle cx="23" cy="14" r="8" fill="#f79e1b"/>
            <path d="M20 8a8.4 8.4 0 0 1 0 12 8.4 8.4 0 0 1 0-12z" fill="#ff5f00"/>
        </svg>`;
}

// ── Render tarjetas guardadas ────────────────────────────────
function renderSavedCards() {
    if (!cards || cards.length === 0) {
        if (coSavedCardArea) coSavedCardArea.style.display = "none";
        if (coAddCardBtn)    coAddCardBtn.style.display    = "flex";
        selectedCardId = null;
        clearPaymentStatus();
        return;
    }

    const fallbackCard = cards.find((card) => card.isDefault) || cards.find((card) => !isCardExpired(card)) || cards[0];
    if (!cards.some((card) => card.id === selectedCardId)) {
        selectedCardId = fallbackCard.id;
    }

    if (coSavedCardsList) {
        coSavedCardsList.innerHTML = cards.map((card) => {
            const expired = isCardExpired(card);
            const checked = card.id === selectedCardId ? "checked" : "";
            const selectedClass = card.id === selectedCardId ? " is-selected" : "";
            const expiredClass = expired ? " is-expired" : "";
            const defaultPill = card.isDefault ? '<span class="co-card-pill default">Predeterminada</span>' : "";
            const statusPill = expired
                ? '<span class="co-card-pill expired">Vencida</span>'
                : '<span class="co-card-pill valid">Vigente</span>';

            return `
                <label class="co-card-option${selectedClass}${expiredClass}">
                    <span class="co-card-select">
                        <input type="radio" name="coSavedCard" value="${card.id}" ${checked}>
                    </span>
                    ${getCardBrandSvg(card)}
                    <div class="co-card-body">
                        <p class="co-card-line"><span class="co-card-brand">${card.brand}</span> que termina en <strong>${card.last4}</strong></p>
                        <p class="co-card-holder">${card.holderName}</p>
                        <p class="co-card-note">${expired ? 'Esta tarjeta ya venció y no se aceptará hasta que la actualices.' : 'Puedes seleccionarla para este pedido.'}</p>
                        <p class="co-card-bank-rule">${getCardBankRule(card)}</p>
                    </div>
                    <div class="co-card-meta">
                        <button type="button" class="co-card-edit" data-card-id="${card.id}">Editar</button>
                        <button type="button" class="co-card-delete" data-card-id="${card.id}" title="Eliminar tarjeta" aria-label="Eliminar tarjeta">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6m4-6v6"/>
                                <path d="M9 6V4h6v2"/>
                            </svg>
                        </button>
                        <span class="co-card-expiry">${card.expiryMonth}/${card.expiryYear}</span>
                        ${defaultPill}${statusPill}
                    </div>
                </label>`;
        }).join("");
    }

    if (coSavedCardArea) coSavedCardArea.style.display = "flex";
    if (coAddCardBtn)    coAddCardBtn.style.display    = "flex";

    const selectedCard = getSelectedCard();
    if (selectedCard && isCardExpired(selectedCard)) {
        showPaymentStatus("La tarjeta seleccionada está vencida. Edítala y vuelve a guardarla antes de pagar.");
    } else {
        clearPaymentStatus();
    }
}

// ── Abrir / cerrar modal ──────────────────────────────────────
function openCardModal(cardToEdit = null) {
    // Poblar años
    if (cfYear && cfYear.options.length <= 1) {
        const nowYear = new Date().getFullYear();
        for (let y = nowYear; y <= nowYear + 12; y++) {
            const opt = document.createElement("option");
            opt.value = String(y);
            opt.textContent = String(y);
            cfYear.appendChild(opt);
        }
    }

    cardForm?.reset();
    if (cfBrandBadge) { cfBrandBadge.textContent = ""; cfBrandBadge.className = "cf-brand-badge"; }
    showFormError("");
    editingCardId = cardToEdit?.id || null;

    if (cardToEdit) {
        if (cardModalTitle) cardModalTitle.textContent = "Editar tu tarjeta";
        if (cardFormSubmit) cardFormSubmit.textContent = "Guardar cambios";
        if (cfNumber) cfNumber.placeholder = `Vuelve a escribir la tarjeta terminada en ${cardToEdit.last4}`;
        if (cfName) cfName.value = cardToEdit.holderName || "";
        if (cfMonth) cfMonth.value = cardToEdit.expiryMonth || "";
        if (cfYear) cfYear.value = cardToEdit.expiryYear || "";
        if (cfDefault) cfDefault.checked = Boolean(cardToEdit.isDefault);
        if (cfBrandBadge) {
            cfBrandBadge.textContent = cardToEdit.brand === "Visa" ? "VISA" : "MC";
            cfBrandBadge.className = `cf-brand-badge ${cardToEdit.brand === "Visa" ? "visa" : "mastercard"}`;
        }
        showFormError("Por seguridad, vuelve a capturar el número y el CVV para actualizar la tarjeta.");
    } else {
        if (cardModalTitle) cardModalTitle.textContent = "Agregar una tarjeta de crédito o débito";
        if (cardFormSubmit) cardFormSubmit.textContent = "Agregar tarjeta";
        if (cfNumber) cfNumber.placeholder = "0000 0000 0000 0000";
        showFormError("");
    }

    cardModal?.classList.add("is-open");
    cfNumber?.focus();
}

function closeCardModal() {
    cardModal?.classList.remove("is-open");
    editingCardId = null;
}

function showFormError(msg) {
    if (!cardFormError) return;
    if (msg) {
        cardFormError.textContent = msg;
        cardFormError.style.display = "block";
    } else {
        cardFormError.style.display = "none";
    }
}

function hideCheckoutDialog() {
    if (!coNoticeModal) return;
    coNoticeModal.hidden = true;
    coNoticeModal.setAttribute("aria-hidden", "true");
    coNoticeModal.querySelector(".co-notice-card")?.classList.remove("is-danger", "is-success");
    if (coNoticeInputWrap) coNoticeInputWrap.hidden = true;
    if (coNoticeInput) coNoticeInput.value = "";
    if (coNoticeError) {
        coNoticeError.hidden = true;
        coNoticeError.textContent = "";
    }
}

function resolveCheckoutDialog(result) {
    if (!activeCheckoutDialog) return;
    const { resolve } = activeCheckoutDialog;
    activeCheckoutDialog = null;
    hideCheckoutDialog();
    resolve(result);
}

function showCheckoutDialog({
    kicker = "Smucky Checkout",
    title = "Notificación",
    message = "",
    acceptText = "Aceptar",
    cancelText = "Cancelar",
    tone = "danger",
    input = null
} = {}) {
    if (!coNoticeModal) {
        return Promise.resolve({ confirmed: false, value: "" });
    }

    if (activeCheckoutDialog) {
        resolveCheckoutDialog({ confirmed: false, value: "" });
    }

    if (coNoticeKicker) coNoticeKicker.textContent = kicker;
    if (coNoticeTitle) coNoticeTitle.textContent = title;
    if (coNoticeMessage) coNoticeMessage.textContent = message;
    if (coNoticeAccept) coNoticeAccept.textContent = acceptText;
    if (coNoticeCancel) {
        coNoticeCancel.textContent = cancelText || "Cancelar";
        coNoticeCancel.hidden = !cancelText;
    }

    const noticeCard = coNoticeModal.querySelector(".co-notice-card");
    noticeCard?.classList.remove("is-danger", "is-success");
    if (tone === "success") noticeCard?.classList.add("is-success");
    else if (tone === "danger") noticeCard?.classList.add("is-danger");

    if (input) {
        if (coNoticeInputWrap) coNoticeInputWrap.hidden = false;
        if (coNoticeInput) {
            coNoticeInput.value = input.value || "";
            coNoticeInput.placeholder = input.placeholder || "";
            coNoticeInput.inputMode = input.inputMode || "text";
            coNoticeInput.maxLength = input.maxLength || 120;
        }
        if (coNoticeHint) coNoticeHint.textContent = input.hint || "";
    } else {
        if (coNoticeInputWrap) coNoticeInputWrap.hidden = true;
    }

    if (coNoticeError) {
        coNoticeError.hidden = true;
        coNoticeError.textContent = "";
    }

    coNoticeModal.hidden = false;
    coNoticeModal.setAttribute("aria-hidden", "false");

    return new Promise((resolve) => {
        activeCheckoutDialog = { resolve, input };
        window.requestAnimationFrame(() => {
            if (input && coNoticeInput) {
                coNoticeInput.focus();
                coNoticeInput.select();
            } else {
                coNoticeAccept?.focus();
            }
        });
    });
}

function submitCheckoutDialog() {
    if (!activeCheckoutDialog) return;

    const inputConfig = activeCheckoutDialog.input;
    const enteredValue = coNoticeInput?.value?.trim?.() || "";

    if (inputConfig?.validate) {
        const validationMessage = inputConfig.validate(enteredValue);
        if (validationMessage) {
            if (coNoticeError) {
                coNoticeError.hidden = false;
                coNoticeError.textContent = validationMessage;
            }
            coNoticeInput?.focus();
            return;
        }
    }

    resolveCheckoutDialog({ confirmed: true, value: enteredValue });
}

// ── Formateado de número de tarjeta ──────────────────────────
function formatCardNumber(val) {
    return val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
}

function detectBrandLocal(num) {
    const n = num.replace(/\D/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
    return null;
}

async function solicitarCodigoVerificacionPago() {
    if (verifiedPaymentCode) {
        return verifiedPaymentCode;
    }

    const usuario = window.SmuckyAuth?.getCurrentUser?.();
    const emailCliente = usuario?.email || "";
    const nombreCliente = usuario?.nombre || usuario?.name || "Cliente";

    if (!emailCliente) {
        showPaymentStatus("No encontramos tu correo para enviar el codigo de verificacion.");
        return null;
    }

    if (typeof window.enviarCodigoPago !== "function") {
        showPaymentStatus("No se pudo iniciar la verificacion de pago. Recarga la pagina e intenta nuevamente.");
        return null;
    }

    const envio = await window.enviarCodigoPago(emailCliente, nombreCliente, getOrderTotal());
    if (!envio?.ok || !envio?.codigo) {
        showPaymentStatus("No se pudo enviar el codigo de pago a tu correo. Intenta de nuevo.");
        return null;
    }

    for (let intento = 1; intento <= 3; intento++) {
        const promptResult = await showCheckoutDialog({
            kicker: "Verificación de pago",
            title: "Escribe el código que te enviamos",
            message: `Mandamos un código de 6 dígitos a ${emailCliente}. Intento ${intento} de 3.`,
            acceptText: "Validar código",
            cancelText: "Cancelar",
            tone: "success",
            input: {
                placeholder: "000000",
                inputMode: "numeric",
                maxLength: 6,
                hint: "Revisa tu correo y escribe exactamente el código para autorizar el pago.",
                validate(value) {
                    return /^\d{6}$/.test(value) ? "" : "Escribe un código válido de 6 dígitos.";
                }
            }
        });

        if (!promptResult.confirmed) {
            showPaymentStatus("Pago cancelado. No se ingreso el codigo de verificacion.");
            return null;
        }

        if (promptResult.value === String(envio.codigo)) {
            verifiedPaymentCode = String(envio.codigo);
            showPaymentStatus("Codigo verificado correctamente. Ya puedes completar tu pago.", "success");
            return verifiedPaymentCode;
        }

        showPaymentStatus("Codigo incorrecto. Revisa tu correo e intenta de nuevo.");
    }

    showPaymentStatus("Se agotaron los intentos de verificacion. Vuelve a intentar para recibir un nuevo codigo.");
    return null;
}

// ── Confirmar compra ─────────────────────────────────────────
async function handleConfirm() {
    if (!checkoutItems.length) {
        showPaymentStatus("No hay producto seleccionado para completar el pago.");
        return;
    }

    const paymentMethodEl = document.querySelector("input[name='coPayment']:checked");

    // ── Mercado Pago ────────────────────────────────────────
    // ES: Redirige directo a Mercado Pago. Sin formulario manual.
    // EN: Redirects directly to Mercado Pago. No manual form needed.
    if (paymentMethodEl && paymentMethodEl.value === "Mercado Pago") {
        if (typeof window.iniciarPagoMercadoPago !== "function") {
            showPaymentStatus("Mercado Pago no está disponible. Recarga la página e intenta de nuevo.");
            return;
        }

        if (checkoutMode === "cart" && typeof window.iniciarPagoCarritoMP === "function") {
            await window.iniciarPagoCarritoMP(checkoutItems.map(item => ({
                id: item.id,
                firestoreId: item.firestoreId,
                name: item.name,
                qty: item.qty,
                price: item.price
            })));
            return;
        }

        const product = checkoutItems[0];
        await window.iniciarPagoMercadoPago(
            String(product.firestoreId || product.id),
            Number(product.qty || 1),
            product.name,
            Number(product.price)
        );
        return;
    }

    // ── Pago con tarjeta (Stripe) ──────────────────────────
    if (!selectedCardId) {
        showPaymentStatus("Selecciona una tarjeta guardada o agrega una nueva antes de pagar.");
        openCardModal();
        return;
    }

    const selectedCard = getSelectedCard();
    if (!selectedCard) {
        showPaymentStatus("No se encontró la tarjeta seleccionada. Intenta elegir otra o vuelve a guardarla.");
        return;
    }

    if (isCardExpired(selectedCard)) {
        showPaymentStatus("La tarjeta seleccionada está vencida. Edítala y actualiza su fecha para que tu banco pueda autorizar el cargo.");
        openCardModal(selectedCard);
        return;
    }

    const codigoPagoVerificado = await solicitarCodigoVerificacionPago();
    if (!codigoPagoVerificado) {
        return;
    }

    clearPaymentStatus();

    const confirmBtn = coConfirmBtn;
    if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.textContent = "Procesando…"; }
    if (coConfirmBtnSide) { coConfirmBtnSide.disabled = true; coConfirmBtnSide.textContent = "Procesando…"; }

    try {
        if (checkoutMode === "cart" && typeof window.iniciarPagoCarrito === "function") {
            await window.iniciarPagoCarrito(checkoutItems.map((item) => ({
                id: item.id,
                name: item.name,
                qty: item.qty,
                price: item.price
            })));
            return;
        }

        const product = checkoutItems[0];
        if (typeof window.iniciarPagoStripe === "function") {
            const stripeResult = await window.iniciarPagoStripe(
                String(product.id),
                Number(product.qty || 1),
                product.name,
                product.price
            );
            if (stripeResult) {
                sessionStorage.removeItem("smucky_checkout_context");
                sessionStorage.removeItem("smucky_checkout_product");
                window.location.href = "../index.html";
            }
            return;
        }

        await waitForGlobal("realizarPedido");
        const results = [];
        for (const product of checkoutItems) {
            const saved = await window.realizarPedido(
                String(product.firestoreId || product.id),
                Number(product.qty || 1),
                product.name,
                product.price,
                codigoPagoVerificado
            );
            results.push(saved);
        }

        if (results.every(Boolean)) {
            const usuario = window.SmuckyAuth?.getCurrentUser?.();
            const emailCliente  = usuario?.email  || "";
            const nombreCliente = usuario?.nombre || usuario?.name || "Cliente";

            if (emailCliente && typeof window.enviarCorreosVenta === "function" && checkoutItems[0]) {
                const firstItem = checkoutItems[0];
                window.enviarCorreosVenta(
                    emailCliente, nombreCliente,
                    firstItem.nombre_prod || firstItem.name,
                    firstItem.qty,
                    firstItem.precio || firstItem.price,
                    getOrderTotal()
                );
            }

            sessionStorage.removeItem("smucky_checkout_context");
            sessionStorage.removeItem("smucky_checkout_product");
            window.location.href = "../index.html";
        } else {
            showPaymentStatus("No se pudo completar la compra. Inténtalo de nuevo.");
        }
    } catch (err) {
        console.error("Error al confirmar:", err);
        showPaymentStatus("Ocurrió un error al procesar tu pedido. Verifica tu conexión.");
    } finally {
        if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = "Realiza tu pedido y paga"; }
        if (coConfirmBtnSide) { coConfirmBtnSide.disabled = false; coConfirmBtnSide.textContent = "Realiza tu pedido y paga"; }
    }
}

// ── Init ─────────────────────────────────────────────────────
async function init() {
    // Verificar sesión
    if (window.SmuckyAuth && !window.SmuckyAuth.isLoggedIn()) {
        window.SmuckyAuth.redirectToLogin?.();
        return;
    }

    // Fecha de entrega
    if (coDeliveryDate) coDeliveryDate.textContent = deliveryEstimate();

    // Leer checkout desde sessionStorage
    try {
        const rawContext = sessionStorage.getItem("smucky_checkout_context");
        const cartItemsFromStorage = loadCheckoutItemsFromCart();
        if (rawContext) {
            const parsedContext = JSON.parse(rawContext);
            checkoutMode = parsedContext.mode === "cart" ? "cart" : "single";
            checkoutItems = Array.isArray(parsedContext.items) ? parsedContext.items : [];

            if (checkoutMode === "cart" && cartItemsFromStorage.length && cartItemsFromStorage.length !== checkoutItems.length) {
                checkoutItems = cartItemsFromStorage;
            }
        }

        if (!checkoutItems.length) {
            checkoutItems = cartItemsFromStorage;
            if (checkoutItems.length) {
                checkoutMode = checkoutItems.length > 1 ? "cart" : "single";
            }
        }

        if (!checkoutItems.length) {
            const raw = sessionStorage.getItem("smucky_checkout_product");
            if (!raw) throw new Error("Sin producto");
            const singleProduct = JSON.parse(raw);
            checkoutMode = "single";
            checkoutItems = [{ ...singleProduct, qty: Math.max(1, Number(singleProduct.qty) || 1) }];
        }
    } catch {
        await showCheckoutDialog({
            kicker: "Checkout",
            title: "No hay producto para comprar",
            message: "Regresando a la tienda para que elijas algo antes de pagar.",
            acceptText: "Volver a la tienda",
            cancelText: null,
            tone: "danger"
        });
        window.location.href = "../index.html";
        return;
    }

    checkoutItems = checkoutItems.map((item) => ({
        ...item,
        qty: Math.max(1, Number(item.qty) || 1)
    }));
    persistCheckoutContext();
    syncCartWithCheckoutItems();

    if (coUrgency) {
        coUrgency.textContent = checkoutMode === "cart"
            ? `Estás pagando ${checkoutItems.length} productos de tu carrito.`
            : "Tu compra directa está lista para pagarse.";
    }

    renderCheckoutItems();
    updateTotals();

    // Cargar tarjetas
    try {
        await waitForGlobal("SmuckyPayments");
        cards = await window.SmuckyPayments.listCards();
    } catch { cards = []; }

    renderSavedCards();
}

// ── Eventos ───────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    init();

    coItemsSection?.addEventListener("click", (event) => {
        const minusBtn = event.target.closest(".co-item-minus");
        if (minusBtn) {
            changeCheckoutQty(Number(minusBtn.dataset.index), -1);
            return;
        }

        const plusBtn = event.target.closest(".co-item-plus");
        if (plusBtn) {
            changeCheckoutQty(Number(plusBtn.dataset.index), 1);
            return;
        }

        const deleteBtn = event.target.closest(".co-qty-del");
        if (deleteBtn) {
            removeCheckoutItem(Number(deleteBtn.dataset.index));
        }
    });

    // Abrir modal tarjeta
    coAddCardBtn?.addEventListener("click", () => openCardModal());

    coSavedCardsList?.addEventListener("change", async (event) => {
        const radio = event.target.closest("input[name='coSavedCard']");
        if (!radio) return;

        // ES: Deselecciona Mercado Pago al elegir tarjeta.
        // EN: Deselects Mercado Pago when a card is chosen.
        selectedCardId = radio.value;
        if (coPayMP) coPayMP.checked = false;
        if (coMpForm) coMpForm.style.display = "none";
        if (mpFormError) mpFormError.style.display = "none";

        try {
            await waitForGlobal("SmuckyPayments");
            cards = await window.SmuckyPayments.setDefaultCard(selectedCardId);
        } catch (err) {
            console.warn("No se pudo marcar la tarjeta como predeterminada:", err);
        }

        renderSavedCards();
    });

    coSavedCardsList?.addEventListener("click", async (event) => {
        // Editar tarjeta
        const editBtn = event.target.closest(".co-card-edit");
        if (editBtn) {
            event.preventDefault();
            event.stopPropagation();
            const card = cards.find((item) => item.id === editBtn.dataset.cardId);
            if (card) openCardModal(card);
            return;
        }

        // Eliminar tarjeta
        const deleteBtn = event.target.closest(".co-card-delete");
        if (deleteBtn) {
            event.preventDefault();
            event.stopPropagation();
            const cardId = deleteBtn.dataset.cardId;
            const card = cards.find((item) => item.id === cardId);
            if (!card) return;

            const result = await showCheckoutDialog({
                kicker: "Eliminar tarjeta",
                title: `¿Eliminar la tarjeta que termina en ${card.last4}?`,
                message: "Esta acción no se puede deshacer.",
                acceptText: "Sí, eliminar",
                cancelText: "Cancelar",
                tone: "danger"
            });

            if (!result.confirmed) return;

            try {
                await waitForGlobal("SmuckyPayments");
                cards = await window.SmuckyPayments.deleteCard(cardId);
                if (selectedCardId === cardId) selectedCardId = null;
                renderSavedCards();
                showPaymentStatus("Tarjeta eliminada correctamente.", "success");
            } catch (err) {
                showPaymentStatus("No se pudo eliminar la tarjeta. Intenta de nuevo.");
            }
        }
    });

    // Cerrar modal
    cardModalClose?.addEventListener("click", closeCardModal);
    cardModalCancel?.addEventListener("click", closeCardModal);
    cardModal?.addEventListener("click", (e) => {
        if (e.target === cardModal) closeCardModal();
    });

    coNoticeAccept?.addEventListener("click", submitCheckoutDialog);
    coNoticeCancel?.addEventListener("click", () => resolveCheckoutDialog({ confirmed: false, value: "" }));
    coNoticeClose?.addEventListener("click", () => resolveCheckoutDialog({ confirmed: false, value: "" }));
    coNoticeModal?.addEventListener("click", (event) => {
        if (event.target === coNoticeModal) {
            resolveCheckoutDialog({ confirmed: false, value: "" });
        }
    });
    coNoticeInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitCheckoutDialog();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && activeCheckoutDialog) {
            resolveCheckoutDialog({ confirmed: false, value: "" });
        }
    });

    // Formateo número de tarjeta + detección de marca
    cfNumber?.addEventListener("input", () => {
        cfNumber.value = formatCardNumber(cfNumber.value);
        const brand = detectBrandLocal(cfNumber.value);
        if (cfBrandBadge) {
            if (brand === "Visa") {
                cfBrandBadge.textContent = "VISA";
                cfBrandBadge.className = "cf-brand-badge visa";
            } else if (brand === "Mastercard") {
                cfBrandBadge.textContent = "MC";
                cfBrandBadge.className = "cf-brand-badge mastercard";
            } else {
                cfBrandBadge.textContent = "";
                cfBrandBadge.className = "cf-brand-badge";
            }
        }
    });

    // Solo dígitos en CVV
    cfCvv?.addEventListener("input", () => {
        cfCvv.value = cfCvv.value.replace(/\D/g, "").slice(0, 4);
    });

    // Submit formulario de tarjeta
    cardForm?.addEventListener("submit", async (e) => {
        e.preventDefault();
        showFormError("");
        cardFormSubmit.disabled = true;
        cardFormSubmit.textContent = editingCardId ? "Guardando…" : "Agregando…";

        try {
            await waitForGlobal("SmuckyPayments");
            const payload = {
                number:       cfNumber.value,
                holderName:   cfName.value,
                expiryMonth:  cfMonth.value,
                expiryYear:   cfYear.value,
                cvv:          cfCvv.value,
                makeDefault:  cfDefault.checked
            };

            const savedCard = editingCardId
                ? await window.SmuckyPayments.updateCard(editingCardId, payload)
                : await window.SmuckyPayments.saveCard(payload);

            cards = await window.SmuckyPayments.listCards();
            selectedCardId = savedCard.id;
            renderSavedCards();
            showPaymentStatus(editingCardId ? "Tarjeta actualizada correctamente." : "Tarjeta agregada correctamente.", "success");
            closeCardModal();
        } catch (err) {
            let msg = err.message || "Error al guardar la tarjeta.";
            if (msg.toLowerCase().includes("número") || msg.toLowerCase().includes("numero") || msg.toLowerCase().includes("invalid")) {
                msg = "Número de tarjeta inválida.";
            }
            showFormError(msg);
        } finally {
            cardFormSubmit.disabled = false;
            cardFormSubmit.textContent = editingCardId ? "Guardar cambios" : "Agregar tarjeta";
        }
    });

    // Botones confirmar (izquierdo + sidebar)
    coConfirmBtn?.addEventListener("click", handleConfirm);
    coConfirmBtnSide?.addEventListener("click", handleConfirm);

    // ES: Al seleccionar MP, deselecciona la tarjeta guardada.
    // EN: When MP is selected, deselect the saved card.
    coPayMP?.addEventListener("change", () => {
        if (coPayMP.checked) {
            selectedCardId = null;
            // Deselect all saved card radios visually
            document.querySelectorAll("input[name='coSavedCard']").forEach(r => r.checked = false);
            renderSavedCards();
        }
        if (coMpForm) coMpForm.style.display = "none";
    });
    if (coMpForm) coMpForm.style.display = "none";

    // Escape para cerrar modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeCardModal();
    });
});