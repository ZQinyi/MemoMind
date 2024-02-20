document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessageDiv = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 读取用户名和密码
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 创建要发送的数据对象
        const data = { username, password };

        // 发送请求到后端登录接口
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 1) {
                    console.log('Login successful:', data);
                    // 保存token到localStorage
                    localStorage.setItem('token', data.data);

                    // 解析JWT获取userId
                    const userId = parseJwt(data.data).id;

                    // 跳转到对应的用户笔记页面
                    window.location.href = `/${userId}/notes`;
                } else {
                    errorMessageDiv.textContent = 'Login failed: ' + (data.msg || 'Invalid Username or Password');
                    errorMessageDiv.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Login Error:', error);
                errorMessageDiv.textContent = 'Login error';
                errorMessageDiv.style.display = 'block';
            });
    });
});

// Parse JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}