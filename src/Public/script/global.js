let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

document.getElementById("nav-cart-icon").addEventListener("click",()=>{
    window.location.assign("http://" + window.location.host + "/user/cart");
});