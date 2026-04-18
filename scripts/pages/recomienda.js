/* ES: Comentarios base para mantenimiento. EN: Baseline comments for maintenance. */
// ============================================================
//  scripts/pages/recomienda.js
//  ES: Maneja el formulario de "Recomienda a un Amigo". Al enviar,
//      muestra un mensaje de agradecimiento al usuario.
//  EN: Handles the "Refer a Friend" form. On submit, displays a
//      thank-you message to the user.
// ============================================================

// ES: Escucha el envÃ­o del formulario y muestra mensaje de agradecimiento.
// EN: Listens for the form submission and shows a thank-you message.
document.getElementById("referForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Invitacion enviada. Gracias por recomendar Smucky.");
});

