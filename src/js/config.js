/**
 * --------------------------------------------------------------------------
 * CoreUI Boostrap Admin Template config.js
 * Licensed under MIT (https://github.com/coreui/coreui-free-bootstrap-admin-template/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * Cấu hình ứng dụng
 * File này chứa các biến cấu hình chung cho toàn bộ ứng dụng
 */

// URL cơ sở của API (thay đổi giá trị này khi triển khai ở môi trường khác)
const API_BASE_URL = 'http://localhost:8017';

// Cấu hình API endpoints
const API_ENDPOINTS = {
  STATUS: '/v1/status',
  LOGIN: '/v1/users/login',  // Cập nhật endpoint đăng nhập với prefix v1
  REGISTER: '/v1/auth/register',
  USERS: '/v1/users',
  PRODUCTS: '/v1/products',
  ORDERS: '/v1/orders',
};

// Cấu hình thời gian timeout cho các yêu cầu API (tính bằng mili giây)
const API_TIMEOUT = 30000; // 30 giây

// Cấu hình thời gian hết hạn của token (nếu không có trong phản hồi API)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 giờ

// Cấu hình chung của ứng dụng
const APP_CONFIG = {
  APP_NAME: 'PetBox Admin',
  VERSION: '1.0.0',
  DEBUG_MODE: true, // Set false trong môi trường production
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
  DEFAULT_ITEMS_PER_PAGE: 10,
  MAX_ITEMS_PER_PAGE: 100,
  DEFAULT_AVATAR: 'assets/img/avatars/default.jpg',
  DEFAULT_PRODUCT_IMAGE: 'assets/img/products/default.jpg',
};

// Export các cấu hình để sử dụng ở các file khác
export {
  API_BASE_URL,
  API_ENDPOINTS,
  API_TIMEOUT,
  TOKEN_EXPIRY,
  APP_CONFIG
};
(() => {
  const THEME = 'coreui-free-bootstrap-admin-template-theme'
  const urlParams = new URLSearchParams(window.location.href.split('?')[1])

  if (urlParams.get('theme') && ['auto', 'dark', 'light'].includes(urlParams.get('theme'))) {
    localStorage.setItem(THEME, urlParams.get('theme'))
  }
})()
