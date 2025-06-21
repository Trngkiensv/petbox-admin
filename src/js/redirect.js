/**
 * Script to redirect based on authentication status
 */

// Kiểm tra trạng thái đăng nhập và thực hiện chuyển hướng
function handleRedirect() {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Xác định trang hiện tại
  const currentPath = window.location.pathname;
  const isIndexPage = currentPath.endsWith('index.html') ||
                      currentPath === '/' ||
                      currentPath.endsWith('/');
  const isLoginPage = currentPath.includes('login.html');

  // Nếu đã đăng nhập
  if (token && isLoggedIn) {
    if (isLoginPage) {
      // Nếu đã đăng nhập mà vẫn ở trang login, chuyển đến index
      window.location.href = 'views/index.html';
    }
    // Nếu đã đăng nhập và đang ở trang index, không làm gì cả
    console.log('Người dùng đã đăng nhập, ở lại trang hiện tại');
    return;
  }

  // Nếu chưa đăng nhập
  if (!token || !isLoggedIn) {
    if (!isLoginPage) {
      // Nếu chưa đăng nhập và không ở trang login, chuyển đến login
      window.location.href = 'login.html';
    }
  }
}

// Gọi hàm xử lý chuyển hướng khi trang tải xong
window.addEventListener('DOMContentLoaded', handleRedirect);
