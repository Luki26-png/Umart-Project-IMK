  // ✅ Get orderId from a DOM element
  const orderId = parseInt(document.querySelector('.order-id').id, 10);

  // ✅ Connect to WebSocket server
  const socket = io("http://localhost:8080");

  socket.on("connect", () => {
    console.log("🔌 Connected to WebSocket");

    // ✅ Join the specific order room
    socket.emit("join-order-room", orderId);
    console.log(`📦 Joined room: order-${orderId}`);

    // ✅ Trigger Firebase listener by hitting your /api/payment route
    fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderId: orderId })
    })
    .then(res => res.json())
    .then(data => {
      console.log("📬 Started watching payment:", data);
    })
    .catch(err => {
      console.error("❌ Failed to start watching:", err);
    });
  });

  // ✅ Handle payment confirmation
  socket.on("payment-success", (data) => {
    console.log("✅ Payment confirmed:", data);

    // Redirect to payment success page
    window.location.href = `/api/payment-success?orderId=${orderId}`;
  });

  // Optional error handling
  socket.on("connect_error", (err) => {
    console.error("❌ WebSocket connection error:", err.message);
  });