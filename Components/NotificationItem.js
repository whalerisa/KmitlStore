class NotificationItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // สร้าง container ของ notification item
        const container = document.createElement('div');
        container.classList.add('notification-item');

        const content = document.createElement('div');
        content.classList.add('notification-content');

        // รับค่าที่ถูกส่งเข้ามาใน attribute ของ component
        const message = this.getAttribute('message') || 'ไม่มีข้อความ';
        const time = this.getAttribute('time') || 'ไม่ระบุเวลา';

        // สร้างข้อความและเวลา
        content.innerHTML = `
            <p>${message}</p>
            <span class="notification-time">${time}</span>
        `;

        container.appendChild(content);
        shadow.appendChild(container);

        // แนบ CSS เข้ากับ shadow DOM
        const style = document.createElement('style');
        style.textContent = `
            /* ลิงก์ไปยังฟอนต์ Inter */
            @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;800&family=Inter:wght@400;600;800&display=swap');

            .notification-item {
                display: flex;
                justify-content: center;
                width: 100%;
                margin-top: 20px;
            }

            .notification-content {
                background-color: #f7f7f7;
                color: #333;
                padding: 20px;
                width: 55%;
                height: 30px;
                position: relative;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 15px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                transition: background-color 0.3s, box-shadow 0.3s;
                font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
            }

            .notification-content:hover {
                background-color: #f1dcd1;
                color: black;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            }

            .notification-time {
                font-size: 12px;
                color: #666;
                position: absolute;
                bottom: 5px;
                right: 10px;
                font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
            }

            p {
                margin: 0;
                font-family: 'Inter', 'Kanit', 'Noto Sans Thai', sans-serif;
            }
        `;
        shadow.appendChild(style);
    }
}

// กำหนดชื่อของ Web Component
customElements.define('notification-item', NotificationItem);
