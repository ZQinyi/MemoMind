// login.js

function handleLoginSubmit(username, password) {
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                // 服务器响应包含JWT
                localStorage.setItem('jwt', data.data); // 假设JWT在响应的data字段中
                // 跳转到主页或其他页面
                window.location.href = '/home.html';
            } else {
                alert('Invalid Username or Password');
            }
        }).catch(error => {
        console.error('Login Error:', error);
        alert('Login Error');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表单默认提交行为
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            handleLoginSubmit(username, password);
        });
    }
});

