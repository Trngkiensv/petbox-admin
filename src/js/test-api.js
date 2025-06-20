/**
 * Thử nghiệm API
 * File này chứa các hàm để thử nghiệm kết nối đến các API endpoints
 * Chỉ sử dụng trong quá trình phát triển
 */

import { API_BASE_URL, API_ENDPOINTS, APP_CONFIG } from './config.js';

/**
 * Kiểm tra tất cả các API endpoints quan trọng
 * @returns {Promise<Object>} Kết quả kiểm tra các endpoints
 */
async function testAllEndpoints() {
  if (!APP_CONFIG.DEBUG_MODE) {
    console.warn('Test API is only available in debug mode');
    return;
  }

  console.log('🔍 Bắt đầu kiểm tra các API endpoints...');
  const results = {};

  // Kiểm tra API status
  try {
    console.log(`Kiểm tra API: ${API_ENDPOINTS.STATUS}`);
    const statusResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.STATUS}`);
    const statusData = await statusResponse.json();
    results.status = {
      url: `${API_BASE_URL}${API_ENDPOINTS.STATUS}`,
      status: statusResponse.status,
      ok: statusResponse.ok,
      data: statusData
    };
    console.log(`✅ API ${API_ENDPOINTS.STATUS}: OK`, statusData);
  } catch (error) {
    results.status = { error: error.message };
    console.error(`❌ API ${API_ENDPOINTS.STATUS}: Lỗi`, error);
  }

  // Hiển thị kết quả kiểm tra tổng thể
  const successCount = Object.values(results).filter(r => r.ok).length;
  const totalCount = Object.keys(results).length;
  console.log(`🏁 Kết thúc kiểm tra: ${successCount}/${totalCount} endpoint thành công`);

  return results;
}

/**
 * Hiển thị dialog kết quả kiểm tra API
 * @param {Object} results - Kết quả kiểm tra các endpoints
 */
function displayTestResults(results) {
  if (!results) return;

  // Tạo một modal để hiển thị kết quả
  const modalId = 'apiTestResultModal';
  let modal = document.getElementById(modalId);

  // Xóa modal cũ nếu tồn tại
  if (modal) {
    document.body.removeChild(modal);
  }

  // Tạo modal mới
  modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal fade';
  modal.tabIndex = -1;
  modal.setAttribute('aria-labelledby', `${modalId}Label`);
  modal.setAttribute('aria-hidden', 'true');

  // Tạo nội dung modal
  const successCount = Object.values(results).filter(r => r.ok).length;
  const totalCount = Object.keys(results).length;

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${modalId}Label">Kết quả kiểm tra API</h5>
          <button type="button" class="btn-close" data-coreui-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert ${successCount === totalCount ? 'alert-success' : 'alert-warning'}">
            <strong>${successCount}/${totalCount}</strong> API endpoints hoạt động bình thường
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Trạng thái</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              ${Object.entries(results).map(([key, result]) => `
                <tr>
                  <td><code>${result.url || API_ENDPOINTS[key.toUpperCase()]}</code></td>
                  <td>
                    ${result.ok
                      ? '<span class="badge bg-success">OK</span>'
                      : '<span class="badge bg-danger">Lỗi</span>'}
                  </td>
                  <td>
                    ${result.ok
                      ? `<pre class="mb-0"><code>${JSON.stringify(result.data, null, 2)}</code></pre>`
                      : `<span class="text-danger">${result.error || 'Không thể kết nối'}</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-coreui-dismiss="modal">Đóng</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Hiển thị modal - đảm bảo coreui đã được load
  setTimeout(() => {
    try {
      const modalInstance = new coreui.Modal(modal);
      modalInstance.show();
    } catch (error) {
      console.error('Error showing modal:', error);
      // Fallback nếu không thể hiển thị modal
      alert('Kết quả kiểm tra API: ' +
        (successCount === totalCount ? 'Tất cả API hoạt động bình thường' : `${successCount}/${totalCount} API hoạt động`));
    }
  }, 100);
}

// Thêm nút kiểm tra API vào giao diện (chỉ trong chế độ debug)
function addTestApiButton() {
  if (!APP_CONFIG.DEBUG_MODE) return;

  // Kiểm tra xem nút đã tồn tại chưa
  if (document.getElementById('test-api-button')) return;

  const button = document.createElement('button');
  button.id = 'test-api-button';
  button.className = 'btn btn-sm btn-info position-fixed';
  button.style.bottom = '10px';
  button.style.left = '10px';
  button.style.zIndex = '9999';
  button.style.opacity = '0.8';
  button.innerHTML = '🔍 Kiểm tra API';

  // Hiệu ứng hover
  button.addEventListener('mouseenter', () => {
    button.style.opacity = '1';
  });

  button.addEventListener('mouseleave', () => {
    button.style.opacity = '0.8';
  });

  button.addEventListener('click', async () => {
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang kiểm tra...';

    const results = await testAllEndpoints();
    displayTestResults(results);

    button.disabled = false;
    button.innerHTML = '🔍 Kiểm tra API';
  });

  document.body.appendChild(button);
}

// Export các functions để sử dụng ở các file khác
export { testAllEndpoints, displayTestResults, addTestApiButton };
