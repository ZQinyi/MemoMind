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
                    const base64Url = data.data.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const payload = JSON.parse(window.atob(base64));
                    const userId = payload.id;

                    // 使用fetchWithToken函数发起后续请求
                    // 示例：获取用户笔记
                    fetchWithToken(`/${userId}/notes`)
                        .then(response => response.json())
                        .then(notesData => {
                            console.log('User notes:', notesData);
                            // 处理用户笔记数据，如在页面上显示笔记
                            // 注意：这里的逻辑需要根据你的应用需求来实现
                        })
                        .catch(error => console.error('Error fetching user notes:', error));

                    // 跳转到对应的用户笔记页面（如果需要）
                        window.location.href = `/${userId}/notes`;
                } else {
                    errorMessageDiv.textContent = 'Login failed: ' + (data.msg || 'Invalid Username or Password');
                    errorMessageDiv.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Login Error:', error);
                errorMessageDiv.textContent = 'Login error: ' + error.message;
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

function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token');
    if (token) {
        // 确保options.headers对象存在
        if (!options.headers) {
            options.headers = {};
        }
        // 使用 'token' 作为键，携带JWT
        options.headers['token'] = token;
    }
    return fetch(url, options);
}