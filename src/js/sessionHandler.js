/**
 * Session Handler - Quản lý session người dùng và phát hiện lỗi
 */

class SessionHandler {
  constructor() {
    this.KEYS = {
      TOKEN: 'accessToken',
      REFRESH_TOKEN: 'refreshToken',
      USER: 'currentUser',
      LOGGED_IN: 'isLoggedIn',
      LOGIN_TIME: 'loginTime'
    };

    // Thời gian hết hạn mặc định (24 giờ)
    this.SESSION_EXPIRY = 24 * 60 * 60 * 1000;
  }

  /**
   * Lưu thông tin session người dùng
   */
  saveSession(userData, token, refreshToken) {
    // Lưu thông tin xác thực
    if (token) {
      localStorage.setItem(this.KEYS.TOKEN, token);
    }

    if (refreshToken) {
      localStorage.setItem(this.KEYS.REFRESH_TOKEN, refreshToken);
    }

    if (userData) {
      localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    }

    // Đánh dấu đã đăng nhập và lưu thời gian đăng nhập
    localStorage.setItem(this.KEYS.LOGGED_IN, 'true');
    localStorage.setItem(this.KEYS.LOGIN_TIME, new Date().toString());

    console.log('Session đã được lưu', { user: userData, hasToken: !!token });
    return true;
  }

  /**
   * Kiểm tra trạng thái đăng nhập hiện tại
   */
  isAuthenticated() {
    const token = localStorage.getItem(this.KEYS.TOKEN);
    const isLoggedIn = localStorage.getItem(this.KEYS.LOGGED_IN) === 'true';

    // Thời gian đăng nhập
    const loginTime = localStorage.getItem(this.KEYS.LOGIN_TIME);
    const isSessionValid = loginTime ? (new Date() - new Date(loginTime)) < this.SESSION_EXPIRY : false;

    const isValid = !!token && isLoggedIn && isSessionValid;
    console.log('Kiểm tra xác thực:', { hasToken: !!token, isLoggedIn, isSessionValid, isValid });

    return isValid;
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  getCurrentUser() {
    try {
      const userJson = localStorage.getItem(this.KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Lỗi khi phân tích dữ liệu người dùng:', error);
      return null;
    }
  }

  /**
   * Đăng xuất và xóa session
   */
  logout() {
    // Xóa tất cả dữ liệu session
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('Đã đăng xuất và xóa session');
    return true;
  }

  /**
   * Xác định đường dẫn đến trang login
   */
  getLoginPath() {
    // Kiểm tra nếu đang ở trong thư mục /views/
    if (window.location.pathname.includes('/views/')) {
      return 'login.html';
    }
    return 'views/login.html';
  }

  /**
   * Xác định đường dẫn đến trang chính (index)
   */
  getIndexPath() {
    // Kiểm tra nếu đang ở trong thư mục /views/
    if (window.location.pathname.includes('/views/')) {
      return 'index.html';
    }
    return 'views/index.html';
  }

  /**
   * Xác định đường dẫn đến trang sản phẩm
   */
  getProductPath() {
    // Sản phẩm ở ngoài thư mục views và nằm ở root (/product)
    return '/product';
  }

  /**
   * Chuyển hướng đến trang login
   */
  redirectToLogin() {
    const loginPath = this.getLoginPath();
    console.log('Chuyển hướng đến trang login:', loginPath);
    window.location.href = loginPath;
  }

  /**
   * Chuyển hướng đến trang chính (hiện tại là trang sản phẩm)
   */
  redirectToIndex() {
    this.redirectToProduct();
  }

  /**
   * Chuyển hướng đến trang sản phẩm
   */
  redirectToProduct() {
    const productPath = this.getProductPath();
    console.log('Chuyển hướng đến trang sản phẩm (URL gốc):', productPath);
    console.log('Vị trí hiện tại:', window.location.pathname);
    window.location.href = productPath;
  }
}

// Tạo instance toàn cục
const sessionHandler = new SessionHandler();

// Export để sử dụng ở các module khác
export default sessionHandler;
