// Đảm bảo DOM đã sẵn sàng trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {
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
        const response = await fetch('https://petbox-api-e4a2.onrender.com/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber, password }),
          credentials: 'include'
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            errorMessage.classList.remove('d-none');
            errorMessage.textContent = result.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
          } else {
            errorMessage.classList.remove('d-none');
            errorMessage.textContent = 'Lỗi server. Vui lòng thử lại sau.';
          }
        } else {
          const result = await response.json();
          window.location.href = 'index.html';
        }
      } catch (error) {
        // Xử lý lỗi mạng hoặc server
        errorMessage.classList.remove('d-none');
        errorMessage.textContent = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      }
    }
  });
});
