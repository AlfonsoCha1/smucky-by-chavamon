/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  servicios/reporte-excel.js
//  ES: Genera un archivo Excel (.xlsx) con reportes de:
//      - Stock actual de productos
//      - Ventas y transacciones del aÃ±o
//      - Resumen de ingresos y unidades vendidas
//  EN: Generates an Excel file (.xlsx) with reports of:
//      - Current product stock
//      - Sales and transactions for the year
//      - Summary of revenue and units sold
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCewAiOXXWT7O1L2WCBksejOnf8sZFj2KQ",
    authDomain: "smuckys-by-chavamon-loginregis.firebaseapp.com",
    projectId: "smuckys-by-chavamon-loginregis",
    storageBucket: "smuckys-by-chavamon-loginregis.firebasestorage.app",
    messagingSenderId: "185108836763",
    appId: "1:185108836763:web:d7b923507c3c32e28e313e"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// ES: Carga SheetJS desde CDN si no estÃ¡ disponible en memoria.
// EN: Loads SheetJS from CDN if not available in memory.
async function cargarSheetJS() {
    return new Promise((resolve, reject) => {
        if (window.XLSX) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js";
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ES: Genera un reporte Excel completo del aÃ±o especificado con 3 hojas:
//     Stock, Ventas y Resumen de ingresos.
// EN: Generates a complete Excel report for the specified year with 3 sheets:
//     Stock, Sales, and Revenue Summary.
async function generarReporteExcel(anio = new Date().getFullYear()) {
    if (!window.XLSX) {
        await cargarSheetJS();
    }

    const XLSX = window.XLSX;

    try {
        const productosSnap = await getDocs(collection(db, "productos"));
        const filasProductos = [["Nombre del producto", "ID Firestore", "Stock actual", "Precio ($MXN)"]];

        productosSnap.forEach((docSnap) => {
            const data = docSnap.data();
            filasProductos.push([
                data.nombre_prod || data.nombre || data.name || docSnap.id,
                docSnap.id,
                data.stock ?? 0,
                data.precio ?? 0
            ]);
        });

        const ventasSnap = await getDocs(query(collection(db, "ventas"), where("anio", "==", anio)));
        const filasVentas = [["Fecha", "Producto", "ID Producto", "Cantidad vendida", "Precio unitario ($)", "Total ($)"]];
        const resumenMap = {};
        let totalGeneral = 0;
        let unidadesTotales = 0;

        ventasSnap.forEach((docSnap) => {
            const venta = docSnap.data();
            const fecha = venta.fecha?.toDate?.()
                ? venta.fecha.toDate().toLocaleDateString("es-MX")
                : `${venta.dia}/${venta.mes}/${venta.anio}`;
            const nombreProducto = venta.nombre_prod || venta.nombre || "-";

            filasVentas.push([
                fecha,
                nombreProducto,
                venta.producto_id || "-",
                venta.cantidad || 0,
                venta.precio_unitario || 0,
                venta.total || 0
            ]);

            totalGeneral += venta.total || 0;
            unidadesTotales += venta.cantidad || 0;

            if (!resumenMap[venta.producto_id]) {
                resumenMap[venta.producto_id] = {
                    nombre: nombreProducto,
                    vendido: 0,
                    ingresos: 0
                };
            }

            resumenMap[venta.producto_id].vendido += venta.cantidad || 0;
            resumenMap[venta.producto_id].ingresos += venta.total || 0;
        });

        filasVentas.push([]);
        filasVentas.push(["", "TOTAL", "", unidadesTotales, "", totalGeneral]);

        const stockMap = {};
        productosSnap.forEach((docSnap) => {
            stockMap[docSnap.id] = docSnap.data().stock ?? 0;
        });

        const filasResumen = [["Producto", "Unidades vendidas", "Stock que quedÃ³", "Ingresos totales ($)"]];
        Object.entries(resumenMap)
            .sort(([, left], [, right]) => right.ingresos - left.ingresos)
            .forEach(([productoId, resumen]) => {
                filasResumen.push([
                    resumen.nombre,
                    resumen.vendido,
                    stockMap[productoId] ?? "-",
                    resumen.ingresos
                ]);
            });

        const workbook = XLSX.utils.book_new();
        const stockSheet = XLSX.utils.aoa_to_sheet(filasProductos);
        const ventasSheet = XLSX.utils.aoa_to_sheet(filasVentas);
        const resumenSheet = XLSX.utils.aoa_to_sheet(filasResumen);

        ajustarAnchosColumnas(stockSheet, filasProductos);
        ajustarAnchosColumnas(ventasSheet, filasVentas);
        ajustarAnchosColumnas(resumenSheet, filasResumen);

        XLSX.utils.book_append_sheet(workbook, stockSheet, "Stock Actual");
        XLSX.utils.book_append_sheet(workbook, ventasSheet, `Ventas ${anio}`);
        XLSX.utils.book_append_sheet(workbook, resumenSheet, `Resumen ${anio}`);

        XLSX.writeFile(workbook, `SMUCKY_Reporte_${anio}.xlsx`);
        alert(`Reporte descargado: SMUCKY_Reporte_${anio}.xlsx`);
    } catch (error) {
        console.error("Error generando reporte:", error);
        alert("No se pudo generar el reporte. Intenta de nuevo.");
    }
}

function ajustarAnchosColumnas(sheet, rows) {
    const widths = [];

    rows.forEach((row) => {
        row.forEach((cell, index) => {
            const length = String(cell ?? "").length;
            widths[index] = Math.max(widths[index] || 10, length + 4);
        });
    });

    sheet["!cols"] = widths.map((width) => ({ wch: Math.min(width, 40) }));
}

function cargarSheetJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

window.generarReporteExcel = generarReporteExcel;
