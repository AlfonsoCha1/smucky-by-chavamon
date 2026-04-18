/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/seguridad.js
//  ES: Maneja el formulario de reporte de seguridad. Al enviar,
//      muestra un mensaje de confirmaciÃ³n al usuario.
//  EN: Handles the security report form. On submit, displays a
//      confirmation message to the user.
// ============================================================

// ES: Escucha el envÃ­o del formulario de reporte y muestra confirmaciÃ³n.
// EN: Listens for the report form submission and shows a confirmation.
document.getElementById("reportForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Gracias. Tu reporte fue enviado al equipo de seguridad.");
});

