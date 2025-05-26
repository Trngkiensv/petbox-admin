const findButton = document.getElementById('findButton');
const dropdownItems = document.querySelectorAll('#findDropdown .dropdown-item');

// Thêm sự kiện click cho từng mục trong dropdown
dropdownItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của link
    const selectedValue = item.getAttribute('data-value'); // Lấy giá trị từ data-value
    findButton.textContent = selectedValue; // Cập nhật văn bản trên nút
  });
});
