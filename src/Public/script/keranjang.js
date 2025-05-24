function countCartTotal(){
    let cartTotal = 0;
    //quantity array
    const quantityArray = [];
    //price array
    const priceArray = [];

    const allItemsQuantity = document.querySelectorAll(".item-quantity");
    const allItemsPrice = document.querySelectorAll(".cart-item-price");

    allItemsQuantity.forEach((quantity)=>{
        quantityArray.push(parseInt(quantity.innerText, 10))
    });

    allItemsPrice.forEach((price)=>{
        const formattedPrice = price.innerText.replace(/\D/g, '');
        priceArray.push(parseInt(formattedPrice, 10));
    });

    if (quantityArray.length == priceArray.length) {
        for (let index = 0; index < priceArray.length; index++) {
            cartTotal += quantityArray[index] * priceArray[index];
        }
    }

    cartTotal = cartTotal.toString();
    cartTotal = cartTotal.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    document.getElementById('cart-total-price').innerText = `Rp ${cartTotal}`;    
}

function addQuantity(event){
    event.preventDefault();
    const quantityDisplayElement = event.target.previousElementSibling;
    if (quantityDisplayElement) {
        let currentQuantity = parseInt(quantityDisplayElement.innerText, 10);
        if (!isNaN(currentQuantity)) {
            currentQuantity++;
            quantityDisplayElement.innerText = currentQuantity;
        }
    }
    countCartTotal();
}

function substractQuantity(event){
    event.preventDefault();
    const quantityDisplayElement = event.target.nextElementSibling;
    if (quantityDisplayElement) {
        let currentQuantity = parseInt(quantityDisplayElement.innerText, 10);
        if (!isNaN(currentQuantity) && currentQuantity > 0) { // Prevent going below 0, adjust if needed (e.g., > 1)
            currentQuantity--;
            quantityDisplayElement.innerText = currentQuantity;
        }
    }
    countCartTotal();
}

//di bawah ini fungsi untuk menghapus cart item
let itemToDelete = null;
let itemToDeleteId = null;

let deleteCartItemButton = document.querySelectorAll(".delete-cart-item");
deleteCartItemButton.forEach((cartItem)=>{
    cartItem.addEventListener("click",(event)=>{
        itemToDelete = event.currentTarget.closest(".card");
        itemToDeleteId = itemToDelete.id;
        // Show confirmation modal
        const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
    });
});

document.getElementById("confirmDeleteBtn").addEventListener("click", async function() {
    if (!itemToDelete) return;

    const itemId = itemToDeleteId;

    try {
        const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart_item_id: itemId })
        });

        if (!response.ok) throw new Error("Server error");

        // Remove item from DOM
        itemToDelete.remove();
        itemToDelete = null;
        itemToDeleteId = null;

        // Show success alert
        const alertBox = document.getElementById("successAlert");
        alertBox.classList.remove("d-none");

        // Optionally hide after 3 seconds
        setTimeout(() => {
            alertBox.classList.add("d-none");
        }, 5000);


    } catch (error) {
        alert("Gagal menghapus item. Silakan coba lagi.");
    }
    //check if cart is empty after cart items removal
    const currentCartItems = document.querySelectorAll(".card");
    if(currentCartItems.length == 0){
        const heading4 = document.createElement("h4");
        heading4.innerText = "Your cart is empty";
        document.getElementById("keranjang-section").appendChild(heading4);
        document.getElementById("cart-total-price").innerHTML= "Rp 0";
    }else{
        countCartTotal();
    }
    // Hide modal
    const modalElement = document.getElementById('confirmDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
});

//function to create a date two weeks from now
function getDateTwoWeeksLater() {
  const currentDate = new Date();
  const twoWeeksInMillis = 14 * 24 * 60 * 60 * 1000; // 14 days * 24 hours/day * 60 mins/hour * 60 secs/min * 1000 ms/sec
  const futureDate = new Date(currentDate.getTime() + twoWeeksInMillis);

  // You can format the date as needed (e.g., YYYY-MM-DD)
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(futureDate.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}

function createTableRow(name, price, quantity){
    // Create a table row
    const row = document.createElement('tr');

    // Create and append the first cell
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    row.appendChild(nameCell);

    // Create and append the second cell
    const priceCell = document.createElement('td');
    priceCell.textContent = price;
    row.appendChild(priceCell);

    // Create and append the third cell
    const quantityCell = document.createElement('td');
    quantityCell.textContent = quantity;
    row.appendChild(quantityCell);

    // Append the row to an existing table body
    const tableBody = document.querySelector('#checkout-confirm-table-body');
    tableBody.appendChild(row);
}

//function to remove table body child after the confirmation modal was closed
document.getElementById('confirmCheckoutModal').addEventListener('hide.bs.modal', function () {
    const checkoutTableConfirmation = document.querySelector('#checkout-confirm-table-body');
    checkoutTableConfirmation.replaceChildren();
});

//function to show the confirmation modal after user click checkout button 
document.getElementById('checkout-button').addEventListener('click', (event)=>{
    event.preventDefault();

    const itemCard = document.querySelectorAll('.card');
    itemCard.forEach((item)=>{
        const quantity = parseInt(item.querySelector('.item-quantity').innerHTML, 10);
        if (quantity == 0) {
            return;   
        }
        let name = item.querySelector('.cart-item-name').innerHTML;
        let price = item.querySelector('.cart-item-price').innerText;
        price = price.slice(0, price.length - 1);
        createTableRow(name, price, quantity);
    });
    const cartTotalPrice = document.getElementById('cart-total-price').innerHTML;
    document.getElementById('confirm-total').innerHTML = `Total : ${cartTotalPrice}`;
    const modal = new bootstrap.Modal(document.getElementById('confirmCheckoutModal'));
    modal.show();
});

//function to send checkout data to the server after confirmation
document.getElementById('confirmCheckoutBtn').addEventListener('click',(event)=>{
    event.preventDefault();
    const cartTotalPrice = document.getElementById('cart-total-price').innerHTML;
    const cartItem = [];
    const address = document.getElementById('alamat').value.trim();
    if (!address || null || "") {
        window.alert("Alamat tidak boleh kosong");
        return;
    }

    const allCartItem = document.querySelectorAll('.item-quantity');
    allCartItem.forEach((item)=>{
        let itemQuantity = item.innerHTML;
        itemQuantity = parseInt(itemQuantity, 10);
        if (itemQuantity !== 0) {
            const currentItem = {
                productId : parseInt(item.id, 10),
                productQuantity : parseInt(item.innerHTML, 10),
                tenggat : getDateTwoWeeksLater()
            }
            cartItem.push(currentItem);
        }
    });

    const orderDetail = JSON.stringify({
        total : cartTotalPrice,
        address : address,
        orderItems :cartItem,
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/order", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = ()=>{
        if(xhr.status >= 200 && xhr.status < 300){
            let response = xhr.responseText;
            response = JSON.parse(response);
            window.location.assign("http://"+ window.location.host + `/user/payment?orderId=${response.orderId}&amount=${response.amount}&second_passed=86400`);
        }else{
            window.alert("Gagal membuat order");
        }
    }

    xhr.onerror = function () {
        // Handle network errors (e.g., connection refused, DNS error)
        //console.error("Network error occurred while trying to add product to cart.");
        window.alert("Terjadi kesalahan jaringan. Silakan periksa koneksi Anda dan coba lagi.");
    };

    xhr.send(orderDetail);    
});