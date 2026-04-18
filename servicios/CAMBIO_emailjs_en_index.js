/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  CAMBIO EN index.js â€” agregar correos automÃ¡ticos
//  Busca la funciÃ³n confirmBuyModal y encuentra este bloque:
// ============================================================

// â–¼ BUSCAR (dentro de confirmBuyModal, donde dice "if (saved)"):
    if (saved) {
        await syncProductsFromFirestore();
        closeBuyModal();
        alert(`Compra confirmada con metodo de pago: ${paymentMethod}.`);
    }

// â–¼ REEMPLAZAR CON:
    if (saved) {
        await syncProductsFromFirestore();
        closeBuyModal();

        // Obtener email del cliente logueado
        const usuario = window.SmuckyAuth?.getCurrentUser?.();
        const emailCliente  = usuario?.email  || "";
        const nombreCliente = usuario?.nombre || usuario?.name || "Cliente";

        // Enviar correos (al cliente y a ti)
        if (emailCliente && typeof window.enviarCorreosVenta === "function") {
            window.enviarCorreosVenta(
                emailCliente,
                nombreCliente,
                product.nombre_prod || product.name,
                qty,
                product.precio     || product.price,
                (product.precio    || product.price) * qty
            );
        }

        alert(`Â¡Compra confirmada! Te enviamos un correo de confirmaciÃ³n a ${emailCliente || "tu correo"}.`);
    }


// ============================================================
//  TAMBIÃ‰N: Agrega este script en index.html antes de </body>
//  (despuÃ©s de firebase-compras.js y stripe-pago.js)
// ============================================================

// <script type="module" src="servicios/emailjs-notificaciones.js"></script>

