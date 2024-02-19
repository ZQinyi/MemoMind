// home.js

document.addEventListener('DOMContentLoaded', function() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        const decoded = parseJwt(jwt);
        const userId = decoded.id; // 根据你的JWT结构调整键名
        console.log('UserId from JWT:', userId);

        // 使用userId获取用户信息或进行其他操作
        fetchUserInfo(userId);
    } else {
        // 如果没有JWT，可能需要重定向到登录页面
        window.location.href = '/login.html';
    }
});

function fetchUserInfo(userId) {
    // 根据userId获取用户信息的逻辑
    console.log('Fetching info for userId:', userId);
    // 这里可以添加调用API获取用户信息的代码
}
