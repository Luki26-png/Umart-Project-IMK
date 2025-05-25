document.getElementById('searchInput').addEventListener('keyup', function () {
  const query = this.value.trim();

  if (query.length < 2) {
    document.getElementById('searchResults').innerHTML = '';
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:8080/api/find-product?q=${encodeURIComponent(query)}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let products;
      try {
        let response = JSON.parse(xhr.responseText);
        products = response["products"];
      } catch (e) {
        console.error('Invalid JSON response:', e);
        return;
      }

      const resultsContainer = document.getElementById('searchResults');
      resultsContainer.innerHTML = '';

      if (products.length === 0) {
        resultsContainer.innerHTML = '<div class="list-group-item">Tidak ada hasil</div>';
        return;
      }
      console.log(products);
      products.forEach(product => {
        const item = document.createElement('div');
        item.id = `${product.id}`;
        item.className = 'list-group-item list-group-item-action d-flex align-items-center found-item';

        item.innerHTML = `
          <img src="public/product_Img/${product.cover}" class="me-2" style="width: 128px; height: 128px; object-fit: cover; border-radius: 5px;">
          <div class="d-flex flex-column justify-content-around">
            <h5>${product.name}</h5>
            <p>${product.summary}</p>
          </div>
        `;

        resultsContainer.appendChild(item);
      });
    }
  };

  xhr.send();
});

document.getElementById('searchResults').addEventListener('click', function (event) {
  const item = event.target.closest('.found-item');
  if (item) {
    event.preventDefault();
    const productId = item.id;
    window.location.assign("http://" + location.host + `/user/product-detail/?id=${productId}`);
  }
});
