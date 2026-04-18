/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/firebase-compras.js
//  ES: Conecta la tienda con Firestore. Carga productos y su
//      stock desde la nube, y procesa pedidos en tiempo real
//      usando transacciones para evitar stock negativo.
//  EN: Connects the store with Firestore. Loads products and
//      their stock from the cloud, and processes orders in
//      real time using transactions to prevent negative stock.
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
    serverTimestamp,
    runTransaction,
    query,
    where,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
    authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
    projectId: "smuckys-by-chavamon-loginregis",
    storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
    messagingSenderId: "185108836763",
    appId: "1:185108836763:web:d7b923507c3c32e28e313e",
    measurementId: "G-ZL3DD1KGH8"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// ES: Busca el documento del producto en Firestore primero por ID directo,
//     y si no existe, por el campo id_local. Devuelve la referencia y snapshot.
// EN: Looks up the product document in Firestore first by direct ID,
//     and if not found, by the id_local field. Returns the ref and snapshot.
async function resolverDocumentoProducto(productoId) {
    const directRef = doc(db, "productos", String(productoId));
    const directSnap = await getDoc(directRef);

    if (directSnap.exists()) {
        return {
            ref: directRef,
            snap: directSnap
        };
    }

    const localId = Number(productoId);
    if (Number.isNaN(localId)) {
        return null;
    }

    const localQuery = query(
        collection(db, "productos"),
        where("id_local", "==", localId),
        limit(1)
    );
    const localSnap = await getDocs(localQuery);

    if (localSnap.empty) {
        return null;
    }

    const productDoc = localSnap.docs[0];
    return {
        ref: doc(db, "productos", productDoc.id),
        snap: productDoc
    };
}

// ES: Obtiene todos los productos de Firestore y los devuelve como array con
//     sus datos normalizados (nombre, precio, stock, categorÃ­a e imagen).
// EN: Fetches all products from Firestore and returns them as a normalized array
//     with name, price, stock, category, and image fields.
async function cargarProductosDesdeFirestore() {
    try {
        const snapshot = await getDocs(collection(db, "productos"));
        const productos = [];

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            productos.push({
                firestoreId: docSnap.id,
                id_local: data.id_local ?? null,
                nombre_prod: data.nombre_prod || "",
                precio: data.precio || 0,
                stock: data.stock ?? 0,
                categoria: data.categoria || "",
                url_imagen: data.url_imagen || ""
            });
        });

        return productos;
    } catch (error) {
        console.error("Error al cargar productos:", error);
        return [];
    }
}

// ES: Obtiene el stock actual de cada producto y lo devuelve como un mapa
//     {id_producto: stock}. Ãštil para sincronizaciÃ³n rÃ¡pida del inventario.
// EN: Gets the current stock for each product and returns it as a map
//     {product_id: stock}. Useful for quick inventory synchronization.
async function cargarStockDesdeFirestore() {
    try {
        const snapshot = await getDocs(collection(db, "productos"));
        const stockMap = {};

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            stockMap[String(data.id_local ?? docSnap.id)] = data.stock ?? 0;
        });

        return stockMap;
    } catch (error) {
        console.error("Error al cargar stock:", error);
        return {};
    }
}

// ES: Procesa la compra de un producto: descuenta el stock en Firestore con una
//     transacciÃ³n atÃ³mica, crea un documento en "pedidos" y otro en "ventas".
//     Muestra alertas en caso de stock insuficiente o errores de permisos.
// EN: Processes the purchase of a product: deducts stock in Firestore using an
//     atomic transaction, creates a document in "pedidos" and one in "ventas".
//     Shows alerts for insufficient stock or permission errors.
async function realizarPedido(productoId, cantidad = 1, nombreProducto = "", precioUnitario = 0, codigoVerificacionPago = "") {
    try {
        const resolved = await resolverDocumentoProducto(productoId);
        if (!resolved) {
            throw new Error("El producto no existe en la base de datos.");
        }

        const productoRef = resolved.ref;
        const productData = resolved.snap.data();
        const nombreFinal = nombreProducto || productData.nombre_prod || productData.nombre || "Producto";
        const precioFinal = Number(precioUnitario) || Number(productData.precio) || 0;
        const usuario = window.SmuckyAuth?.getCurrentUser?.() || null;

        const stockRestante = await runTransaction(db, async (transaction) => {
            const productoSnap = await transaction.get(productoRef);

            if (!productoSnap.exists()) {
                throw new Error("El producto no existe en la base de datos.");
            }

            const stockActual = productoSnap.data().stock ?? 0;
            if (stockActual < cantidad) {
                throw new Error(
                    stockActual === 0
                        ? `"${nombreFinal}" esta agotado.`
                        : `Solo quedan ${stockActual} unidades de "${nombreFinal}".`
                );
            }

            transaction.update(productoRef, { stock: stockActual - cantidad });
            return stockActual - cantidad;
        });

        const ahoraIso = new Date().toISOString();
        await addDoc(collection(db, "pedidos"), {
            producto_id: productoRef.id,
            id_local: productData.id_local ?? null,
            nombre: nombreFinal,
            nombre_prod: nombreFinal,
            cantidad,
            precio_unitario: precioFinal,
            total: precioFinal * cantidad,
            estado: "pago_verificado",
            estado_envio: "preparando",
            codigo_verificacion_pago: codigoVerificacionPago || "",
            usuario_uid: usuario?.uid || "anonimo",
            usuario_email: usuario?.email || "anonimo",
            timeline: [
                { estado: "pedido_creado", fecha_iso: ahoraIso, detalle: "Pedido recibido" },
                { estado: "pago_verificado", fecha_iso: ahoraIso, detalle: "Codigo de pago validado" },
                { estado: "preparando", fecha_iso: ahoraIso, detalle: "Tu pedido esta en preparacion" }
            ],
            fecha: serverTimestamp()
        });

        const ahora = new Date();
        await addDoc(collection(db, "ventas"), {
            producto_id: productoRef.id,
            id_local: productData.id_local ?? null,
            nombre: nombreFinal,
            nombre_prod: nombreFinal,
            cantidad,
            precio_unitario: precioFinal,
            total: precioFinal * cantidad,
            anio: ahora.getFullYear(),
            mes: ahora.getMonth() + 1,
            dia: ahora.getDate(),
            fecha: serverTimestamp()
        });

        console.log(`Pedido OK - "${nombreFinal}" stock restante: ${stockRestante}`);
        return true;
    } catch (error) {
        console.error("Error al realizar pedido:", error);

        if (error.message.includes("agotado") || error.message.includes("quedan") || error.message.includes("no existe")) {
            alert(error.message);
        } else if (String(error.message || "").toLowerCase().includes("permission") || String(error.code || "").toLowerCase().includes("permission")) {
            alert("Firebase rechazo la compra por permisos. Revisa tus reglas de Firestore para permitir leer y escribir pedidos, ventas y productos.");
        } else {
            alert("No se pudo completar el pedido. Intenta de nuevo.");
        }

        return false;
    }
}

window.realizarPedido = realizarPedido;
window.cargarStockDesdeFirestore = cargarStockDesdeFirestore;
window.cargarProductosDesdeFirestore = cargarProductosDesdeFirestore;

