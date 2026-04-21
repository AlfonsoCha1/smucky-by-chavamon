document.addEventListener("DOMContentLoaded", () => {
  // Confirma pedidos tras Stripe y Mercado Pago si aplica
  if (typeof window.confirmarPedidoTrasStripe === "function") {
    window.confirmarPedidoTrasStripe();
  }
  if (typeof window.confirmarPedidoTrasMP === "function") {
    window.confirmarPedidoTrasMP();
  }
  const orderCards = document.querySelectorAll(".order-card");
  const totalOrders = document.getElementById("totalOrders");
  const deliveredOrders = document.getElementById("deliveredOrders");
  const progressOrders = document.getElementById("progressOrders");

  const detailsButtons = document.querySelectorAll(".btn-details");
  const reorderButtons = document.querySelectorAll(".btn-reorder");

  const modal = document.getElementById("detailsModal");
  const closeModal = document.getElementById("closeModal");
  const modalContent = document.getElementById("modalContent");

  let deliveredCount = 0;
  let progressCount = 0;

  orderCards.forEach((card) => {
    const status = card.dataset.status;

    if (status === "entregado") deliveredCount++;
    if (status === "proceso") progressCount++;
  });

  totalOrders.textContent = orderCards.length;
  deliveredOrders.textContent = deliveredCount;
  progressOrders.textContent = progressCount;

  detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".order-card");

      const orderId = card.querySelector(".order-id")?.textContent || "Sin ID";
      const product = card.querySelector(".info-item .value")?.textContent || "Sin producto";
      const status = card.querySelector(".status")?.textContent || "Sin estado";

      const metaValues = card.querySelectorAll(".meta-value");
      const purchaseDate = metaValues[0]?.textContent || "No disponible";
      const paymentMethod = metaValues[1]?.textContent || "No disponible";
      const total = metaValues[2]?.textContent || "No disponible";

      modalContent.innerHTML = `
        <p><strong>Pedido:</strong> ${orderId}</p>
        <p><strong>Producto:</strong> ${product}</p>
        <p><strong>Estado:</strong> ${status}</p>
        <p><strong>Fecha de compra:</strong> ${purchaseDate}</p>
        <p><strong>Método de pago:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> ${total}</p>
      `;

      modal.classList.add("active");
    });
  });

  reorderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".order-card");
      const product = card.querySelector(".info-item .value")?.textContent || "producto";

      alert(`Se agregó nuevamente "${product}" al carrito.`);
      
      // Aquí puedes reemplazar el alert por tu lógica real:
      // addToCart(productId)
      // window.location.href = "../carrito.html";
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
});