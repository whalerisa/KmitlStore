class ProductContainer extends HTMLElement {
    constructor() {
        super();

        // Attach shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Create template for the component
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* ลิงก์ไปยังฟอนต์ Inter */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

                .product-container {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    margin-bottom: 40px;
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 20px;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                .product-image {
                    width: 300px;
                    height: auto;
                    object-fit: cover;
                }

                .product-details {
                    flex-grow: 1;
                    margin-left: 20px;
                }

                .product-details h2 {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 10px;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                .product-details .price {
                    background-color: #E35205;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 18px;
                    display: inline-block;
                    margin-bottom: 15px;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                .quantity {
                    font-size: 14px;
                    color: #999;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                .quantity .orange-text {
                    color: #E35205;
                }

                .shop-info {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                }

                .shop-info img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 10px;
                }

                .view-shop {
                    background-color: #E35205;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-left: 10px;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                .view-shop:hover {
                    background-color: #D43D05;
                }
            </style>

            <div class="product-container">
                <div class="product-image-container">
                    <img class="product-image" src="" alt="Product Image">
                    <div class="shop-info">
                        <img class="shop-owner-image" src="../icons/Profile.jpg" alt="Shop Owner">
                        <p class="shop-name"></p>
                        <a href="#" class="shop-link">
                            <button class="view-shop">View Shop</button>
                        </a>
                    </div>
                </div>
                <div class="product-details">
                    <h2 class="product-name"></h2>
                    <p class="price"></p>
                    <p class="description"></p>
                    <div class="quantity">
                        <p>Quantity <span class="orange-text">1</span></p>
                    </div>
                </div>
            </div>
        `;

        shadow.appendChild(template.content.cloneNode(true));
    }

    // Called when the element is added to the DOM
    connectedCallback() {
        const description = this.getAttribute('description').replace(/\n/g, '<br>');
        this.shadowRoot.querySelector('.product-image').src = this.getAttribute('image');
        this.shadowRoot.querySelector('.product-name').textContent = this.getAttribute('name');
        this.shadowRoot.querySelector('.price').textContent = `${this.getAttribute('price')} ฿`;
        this.shadowRoot.querySelector('.description').innerHTML = description; // ใช้ innerHTML เพื่อแสดง <br>
        this.shadowRoot.querySelector('.shop-name').textContent = this.getAttribute('shop-name');
        this.shadowRoot.querySelector('.shop-link').href = this.getAttribute('shop-link');
    }
    
}

// Define the new element
customElements.define('product-container', ProductContainer);
