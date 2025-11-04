const PHIVANCHUYEN = 30000;
let priceFinal = document.getElementById("checkout-cart-price-final");
// Trang thanh toan
function thanhtoanpage(option,product) {
    // Xu ly ngay nhan hang
    
    let today = new Date();
    let day1 = today.getDate();
    today = new Date();
    let day2 = today.getDate(today.setDate(today.getDate() + 1));
    today = new Date();
    let day3 = today.getDate(today.setDate(today.getDate() + 2));
    today = new Date();
    let day4 = today.getDate(today.setDate(today.getDate() + 3));
    today = new Date();
    let day5 = today.getDate(today.setDate(today.getDate() + 4));
    
    const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    // const dayName = days[today.getDay()];
    let dateorderhtml = `<a href="javascript:;" class="pick-date active" data-date="${today}">
        
        <span class="date">${day1}/${today.getMonth() + 1}</span>
        </a>
        <a href="javascript:;" class="pick-date" data-date="${today}">
            
            <span class="date">${day2}/${today.getMonth() + 1}</span>
        </a>

        <a href="javascript:;" class="pick-date" data-date="${today}">
            
            <span class="date">${day3}/${today.getMonth() + 1}</span>
        </a>
        <a href="javascript:;" class="pick-date" data-date="${today}">
            
            <span class="date">${day4}/${today.getMonth() + 1}</span>
        </a>
        <a href="javascript:;" class="pick-date" data-date="${today}">
            
            <span class="date">${day5}/${today.getMonth() + 1}</span>
        </a>
        `
    document.querySelector('.date-order').innerHTML = dateorderhtml;
    let pickdate = document.getElementsByClassName('pick-date')
    for(let i = 0; i < pickdate.length; i++) {
        pickdate[i].onclick = function () {
            document.querySelector(".pick-date.active").classList.remove("active");
            this.classList.add('active');
        }
    }

    let totalBillOrder = document.querySelector('.total-bill-order');
    let totalBillOrderHtml;
    // Xu ly don hang
    switch (option) {
        case 1: // Truong hop thanh toan san pham trong gio
            // Hien thi don hang
            showProductCart();
            // Tinh tien
            totalBillOrderHtml = `<div class="priceFlx">
            <div class="text">
                Tiền hàng 
                <span class="count">${getAmountCart()} món</span>
            </div>
            <div class="price-detail">
                <span id="checkout-cart-total">${vnd(getCartTotal())}</span>
            </div>
        </div>
        <div class="priceFlx chk-ship">
            <div class="text">Phí vận chuyển</div>
            <div class="price-detail chk-free-ship">
                <span>${vnd(PHIVANCHUYEN)}</span>
            </div>
        </div>`;
            // Tong tien
            priceFinal.innerText = vnd(getCartTotal() + PHIVANCHUYEN);
            break;
        case 2: // Truong hop mua ngay
            // Hien thi san pham
            showProductBuyNow(product);
            // Tinh tien
            totalBillOrderHtml = `<div class="priceFlx">
                <div class="text">
                    Tiền hàng 
                    <span class="count">${product.soluong} món</span>
                </div>
                <div class="price-detail">
                    <span id="checkout-cart-total">${vnd(product.soluong * product.price)}</span>
                </div>
            </div>
            <div class="priceFlx chk-ship">
                <div class="text">Phí vận chuyển</div>
                <div class="price-detail chk-free-ship">
                    <span>${vnd(PHIVANCHUYEN)}</span>
                </div>
            </div>`
            // Tong tien
            priceFinal.innerText = vnd((product.soluong * product.price) + PHIVANCHUYEN);
            break;
    }

    // Tinh tien
    totalBillOrder.innerHTML = totalBillOrderHtml;

    // Xu ly hinh thuc giao hang
    let giaotannoi = document.querySelector('#giaotannoi');
    let tudenlay = document.querySelector('#tudenlay');
    let tudenlayGroup = document.querySelector('#tudenlay-group');
    let chkShip = document.querySelectorAll(".chk-ship");
    
    tudenlay.addEventListener('click', () => {
        giaotannoi.classList.remove("active");
        tudenlay.classList.add("active");
        chkShip.forEach(item => {
            item.style.display = "none";
        });
        tudenlayGroup.style.display = "block";
        switch (option) {
            case 1:
                priceFinal.innerText = vnd(getCartTotal());
                break;
            case 2:
                priceFinal.innerText = vnd((product.soluong * product.price));
                break;
        }
    })

    giaotannoi.addEventListener('click', () => {
        tudenlay.classList.remove("active");
        giaotannoi.classList.add("active");
        tudenlayGroup.style.display = "none";
        chkShip.forEach(item => {
            item.style.display = "flex";
        });
        switch (option) {
            case 1:
                priceFinal.innerText = vnd(getCartTotal() + PHIVANCHUYEN);
                break;
            case 2:
                priceFinal.innerText = vnd((product.soluong * product.price) + PHIVANCHUYEN);
                break;
        }
    })

    // Su kien khu nhan nut dat hang
    document.querySelector(".complete-checkout-btn").onclick = () => {
        switch (option) {
            case 1:
                xulyDathang();
                break;
            case 2:
                xulyDathang(product);
                break;
        }
    }
}

// Hien thi hang trong gio
function showProductCart() {
    let currentuser = JSON.parse(localStorage.getItem('currentuser'));
    let listOrder = document.getElementById("list-order-checkout");
    let listOrderHtml = '';
    currentuser.cart.forEach(item => {
        let product = getProduct(item);
        listOrderHtml += `<div class="food-total">
        <div class="count">${product.soluong}x</div>
        <div class="info-food">
            <div class="name-food">${product.title}</div>
        </div>
    </div>`
    })
    listOrder.innerHTML = listOrderHtml;
}

// Hien thi hang mua ngay
function showProductBuyNow(product) {
    let listOrder = document.getElementById("list-order-checkout");
    let listOrderHtml = `<div class="food-total">
        <div class="count">${product.soluong}x</div>
        <div class="info-food">
            <div class="name-food">${product.title}</div>
        </div>
    </div>`;
    listOrder.innerHTML = listOrderHtml;
}

//Open Page Checkout
let nutthanhtoan = document.querySelector('.thanh-toan')
let checkoutpage = document.querySelector('.checkout-page');
nutthanhtoan.addEventListener('click', () => {
    
    checkoutpage.classList.add('active');
    thanhtoanpage(1);
    closeCart();
    body.style.overflow = "hidden"
})

// Đặt hàng ngay
function dathangngay() {
    let productInfo = document.getElementById("product-detail-content");
    let datHangNgayBtn = productInfo.querySelector(".button-dathangngay");
    datHangNgayBtn.onclick = () => {
        if(localStorage.getItem('currentuser')) {
            let productId = datHangNgayBtn.getAttribute("data-product");
            let soluongMua = parseInt(productInfo.querySelector(".buttons_added .input-qty").value);
            let notevalue = productInfo.querySelector("#popup-detail-note").value;
            let ghichu = notevalue == "" ? "Không có ghi chú" : notevalue;
            let products = JSON.parse(localStorage.getItem('products'));
            let a = products.find(item => item.id == productId);
            // a.soluong = parseInt(soluong);
            // a.note = ghichu;
            // checkoutpage.classList.add('active');
            // thanhtoanpage(2,a);
            // closeCart();
            // body.style.overflow = "hidden"
            if (a) {
                // Trừ số lượng tồn kho
                if (a.soluong >= soluongMua) {
                    // a.soluong -= soluongMua;   // cập nhật tồn kho
                    a.note = ghichu;

                    // Lưu lại vào localStorage
                    // localStorage.setItem('products', JSON.stringify(products));

                    a.soluong = soluongMua;
                    // Tiếp tục xử lý thanh toán
                    checkoutpage.classList.add('active');
                    thanhtoanpage(2, a);
                    closeCart();
                    body.style.overflow = "hidden";
                } else {
                    toast({ title: 'Error', message: 'Sản phẩm không đủ số lượng tồn kho!', type: 'error', duration: 3000 });
                }
            }
        } else {
            toast({ title: 'Warning', message: 'Chưa đăng nhập tài khoản !', type: 'warning', duration: 3000 });
        }
    }
}

// Close Page Checkout
function closecheckout() {
    checkoutpage.classList.remove('active');
    body.style.overflow = "auto"
}

// Thong tin cac don hang da mua - Xu ly khi nhan nut dat hang
function xulyDathang(product) {
    let diachinhan = "";
    let hinhthucgiao = "";
    let thoigiangiao = "";
    let giaotannoi = document.querySelector("#giaotannoi");
    let tudenlay = document.querySelector("#tudenlay");
    let giaongay = document.querySelector("#giaongay");
    let giaovaogio = document.querySelector("#deliverytime");
    let currentUser = JSON.parse(localStorage.getItem('currentuser'));
    // Hinh thuc giao & Dia chi nhan hang
    if(giaotannoi.classList.contains("active")) {
        diachinhan = document.querySelector("#diachinhan").value;
        hinhthucgiao = giaotannoi.innerText;
    }
    if(tudenlay.classList.contains("active")){
        // let chinhanh1 = document.querySelector('#ward option[value="91 Lý Tự Trọng, Phường Bến Thành"]').selected;
        // let chinhanh2 = document.querySelector('#ward option[value="01 Công trường Công xã Paris, Phường Bến Nghé"]').selected;
        // let chinhanh3 = document.querySelector('#ward option[value="273 An Dương Vương, Phường Chợ Quán"]').selected;
        // let chinhanh4 = document.querySelector('#ward option[value="25 Đ. Học Lạc, Phường 14"]').selected;
        // let chinhanh5 = document.querySelector('#ward option[value="1 Tràng Tiền, Phan Chu Trinh"]').selected;
        // let chinhanh6 = document.querySelector('#ward option[value="57B Đinh Tiên Hoàng, Hàng Bạc"]').selected;
        // let chinhanh7 = document.querySelector('#ward option[value="157 Đội Cấn"]').selected;
        // let chinhanh8 = document.querySelector('#ward option[value="43 Đ. Nguyễn Chí Thanh, Giảng Võ"]').selected;
        // if(chinhanh1) {
        //     diachinhan = "91 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP Hồ Chí Minh";
        // }
        // if(chinhanh2) {
        //     diachinhan = "01 Công trường Công xã Paris, Phường Bến Nghé, Quận 1, TP Hồ Chí Minh";
        // }
        // if(chinhanh3) {
        //     diachinhan = "273 An Dương Vương, Phường Chợ Quán, Quận 5, TP Hồ Chí Minh";
        // }
        // if(chinhanh4) {
        //     diachinhan = "25 Đ. Học Lạc, Phường 14, Quận 5, TP Hồ Chí Minh";
        // }
        // if(chinhanh5) {
        //     diachinhan = "1 Tràng Tiền, Phan Chu Trinh, Hoàn Kiếm, Hà Nội";
        // }
        // if(chinhanh6) {
        //     diachinhan = "57B Đinh Tiên Hoàng, Hàng Bạc, Hoàn Kiếm, Hà Nội";
        // }
        // if(chinhanh7) {
        //     diachinhan = "157 Đội Cấn, Ba Đình, Hà Nội";
        // }
        // if(chinhanh8) {
        //     diachinhan = "43 Đ. Nguyễn Chí Thanh, Giảng Võ, Ba Đình Hà Nội";
        // }
        const wardSelect = document.getElementById("ward");
        const districtSelect = document.getElementById("district")
        const citySelect = document.getElementById("city")
        let cityName = "";
        if (citySelect.value === "hn") {
            cityName = "Hà Nội";
        } else {
            cityName = "Hồ Chí Minh";
        }
        diachinhan = wardSelect.value + ", " + districtSelect.value + ", " + cityName;
        hinhthucgiao = tudenlay.innerText;
    }

    // Thoi gian nhan hang
    if(giaongay.checked) {
        thoigiangiao = "Giao ngay khi xong";
    }

    if(giaovaogio.checked) {
        thoigiangiao = document.querySelector(".choise-time").value;
    }

    let orderDetails = localStorage.getItem("orderDetails") ? JSON.parse(localStorage.getItem("orderDetails")) : [];
    let order = localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : [];
    let madon = createId(order);
    let tongtien = 0;
    if(product == undefined) {
        currentUser.cart.forEach(item => {
            item.madon = madon;
            item.price = getpriceProduct(item.id);
            tongtien += item.price * item.soluong;
            orderDetails.push(item);
        });
    } else {
        product.madon = madon;
        product.price = getpriceProduct(product.id);
        tongtien += product.price * product.soluong;
        orderDetails.push(product);
    }   
    
    let tennguoinhan = document.querySelector("#tennguoinhan").value;
    let sdtnhan = document.querySelector("#sdtnhan").value

    console.log({ tennguoinhan, sdtnhan, diachinhan, thoigiangiao });

    if(tennguoinhan == "" || sdtnhan == "" || diachinhan == "") {
        toast({ title: 'Chú ý', message: 'Vui lòng nhập đầy đủ thông tin !', type: 'warning', duration: 4000 });
    } else {
        let donhang = {
            id: madon,
            khachhang: currentUser.phone,
            hinhthucgiao: hinhthucgiao,
            ngaygiaohang: document.querySelector(".pick-date.active").getAttribute("data-date"),
            thoigiangiao: thoigiangiao,
            ghichu: document.querySelector(".note-order").value,
            tenguoinhan: tennguoinhan,
            sdtnhan: sdtnhan,
            diachinhan: diachinhan,
            thoigiandat: new Date(),
            tongtien:tongtien,
            trangthai: 0
        }
    
        order.unshift(donhang);
        if(product == null) {
            currentUser.cart.length = 0;
        }
    
        localStorage.setItem("order",JSON.stringify(order));
        localStorage.setItem("currentuser",JSON.stringify(currentUser));
        localStorage.setItem("orderDetails",JSON.stringify(orderDetails));
        toast({ title: 'Thành công', message: 'Đặt hàng thành công !', type: 'success', duration: 1000 });
        setTimeout((e)=>{
            window.location = "index.html";
        },2000);  
    }
}

function getpriceProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    let sp = products.find(item => {
        return item.id == id;
    })
    return sp.price;
}