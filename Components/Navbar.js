class Navbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // attach shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
                /* ลิงก์ไปยังฟอนต์ Inter */
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;800&family=Inter:wght@400;600;800&display=swap');
                
                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #E35205;
                    padding: 10px 20px;
                    color: white;
                    position: fixed;
                    top: 0; 
                    left: 0; 
                    right: 0; 
                    z-index: 1000;
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }
                .left-section {
                    display: flex;
                    align-items: center;
                }
                .back-button {
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    margin-right: 10px;
                }
                .back-button img {
                    width: 60px;
                    transition: all 0.3s;
                }
                .logo {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                }
                .search-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .search-container input {
                    padding: 10px;
                    width: 600px;
                    border: none;
                    border-radius: 45px;
                    padding-right: 40px;
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }
                .search-icon {
                    position: absolute;
                    right: 10px;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                }
                .search-icon img {
                    width: 50px;
                }
                .nav-links {
                    display: flex;
                }
                .nav-links a {
                    margin-left: 10px;
                    text-decoration: none;
                }
                .nav-links button {
                    background-color: transparent;
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 14px;
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }
                .nav-links img {
                    width: 40px;
                    height: 40px;
                }

                .nav-links img[alt="Profile Icon"] {
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                }

                .nav-links button:hover {
                    color: #AA4109;
                }

                /* สำหรับหน้าจอ Desktop (มากกว่า 1024px) */
                .search-container input {
                    width: 600px;
                }
                .left-section {
                    display: flex;
                    align-items: center;
                }

                /* สำหรับแท็บเล็ต (ระหว่าง 768px ถึง 1024px) */
                @media (max-width: 1024px) and (min-width: 768px) {
                    .search-container input {
                        width: 400px; /* แถบค้นหาสั้นลง */
                    }
                    .nav-links a {
                        margin-left: 5px; /* ลดระยะห่างของลิงก์ */
                    }
                }

                /* สำหรับมือถือ (ความกว้างน้อยกว่า 768px) */
                @media (max-width: 767px) {
                    .search-container input {
                        width: 250px; /* แถบค้นหาสั้นลง */
                    }
                    .left-section {
                        display: none; /* ซ่อนปุ่ม back และโลโก้ */
                    }
                    .nav-links {
                        justify-content: center; /* จัดลิงก์ให้อยู่ตรงกลาง */
                    }
                    .nav-links a {
                        margin-left: 3px; /* ลดระยะห่างลงอีก */
                    }
                }

                /* สำหรับหน้าจอขนาดเล็กมาก (น้อยกว่า 480px) */
                @media (max-width: 480px) {
                    .search-container input {
                        width: 180px; /* แถบค้นหาสั้นลงอีก */
                    }
                    .nav-links img {
                        width: 30px; /* ลดขนาดไอคอน */
                        height: 30px;
                    }
                    .nav-links button {
                        font-size: 12px; /* ลดขนาดตัวอักษร */
                    }
                    .nav-links a {
                        margin-left: 1px; /* ลดระยะห่างลงอีก */
                    }
                }

                /* สำหรับหน้าจอขนาดเล็กมากๆ (น้อยกว่า 360px) */
                @media (max-width: 360px) {
                    .search-container input {
                        width: 100px; /* แถบค้นหาสั้นที่สุด */
                    }
                    .nav-links a {
                        margin-left: 1px; /* ลดระยะห่างลงอีก */
                    }
                }
            </style>

        <header>
                <div class="left-section">
                    <button class="back-button" id="backButton">
                        <img src="../icons/back-icon.png" alt="Back Icon" id="backIcon">
                    </button>
                    <a href="../Home/homepage.html">
                        <img src="../icons/logo.png" alt="KMITL Logo" class="logo">
                    </a>
                </div>

                <div class="search-container">
                    <!-- เพิ่ม input สำหรับค้นหาสินค้า -->
                    <input type="text" placeholder="Search products..." data-search>
                    <button class="search-icon">
                        <img src="../icons/search-icon.png" alt="Search Icon">
                    </button>
                </div>

                <div class="nav-links">
                    <a href="../chat/chat.html">
                        <button class="chat-button" id="chatButton">
                            <img src="../icons/chat-icon-1.png" alt="Chat Icon" id="chatIcon"> 
                            Chat
                        </button>
                    </a>
                    <a href="../Help/help.html">
                        <button class="help-button" id="helpButton">
                            <img src="../icons/help-icon.png" alt="Help Icon" id="helpIcon">
                            Help
                        </button>
                    </a>
                    <a href="../cart/cart.html">
                        <button class="cart-button" id="cartButton">
                            <img src="../icons/cart-icon.png" alt="Cart Icon" id="cartIcon">
                            Cart
                        </button>
                    </a>
                    <a href="../profile/profile.html">
                        <button id="profileButton">
                            <img src="../icons/profile-icon1.png" alt="Profile Icon">
                            Profile
                        </button>
                    </a>
                </div>
            </header>

            <!-- เพิ่ม Template และ Container สำหรับสินค้า -->
            <template data-product-template>
                <div class="product-card">
                    <h3 data-name></h3>
                    <p data-stock></p>
                </div>
            </template>
            <div data-product-cards-container></div>
        `;

        // Event listeners สำหรับปุ่มต่างๆ
        const backButton = this.shadowRoot.querySelector('#backButton');
        const backIcon = this.shadowRoot.querySelector('#backIcon');

        backButton.addEventListener('mouseover', () => {
            backIcon.src = '../icons/back-icon-3.png';
        });

        backButton.addEventListener('mouseout', () => {
            backIcon.src = '../icons/back-icon.png';
        });

        backButton.addEventListener('click', () => {
            history.back();
        });

        const chatButton = this.shadowRoot.querySelector('#chatButton');
        const chatIcon = this.shadowRoot.querySelector('#chatIcon');

        chatButton.addEventListener('mouseover', () => {
            chatIcon.src = '../icons/chat-icon-3.png';
        });

        chatButton.addEventListener('mouseout', () => {
            chatIcon.src = '../icons/chat-icon-1.png';
        });

        const helpButton = this.shadowRoot.querySelector('#helpButton');
        const helpIcon = this.shadowRoot.querySelector('#helpIcon');

        helpButton.addEventListener('mouseover', () => {
            helpIcon.src = '../icons/help-icon-2.png';
        });

        helpButton.addEventListener('mouseout', () => {
            helpIcon.src = '../icons/help-icon.png';
        });

        const cartButton = this.shadowRoot.querySelector('#cartButton');
        const cartIcon = this.shadowRoot.querySelector('#cartIcon');

        cartButton.addEventListener('mouseover', () => {
            cartIcon.src = '../icons/cart-icon-2.png';
        });

        cartButton.addEventListener('mouseout', () => {
            cartIcon.src = '../icons/cart-icon.png';
        });

        const profileButton = this.shadowRoot.querySelector('#profileButton'); 
        const profileIcon = profileButton.querySelector('img'); 

        profileButton.addEventListener('mouseover', () => {
            profileIcon.src = '../icons/profile-icon2.png'; 
        });

        profileButton.addEventListener('mouseout', () => {
            profileIcon.src = '../icons/profile-icon1.png'; 
        });
        const searchButton = this.shadowRoot.querySelector('#searchButton');
        const searchInput = this.shadowRoot.querySelector('[data-search]');

        searchButton.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.handleSearch();
        });
    }

    // ฟังก์ชันค้นหาสินค้า
    async handleSearch() {
        const query = this.shadowRoot.querySelector('[data-search]').value.toLowerCase();
        if (!query) return;

        try {
            // ดึงข้อมูลสินค้าที่มี stock > 0 จาก API
            const response = await fetch('search'); 
            const products = await response.json();

            // กรองสินค้าที่มีชื่อสอดคล้องกับคำค้นหาและมี stock > 0
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) && product.stock > 0
            );

            // แสดงผลลัพธ์การค้นหา
            this.displaySearchResults(filteredProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // แสดงผลลัพธ์การค้นหา
    displaySearchResults(products) {
        const productContainer = this.shadowRoot.querySelector('[data-product-cards-container]');
        productContainer.innerHTML = ''; // ล้างข้อมูลก่อนหน้านี้

        if (products.length === 0) {
            productContainer.innerHTML = `<p>No products found</p>`;
            return;
        }

        products.forEach(product => {
            const productTemplate = this.shadowRoot.querySelector('[data-product-template]').content.cloneNode(true);
            productTemplate.querySelector('[data-name]').textContent = product.name;
            productTemplate.querySelector('[data-stock]').textContent = `In stock: ${product.stock}`;
            productContainer.appendChild(productTemplate);
        });
    }
}

customElements.define('my-navbar', Navbar);