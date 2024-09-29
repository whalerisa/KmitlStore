document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const switchToSigninBtn = document.getElementById('switchToSignin');
    const logoutBtn = document.getElementById('logout');
    const title = document.getElementById('title');

    // ฟังก์ชันสำหรับลงชื่อเข้าใช้
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        // ตรวจสอบว่ามีข้อมูลผู้ใช้ใน localStorage หรือไม่
        const storedUser = localStorage.getItem(username);
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.password === password) {
                alert('Login successful');
                localStorage.setItem('loggedInUser', username);
                showLogoutButton();
            } else {
                alert('Incorrect password');
            }
        } else {
            alert('User does not exist. Please create an account.');
        }
    });

    // ฟังก์ชันสำหรับสร้างบัญชีผู้ใช้ใหม่
    switchToSigninBtn.addEventListener('click', function() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username && password) {
            const userData = {
                username: username,
                password: password
            };
            // บันทึกข้อมูลผู้ใช้ลงใน localStorage
            localStorage.setItem(username, JSON.stringify(userData));
            alert('Account created successfully. Please login.');
        } else {
            alert('Please fill in both username and password');
        }
    });

    // ฟังก์ชันแสดงปุ่ม Logout
    function showLogoutButton() {
        title.textContent = `Welcome, ${localStorage.getItem('loggedInUser')}`;
        loginForm.style.display = 'none';
        switchToSigninBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    }

    // ฟังก์ชันสำหรับออกจากระบบ
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        title.textContent = 'Login';
        loginForm.style.display = 'block';
        switchToSigninBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
    });

    // ตรวจสอบว่าผู้ใช้ล็อกอินอยู่หรือไม่
    if (localStorage.getItem('loggedInUser')) {
        showLogoutButton();
    }
});
                                                                                                                                                                                                    