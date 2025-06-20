import { isAuthenticated } from './auth.js';
import { API_BASE_URL, API_ENDPOINTS } from './config.js';

// Chuyển hướng đến trang chính nếu người dùng đã đăng nhập
if (isAuthenticated()) {
  window.location.href = 'index.html';
}

// Đảm bảo DOM đã sẵn sàng trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {
  // Lấy tham chiếu đến các phần tử DOM
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const passwordInput = document.getElementById('password');

  // Regex kiểm tra số điện thoại (dựa trên PHONE_RULE tương tự trong React)
  const PHONE_RULE = /^\d{10,11}$/;

  // Hàm chuẩn hóa số điện thoại (loại bỏ khoảng trắng, dấu gạch ngang, v.v.)
  function normalizePhoneNumber(phone) {
    return phone.replace(/\D/g, '');
  }

  // Hàm định dạng số điện thoại (thêm khoảng trắng để hiển thị)
  function formatPhoneNumber(phone) {
    const cleaned = normalizePhoneNumber(phone);
    if (cleaned.length >= 3 && cleaned.length < 6) {
      return cleaned.replace(/(\d{3})(\d+)/, '$1 $2');
    } else if (cleaned.length >= 6) {
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    }
    return cleaned;
  }

  // Xử lý sự kiện blur để định dạng số điện thoại
  phoneNumberInput.addEventListener('blur', (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    e.target.value = formattedValue;
  });

  // Xử lý sự kiện submit form
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Lấy giá trị từ form
    const phoneNumber = normalizePhoneNumber(phoneNumberInput.value);
    const password = passwordInput.value;

    // Xác thực form
    let isValid = true;
    errorMessage.classList.add('d-none');

    // Kiểm tra số điện thoại
    if (!phoneNumber) {
      phoneNumberInput.classList.add('is-invalid');
      phoneNumberInput.nextElementSibling.textContent = 'Vui lòng nhập số điện thoại.';
      isValid = false;
    } else if (!PHONE_RULE.test(phoneNumber)) {
      phoneNumberInput.classList.add('is-invalid');
      phoneNumberInput.nextElementSibling.textContent = 'Số điện thoại không hợp lệ.';
      isValid = false;
    } else {
      phoneNumberInput.classList.remove('is-invalid');
    }

    // Kiểm tra mật khẩu
    if (!password) {
      passwordInput.classList.add('is-invalid');
      passwordInput.nextElementSibling.textContent = 'Vui lòng nhập mật khẩu.';
      isValid = false;
    } else {
      passwordInput.classList.remove('is-invalid');
    }

    // Nếu form hợp lệ, gửi yêu cầu đăng nhập
    if (isValid) {
      try {
        // Hiển thị trạng thái loading khi đang xử lý đăng nhập
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';

        // Chuẩn bị dữ liệu gửi đi
        const requestData = { phoneNumber, password };
        const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;

        // Log thông tin request để debug (chỉ hiển thị trong console)
        console.log('Gửi request đăng nhập:', {
          url: apiUrl,
          method: 'POST',
          body: { phoneNumber, password }
        });

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData),
          credentials: 'include'
        });

        // Xử lý phản hồi dựa trên status code
        if (!response.ok) {
          const contentType = response.headers.get('content-type');

          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            errorMessage.classList.remove('d-none');

            // Xử lý các mã lỗi cụ thể từ API
            if (response.status === 404) {
              errorMessage.textContent = 'Số điện thoại không tồn tại trong hệ thống.';
            } else if (response.status === 401) {
              errorMessage.textContent = 'Mật khẩu không chính xác.';
            } else {
              errorMessage.textContent = result.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            }
          } else {
            errorMessage.classList.remove('d-none');
            errorMessage.textContent = 'Lỗi server. Vui lòng thử lại sau.';
          }
        } else {
          const result = await response.json();
          console.log('Đăng nhập thành công:', result);

          // Lưu thông tin token vào localStorage để sử dụng cho các API khác
          if (result.tokens) {
            localStorage.setItem('accessToken', result.tokens.access.token);
            localStorage.setItem('refreshToken', result.tokens.refresh.token);
          } else if (result.token) {
            // Hỗ trợ cả định dạng API trả về token đơn
            localStorage.setItem('accessToken', result.token);
          }

          if (result.user) {
            localStorage.setItem('currentUser', JSON.stringify(result.user));
          } else if (result.userData) {
            // Hỗ trợ cả định dạng API trả về userData
            localStorage.setItem('currentUser', JSON.stringify(result.userData));
          }

          // Hiển thị thông báo thành công trước khi chuyển hướng
          errorMessage.classList.remove('d-none');
          errorMessage.classList.remove('alert-danger');
          errorMessage.classList.add('alert-success');
          errorMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';

          // Tự động chuyển hướng sau 1 giây
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        }
      } catch (error) {
        // Xử lý lỗi mạng hoặc server
        console.error('Login error:', error);
        errorMessage.classList.remove('d-none');
        errorMessage.textContent = 'Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.';
      } finally {
        // Khôi phục trạng thái nút submit
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng nhập';
      }
    }
  });
});
