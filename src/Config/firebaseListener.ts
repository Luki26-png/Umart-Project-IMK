// firebaseListeners.ts
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import { Server } from "socket.io";
import { PaymentDetailModel, OrderItemModel, OrderItemStatus } from "../Models/orderModel";

export function watchPayments(io: Server) {
  const ordersToWatch: Set<string> = new Set();

  return function startWatching(orderId: number) {
    console.log("👀 Started watching to firebase realtime database", orderId);
    const orderKey = `Payments/${orderId}`;
    if (ordersToWatch.has(orderKey)) return;

    const orderRef = ref(database, orderKey);
    ordersToWatch.add(orderKey);

    onValue(orderRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(`💰 Payment update detected for order ${orderId}`);

        const paymentDetailModel = new PaymentDetailModel(null);
        const orderItemModel = new OrderItemModel();

        await paymentDetailModel.updatePaymentDetailStatusLunas(orderId);
        await orderItemModel.updateOrderItemStatus(orderId, OrderItemStatus.diproses);

        io.to(`order-${orderId}`).emit("payment-success", { orderId });
      }
    });
  };
}
