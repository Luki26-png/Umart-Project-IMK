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

function addToCart(event){
    event.preventDefault();
    const productId = parseInt(event.currentTarget.id, 10);
    const productTotal = parseInt(document.getElementById("total-amount").innerText, 10);
    if (productTotal == 0){
        window.alert("Jumlah produk tidak boleh 0");
        return;
    }

    const formData = JSON.stringify({
        product_id: productId,
        quantity: productTotal
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/cart", true);
    xhr.setRequestHeader("Content-Type", "application/json");


    xhr.onload = ()=>{
        if(xhr.status >= 200 && xhr.status < 300){
            window.alert("berhasil menambahkan produk ke keranjang");
        }else{
            window.alert("Gagal menambahkan, Produk ini sudah ada didalam keranjang");
        }
    }

    xhr.onerror = function () {
        // Handle network errors (e.g., connection refused, DNS error)
        //console.error("Network error occurred while trying to add product to cart.");
        window.alert("Terjadi kesalahan jaringan. Silakan periksa koneksi Anda dan coba lagi.");
    };

    xhr.send(formData);
};