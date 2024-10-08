class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* Footer */
                footer {
                    background-color: #E35205;
                    color: white;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    margin-top: 110px; /* เพิ่มระยะห่างระหว่างส่วนตรงกลางกับ footer */
                }

                .footer-links, .social-links {
                    flex: 1;
                    margin: 0;
                    padding-right: 10px;
                }

                /* ข้อความใน footer */
                .footer-links h2, .social-links h2 {
                    font-size: 16px;
                    margin-bottom: 10px;
                    color: #fff; /* สีขาว */
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
                </div>
            </footer>
        `;
    }
}

// Define the custom element
customElements.define('my-footer', Footer);
