class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* ลิงก์ไปยังฟอนต์ Inter */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

                /* ตั้งค่าให้ body ครอบคลุมเต็มหน้าและใช้งาน flexbox */
                :host {
                    display: flex;
                    flex-direction: column;
                    min-height: 70vh; /* ความสูงขั้นต่ำให้เต็มหน้าจอ */
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                /* Content wrapper */
                .content {
                    flex: 1;
                    padding-bottom: 10px; /* ลด padding-bottom เพื่อลดระยะห่างจาก footer */
                }

                /* Footer */
                footer {
                    background-color: #E35205;
                    color: white;
                    padding: 20px 20px; /* ลด padding ของ footer ให้เล็กลง */
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
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
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }

                .footer-links ul, .social-links ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li, .social-links li {
                    font-size: 12px;
                    margin: 3px 0;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
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
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
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
                        <li>Help Center</li>
                        <li>How To Buy</li>
                        <li>How To Sell</li>
                        <li>Payment Methods</li>
                        <li>Contact Us</li>
                    </ul>
                </div>

                <div class="social-links">
                    <h2>Follow Us</h2>
                    <ul>
                        <li><img src="../icons/ig-icon.png" alt="Instagram Icon"> Instagram</li>
                        <li><img src="../icons/faceB-icon.png" alt="Facebook Icon"> Facebook</li>
                        <li><img src="../icons/linee-icon.png" alt="Line Icon"> Line</li>
                    </ul>
                </div>
            </footer>
        `;
    }
}

// Define the custom element
customElements.define('my-footer', Footer);
