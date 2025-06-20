/**
 * Kiểm tra trạng thái server API
 * File này cung cấp chức năng kiểm tra xem server API có đang hoạt động hay không
 */

import { API_BASE_URL, API_ENDPOINTS } from './config.js';

/**
 * Kiểm tra xem server API có đang hoạt động không
 * @returns {Promise<boolean>} Promise trả về true nếu server đang hoạt động, ngược lại trả về false
 */
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.STATUS}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Server status:', data);
      return data.status === 'ok';
    }
    return false;
  } catch (error) {
    console.error('Error checking server status:', error);
    return false;
  }
}

/**
 * Hiển thị thông báo trạng thái server
 * @param {boolean} isOnline - Trạng thái kết nối của server
 * @param {HTMLElement} container - Phần tử chứa thông báo
 */
function displayServerStatus(isOnline, container) {
  if (!container) return;

  const statusMessage = document.createElement('div');
  statusMessage.className = isOnline ? 'alert alert-success' : 'alert alert-danger';
  statusMessage.style.position = 'fixed';
  statusMessage.style.bottom = '10px';
  statusMessage.style.right = '10px';
  statusMessage.style.zIndex = '9999';
  statusMessage.style.maxWidth = '300px';

  statusMessage.innerHTML = isOnline
    ? '<strong>✅ Kết nối thành công!</strong> Server API đang hoạt động.'
    : '<strong>❌ Lỗi kết nối!</strong> Không thể kết nối đến server API.';

  container.appendChild(statusMessage);

  // Tự động ẩn thông báo sau 5 giây
  setTimeout(() => {
    statusMessage.style.opacity = '0';
    statusMessage.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      if (statusMessage.parentNode) {
        statusMessage.parentNode.removeChild(statusMessage);
      }
    }, 500);
  }, 5000);
}

// Export các functions để sử dụng ở các file khác
export { checkServerStatus, displayServerStatus };
