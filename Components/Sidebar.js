class MySidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                /* ลิงก์ไปยังฟอนต์ Inter */
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;800&family=Inter:wght@400;600;800&display=swap');
                
                .sidebar {
                    position: fixed;
                    top: 100px; /* ตำแหน่งด้านบน */
                    left: 0; /* ตำแหน่งด้านซ้าย */
                    width: 200px;
                    background-color: #f8f8f8;
                    padding: 15px;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }

                .dropbtn {
                    background-color: #ffffff;
                    color: #000;
                    padding: 16px;
                    font-size: 16px;
                    border: none;
                    width: 100%;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }

                .dropdown-content {
                    display: none;
                    background-color: #ffffff;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    position: relative;
                    z-index: 1;
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }

                .dropdown:hover .dropdown-content {
                    display: block;
                }

                .dropdown-content a {
                    padding: 12px 16px;
                    text-decoration: none;
                    display: block;
                    color: black;
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }

                .dropdown-content a:hover {
                    background-color: #ddd;
                }

                .icon {
                    width: 10px;   
                    height: 10px;
                    margin-left: 10px;  
                }

                /* Right Sidebar Icons */
                .icon-bar {
                    position: fixed;
                    right: 0;
                    top: 100px;
                    height: 400px;
                    width: 80px;
                    background-color: #ffffff;
                    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 20px;
                }

                .icon-bar a {
                    margin-bottom: 40px;
                }

                .icon-bar img {
                    width: 60px;
                    height: 50px;
                }
            </style>

            <div class="sidebar">
                <div class="dropdown">
                    <button class="dropbtn">
                        Orders
                        <img src="../icons/down-fill-icon.png" alt="Orders Icon" class="icon">
                    </button>
                    <div class="dropdown-content">
                        <a href="../My_order/my_order.html">My Orders</a>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="dropbtn">
                        Products 
                        <img src="../icons/down-fill-icon.png" alt="Products  Icon" class="icon">
                    </button>
                    <div class="dropdown-content">
                        <a href="../My_products/my_products.html">My Products</a>
                        <a href="../Postproduct/Postproduct.html">Add New Product</a>
                    </div>
                </div>

                <div class="dropdown">
                    <button class="dropbtn">
                        Finance
                        <img src="../icons/down-fill-icon.png" alt="Finance Icon" class="icon">
                    </button>
                    <div class="dropdown-content">
                        <a href="../income/income.html">My Income</a>
                    </div>
                </div>
            </div>

            <div class="icon-bar">
                <a href="../Notification/notification.html" class="icon-notify">
                    <img src="../icons/sidebar-icon1.png" alt="Notifications">
                </a>
                <a href="../chat/chat.html" class="icon-message">
                    <img src="../icons/sidebar-icon2.png" alt="Messages">
                </a>
            </div>
        `;
    }
}

customElements.define('my-sidebar', MySidebar);
