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
                    <input type="text" placeholder="Search...">
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
                        <button>
                            <img src="../icons/Profile.jpg" alt="Profile Icon">
                            Profile
                        </button>
                    </a>
                </div>
            </header>
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
    }
}

customElements.define('my-navbar', Navbar);
