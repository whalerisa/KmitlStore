document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const image = document.getElementById('image').files[0];
    const productName = document.getElementById('productName').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;

    // Create a FileReader to display the image
    const reader = new FileReader();
    reader.onload = function(event) {
        const productList = document.getElementById('productList');

        // Create a new product item
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <h2>${productName}</h2>
            <img src="${event.target.result}" alt="${productName}" style="width: 100%; height: auto;">
            <p><strong>หมวดหมู่:</strong> ${category}</p>
            <p><strong>รายละเอียด:</strong> ${description}</p>
            <p><strong>ราคา:</strong> ${price} บาท</p>
            <p><strong>คลัง:</strong> ${stock}</p>
        `;
        
        // Add product item to product list
        productList.appendChild(productItem);

        // Clear the form
        document.getElementById('productForm').reset();
    };

    // Read the image file
    if (image) {
        reader.readAsDataURL(image);
    }
});
