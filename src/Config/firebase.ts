import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get,remove, onValue } from "firebase/database"; // Changed 'set' to 'push'
import firebaseConfig from "./firebaseConfig";
const fbApp = initializeApp(firebaseConfig);
export const database = getDatabase(fbApp);

export async function writeNewOrderId(orderId: number) {
    const orderRef = ref(database, 'Payments/');
    try {
        const snapshot = await get(orderRef);
        let data: any = {};
        if (snapshot.exists()) {
            data = snapshot.val();
            data[orderId] = false; // Now modifying the JavaScript object
        } else {
            data[orderId] = false;
        }
        await set(orderRef, data); // Set the entire updated object
        console.log(`Order ID ${orderId} written successfully.`);
    } catch (error) {
        console.error("Error writing to realtime database:\n", error);
    }
}

export async function readOrderId(orderId:number){
    const orderRef = ref(database, `Payments/${orderId}`);
    try {
        const snapshot = await get(orderRef);
        if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(`Data for order ${orderId}:`, data);
        return data;
    } else {
      console.log(`Order with ID ${orderId} not found.`);
      return null;
    }
    } catch (error) {
        console.error(`Error fetching data for order id${orderId}:`, error);
        return null;
    }
}

export async function deletePaymentItem(itemKeyToDelete: number) {
  const itemRef = ref(database, `Payments/${itemKeyToDelete}`);
  try {
    await remove(itemRef);
    console.log(`Item with key "${itemKeyToDelete}" deleted successfully from Payments.`);
  } catch (error) {
    console.error(`Error deleting item with key "${itemKeyToDelete}":`, error);
  }
}
