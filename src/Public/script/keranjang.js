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
