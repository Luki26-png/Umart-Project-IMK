function showDetail(event){
    event.preventDefault();
    window.location.assign("http://localhost:" + window.location.port + "/user/product-detail?id=" + event.target.id);
}

function showDetailPrice(event){
    const clickedButton = event.currentTarget;
    const productId = clickedButton.id;
    window.location.assign("http://"+ window.location.host + "/user/add-product?id=" + productId);
}