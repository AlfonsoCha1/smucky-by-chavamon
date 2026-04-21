// ============================================================
//  api/crear-preferencia-mp.js
//  Vercel Serverless Function
//
//  QUÉ HACE: Recibe los items del carrito desde el frontend,
//            crea una preferencia en Mercado Pago y devuelve
//            el init_point (URL de pago) al navegador.
//
//  CÓMO SE USA: El frontend llama a POST /api/crear-preferencia-mp
//               con el body que arma mercadopago-pago.js
// ============================================================

export default async function handler(req, res) {
    // Solo acepta POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    // Cabeceras CORS para que tu frontend en Vercel pueda llamar a esta función
    res.setHeader("Access-Control-Allow-Origin", "https://smucky-by-chavamon.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    try {
        const { items, payer, back_urls, auto_return } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "No se recibieron items válidos." });
        }

        // Llama a la API de Mercado Pago con tu Access Token de producción
        const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer APP_USR-6920117018883863-042102-4f0a2d6064a58124f1f1e1f15dbb1d8f-3253655437"
            },
            body: JSON.stringify({
                items: items.map(item => ({
                    title:       String(item.title      || "Producto"),
                    quantity:    Number(item.quantity   || 1),
                    unit_price:  Number(item.unit_price || 0),
                    currency_id: "MXN"
                })),
                payer: {
                    email: payer?.email || ""
                },
                back_urls: {
                    success: back_urls?.success || "https://smucky-by-chavamon.vercel.app/cuenta/pedidos.html?pago=exitoso&mp=si",
                    failure: back_urls?.failure || "https://smucky-by-chavamon.vercel.app/index.html?pago=cancelado&mp=si",
                    pending: back_urls?.pending || "https://smucky-by-chavamon.vercel.app/index.html?pago=pendiente&mp=si"
                },
                auto_return: auto_return || "approved",
                statement_descriptor: "SMUCKYS BY CHAVAMON",
                // Tiempo de expiración de la preferencia: 2 horas
                expiration_date_to: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
            })
        });

        if (!mpResponse.ok) {
            const errorData = await mpResponse.json();
            console.error("Error de Mercado Pago:", errorData);
            return res.status(mpResponse.status).json({
                error: "Mercado Pago rechazó la solicitud.",
                detalle: errorData
            });
        }

        const data = await mpResponse.json();

        // Devuelve solo el init_point al frontend
        return res.status(200).json({
            init_point: data.init_point,
            preference_id: data.id
        });

    } catch (error) {
        console.error("Error en crear-preferencia-mp:", error);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}