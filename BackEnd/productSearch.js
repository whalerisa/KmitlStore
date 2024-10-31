// productSearch.js
const navbar = document.querySelector('my-navbar').shadowRoot;

const searchInput = navbar.querySelector("[data-search]");
const productCardTemplate = navbar.querySelector("[data-product-template]");
const productCardContainer = navbar.querySelector("[data-product-cards-container]");

let products = [];

// ฟังก์ชันในการดึงข้อมูลสินค้าจากฐานข้อมูล
async function fetchProducts() {
    try {
        // สมมติว่า fetchProductsDB() คือฟังก์ชันดึงข้อมูลจากฐานข้อมูล
        const response = await fetch('/getProducts'); // ตัวอย่าง URL API
        const data = await response.json();
        
        // กรองข้อมูลที่มี stock มากกว่า 0
        products = data.filter(product => product.stock > 0).map(product => {
            const card = productCardTemplate.content.cloneNode(true).children[0];
            const nameElement = card.querySelector("[data-name]");
            const stockElement = card.querySelector("[data-stock]");
            nameElement.textContent = product.name;
            stockElement.textContent = `Stock: ${product.stock}`;
            productCardContainer.append(card);
            return { name: product.name, stock: product.stock, element: card };
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// ค้นหาสินค้าตามคำค้นหา
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    products.forEach(product => {
        const isVisible = product.name.toLowerCase().includes(value);
        product.element.classList.toggle("hide", !isVisible);
    });
});

// เรียกฟังก์ชันเพื่อดึงข้อมูลเมื่อโหลดหน้าเพจ
fetchProducts();
