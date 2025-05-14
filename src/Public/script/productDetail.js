function showDetail(event){
    event.preventDefault();
    window.location.assign("http://localhost:" + window.location.port + "/user/product-detail?id=" + event.target.id)
}