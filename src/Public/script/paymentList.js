function openPaymentPage(event){
    event.preventDefault();
    const orderId = event.target.id;
    const container = event.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild;
    const amount = container.innerText;
    const second_passed = container.id;
    
    window.location.assign("http://" + location.host + `/user/payment?orderId=${orderId}&amount=${amount}&second_passed=${second_passed}`);
}