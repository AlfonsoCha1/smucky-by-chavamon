/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/metodos-pago.js
//  GestiÃ³n de tarjetas guardadas por perfil de usuario.
//  Solo acepta Visa y Mastercard.
//  Guarda en localStorage + Firestore (colecciÃ³n perfiles_pago).
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const _cfg = {
    apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
    authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
    projectId: "smuckys-by-chavamon-loginregis",
    storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
    messagingSenderId: "185108836763",
    appId: "1:185108836763:web:d7b923507c3c32e28e313e"
};

const _app = getApps().length ? getApps()[0] : initializeApp(_cfg);
const _db  = getFirestore(_app);

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function _luhn(num) {
    const d = String(num).replace(/\D/g, "");
    let sum = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
        let n = parseInt(d[i], 10);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n; alt = !alt;
    }
    return sum % 10 === 0;
}

function _detectBrand(num) {
    const n = String(num).replace(/\D/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
    return null;
}

function _userKey() {
    const u = window.SmuckyAuth?.getCurrentUser?.();
    if (!u) return null;
    return u.uid
        ? `uid_${u.uid}`
        : `email_${(u.email || "").replace(/[^a-z0-9]/gi, "_")}`;
}

const _LS = (k) => `smucky_cards_${k}`;

function _readLocal(key) {
    try { return JSON.parse(localStorage.getItem(_LS(key)) || "[]"); } catch { return []; }
}

function _writeLocal(key, cards) {
    localStorage.setItem(_LS(key), JSON.stringify(cards));
}

async function _syncFirestore(key, cards) {
    try {
        await setDoc(doc(_db, "perfiles_pago", key),
            { cards, updatedAt: new Date().toISOString() },
            { merge: true });
    } catch (e) { console.warn("Firestore sync:", e); }
}

// â”€â”€ API pÃºblica â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function listCards() {
    const key = _userKey();
    if (!key) return [];
    try {
        const snap = await getDoc(doc(_db, "perfiles_pago", key));
        if (snap.exists() && Array.isArray(snap.data().cards)) {
            _writeLocal(key, snap.data().cards);
            return snap.data().cards;
        }
    } catch { /* offline â†’ usa localStorage */ }
    return _readLocal(key);
}

function _buildCardPayload({ number, holderName, expiryMonth, expiryYear, cvv }, previousCard = {}) {
    const clean = String(number).replace(/\D/g, "");
    if (clean.length < 13 || clean.length > 19)
        throw new Error("NÃºmero de tarjeta invÃ¡lido.");
    if (!_luhn(clean))
        throw new Error("NÃºmero de tarjeta invÃ¡lido.");

    const brand = _detectBrand(clean);
    if (!brand)
        throw new Error("Solo aceptamos Visa y Mastercard.");
    if (!holderName?.trim())
        throw new Error("Escribe el nombre del titular.");
    if (!/^\d{3,4}$/.test(String(cvv || "").trim()))
        throw new Error("El cÃ³digo de seguridad debe tener 3 o 4 dÃ­gitos.");

    const now = new Date();
    const mo = parseInt(expiryMonth, 10);
    const yr = parseInt(expiryYear, 10);
    if (!mo || !yr)
        throw new Error("Selecciona la fecha de vencimiento.");
    if (yr < now.getFullYear() || (yr === now.getFullYear() && mo < now.getMonth() + 1))
        throw new Error("La tarjeta estÃ¡ vencida.");

    return {
        id: previousCard.id || `card_${Date.now()}`,
        brand,
        last4: clean.slice(-4),
        holderName: holderName.trim(),
        expiryMonth: String(mo).padStart(2, "0"),
        expiryYear: String(yr),
        isDefault: Boolean(previousCard.isDefault),
        createdAt: previousCard.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

async function saveCard({ number, holderName, expiryMonth, expiryYear, cvv, makeDefault = false }) {
    const key = _userKey();
    if (!key) throw new Error("Inicia sesiÃ³n para guardar una tarjeta.");

    const cards = await listCards();
    const isFirst = cards.length === 0;
    const newCard = _buildCardPayload({ number, holderName, expiryMonth, expiryYear, cvv });
    newCard.isDefault = isFirst || makeDefault;

    if (makeDefault || isFirst) cards.forEach(c => (c.isDefault = false));
    cards.push(newCard);
    _writeLocal(key, cards);
    await _syncFirestore(key, cards);
    return newCard;
}

async function updateCard(cardId, { number, holderName, expiryMonth, expiryYear, cvv, makeDefault = false }) {
    const key = _userKey();
    if (!key) throw new Error("Inicia sesiÃ³n para editar una tarjeta.");

    const cards = await listCards();
    const cardIndex = cards.findIndex((card) => card.id === cardId);
    if (cardIndex < 0) throw new Error("La tarjeta ya no existe.");

    const currentCard = cards[cardIndex];
    const updatedCard = _buildCardPayload(
        { number, holderName, expiryMonth, expiryYear, cvv },
        currentCard
    );
    updatedCard.isDefault = currentCard.isDefault || makeDefault;

    if (makeDefault) cards.forEach(card => (card.isDefault = false));
    cards[cardIndex] = updatedCard;

    if (!cards.some(card => card.isDefault) && cards.length > 0) {
        cards[0].isDefault = true;
    }

    _writeLocal(key, cards);
    await _syncFirestore(key, cards);
    return updatedCard;
}

async function setDefaultCard(cardId) {
    const key = _userKey();
    if (!key) return;
    const cards = await listCards();
    cards.forEach(c => (c.isDefault = c.id === cardId));
    _writeLocal(key, cards);
    await _syncFirestore(key, cards);
    return cards;
}

async function deleteCard(cardId) {
    const key = _userKey();
    if (!key) return [];
    let cards = await listCards();
    const wasDefault = cards.find(c => c.id === cardId)?.isDefault;
    cards = cards.filter(c => c.id !== cardId);
    if (wasDefault && cards.length > 0) cards[0].isDefault = true;
    _writeLocal(key, cards);
    await _syncFirestore(key, cards);
    return cards;
}

window.SmuckyPayments = { listCards, saveCard, updateCard, setDefaultCard, deleteCard };

