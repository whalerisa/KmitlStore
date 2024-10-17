class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name','image', 'detail', 'price'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const image = this.getAttribute('image');
        const name = this.getAttribute('name');
        const detail = this.getAttribute('detail');
        const price = this.getAttribute('price');
    
        // แยกรายละเอียดออกเป็นบรรทัดต่างๆ
        const detailLines = detail.split('<br>');
    
        this.shadowRoot.innerHTML = `
            <style>
                /* ลิงก์ไปยังฟอนต์ Inter */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
                
                .product-card {
                    background-color: white;
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    width: 250px;
                    height: 350px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    text-align: center;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }
    
                .product-card img {
                    max-width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 10px;
                }
    
                .product-card ul {
                    padding-left: 20px;
                    margin: 10px 0;
                    font-size: 14px;
                    color: #333;
                    list-style-type: disc;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }
    
                .product-price {
                    position: absolute;
                    bottom: 5px;
                    right: 15px;
                    background-color: #E35205;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif; /* ใช้ฟอนต์ Inter */
                }
            </style>
            <div class="product-card">
                <img src="${image}" alt="${detailLines[0]}">
                <h3>${name}</h3>
                <ul>
                    ${detailLines.map(line => `<li>${line}</li>`).join('')}
                </ul>
                <div class="product-price">
                    <span>${price} ฿</span>
                </div>
            </div>
        `;
    }
}

customElements.define('product-card', ProductCard);
