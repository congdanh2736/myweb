function checkLogin() {
    let currentUser = JSON.parse(localStorage.getItem("currentuser"));
    if(currentUser == null || (currentUser.userType != 1 && currentUser.userType !== "1")) {
        window.location.href = "loginadmin.html";
    } else {
        // Có thể hiển thị tên admin nếu cần
        // document.getElementById("name-acc").innerHTML = currentUser.fullname;
    }
}
window.onload = checkLogin();

//do sidebar open and close
const menuIconButton = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");
menuIconButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// log out admin user
/*
let toogleMenu = document.querySelector(".profile");
let mune = document.querySelector(".profile-cropdown");
toogleMenu.onclick = function () {
    mune.classList.toggle("active");
};
*/

// tab for section
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for(let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");

        // Gọi hàm hiển thị tương ứng với tab
        if (i === 0) {
            showProduct();
        } else if (i === 1) {
            showUser();
        } else if (i === 2) {
            showOrder(orders);
        } else if (i === 3) {
            showThongKe(createObj());
        } else if (i === 4) {
            showPhieuNhap();
        } else if (i === 5) {
            showFeedback();
        }
    };
}

const closeBtn = document.querySelectorAll('.section');
console.log(closeBtn[0])
for(let i=0;i<closeBtn.length;i++){
    closeBtn[i].addEventListener('click',(e) => {
        sidebar.classList.add("open");
    })
}

// Get amount product
function getAmoumtProduct() {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    return products.length;
}

// Get amount user
function getAmoumtUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    return accounts.filter(item => item.userType == 0).length;
}

// Get amount user
function getMoney() {
    let tongtien = 0;
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    orders.forEach(item => {
        tongtien += item.tongtien
    });
    return tongtien;
}

// document.getElementById("amount-user").innerHTML = getAmoumtUser();
// document.getElementById("amount-product").innerHTML = getAmoumtProduct();
// document.getElementById("doanh-thu").innerHTML = vnd(getMoney());

// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}
// Phân trang 
let perPage = 12;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    showProductArr(productShow);
}

function setupPagination(productAll, perPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);
    for (let i = 1; i <= page_count; i++) {
        let li = paginationChange(i, productAll, currentPage);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChange(page, productAll, currentPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="#">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
    })
    return node;
}

// Lấy tên category từ ID
function getCategoryNameById(categoryId) {
    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    // Tìm key (tên) từ value (ID)
    for (let name in categoryIdMapping) {
        if (categoryIdMapping[name] === categoryId) {
            return name;
        }
    }
    return categoryId; // Nếu không tìm thấy, trả về ID
}

// Hiển thị danh sách sản phẩm 
function showProductArr(arr) {
    let productHtml = "";
    if(arr.length == 0) {
        productHtml = `<div class="no-result"><div class="no-result-i"><i class="fas fa-face-sad-cry"></i></div><div class="no-result-h">Không có sản phẩm để hiển thị</div></div>`;
    } else {
        arr.forEach(product => {
            let btnCtl = product.status == 1 ? 
            `<button class="btn-delete" onclick="deleteProduct(${product.id})"><i class="fa-solid fa-trash"></i></button>` :
            `<button class="btn-delete" onclick="changeStatusProduct(${product.id})"><i class="fa-solid fa-eye"></i></button>`;
            let categoryName = getCategoryNameById(product.category);

            // Tính số lượng tồn kho thực tế
            // Tồn kho = Số lượng ban đầu - Đơn đã hoàn thành - Đơn đang chờ xử lý
            let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
            let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
            
            let completedQty = 0; // Đơn đã hoàn thành
            let pendingQty = 0;   // Đơn đang chờ xử lý
            
            orders.forEach(order => {
                orderDetails.forEach(detail => {
                    if (detail.madon == order.id && detail.id == product.id) {
                        if (order.trangthai == 1) {
                            // Đơn đã hoàn thành
                            completedQty += parseInt(detail.soluong);
                        } else if (order.trangthai == 0) {
                            // Đơn đang chờ xử lý
                            pendingQty += parseInt(detail.soluong);
                        }
                    }
                });
            });
            
            let stock = parseInt(product.soluong) - completedQty - pendingQty;
            
            let warning = '';
            if (stock <= 0) {
                warning = '<span class="stock-warning out-of-stock">Hết hàng</span>';
            } else if (stock <= 10) {
                warning = '<span class="stock-warning low-stock">Sắp hết hàng</span>';
            }
            
            productHtml += `
            <div class="list">
                    <div class="list-left">
                    <img src="${product.img}" alt="">
                    <div class="list-info">
                        <h4>${product.title} ${warning}</h4>
                        <p class="list-note">${product.desc}</p>
                        <span class="list-category">${categoryName}</span>
                    </div>
                </div>
                <div class="list-right">
                    <div class="list-price">
                    <span class="list-current-price">${vnd(product.price)}</span>                   
                    </div>
                    <div class="list-control">
                    <div class="list-tool">
                        <button class="btn-edit" onclick="editProduct(${product.id})"><i class="fas fa-pen-to-square"></i></button>
                        ${btnCtl}
                    </div>
                    <div class="list-check-tool">
                        <button class="btn-check" onclick="checkProduct(${product.id})"><i class="fas fa-eye"></i> Kiểm tra</button>
                    </div>
                </div>
                </div> 
            </div>`;
        });
    }
    document.getElementById("show-product").innerHTML = productHtml;
}
function showProduct() {
    let selectOp = document.getElementById('the-loai').value;
    let valeSearchInput = document.getElementById('form-search-product').value;
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];

    if(selectOp == "Tất cả") {
        result = products.filter((item) => item.status == 1);
    } else if(selectOp == "Đã xóa") {
        result = products.filter((item) => item.status == 0);
    } else {
        // Lấy ID của category từ tên để filter
        let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
        let categoryId = categoryIdMapping[selectOp];
        result = products.filter((item) => item.category == categoryId && item.status == 1);
    }

    result = valeSearchInput == "" ? result : result.filter(item => {
        return item.title.toString().toUpperCase().includes(valeSearchInput.toString().toUpperCase());
    })

    displayList(result, perPage, currentPage);
    setupPagination(result, perPage, currentPage);
}

function cancelSearchProduct() {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")).filter(item => item.status == 1) : [];
    document.getElementById('the-loai').value = "Tất cả";
    document.getElementById('form-search-product').value = "";
    displayList(products, perPage, currentPage);
    setupPagination(products, perPage, currentPage);
}

window.onload = showProduct();

function createId(arr) {
    let id = arr.length;
    let check = arr.find((item) => item.id == id);
    while (check != null) {
        id++;
        check = arr.find((item) => item.id == id);
    }
    return id;
}
// Xóa sản phẩm 
function deleteProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if (confirm("Bạn có chắc muốn xóa?") == true) {
        products[index].status = 0;
        toast({ title: 'Success', message: 'Xóa sản phẩm thành công !', type: 'success', duration: 3000 });
    }
    localStorage.setItem("products", JSON.stringify(products));
    showProduct();
}

function changeStatusProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    let index = products.findIndex(item => {
        return item.id == id;
    })
    if (confirm("Bạn có chắc chắn muốn hủy xóa?") == true) {
        products[index].status = 1;
        toast({ title: 'Success', message: 'Khôi phục sản phẩm thành công !', type: 'success', duration: 3000 });
    }
    localStorage.setItem("products", JSON.stringify(products));
    showProduct();
}

var indexCur;
function editProduct(id) {
    updateCategoryDropdowns();
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let index = products.findIndex(item => {
        return item.id == id;
    })
    indexCur = index;
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelector(".add-product").classList.add("open");
    // Hiển thị lợi nhuận dạng phần trăm
    document.querySelector(".upload-image-preview").src = products[index].img;
    document.getElementById("ten-mon").value = products[index].title;
    document.getElementById("gia-moi").value = products[index].giagoc;
    document.getElementById("loi-nhuan").value = products[index].loinhuan;
    document.getElementById("mo-ta").value = products[index].desc;
    document.getElementById("chon-mon").value = getCategoryNameById(products[index].category);
}

function checkProduct(id) {
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let product = products.find(item => item.id == id);
    if (!product) return;

    // Lấy tháng hiện tại
    let now = new Date();
    let currentMonth = now.getMonth() + 1;
    let firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    let lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    // Tính số lượng đã xuất trong tháng hiện tại (chỉ tính đơn hàng đã hoàn thành)
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    
    let exportedThisMonth = 0;
    let exportedTotal = 0; // Tổng số lượng đã xuất từ trước đến nay
    
    orders.forEach(order => {
        // Chỉ tính đơn hàng đã hoàn thành (trangthai == 1)
        if (order.trangthai == 1) {
            let orderDate = new Date(order.thoigiandat).toISOString().split('T')[0];
            orderDetails.forEach(detail => {
                if (detail.madon == order.id && detail.id == id) {
                    let qty = parseInt(detail.soluong);
                    exportedTotal += qty;
                    // Kiểm tra nếu trong tháng hiện tại
                    if (orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth) {
                        exportedThisMonth += qty;
                    }
                }
            });
        }
    });

    // Tính số lượng đã nhập trong tháng hiện tại từ phiếu nhập đã hoàn thành
    let phieuNhap = localStorage.getItem("phieuNhap") ? JSON.parse(localStorage.getItem("phieuNhap")) : [];
    let importedThisMonth = 0;
    phieuNhap.forEach(phieu => {
        let phieuDate = new Date(phieu.ngayNhap).toISOString().split('T')[0];
        if (phieuDate >= firstDayOfMonth && phieuDate <= lastDayOfMonth && phieu.status == 1) { // Chỉ tính phiếu đã hoàn thành
            phieu.items.forEach(item => {
                if (item.sanPhamId == id) {
                    importedThisMonth += parseInt(item.soLuong);
                }
            });
        }
    });

    // Tính số lượng tồn kho (trừ TẤT CẢ đơn đã hoàn thành và đơn đang chờ)
    let pendingQty = 0;
    orders.forEach(order => {
        if (order.trangthai == 0) { // Đơn đang chờ xử lý
            orderDetails.forEach(detail => {
                if (detail.madon == order.id && detail.id == id) {
                    pendingQty += parseInt(detail.soluong);
                }
            });
        }
    });
    
    let stock = parseInt(product.soluong) - exportedTotal - pendingQty;

    // Hiển thị modal
    document.getElementById("check-product-title").textContent = product.title;
    document.getElementById("quantity-imported").textContent = importedThisMonth;
    document.getElementById("quantity-exported").textContent = exportedThisMonth;
    document.getElementById("quantity-stock").textContent = stock;

    // Cập nhật nhãn với tháng hiện tại
    document.querySelector('.product-info p:nth-child(1) strong').textContent = `Số lượng đã nhập (tháng ${currentMonth}):`;
    document.querySelector('.product-info p:nth-child(2) strong').textContent = `Số lượng đã xuất (tháng ${currentMonth}):`;

    // Lưu ID sản phẩm
    document.querySelector(".check-product").setAttribute("data-product-id", id);

    document.querySelector(".check-product").classList.add("open");
}

function checkProductDaily(id) {
    // Mở modal kiểm tra theo ngày
    document.querySelector(".check-daily").classList.add("open");
    // Lưu ID sản phẩm để sử dụng sau
    document.querySelector(".check-daily").setAttribute("data-product-id", id);

    // Lấy tên sản phẩm và cập nhật title
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let product = products.find(item => item.id == id);
    if (product) {
        document.querySelector(".check-daily-right h4").textContent = `Danh sách theo ngày - ${product.title}`;
    }
}

function generateDailyReport() {
    let productId = document.querySelector(".check-daily").getAttribute("data-product-id");
    let startDate = document.getElementById("start-date").value;
    let endDate = document.getElementById("end-date").value;

    if (!startDate || !endDate) {
        alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        return;
    }

    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
    let product = products.find(item => item.id == productId);
    if (!product) return;

    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let phieuNhap = localStorage.getItem("phieuNhap") ? JSON.parse(localStorage.getItem("phieuNhap")) : [];

    // Tính tổng số lượng đã xuất (đơn hoàn thành) và đang chờ (đơn pending)
    let totalExported = 0;
    let totalPending = 0;
    orders.forEach(order => {
        if (order.trangthai == 1) { // Đơn đã hoàn thành
            orderDetails.forEach(detail => {
                if (detail.madon == order.id && detail.id == productId) {
                    totalExported += parseInt(detail.soluong);
                }
            });
        } else if (order.trangthai == 0) { // Đơn đang chờ
            orderDetails.forEach(detail => {
                if (detail.madon == order.id && detail.id == productId) {
                    totalPending += parseInt(detail.soluong);
                }
            });
        }
    });

    // Tồn kho thực tế hiện tại = soluong (đã bao gồm tất cả nhập) - tổng xuất - tổng pending
    let baseStock = parseInt(product.soluong) || 0;
    let currentActualStock = baseStock - totalExported - totalPending;
    
    let reportList = document.getElementById("daily-report-list");
    reportList.innerHTML = "";

    // Tạo danh sách ngày
    let currentDate = new Date(startDate);
    let end = new Date(endDate);
    let cumulativeExported = 0;

    while (currentDate <= end) {
        let dateStr = currentDate.toISOString().split('T')[0];
        let displayDate = currentDate.toLocaleDateString('vi-VN');

        // Tính imported trong ngày
        let dailyImported = 0;
        phieuNhap.forEach(phieu => {
            let phieuDate = new Date(phieu.ngayNhap).toISOString().split('T')[0];
            if (phieuDate === dateStr && phieu.status == 1) {
                phieu.items.forEach(item => {
                    if (item.sanPhamId == productId) {
                        dailyImported += parseInt(item.soLuong);
                    }
                });
            }
        });

        // Tính exported trong ngày (chỉ tính đơn hàng đã hoàn thành)
        let dailyExported = 0;
        orders.forEach(order => {
            let orderDate = new Date(order.thoigiandat).toISOString().split('T')[0];
            // Chỉ tính đơn hàng đã hoàn thành (trangthai == 1)
            if (orderDate === dateStr && order.trangthai == 1) {
                orderDetails.forEach(detail => {
                    if (detail.madon == order.id && detail.id == productId) {
                        dailyExported += parseInt(detail.soluong);
                    }
                });
            }
        });

        // Cập nhật tích lũy xuất
        cumulativeExported += dailyExported;

        // Tính stock cuối ngày = Tồn kho thực tế hiện tại - xuất lũy kế (chưa đến ngày hiện tại)
        // Hoặc đơn giản: baseStock - tổng xuất đến ngày này
        let dailyStock = baseStock - cumulativeExported - totalPending;

        // Tạo item báo cáo
        let reportItem = document.createElement("div");
        reportItem.className = "daily-report-item";
        reportItem.innerHTML = `
            <div class="daily-report-date">${displayDate}</div>
            <div class="daily-report-data">
                <div>
                    <label>Nhập</label>
                    <span>${dailyImported}</span>
                </div>
                <div>
                    <label>Xuất</label>
                    <span>${dailyExported}</span>
                </div>
                <div>
                    <label>Tồn kho</label>
                    <span>${dailyStock}</span>
                </div>
            </div>
        `;
        reportList.appendChild(reportItem);

        // Chuyển sang ngày tiếp theo
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function getPathImage(path) {
    let patharr = path.split("/");
    return "./assets/img/products/" + patharr[patharr.length - 1];
}

let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let products = JSON.parse(localStorage.getItem("products"));
    let idProduct = products[indexCur].id;
    let imgProduct = products[indexCur].img;
    let titleProduct = products[indexCur].title;
    let curProduct = products[indexCur].giagoc;
    let loinhuanProduct = products[indexCur].loinhuan;
    let descProduct = products[indexCur].desc;
    let categoryProduct = products[indexCur].category;
    let imgProductCur = getPathImage(document.querySelector(".upload-image-preview").src)
    let titleProductCur = document.getElementById("ten-mon").value;
    let curProductCur = document.getElementById("gia-moi").value;
    let loinhuanProductCur = document.getElementById("loi-nhuan").value;
    let descProductCur = document.getElementById("mo-ta").value;
    let categoryText = document.getElementById("chon-mon").value;
    
    // Lấy category ID từ category name
    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let categoryId = categoryIdMapping[categoryText] || categoryText;
    
    console.log('🔧 Update Product Debug:');
    console.log('Selected category name:', categoryText);
    console.log('Category ID mapping:', categoryIdMapping);
    console.log('Resolved category ID:', categoryId);

    if (isNaN(curProductCur) || parseFloat(curProductCur) <= 0) {
        toast({ title: "Warning", message: "Giá gốc phải lớn hơn 0!", type: "warning", duration: 3000 });
    } else if (isNaN(loinhuanProductCur) || parseFloat(loinhuanProductCur) <= 0) {
        toast({ title: "Warning", message: "Lợi nhuận phải lớn hơn 0!", type: "warning", duration: 3000 });
    } else if (parseFloat(loinhuanProductCur) > 1) {
        toast({ title: "Warning", message: "Lợi nhuận phải nhỏ hơn hoặc bằng 1!", type: "warning", duration: 3000 });
    } else if (imgProductCur != imgProduct || titleProductCur != titleProduct || curProductCur != curProduct || descProductCur != descProduct || categoryId != categoryProduct || loinhuanProductCur != loinhuanProduct) {
        let rawPrice = parseInt(curProductCur) + parseInt(curProductCur) * parseFloat(loinhuanProductCur);
        // làm tròn đến 1000 gần nhất
        let finalPrice = Math.round(rawPrice / 1000) * 1000;

        let productadd = {
            id: idProduct,
            title: titleProductCur,
            img: imgProductCur,
            category: categoryId,
            giagoc: parseInt(curProductCur),
            loinhuan: parseFloat(loinhuanProductCur),
            price: finalPrice,
            desc: descProductCur,
            status: 1,
            soluong: products[indexCur].soluong || 0  // Giữ nguyên số lượng tồn kho cũ
        };
        products.splice(indexCur, 1);
        products.splice(indexCur, 0, productadd);
        localStorage.setItem("products", JSON.stringify(products));
        toast({ title: "Success", message: "Sửa sản phẩm thành công!", type: "success", duration: 3000, });
        setDefaultValue();
        document.querySelector(".add-product").classList.remove("open");
        showProduct();
    } else {
        toast({ title: "Warning", message: "Sản phẩm của bạn không thay đổi!", type: "warning", duration: 3000, });
    }
});

let btnAddProductIn = document.getElementById("add-product-button");
btnAddProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let imgProduct = getPathImage(document.querySelector(".upload-image-preview").src)
    let tenMon = document.getElementById("ten-mon").value;
    let price = document.getElementById("gia-moi").value;
    let loinhuan = document.getElementById("loi-nhuan").value;
    let moTa = document.getElementById("mo-ta").value;
    let categoryText = document.getElementById("chon-mon").value;
    
    // Lấy category ID từ category name
    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let categoryId = categoryIdMapping[categoryText] || categoryText;
    
    console.log('➕ Add Product Debug:');
    console.log('Selected category name:', categoryText);
    console.log('Category ID mapping:', categoryIdMapping);
    console.log('Resolved category ID:', categoryId);
    
    if(tenMon == "" || price == "" || moTa == "" || loinhuan == "") {
        toast({ title: "Chú ý", message: "Vui lòng nhập đầy đủ thông tin món!", type: "warning", duration: 3000, });
    } else {
        if(isNaN(price)) {
            toast({ title: "Chú ý", message: "Giá phải ở dạng số!", type: "warning", duration: 3000, });
        } else if (isNaN(loinhuan)) {
            toast({ title: "Chú ý", message: "Lợi nhuận phải ở dạng số!", type: "warning", duration: 3000, });
        } else {
            let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
            
            // ép kiểu số
            let giagoc = parseInt(price);
            let loiNhuan = parseFloat(loinhuan);

            // tính giá bán và làm tròn đến 1000 gần nhất
            let rawPrice = giagoc + giagoc * loiNhuan;
            let finalPrice = Math.round(rawPrice / 1000) * 1000;

            let product = {
                id: createId(products),
                title: tenMon,
                img: imgProduct,
                category: categoryId,
                giagoc: parseInt(price),
                loinhuan: parseFloat(loinhuan),
                price: finalPrice,
                desc: moTa,
                status:1
            };
            products.unshift(product);
            localStorage.setItem("products", JSON.stringify(products));
            showProduct();
            document.querySelector(".add-product").classList.remove("open");
            toast({ title: "Success", message: "Thêm sản phẩm thành công!", type: "success", duration: 3000});
            setDefaultValue();
        }
    }
});

// Ngăn form submit khi nhấn Enter
document.querySelector(".add-product-form").addEventListener("submit", (e) => {
    e.preventDefault();
});

document.querySelector(".modal-close.product-form").addEventListener("click",() => {
    setDefaultValue();
})

function setDefaultValue() {
    document.querySelector(".upload-image-preview").src = "./assets/img/blank-image.png";
    document.getElementById("ten-mon").value = "";
    document.getElementById("gia-moi").value = "";
    document.getElementById("mo-ta").value = "";
    document.getElementById("chon-mon").value = "Món mì";
}

// Open Popup Modal
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
});

// Close Popup Modal
let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
    closePopup[i].onclick = () => {
        modalPopup[i].classList.remove("open");
    };
}

// Event listener cho nút kiểm tra theo ngày
document.getElementById("check-daily-btn").addEventListener("click", () => {
    let productId = document.querySelector(".check-product").getAttribute("data-product-id");
    checkProductDaily(productId);
    document.querySelector(".check-product").classList.remove("open");
});

// Event listener cho nút tạo báo cáo
document.getElementById("generate-daily-report").addEventListener("click", generateDailyReport);

// On change Image
function uploadImage(el) {
    let path = "./assets/img/products/" + el.value.split("\\")[2];
    document.querySelector(".upload-image-preview").setAttribute("src", path);
}

// Đổi trạng thái đơn hàng
function changeStatus(id, el) {
    let orders = JSON.parse(localStorage.getItem("order"));
    let order = orders.find((item) => {
        return item.id == id;
    });
    order.trangthai = 1;
    el.classList.remove("btn-chuaxuly");
    el.classList.add("btn-daxuly");
    el.innerHTML = "Đã xử lý";
    localStorage.setItem("order", JSON.stringify(orders));
    findOrder(orders);
    showProduct();
}

// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}

// Show order
function showOrder(arr) {
    let orderHtml = "";
    if(arr.length == 0) {
        orderHtml = `<td colspan="6">Không có dữ liệu</td>`
    } else {
        arr.forEach((item) => {
            let status = '';
            if (item.trangthai == 0) {
                status = `<span class="status-no-complete">Chưa xử lý</span>`;
            } else if (item.trangthai == 1) {
                status = `<span class="status-complete">Đã hoàn thành</span>`;
            } else if (item.trangthai == 2) {
                status = `<span class="status-cancelled">Đã hủy</span>`;
            }
            let date = formatDate(item.thoigiandat);
            orderHtml += `
            <tr>
            <td>${item.id}</td>
            <td>${item.khachhang}</td>
            <td>${date}</td>
            <td>${vnd(item.tongtien)}</td>                               
            <td>${status}</td>
            <td class="control">
            <button class="btn-detail" id="" onclick="detailOrder('${item.id}')"><i class="fa-regular fa-eye"></i> Chi tiết</button>
            </td>
            </tr>      
            `;
        });
    }
    document.getElementById("showOrder").innerHTML = orderHtml;
}

let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
window.onload = showOrder(orders);

// Get Order Details
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("orderDetails") ?
        JSON.parse(localStorage.getItem("orderDetails")) : [];
    let ctDon = [];
    orderDetails.forEach((item) => {
        if (item.madon == madon) {
            ctDon.push(item);
        }
    });
    return ctDon;
}

// Show Order Detail
function detailOrder(id) {
    document.querySelector(".modal.detail-order").classList.add("open");
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("products")) : [];
    // Lấy hóa đơn 
    let order = orders.find((item) => item.id == id);
    // Lấy chi tiết hóa đơn
    let ctDon = getOrderDetails(id);
    let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;

    ctDon.forEach((item) => {
        let detaiSP = products.find(product => product.id == item.id);
        spHtml += `<div class="order-product">
            <div class="order-product-left">
                <img src="${detaiSP.img}" alt="">
                <div class="order-product-info">
                    <h4>${detaiSP.title}</h4>
                    <p class="order-product-note"><i class="fas fa-pen"></i> ${item.note || 'Không có ghi chú'}</p>
                    <p class="order-product-quantity">SL: ${item.soluong}<p>
                </div>
            </div>
            <div class="order-product-right">
                <div class="order-product-price">
                    <span class="order-product-current-price">${vnd(item.price)}</span>
                </div>                         
            </div>
        </div>`;
    });
    spHtml += `</div></div>`;
    spHtml += `<div class="modal-detail-right">
        <ul class="detail-order-group">
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fas fa-calendar-days"></i> Ngày đặt hàng</span>
                <span class="detail-order-item-right">${formatDate(order.thoigiandat)}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fas fa-truck"></i> Hình thức giao</span>
                <span class="detail-order-item-right">${order.hinhthucgiao}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-solid fa-person"></i> Người nhận</span>
            <span class="detail-order-item-right">${order.tenguoinhan}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fas fa-phone"></i> Số điện thoại</span>
            <span class="detail-order-item-right">${order.sdtnhan}</span>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fas fa-clock"></i> Thời gian giao</span>
                <p class="detail-order-item-b">${(order.thoigiangiao == "" ? "" : (order.thoigiangiao + " - ")) + formatDate(order.ngaygiaohang)}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fas fa-location-dot"></i> Địa chỉ nhận</span>
                <p class="detail-order-item-b">${order.diachinhan}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fas fa-note-sticky"></i> Ghi chú</span>
                <p class="detail-order-item-b">${order.ghichu || 'Không có ghi chú'}</p>
            </li>
        </ul>
    </div>`;
    document.querySelector(".modal-detail-order").innerHTML = spHtml;

    // Tạo HTML cho 2 nút Hoàn thành và Hủy
    let buttonsHtml = '';
    if (order.trangthai == 0) {
        // Đơn hàng chưa xử lý - hiển thị cả 2 nút
        buttonsHtml = `
            <button class="modal-detail-btn btn-hoan-thanh" onclick="completeOrder('${order.id}')">
                <i class="fas fa-check"></i> Hoàn thành
            </button>
            <button class="modal-detail-btn btn-huy" onclick="cancelOrder('${order.id}')">
                <i class="fas fa-times"></i> Hủy
            </button>
        `;
    } else if (order.trangthai == 1) {
        // Đơn hàng đã hoàn thành
        buttonsHtml = `<span class="order-status-completed"><i class="fas fa-check-circle"></i> Đã hoàn thành</span>`;
    } else if (order.trangthai == 2) {
        // Đơn hàng đã hủy
        buttonsHtml = `<span class="order-status-cancelled"><i class="fas fa-ban"></i> Đã hủy</span>`;
    }
    
    document.querySelector(
        ".modal-detail-bottom"
    ).innerHTML = `<div class="modal-detail-bottom-left">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(order.tongtien)}</span>
        </div>
    </div>
    <div class="modal-detail-bottom-right">
        ${buttonsHtml}
    </div>`;
}

// Hoàn thành đơn hàng
function completeOrder(orderId) {
    if (confirm("Xác nhận hoàn thành đơn hàng này?")) {
        let orders = JSON.parse(localStorage.getItem("order")) || [];
        let order = orders.find(item => item.id == orderId);
        
        if (order) {
            // Đánh dấu đơn hàng hoàn thành
            order.trangthai = 1; // 1 = Đã hoàn thành
            localStorage.setItem("order", JSON.stringify(orders));
            
            // Cập nhật lại hiển thị
            showOrder(orders);
            
            // Đóng modal
            document.querySelector(".modal.detail-order").classList.remove("open");
            
            // Hiển thị thông báo
            toast({ title: "Thành công!", message: "Đơn hàng đã hoàn thành!", type: "success", duration: 3000 });
        }
    }
}

// Hủy đơn hàng
function cancelOrder(orderId) {
    if (confirm("Xác nhận hủy đơn hàng này? Hành động này không thể hoàn tác!")) {
        let orders = JSON.parse(localStorage.getItem("order")) || [];
        let order = orders.find(item => item.id == orderId);
        
        if (order) {
            order.trangthai = 2; // 2 = Đã hủy
            localStorage.setItem("order", JSON.stringify(orders));
            
            // Cập nhật lại hiển thị
            showOrder(orders);
            
            // Đóng modal
            document.querySelector(".modal.detail-order").classList.remove("open");
            
            // Hiển thị thông báo
            toast({ title: "Đã hủy!", message: "Đơn hàng đã được hủy.", type: "info", duration: 3000 });
        }
    }
}

// Find Order
function findOrder() {
    let tinhTrang = parseInt(document.getElementById("tinh-trang").value);
    let ct = document.getElementById("form-search-order").value;
    let timeStart = document.getElementById("time-start").value;
    let timeEnd = document.getElementById("time-end").value;
    
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let result = tinhTrang == 2 ? orders : orders.filter((item) => {
        return item.trangthai == tinhTrang;
    });
    result = ct == "" ? result : result.filter((item) => {
        return (item.khachhang.toLowerCase().includes(ct.toLowerCase()) || item.id.toString().toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.thoigiandat) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.thoigiandat) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.thoigiandat) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.thoigiandat) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }
    showOrder(result);
}

function cancelSearchOrder(){
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    document.getElementById("tinh-trang").value = 2;
    document.getElementById("form-search-order").value = "";
    document.getElementById("time-start").value = "";
    document.getElementById("time-end").value = "";
    showOrder(orders);
}

// Create Object Thong ke
function createObj() {
    let orders = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let products = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : []; 
    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : []; 
    let result = [];
    orderDetails.forEach(item => {
        // Tìm đơn hàng tương ứng
        let order = orders.find(order => order.id == item.madon);
        
        // Chỉ tính các đơn hàng đã hoàn thành (trangthai = 1)
        if (order && order.trangthai === 1) {
            // Lấy thông tin sản phẩm
            let prod = products.find(product => {return product.id == item.id;});
            let obj = new Object();
            obj.id = item.id;
            obj.madon = item.madon;
            obj.price = item.price;
            obj.quantity = item.soluong;
            obj.category = prod.category;
            obj.title = prod.title;
            obj.img = prod.img;
            obj.time = order.thoigiandat;
            result.push(obj);
        }
    });
    return result;
}

// Filter 
function thongKe(mode) {
    let categoryTk = document.getElementById("the-loai-tk").value;
    let ct = document.getElementById("form-search-tk").value;
    let timeStart = document.getElementById("time-start-tk").value;
    let timeEnd = document.getElementById("time-end-tk").value;
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }
    let arrDetail = createObj();
    let result = categoryTk == "Tất cả" ? arrDetail : arrDetail.filter((item) => {
        return item.category == categoryTk;
    });

    result = ct == "" ? result : result.filter((item) => {
        return (item.title.toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.time) > new Date(timeStart).setHours(0, 0, 0) && new Date(item.time) < new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }    
    showThongKe(result,mode);
}

// Show số lượng sp, số lượng đơn bán, doanh thu
function showOverview(arr){
    document.getElementById("quantity-product").innerText = arr.length;
    document.getElementById("quantity-order").innerText = arr.reduce((sum, cur) => (sum + parseInt(cur.quantity)),0);
    document.getElementById("quantity-sale").innerText = vnd(arr.reduce((sum, cur) => (sum + parseInt(cur.doanhthu)),0));
}

function showThongKe(arr,mode) {
    let orderHtml = "";
    let mergeObj = mergeObjThongKe(arr);
    showOverview(mergeObj);

    switch (mode){
        case 0:
            mergeObj = mergeObjThongKe(createObj());
            showOverview(mergeObj);
            document.getElementById("the-loai-tk").value = "Tất cả";
            document.getElementById("form-search-tk").value = "";
            document.getElementById("time-start-tk").value = "";
            document.getElementById("time-end-tk").value = "";
            break;
        case 1:
            mergeObj.sort((a,b) => parseInt(a.quantity) - parseInt(b.quantity))
            break;
        case 2:
            mergeObj.sort((a,b) => parseInt(b.quantity) - parseInt(a.quantity))
            break;
    }
    for(let i = 0; i < mergeObj.length; i++) {
        orderHtml += `
        <tr>
        <td>${i + 1}</td>
        <td><div class="prod-img-title"><img class="prd-img-tbl" src="${mergeObj[i].img}" alt=""><p>${mergeObj[i].title}</p></div></td>
        <td>${mergeObj[i].quantity}</td>
        <td>${vnd(mergeObj[i].doanhthu)}</td>
        <td><button class="btn-detail product-order-detail" data-id="${mergeObj[i].id}"><i class="fa-regular fa-eye"></i> Chi tiết</button></td>
        </tr>      
        `;
    }
    document.getElementById("showTk").innerHTML = orderHtml;
    document.querySelectorAll(".product-order-detail").forEach(item => {
        let idProduct = item.getAttribute("data-id");
        item.addEventListener("click", () => {           
            detailOrderProduct(arr,idProduct);
        })
    })
}

showThongKe(createObj())

function mergeObjThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.id == item.id) // Không tìm thấy gì trả về undefined

        if(check){
            check.quantity = parseInt(check.quantity)  + parseInt(item.quantity);
            check.doanhthu += parseInt(item.price) * parseInt(item.quantity);
        } else {
            const newItem = {...item}
            newItem.doanhthu = newItem.price * newItem.quantity;
            result.push(newItem);
        }
        
    });
    return result;
}

function detailOrderProduct(arr,id) {
    let orderHtml = "";
    arr.forEach(item => {
        if(item.id == id) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${formatDate(item.time)}</td>
            </tr>      
            `;
        }
    });
    document.getElementById("show-product-order-detail").innerHTML = orderHtml
    document.querySelector(".modal.detail-order-product").classList.add("open")
}

// User
let addAccount = document.getElementById('signup-button');
let updateAccount = document.getElementById("btn-update-account")

// Validation real-time cho số điện thoại - chỉ cho phép nhập số và bắt đầu bằng 0
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value;
    // Chỉ giữ lại các chữ số
    value = value.replace(/[^0-9]/g, '');
    
    // Nếu có giá trị và ký tự đầu không phải là 0, bắt buộc phải là 0
    if (value.length > 0 && value[0] !== '0') {
        value = '0' + value;
    }
    
    // Giới hạn tối đa 10 số
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    e.target.value = value;
    
    // Xóa thông báo lỗi khi người dùng đang nhập
    let formMessagePhone = document.querySelector('.form-message-phone');
    if (formMessagePhone) {
        formMessagePhone.innerHTML = '';
    }
});

// Xóa thông báo lỗi khi nhập vào các trường khác
document.getElementById('fullname').addEventListener('input', function() {
    let formMessageName = document.querySelector('.form-message-name');
    if (formMessageName) {
        formMessageName.innerHTML = '';
    }
});

document.getElementById('password').addEventListener('input', function() {
    let formMessagePassword = document.querySelector('.form-message-password');
    if (formMessagePassword) {
        formMessagePassword.innerHTML = '';
    }
});

// Toggle password visibility
document.getElementById('toggle-password-admin').addEventListener('click', function() {
    let passwordInput = document.getElementById('password');
    let icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

document.querySelector(".modal.signup .modal-close").addEventListener("click",() => {
    signUpFormReset();
})

function openCreateAccount() {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "none"
    })
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "block"
    })
}

function signUpFormReset() {
    document.getElementById('fullname').value = ""
    document.getElementById('phone').value = ""
    document.getElementById('password').value = ""
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}

function showPhieuNhapArr(arr) {
    let phieuHtml = '';
    if(arr.length == 0) {
        phieuHtml = `<td colspan="5">Không có dữ liệu</td>`
    } else {
        arr.forEach((phieu, index) => {
            let trangthai = phieu.status == 0 ? `<span class="status-no-complete">Chưa hoàn thành</span>` : `<span class="status-complete">Hoàn thành</span>`;
            let tongGiaNhap = phieu.items.reduce((sum, item) => sum + (item.giaNhap * item.soLuong), 0);
            phieuHtml += ` <tr>
            <td>${phieu.id}</td>
            <td>${formatDate(phieu.ngayNhap)}</td>
            <td>${vnd(tongGiaNhap)}</td>
            <td>${trangthai}</td>
            <td class="control">
                <button class="btn-detail" onclick="detailPhieuNhap('${phieu.id}')"><i class="fa-regular fa-eye"></i> Chi tiết</button>
                ${phieu.status == 0 ? `<button class="btn-edit" onclick="editPhieuNhap('${phieu.id}')"><i class="fa-solid fa-pen"></i> Sửa</button>
                <button class="btn-complete" onclick="completePhieuNhap('${phieu.id}')"><i class="fa-solid fa-check"></i> Hoàn thành</button>` : ''}
            </td>
        </tr>`
        })
    }
    document.getElementById('show-phieu-nhap-hang').innerHTML = phieuHtml;
}

function showUserArr(arr) {
    let accountHtml = '';
    if(arr.length == 0) {
        accountHtml = `<td colspan="5">Không có dữ liệu</td>`
    } else {
        arr.forEach((account, index) => {
            let tinhtrang = account.status == 0 ? `<span class="status-no-complete">Bị khóa</span>` : `<span class="status-complete">Hoạt động</span>`;
            accountHtml += ` <tr>
            <td>${index + 1}</td>
            <td>${account.fullname}</td>
            <td>${account.phone}</td>
            <td>${formatDate(account.join)}</td>
            <td>${tinhtrang}</td>
            <td class="control control-table">
            <button class="btn-edit" id="edit-account" onclick='editAccount(${account.phone})' ><i class="fas fa-pen-to-square"></i></button>
            <button class="btn-delete" id="delete-account" onclick="deleteAcount('${account.phone}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`
        })
    }
    document.getElementById('show-user').innerHTML = accountHtml;
}

function showUser() {
    let tinhTrang = parseInt(document.getElementById("tinh-trang-user").value);
    let ct = document.getElementById("form-search-user").value;
    let timeStart = document.getElementById("time-start-user").value;
    let timeEnd = document.getElementById("time-end-user").value;

    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }

    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    // Lọc ra chỉ hiển thị khách hàng thường (không phải admin)
    accounts = accounts.filter(account => account.userType != 1);
    let result = tinhTrang == 2 ? accounts : accounts.filter(item => item.status == tinhTrang);

    result = ct == "" ? result : result.filter((item) => {
        return (item.fullname.toLowerCase().includes(ct.toLowerCase()) || item.phone.toString().toLowerCase().includes(ct.toLowerCase()));
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.join) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.join) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.join) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.join) <= new Date(timeEnd).setHours(23, 59, 59)
            );
        });
    }

    // Sắp xếp theo thứ tự chữ cái
    result.sort((a, b) => {
        return a.fullname.localeCompare(b.fullname);
    });

    showUserArr(result);
}

function cancelSearchUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    // Lọc ra chỉ hiển thị khách hàng thường (không phải admin)
    accounts = accounts.filter(account => account.userType != 1);
    // Sắp xếp theo thứ tự chữ cái
    accounts.sort((a, b) => {
        return a.fullname.localeCompare(b.fullname);
    });
    showUserArr(accounts);
    document.getElementById("tinh-trang-user").value = 2;
    document.getElementById("form-search-user").value = "";
    document.getElementById("time-start-user").value = "";
    document.getElementById("time-end-user").value = "";
}

window.onload = showUser();

function deleteAcount(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.findIndex(item => item.phone == phone);
    if (confirm("Bạn có chắc muốn xóa?")) {
        accounts.splice(index, 1)
    }
    localStorage.setItem("accounts", JSON.stringify(accounts));
    showUser();
}

let indexFlag;
function editAccount(phone) {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "none"
    })
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "block"
    })
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let index = accounts.findIndex(item => {
        return item.phone == phone
    })
    indexFlag = index;
    document.getElementById("fullname").value = accounts[index].fullname;
    document.getElementById("phone").value = accounts[index].phone;
    document.getElementById("password").value = accounts[index].password;
    document.getElementById("user-role").value = accounts[index].userType;
    document.getElementById("user-status").checked = accounts[index].status == 1 ? true : false;
}

updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let fullname = document.getElementById("fullname").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    
    // Validation
    if(fullname == "" || phone == "" || password == "") {
        toast({ title: 'Chú ý', message: 'Vui lòng nhập đầy đủ thông tin !', type: 'warning', duration: 3000 });
    } else if (!/^0\d{9}$/.test(phone)) {
        toast({ title: 'Lỗi', message: 'Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số !', type: 'error', duration: 3000 });
    } else if (password.length < 6) {
        toast({ title: 'Lỗi', message: 'Mật khẩu phải có ít nhất 6 ký tự !', type: 'error', duration: 3000 });
    } else {
        accounts[indexFlag].fullname = document.getElementById("fullname").value;
        accounts[indexFlag].phone = document.getElementById("phone").value;
        accounts[indexFlag].password = document.getElementById("password").value;
        accounts[indexFlag].userType = parseInt(document.getElementById("user-role").value);
        accounts[indexFlag].status = document.getElementById("user-status").checked ? true : false;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        toast({ title: 'Thành công', message: 'Thay đổi thông tin thành công !', type: 'success', duration: 3000 });
        document.querySelector(".signup").classList.remove("open");
        signUpFormReset();
        showUser();
    }
})

addAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let fullNameUser = document.getElementById('fullname').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
        // Check validate
        let fullNameIP = document.getElementById('fullname');
        let formMessageName = document.querySelector('.form-message-name');
        let formMessagePhone = document.querySelector('.form-message-phone');
        let formMessagePassword = document.querySelector('.form-message-password');
    
        if (fullNameUser.length == 0) {
            formMessageName.innerHTML = 'Vui lòng nhập họ vâ tên';
            fullNameIP.focus();
        } else if (fullNameUser.length < 3) {
            fullNameIP.value = '';
            formMessageName.innerHTML = 'Vui lòng nhập họ và tên lớn hơn 3 kí tự';
        }
        
        if (phoneUser.length == 0) {
            formMessagePhone.innerHTML = 'Vui lòng nhập vào số điện thoại';
        } else if (!/^0\d{9}$/.test(phoneUser)) {
            formMessagePhone.innerHTML = 'Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số';
            document.getElementById('phone').value = '';
        }
        
        if (passwordUser.length == 0) {
            formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu';
        } else if (passwordUser.length < 6) {
            formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu lớn hơn 6 kí tự';
            document.getElementById('password').value = '';
        }

    if (fullNameUser && phoneUser && passwordUser) {
        let user = {
            fullname: fullNameUser,
            phone: phoneUser,
            password: passwordUser,
            address: '',
            email: '',
            status: 1,
            join: new Date(),
            cart: [],
            userType: parseInt(document.getElementById("user-role").value)
        }
        console.log(user);
        let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
        let checkloop = accounts.some(account => {
            return account.phone == user.phone;
        })
        if (!checkloop) {
            accounts.push(user);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            toast({ title: 'Thành công', message: 'Tạo thành công tài khoản !', type: 'success', duration: 3000 });
            document.querySelector(".signup").classList.remove("open");
            showUser();
            signUpFormReset();
        } else {
            toast({ title: 'Cảnh báo !', message: 'Tài khoản đã tồn tại !', type: 'error', duration: 3000 });
        }
    }
})

document.getElementById("logout-acc").addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("currentuser");
    // Redirect to admin-specific login page after logout
    window.location.href = "loginadmin.html";
})

// Thêm chức năng Thể loại (Category)
let btnAddCategory = document.getElementById("btn-add-category");
btnAddCategory.addEventListener("click", () => {
    document.querySelector(".add-category").classList.add("open");
    document.getElementById("new-category-name").value = "";
    document.getElementById("new-category-profit").value = "";
    document.querySelector(".form-message-category").innerHTML = "";
    document.querySelector(".form-message-profit").innerHTML = "";
});

// Đóng modal khi nhấn nút đóng cho phần thêm thể loại
document.querySelector(".modal.add-category .modal-close").addEventListener("click", () => {
    document.querySelector(".add-category").classList.remove("open");
    document.getElementById("new-category-name").value = "";
    document.getElementById("new-category-profit").value = "";
    document.querySelector('.form-message-category').innerHTML = '';
});

// Quản lý danh mục
let btnManageCategory = document.getElementById("btn-manage-category");
btnManageCategory.addEventListener("click", () => {
    showCategoryList();
    document.querySelector(".manage-category").classList.add("open");
});

// Đóng modal quản lý danh mục
document.querySelector(".modal.manage-category .modal-close").addEventListener("click", () => {
    document.querySelector(".manage-category").classList.remove("open");
});

// Biến lưu index của category đang sửa
let editingCategoryIndex = -1;

// Khởi tạo category ID mapping nếu chưa có
function initCategoryIdMapping() {
    if (!localStorage.getItem('categoryIdMapping')) {
        let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || ['Món mì', 'Món trộn', 'Món lẩu', 'Món ăn vặt', 'Nước uống', 'Tokbokki'];
        let mapping = {};
        defaultCategories.forEach((cat, index) => {
            mapping[cat] = `cat${index}`;
        });
        localStorage.setItem('categoryIdMapping', JSON.stringify(mapping));
    }
}

// Lấy ID của category
function getCategoryId(categoryName) {
    let mapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    return mapping[categoryName] || null;
}

// Tạo ID mới cho category
function generateCategoryId(categoryName) {
    let mapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let deletedMapping = JSON.parse(localStorage.getItem('deletedCategoryMapping')) || {};
    
    // Kiểm tra xem tên này có ID cũ đã bị xóa không
    if (deletedMapping[categoryName]) {
        let oldId = deletedMapping[categoryName];
        delete deletedMapping[categoryName];
        localStorage.setItem('deletedCategoryMapping', JSON.stringify(deletedMapping));
        return oldId;
    }
    
    // Tạo ID mới không trùng
    let baseId = 'cat' + Object.keys(mapping).length;
    let counter = 0;
    let newId = baseId;
    
    let existingIds = Object.values(mapping);
    while (existingIds.includes(newId)) {
        counter++;
        newId = baseId + counter;
    }
    
    return newId;
}

// Mở modal sửa category
function openEditCategory(index) {
    editingCategoryIndex = index;
    let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || [];
    let categoryProfitMapping = JSON.parse(localStorage.getItem('categoryProfitMapping')) || {};
    let categoryIdMapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let categoryName = defaultCategories[index];
    let categoryId = categoryIdMapping[categoryName];
    // Lấy hệ số lợi nhuận hiện tại (ưu tiên theo ID, fallback theo tên)
    let profitFactor = categoryProfitMapping[categoryId] !== undefined ? categoryProfitMapping[categoryId] : categoryProfitMapping[categoryName];
    // Hiển thị lợi nhuận dạng % nếu có, nếu chưa có thì để trống
    let profitPercent = profitFactor !== undefined ? Math.round(profitFactor * 100) : '';
    document.getElementById('edit-category-name').value = categoryName;
    document.getElementById('edit-category-profit').value = profitPercent;
    document.querySelector('.form-message-edit-category').innerHTML = '';
    document.querySelector(".edit-category").classList.add("open");
}

// Đóng modal sửa category
document.querySelector(".modal.edit-category .modal-close").addEventListener("click", () => {
    document.querySelector(".edit-category").classList.remove("open");
    document.getElementById('edit-category-name').value = "";
    document.querySelector('.form-message-edit-category').innerHTML = '';
    editingCategoryIndex = -1;
});

// Hiển thị danh sách categories
function showCategoryList() {
    let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || ['Món mì', 'Món trộn', 'Món lẩu', 'Món ăn vặt', 'Nước uống', 'Tokbokki'];
    let categoryListHtml = '';
    
    defaultCategories.forEach((cat, index) => {
        categoryListHtml += `
            <div class="category-item">
                <span class="category-item-name">${cat}</span>
                <div class="category-item-actions">
                    <button class="btn-edit-category" onclick="openEditCategory(${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-delete-category" onclick="deleteCategory('${cat}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`;
    });
    
    document.getElementById('category-list').innerHTML = categoryListHtml;
}

// Xóa category
function deleteCategory(categoryName) {
    if (confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}"?`)) {
        let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || ['Món mì', 'Món trộn', 'Món lẩu', 'Món ăn vặt', 'Nước uống', 'Tokbokki'];
        let mapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
        let deletedMapping = JSON.parse(localStorage.getItem('deletedCategoryMapping')) || {};
        let products = JSON.parse(localStorage.getItem('products')) || [];
        // Lưu ID cũ vào deletedMapping để có thể tái sử dụng
        let oldCatId = mapping[categoryName];
        if (oldCatId) {
            deletedMapping[categoryName] = oldCatId;
            // Chuyển toàn bộ sản phẩm thuộc category này sang trạng thái "Đã xóa"
            products = products.map(prod => {
                if (prod.category === oldCatId) {
                    return { ...prod, category: "Đã xóa", status: 0 };
                }
                return prod;
            });
            delete mapping[categoryName];
            localStorage.setItem('categoryIdMapping', JSON.stringify(mapping));
            localStorage.setItem('deletedCategoryMapping', JSON.stringify(deletedMapping));
            localStorage.setItem('products', JSON.stringify(products));
        }
        // Xóa trực tiếp khỏi defaultCategories
        defaultCategories = defaultCategories.filter(cat => cat !== categoryName);
        localStorage.setItem('defaultCategories', JSON.stringify(defaultCategories));
        updateCategoryDropdowns();
        showCategoryList();
        toast({ title: 'Thành công', message: 'Đã xóa danh mục thành công! Các sản phẩm đã chuyển sang mục Đã xóa.', type: 'success', duration: 3000 });
    }
}

// Thêm thể loại mới
let addCategoryBtn = document.getElementById('add-category-button');
addCategoryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let categoryName = document.getElementById('new-category-name').value.trim();
    let profitValue = document.getElementById('new-category-profit').value.trim();
    let formMessageCategory = document.querySelector('.form-message-category');
    let formMessageProfit = document.querySelector('.form-message-profit');

    let valid = true;
    if (categoryName.length == 0) {
        formMessageCategory.innerHTML = 'Vui lòng nhập tên loại món';
        valid = false;
    } else if (categoryName.length < 3) {
        formMessageCategory.innerHTML = 'Tên loại món phải có ít nhất 3 ký tự';
        valid = false;
    } else {
        formMessageCategory.innerHTML = '';
    }
    if (profitValue === "") {
        formMessageProfit.innerHTML = 'Vui lòng nhập lợi nhuận';
        valid = false;
    } else if (isNaN(profitValue) || Number(profitValue) < 0 || Number(profitValue) > 100) {
        formMessageProfit.innerHTML = 'Lợi nhuận phải từ 0 đến 100';
        valid = false;
    } else {
        formMessageProfit.innerHTML = '';
    }
    if (!valid) return;

    let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || ['Món mì', 'Món trộn', 'Món lẩu', 'Món ăn vặt', 'Nước uống', 'Tokbokki'];
    if (defaultCategories.includes(categoryName)) {
        formMessageCategory.innerHTML = 'Loại món này đã tồn tại';
        return;
    }

    let mapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let newId = generateCategoryId(categoryName);
    mapping[categoryName] = newId;
    localStorage.setItem('categoryIdMapping', JSON.stringify(mapping));

    // Lưu lợi nhuận cho category
    let profitMapping = JSON.parse(localStorage.getItem('categoryProfitMapping')) || {};
    profitMapping[categoryName] = Number(profitValue);
    localStorage.setItem('categoryProfitMapping', JSON.stringify(profitMapping));

    defaultCategories.push(categoryName);
    localStorage.setItem('defaultCategories', JSON.stringify(defaultCategories));
    updateCategoryDropdowns();
    document.querySelector(".add-category").classList.remove("open");
    document.getElementById("new-category-name").value = "";
    document.getElementById("new-category-profit").value = "";
    formMessageCategory.innerHTML = '';
    formMessageProfit.innerHTML = '';
    toast({ title: 'Thành công', message: 'Thêm loại món mới thành công!', type: 'success', duration: 3000 });
});

// Sửa thể loại
let editCategoryBtn = document.getElementById('edit-category-button');
editCategoryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let newCategoryName = document.getElementById('edit-category-name').value.trim();
    let newProfitValue = document.getElementById('edit-category-profit').value.trim();
    let formMessageCategory = document.querySelector('.form-message-edit-category');
    let formMessageProfit = document.querySelector('.form-message-edit-profit');
   
    if (newCategoryName.length == 0) {
        formMessageCategory.innerHTML = 'Vui lòng nhập tên loại món';
        return;
    }
    
    if (newCategoryName.length < 3) {
        formMessageCategory.innerHTML = 'Tên loại món phải có ít nhất 3 ký tự';
        return;
    }
    if (newProfitValue === '' || isNaN(newProfitValue) || Number(newProfitValue) < 0 || Number(newProfitValue) > 100) {
        formMessageProfit.innerHTML = 'Lợi nhuận phải từ 0 đến 100';
        return;
    }
    formMessageProfit.innerHTML = '';

    // Chuyển đổi lợi nhuận từ % sang hệ số
    let profitAsFactor = Number(newProfitValue) / 100;

    // Lấy các thể loại từ defaultCategories
    let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || [];
    
    if (editingCategoryIndex < 0 || editingCategoryIndex >= defaultCategories.length) {
        formMessageCategory.innerHTML = 'Lỗi: Không tìm thấy danh mục';
        return;
    }
    
    let oldCategoryName = defaultCategories[editingCategoryIndex];
    
    // Kiểm tra xem tên mới đã tồn tại chưa (trừ chính nó)
    if (defaultCategories.some((cat, idx) => cat === newCategoryName && idx !== editingCategoryIndex)) {
        formMessageCategory.innerHTML = 'Loại món này đã tồn tại';
        return;
    }
    
    // Cập nhật ID mapping - giữ nguyên ID cũ, chỉ đổi tên
    let mapping = JSON.parse(localStorage.getItem('categoryIdMapping')) || {};
    let oldId = mapping[oldCategoryName];
    if (oldId) {
        delete mapping[oldCategoryName];
        mapping[newCategoryName] = oldId; // Giữ nguyên ID
        localStorage.setItem('categoryIdMapping', JSON.stringify(mapping));
    }
    
    // Cập nhật tên category
    defaultCategories[editingCategoryIndex] = newCategoryName;
    localStorage.setItem('defaultCategories', JSON.stringify(defaultCategories));

    // Cập nhật tên và lợi nhuận trong tất cả sản phẩm
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => {
        if (product.category === oldCategoryName || product.category === oldId) {
            product.category = oldId;
            product.loinhuan = profitAsFactor;
            let giaGoc = parseInt(product.giagoc);
            let rawPrice = giaGoc + giaGoc * profitAsFactor;
            product.price = Math.round(rawPrice / 1000) * 1000;
            product.tienLai = product.price - giaGoc;
        }
    });
    localStorage.setItem('products', JSON.stringify(products));

    // Cập nhật lợi nhuận cho category (nếu có lưu riêng)
    let profitMapping = JSON.parse(localStorage.getItem('categoryProfitMapping')) || {};
    profitMapping[oldId] = profitAsFactor;
    localStorage.setItem('categoryProfitMapping', JSON.stringify(profitMapping));

    // Cập nhật tất cả các dropdown chọn thể loại
    updateCategoryDropdowns();
    showCategoryList();
    
    // Đóng modal và đặt lại form
    document.querySelector(".edit-category").classList.remove("open");
    document.getElementById("edit-category-name").value = "";
    document.getElementById("edit-category-profit").value = "";
    formMessageCategory.innerHTML = '';
    editingCategoryIndex = -1;

    toast({ title: 'Thành công', message: 'Đã cập nhật danh mục và lợi nhuận!', type: 'success', duration: 3000 });

    // Refresh lại danh sách sản phẩm nếu đang ở tab sản phẩm
    showProduct();
});

// Hàm cập nhật tất cả các dropdown chọn thể loại
function updateCategoryDropdowns() {
    let defaultCategories = JSON.parse(localStorage.getItem('defaultCategories')) || ['Món mì', 'Món trộn', 'Món lẩu', 'Món ăn vặt', 'Nước uống', 'Tokbokki'];
    
    // Cập nhật dropdown bộ lọc sản phẩm
    let theLoaiSelect = document.getElementById('the-loai');
    theLoaiSelect.innerHTML = '<option>Tất cả</option>';
    defaultCategories.forEach(cat => {
        theLoaiSelect.innerHTML += `<option>${cat}</option>`;
    });
    theLoaiSelect.innerHTML += '<option>Đã xóa</option>';
    
    // Cập nhật dropdown form sản phẩm
    let chonMonSelect = document.getElementById('chon-mon');
    chonMonSelect.innerHTML = '';
    defaultCategories.forEach(cat => {
        chonMonSelect.innerHTML += `<option>${cat}</option>`;
    });
    
    // Cập nhật dropdown thống kê
    let theLoaiTkSelect = document.getElementById('the-loai-tk');
    if (theLoaiTkSelect) {
        theLoaiTkSelect.innerHTML = '<option>Tất cả</option>';
        defaultCategories.forEach(cat => {
            theLoaiTkSelect.innerHTML += `<option>${cat}</option>`;
        });
    }
}

// Tải các thể loại khi trang được tải
window.addEventListener('load', () => {
    // Dọn dẹp các dữ liệu cũ không cần thiết
    localStorage.removeItem('categories');
    localStorage.removeItem('deletedDefaults');
    
    // Khởi tạo ID mapping nếu chưa có
    initCategoryIdMapping();
    
    updateCategoryDropdowns();
});

// ================== PHIẾU NHẬP HÀNG ==================

// Hiển thị danh sách phiếu nhập hàng
function showPhieuNhap() {
    let tinhTrang = parseInt(document.getElementById("trang-thai-phieu").value);
    let ct = document.getElementById("form-search-phieu").value;
    let timeStart = document.getElementById("time-start-phieu").value;
    let timeEnd = document.getElementById("time-end-phieu").value;
    
    if (timeEnd < timeStart && timeEnd != "" && timeStart != "") {
        alert("Lựa chọn thời gian sai !");
        return;
    }
    
    let phieuNhap = localStorage.getItem("phieuNhap") ? JSON.parse(localStorage.getItem("phieuNhap")) : [];
    let result = tinhTrang == 2 ? phieuNhap : phieuNhap.filter((item) => {
        return item.status == tinhTrang;
    });
    
    result = ct == "" ? result : result.filter((item) => {
        return item.id.toString().toLowerCase().includes(ct.toLowerCase());
    });

    if (timeStart != "" && timeEnd == "") {
        result = result.filter((item) => {
            return new Date(item.ngayNhap) >= new Date(timeStart).setHours(0, 0, 0);
        });
    } else if (timeStart == "" && timeEnd != "") {
        result = result.filter((item) => {
            return new Date(item.ngayNhap) <= new Date(timeEnd).setHours(23, 59, 59);
        });
    } else if (timeStart != "" && timeEnd != "") {
        result = result.filter((item) => {
            return (new Date(item.ngayNhap) >= new Date(timeStart).setHours(0, 0, 0) && new Date(item.ngayNhap) <= new Date(timeEnd).setHours(23, 59, 59));
        });
    }
    
    showPhieuNhapArr(result);
}

// Reset tìm kiếm phiếu nhập
function cancelSearchPhieuNH() {
    document.getElementById("trang-thai-phieu").value = 2;
    document.getElementById("form-search-phieu").value = "";
    document.getElementById("time-start-phieu").value = "";
    document.getElementById("time-end-phieu").value = "";
    showPhieuNhap();
}

// Mở modal thêm phiếu nhập
function openCreatePhieuNhap() {
    document.querySelectorAll(".add-phieu-e").forEach(item => {
        item.style.display = "block";
    });
    document.querySelectorAll(".edit-phieu-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelectorAll(".complete-phieu-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelector(".add-phieu-nhap").classList.add("open");
    document.getElementById("ngay-nhap").value = new Date().toISOString().split('T')[0];
    document.getElementById("phieu-items").innerHTML = "";
    addPhieuItem(); // Thêm ít nhất một item
    updateTongTien();
}

// Cập nhật tổng tiền khi thay đổi
function updateTongTien() {
    let tongTien = 0;
    let itemElements = document.querySelectorAll('.phieu-item');
    
    itemElements.forEach(item => {
        let giaNhap = parseFloat(item.querySelector('.gia-nhap').value) || 0;
        let soLuong = parseInt(item.querySelector('.so-luong').value) || 0;
        tongTien += giaNhap * soLuong;
    });
    
    let tongTienElement = document.getElementById('tong-tien-phieu');
    if (tongTienElement) {
        tongTienElement.textContent = vnd(tongTien);
    }
}

// Thêm item sản phẩm vào phiếu
function addPhieuItem(sanPhamId = "", giaNhap = "", soLuong = "") {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let options = products.map(p => `<option value="${p.id}" ${p.id == sanPhamId ? 'selected' : ''}>${p.title}</option>`).join('');
    let itemHtml = `
        <div class="phieu-item">
            <div class="form-group">
                <label class="form-label">Sản phẩm</label>
                <select class="form-control san-pham-select" onchange="updateGiaNhap(this)">
                    <option value="">Chọn sản phẩm</option>
                    ${options}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Giá nhập</label>
                <input type="number" class="form-control gia-nhap" placeholder="Giá nhập" value="${giaNhap}" min="0">
            </div>
            <div class="form-group">
                <label class="form-label">Số lượng</label>
                <input type="number" class="form-control so-luong" placeholder="Số lượng" value="${soLuong}" min="1">
            </div>
            <button type="button" class="btn-remove-item" onclick="removePhieuItem(this)"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    document.getElementById("phieu-items").insertAdjacentHTML('beforeend', itemHtml);

    // Thêm event listeners cho các input để cập nhật tổng tiền
    let newItem = document.querySelector('.phieu-item:last-child');
    newItem.querySelector('.gia-nhap').addEventListener('input', updateTongTien);
    newItem.querySelector('.so-luong').addEventListener('input', updateTongTien);
}

// Xóa item khỏi phiếu
function removePhieuItem(btn) {
    btn.parentElement.remove();
    updateTongTien();
}

// Cập nhật giá nhập khi chọn sản phẩm
function updateGiaNhap(select) {
    let productId = select.value;
    if (productId) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let product = products.find(p => p.id == productId);
        if (product) {
            select.parentElement.nextElementSibling.querySelector('.gia-nhap').value = product.giagoc;
        }
    }
    updateTongTien();
}

// Thêm phiếu nhập mới
document.getElementById("add-phieu-button").addEventListener("click", async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-control').forEach(input => input.classList.remove('error'));
    
    let ngayNhap = document.getElementById("ngay-nhap").value;
    let ngayNhapInput = document.getElementById("ngay-nhap");
    
    if (!ngayNhap) {
        toast({ title: 'Lỗi', message: 'Vui lòng chọn ngày nhập!', type: 'error', duration: 3000 });
        ngayNhapInput.classList.add('error');
        return;
    }
    
    let items = [];
    let itemElements = document.querySelectorAll('.phieu-item');
    let hasError = false;
    
    itemElements.forEach((item, index) => {
        let sanPhamSelect = item.querySelector('.san-pham-select');
        let giaNhapInput = item.querySelector('.gia-nhap');
        let soLuongInput = item.querySelector('.so-luong');
        
        let sanPhamId = sanPhamSelect.value;
        let giaNhap = parseFloat(giaNhapInput.value);
        let soLuong = parseInt(soLuongInput.value);
        
        // Clear previous errors
        sanPhamSelect.classList.remove('error');
        giaNhapInput.classList.remove('error');
        soLuongInput.classList.remove('error');
        
        if (!sanPhamId) {
            sanPhamSelect.classList.add('error');
            hasError = true;
        }
        if (!giaNhap || giaNhap <= 0) {
            giaNhapInput.classList.add('error');
            hasError = true;
        }
        if (!soLuong || soLuong <= 0) {
            soLuongInput.classList.add('error');
            hasError = true;
        }
        
        if (sanPhamId && giaNhap > 0 && soLuong > 0) {
            items.push({ sanPhamId, giaNhap, soLuong });
        }
    });
    
    if (hasError) {
        toast({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ và chính xác thông tin sản phẩm!', type: 'error', duration: 3000 });
        return;
    }
    
    if (items.length == 0) {
        toast({ title: 'Lỗi', message: 'Vui lòng thêm ít nhất một sản phẩm!', type: 'error', duration: 3000 });
        return;
    }
    
    // Show loading state
    let button = e.target;
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        let phieuNhap = JSON.parse(localStorage.getItem('phieuNhap')) || [];
        let newId = 'PN' + (phieuNhap.length + 1);
        let phieu = {
            id: newId,
            ngayNhap,
            items,
            status: 0 // Chưa hoàn thành
        };
        phieuNhap.push(phieu);
        localStorage.setItem('phieuNhap', JSON.stringify(phieuNhap));
        
        toast({ title: 'Thành công', message: 'Thêm phiếu nhập hàng thành công!', type: 'success', duration: 3000 });
        document.querySelector(".add-phieu-nhap").classList.remove("open");
        showPhieuNhap();
    } catch (error) {
        toast({ title: 'Lỗi', message: 'Có lỗi xảy ra khi thêm phiếu nhập!', type: 'error', duration: 3000 });
    } finally {
        // Remove loading state
        button.classList.remove('loading');
        button.disabled = false;
    }
});

// Sửa phiếu nhập
function editPhieuNhap(id) {
    let phieuNhap = JSON.parse(localStorage.getItem('phieuNhap')) || [];
    let phieu = phieuNhap.find(p => p.id == id);
    if (!phieu || phieu.status == 1) return;
    
    document.querySelectorAll(".add-phieu-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelectorAll(".edit-phieu-e").forEach(item => {
        item.style.display = "block";
    });
    document.querySelectorAll(".complete-phieu-e").forEach(item => {
        item.style.display = "none";
    });
    
    document.querySelector(".add-phieu-nhap").classList.add("open");
    document.getElementById("ngay-nhap").value = phieu.ngayNhap;
    document.getElementById("phieu-items").innerHTML = "";
    
    phieu.items.forEach(item => {
        addPhieuItem(item.sanPhamId, item.giaNhap, item.soLuong);
    });
    
    // Lưu ID phiếu đang sửa
    document.querySelector(".add-phieu-nhap").setAttribute("data-edit-id", id);
    updateTongTien();
}

// Lưu thay đổi phiếu nhập
document.getElementById("update-phieu-button").addEventListener("click", async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-control').forEach(input => input.classList.remove('error'));
    
    let id = document.querySelector(".add-phieu-nhap").getAttribute("data-edit-id");
    let ngayNhap = document.getElementById("ngay-nhap").value;
    let ngayNhapInput = document.getElementById("ngay-nhap");
    
    if (!ngayNhap) {
        toast({ title: 'Lỗi', message: 'Vui lòng chọn ngày nhập!', type: 'error', duration: 3000 });
        ngayNhapInput.classList.add('error');
        return;
    }
    
    let items = [];
    let itemElements = document.querySelectorAll('.phieu-item');
    let hasError = false;
    
    itemElements.forEach((item, index) => {
        let sanPhamSelect = item.querySelector('.san-pham-select');
        let giaNhapInput = item.querySelector('.gia-nhap');
        let soLuongInput = item.querySelector('.so-luong');
        
        let sanPhamId = sanPhamSelect.value;
        let giaNhap = parseFloat(giaNhapInput.value);
        let soLuong = parseInt(soLuongInput.value);
        
        // Clear previous errors
        sanPhamSelect.classList.remove('error');
        giaNhapInput.classList.remove('error');
        soLuongInput.classList.remove('error');
        
        if (!sanPhamId) {
            sanPhamSelect.classList.add('error');
            hasError = true;
        }
        if (!giaNhap || giaNhap <= 0) {
            giaNhapInput.classList.add('error');
            hasError = true;
        }
        if (!soLuong || soLuong <= 0) {
            soLuongInput.classList.add('error');
            hasError = true;
        }
        
        if (sanPhamId && giaNhap > 0 && soLuong > 0) {
            items.push({ sanPhamId, giaNhap, soLuong });
        }
    });
    
    if (hasError) {
        toast({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ và chính xác thông tin sản phẩm!', type: 'error', duration: 3000 });
        return;
    }
    
    if (items.length == 0) {
        toast({ title: 'Lỗi', message: 'Vui lòng thêm ít nhất một sản phẩm!', type: 'error', duration: 3000 });
        return;
    }
    
    // Show loading state
    let button = e.target;
    button.classList.add('loading');
    button.disabled = true;
    
    try {
        let phieuNhap = JSON.parse(localStorage.getItem('phieuNhap')) || [];
        let index = phieuNhap.findIndex(p => p.id == id);
        if (index != -1) {
            phieuNhap[index].ngayNhap = ngayNhap;
            phieuNhap[index].items = items;
            localStorage.setItem('phieuNhap', JSON.stringify(phieuNhap));
            toast({ title: 'Thành công', message: 'Cập nhật phiếu nhập hàng thành công!', type: 'success', duration: 3000 });
            document.querySelector(".add-phieu-nhap").classList.remove("open");
            showPhieuNhap();
        }
    } catch (error) {
        toast({ title: 'Lỗi', message: 'Có lỗi xảy ra khi cập nhật phiếu nhập!', type: 'error', duration: 3000 });
    } finally {
        // Remove loading state
        button.classList.remove('loading');
        button.disabled = false;
    }
});

// Hoàn thành phiếu nhập
function completePhieuNhap(id) {
    if (confirm("Bạn có chắc muốn hoàn thành phiếu nhập này? Sau khi hoàn thành sẽ không thể sửa đổi.")) {
        let phieuNhap = JSON.parse(localStorage.getItem('phieuNhap')) || [];
        let phieu = phieuNhap.find(p => p.id == id);
        if (phieu && phieu.status == 0) {
            // Cập nhật số lượng sản phẩm
            let products = JSON.parse(localStorage.getItem('products')) || [];
            phieu.items.forEach(item => {
                let product = products.find(p => p.id == item.sanPhamId);
                if (product) {
                    product.soluong = (parseInt(product.soluong) || 0) + item.soLuong;
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
            
            phieu.status = 1;
            localStorage.setItem('phieuNhap', JSON.stringify(phieuNhap));
            toast({ title: 'Thành công', message: 'Hoàn thành phiếu nhập hàng!', type: 'success', duration: 3000 });
            showPhieuNhap();
            showProduct();
        }
    }
}

// Xem chi tiết phiếu nhập
function detailPhieuNhap(id) {
    let phieuNhap = JSON.parse(localStorage.getItem('phieuNhap')) || [];
    let phieu = phieuNhap.find(p => p.id == id);
    if (!phieu) return;
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let detailHtml = `<div class="modal-detail-left">
        <div class="order-item-group">
            <h4>Chi tiết phiếu nhập ${phieu.id}</h4>
            <p><strong>Ngày nhập:</strong> ${formatDate(phieu.ngayNhap)}</p>
            <p><strong>Trạng thái:</strong> ${phieu.status == 0 ? 'Chưa hoàn thành' : 'Đã hoàn thành'}</p>
            <h5>Danh sách sản phẩm:</h5>`;
    
    phieu.items.forEach(item => {
        let product = products.find(p => p.id == item.sanPhamId);
        let tenSP = product ? product.title : 'Sản phẩm không tồn tại';
        detailHtml += `<div class="order-product">
            <div class="order-product-left">
                <div class="order-product-info">
                    <h4>${tenSP}</h4>
                    <p class="order-product-note">Giá nhập: ${vnd(item.giaNhap)}</p>
                    <p class="order-product-quantity">Số lượng: ${item.soLuong}</p>
                </div>
            </div>
            <div class="order-product-right">
                <div class="order-product-price">
                    <span class="order-product-current-price">${vnd(item.giaNhap * item.soLuong)}</span>
                </div>
            </div>
        </div>`;
    });
    
    let tongGia = phieu.items.reduce((sum, item) => sum + (item.giaNhap * item.soLuong), 0);
    detailHtml += `</div></div>
        <div class="modal-detail-right">
            <div class="price-total">
                <span class="thanhtien">Tổng giá nhập</span>
                <span class="price">${vnd(tongGia)}</span>
            </div>
        </div>`;
    
    document.querySelector(".modal-detail-order").innerHTML = detailHtml;
    document.querySelector(".modal.detail-order").classList.add("open");
}

// Khởi tạo hiển thị phiếu nhập khi load
window.onload = function() {
    showPhieuNhap();
};

// ================== FEEDBACK ==================

// Hiển thị danh sách feedback
function showFeedback() {
    let status = document.getElementById("feedback-status").value;
    let searchText = document.getElementById("form-search-feedback").value.toLowerCase();
    
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    
    // Filter by status
    if (status !== 'all') {
        feedbacks = feedbacks.filter(fb => fb.status === status);
    }
    
    // Filter by search text
    if (searchText) {
        feedbacks = feedbacks.filter(fb => 
            fb.name.toLowerCase().includes(searchText) || 
            fb.email.toLowerCase().includes(searchText) ||
            fb.message.toLowerCase().includes(searchText)
        );
    }
    
    // Sort by timestamp (newest first)
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    showFeedbackArr(feedbacks);
    updateFeedbackBadge();
}

// Cập nhật badge số lượng feedback chưa đọc
function updateFeedbackBadge() {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    let unreadCount = feedbacks.filter(fb => fb.status === 'unread').length;
    
    let badge = document.getElementById('feedback-unread-badge');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'block'; // Always show badge if there are unread items
        } else {
            badge.style.display = 'none'; // Hide badge if no unread items
        }
    }
}

updateFeedbackBadge();

// Hiển thị mảng feedback
function showFeedbackArr(feedbacks) {
    let feedbackHtml = '';
    if (feedbacks.length == 0) {
        feedbackHtml = `<td colspan="6">Không có feedback nào</td>`;
    } else {
        feedbacks.forEach((fb, index) => {
            let statusClass = fb.status === 'unread' ? 'status-no-complete' : 'status-complete';
            let statusText = fb.status === 'unread' ? 'Chưa đọc' : 'Đã đọc';
            let date = formatDate(fb.timestamp);
            
            feedbackHtml += `
            <tr>
                <td>${index + 1}</td>
                <td>${fb.name}</td>
                <td>${fb.email}<br><small>${fb.phone}</small></td>
                <td>${date}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td class="control">
                    <button class="btn-detail" onclick="viewFeedback('${fb.id}')"><i class="fa-regular fa-eye"></i> Xem</button>
                    ${fb.status === 'unread' ? `<button class="btn-check" onclick="markAsRead('${fb.id}')" title="Đánh dấu đã đọc"><i class="fa-solid fa-check"></i></button>` : ''}
                    <button class="btn-delete" onclick="deleteFeedback('${fb.id}')" title="Xóa feedback"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
    }
    document.getElementById("show-feedback").innerHTML = feedbackHtml;
}

// Xem chi tiết feedback
function viewFeedback(id) {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    let fb = feedbacks.find(f => f.id === id);
    
    if (fb) {
        // Mark as read
        fb.status = 'read';
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        
        // Show modal with feedback details
        let modalHtml = `
            <div class="modal feedback-detail">
                <div class="modal-container">
                    <h3 class="modal-container-title">Chi tiết Feedback</h3>
                    <button class="modal-close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <div class="modal-content">
                        <div class="feedback-info">
                            <div class="info-row">
                                <strong>Họ tên:</strong> ${fb.name}
                            </div>
                            <div class="info-row">
                                <strong>Email:</strong> ${fb.email}
                            </div>
                            <div class="info-row">
                                <strong>Số điện thoại:</strong> ${fb.phone}
                            </div>
                            <div class="info-row">
                                <strong>Thời gian:</strong> ${formatDate(fb.timestamp)}
                            </div>
                            <div class="info-row">
                                <strong>Nội dung:</strong>
                                <div class="message-content">${fb.message}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        let modal = document.querySelector('.feedback-detail');
        modal.classList.add('open');
        
        // Thêm event listener cho nút đóng
        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('open');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Đóng khi click bên ngoài modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('open');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        // Refresh display
        showFeedback();
    }
}

// Đánh dấu đã đọc
function markAsRead(id) {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    let fb = feedbacks.find(f => f.id === id);
    
    if (fb) {
        fb.status = 'read';
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        showFeedback();
        toast({ title: 'Thành công', message: 'Đã đánh dấu đã đọc!', type: 'success', duration: 3000 });
    }
}

// Đánh dấu tất cả là đã đọc
function markAllAsRead() {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    let unreadCount = feedbacks.filter(f => f.status === 'unread').length;
    
    if (unreadCount === 0) {
        toast({ title: 'Thông báo', message: 'Không có feedback chưa đọc!', type: 'info', duration: 3000 });
        return;
    }
    
    if (confirm(`Bạn có chắc muốn đánh dấu tất cả ${unreadCount} feedback chưa đọc là đã đọc?`)) {
        feedbacks.forEach(fb => {
            if (fb.status === 'unread') {
                fb.status = 'read';
            }
        });
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        showFeedback();
        toast({ title: 'Thành công', message: `Đã đánh dấu ${unreadCount} feedback là đã đọc!`, type: 'success', duration: 3000 });
    }
}

// Xóa feedback
function deleteFeedback(id) {
    if (confirm('Bạn có chắc muốn xóa feedback này?')) {
        let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks = feedbacks.filter(f => f.id !== id);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        showFeedback();
        toast({ title: 'Thành công', message: 'Đã xóa feedback!', type: 'success', duration: 3000 });
    }
}

// Reset tìm kiếm feedback
function cancelSearchFeedback() {
    document.getElementById("feedback-status").value = "all";
    document.getElementById("form-search-feedback").value = "";
    showFeedback();
}

// Xuất feedback ra file CSV
function exportFeedback() {
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    
    if (feedbacks.length === 0) {
        toast({ title: 'Thông báo', message: 'Không có feedback để xuất!', type: 'info', duration: 3000 });
        return;
    }
    
    // Sắp xếp theo thời gian mới nhất
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Tạo header CSV
    let csv = '\uFEFF'; // BOM cho UTF-8
    csv += 'STT,Họ tên,Email,Số điện thoại,Thời gian,Trạng thái,Nội dung\n';
    
    // Thêm dữ liệu
    feedbacks.forEach((fb, index) => {
        let statusText = fb.status === 'unread' ? 'Chưa đọc' : 'Đã đọc';
        let date = formatDate(fb.timestamp);
        let message = fb.message.replace(/"/g, '""').replace(/\n/g, ' '); // Escape quotes và newlines
        
        csv += `${index + 1},"${fb.name}","${fb.email}","${fb.phone}","${date}","${statusText}","${message}"\n`;
    });
    
    // Tạo và download file
    let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement('a');
    let url = URL.createObjectURL(blob);
    
    let now = new Date();
    let filename = `feedback_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Thành công', message: 'Đã xuất file feedback!', type: 'success', duration: 3000 });
}

// Khởi tạo hiển thị feedback và badge khi load trang
window.onload = function() {
    showFeedback();
    updateFeedbackBadge();
};

