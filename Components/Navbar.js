class Navbar extends HTMLElement  {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // attach shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
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
                }
                .nav-links img {
                    width: 40px;
                    height: 40px;
                }
                .nav-links img[alt="Profile Icon"] {
                    border-radius: 50%;
                }
            </style>

            <header>
                <div class="left-section">
                    <button class="back-button">
                        <img src="../icons/back-icon.png" alt="Back Icon">
                    </button>
                    <a href="../Home/homepage.html">
                        <img src="../icons/logo.png" alt="KMITL Logo" class="logo">
                    </a>
                </div>

                <div class="search-container">
                    <input type="text" placeholder="Search...">
                    <button class="search-icon">
                        <img src="../icons/search-icon.png" alt="Search Icon">
                    </button>
                </div>

                <div class="nav-links">
                    <a href="../chat/chat.html">
                        <button>
                           <img src="../icons/chat-icon.png" alt="Chat Icon"> 
                            Chat
                        </button>
                    </a>
                    <a href="../Help/help.html">
                        <button>
                            <img src="../icons/help-icon.png" alt="Help Icon">
                            Help
                        </button>
                    </a>
                    <a href="../cart/cart.html">
                        <button>
                            <img src="../icons/cart-icon.png" alt="Cart Icon">
                            Cart
                        </button>
                    </a>
                    <a href="../profile/profile.html">
                        <button>
                            <img src="../icons/Profile.jpg" alt="Profile Icon">
                            Profile
                        </button>
                    </a>
                </div>
            </header>
        `;

        // เพิ่ม event listener ให้กับปุ่ม back-button
        this.shadowRoot.querySelector('.back-button').addEventListener('click', () => {
            history.back(); // ใช้ history.back() เพื่อย้อนกลับไปหน้าที่แล้ว
        });
    }
}
customElements.define('my-navbar', Navbar);
