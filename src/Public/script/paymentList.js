function openPaymentPage(event){
    event.preventDefault();
    const orderId = event.target.id;
    const amount = event.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.innerText;
    
    window.location.assign("http://" + location.host + `/user/payment?orderId=${orderId}&amount=${amount}`);
}