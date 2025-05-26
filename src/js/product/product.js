import { productData } from './../mockdata.js';

// Cấu hình phân trang
const productsPerPage = 10;
let currentPage = 1;
const totalProducts = productData.length;
const totalPages = Math.ceil(totalProducts / productsPerPage);

// Đảm bảo DOM đã sẵn sàng trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {
  // Lấy tbody của bảng và container pagination
  const tbody = document.getElementById('productTableBody');
  const paginationContainer = document.getElementById('paginationContainer');

  // Lấy form trong modal
  const editProductForm = document.getElementById('editProductForm');
  let currentProductId = null;

  // Hàm render sản phẩm theo trang (giữ nguyên bảng hiện tại)
  function renderProducts(page) {
    tbody.innerHTML = '';

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, totalProducts);

    for (let i = startIndex; i < endIndex; i++) {
      const product = productData[i];
      const row = document.createElement('tr');
      row.className = 'align-middle';
      row.innerHTML = `
        <td class="text-center">${product.id}</td>
        <td class="text-center">
          <div class="avatar avatar-xl float-start">
            <img class="avatar-img rounded" src="${product.image}" alt="${product.name}">
          </div>
        </td>
        <td>
          <div class="text-nowrap">${product.name}</div>
        </td>
        <td>
          <div class="text-nowrap">${product.price.toLocaleString('vi-VN')} VNĐ</div>
        </td>
        <td>
          <div class="text-nowrap">${product.discounted.toLocaleString('vi-VN')} VNĐ</div>
        </td>
        <td>
          <div class="small text-body-secondary">Created</div>
          <div class="fw-semibold text-nowrap">${product.created}</div>
        </td>
        <td>
          <div class="small text-body-secondary">Updated</div>
          <div class="fw-semibold text-nowrap">${product.updated}</div>
        </td>
        <td>
          <div class="dropdown">
            <button class="btn btn-transparent p-0" type="button" data-coreui-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <svg class="icon">
                <use xlink:href="vendors/@coreui/icons/svg/free.svg#cil-options"></use>
              </svg>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <a class="dropdown-item edit-product" href="#"
                 data-coreui-toggle="modal"
                 data-coreui-target="#editProductModal"
                 data-id="${product.id}"
                 data-name="${product.name}"
                 data-image="${product.image}"
                 data-price="${product.price}"
                 data-discounted="${product.discounted}"
                 data-created="${product.created}"
                 data-updated="${product.updated}"
                 data-slug="${product.slug}"
                 data-description="${product.description}"
                 data-min-age-month="${product.minAgeMonth}"
                 data-min-weight="${product.minWeight}">Edit</a>
              <a class="dropdown-item text-danger" href="#">Delete</a>
            </div>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    }

    document.querySelectorAll('.edit-product').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        currentProductId = parseInt(button.getAttribute('data-id'));

        // Điền dữ liệu vào form
        document.getElementById('editName').value = button.getAttribute('data-name');
        document.getElementById('editImage').value = button.getAttribute('data-image');
        document.getElementById('editPrice').value = button.getAttribute('data-price');
        document.getElementById('editDiscounted').value = button.getAttribute('data-discounted');
        document.getElementById('editCreated').value = button.getAttribute('data-created');
        document.getElementById('editUpdated').value = button.getAttribute('data-updated');
        document.getElementById('editSlug').value = button.getAttribute('data-slug');
        document.getElementById('editDescription').value = button.getAttribute('data-description');
        document.getElementById('editMinAgeMonth').value = button.getAttribute('data-min-age-month');
        document.getElementById('editMinWeight').value = button.getAttribute('data-min-weight');
      });
    });
  }

  // Hàm render pagination
  function renderPagination() {
    paginationContainer.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'pagination justify-content-center';

    const prevLi = document.createElement('li');
    prevLi.className = 'page-item';
    prevLi.innerHTML = `
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">«</span>
      </a>
    `;
    prevLi.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderProducts(currentPage);
        renderPagination();
      }
    });
    ul.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = i;
        renderProducts(currentPage);
        renderPagination();
      });
      ul.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = 'page-item';
    nextLi.innerHTML = `
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">»</span>
      </a>
    `;
    nextLi.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts(currentPage);
        renderPagination();
      }
    });
    ul.appendChild(nextLi);

    paginationContainer.appendChild(ul);
  }

  // Xử lý submit form
  editProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ form
    const updatedProduct = {
      id: currentProductId,
      name: document.getElementById('editName').value,
      image: document.getElementById('editImage').value,
      price: parseInt(document.getElementById('editPrice').value),
      discounted: parseInt(document.getElementById('editDiscounted').value),
      created: document.getElementById('editCreated').value,
      updated: document.getElementById('editUpdated').value,
      slug: document.getElementById('editSlug').value,
      description: document.getElementById('editDescription').value,
      minAgeMonth: parseInt(document.getElementById('editMinAgeMonth').value),
      minWeight: parseFloat(document.getElementById('editMinWeight').value),
    };

    // Cập nhật dữ liệu trong productData
    const index = productData.findIndex(p => p.id === currentProductId);
    if (index !== -1) {
      productData[index] = updatedProduct;
    }

    // Đóng modal (CoreUI tự động đóng modal thông qua data-coreui-dismiss)

    // Render lại bảng
    renderProducts(currentPage);
    renderPagination();
  });

  // Khởi tạo trang đầu tiên
  renderProducts(currentPage);
  renderPagination();
});
