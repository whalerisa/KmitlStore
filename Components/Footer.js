class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* ลิงก์ไปยังฟอนต์ Inter */
                @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;800&family=Inter:wght@400;600;800&display=swap');

                /* ทำให้ตัว host ครอบคลุมเต็มความสูงของหน้าจอ */
                :host {
                    display: flex;
                    flex-direction: column;
                    min-height: 50vh; /* ความสูงของทั้งหน้าเพจต้องครอบคลุมทั้งหน้าจอ */
                    font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
                }

                /* Content wrapper */
                .content {
                    flex: 1;
                }

                /* Footer */
                footer {
                    background-color: #E35205;
                    color: white;
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    width: 100%; /* กำหนดให้ footer กว้างเต็มจอ */
                    box-sizing: border-box; /* ทำให้ padding รวมอยู่ในการคำนวณขนาด */
                }

                .footer-links, .social-links {
                    flex: 1;
                    margin: 0;
                    padding-right: 10px;
                }

                .footer-links h2, .social-links h2 {
                    font-size: 16px;
                    margin-bottom: 10px;
                    color: #fff;
                }

                .footer-links ul, .social-links ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li, .social-links li {
                    font-size: 12px;
                    margin: 3px 0;
                }

                .social-links li {
                    display: flex;
                    align-items: center;
                }

                .social-links img {
                    width: 15px;
                    margin-right: 10px;
                }

                footer a {
                    color: white;
                    text-decoration: none;
                }

                footer a:hover {
                    text-decoration: underline;
                }
            </style>

            <div class="content">
                <!-- ส่วนของเนื้อหาหลักในหน้านี้ -->
                <slot></slot> <!-- ใช้ slot เพื่อใส่เนื้อหาจากภายนอก -->
            </div>

            <footer>
                <div class="footer-links">
                    <h2>Customer Service</h2>
                    <ul>
                        
                        <li>Phone Number:</li>
                         <li>098-295-1712 or 080-064-8332</li>
                        <li>Email: </li>
                        <li>65050222@kmitl.ac.th or 65050810@kmitl.ac.th</li>
                        <li>Service Hours: 8:00 AM - 10:00 PM</li>
                    </ul>
                </div>

                <div class="social-links">
                    <h2>Follow Us</h2>
                    <ul>
                        <li><img src="../icons/ig-icon.png" alt="Instagram Icon "> Instagram: KMITL Store</li>
                        <li><img src="../icons/faceB-icon.png" alt="Facebook Icon"> Facebook: KMITL Store </li>
                        <li><img src="../icons/linee-icon.png" alt="Line Icon"> Line: KMITL Store</li>
                    </ul>
                </div>
            </footer>
        `;
    }
}

// Define the custom element
customElements.define('my-footer', Footer);
