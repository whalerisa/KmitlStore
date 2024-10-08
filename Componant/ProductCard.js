class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['image', 'title', 'size', 'price', 'description'];
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
        const title = this.getAttribute('title');
        const size = this.getAttribute('size');
        const price = this.getAttribute('price');
        const description = this.getAttribute('description');

        this.shadowRoot.innerHTML = `
            <style>
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
                }
            </style>
            <div class="product-card">
                <img src="${image}" alt="${title}">
                <h3>${title}</h3>
                <ul>
                    <li>${size}</li>
                    <li>${description}</li>
                </ul>
                <div class="product-price">
                    <span>${price} บาท</span>
                </div>
            </div>
        `;
    }
}

customElements.define('product-card', ProductCard);
