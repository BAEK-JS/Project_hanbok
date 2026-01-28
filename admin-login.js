// Admin login functionality
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Simple authentication (데모용)
    // 실제 운영 시에는 서버 사이드 인증을 사용해야 합니다
    if (username === 'admin' && password === 'admin123') {
        // 로그인 성공
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        window.location.href = 'admin-dashboard.html';
    } else {
        // 로그인 실패
        errorMessage.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
        
        // 3초 후 에러 메시지 제거
        setTimeout(() => {
            errorMessage.textContent = '';
        }, 3000);
    }
});
