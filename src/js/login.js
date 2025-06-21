import { isAuthenticated, saveUserInfo } from './auth.js';
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
    const phone = normalizePhoneNumber(phoneNumberInput.value);
    const password = passwordInput.value;

    // Xác thực form
    let isValid = true;
    errorMessage.classList.add('d-none');

    // Kiểm tra số điện thoại
    if (!phone) {
      phoneNumberInput.classList.add('is-invalid');
      phoneNumberInput.nextElementSibling.textContent = 'Vui lòng nhập số điện thoại.';
      isValid = false;
    } else if (!PHONE_RULE.test(phone)) {
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
        const requestData = { phone: phone, password };
        const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`;

        // Log thông tin request để debug (chỉ hiển thị trong console)
        console.log('Gửi request đăng nhập:', {
          url: apiUrl,
          method: 'POST',
          body: { phone: phone, password }
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

          // Xử lý và lưu thông tin người dùng từ response
          let userData = null;
          let accessToken = null;
          let refreshToken = null;

          // Xác định user data từ kết quả
          if (result.user) {
            userData = result.user;
          } else if (result.userData) {
            userData = result.userData;
          } else if (result.data) {
            userData = result.data;
          }

          // Xác định token từ kết quả
          if (result.tokens) {
            accessToken = result.tokens.access.token;
            refreshToken = result.tokens.refresh.token;
          } else if (result.token) {
            accessToken = result.token;
          }

          // Lưu thông tin người dùng bằng hàm saveUserInfo
          saveUserInfo(userData, accessToken, refreshToken);

          // Log thông tin đăng nhập thành công để debug
          console.log('Đăng nhập thành công với user:', userData);

          // Hiển thị thông báo thành công trước khi chuyển hướng
          errorMessage.classList.remove('d-none');
          errorMessage.classList.remove('alert-danger');
          errorMessage.classList.add('alert-success');
          errorMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';

          // Lưu trạng thái đã đăng nhập
          localStorage.setItem('isLoggedIn', 'true');

          // Tự động chuyển hướng sau 1 giây - chuyển đến index.html
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
