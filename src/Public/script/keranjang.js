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
    };    
    // Hide modal
    const modalElement = document.getElementById('confirmDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
});