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

    // Hide modal
    const modalElement = document.getElementById('confirmDeleteModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
});