/**
 * Module xác thực - Quản lý các chức năng liên quan đến xác thực người dùng
 */

// Kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return !!token && isLoggedIn; // Trả về true nếu có token và đã đăng nhập, false nếu không
};

// Lấy thông tin người dùng hiện tại từ localStorage
const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Lấy token xác thực hiện tại
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Đăng xuất - xóa thông tin xác thực khỏi localStorage
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginTime');

  // Xác định đường dẫn tương đối đến trang login
  let loginPath = 'login.html';
  if (window.location.pathname.includes('/views/')) {
    loginPath = '../login.html';
  }

  // Chuyển hướng về trang đăng nhập
  window.location.href = loginPath;
};

// Thêm Authorization header vào các API requests
const addAuthHeader = (headers = {}) => {
  const token = getAccessToken();
  if (token) {
    return { ...headers, 'Authorization': `Bearer ${token}` };
  }
  return headers;
};

// Bảo vệ trang - kiểm tra xác thực khi tải trang
const protectPage = () => {
  // Đảm bảo trạng thái đăng nhập được kiểm tra
  const token = localStorage.getItem('accessToken');
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!token || !loggedIn) {
    // Xóa trạng thái đăng nhập
    localStorage.removeItem('isLoggedIn');

    // Xác định đường dẫn tương đối đến trang login
    let loginPath = 'login.html';
    if (window.location.pathname.includes('/views/')) {
      loginPath = '../login.html';
    }

    window.location.href = loginPath;
    return false;
  }
  return true;
};

// Lưu thông tin người dùng đã đăng nhập
const saveUserInfo = (userData, token, refreshToken = null) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }

  if (userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
  }

  // Đánh dấu người dùng đã đăng nhập
  localStorage.setItem('isLoggedIn', 'true');

  // Lưu thời gian đăng nhập
  localStorage.setItem('loginTime', new Date().toString());
};

// Export các functions để sử dụng ở các file khác
export {
  isAuthenticated,
  getCurrentUser,
  getAccessToken,
  logout,
  addAuthHeader,
  protectPage,
  saveUserInfo
};
