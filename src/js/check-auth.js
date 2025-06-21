/**
 * Kiểm tra xác thực người dùng và quản lý chuyển hướng
 */

// Hàm để xác định người dùng đã đăng nhập hay chưa
function isUserLoggedIn() {
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return token && isLoggedIn;
}

// Hàm để xác định vị trí tương đối trang login
function getLoginPath() {
  // Nếu đang ở trong thư mục views thì đường dẫn tương đối khác
  if (window.location.pathname.includes('/views/')) {
    return '../login.html';
  }
  return 'login.html';
}

// Hàm để xác định vị trí tương đối trang index
function getIndexPath() {
  // Nếu đang ở trong thư mục views thì không cần thay đổi
  if (window.location.pathname.includes('/views/')) {
    return 'index.html';
  }
  return 'views/index.html';
}

// Hàm để quản lý chuyển hướng dựa trên trạng thái đăng nhập
function handleAuthRedirect() {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes('login.html');

  // Nếu đã đăng nhập
  if (isUserLoggedIn()) {
    // Nếu đang ở trang login thì chuyển đến index
    if (isLoginPage) {
      window.location.href = getIndexPath();
    }
    // Nếu không phải trang login thì không làm gì
  } else {
    // Nếu chưa đăng nhập và không ở trang login thì chuyển đến login
    if (!isLoginPage && !currentPath.includes('register.html')) {
      window.location.href = getLoginPath();
    }
  }
}

// Xuất các hàm để sử dụng ở nơi khác
export {
  isUserLoggedIn,
  getLoginPath,
  getIndexPath,
  handleAuthRedirect
};

// Chạy ngay khi script được load (nếu được import trực tiếp, không phải như module)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', handleAuthRedirect);
}
