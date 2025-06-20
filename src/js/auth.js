/**
 * Module xác thực - Quản lý các chức năng liên quan đến xác thực người dùng
 */

// Kiểm tra xem người dùng đã đăng nhập hay chưa
const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token; // Trả về true nếu có token, false nếu không có
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
  // Chuyển hướng về trang đăng nhập
  window.location.href = 'login.html';
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
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
};

// Export các functions để sử dụng ở các file khác
export {
  isAuthenticated,
  getCurrentUser,
  getAccessToken,
  logout,
  addAuthHeader,
  protectPage
};
